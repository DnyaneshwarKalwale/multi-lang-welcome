import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name?: string;
  profilePicture?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token and set user
      validateToken(token);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      // Simulate token validation
      const response = await new Promise<AuthResponse>((resolve) => {
        setTimeout(() => {
          resolve({ success: true, user: { id: 1, email: 'test@example.com' }, token });
        }, 500);
      });

      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (err) {
      localStorage.removeItem('authToken');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      const response = await new Promise<AuthResponse>((resolve, reject) => {
        setTimeout(() => {
          if (email === 'test@example.com' && password === 'password') {
            resolve({ success: true, token: 'mock-jwt-token', user: { id: 1, email } });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000);
      });

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setIsAuthenticated(true);
        setUser(response.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      const response = await new Promise<AuthResponse>((resolve) => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            token: 'mock-jwt-token', 
            user: { 
              id: 1, 
              name: `${firstName} ${lastName}`, 
              email 
            } 
          });
        }, 1000);
      });

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setIsAuthenticated(true);
        setUser(response.user);
        navigate('/verify-email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        register,
        isLoading,
        error,
        clearError,
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