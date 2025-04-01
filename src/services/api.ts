import axios from 'axios';

// Create axios instance with base URL
// In Vite, we need to use import.meta.env instead of process.env
// Fall back to deployed Render backend URL if environment variable is not available
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';

// Key constants for storage - must match those in AuthContext
export const AUTH_TOKEN_KEY = 'token';
export const AUTH_USER_KEY = 'auth_user';

console.log("Using API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized error, clear the token and redirect to login
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized response, clearing token');
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      
      // Only redirect to login if we're not already on the login page to avoid loops
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/verify-email')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authApi = {
  // Register with email and password
  register: async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await api.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },

  // Login with email and password
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  // Twitter direct authentication (for development)
  twitterAuth: async (userData: { name: string; twitterId: string; email?: string; profileImage?: string }) => {
    const response = await api.post('/auth/twitter-auth', userData);
    return response.data;
  },

  // Get current user with retry for cross-domain logins
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // If we get a 401 error, check if token exists but failed
      if (error.response?.status === 401 && localStorage.getItem(AUTH_TOKEN_KEY)) {
        console.log('Token exists but failed to authenticate - might be cross-domain login issue');
        // Get token and try one more time with explicit header
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          try {
            const retryResponse = await axios.get(`${API_URL}/auth/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            return retryResponse.data;
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            // Clear storage if retry fails
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
            throw retryError;
          }
        }
      }
      throw error;
    }
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
};

// Onboarding services
export const onboardingApi = {
  // Complete onboarding 
  completeOnboarding: async () => {
    const response = await api.post('/onboarding/complete');
    return response.data;
  },
  
  // Save onboarding data
  saveOnboarding: async (onboardingData: any) => {
    const response = await api.post('/onboarding', onboardingData);
    return response.data;
  },

  // Get onboarding data
  getOnboarding: async () => {
    const response = await api.get('/onboarding');
    return response.data;
  },

  // Update theme preference
  updateTheme: async (theme: 'light' | 'dark') => {
    const response = await api.put('/onboarding/theme', { theme });
    return response.data;
  },

  // Update language preference
  updateLanguage: async (language: 'english' | 'german') => {
    const response = await api.put('/onboarding/language', { language });
    return response.data;
  },
};

export default api; 