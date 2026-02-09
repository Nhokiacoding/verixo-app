// API Base Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API Helper function for backend calls
const backendRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('Backend API request failed:', error);
    throw error;
  }
};

// Services API - Get available USA services
export const servicesAPI = {
  // Get available services with pricing
  getServices: async () => {
    try {
      const response = await backendRequest('/services');
      return response.data?.services || response.services || [];
    } catch (error) {
      console.error('Failed to fetch services:', error);
      throw error;
    }
  },

  // Get USA specific services
  getUSAServices: async () => {
    try {
      const response = await backendRequest('/services/usa');
      return response.data?.services || response.services || [];
    } catch (error) {
      console.error('Failed to fetch USA services:', error);
      // Return fallback USA services if backend fails
      return [
        {
          id: 'wa',
          serviceCode: 'wa',
          name: 'WhatsApp',
          icon: '📱',
          description: 'Instant verification for WhatsApp accounts',
          popular: true,
          price: 3200
        },
        {
          id: 'tg',
          serviceCode: 'tg',
          name: 'Telegram',
          icon: '✈️',
          description: 'Fast activation for Telegram accounts',
          popular: true,
          price: 3500
        }
      ];
    }
  },
};

// Numbers API - Purchase and manage numbers
export const numbersAPI = {
  // Purchase a USA number through backend
  purchaseNumber: async (serviceCode) => {
    try {
      const response = await backendRequest('/numbers/purchase', {
        method: 'POST',
        body: JSON.stringify({ 
          serviceCode
          // No country parameter needed - backend handles USA by default
        }),
      });
      
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      console.error('Failed to purchase number:', error);
      throw error;
    }
  },
  
  // Check SMS status for a purchased number
  checkSMSStatus: async (numberId) => {
    try {
      const response = await backendRequest(`/numbers/${numberId}/sms`);
      
      return {
        success: true,
        status: response.data?.status || 'pending',
        codes: response.data?.smsCodes || []
      };
    } catch (error) {
      console.error('Failed to check SMS status:', error);
      throw error;
    }
  },
  
  // Get SMS codes for a number
  getSMSCodes: async (numberId) => {
    try {
      const response = await backendRequest(`/numbers/${numberId}/codes`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Failed to get SMS codes:', error);
      throw error;
    }
  },
  
  // Cancel order and get refund
  cancelOrder: async (numberId) => {
    try {
      const response = await backendRequest(`/numbers/${numberId}/cancel`, {
        method: 'DELETE',
      });
      
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  },

  // Get user's recent purchases
  getRecentPurchases: async () => {
    try {
      const response = await backendRequest('/numbers/recent');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Failed to get recent purchases:', error);
      throw error;
    }
  }
};

// User API
export const userAPI = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await backendRequest('/users/profile');
      return response;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  },

  // Get dashboard data
  getDashboardData: async () => {
    try {
      const response = await backendRequest('/users/dashboard');
      return response;
    } catch (error) {
      console.error('Failed to get dashboard data:', error);
      throw error;
    }
  },

  // Get wallet balance
  getWalletBalance: async () => {
    try {
      const response = await backendRequest('/wallet/balance');
      return response.data?.balance || 0;
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return 0;
    }
  }
};

// Service code mapping for display
export const SERVICE_MAPPING = {
  'wa': {
    name: 'WhatsApp',
    icon: '📱',
    description: 'Instant verification for WhatsApp accounts',
    popular: true
  },
  'tg': {
    name: 'Telegram',
    icon: '✈️',
    description: 'Fast activation for Telegram accounts',
    popular: false
  },
  'ig': {
    name: 'Instagram',
    icon: '📷',
    description: 'Premium numbers for Instagram verification',
    popular: false
  },
  'fb': {
    name: 'Facebook',
    icon: '👥',
    description: 'Quick verification for Facebook accounts',
    popular: false
  },
  'tw': {
    name: 'Twitter/X',
    icon: '🐦',
    description: 'Verified numbers for Twitter/X accounts',
    popular: false
  },
  'tt': {
    name: 'TikTok',
    icon: '🎵',
    description: 'Premium service for TikTok verification',
    popular: false
  }
};

