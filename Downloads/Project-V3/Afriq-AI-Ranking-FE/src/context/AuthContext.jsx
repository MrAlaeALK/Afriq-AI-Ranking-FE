import { createContext, useContext } from 'react';

/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the React component tree.
 * Used by AuthProvider to manage global auth state and consumed by components via useAuth hook.
 */

// Define the shape of our auth context
const AuthContext = createContext({
  // Authentication State
  isAuthenticated: false,
  user: null,
  loading: true,
  initializing: true,

  // Authentication Actions
  login: async (credentials) => { throw new Error('AuthContext not initialized') },
  register: async (userData) => { throw new Error('AuthContext not initialized') },
  logout: async () => { throw new Error('AuthContext not initialized') },

  // Token Management
  getTokenTimeRemaining: () => 0,
  isTokenExpiringSoon: () => false,

  // Utility Methods
  refreshUserData: async () => { throw new Error('AuthContext not initialized') },
  clearAuthData: () => { throw new Error('AuthContext not initialized') },
});

/**
 * Hook to access authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 