import { get, post, put, patch, del, delWithBody, upload } from "../utils/apiRequest";
import { decimalToPercentage, calculateEffectiveWeight } from "../utils/weightUtils";

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

export const toggleIndicatorStatus = (id) =>
  patch(`/admin/dashboard/indicators/${id}/status`, {}, "Toggling indicator status failed");

export const getIndicatorWeightByYear = (id, year) =>
  get(`/admin/dashboard/indicators/${id}/weight/${year}`, "Fetching indicator weight failed");

export const getIndicatorsByDimension = (dimensionId) =>
  get(`/admin/dashboard/indicators/dimension/${dimensionId}`, "Fetching indicators by dimension failed");

export const getActiveIndicators = () =>
  get("/admin/dashboard/indicators/active", "Fetching active indicators failed");

export const bulkUpdateIndicatorStatus = (indicatorIds, status) =>
  patch(`/admin/dashboard/indicators/bulk/status?status=${status}`, indicatorIds, "Bulk status update failed");

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
    const indicators = await getAllIndicators(); // Already returns the data directly
    
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
          weight: decimalToPercentage(weight), // Convert 0.0-1.0 to percentage (within dimension)
          effectiveWeight: decimalToPercentage(effectiveWeight), // Convert 0.0-1.0 to percentage (global)
          dimensionWeight: decimalToPercentage(dimensionWeight), // Convert 0.0-1.0 to percentage
          normalization: mapBackendNormalizationType(indicator.normalizationType),
          year: year,
          status: indicator.status,
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
    const dimensions = await getAllDimensions(); // Already returns the data directly
    
    if (!Array.isArray(dimensions)) {
      console.warn("Dimensions is not an array:", dimensions);
      return [];
    }
    
    // Only return dimensions that have a valid year
    return dimensions
      .filter(dimension => dimension.year != null) // Only keep dimensions with actual years
      .map(dimension => ({
      id: dimension.id,
      name: dimension.name,
        year: dimension.year, // Use actual year from database
      description: dimension.description || "",
    }));
  } catch (error) {
    console.error("Error fetching dimensions for UI:", error);
    return []; // Return empty array instead of mock data
  }
};

// Dimension CRUD operations
export const createDimension = (formData) =>
  post("/dimension/create", formData, "Creating dimension failed");

export const updateDimension = (id, formData) =>
  put(`/dimension/update/${id}`, formData, "Updating dimension failed");

export const deleteDimension = (id) =>
  del(`/dimension/delete/${id}`, "Deleting dimension failed");

// Get dimension weights for a specific year (if needed)
export const getDimensionWeightsByYear = (year) =>
  post("/dimension/year_dimensions", { year }, "Getting dimension weights by year failed");