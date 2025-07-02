import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import authManager from '../utils/authManager';

const AuthContext = createContext({
  accessToken: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  handleTokenExpiration: () => {},
  errorMessage: null,
  isLoading: false,
  forgotPassword: () => {},
  resetPassword: () => {},
  verifyResetToken: () => {}
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle token expiration (called from API interceptor)
  const handleTokenExpiration = () => {
    console.warn('Token expired, logging out user');
    clearAuthData();
    setErrorMessage('Votre session a expiré. Veuillez vous reconnecter.');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  useEffect(() => {
    // Register token expiration handler with auth manager
    authManager.setTokenExpirationHandler(handleTokenExpiration);
    
    const initializeAuth = async () => {
    try {
    const token = localStorage.getItem('accessToken');
    if (token) {
          // Validate token format and expiration
          if (isValidToken(token)) {
      setAccessToken(token);
      setIsAuthenticated(true);
          } else {
            // Token is invalid or expired, clear it
            console.warn('Invalid or expired token found, clearing authentication');
            clearAuthData();
          }
    }
    } catch (error) {
        console.error('Error initializing authentication:', error);
        clearAuthData();
    } finally {
      setIsLoading(false);
    }
    };

    initializeAuth();
  }, []);

  // Periodic token validation effect
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check token validity every 30 seconds
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (token && !isValidToken(token)) {
        console.warn('Token expired during session, logging out');
        handleTokenExpiration();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(tokenCheckInterval);
  }, [isAuthenticated]);

  // Helper function to validate token
  const isValidToken = (token) => {
    try {
      if (!token || token.trim() === '' || token === 'null' || token === 'undefined') {
        return false;
      }
      
      // Basic JWT format validation (should have 2 dots)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return false;
      }
      
      // Check if token is expired
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token has expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  // Helper function to clear authentication data
  const clearAuthData = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const login = async (formData) => {
    try {
      setErrorMessage(null); // Clear previous errors
    const response = await authService.login(formData);
      
      if (!response.accessToken || !response.refreshToken) {
        throw new Error('Invalid response from server');
      }
      
      setAccessToken(response.accessToken);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Login failed');
      setAccessToken(null);
      setIsAuthenticated(false);
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
    clearAuthData();
    setErrorMessage(null); // Clear any error messages
    window.location.href = '/login';
  };

  const value = { 
    accessToken, 
    isAuthenticated, 
    login, 
    logout,
    handleTokenExpiration,
    errorMessage, 
    isLoading, 
    forgotPassword, 
    resetPassword, 
    verifyResetToken 
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};