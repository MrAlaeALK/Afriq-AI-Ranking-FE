import axios from 'axios';

// const API_BASE_URL = "http://localhost:8080/api";  //need to store it later in .env instead of this
const API_BASE_URL = "http://localhost:8080/api/v1"; 

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" }
})

// export const getRankingByYear = (year) => apiClient.post("/countries/ranking", { "year" : year }).then(response => response.data);
// export const getScoresByYear = (year) => apiClient.post("/category_scores/getScoresByYear", {"year": year }).then(response => response.data);
// // export const getAllIndicators = () => apiClient.get("/indicator/allindicators").then(response => response.data);
// export const getAllIndicators = () => apiClient.get("/categories/allCategories").then(response => response.data);

export const getRankingByYear = (year) => apiClient.post("/rank/ranking", { "year" : year }).then(response => response.data);
export const getScoresByYear = (year) => apiClient.post("/dimension_scores/get_scores_by_year", {"year": year }).then(response => response.data);
// export const getAllIndicators = () => apiClient.get("/indicator/allindicators").then(response => response.data);
export const getAllIndicators = () => apiClient.get("/dimension/dimensions").then(response => response.data);