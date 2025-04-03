import React, { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContextVerifierProps {
  children: React.ReactNode;
}

/**
 * ContextVerifier ensures all required contexts are available
 * It renders a loading spinner until all contexts are verified,
 * then renders the children components.
 */
const ContextVerifier: React.FC<ContextVerifierProps> = ({ children }) => {
  // Force accessing all contexts to verify they're available
  try {
    const { theme } = useTheme();
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage();
    
    return <>{children}</>;
  } catch (error) {
    console.error("Context verification failed:", error);
    
    // Render a loading spinner
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }
};

export default ContextVerifier; 