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
//added ones for admin
//admin - dashboard
export const getLatestYear = () => apiClient.get("/rank/latest_year").then(response => response.data)
//admin - indicators page
export const getAllYears = () => apiClient.get("/dimension/all_years").then(response => response.data)
export const getYearIndicators = (year) => apiClient.post("/indicators/year_indicators", {"year": year}).then(response => response.data)
export const getAllLinkedDimensions = () => apiClient.get("/indicators/all_linked_dimensions").then(response => response.data)
//admiin - dimensions page
export const getAllIndicators = () => apiClient.get("/indicators").then(response => response.data)
export const getAllLinkedIndicators = () => apiClient.get("/dimension/all_linked_indicators").then(response => response.data)
// admin - scores page
export const getAllCountries = () => apiClient.get("/countries/all_countries").then(response => response.data)