// Error handling utility
export const handleAPIError = (error) => {
  let message = 'An error occurred. Please try again.';
  
  if (error.message) {
    message = error.message;
  }
  
  // Handle specific error cases
  if (message.includes('unauthorized') || message.includes('invalid token')) {
    message = 'Authentication failed. Please login again.';
  } else if (message.includes('insufficient')) {
    message = 'Insufficient balance. Please fund your wallet first.';
  } else if (message.includes('not available')) {
    message = 'Service is currently not available. Please try again later.';
  } else if (message.includes('401')) {
    message = 'Please login to continue.';
  } else if (message.includes('403')) {
    message = 'Access denied. Please check your permissions.';
  } else if (message.includes('500')) {
    message = 'Server error. Please try again later.';
  }
  
  return message;
};

// Local storage helpers for managing active numbers
export const activeNumbersStorage = {
  // Get active numbers from localStorage
  getActiveNumbers: () => {
    try {
      const stored = localStorage.getItem('activeNumbers');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get active numbers:', error);
      return [];
    }
  },
  
  // Add a new active number
  addActiveNumber: (numberData) => {
    try {
      const activeNumbers = activeNumbersStorage.getActiveNumbers();
      const newNumber = {
        id: numberData.id || numberData.activationId,
        number: numberData.phoneNumber || numberData.number,
        service: numberData.service,
        serviceCode: numberData.serviceCode,
        activationId: numberData.activationId || numberData.id,
        purchaseTime: new Date().toISOString(),
        status: 'active',
        codes: []
      };
      
      activeNumbers.push(newNumber);
      localStorage.setItem('activeNumbers', JSON.stringify(activeNumbers));
      return newNumber;
    } catch (error) {
      console.error('Failed to add active number:', error);
      throw error;
    }
  },
  
  // Update number with received SMS code
  updateNumberWithCode: (activationId, code) => {
    try {
      const activeNumbers = activeNumbersStorage.getActiveNumbers();
      const numberIndex = activeNumbers.findIndex(n => n.activationId === activationId);
      
      if (numberIndex !== -1) {
        const newCode = {
          id: Date.now(),
          code: code,
          service: activeNumbers[numberIndex].service,
          time: new Date().toISOString(),
          status: 'received'
        };
        
        activeNumbers[numberIndex].codes.push(newCode);
        activeNumbers[numberIndex].status = 'completed';
        
        localStorage.setItem('activeNumbers', JSON.stringify(activeNumbers));
        return activeNumbers[numberIndex];
      }
      
      return null;
    } catch (error) {
      console.error('Failed to update number with code:', error);
      throw error;
    }
  },
  
  // Remove a number
  removeNumber: (activationId) => {
    try {
      const activeNumbers = activeNumbersStorage.getActiveNumbers();
      const filteredNumbers = activeNumbers.filter(n => n.activationId !== activationId);
      localStorage.setItem('activeNumbers', JSON.stringify(filteredNumbers));
    } catch (error) {
      console.error('Failed to remove number:', error);
      throw error;
    }
  }
};

// Main API service object
const apiService = {
  ...servicesAPI,
  ...numbersAPI,
  ...userAPI,
  handleAPIError,
  activeNumbersStorage,
  SERVICE_MAPPING,
  
  // Convenience methods
  getServices: servicesAPI.getServices,
  getUSAServices: servicesAPI.getUSAServices,
  purchaseNumber: numbersAPI.purchaseNumber,
  checkSMSStatus: numbersAPI.checkSMSStatus,
  getSMSCodes: numbersAPI.getSMSCodes,
  cancelOrder: numbersAPI.cancelOrder,
  getRecentPurchases: numbersAPI.getRecentPurchases,
  getUserProfile: userAPI.getUserProfile,
  getDashboardData: userAPI.getDashboardData,
  getWalletBalance: userAPI.getWalletBalance
};

export default apiService;
