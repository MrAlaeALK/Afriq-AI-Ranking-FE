import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/v1"; //need to store it later in .env instead of this

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" }
})


export const getRankingByYear = (year) => apiClient.post("/rank/ranking", { "year" : year }).then(response => response.data);
export const getScoresByYear = (year) => apiClient.post("/dimension_scores/get_scores_by_year", {"year": year }).then(response => response.data);
export const getAllDimensions = () => apiClient.get("/dimension/dimensions").then(response => response.data);
export const getYearDimensions = (year) => apiClient.post("/dimension/year_dimensions", {"year": year}).then(response => response.data)