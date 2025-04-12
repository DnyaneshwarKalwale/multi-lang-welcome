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
  linkedinId?: string;
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
  linkedinAuth: (userData: { name: string; linkedinId: string; email: string; profileImage?: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchUser: () => Promise<User | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
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
        // Make sure localStorage accurately reflects the user's onboarding status from server
        localStorage.setItem('onboardingCompleted', user.onboardingCompleted.toString());
        console.log(`Setting onboardingCompleted to ${user.onboardingCompleted}`);
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

  const linkedinAuth = async (userData: { name: string; linkedinId: string; email: string; profileImage?: string }) => {
    setLoading(true);
    
    try {
      const response = await authApi.linkedinAuth(userData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setUser(response.user);
        
        if (response.user) {
          localStorage.setItem('onboardingCompleted', response.user.onboardingCompleted ? 'true' : 'false');
        }
      } else {
        setError('Failed to authenticate with LinkedIn');
      }
    } catch (error) {
      console.error('LinkedIn Auth Error:', error);
      setError('Failed to authenticate with LinkedIn');
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
        token,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        linkedinAuth,
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
