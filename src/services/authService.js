import { getRaw, postRaw } from "../utils/apiRequest";
import {jwtDecode} from "jwt-decode";

const login = (formData) => postRaw("/auth/login", formData, "login request failed");

const forgotPassword = (email) => postRaw("/auth/forgot-password", { email }, "triggering resetting password failed");

const resetPassword = (formData) => postRaw("/auth/reset-password", formData, "triggering resetting password failed");

const verifyResetToken = (token) => getRaw(`/auth/verify-reset-token/${token}`, "Invalid or expired reset token");

const refreshToken = async () => {
  const storedRefreshToken = localStorage.getItem('refreshToken');
  return await postRaw("/auth/refresh-token", { refreshToken: storedRefreshToken }, "refreshing token failed");
}

const getUsername = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.sub;
}

export default { login, refreshToken, forgotPassword, resetPassword, verifyResetToken, getUsername };