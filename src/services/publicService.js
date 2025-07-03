import { getRaw, postRaw } from '../utils/apiRequest';

// Country-related services
export const getAllCountries = () => 
  get("/countries", "getting countries failed");

// Ranking-related services
export const getRankingByYear = (year) => 
  postRaw("/rank/ranking", {year}, "fetching ranking failed");

// Score-related services
export const getScoresByYear = (year) => 
  postRaw("/dimension_scores/get_scores_by_year", {year}, "fetching scores failed");

// Dimension-related services
export const getAllDimensions = () => 
  getRaw("/dimension/dimensions", "fetching dimensions failed");

export const getDimensionScoresByYear = (year) => 
  postRaw("/dimension_scores/get_scores_by_year", {year}, "fetching dimension scores failed");

export const getYearDimensions = (year) => 
  postRaw("/dimension/year_dimensions", {year}, "fetching year dimensions failed");

// Year-related services
export const getAvailableYears = () =>
  getRaw("/rank/available-years", "fetching available years failed");