/**
 * Public API Service
 * ==================
 * 
 * Handles public API calls that don't require authentication.
 */

import apiClient from './apiClient.js';

/**
 * Provides methods for accessing public data without authentication
 */
class PublicApiService {
    
    // ========== RANKINGS ==========
    
    async getRankingByYear(year) {
        try {
            return await apiClient.post('/rank/ranking', { year });
        } catch (error) {
            throw new Error(error.message || `Failed to fetch rankings for year ${year}`);
        }
    }
    
    // ========== SCORES ==========
    
    async getScoresByYear(year) {
        try {
            return await apiClient.post('/dimension_scores/get_scores_by_year', { year });
        } catch (error) {
            throw new Error(error.message || `Failed to fetch scores for year ${year}`);
        }
    }
    
    // ========== DIMENSIONS ==========
    
    async getAllDimensions() {
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
            throw new Error(error.message || `Failed to fetch dimensions for year ${year}`);
        }
    }
}

const publicApiService = new PublicApiService();

export default publicApiService;

export const getRankingByYear = (year) => publicApiService.getRankingByYear(year);
export const getScoresByYear = (year) => publicApiService.getScoresByYear(year);
export const getAllDimensions = () => publicApiService.getAllDimensions();
export const getYearDimensions = (year) => publicApiService.getYearDimensions(year); 