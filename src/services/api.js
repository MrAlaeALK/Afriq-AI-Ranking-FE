import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";  //need to store it later in .env instead of this

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" }
})

export const getRankingByYear = (year) => apiClient.post("/country/ranking", { "year" : year }).then(response => response.data);
export const getScoresByYear = (year) => apiClient.post("/scores/getScoresByYear", {"year": year }).then(response => response.data);
export const getAllIndicators = () => apiClient.get("/indicator/allindicators").then(response => response.data);