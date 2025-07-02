// Auth manager to handle communication between API interceptor and AuthContext
class AuthManager {
  constructor() {
    this.handleTokenExpirationCallback = null;
  }

  // Register the token expiration handler from AuthContext
  setTokenExpirationHandler(handler) {
    this.handleTokenExpirationCallback = handler;
  }

  // Called by API interceptor when token expires
  onTokenExpired() {
    if (this.handleTokenExpirationCallback) {
      this.handleTokenExpirationCallback();
    } else {
      // Fallback if handler is not set
      console.warn('Token expired but no handler registered, redirecting to login');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }

  // Check if token is expired without making API call
  isTokenExpired() {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return true;

      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return true;

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp && payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
}

// Create singleton instance
const authManager = new AuthManager();
export default authManager; 