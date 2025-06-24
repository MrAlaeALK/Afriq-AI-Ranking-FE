import React from 'react';
import Login from '../../components/auth/Login';

const LoginPage = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header/Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            AFRIQ'AI Ranking
          </h1>
          <p className="text-gray-600">
            Admin Dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <Login
            showRegisterLink={true}
            className="w-full"
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            © 2025 AFRIQ'AI Ranking. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 