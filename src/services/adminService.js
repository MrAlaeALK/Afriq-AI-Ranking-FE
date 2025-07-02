import { get, post, put, patch, del, delWithBody, upload } from "../utils/apiRequest";

export const getAllScores = () =>
  get("/admin/dashboard/scores", "Fetching scores failed");

export const editScore = (formData) =>
  post("/admin/dashboard/edit-score", formData, "Editing score failed");

export const deleteScore = (id) =>
  del(`/admin/dashboard/delete-score/${id}`, "Deleting score failed");

export const addScore = (formData) =>
  post("/admin/dashboard/add-score", formData, "Adding score failed");

export const getYearIndicators = (year) =>
  post("/admin/dashboard/year_indicators", { year }, "Getting year indicators failed");

export const getPossibleScoreYears = () =>
  get("/admin/dashboard/indicators-years", "Getting years linked to indicators failed");

export const getAllCountries = () =>
  get("/admin/dashboard/all_countries", "Getting all countries failed");

export const uploadFile = (formData) =>
  upload("/admin/dashboard/upload-score-file", formData, "Uploading file failed");

export const getFetchedScores = (formData) =>
  upload("/admin/dashboard/validate_fetched_columns", formData, "Validating fetched columns failed");

export const validateAllFetchedScores = (dto) =>
  post("/admin/dashboard/validate_scores", dto, "Persisting scores failed");

export const getYearRanking = (year) =>
  post("/admin/dashboard/year-ranking", { year }, "Getting year ranking failed");

export const getRankingYears = () =>
  get("/admin/dashboard/ranking-years", "Getting ranking years failed");

export const generateRanking = (year) =>
  post("/admin/dashboard/generate-ranking", { year }, "Generating ranking failed");

export const getAllRanks = () =>
  get("/admin/dashboard/all-rankings", "Getting all rankings failed");

export const deleteRanking = (year) =>
  del(`/admin/dashboard/delete-ranking/${year}`, "Deleting ranking failed");

export const getDimensionScoresByYear = (year) =>
  post("/admin/dashboard/dimension-scores", { year }, "Getting dimension scores failed");

export const getScoresByYear = (year) => post("/dimension_scores/get_scores_by_year", {year}, "fetching scores failed");

// Indicator endpoints
export const getAllIndicators = () =>
  get("/admin/dashboard/indicators", "Fetching indicators failed");

export const getIndicatorById = (id) =>
  get(`/admin/dashboard/indicators/${id}`, "Fetching indicator failed");

export const createIndicator = (formData) =>
  post("/admin/dashboard/indicators", formData, "Creating indicator failed");

export const updateIndicator = (id, formData) =>
  put(`/admin/dashboard/indicators/${id}`, formData, "Updating indicator failed");

export const deleteIndicator = (id) =>
  del(`/admin/dashboard/indicators/${id}`, "Deleting indicator failed");

export const getIndicatorWeightByYear = (id, year) =>
  get(`/admin/dashboard/indicators/${id}/weight/${year}`, "Fetching indicator weight failed");

export const getIndicatorsByDimension = (dimensionId) =>
  get(`/admin/dashboard/indicators/dimension/${dimensionId}`, "Fetching indicators by dimension failed");

export const bulkDeleteIndicators = (indicatorIds) =>
  delWithBody("/admin/dashboard/indicators/bulk", indicatorIds, "Bulk delete failed");

// Weight normalization endpoints
export const normalizeWeights = (dimensionId, year) =>
  post(`/admin/dashboard/indicators/normalize/${dimensionId}/${year}`, {}, "Weight normalization failed");

export const normalizeAllWeights = () =>
  post("/admin/dashboard/indicators/normalize-all", {}, "All weights normalization failed");

// Dimension weight normalization endpoints
export const normalizeDimensionWeights = (year) =>
  post(`/dimension/normalize-weights/${year}`, {}, "Dimension weight normalization failed");

export const normalizeAllDimensionWeights = () =>
  post("/dimension/normalize-all-weights", {}, "All dimension weights normalization failed");

// Dimension endpoints for indicators
export const getAllDimensions = () =>
  get("/dimension/dimensions", "Fetching dimensions failed");

export const getIndicatorsForUI = async () => {
  try {
    const indicatorsResponse = await getAllIndicators();
    // indicatorsResponse IS the data array (handleApiResponse already extracted it)
    const indicators = indicatorsResponse || [];
    
    if (!Array.isArray(indicators)) {
      console.warn("Indicators is not an array:", indicators);
      return [];
    }
    
    // Map backend normalization values to frontend values  
    const mapBackendNormalizationType = (backendValue) => {
      const reverseMapping = {
        "MinMax Normalisation": "minmax",
        "Z-Score Normalisation": "zscore",
        "Robust Scaling": "robust", 
        "Quantile Transformation": "quantile"
      }
      return reverseMapping[backendValue] || "minmax"
    }
    
    // Create one entry per year per indicator
    const transformedIndicators = [];
    
    indicators.forEach(indicator => {
      // Get all years this indicator has weights for
      const years = indicator.availableYears || [];
      
      years.forEach(year => {
        const weight = indicator.weightsByYear?.[year] || 0;
        const effectiveWeight = indicator.effectiveWeightsByYear?.[year] || 0;
        const dimensionWeight = indicator.dimensionWeightsByYear?.[year] || 0;
        
        transformedIndicators.push({
          id: `${indicator.id}-${year}`, // Unique ID for each year
          originalId: indicator.id, // Keep original for backend operations
          name: indicator.name,
          description: indicator.description,
          dimension: indicator.dimension?.name || "Non assigné",
          dimensionId: indicator.dimension?.id || null,
          weight: weight || 0, 
          effectiveWeight: effectiveWeight || 0, 
          dimensionWeight: dimensionWeight || 0, 
          normalization: mapBackendNormalizationType(indicator.normalizationType),
          year: year,
        });
      });
    });
    
    return transformedIndicators;
  } catch (error) {
    console.error("Error fetching indicators for UI:", error);
    throw error;
  }
};

