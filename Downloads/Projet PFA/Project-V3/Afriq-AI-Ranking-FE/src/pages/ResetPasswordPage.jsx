import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import authService from '../services/authService.js';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    // State management
    const [tokenStatus, setTokenStatus] = useState('validating'); // 'validating', 'valid', 'invalid'
    const [userInfo, setUserInfo] = useState(null);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Validate token on component mount
    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        if (!token) {
            setTokenStatus('invalid');
            setErrors({ token: 'No reset token provided' });
            return;
        }

        try {
            setTokenStatus('validating');
            const response = await authService.verifyResetToken(token);
            setTokenStatus('valid');
            setUserInfo(response); // Should contain user info from backend
        } catch (error) {
            setTokenStatus('invalid');
            setErrors({ token: error.message || 'Invalid or expired reset token' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field-specific errors
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear general errors
        if (errors.general) {
            setErrors(prev => ({
                ...prev,
                general: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Password validation
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*]).*$/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character (@#$%^&+=!*)';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Password confirmation is required';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const resetData = {
                token,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            };

            const response = await authService.resetPassword(resetData);
            setSuccessMessage(response || 'Password has been reset successfully!');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Your password has been reset successfully. Please log in with your new password.',
                        type: 'success'
                    }
                });
            }, 3000);

        } catch (error) {
            setErrors({
                general: error.message || 'Failed to reset password. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        const checks = [
            password.length >= 8,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[@#$%^&+=!*]/.test(password)
        ];

        strength = checks.filter(Boolean).length;

        if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

    // Loading state while validating token
    if (tokenStatus === 'validating') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <Loader className="mx-auto h-12 w-12 text-violet-600 animate-spin" />
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Validating Reset Token
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please wait while we verify your reset token...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (tokenStatus === 'invalid') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Invalid Reset Token
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {errors.token || 'This password reset link is invalid or has expired.'}
                        </p>
                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => navigate('/forgot-password')}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                            >
                                Request New Reset Link
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (successMessage) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Password Reset Successful
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {successMessage}
                        </p>
                        <p className="mt-4 text-sm text-gray-500">
                            Redirecting to login page in a few seconds...
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                            >
                                Go to Login Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main reset password form
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Lock className="mx-auto h-12 w-12 text-violet-600" />
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below
                    </p>
                    {userInfo && (
                        <p className="mt-1 text-sm text-gray-500">
                            Resetting password for: <span className="font-medium">{userInfo}</span>
                        </p>
                    )}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        {errors.general}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* New Password Field */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPassword.newPassword ? 'text' : 'password'}
                                    required
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className={`appearance-none relative block w-full px-3 py-2 border ${
                                        errors.newPassword ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm pr-10`}
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => togglePasswordVisibility('newPassword')}
                                >
                                    {showPassword.newPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                            )}
                            
                            {/* Password strength indicator */}
                            {formData.newPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">Password strength:</span>
                                        <span className={`text-xs font-medium ${
                                            passwordStrength.strength <= 2 ? 'text-red-600' :
                                            passwordStrength.strength <= 3 ? 'text-yellow-600' :
                                            passwordStrength.strength <= 4 ? 'text-blue-600' : 'text-green-600'
                                        }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                                        <div
                                            className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword.confirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`appearance-none relative block w-full px-3 py-2 border ${
                                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm pr-10`}
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                >
                                    {showPassword.confirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Reset Password
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage; 