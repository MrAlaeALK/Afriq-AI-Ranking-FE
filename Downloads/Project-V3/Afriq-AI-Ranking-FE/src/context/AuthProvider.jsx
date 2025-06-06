import React, { useState, useEffect, useCallback, useRef } from 'react';
import AuthContext from './AuthContext';
import authService from '../services/authService';

/**
 * AuthProvider Component
 * 
 * Manages global authentication state and provides it to child components
 * through AuthContext. Handles automatic token validation, expiration monitoring,
 * and state synchronization with authService.
 */
const AuthProvider = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Refs for cleanup
  const tokenCheckInterval = useRef(null);
  const mounted = useRef(true);

  /**
   * Safe state updates - only update if component is still mounted
   */
  const safeSetState = useCallback((setter, value) => {
    if (mounted.current) {
      setter(value);
    }
  }, []);

  /**
   * Initialize authentication state on app start
   * Checks for existing valid tokens and restores user session
   */
  const initializeAuth = useCallback(async () => {
    try {
      console.log('[AuthProvider] Initializing authentication...');
      
      // Check if user is currently authenticated
      const authenticated = authService.isAuthenticated();
      
      if (authenticated) {
        console.log('[AuthProvider] Found existing authentication');
        
        // Get current user data
        const currentUser = authService.getCurrentUser();
        
        // Verify token is still valid and not expired
        const timeRemaining = authService.getTokenTimeRemaining();
        
        if (timeRemaining > 0) {
          safeSetState(setIsAuthenticated, true);
          safeSetState(setUser, currentUser);
          console.log('[AuthProvider] Authentication restored successfully');
        } else {
          console.log('[AuthProvider] Token expired, clearing auth data');
          await authService.logout();
        }
      } else {
        console.log('[AuthProvider] No existing authentication found');
      }
      
    } catch (error) {
      console.error('[AuthProvider] Error during initialization:', error);
      // Clear any corrupted auth data
      authService.clearAuthData();
    } finally {
      safeSetState(setInitializing, false);
    }
  }, [safeSetState]);

  /**
   * Start monitoring token expiration
   * Checks every minute and handles expiration warnings
   */
  const startTokenMonitoring = useCallback(() => {
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
    }

    tokenCheckInterval.current = setInterval(() => {
      if (!mounted.current) return;

      const timeRemaining = authService.getTokenTimeRemaining();
      
      if (timeRemaining <= 0) {
        console.log('[AuthProvider] Token expired, logging out');
        logout();
      } else if (authService.isTokenExpiringSoon()) {
        console.log('[AuthProvider] Token expiring soon:', Math.floor(timeRemaining / 1000 / 60), 'minutes remaining');
      }
    }, 60000); // Check every minute
  }, []);

  /**
   * Stop monitoring token expiration
   */
  const stopTokenMonitoring = useCallback(() => {
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
      tokenCheckInterval.current = null;
    }
  }, []);

  /**
   * Login user with credentials
   */
  const login = useCallback(async (credentials) => {
    safeSetState(setLoading, true);
    
    try {
      console.log('[AuthProvider] Logging in user...');
      
      const result = await authService.login(credentials);
      
      safeSetState(setIsAuthenticated, true);
      safeSetState(setUser, result.user);
      
      // Start monitoring token expiration
      startTokenMonitoring();
      
      console.log('[AuthProvider] Login successful');
      return result;
      
    } catch (error) {
      console.error('[AuthProvider] Login failed:', error);
      throw error; // Let components handle the error
    } finally {
      safeSetState(setLoading, false);
    }
  }, [safeSetState, startTokenMonitoring]);

  /**
   * Register new user account
   */
  const register = useCallback(async (userData) => {
    safeSetState(setLoading, true);
    
    try {
      console.log('[AuthProvider] Registering new user...');
      
      const result = await authService.register(userData);
      
      safeSetState(setIsAuthenticated, true);
      safeSetState(setUser, result.user);
      
      // Start monitoring token expiration
      startTokenMonitoring();
      
      console.log('[AuthProvider] Registration successful');
      return result;
      
    } catch (error) {
      console.error('[AuthProvider] Registration failed:', error);
      throw error; // Let components handle the error
    } finally {
      safeSetState(setLoading, false);
    }
  }, [safeSetState, startTokenMonitoring]);

  /**
   * Logout current user
   */
  const logout = useCallback(async () => {
    safeSetState(setLoading, true);
    
    try {
      console.log('[AuthProvider] Logging out user...');
      
      await authService.logout();
      
      safeSetState(setIsAuthenticated, false);
      safeSetState(setUser, null);
      
      // Stop monitoring token expiration
      stopTokenMonitoring();
      
      console.log('[AuthProvider] Logout successful');
      
    } catch (error) {
      console.error('[AuthProvider] Logout error:', error);
      // Even if logout fails, clear local state
      safeSetState(setIsAuthenticated, false);
      safeSetState(setUser, null);
      stopTokenMonitoring();
    } finally {
      safeSetState(setLoading, false);
    }
  }, [safeSetState, stopTokenMonitoring]);

  /**
   * Refresh current user data from server
   */
  const refreshUserData = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('[AuthProvider] Refreshing user data...');
      
      const currentUser = authService.getCurrentUser();
      safeSetState(setUser, currentUser);
      
      return currentUser;
      
    } catch (error) {
      console.error('[AuthProvider] Failed to refresh user data:', error);
      throw error;
    }
  }, [isAuthenticated, safeSetState]);

  /**
   * Clear all authentication data
   */
  const clearAuthData = useCallback(() => {
    console.log('[AuthProvider] Clearing auth data...');
    
    authService.clearAuthData();
    safeSetState(setIsAuthenticated, false);
    safeSetState(setUser, null);
    stopTokenMonitoring();
  }, [safeSetState, stopTokenMonitoring]);

  /**
   * Get remaining token time
   */
  const getTokenTimeRemaining = useCallback(() => {
    return authService.getTokenTimeRemaining();
  }, []);

  /**
   * Check if token is expiring soon
   */
  const isTokenExpiringSoon = useCallback(() => {
    return authService.isTokenExpiringSoon();
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
    
    return () => {
      mounted.current = false;
      stopTokenMonitoring();
    };
  }, [initializeAuth, stopTokenMonitoring]);

  // Start/stop token monitoring based on auth state
  useEffect(() => {
    if (isAuthenticated) {
      startTokenMonitoring();
    } else {
      stopTokenMonitoring();
    }
  }, [isAuthenticated, startTokenMonitoring, stopTokenMonitoring]);

  // Context value
  const contextValue = {
    // State
    isAuthenticated,
    user,
    loading,
    initializing,

    // Actions
    login,
    register,
    logout,

    // Token Management
    getTokenTimeRemaining,
    isTokenExpiringSoon,

    // Utilities
    refreshUserData,
    clearAuthData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 