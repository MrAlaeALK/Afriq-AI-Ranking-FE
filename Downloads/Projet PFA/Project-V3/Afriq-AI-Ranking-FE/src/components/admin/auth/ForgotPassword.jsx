import React, { useState } from 'react';
import authService from '../../../services/authService.js';

/**
 * Forgot Password Form Component
 * 
 * Provides a user interface for password reset requests with:
 */
const ForgotPassword = ({ 
  onSuccess = null, 
  onError = null,
  showBackToLogin = true,
  className = ""
}) => {
  // Form state
  const [formData, setFormData] = useState({
    email: ''
  });
  
  // Component state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Validate email field
   */
  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    if (email.length > 254) {
      return 'Email address is too long';
    }
    
    return null;
  };

  /**
   * Handle input changes with real-time validation
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    if (name === 'email') {
      const error = validateEmail(value);
      setErrors(prev => ({
        ...prev,
        email: error
      }));
    }
  };

  /**
   * Get field validation status
   */
  const getFieldStatus = () => {
    const error = errors.email;
    const value = formData.email;
    
    if (!value) return 'neutral';
    if (error) return 'invalid';
    return 'valid';
  };

  /**
   * Get input class based on field status
   */
  const getInputClass = () => {
    const status = getFieldStatus();
    const baseClass = "mt-1 appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none sm:text-sm transition-colors duration-200";
    
    switch (status) {
      case 'valid':
        return `${baseClass} border-green-300 focus:ring-green-500 focus:border-green-500`;
      case 'invalid':
        return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
      default:
        return `${baseClass} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
    }
  };

  /**
   * Render validation icon
   */
  const renderValidationIcon = () => {
    const status = getFieldStatus();
    
    if (status === 'neutral') return null;
    
    return (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        {status === 'valid' ? (
          <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    );
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await authService.forgotPassword(formData.email);
      
      setIsSubmitted(true);
      
      // Success callback
      if (onSuccess) {
        onSuccess(formData.email);
      }

    } catch (error) {
      console.error('Forgot password error:', error);
      
      // Handle different error types
      if (error.status === 404) {
        setErrors({ email: 'No account found with this email address' });
      } else if (error.status >= 500) {
        setErrors({ general: 'Server error occurred. Please try again later.' });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }

      // Error callback
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message if form was submitted successfully
  if (isSubmitted) {
    return (
      <div className={`w-full max-w-md ${className}`}>
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600">
              We've sent a password reset link to:
            </p>
            <p className="text-blue-600 font-medium mt-1">
              {formData.email}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Check your email (including spam folder)</p>
              <p>• Click the reset link within 24 hours</p>
              <p>• Follow the instructions to set a new password</p>
            </div>
          </div>

          {/* Resend and Back Links */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ email: '' });
              }}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              Didn't receive the email? Try again
            </button>
            
            {showBackToLogin && (
              <div>
                <a
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-500 transition-colors"
                >
                  Back to sign in
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show the form
  return (
    <div className={`w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Reset Your Password
          </h2>
          <p className="text-center text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={getInputClass()}
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
            {renderValidationIcon()}
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !!errors.email || !formData.email}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isSubmitting || !!errors.email || !formData.email
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            } transition duration-150 ease-in-out`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </div>

        {/* Back to Login Link */}
        {showBackToLogin && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Back to sign in
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword; 