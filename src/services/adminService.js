import { get, post, del, upload } from "../utils/apiRequest";

export const getAllScores = () =>
  get("/scores", "Fetching scores failed");

export const editScore = (formData) =>
  post("/edit-score", formData, "Editing score failed");

export const deleteScore = (id) =>
  del(`/delete-score/${id}`, "Deleting score failed");

export const addScore = (formData) =>
  post("/add-score", formData, "Adding score failed");

export const getYearIndicators = (year) =>
  post("/year_indicators", { year }, "Getting year indicators failed");

export const getPossibleScoreYears = () =>
  get("/indicators-years", "Getting years linked to indicators failed");

export const getAllCountries = () =>
  get("/all_countries", "Getting all countries failed");

export const uploadFile = (formData) =>
  upload("/upload-score-file", formData, "Uploading file failed");

export const getFetchedScores = (formData) =>
  upload("/validate_fetched_columns", formData, "Validating fetched columns failed");

export const validateAllFetchedScores = (dto) =>
  post("/validate_scores", dto, "Persisting scores failed");

export const getYearRanking = (year) =>
  post("/year-ranking", { year }, "Getting year ranking failed");

export const getRankingYears = () =>
  get("/ranking-years", "Getting ranking years failed");

export const generateRanking = (year) =>
  post("/generate-ranking", { year }, "Generating ranking failed");

export const getAllRanks = () =>
  get("/all-rankings", "Getting all rankings failed");

export const deleteRanking = (year) =>
  del(`/delete-ranking/${year}`, "Deleting ranking failed");

export const getDimensionScoresByYear = (year) =>
  post("/dimension-scores", { year }, "Getting dimension scores failed");

export const getScoresByYear = (year) => post("/dmension_scores/get_scores_by_year", {year}, "fetching scores failed");