import axios from 'axios';

// Create axios instance with base URL
// In Vite, we need to use import.meta.env instead of process.env
// Fall back to deployed Render backend URL if environment variable is not available
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';

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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
    const response = await api.post('/auth/login', {
      email,
      password,
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

export default api; 