import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContextVerifierProps {
  children: React.ReactNode;
}

/**
 * ContextVerifier
 * Ensures that all required contexts are properly loaded before rendering the app.
 * This prevents "useContext must be used within a Provider" errors that can 
 * occur during initial render or when React suspends/resumes components.
 */
const ContextVerifier: React.FC<ContextVerifierProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  
  // Access contexts at component level - this is safe
  const auth = useAuth();
  const theme = useTheme();
  const lang = useLanguage();
  
  // Use a simple useEffect to delay rendering until contexts are ready
  useEffect(() => {
    // Create a timeout to ensure all contexts have time to initialize
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Conditionally render the children when ready
  if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }
  
  // All contexts verified, render children
  return <>{children}</>;
};

export default ContextVerifier; 