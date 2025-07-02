import { getRaw, postRaw } from "../utils/apiRequest";
import {jwtDecode} from "jwt-decode";

const login = (formData) => postRaw("/auth/login", formData, "login request failed");

const forgotPassword = (email) => postRaw("/auth/forgot-password", { email }, "triggering resetting password failed");

const resetPassword = (formData) => postRaw("/auth/reset-password", formData, "triggering resetting password failed");

const verifyResetToken = (token) => getRaw(`/auth/verify-reset-token/${token}`, "Invalid or expired reset token");

const refreshToken = async () => {
  const storedRefreshToken = localStorage.getItem('refreshToken');
  
  // Check if refresh token exists
  if (!storedRefreshToken || storedRefreshToken.trim() === '') {
    throw new Error('No refresh token available');
  }
  
  const response = await postRaw("/auth/refresh-token", { refreshToken: storedRefreshToken }, "refreshing token failed");
  return response.data; // Extract the access token from the response
}

const getUsername = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
    const decoded = jwtDecode(token);
    return decoded.sub;
    } catch (error) {
        console.error("Invalid JWT token:", error);
        // Clear invalid token from storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return null;
    }
}

export default { login, refreshToken, forgotPassword, resetPassword, verifyResetToken, getUsername };