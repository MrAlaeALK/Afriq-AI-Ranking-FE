import { jwtDecode } from 'jwt-decode';

/**
 * JWT utility functions for token management
 */
export class JwtUtils {

  static TOKEN_KEY = 'adminToken';
  static REFRESH_TOKEN_KEY = 'adminRefreshToken'; // For potential use

  /**
   * Decode JWT token and return payload
   * @param {string} token - JWT token to decode
   * @returns {object|null} Decoded token payload or null if invalid
   */
  static decodeToken(token) {
    try {
      if (!token) return null;
      return jwtDecode(token);
    } catch (error) {
      console.warn('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token to check
   * @returns {boolean} True if expired, false otherwise
   */
  static isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      // Get current time in seconds
      const currentTime = Date.now() / 1000;

      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Validates token format, expiration, and type
   * @param {string} token - JWT token
   * @returns {boolean} True if valid and not expired ACCESS token
   */
  static isValidToken(token) {
    if (!token) return false;
    
    const payload = this.decodeToken(token);
    if (!payload) return false;
    
    // Check if it's an access token
    if (payload.type !== 'ACCESS') return false;
    
    // Check expiration
    return !this.isTokenExpired(token);
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {Date|null} Expiration date or null
   */
  static getTokenExpiration(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    // in milliseconds
    return new Date(decoded.exp * 1000);
  }

  /**
   * Check if token expires within specified minutes
   * @param {string} token - JWT token
   * @param {number} minutes - Minutes to check ahead
   * @returns {boolean} True if token expires soon
   */
  static isTokenExpiringSoon(token, minutes = 5) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      const expirationTime = decoded.exp;
      const timeUntilExpiry = expirationTime - currentTime;
      
      // Compare the remaining time with the threshold (minutes converted to seconds)
      return timeUntilExpiry <= (minutes * 60);
    } catch (error) {
      return true;
    }
  }

  /**
   * Get user info from token
   * @param {string} token - JWT token
   * @returns {object|null} User information or null
   */
  static getUserFromToken(token) {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;
    
    // Extract and map user information
    return {
      username: decoded.sub, 
      roles: decoded.roles || [],
      tokenType: decoded.type,
      issuedAt: decoded.iat,
      expiresAt: decoded.exp,
      jwtId: decoded.jti
    };
  }

  /**
   * Store token in localStorage
   * @param {string} token - JWT token to store
   */
  static setToken(token) {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Get valid token from localStorage
   * @returns {string|null} Valid token or null
   */
  static getToken() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return this.isValidToken(token) ? token : null;
    } catch (error) {
      console.warn('Failed to retrieve token from storage:', error);
      return null;
    }
  }

  /**
   * Remove token from localStorage
   */
  static removeToken() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to clear token from storage:', error);
    }
  }

  /**
   * Store refresh token (for potential future use)
   * @param {string} refreshToken - Refresh token to store
   */
  static setRefreshToken(refreshToken) {
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Get refresh token (for potential future use)
   * @returns {string|null} Refresh token or null
   */
  static getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user has specific role
   * @param {string} token - JWT token
   * @param {string} role - Role to check (e.g., 'ADMIN')
   * @returns {boolean} True if user has role
   */
  static hasRole(token, role) {
    const user = this.getUserFromToken(token);
    if (!user || !user.roles) return false;
    
    // Check for both 'ROLE_ADMIN' and 'ADMIN' formats
    const rolesToCheck = [role, `ROLE_${role}`];
    return user.roles.some(userRole => 
      rolesToCheck.includes(userRole) || 
      (Array.isArray(userRole) && userRole.some(r => rolesToCheck.includes(r.authority || r)))
    );
  }

  /**
   * Check if user is admin
   * @param {string} token - JWT token
   * @returns {boolean} True if user is admin
   */
  static isAdmin(token) {
    return this.hasRole(token, 'ADMIN');
  }

  /**
   * Get token time remaining in minutes
   * @param {string} token - JWT token
   * @returns {number} Minutes remaining or 0 if expired
   */
  static getTimeRemaining(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return 0;
      
      const currentTime = Date.now() / 1000;
      const timeRemaining = decoded.exp - currentTime;
      
      // Ensure time remaining is not negative
      return Math.max(0, Math.floor(timeRemaining / 60));
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns {boolean} True if authenticated with valid token
   */
  static isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Get current authenticated user info
   * @returns {object|null} User info or null if not authenticated
   */
  static getCurrentUser() {
    const token = this.getToken();
    return token ? this.getUserFromToken(token) : null;
  }

  /**
   * Gets time until token expiration in seconds
   * @param {string} token - JWT token
   * @returns {number} Seconds until expiration, or 0 if expired/invalid
   */
  static getTokenTimeToExpiry(token) {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return 0;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpiry = payload.exp - currentTime;
    return Math.max(0, timeToExpiry);
  }
}