// Get dimensions formatted for the new UI
export const getDimensionsForUI = async () => {
  try {
    const dimensionsResponse = await getAllDimensions();
    
    // dimensionsResponse IS the data array (handleApiResponse already extracted it)
    const dimensions = dimensionsResponse || [];
    console.log("📊 Retrieved", dimensions.length, "dimensions from database");
    
    if (!Array.isArray(dimensions)) {
      console.warn("⚠️ Dimensions is not an array:", dimensions);
      return [];
    }
    
    // Only return dimensions that have a valid year
    const filteredDimensions = dimensions.filter(dimension => dimension.year != null);
    
    const transformedDimensions = filteredDimensions.map(dimension => ({
      id: dimension.id,
      name: dimension.name,  
      year: dimension.year, // Use actual year from database
      description: dimension.description || "",
    }));
    
    console.log("✅ Returning", transformedDimensions.length, "valid dimensions");
    return transformedDimensions;
  } catch (error) {
    console.error("❌ Error fetching dimensions for UI:", error);
    return []; // Return empty array instead of mock data
  }
};

// Dimension CRUD operations
export const createDimension = (formData) =>
  post("/dimension/create", formData, "Creating dimension failed");

export const updateDimension = (id, formData) =>
  put(`/dimension/update/${id}`, formData, "Updating dimension failed");

export const deleteDimension = (id, force = false) =>
  del(`/dimension/delete/${id}${force ? '?force=true' : ''}`, "Deleting dimension failed");

// Get dimension weights for a specific year (if needed)
export const getDimensionWeightsByYear = (year) =>
  post("/dimension/year_dimensions", { year }, "Getting dimension weights by year failed");

/**
 * Weight Validation API Functions
 * ===============================
 * These functions integrate with the hybrid weight validation system
 */

/**
 * Validates weights for a specific dimension and year
 * @param {number} dimensionId - The dimension ID to validate
 * @param {number} year - The year to validate for
 * @returns {Promise} Validation result from backend
 */
export const validateDimensionWeights = async (dimensionId, year) => {
  return await post("/admin/dashboard/validate-dimension-weights", {
    dimensionId,
    year
  });
};

/**
 * Gets comprehensive weight validation report for administrative review
 * @param {number|null} year - Optional year filter (null for all years)
 * @returns {Promise} Array of dimension weight summaries
 */
export const getWeightValidationReport = async (year = null) => {
  const params = year ? `?year=${year}` : '';
  return await get(`/admin/dashboard/weight-validation-report${params}`);
};

/**
 * Gets weight adjustment suggestions for auto-fix functionality
 * @param {number} dimensionId - The dimension ID to get suggestions for
 * @param {number} year - The year to get suggestions for
 * @returns {Promise} Map of indicator ID to suggested weight
 */
export const suggestWeightAdjustment = async (dimensionId, year) => {
  return await post("/admin/dashboard/suggest-weight-adjustment", {
    dimensionId,
    year
  });
};

/**
 * Validates dimension weights for a specific year (checks if they sum to 100%)
 * @param {number} year - The year to validate
 * @returns {Promise} Validation result for dimension weights
 */
export const validateDimensionWeightsForYear = async (year) => {
  return await post("/admin/dashboard/validate-dimension-weights-for-year", { year });
};

/**
 * Validates all dimension weights for a given year before ranking generation
 * NOW INCLUDES both dimension weight validation AND indicator weight validation
 * @param {number} year - The year to validate
 * @returns {Promise} Object with validation results and ranking generation status
 */
export const validateYearWeights = async (year) => {
  return await post("/admin/dashboard/validate-year-weights", { year });
};

/**
 * Generates rankings with comprehensive weight validation
 * @param {number} year - The year to generate rankings for
 * @returns {Promise} Ranking generation result or validation errors
 */
export const generateRankingWithValidation = async (year) => {
  return await post("/admin/dashboard/generate-ranking-with-validation", { year });
};

/**
 * Updates multiple indicator weights with validation
 * @param {Array} weightUpdates - Array of weight update objects
 * @returns {Promise} Update results with validation status
 */
export const updateIndicatorWeightsBatch = async (weightUpdates, year, dimensionId = null) => {
  return await post("/admin/dashboard/update-indicator-weights-batch", {
    weightUpdates,
    year,
    dimensionId
  });
};

/**
 * Applies auto-adjustment suggestions to indicator weights
 * @param {number} dimensionId - The dimension ID to adjust
 * @param {number} year - The year to adjust for
 * @param {string} adjustmentType - Type of adjustment: 'proportional' or 'equal'
 * @returns {Promise} Applied weight adjustments
 */
export const applyWeightAdjustment = async (dimensionId, year, adjustmentType = 'proportional') => {
  return post("/admin/dashboard/apply-weight-adjustment", 
    { dimensionId, year, adjustmentType }, 
    "Failed to apply weight adjustment"
  );
};