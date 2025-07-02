import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  validateDimensionWeightCompleteness, 
  generateWeightSuggestions,
  adjustWeightsProportionallyJS,
  distributeEqualWeightsJS
} from '../utils/weightUtils';
import * as adminService from '../services/adminService';

/**
 * Custom hook for managing weight validation status
 * Provides real-time weight validation with caching and error handling
 */
export const useWeightValidation = (year = null) => {
  const [validationStatus, setValidationStatus] = useState({
    isValid: false,
    isLoading: true,
    error: null,
    details: null,
    lastChecked: null
  });

  // Cache to avoid repeated API calls
  const cacheRef = useRef(new Map());
  const CACHE_DURATION = 30000; // 30 seconds

  /**
   * Check if cached data is still valid
   */
  const isCacheValid = useCallback((cacheKey) => {
    const cached = cacheRef.current.get(cacheKey);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < CACHE_DURATION;
  }, []);

  /**
   * Validate weights for a specific year
   */
  const validateWeights = useCallback(async (targetYear) => {
    if (!targetYear) return;

    const cacheKey = `year_${targetYear}`;
    
    // Check cache first
    if (isCacheValid(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      setValidationStatus(cached.data);
      return cached.data;
    }

    setValidationStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await adminService.validateYearWeights(targetYear);
      
      const status = {
        isValid: response.canGenerateRanking || false,
        isLoading: false,
        error: null,
        details: {
          year: targetYear,
          dimensionStatus: response.validationResults || {},
          indicatorStatus: response.indicatorValidation || {},
          message: response.message || '',
          invalidDimensions: response.invalidDimensions || [],
          summary: response.summary || {}
        },
        lastChecked: new Date().toISOString()
      };

      // Cache the result
      cacheRef.current.set(cacheKey, {
        data: status,
        timestamp: Date.now()
      });

      setValidationStatus(status);
      return status;

    } catch (error) {
      console.error('Weight validation error:', error);
      
      const errorStatus = {
        isValid: false,
        isLoading: false,
        error: error.message || 'Failed to validate weights',
        details: null,
        lastChecked: new Date().toISOString()
      };

      setValidationStatus(errorStatus);
      return errorStatus;
    }
  }, [isCacheValid]);

  /**
   * Validate specific dimension weights
   */
  const validateDimension = useCallback(async (dimensionId, targetYear) => {
    if (!dimensionId || !targetYear) return null;

    const cacheKey = `dimension_${dimensionId}_${targetYear}`;
    
    // Check cache first
    if (isCacheValid(cacheKey)) {
      return cacheRef.current.get(cacheKey).data;
    }

    try {
      const response = await adminService.validateDimensionWeights(dimensionId, targetYear);
      
      const result = {
        isValid: response.isValid || false,
        details: response,
        timestamp: Date.now()
      };

      // Cache the result
      cacheRef.current.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;

    } catch (error) {
      console.error('Dimension validation error:', error);
      return {
        isValid: false,
        error: error.message || 'Failed to validate dimension weights',
        timestamp: Date.now()
      };
    }
  }, [isCacheValid]);

  /**
   * Force refresh validation (bypass cache)
   */
  const refreshValidation = useCallback(async (targetYear = year) => {
    if (!targetYear) return;

    const cacheKey = `year_${targetYear}`;
    cacheRef.current.delete(cacheKey);
    
    return await validateWeights(targetYear);
  }, [year, validateWeights]);

  /**
   * Clear all cached validation data
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  /**
   * Get validation status for multiple years
   */
  const validateMultipleYears = useCallback(async (years) => {
    const results = await Promise.allSettled(
      years.map(y => validateWeights(y))
    );

    return results.map((result, index) => ({
      year: years[index],
      status: result.status === 'fulfilled' ? result.value : { isValid: false, error: result.reason }
    }));
  }, [validateWeights]);

  // Auto-validate when year changes
  useEffect(() => {
    if (year) {
      validateWeights(year);
    } else {
      setValidationStatus({
        isValid: false,
        isLoading: false,
        error: null,
        details: null,
        lastChecked: null
      });
    }
  }, [year, validateWeights]);

  // Helper functions for common checks
  const isValidForYear = useCallback((targetYear) => {
    if (!targetYear) return false;
    
    const cacheKey = `year_${targetYear}`;
    const cached = cacheRef.current.get(cacheKey);
    
    if (cached && isCacheValid(cacheKey)) {
      return cached.data.isValid;
    }
    
    // If not cached and not the current year, return unknown status
    return targetYear === year ? validationStatus.isValid : null;
  }, [year, validationStatus.isValid, isCacheValid]);

  const getValidationMessage = useCallback((targetYear = year) => {
    if (!targetYear) return '';
    
    const cacheKey = `year_${targetYear}`;
    const cached = cacheRef.current.get(cacheKey);
    
    if (cached && isCacheValid(cacheKey)) {
      return cached.data.details?.message || '';
    }
    
    return validationStatus.details?.message || '';
  }, [year, validationStatus.details, isCacheValid]);

  const getInvalidDimensions = useCallback((targetYear = year) => {
    if (!targetYear) return [];
    
    const cacheKey = `year_${targetYear}`;
    const cached = cacheRef.current.get(cacheKey);
    
    let dimensionStatus;
    if (cached && isCacheValid(cacheKey)) {
      dimensionStatus = cached.data.details?.dimensionStatus || {};
    } else {
      dimensionStatus = validationStatus.details?.dimensionStatus || {};
    }
    
    // Extract dimension names where validation failed
    const invalidDimensions = [];
    Object.entries(dimensionStatus).forEach(([dimensionId, validationResult]) => {
      if (validationResult && !validationResult.isValid) {
        // Try to get dimension name, fallback to ID if not available
        const dimensionName = validationResult.dimensionName || `Dimension ${dimensionId}`;
        invalidDimensions.push(dimensionName);
      }
    });
    
    return invalidDimensions;
  }, [year, validationStatus.details, isCacheValid]);

  return {
    // Current status
    validationStatus,
    isValid: validationStatus.isValid,
    isLoading: validationStatus.isLoading,
    error: validationStatus.error,
    details: validationStatus.details,
    lastChecked: validationStatus.lastChecked,

    // Actions
    validateWeights,
    validateDimension,
    refreshValidation,
    clearCache,
    validateMultipleYears,

    // Helper functions
    isValidForYear,
    getValidationMessage,
    getInvalidDimensions,

    // Cache info
    cacheSize: cacheRef.current.size
  };
};

export default useWeightValidation; 