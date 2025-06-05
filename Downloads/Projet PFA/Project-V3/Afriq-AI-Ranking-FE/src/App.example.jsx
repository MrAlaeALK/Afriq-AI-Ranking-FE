import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import ProtectedRoute, { AdminRoute } from './components/admin/guards/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './hooks/useAuth';

/**
 * Example App Component with Authentication Integration
 * 
 * This is an example of how to integrate the complete authentication system
 * with React Router and your application components.
 * 
 * Key Features Demonstrated:
 * - AuthProvider wrapping the entire app
 * - Public routes (login, register)
 * - Protected routes (dashboard, admin pages)
 * - Role-based routes (admin-only)
 * - Loading states during auth initialization
 * - Automatic redirects
 */

// Example Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Afriq AI Ranking Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.firstName}!</span>
              <button
                onClick={() => logout({ redirectToLogin: true })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Content</h2>
              <p className="text-gray-600">This is your protected dashboard content.</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">User Info:</h3>
                <p className="text-blue-800">Name: {user?.firstName} {user?.lastName}</p>
                <p className="text-blue-800">Username: {user?.username}</p>
                <p className="text-blue-800">Email: {user?.email}</p>
                <p className="text-blue-800">Roles: {user?.roles?.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Example Admin-Only Component
const AdminPanel = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Admin-Only Content</h2>
          <p className="text-gray-600 mb-4">
            This content is only visible to users with admin role.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">
              ✅ Admin access confirmed for {user?.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example Public Component
const Home = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Afriq AI Ranking
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Welcome to the ranking platform
      </p>
      <div className="space-x-4">
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Sign In
        </a>
        <a
          href="/register"
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Register
        </a>
      </div>
    </div>
  </div>
);

// Loading Component (shown during auth initialization)
const AppLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Initializing application...</p>
    </div>
  </div>
);

// Main App Router Component
const AppRouter = () => {
  const { initializing } = useAuth();
  
  // Show loading screen while auth is initializing
  if (initializing) {
    return <AppLoading />;
  }
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes - Requires Authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Admin-Only Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;

/* 
===================
USAGE INSTRUCTIONS:
===================

1. **Install React Router (if not already installed):**
   npm install react-router-dom

2. **Replace your existing src/App.jsx with this example** OR adapt the patterns shown here.

3. **Key Integration Points:**

   a) **AuthProvider Wrapper:**
      - Wraps the entire app to provide auth context
      - Handles token initialization and monitoring

   b) **Protected Routes:**
      - Use <ProtectedRoute> for auth-required pages
      - Use <AdminRoute> for admin-only pages
      - Automatic redirects to /login for unauthenticated users

   c) **Loading States:**
      - App shows loading screen during auth initialization
      - Individual components have their own loading states

   d) **Auth Integration:**
      - useAuth() hook provides user info and methods
      - logout() method with redirect options
      - Real-time auth state updates

4. **Customization:**
   - Replace Dashboard and AdminPanel with your actual components
   - Update routes to match your app structure
   - Customize redirect paths in ProtectedRoute components
   - Add more role-based routes as needed

5. **Backend Integration:**
   - Ensure your backend is running on http://localhost:8080
   - Update REACT_APP_API_BASE_URL if different
   - Test login/register with backend

6. **Testing the Flow:**
   a) Visit /register to create account
   b) Auto-redirected to /dashboard after registration
   c) Visit /admin to test admin-only access
   d) Logout and try accessing protected routes
   e) Login redirects to originally requested route

That's it! You now have a complete authentication system.
*/ 