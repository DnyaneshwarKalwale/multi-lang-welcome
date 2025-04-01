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

  // Twitter direct authentication (for development)
  twitterAuth: async (userData: { name: string; twitterId: string; email?: string; profileImage?: string }) => {
    const response = await api.post('/auth/twitter-auth', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
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

// User profile services
export const userApi = {
  // Update user profile
  updateProfile: async (profileData: { firstName?: string; lastName?: string; profilePicture?: string }) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  // Update user password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/change-password', { currentPassword, newPassword });
    return response.data;
  },
  
  // Delete user account
  deleteAccount: async () => {
    const response = await api.delete('/users');
    return response.data;
  },
  
  // Upload profile picture
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/upload/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data;
  }
};

export default api; 