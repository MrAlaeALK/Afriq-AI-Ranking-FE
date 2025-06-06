/**
 * Authentication Service
 * ======================
 * 
 * Business logic layer for authentication operations.
 * Provides clean interface between UI components and API calls.
 * 
 */

import adminApi from './adminApi.js';
import { JwtUtils } from '../utils/jwtUtils.js';

/**
 * Custom Error Classes for Authentication
 */
export class AuthError extends Error {
    constructor(message, type = 'AUTH_ERROR', field = null) {
        super(message);
        this.name = 'AuthError';
        this.type = type;
        this.field = field;
        this.timestamp = new Date().toISOString();
    }
}

export class ValidationError extends AuthError {
    constructor(message, field = null) {
        super(message, 'VALIDATION_ERROR', field);
        this.name = 'ValidationError';
    }
}

export class NetworkError extends AuthError {
    constructor(message = 'Network connection failed') {
        super(message, 'NETWORK_ERROR');
        this.name = 'NetworkError';
    }
}

/**
 * Authentication Service Class
 */
class AuthService {
    constructor() {
        this.tokenWarningTimer = null;
        this.tokenCheckInterval = null;
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialize the authentication service
     */
    init() {
        if (this.isInitialized) return;

        // Set up token expiration monitoring
        this.setupTokenMonitoring();
        
        // Listen for token expiration events from apiClient
        if (typeof window !== 'undefined') {
            window.addEventListener('auth:tokenExpired', this.handleTokenExpired.bind(this));
        }

        this.isInitialized = true;
    }

    // ========== CORE AUTHENTICATION OPERATIONS ==========

    /**
     * Authenticate user with credentials
     */
    async login(credentials) {
        try {
            // Validate input
            this.validateLoginCredentials(credentials);

            // Call API
            const token = await adminApi.login(credentials);
            
            if (!token) {
                throw new AuthError('No authentication token received', 'LOGIN_FAILED');
            }

            // Get user info from token
            const user = JwtUtils.getCurrentUser();
            
            if (!user) {
                throw new AuthError('Invalid authentication token', 'TOKEN_INVALID');
            }

            // Set up token monitoring
            this.setupTokenMonitoring();

            // Emit login event
            this.emitEvent('auth:login', { user, timestamp: new Date().toISOString() });

            return user;

        } catch (error) {
            // Transform API errors to AuthErrors
            throw this.transformError(error);
        }
    }

    /**
     * Register new user
     */
    async register(userData) {
        try {
            // Validate input
            this.validateRegistrationData(userData);

            // Call API (auto-login after registration)
            const token = await adminApi.register(userData);
            
            if (!token) {
                throw new AuthError('Registration succeeded but login failed', 'REGISTRATION_LOGIN_FAILED');
            }

            // Get user info from token
            const user = JwtUtils.getCurrentUser();
            
            if (!user) {
                throw new AuthError('Invalid authentication token after registration', 'TOKEN_INVALID');
            }

            // Set up token monitoring
            this.setupTokenMonitoring();

            // Emit registration and login events
            this.emitEvent('auth:register', { user, timestamp: new Date().toISOString() });
            this.emitEvent('auth:login', { user, timestamp: new Date().toISOString() });

            return user;

        } catch (error) {
            throw this.transformError(error);
        }
    }

    /**
     * Logout current user
     */
    logout(options = {}) {
        const { redirectToLogin = false, reason = 'manual' } = options;

        // Get user info before clearing token
        const user = this.getCurrentUser();

        // Clear tokens and stop monitoring
        adminApi.logout();
        this.stopTokenMonitoring();

        // Emit logout event
        this.emitEvent('auth:logout', { 
            user, 
            reason, 
            timestamp: new Date().toISOString() 
        });

        // Optional redirect
        if (redirectToLogin) {
            this.redirectToLogin();
        }
    }

    // ========== PASSWORD RESET OPERATIONS ==========

    /**
     * Request password reset email
     */
    async forgotPassword(email) {
        try {
            // Validate email format
            this.validateEmail(email);

            // Call API
            const response = await adminApi.forgotPassword(email);
            
            // Emit event
            this.emitEvent('auth:forgotPassword', { 
                email, 
                timestamp: new Date().toISOString() 
            });

            return response;

        } catch (error) {
            throw this.transformError(error);
        }
    }

    /**
     * Verify reset token validity
     */
    async verifyResetToken(token) {
        try {
            if (!token || typeof token !== 'string' || token.trim().length === 0) {
                throw new ValidationError('Reset token is required', 'token');
            }

            // Call API
            const response = await adminApi.verifyResetToken(token);
            
            return response;

        } catch (error) {
            throw this.transformError(error);
        }
    }

    /**
     * Reset password using token
     */
    async resetPassword(resetData) {
        try {
            // Validate reset data
            this.validateResetPasswordData(resetData);

            // Call API
            const response = await adminApi.resetPassword(resetData);
            
            // Emit event
            this.emitEvent('auth:passwordReset', { 
                timestamp: new Date().toISOString() 
            });

            return response;

        } catch (error) {
            throw this.transformError(error);
        }
    }

    // ========== STATE QUERIES ==========

    /**
     * Check if user is currently authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return adminApi.isAuthenticated();
    }

    /**
     * Get current authenticated user
     * @returns {Object|null} User information or null
     */
    getCurrentUser() {
        return adminApi.getCurrentUser();
    }

    /**
     * Get time remaining before token expires
     * @returns {number} Milliseconds until expiration, 0 if no token
     */
    getTokenTimeRemaining() {
        const user = this.getCurrentUser();
        if (!user?.exp) return 0;
        
        return Math.max(0, (user.exp * 1000) - Date.now());
    }

    /**
     * Check if token will expire soon (within 5 minutes)
     * @returns {boolean} True if token expires soon
     */
    isTokenExpiringSoon() {
        const timeRemaining = this.getTokenTimeRemaining();
        return timeRemaining > 0 && timeRemaining <= 5 * 60 * 1000; // 5 minutes
    }

    // ========== TOKEN MONITORING ==========

    /**
     * Set up automatic token expiration monitoring
     */
    setupTokenMonitoring() {
        if (!this.isAuthenticated()) return;

        // Clear existing timers
        this.stopTokenMonitoring();

        // Check token status every minute
        this.tokenCheckInterval = setInterval(() => {
            this.checkTokenStatus();
        }, 60000);

        // Schedule warning if token expires soon
        this.scheduleTokenWarning();
    }

    /**
     * Stop token monitoring
     */
    stopTokenMonitoring() {
        if (this.tokenWarningTimer) {
            clearTimeout(this.tokenWarningTimer);
            this.tokenWarningTimer = null;
        }

        if (this.tokenCheckInterval) {
            clearInterval(this.tokenCheckInterval);
            this.tokenCheckInterval = null;
        }
    }

    /**
     * Check current token status and handle expiration
     */
    checkTokenStatus() {
        if (!this.isAuthenticated()) {
            this.stopTokenMonitoring();
            return;
        }

        const timeRemaining = this.getTokenTimeRemaining();
        
        if (timeRemaining <= 0) {
            // Token has expired
            this.handleTokenExpired();
        } else if (this.isTokenExpiringSoon()) {
            // Token expires soon, show warning
            this.showTokenWarning();
        }
    }

    /**
     * Schedule token expiration warning
     */
    scheduleTokenWarning() {
        const timeRemaining = this.getTokenTimeRemaining();
        const warningTime = 5 * 60 * 1000; // 5 minutes

        if (timeRemaining > warningTime) {
            // Schedule warning for 5 minutes before expiration
            this.tokenWarningTimer = setTimeout(() => {
                this.showTokenWarning();
            }, timeRemaining - warningTime);
        } else if (timeRemaining > 0) {
            // Show warning immediately if less than 5 minutes remaining
            this.showTokenWarning();
        }
    }

    /**
     * Show token expiration warning
     */
    showTokenWarning() {
        const timeRemaining = Math.ceil(this.getTokenTimeRemaining() / 60000); // Minutes
        
        this.emitEvent('auth:tokenWarning', {
            timeRemaining,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Handle token expiration
     */
    handleTokenExpired() {
        this.logout({ 
            reason: 'tokenExpired',
            redirectToLogin: true 
        });
    }

    // ========== VALIDATION HELPERS ==========

    /**
     * Validate login credentials
     */
    validateLoginCredentials(credentials) {
        if (!credentials) {
            throw new ValidationError('Login credentials are required');
        }

        const { usernameOrEmail, password } = credentials;

        if (!usernameOrEmail || usernameOrEmail.trim().length === 0) {
            throw new ValidationError('Username or email is required', 'usernameOrEmail');
        }

        if (!password || password.length === 0) {
            throw new ValidationError('Password is required', 'password');
        }

        if (password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters', 'password');
        }
    }

    /**
     * Validate registration data
     */
    validateRegistrationData(userData) {
        if (!userData) {
            throw new ValidationError('Registration data is required');
        }

        const { firstName, lastName, username, email, password, passwordConfirmation } = userData;

        // Required field validation
        if (!firstName || firstName.trim().length === 0) {
            throw new ValidationError('First name is required', 'firstName');
        }

        if (!lastName || lastName.trim().length === 0) {
            throw new ValidationError('Last name is required', 'lastName');
        }

        if (!username || username.trim().length === 0) {
            throw new ValidationError('Username is required', 'username');
        }

        if (!email || email.trim().length === 0) {
            throw new ValidationError('Email is required', 'email');
        }

        if (!password || password.length === 0) {
            throw new ValidationError('Password is required', 'password');
        }

        if (!passwordConfirmation || passwordConfirmation.length === 0) {
            throw new ValidationError('Password confirmation is required', 'passwordConfirmation');
        }

        // Format validation
        if (username.length < 3 || username.length > 20) {
            throw new ValidationError('Username must be between 3 and 20 characters', 'username');
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            throw new ValidationError('Username can only contain letters, numbers, and underscores', 'username');
        }

        // Email validation
        this.validateEmail(email);

        // Password validation - must match backend requirements exactly
        if (password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters', 'password');
        }

        if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*]).*$/.test(password)) {
            throw new ValidationError(
                'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character (@#$%^&+=!*)', 
                'password'
            );
        }

        // Password confirmation
        if (password !== passwordConfirmation) {
            throw new ValidationError('Passwords do not match', 'passwordConfirmation');
        }
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        if (!email || email.trim().length === 0) {
            throw new ValidationError('Email is required', 'email');
        }

        const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError('Please enter a valid email address', 'email');
        }
    }

