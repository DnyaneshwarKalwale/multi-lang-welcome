import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/services/api";
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
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch current user data
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }
    
    try {
      const { user } = await authApi.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error("Failed to get user data:", error);
    }
  };

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const { user } = await authApi.getCurrentUser();
          setUser(user);
        } catch (error) {
          console.error("Failed to get user data:", error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // Register new user
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register(firstName, lastName, email, password);
      
      // For email registration, don't set token yet since email verification is required
      setUser(response.user);
      
      // Navigate to email verification page
      navigate('/verify-email', { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login(email, password);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      // Store onboarding info in localStorage
      if (response.user.onboardingCompleted) {
        localStorage.setItem('onboardingCompleted', 'true');
      } else {
        // Make sure we don't have stale data
        localStorage.setItem('onboardingCompleted', 'false');
      }
      
      // Don't navigate automatically - let the component handle navigation
      return response.user;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
      throw err;
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
        
        localStorage.setItem('token', response.token);
        setUser(response.user);
        
        // Redirect based on onboarding status
        if (!response.user.onboardingCompleted) {
          navigate('/onboarding/welcome');
        } else {
          navigate('/dashboard');
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
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
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
        fetchUser
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