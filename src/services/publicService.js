import { getRaw, postRaw } from "../utils/apiRequest";

export const getRankingByYear = (year) => postRaw("/rank/ranking", {year}, "fetching ranking failed");

export const getScoresByYear = (year) => postRaw("/dimension_scores/get_scores_by_year", {year}, "fetching scores failed");

export const getAllDimensions = () => getRaw("/dimension/dimensions", "fetching dimensions failed");

export const getYearDimensions = (year) => postRaw("/dimension/year_dimensions", {year}, "fetching year dimensions");