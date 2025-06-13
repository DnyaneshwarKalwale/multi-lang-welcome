import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, tokenManager } from "@/services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define the User type
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  language: string;
  role?: string;
  authMethod?: string;
  linkedinId?: string;
  linkedinAccessToken?: string;
  linkedinConnected?: boolean;
  googleId?: string;
  googleAccessToken?: string;
}

// Define the AuthContext type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  linkedinAuth: (userData: { name: string; linkedinId: string; email: string; profileImage?: string }) => Promise<void>;
  googleAuth: (userData: { name: string; googleId: string; email: string; profileImage?: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchUser: () => Promise<User | undefined>;
  updateUserProfile: (updates: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(tokenManager.getToken(localStorage.getItem('auth-method') || undefined));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Optimized fetch user function
  const fetchUser = async () => {
    const authMethod = localStorage.getItem('auth-method');
    const token = authMethod ? tokenManager.getToken(authMethod) : null;
    
    if (!token) {
      setLoading(false);
      return null;
    }
    
    try {
      console.log('AuthContext - fetchUser - Fetching user data with token');
      const { user } = await authApi.getCurrentUser();
      
      // Always update user state when we get user data
      if (user) {
        console.log('AuthContext - fetchUser - User data received', { id: user.id, email: user.email });
        setUser(user);
        // Make sure localStorage accurately reflects the user's onboarding status from server
        localStorage.setItem('onboardingCompleted', user.onboardingCompleted.toString());
        console.log(`Setting onboardingCompleted to ${user.onboardingCompleted}`);
      } else {
        console.log('AuthContext - fetchUser - No user data returned from API');
      }
      
      return user;
    } catch (error) {
      console.error("Failed to get user data:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authMethod = localStorage.getItem('auth-method');
      const token = authMethod ? tokenManager.getToken(authMethod) : null;
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const { user } = await authApi.getCurrentUser();
        if (user) {
          setUser(user);
          localStorage.setItem('onboardingCompleted', user.onboardingCompleted ? 'true' : 'false');
          console.log('AuthContext - checkAuthStatus - User loaded on init', { id: user.id, email: user.email });
        } else {
          // If API returns success but no user, clear token
          console.warn('AuthContext - checkAuthStatus - API returned no user data');
          tokenManager.clearAllTokens();
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Failed to get user data:", error);
        // Clear auth method token on failure
        if (authMethod) {
          console.warn('AuthContext - checkAuthStatus - Clearing tokens due to API error');
          tokenManager.clearAllTokens();
          setUser(null);
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const linkedinAuth = async (userData: { name: string; linkedinId: string; email: string; profileImage?: string }) => {
    setLoading(true);
    
    try {
      const response = await authApi.linkedinAuth(userData);
      
      if (response.token) {
        tokenManager.storeToken(response.token, 'linkedin');
        setToken(response.token);
        
        if (response.user) {
          setUser(response.user);
          localStorage.setItem('onboardingCompleted', response.user.onboardingCompleted ? 'true' : 'false');
          localStorage.setItem('auth-method', 'linkedin');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'LinkedIn authentication failed');
      console.error('LinkedIn auth error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async (userData: { name: string; googleId: string; email: string; profileImage?: string }) => {
    setLoading(true);
    
    try {
      const response = await authApi.googleAuth(userData);
      
      if (response.token) {
        tokenManager.storeToken(response.token, 'google');
        setToken(response.token);
        
        if (response.user) {
          setUser(response.user);
          localStorage.setItem('onboardingCompleted', response.user.onboardingCompleted ? 'true' : 'false');
          localStorage.setItem('auth-method', 'google');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google authentication failed');
      console.error('Google auth error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    tokenManager.clearAllTokens();
    localStorage.removeItem('auth-method');
    localStorage.removeItem('onboardingCompleted');
    setUser(null);
    setToken(null);
    navigate('/');
  };

  const clearError = () => setError(null);

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        error,
        linkedinAuth,
        googleAuth,
        logout,
        clearError,
        fetchUser,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
