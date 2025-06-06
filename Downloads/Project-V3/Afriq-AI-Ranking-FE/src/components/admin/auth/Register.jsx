import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { ValidationError, AuthError } from '../../../services/authService';

/**
 * Registration Form Component
 */
const Register = ({ 
  onSuccess = null, 
  onError = null,
  redirectPath = null,
  showLoginLink = true,
  className = ""
}) => {
  const { register, loading } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  
  // Error and validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  /**
   * Check password strength based on backend requirements
   */
  const checkPasswordStrength = (password) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'Contains a number' },
      { regex: /[a-z]/, text: 'Contains lowercase letter' },
      { regex: /[A-Z]/, text: 'Contains uppercase letter' },
      { regex: /[@#$%^&+=!*]/, text: 'Contains special character (@#$%^&+=!*)' }
    ];

    const passed = requirements.filter(req => req.regex.test(password));
    const score = passed.length;
    const feedback = requirements.map(req => ({
      ...req,
      passed: req.regex.test(password)
    }));

    return { score, feedback, isValid: score === requirements.length };
  };

  /**
   * Validate individual field
   */
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        }
        if (value.length < 2) {
          return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        }
        if (value.length > 50) {
          return `${name === 'firstName' ? 'First' : 'Last'} name must be less than 50 characters`;
        }
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          return `${name === 'firstName' ? 'First' : 'Last'} name can only contain letters, spaces, hyphens, and apostrophes`;
        }
        return null;

      case 'username':
        if (!value.trim()) {
          return 'Username is required';
        }
        if (value.length < 3) {
          return 'Username must be at least 3 characters';
        }
        if (value.length > 20) {
          return 'Username must be less than 20 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Username can only contain letters, numbers, and underscores';
        }
        if (/^[0-9_]/.test(value)) {
          return 'Username must start with a letter';
        }
        return null;

      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        // Email validation with explicit dot requirement
        // Pattern: username@domain.extension (at least one dot required)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address (e.g., user@domain.com)';
        }
        // Additional checks
        if (value.length > 254) {
          return 'Email address is too long';
        }
        // Check for consecutive dots
        if (/\.{2,}/.test(value)) {
          return 'Email cannot contain consecutive dots';
        }
        // Check for dots at start or end of local part
        if (/^\.|\.$|@\.|\.$/.test(value)) {
          return 'Email format is invalid';
        }
        return null;

      case 'password':
        if (!value) {
          return 'Password is required';
        }
        const { isValid } = checkPasswordStrength(value);
        if (!isValid) {
          return 'Password must meet all requirements';
        }
        return null;

      case 'passwordConfirmation':
        if (!value) {
          return 'Password confirmation is required';
        }
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        return null;

      default:
        return null;
    }
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
    
    // Check password strength for password field
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    // Real-time validation for the current field
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));

    // Re-validate password confirmation if password changed
    if (name === 'password' && formData.passwordConfirmation) {
      const confirmError = validateField('passwordConfirmation', formData.passwordConfirmation);
      setErrors(prev => ({
        ...prev,
        passwordConfirmation: confirmError
      }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || loading) return;

    // Clear previous errors
    setErrors({});
    
    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await register(formData);
      
      // Success callback
      if (onSuccess) {
        onSuccess(user, redirectPath);
      } else {
        // Default redirect behavior (user is auto-logged in)
        const returnPath = redirectPath || '/';
        window.location.href = returnPath;
      }

    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different error types
      if (error instanceof ValidationError) {
        setErrors({ [error.field || 'general']: error.message });
      } else if (error instanceof AuthError) {
        setErrors({ general: error.message });
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

  /**
   * Get password strength indicator color
   */
  const getPasswordStrengthColor = (score) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  /**
   * Get field validation status
   */
  const getFieldStatus = (fieldName) => {
    const value = formData[fieldName];
    const error = errors[fieldName];
    
    if (!value) return 'neutral';
    if (error) return 'invalid';
    return 'valid';
  };

  /**
   * Get input class based on field status with padding for icons
   */
  const getInputClass = (fieldName) => {
    const status = getFieldStatus(fieldName);
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
   * Render validation icon inside input field
   */
  const renderValidationIcon = (fieldName) => {
    const status = getFieldStatus(fieldName);
    
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

  return (
    <div className={`w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Create Your Account
          </h2>
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

        {/* Name Fields Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className={getInputClass('firstName')}
                placeholder="First name"
                disabled={isSubmitting || loading}
              />
              {renderValidationIcon('firstName')}
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className={getInputClass('lastName')}
                placeholder="Last name"
                disabled={isSubmitting || loading}
              />
              {renderValidationIcon('lastName')}
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleInputChange}
              className={getInputClass('username')}
              placeholder="Choose a username (3-20 characters)"
              disabled={isSubmitting || loading}
            />
            {renderValidationIcon('username')}
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Letters, numbers, and underscores only
          </p>
        </div>

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
              className={getInputClass('email')}
              placeholder="Enter your email address"
              disabled={isSubmitting || loading}
            />
            {renderValidationIcon('email')}
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={getInputClass('password')}
              placeholder="Create a strong password"
              disabled={isSubmitting || loading}
            />
            {renderValidationIcon('password')}
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Password strength</span>
                <span className="text-xs text-gray-600">
                  {passwordStrength.score}/5
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs space-y-1">
                {passwordStrength.feedback.map((req, index) => (
                  <div key={index} className={`flex items-center ${req.passed ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">
                      {req.passed ? '✓' : '○'}
                    </span>
                    {req.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Password Confirmation Field */}
        <div>
          <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              required
              value={formData.passwordConfirmation}
              onChange={handleInputChange}
              className={getInputClass('passwordConfirmation')}
              placeholder="Confirm your password"
              disabled={isSubmitting || loading}
            />
            {renderValidationIcon('passwordConfirmation')}
          </div>
          {errors.passwordConfirmation && (
            <p className="mt-1 text-sm text-red-600">{errors.passwordConfirmation}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || loading || !passwordStrength.isValid}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isSubmitting || loading || !passwordStrength.isValid
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            } transition duration-150 ease-in-out`}
          >
            {isSubmitting || loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        {/* Login Link */}
        {showLoginLink && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;