import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define the User type
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  language: string;
  role?: string;
  authMethod?: string;
  twitterId?: string;
}

// Define the AuthContext type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void | User>;
  twitterAuth: (userData: { name: string; twitterId: string; email?: string; profileImage?: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchUser: () => Promise<User | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Optimized fetch user function
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const { user } = await authApi.getCurrentUser();
      setUser(user);
      
      if (user) {
        localStorage.setItem('onboardingCompleted', user.onboardingCompleted ? 'true' : 'false');
      }
      
      return user;
    } catch (error) {
      console.error("Failed to get user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const { user } = await authApi.getCurrentUser();
        setUser(user);
        localStorage.setItem('onboardingCompleted', user.onboardingCompleted ? 'true' : 'false');
      } catch (error) {
        console.error("Failed to get user data:", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register(firstName, lastName, email, password);
      
      setUser(response.user);
      
      localStorage.setItem('pendingVerificationEmail', email);
      
      navigate('/verify-email');
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login(email, password);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      localStorage.setItem('onboardingCompleted', response.user.onboardingCompleted || false ? 'true' : 'false');
      
      return response.user;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const twitterAuth = async (userData: { name: string; twitterId: string; email?: string; profileImage?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const response = await authApi.twitterAuth(userData);
        
        localStorage.setItem('token', response.token);
        setUser(response.user);
        
        // Immediately redirect based on onboarding status
        if (!response.user.onboardingCompleted) {
          navigate('/onboarding/welcome', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        return;
      } catch (apiErr: any) {
        console.log("API approach failed, trying browser redirect:", apiErr);
        
        if (apiErr.message && apiErr.message.includes('Network Error')) {
          const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
          const baseUrl = baseApiUrl.replace('/api', '');
          
          const params = new URLSearchParams();
          params.append('name', userData.name);
          params.append('twitterId', userData.twitterId);
          
          if (userData.email) {
            params.append('email', userData.email);
          }
          
          if (userData.profileImage) {
            params.append('profileImage', userData.profileImage);
          }
          
          window.location.href = `${baseUrl}/api/auth/mock-twitter-auth?${params.toString()}`;
          return;
        }
        
        throw apiErr;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Twitter authentication failed');
      console.error('Twitter auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/', { replace: true });
  };

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
