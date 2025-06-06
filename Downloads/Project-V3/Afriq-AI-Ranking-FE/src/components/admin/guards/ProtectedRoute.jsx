import React from 'react';
import { useAuthGuard } from '../../../hooks/useAuthGuard';

/**
 * ProtectedRoute Component
 */
const ProtectedRoute = ({
  children,
  redirectTo = '/login',
  requiredRole = null,
  fallback = null,
  unauthorizedFallback = null
}) => {
  const { 
    canAccess, 
    isLoading, 
    isAuthenticated, 
    user, 
    hasRole, 
    authStatus 
  } = useAuthGuard({ 
    requireAuth: true, 
    redirectTo,
    waitForInitialization: true 
  });

  // Show loading state while authentication is initializing
  if (isLoading) {
    return fallback || <LoadingComponent />;
  }

  // Check role-based access if required
  if (requiredRole && isAuthenticated && !hasRole(requiredRole)) {
    return unauthorizedFallback || <UnauthorizedComponent requiredRole={requiredRole} />;
  }

  // If user can access, render the protected content
  if (canAccess) {
    return <>{children}</>;
  }

  // If we reach here, user will be redirected (handled by useAuthGuard)
  // Show a brief loading state during redirect
  return <RedirectingComponent redirectTo={redirectTo} />;
};

/**
 * Default Loading Component
 */
const LoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Checking authentication...</p>
    </div>
  </div>
);

/**
 * Unauthorized Access Component (for role-based restrictions)
 */
const UnauthorizedComponent = ({ requiredRole }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-6">
        You don't have permission to access this area.
        {requiredRole && (
          <span className="block mt-2 text-sm">
            Required role: <span className="font-medium">{requiredRole}</span>
          </span>
        )}
      </p>
      <button
        onClick={() => window.history.back()}
        className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

/**
 * Redirecting Component (shown briefly during redirect)
 */
const RedirectingComponent = ({ redirectTo }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Redirecting to login...</p>
    </div>
  </div>
);

/**
 * Higher-order component for creating role-specific protected routes
 */
export const createRoleProtectedRoute = (requiredRole, customRedirect = '/login') => {
  return function RoleProtectedRoute({ children, ...props }) {
    return (
      <ProtectedRoute
        requiredRole={requiredRole}
        redirectTo={customRedirect}
        {...props}
      >
        {children}
      </ProtectedRoute>
    );
  };
};

/**
 * Pre-configured Admin-only route component
 */
export const AdminRoute = createRoleProtectedRoute('ADMIN');

/**
 * Pre-configured route that requires authentication but no specific role
 */
export const AuthenticatedRoute = ({ children, ...props }) => (
  <ProtectedRoute {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute; 