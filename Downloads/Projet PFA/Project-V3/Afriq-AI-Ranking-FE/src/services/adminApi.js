/**
 * Admin API Service - Business logic for admin operations
 * =======================================================
 * 
 * Provides high-level API methods for admin functionality using the robust apiClient.
 * This service layer handles business logic while delegating HTTP operations to apiClient.
 */

import apiClient from './apiClient.js';

class AdminApiService {
    constructor() {
        // Listen for token expiration events from apiClientZZZZZYY
        if (typeof window !== 'undefined') {
            window.addEventListener('auth:tokenExpired', this.handleTokenExpired.bind(this));
        }
    }

    /**
     * Handle token expiration events
     * @param {CustomEvent} event - Token expiration event
     */
    handleTokenExpired(event) {
        console.warn('Token expired, user needs to re-authenticate', event.detail);
    }

    // ========== AUTHENTICATION ==========

    /**
     * Authenticate admin user
     */
    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', credentials);

            // The apiClient automatically unwraps ResponseWrapper, so response is the JWT token
            if (response) {
                apiClient.setAuthToken(response);
                return response;
            }
            
            throw new Error('No token received from server');
        } catch (error) {
            // apiClient provides normalized error format
            throw new Error(error.message || 'Login failed');
        }
    }

    /**
     * Register new admin user
     */
    async register(adminData) {
        try {
            const response = await apiClient.post('/auth/register', adminData);

            if (response) {
                apiClient.setAuthToken(response);
                return response;
            }
            
            throw new Error('No token received from server');
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    /**
     * Request password reset email
     */
    async forgotPassword(email) {
        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            return response; // Success message
        } catch (error) {
            throw new Error(error.message || 'Failed to send password reset email');
        }
    }

    /**
     * Verify reset token validity
     */
    async verifyResetToken(token) {
        try {
            const response = await apiClient.get(`/auth/verify-reset-token/${token}`);
            return response; // Token validation result with user info
        } catch (error) {
            throw new Error(error.message || 'Invalid or expired reset token');
            }
    }

    /**
     * Reset password using token
     */
    async resetPassword(resetData) {
        try {
            const response = await apiClient.post('/auth/reset-password', resetData);
            return response; // Success message
        } catch (error) {
            throw new Error(error.message || 'Failed to reset password');
        }
    }

    /**
     * Logout admin user
     */
  logout() {
        apiClient.clearAuthToken();
        
        // Emit custom logout event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:logout', {
                detail: { timestamp: new Date().toISOString() }
            }));
        }
    }


    isAuthenticated() {
        return apiClient.isAuthenticated();
    }

    getCurrentUser() {
        return apiClient.getCurrentUser();
  }
    
    // ========== COUNTRIES (View only) ==========


  async getCountries() {
    try {
            return await apiClient.get('/countries');
    } catch (error) {
            throw new Error(error.message || 'Failed to fetch countries');
    }
  }

  async getCountryById(id) {
    try {
            return await apiClient.get(`/countries/${id}`);
    } catch (error) {
            throw new Error(error.message || 'Failed to fetch country by ID');
    }
  }

    async getCountriesByRegion(region) {
        try {
            return await apiClient.get(`/countries/region/${region}`);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch countries by region');
        }
    }

    async getCountryByCode(code) {
        try {
            return await apiClient.get(`/countries/code/${code}`);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch country by code');
        }
    }

    // ========== DIMENSIONS CRUD ==========

    async getDimensions() {
        try {
            return await apiClient.get('/dimension/dimensions');
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch dimensions');
        }
    }

    async getYearDimensions(year) {
        try {
            return await apiClient.post('/dimension/year_dimensions', { year });
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch year dimensions');
        }
    }

    async addDimension(dimensionData) {
        try {
            return await apiClient.post('/admin/dashboard/dimensions', dimensionData);
        } catch (error) {
            throw new Error(error.message || 'Failed to add dimension');
        }
    }

    // ========== INDICATORS CRUD ==========

    async getIndicators() {
        try {
            return await apiClient.get('/indicators');
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch indicators');
        }
    }

    async getIndicatorById(id) {
        try {
            return await apiClient.get(`/indicators/${id}`);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch indicator by ID');
        }
    }

    async addIndicator(indicatorData) {
        try {
            return await apiClient.post('/admin/dashboard/indicators', indicatorData);
        } catch (error) {
            throw new Error(error.message || 'Failed to add indicator');
        }
    }
    
    // ========== SCORES MANAGEMENT ==========

    async addScore(scoreData) {
        try {
            return await apiClient.post('/admin/dashboard/scores', scoreData);
        } catch (error) {
            throw new Error(error.message || 'Failed to add score');
        }
    }

    async updateScore(scoreData) {
        try {
            return await apiClient.put('/admin/dashboard/scores', scoreData);
        } catch (error) {
            throw new Error(error.message || 'Failed to update score');
        }
    }

    async getScoresByYear(year) {
        try {
            return await apiClient.post('/dimension_scores/get_scores_by_year', { year });
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch scores by year');
        }
    }

    // ========== WEIGHTS MANAGEMENT ==========

    async addIndicatorWeight(weightData) {
        try {
            return await apiClient.post('/admin/dashboard/indicator_weights', weightData);
        } catch (error) {
            throw new Error(error.message || 'Failed to add indicator weight');
        }
    }

    async addDimensionWeight(weightData) {
        try {
            return await apiClient.post('/admin/dashboard/dimension_weights', weightData);
        } catch (error) {
            throw new Error(error.message || 'Failed to add dimension weight');
        }
    }

    // ========== RANKINGS & FINAL SCORES ==========

  async generateFinalScores(data) {
    try {
            return await apiClient.post('/admin/dashboard/final_scores', data);
    } catch (error) {
            throw new Error(error.message || 'Failed to generate final scores');
    }
  }

  async generateRankings(data) {
    try {
            return await apiClient.post('/admin/dashboard/rankings', data);
    } catch (error) {
            throw new Error(error.message || 'Failed to generate rankings');
    }
  }
  
    // ========== FILE UPLOADS ==========

    async uploadSpreadsheet(file, year, onProgress = null) {
        try {
    const formData = new FormData();
    formData.append('file', file);
            formData.append('year', year);

            return await apiClient.post('/admin/dashboard/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
                onUploadProgress: onProgress
        });
    } catch (error) {
            throw new Error(error.message || 'Failed to upload spreadsheet');
    }
   }

    // ========== DOCUMENT MANAGEMENT ==========

  async getUploadedDocuments() {
    try {
            return await apiClient.get('/admin/dashboard/documents');
    } catch (error) {
            throw new Error(error.message || 'Failed to fetch uploaded documents');
    }
  }

    // ========== RANKINGS RETRIEVAL ==========

  async getRankingsByYear(year) {
    try {
            return await apiClient.post('/rankings/year', { year });
    } catch (error) {
            throw new Error(error.message || 'Failed to fetch rankings by year');
    }
  }
}

export default new AdminApiService();