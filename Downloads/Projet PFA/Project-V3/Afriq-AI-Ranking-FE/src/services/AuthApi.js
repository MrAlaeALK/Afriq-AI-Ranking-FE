import apiClient from '../../api/apiClient';

/**
 * Authentication API service for handling auth-related requests
 */
export class AuthApi {
  
  /**
   * Login user with credentials
   */
  static async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login API error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status,
        data: null
      };
    }
  }

  /**
   * Register new admin user
   */
  static async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration API error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        status: error.response?.status,
        data: null
      };
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(tokenData) {
    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken: tokenData.refreshToken
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      console.error('Token refresh API error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Token refresh failed',
        status: error.response?.status,
        data: null
      };
    }
  }

  /**
   * Logout user (optional backend call)
   */
  static async logout() {
    try {
      const response = await apiClient.post('/auth/logout');
      
      return {
        success: true,
        data: response.data,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Logout API error:', error);
      // Don't throw error for logout - continue with local cleanup
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
        status: error.response?.status,
        data: null
      };
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(emailData) {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email: emailData.email
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Password reset email sent'
      };
    } catch (error) {
      console.error('Password reset request API error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Password reset request failed',
        status: error.response?.status,
        data: null
      };
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(resetData) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token: resetData.token,
        newPassword: resetData.newPassword
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error('Password reset API error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
        status: error.response?.status,
        data: null
      };
    }
  }
}

export default AuthApi;