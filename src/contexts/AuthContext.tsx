import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  profilePicture?: string;
  authMethod: 'email' | 'google' | 'twitter';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  twitterAuth: (userData: { name: string; twitterId: string; email?: string; profileImage?: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Try to initialize user from localStorage if available
  const getStoredUser = (): User | null => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return null;
    }
  };

  const [user, setUser] = useState<User | null>(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Set up axios interceptor for authentication
  useEffect(() => {
    // Set up request interceptor to include auth token
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // Helper function to refresh user data
  const refreshUser = async (): Promise<User | null> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setUser(null);
      return null;
    }
    
    try {
      const { user } = await authApi.getCurrentUser();
      
      // Update localStorage with the latest user data
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      
      setUser(user);
      return user;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      setUser(null);
      return null;
    }
  };

  // Check if user is already logged in on initial load
  useEffect(() => {
    // Ignore repeated auth checks
    if (authChecked) return;
    
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        await refreshUser();
      } catch (error) {
        console.error("Error during auth check:", error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    
    checkAuthStatus();
  }, [authChecked]);

  // Register new user
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register(firstName, lastName, email, password);
      
      // For email registration, don't set token yet since email verification is required
      // We just redirect to verification page and show instructions
      navigate('/verify-email', { state: { email }, replace: true });
      
      return response;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login user with improved error handling and proper redirection
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login(email, password);
      
      // Save auth token and user data
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
      
      // Update user state
      setUser(response.user);

      // Handle email verification check for email auth method only
      if (response.user.authMethod === 'email' && !response.user.isEmailVerified) {
        navigate('/verify-email', { state: { email }, replace: true });
        return;
      }
      
      // Redirect based on onboarding status
      if (!response.user.onboardingCompleted) {
        navigate('/onboarding/welcome', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Twitter auth (for development without OAuth)
  const twitterAuth = async (userData: { name: string; twitterId: string; email?: string; profileImage?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Starting Twitter auth with data:", userData);
      
      // Try the direct API approach first
      try {
        const response = await authApi.twitterAuth(userData);
        
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
        setUser(response.user);
        
        // Redirect based on onboarding status
        if (!response.user.onboardingCompleted) {
          navigate('/onboarding/welcome', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        return;
      } catch (apiErr: any) {
        console.log("API approach failed, trying browser redirect:", apiErr);
        
        // If CORS error, try browser redirect approach instead
        if (apiErr.message && apiErr.message.includes('Network Error')) {
          // Use environment variable or fallback to Render URL
          const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
          const baseUrl = baseApiUrl.replace('/api', '');
          
          // Build URL parameters properly
          const params = new URLSearchParams();
          params.append('name', userData.name);
          params.append('twitterId', userData.twitterId);
          
          if (userData.email) {
            params.append('email', userData.email);
          }
          
          if (userData.profileImage) {
            params.append('profileImage', userData.profileImage);
          }
          
          // Redirect browser to the auth endpoint
          window.location.href = `${baseUrl}/api/auth/mock-twitter-auth?${params.toString()}`;
          return;
        }
        
        // If not a CORS error, rethrow
        throw apiErr;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Twitter authentication failed');
      console.error('Twitter auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
    navigate('/', { replace: true });
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        twitterAuth,
        logout,
        clearError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 