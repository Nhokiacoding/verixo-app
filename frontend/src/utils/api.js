// API utility for making requests to the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('API Base URL:', this.baseURL); // Debug log
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Get default headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Handle API errors consistently
  handleAPIError(error) {
    console.error('API Error:', error);
    
    // Return user-friendly error message
    if (error.message.includes('Insufficient wallet balance')) {
      return 'Insufficient wallet balance. Please fund your wallet to continue.';
    }
    
    if (error.message.includes('Network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (error.message.includes('Server returned non-JSON') || error.message.includes('Unexpected token')) {
      return 'Server is temporarily unavailable. Please try again in a moment.';
    }
    
    if (error.message.includes('Failed to fetch')) {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    
    return error.message || 'An unexpected error occurred. Please try again.';
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.auth !== false),
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      // Check if response is ok first
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If can't parse JSON, use status text
          console.warn('Could not parse error response as JSON');
        }
        throw new Error(errorMessage);
      }
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Server returned non-JSON response:', contentType);
        throw new Error('Server returned non-JSON response. Please try again.');
      }

      const data = await response.json();
      console.log('API response:', data);
      return data;
      
    } catch (error) {
      console.error('API Request failed:', error);
      const friendlyError = this.handleAPIError(error);
      throw new Error(friendlyError);
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  // User-specific methods
  async getUserProfile() {
    return this.get('/user/profile');
  }

  async getDashboardData() {
    try {
      const [balance, transactions] = await Promise.all([
        this.get('/wallet/balance'),
        this.get('/wallet/transactions')
      ]);
      
      return {
        success: true,
        data: {
          activeNumbers: [],
          recentTransactions: transactions.transactions || [],
          monthlyStats: {
            numbers: {
              totalNumbers: 0,
              successfulVerifications: 0,
              totalSpent: 0
            }
          }
        }
      };
    } catch (error) {
      return {
        success: true,
        data: {
          activeNumbers: [],
          recentTransactions: [],
          monthlyStats: {
            numbers: {
              totalNumbers: 0,
              successfulVerifications: 0,
              totalSpent: 0
            }
          }
        }
      };
    }
  }

  async getServices() {
    return this.get('/services');
  }

  async purchaseNumber(serviceCode, country) {
    return this.post('/numbers/purchase', { serviceCode, country });
  }

  async getRecentPurchases() {
    return this.get('/numbers/recent');
  }

  async getSMSCodes(numberId) {
    return this.get(`/numbers/${numberId}/codes`);
  }

  // Wallet and transaction methods
  async getTransactions(page = 1, limit = 10, type = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(type && { type })
    });
    return this.get(`/wallet/transactions?${params}`);
  }

  async getWalletBalance() {
    return this.get('/wallet/balance');
  }

  // Payment methods
  async initializePayment(provider, amount, currency = 'NGN') {
    return this.post(`/payments/${provider}/initialize`, { amount, currency });
  }

  async verifyPayment(reference, provider) {
    return this.get(`/payments/${provider}/verify/${reference}`);
  }

  async getPaymentMethods() {
    return this.get('/payments/methods');
  }

  async calculatePaymentFees(amount, provider) {
    return this.post('/payments/calculate-fees', { amount, provider });
  }

  // Auth methods (no auth header needed)
  async login(email, password) {
    return this.post('/auth/login', { email, password }, { auth: false });
  }

  async register(userData) {
    return this.post('/auth/register', userData, { auth: false });
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email }, { auth: false });
  }

  async resetPassword(token, password) {
    return this.post('/auth/reset-password', { token, password }, { auth: false });
  }

  async verifyEmail(token) {
    return this.post('/auth/verify-email', { token }, { auth: false });
  }

  async resendVerification(email) {
    return this.post('/auth/resend-verification', { email }, { auth: false });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  getUserProfile,
  getServices,
  purchaseNumber,
  getRecentPurchases,
  getSMSCodes,
  getTransactions,
  getWalletBalance,
  initializePayment,
  verifyPayment,
  getPaymentMethods,
  calculatePaymentFees,
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification
} = apiService;
