
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user type
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  onboardingCompleted?: boolean; // Added this missing property
  profilePicture?: string; // Added this missing property
  twitterId?: string; // Added this missing property
};

// Define context type
type AuthContextType = {
  user: User | null;
  token: string | null; // This was missing
  loading: boolean;
  error: string;
  isAuthenticated: boolean;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchUser: () => Promise<User | null>;
  twitterAuth?: () => Promise<void>; // Added this missing property
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null, // Added default value
  loading: false,
  error: "",
  isAuthenticated: false,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  clearError: () => {},
  fetchUser: async () => null,
  twitterAuth: async () => {}, // Added default value
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Added token state
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
    } catch (err) {
      setError("Registration failed. Please try again.");
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
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };
  
  // Twitter auth mock
  const twitterAuth = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulating API call - replace with actual API call
      const response = await new Promise<{token: string, user: User}>((resolve) => {
        setTimeout(() => {
          resolve({
            token: "dummy-token-for-twitter-auth",
            user: {
              id: `user-${Math.random().toString(36).substr(2, 9)}`,
              email: "twitter-user@example.com",
              firstName: "Twitter",
              lastName: "User",
              twitterId: "12345678",
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
    } catch (err) {
      setError("Twitter authentication failed. Please try again.");
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
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
        twitterAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
