import { useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Custom hook for authentication guards
 * 
 * Provides utilities for protecting routes and components that require authentication.
 * Can automatically redirect unauthenticated users or provide loading states during auth initialization.
 */
export const useAuthGuard = (options = {}) => {
  const {
    requireAuth = true,
    redirectTo = '/login',
    onRedirect = null,
    waitForInitialization = true
  } = options;

  const { 
    isAuthenticated, 
    user, 
    loading, 
    initializing,
    getTokenTimeRemaining,
    isTokenExpiringSoon 
  } = useAuth();

  /**
   * Determine if access should be granted
   */
  const shouldGrantAccess = () => {
    if (!requireAuth) return true;
    if (waitForInitialization && initializing) return false;
    return isAuthenticated;
  };

  /**
   * Determine if we should show loading state
   */
  const shouldShowLoading = () => {
    return loading || (waitForInitialization && initializing);
  };

  /**
   * Determine if redirect is needed
   */
  const needsRedirect = () => {
    if (!requireAuth) return false;
    if (shouldShowLoading()) return false;
    return !isAuthenticated;
  };

  /**
   * Perform redirect if needed
   */
  useEffect(() => {
    if (needsRedirect()) {
      if (onRedirect) {
        onRedirect(redirectTo);
      } else {
        // Default redirect behavior
        console.log(`[useAuthGuard] Redirecting to ${redirectTo} - authentication required`);
        window.location.href = redirectTo;
      }
    }
  }, [needsRedirect(), redirectTo, onRedirect]);

  /**
   * Get authentication status details
   */
  const getAuthStatus = () => {
    if (shouldShowLoading()) {
      return {
        status: 'loading',
        message: initializing ? 'Initializing authentication...' : 'Processing...'
      };
    }

    if (!requireAuth) {
      return {
        status: 'public',
        message: 'Public access - no authentication required'
      };
    }

    if (isAuthenticated) {
      const timeRemaining = getTokenTimeRemaining();
      const expiringSoon = isTokenExpiringSoon();

      return {
        status: 'authenticated',
        message: 'Access granted',
        tokenTimeRemaining: timeRemaining,
        tokenExpiringSoon: expiringSoon,
        user
      };
    }

    return {
      status: 'unauthenticated',
      message: 'Authentication required'
    };
  };

  /**
   * Check if user has specific role (for admin dashboard)
   */
  const hasRole = (role) => {
    if (!isAuthenticated || !user) return false;
    
    const userRoles = user.roles || [];
    return userRoles.includes(role) || userRoles.includes(`ROLE_${role.toUpperCase()}`);
  };

  /**
   * Check if user is admin
   */
  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  return {
    // Access control
    canAccess: shouldGrantAccess(),
    isLoading: shouldShowLoading(),
    needsRedirect: needsRedirect(),
    
    // Authentication state
    isAuthenticated,
    user,
    
    // Status information
    authStatus: getAuthStatus(),
    
    // Token information
    tokenTimeRemaining: getTokenTimeRemaining(),
    isTokenExpiringSoon: isTokenExpiringSoon(),
    
    // Role checking
    hasRole,
    isAdmin,
    
    // Configuration
    requireAuth,
    redirectTo
  };
};

/**
 * Simplified hook for components that just need to check if user is authenticated
 */
export const useRequireAuth = (redirectTo = '/login') => {
  const guard = useAuthGuard({ requireAuth: true, redirectTo });
  
  return {
    isAuthenticated: guard.isAuthenticated,
    user: guard.user,
    isLoading: guard.isLoading,
    canAccess: guard.canAccess
  };
};

/**
 * Hook for admin-only components
 */
export const useRequireAdmin = (redirectTo = '/login') => {
  const guard = useAuthGuard({ requireAuth: true, redirectTo });
  const isAdmin = guard.isAdmin();
  
  // Override access control to require admin role
  const canAccess = guard.canAccess && isAdmin;
  
  return {
    isAuthenticated: guard.isAuthenticated,
    user: guard.user,
    isLoading: guard.isLoading,
    canAccess,
    isAdmin
  };
};

export default useAuthGuard;