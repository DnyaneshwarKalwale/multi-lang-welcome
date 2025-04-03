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
  
  // Try to access contexts at component level (safe location for hooks)
  let contextError = null;
  
  try {
    // Access all required contexts at component level
    const authContext = useAuth();
    const themeContext = useTheme();
    const langContext = useLanguage();
    
    // Check if contexts are loaded within useEffect
    useEffect(() => {
      try {
        // Check if theme is loaded
        if (themeContext.isThemeLoaded) {
          // Slightly delay showing content to ensure all contexts are ready
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 300);
          
          return () => clearTimeout(timer);
        }
      } catch (innerError) {
        console.error("Error checking contexts in useEffect:", innerError);
        setError(innerError as Error);
      }
    }, [themeContext.isThemeLoaded]);
    
  } catch (e) {
    // If context access fails at component level, capture the error
    contextError = e as Error;
  }
  
  // Handle errors in context access
  useEffect(() => {
    if (contextError) {
      console.error("Failed to access required contexts:", contextError);
      setError(contextError);
      
      // Force render after a timeout as failsafe
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [contextError]);
  
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