    /**
     * Validate reset password data
     */
    validateResetPasswordData(resetData) {
        if (!resetData) {
            throw new ValidationError('Reset password data is required');
        }

        const { token, newPassword, confirmPassword } = resetData;

        if (!token || typeof token !== 'string' || token.trim().length === 0) {
            throw new ValidationError('Reset token is required', 'token');
        }

        if (!newPassword || newPassword.length === 0) {
            throw new ValidationError('New password is required', 'newPassword');
        }

        if (!confirmPassword || confirmPassword.length === 0) {
            throw new ValidationError('Password confirmation is required', 'confirmPassword');
        }

        // Password validation - must match backend requirements exactly
        if (newPassword.length < 8) {
            throw new ValidationError('Password must be at least 8 characters', 'newPassword');
        }

        if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*]).*$/.test(newPassword)) {
            throw new ValidationError(
                'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character (@#$%^&+=!*)', 
                'newPassword'
            );
        }

        // Password confirmation
        if (newPassword !== confirmPassword) {
            throw new ValidationError('Passwords do not match', 'confirmPassword');
        }
    }

    // ========== ERROR HANDLING ==========

    /**
     * Transform API errors to AuthErrors
     */
    transformError(error) {
        // If already an AuthError, return as-is
        if (error instanceof AuthError) {
            return error;
        }

        // Network errors
        if (!error.response) {
            return new NetworkError(error.message || 'Network connection failed');
        }

        // API errors
        const { status, data } = error.response;
        const message = data?.message || error.message || 'An unexpected error occurred';

        switch (status) {
            case 400:
                return new ValidationError(message);
            case 401:
                return new AuthError(message, 'UNAUTHORIZED');
            case 403:
                return new AuthError(message, 'FORBIDDEN');
            case 404:
                return new AuthError(message, 'NOT_FOUND');
            case 429:
                return new AuthError(message, 'RATE_LIMITED');
            case 500:
                return new AuthError('Server error. Please try again later.', 'SERVER_ERROR');
            default:
                return new AuthError(message, 'API_ERROR');
        }
    }

    // ========== UTILITY METHODS ==========

    /**
     * Redirect to login page
     */
    redirectToLogin(returnPath = null) {
        if (typeof window === 'undefined') return;

        const currentPath = returnPath || window.location.pathname + window.location.search;
        const loginUrl = `/login?returnTo=${encodeURIComponent(currentPath)}`;
        
        window.location.href = loginUrl;
    }

    /**
     * Get return path from URL parameters
     */
    getReturnPath() {
        if (typeof window === 'undefined') return '/';
        
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('returnTo') || '/';
    }

    /**
     * Emit custom events
     */
    emitEvent(eventName, detail) {
        if (typeof window !== 'undefined' && window.CustomEvent) {
            window.dispatchEvent(new CustomEvent(eventName, { detail }));
        }
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.stopTokenMonitoring();
        
        if (typeof window !== 'undefined') {
            window.removeEventListener('auth:tokenExpired', this.handleTokenExpired.bind(this));
        }
        
        this.isInitialized = false;
    }
}

// Export singleton instance
export default new AuthService();