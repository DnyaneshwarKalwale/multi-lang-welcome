import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Safely access contexts to verify availability
  const safeAccess = () => {
    try {
      // Get theme context
      const { isThemeLoaded } = useTheme();
      
      // If theme is not loaded yet, just wait
      if (!isThemeLoaded) {
        return false;
      }
      
      // Try to access other contexts
      try {
        // Get auth context (suppress any error)
        const authContext = useAuth();
      } catch (authError) {
        console.warn("Auth context not ready yet:", authError);
      }
      
      try {
        // Get language context (suppress any error)
        const langContext = useLanguage();
      } catch (langError) {
        console.warn("Language context not ready yet:", langError);
      }
      
      // If we got here, essential contexts are available
      return true;
    } catch (error) {
      console.error("Context verification failed:", error);
      setError(error as Error);
      return false;
    }
  };
  
  // Check if contexts are ready
  const contextsReady = safeAccess();
  
  // Update loading state
  useEffect(() => {
    if (contextsReady) {
      setIsLoading(false);
    }
  }, [contextsReady]);
  
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