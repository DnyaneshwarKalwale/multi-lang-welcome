import axios from 'axios';

// Create axios instance with base URL
// In Vite, we need to use import.meta.env instead of process.env
// Fall back to localhost if environment variable is not available during development
export const API_URL = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';

console.log("Using API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Helper functions for token management
export const tokenManager = {
  // Store token by auth method
  storeToken: (token: string, authMethod: 'linkedin' | 'google'): void => {
    // Store the token with the correct key
    localStorage.setItem(`${authMethod}-login-token`, token);
    
    // Record the auth method
    localStorage.setItem('auth-method', authMethod);
  },
  
  // Get token by auth method
  getToken: (authMethod?: string): string | null => {
    const currentAuthMethod = authMethod || localStorage.getItem('auth-method');
    
    // If we have a specific auth method, get that token
    if (currentAuthMethod) {
      return localStorage.getItem(`${currentAuthMethod}-login-token`);
    }
    
    return null;
  },
  
  // Clear all tokens
  clearAllTokens: (): void => {
    localStorage.removeItem('linkedin-login-token');
    localStorage.removeItem('google-login-token');
    localStorage.removeItem('auth-method');
  }
};

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    // Determine which token to use based on the API endpoint
    let token;
    
    // Match token by endpoint
    if (config.url?.includes('/linkedin')) {
      // Always use LinkedIn token for LinkedIn endpoints
      token = localStorage.getItem('linkedin-login-token');
    } else if (config.url?.includes('/google')) {
      token = localStorage.getItem('google-login-token');
    } else {
      // Use token based on current auth method
      const authMethod = localStorage.getItem('auth-method');
      if (authMethod) {
        token = localStorage.getItem(`${authMethod}-login-token`);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authApi = {
  // Register with email and password (switched to use LinkedIn auth)
  register: async (firstName: string, lastName: string, email: string, password: string) => {
    // Instead of directly storing email credentials, we'll redirect to LinkedIn auth
    // This is just a mock implementation since we're removing email auth
    const response = await api.post('/auth/register-redirect', {
      firstName,
      lastName,
      email,
      redirectToLinkedIn: true
    });
    return response.data;
  },

  // Login with LinkedIn instead of email/password
  login: async (email: string, password: string) => {
    // Redirect to LinkedIn auth instead of email login
    // This is just a mock implementation since we're removing email auth
    const response = await api.post('/auth/login-redirect', {
      redirectToLinkedIn: true
    });
    return response.data;
  },

  // LinkedIn direct authentication (for development)
  linkedinAuth: async (userData: { name: string; linkedinId: string; email: string; profileImage?: string }) => {
    const response = await api.post('/auth/linkedin-auth', userData);
    return response.data;
  },

  // Google authentication
  googleAuth: async (userData: { name: string; googleId: string; email: string; profileImage?: string }) => {
    const response = await api.post('/auth/google-auth', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verify email with token (legacy)
  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },
  
  // Verify email with OTP
  verifyOTP: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },
  
  // Resend OTP
  resendOTP: async (email: string) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },
};

// Onboarding services
export const onboardingApi = {
  // Save onboarding data
  saveOnboarding: async (onboardingData: any) => {
    const response = await api.post('/onboarding', onboardingData);
    return response.data;
  },

  // Get onboarding data
  getOnboarding: async () => {
    const response = await api.get('/onboarding');
    return response.data;
  }
};

// Stripe services
export const stripeApi = {
  // Create a checkout session for subscription plans
  createCheckoutSession: async (planId: string, successUrl: string, cancelUrl: string) => {
    const response = await api.post('/stripe/create-checkout-session', {
      planId,
      successUrl,
      cancelUrl
    });
    return response.data;
  },

  // Create a checkout session for credit packs
  createCreditCheckout: async (packId: string, packPrice: number, packCredits: number, successUrl: string, cancelUrl: string) => {
    const response = await api.post('/stripe/create-credit-checkout', {
      packId,
      packPrice,
      packCredits,
      successUrl,
      cancelUrl
    });
    return response.data;
  },

  // Get user subscription details
  getUserSubscription: async () => {
    const response = await api.get('/users/subscription');
    return response.data;
  }
};

export default api; 