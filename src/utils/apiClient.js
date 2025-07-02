import axios from "axios";
import authService from "../services/authService";
import authManager from "./authManager";

const API_BASE_URL = "http://localhost:8080/api/v1"; //need to store it later in .env instead of this

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" }
})

// Request interceptor to attach access token and check expiration
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  
  // Only add Authorization header if token exists and looks like a JWT
  if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
    // Basic JWT format validation (should have 2 dots)
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      // Check if token is expired before making the request
      if (authManager.isTokenExpired()) {
        console.warn('Token expired before request, triggering logout');
        authManager.onTokenExpired();
        return Promise.reject(new Error('Token expired'));
      }
      
    config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('Invalid JWT token format, removing from storage');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      authManager.onTokenExpired();
      return Promise.reject(new Error('Invalid token format'));
    }
  }
  
  return config;
});

// Response interceptor for token refresh and expiration handling
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const isTokenExpired = error.response?.status === 401 || error.response?.status === 403;
    
    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log("Attempting token refresh...");
        const newAccessToken = await authService.refreshToken();
        
        // Update token in storage and headers
        localStorage.setItem('accessToken', newAccessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        console.log("Token refreshed successfully, retrying request");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.warn("Token refresh failed:", refreshError.message);
        
        // Token refresh failed, handle expiration through auth manager
        authManager.onTokenExpired();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;