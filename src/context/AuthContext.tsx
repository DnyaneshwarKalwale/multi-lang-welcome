import React, { createContext, useContext, useState, useEffect } from 'react';

// Define User type for SSO authentication
export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  provider: 'google' | 'linkedin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // For demonstration, we'll use a sample Google user
  // In production, you would integrate with actual OAuth providers
  useEffect(() => {
    // Simulate a logged-in user for demonstration
    const demoUser: User = {
      id: 'google-123456789',
      name: 'John Doe',
      email: 'john.doe@example.com',
      photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocLzwRUUP2sT6DGeYDUqFk3Ro6vPcOmJx-_7DlDICyFV=s96-c',
      provider: 'google'
    };
    
    setUser(demoUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(demoUser));
  }, []);

  const login = (user: User) => {
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 