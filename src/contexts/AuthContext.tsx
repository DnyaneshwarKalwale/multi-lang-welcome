import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  profilePicture?: string;
  authMethod: 'email' | 'google' | 'twitter';
  lastOnboardingStep?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  twitterAuth: (userData: { name: string; twitterId: string; email?: string; profileImage?: string }) => Promise<void>;
  googleAuth: (userData: { name: string; googleId: string; email: string; profileImage?: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<User | null>;
  checkEmailExists: (email: string) => Promise<boolean>;
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
  const { toast } = useToast();

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

  // Check if email exists
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await authApi.checkEmailExists(email);
      return response.exists;
    } catch (error) {
      console.error("Error checking if email exists:", error);
      return false;
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
      
      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive"
        });
        setError("An account with this email already exists. Please log in instead.");
        return;
      }
      
      const response = await authApi.register(firstName, lastName, email, password);
      
      // For email registration, don't set token yet since email verification is required
      // We just redirect to verification page and show instructions
      navigate('/verify-email', { state: { email }, replace: true });
      
      return response;
    } catch (err: any) {
      // Check if this is a duplicate email error from the server
      if (err.response?.data?.error?.includes('already exists')) {
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive"
        });
        setError("An account with this email already exists. Please log in instead.");
      } else {
        setError(err.response?.data?.error || 'Registration failed');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle onboarding continuation
  const continueOnboarding = (userData: User) => {
    if (userData.onboardingCompleted) {
      // If onboarding is complete, go to dashboard with replace:true to prevent back navigation
      navigate('/dashboard', { replace: true });
    } else {
      // If user has a saved onboarding step, navigate to it
      if (userData.lastOnboardingStep) {
        navigate(`/onboarding/${userData.lastOnboardingStep}`, { replace: true });
      } else {
        // Otherwise, start from the beginning
        navigate('/onboarding/welcome', { replace: true });
      }
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
      
      // Continue onboarding or go to dashboard
      continueOnboarding(response.user);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Google auth direct method
  const googleAuth = async (userData: { name: string; googleId: string; email: string; profileImage?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Starting Google auth with data:", userData);
      
      // Extract first and last name
      const nameParts = userData.name.split(' ');
      const firstName = nameParts[0] || 'Google';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';
      
      // Create a mock response like we'd get from the API
      const mockResponse = {
        token: `mock_google_token_${Date.now()}`,
        user: {
          id: userData.googleId,
          firstName: firstName,
          lastName: lastName,
          email: userData.email,
          isEmailVerified: true, // Google users are always verified
          profilePicture: userData.profileImage || null,
          authMethod: 'google',
          onboardingCompleted: true, // Mark onboarding as completed for social logins
          lastOnboardingStep: 'dashboard'
        }
      };
      
      localStorage.setItem(AUTH_TOKEN_KEY, mockResponse.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockResponse.user));
      setUser(mockResponse.user as any);
      
      // Go directly to dashboard
      navigate('/dashboard', { replace: true });
      
      toast({
        title: "Login successful",
        description: "Welcome back to Scripe!",
      });
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google authentication failed');
      console.error('Google auth error:', err);
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
      
      // Extract first and last name
      const nameParts = userData.name.split(' ');
      const firstName = nameParts[0] || 'Twitter';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';
      
      // For development, create a mock response
      const mockResponse = {
        token: `mock_twitter_token_${Date.now()}`,
        user: {
          id: userData.twitterId,
          firstName: firstName,
          lastName: lastName,
          email: userData.email || `twitter_${userData.twitterId}@example.com`,
          isEmailVerified: true, // Twitter users don't need verification
          profilePicture: userData.profileImage || null,
          authMethod: 'twitter',
          onboardingCompleted: true, // Mark onboarding as completed for social logins
          lastOnboardingStep: 'dashboard'
        }
      };
      
      localStorage.setItem(AUTH_TOKEN_KEY, mockResponse.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockResponse.user));
      setUser(mockResponse.user as any);
      
      // Go directly to dashboard
      navigate('/dashboard', { replace: true });
      
      toast({
        title: "Login successful",
        description: "Welcome back to Scripe!",
      });
      
      return;
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
        googleAuth,
        logout,
        clearError,
        refreshUser,
        checkEmailExists,
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