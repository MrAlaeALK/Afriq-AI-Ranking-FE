import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
    setIsLoading(false)
  }, []);

  const login = async (formData) => {
    try{
    const response = await authService.login(formData);
      setAccessToken(response.accessToken);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken); // if working with httpOnly remove this line
    }
    catch(error){
        setErrorMessage(error.message)
    }
  };

  const forgotPassword = async(email) => {
    try{
        const response = await authService.forgotPassword(email);
        return response
    }
    catch(error){
        setErrorMessage(error.message)
    }
  }

  const resetPassword = async(formData) => {
    try{
        const response = await authService.resetPassword(formData);
        return response
    }
    catch(error){
        setErrorMessage(error.message)
    }
  }

  const verifyResetToken = async(token) => {
    console.log(token)
    try{
        return await authService.verifyResetToken(token)
    }
    catch(error){
        setErrorMessage(error.message)
    }
  }

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); //if working with httpOnly cookie then remove this one
    window.location.href = '/login';
  };

  const value = { accessToken, isAuthenticated, login, errorMessage, isLoading, forgotPassword, resetPassword, verifyResetToken, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);