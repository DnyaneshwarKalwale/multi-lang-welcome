import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define user type
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  onboardingCompleted?: boolean;
  profilePicture?: string;
  linkedInId?: string;
  googleId?: string; // Added for Google auth
};

// Define context type
type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string;
  isAuthenticated: boolean;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchUser: () => Promise<User | null>;
  linkedInAuth: () => Promise<void>;
  googleAuth: () => Promise<void>; // Added Google auth method
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  error: "",
  isAuthenticated: false,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  clearError: () => {},
  fetchUser: async () => null,
  linkedInAuth: async () => {},
  googleAuth: async () => {}, // Added default value
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(); // Fetch user data if token exists
    }
  }, []);

  // Register new user
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      // Simulating API call - replace with actual API call
      const response = await new Promise<{token: string, user: User}>((resolve) => {
        setTimeout(() => {
          resolve({
            token: "dummy-token-for-new-user",
            user: {
              id: `user-${Math.random().toString(36).substr(2, 9)}`,
              email,
              firstName,
              lastName,
              onboardingCompleted: false // Initialize as false for new users
            }
          });
        }, 1000);
      });
      
      localStorage.setItem("authToken", response.token);
      setToken(response.token);
      setUser(response.user);
      setLoading(false);
      toast.success("Registration successful!");
    } catch (err) {
      setError("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      // Simulating API call - replace with actual API call
      const response = await new Promise<{token: string, user: User}>((resolve, reject) => {
        setTimeout(() => {
          if (email.includes("error")) {
            reject(new Error("Invalid credentials"));
            return;
          }
          resolve({
            token: "dummy-token-for-login",
            user: {
              id: `user-${Math.random().toString(36).substr(2, 9)}`,
              email,
              firstName: "Demo",
              lastName: "User",
              onboardingCompleted: false // Default value
            }
          });
        }, 1000);
      });
      
      localStorage.setItem("authToken", response.token);
      setToken(response.token);
      setUser(response.user);
      setLoading(false);
      toast.success("Login successful!");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      toast.error("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };
  
  // LinkedIn auth method
  const linkedInAuth = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulating API call - replace with actual API call
      const response = await new Promise<{token: string, user: User}>((resolve) => {
        setTimeout(() => {
          resolve({
            token: "dummy-token-for-linkedin-auth",
            user: {
              id: `user-${Math.random().toString(36).substr(2, 9)}`,
              email: "linkedin-user@example.com",
              firstName: "LinkedIn",
              lastName: "User",
              linkedInId: "12345678",
              profilePicture: "https://via.placeholder.com/150",
              onboardingCompleted: false
            }
          });
        }, 1000);
      });
      
      localStorage.setItem("authToken", response.token);
      setToken(response.token);
      setUser(response.user);
      setLoading(false);
      toast.success("LinkedIn authentication successful!");
    } catch (err) {
      setError("LinkedIn authentication failed. Please try again.");
      toast.error("LinkedIn authentication failed. Please try again.");
      setLoading(false);
    }
  };

  // Google auth method
  const googleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulating API call - replace with actual API call
      const response = await new Promise<{token: string, user: User}>((resolve) => {
        setTimeout(() => {
          resolve({
            token: "dummy-token-for-google-auth",
            user: {
              id: `user-${Math.random().toString(36).substr(2, 9)}`,
              email: "google-user@example.com",
              firstName: "Google",
              lastName: "User",
              googleId: "g-12345678",
              profilePicture: "https://via.placeholder.com/150",
              onboardingCompleted: false
            }
          });
        }, 1000);
      });
      
      localStorage.setItem("authToken", response.token);
      setToken(response.token);
      setUser(response.user);
      setLoading(false);
      toast.success("Google authentication successful!");
    } catch (err) {
      setError("Google authentication failed. Please try again.");
      toast.error("Google authentication failed. Please try again.");
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    toast.info("You have been logged out");
  };

  // Clear error
  const clearError = () => {
    setError("");
  };

  // Fetch user data
  const fetchUser = async () => {
    setLoading(true);
    try {
      // Simulating API call - replace with actual API call
      const userData = await new Promise<User>((resolve) => {
        setTimeout(() => {
          resolve({
            id: `user-${Math.random().toString(36).substr(2, 9)}`,
            email: "demo@example.com",
            firstName: "Demo",
            lastName: "User",
            onboardingCompleted: false,
            profilePicture: "https://via.placeholder.com/150"
          });
        }, 1000);
      });
      
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (err) {
      setError("Failed to fetch user data.");
      setLoading(false);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token,
        register,
        login,
        logout,
        clearError,
        fetchUser,
        linkedInAuth,
        googleAuth, // Added Google auth method
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
