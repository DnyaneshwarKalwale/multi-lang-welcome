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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Access all contexts directly at component level (not in useEffect or conditionals)
  let authContext;
  let themeContext;
  let langContext;
  
  try {
    // Try to access all required contexts
    authContext = useAuth();
    themeContext = useTheme();
    langContext = useLanguage();
    
    // If we got here, all contexts are available
    useEffect(() => {
      // Wait for theme to be loaded
      if (themeContext.isThemeLoaded) {
        // Delay slightly to ensure all contexts are fully initialized
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }, [themeContext.isThemeLoaded]);
  } catch (e) {
    // If context access fails, set error
    useEffect(() => {
      console.error("Context verification failed:", e);
      setError(e as Error);
      
      // Force render after a timeout as failsafe
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }, []);
  }
  
  // If still loading, show spinner
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }
  
  // If error, show error message
  if (error) {
    console.error("Fatal context error:", error);
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-center p-4">
        <div>
          <h2 className="text-xl font-semibold text-red-500 mb-2">Application Error</h2>
          <p className="text-sm text-gray-500 mb-4">There was a problem initializing the application.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
  
  // All contexts verified, render children
  return <>{children}</>;
};

export default ContextVerifier; 