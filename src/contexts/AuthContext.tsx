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
  isAuthReady: boolean; // New state to track when auth is fully ready
  linkedinAuth: (userData: { name: string; linkedinId: string; email: string; profileImage?: string }) => Promise<void>;
  googleAuth: (userData: { name: string; googleId: string; email: string; profileImage?: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchUser: (forceRefresh?: boolean) => Promise<User | undefined>;
  updateUserProfile: (updates: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(tokenManager.getToken(localStorage.getItem('auth-method') || undefined));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // New state
  const navigate = useNavigate();

  // Optimized fetch user function with refresh capability
  const fetchUser = async (forceRefresh: boolean = false) => {
    const authMethod = localStorage.getItem('auth-method');
    const token = authMethod ? tokenManager.getToken(authMethod) : null;
    
    if (!token) {
      setLoading(false);
      setIsAuthReady(true); // Mark as ready even if no token
      return null;
    }
    
    try {
      console.log('AuthContext - fetchUser - Fetching user data with token', { forceRefresh });
      const { user } = await authApi.getCurrentUser();
      
      // Always update user state when we get user data
      if (user) {
        console.log('AuthContext - fetchUser - User data received', { 
          id: user.id, 
          email: user.email,
          linkedinConnected: user.linkedinConnected,
          onboardingCompleted: user.onboardingCompleted 
        });
        
        // Force update the user state to ensure all components get fresh data
        setUser({ ...user });
        
        // Make sure localStorage accurately reflects the user's onboarding status from server
        localStorage.setItem('onboardingCompleted', user.onboardingCompleted.toString());
        console.log(`Setting onboardingCompleted to ${user.onboardingCompleted}`);
        
        // If LinkedIn was just connected and onboarding is completed, ensure localStorage is updated
        if (user.linkedinConnected && user.onboardingCompleted) {
          localStorage.setItem('onboardingCompleted', 'true');
        }
        
        setIsAuthReady(true); // Mark as ready after user data is loaded
        return user;
      } else {
        console.log('AuthContext - fetchUser - No user data returned from API');
        // Clear tokens if no user data returned
        tokenManager.clearAllTokens();
        setUser(null);
        setToken(null);
        setIsAuthReady(true); // Mark as ready even if no user
        return null;
      }
    } catch (error) {
      console.error("Failed to get user data:", error);
      // Clear tokens on error
      tokenManager.clearAllTokens();
      setUser(null);
      setToken(null);
      setIsAuthReady(true); // Mark as ready even on error
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
        setIsAuthReady(true); // Mark as ready if no token
        return;
      }
      
      try {
        const { user } = await authApi.getCurrentUser();
        if (user) {
          setUser(user);
          localStorage.setItem('onboardingCompleted', user.onboardingCompleted ? 'true' : 'false');
        } else {
          // If API returns success but no user, clear token
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
        setIsAuthReady(true); // Mark as ready after initial auth check
      }
    };
    
    checkAuthStatus();
  }, []);

  const linkedinAuth = async (userData: { name: string; linkedinId: string; email: string; profileImage?: string }) => {
    setLoading(true);
    setIsAuthReady(false); // Reset auth ready state during login
    
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
      setIsAuthReady(true); // Mark as ready after login attempt
    }
  };

  const googleAuth = async (userData: { name: string; googleId: string; email: string; profileImage?: string }) => {
    setLoading(true);
    setIsAuthReady(false); // Reset auth ready state during login
    
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
      setIsAuthReady(true); // Mark as ready after login attempt
    }
  };

  const logout = () => {
    // Clear all tokens
    tokenManager.clearAllTokens();
    // Clear all localStorage items related to auth
    localStorage.removeItem('auth-method');
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('linkedin-login-token');
    localStorage.removeItem('google-login-token');
    localStorage.removeItem('onboardingStep');
    localStorage.removeItem('redirectAfterAuth');
    localStorage.removeItem('pendingInvitationToken');
    // Clear user state
    setUser(null);
    setToken(null);
    setIsAuthReady(false); // Reset auth ready state
    // Navigate to home
    navigate('/');
  };

  const clearError = () => setError(null);

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      console.log('AuthContext - updateUserProfile - Updating user profile:', updates);
      setUser({ ...user, ...updates });
      
      // Update localStorage if onboarding status changes
      if (updates.onboardingCompleted !== undefined) {
        localStorage.setItem('onboardingCompleted', updates.onboardingCompleted.toString());
      }
      
      // Update localStorage if LinkedIn connection status changes
      if (updates.linkedinConnected !== undefined) {
        localStorage.setItem('linkedinConnected', updates.linkedinConnected.toString());
      }
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
        isAuthReady, // Add the new state
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
