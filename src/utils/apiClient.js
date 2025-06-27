import axios from "axios";
import authService from "../services/authService";

const API_BASE_URL = "http://localhost:8080/api/v1"; //need to store it later in .env instead of this

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" }
})

// // Attach access token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// // Refresh token on 401
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const isTokenExpired = error.response?.status === 401  || error.response?.status === 403
    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("it's getting called")
        const accessToken = await authService.refreshToken();
        localStorage.setItem('accessToken', accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); // if somehow we managed to use httpOnly then we'll remove this line
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;