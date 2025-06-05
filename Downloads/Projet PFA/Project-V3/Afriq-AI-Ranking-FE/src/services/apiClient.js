/**
 * API Client 
 * ==========
 * 
 *  Ensure interacting with the backend, centralizing common concerns like authentication,
 *  base configuration, and error handling.
 */

import axios from 'axios';
import { JwtUtils } from '../utils/jwtUtils.js';

/**
 * API Configuration
 */
const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    timeout: 10000, // wait a max of 10 seconds for a response
};

/**
 * Simple API Client Class
 */
class ApiClient {
    constructor() {
        this.axiosInstance = null;
        this.init();
    }

    /**
     * Initialize the API client
     */
    init() {
        this.axiosInstance = axios.create({
            baseURL: API_CONFIG.baseURL,
            timeout: API_CONFIG.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        this.setupRequestInterceptor();
        this.setupResponseInterceptor();
    }

    /**
     * Setup request interceptor for authentication
     */
    setupRequestInterceptor() {
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Attach authentication token if available
                const token = JwtUtils.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(this.normalizeError(error));
            }
        );
    }

    /**
     * Setup response interceptor for error handling
     */
    setupResponseInterceptor() {
        this.axiosInstance.interceptors.response.use(
            (response) => {
                // Return unwrapped data if using ResponseWrapper format
                if (response.data && response.data.status === 'success') {
                    return {
                        ...response,
                        data: response.data.data, // Unwrap the actual data
                        originalResponse: response.data // Keep original for debugging
                    };
                }
                return response;
            },
            async (error) => {
                // Handle authentication errors (Bad credentials error)
                if (error.response?.status === 401) {
                    this.handleAuthenticationError(error);
                }

                // Normalize and reject error
                return Promise.reject(this.normalizeError(error));
            }
        );
    }

    /**
     * Handle authentication errors (401 responses)
     * @param {Error} error - The authentication error
     */
    handleAuthenticationError(error) {
        // Clear invalid token
        JwtUtils.removeToken();
        
        // Emit custom event for components to listen to
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:tokenExpired', {
                detail: {
                    error: error.response?.data,
                    timestamp: new Date().toISOString()
                }
            }));
        }
    }

    /**
     * Normalize error objects to consistent format
     * @param {Error} error - The error to normalize
     * @returns {Object} Normalized error object
     */
    normalizeError(error) {
        // Network error (no response)
        if (!error.response) {
            return {
                type: 'NETWORK_ERROR',
                message: 'Network error occurred. Please check your connection.',
                originalError: error,
                isNetworkError: true
            };
        }

        // Server error with standard format (Error with server comunication)
        const response = error.response;
        const errorData = response.data;

        return {
            type: 'API_ERROR',
            status: response.status,
            message: errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
            errors: errorData?.errors || {},
            originalError: error,
            isApiError: true
        };
    }

    // ========== HTTP METHODS ==========

    /**
     * GET request
     * @param {string} url - Request URL
     * @param {Object} config - Additional Axios config
     * @returns {Promise} Request promise
     */
    async get(url, config = {}) {
        const response = await this.axiosInstance.get(url, config);
        return response.data;
    }

    /**
     * POST request
     * @param {string} url - Request URL
     * @param {*} data - Request data
     * @param {Object} config - Additional Axios config
     * @returns {Promise} Request promise
     */
    async post(url, data = {}, config = {}) {
        const response = await this.axiosInstance.post(url, data, config);
        return response.data;
    }

    /**
     * PUT request
     * @param {string} url - Request URL
     * @param {*} data - Request data
     * @param {Object} config - Additional Axios config
     * @returns {Promise} Request promise
     */
    async put(url, data = {}, config = {}) {
        const response = await this.axiosInstance.put(url, data, config);
        return response.data;
    }

    /**
     * DELETE request
     * @param {string} url - Request URL
     * @param {Object} config - Additional Axios config
     * @returns {Promise} Request promise
     */
    async delete(url, config = {}) {
        const response = await this.axiosInstance.delete(url, config);
        return response.data;
    }

    /**
     * PATCH request
     * @param {string} url - Request URL
     * @param {*} data - Request data
     * @param {Object} config - Additional Axios config
     * @returns {Promise} Request promise
     */
    async patch(url, data = {}, config = {}) {
        const response = await this.axiosInstance.patch(url, data, config);
        return response.data;
    }

    /**
     * Upload file
     * @param {string} url - Upload URL
     * @param {FormData} formData - Form data with file
     * @param {Function} onProgress - Progress callback (optional)
     * @returns {Promise} Upload promise
     */
    async upload(url, formData, onProgress = null) {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onProgress ? (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted, progressEvent);
            } : undefined
        };

        const response = await this.axiosInstance.post(url, formData, config);
        return response.data;
    }

    // ========== AUTHENTICATION METHODS ==========

    /**
     * Set authentication token
     * @param {string} token - JWT token
     */
    setAuthToken(token) {
        if (JwtUtils.isValidToken(token)) {
            JwtUtils.setToken(token);
        }
    }

    /**
     * Clear authentication token
     */
    clearAuthToken() {
        JwtUtils.removeToken();
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return JwtUtils.isAuthenticated();
    }

    /**
     * Get current user information
     * @returns {Object|null} User info or null
     */
    getCurrentUser() {
        return JwtUtils.getCurrentUser();
    }

    // ========== UTILITY METHODS ==========

    /**
     * Get API base URL
     * @returns {string} Base URL
     */
    getBaseURL() {
        return API_CONFIG.baseURL;
    }

    /**
     * Update API configuration
     * @param {Object} newConfig - New configuration
     */
    updateConfig(newConfig) {
        Object.assign(API_CONFIG, newConfig);
        this.axiosInstance.defaults.baseURL = API_CONFIG.baseURL;
        this.axiosInstance.defaults.timeout = API_CONFIG.timeout;
    }
}

// Create and export singleton instance
const apiClient = new ApiClient();

export default apiClient; 