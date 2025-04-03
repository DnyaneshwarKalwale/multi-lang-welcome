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
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state on first render
  useEffect(() => {
    setMounted(true);
    
    // If mounted and contexts are ready after 2 seconds, force loading to false
    // This is a fallback in case our context checking has a bug
    const timer = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Log any errors during render
  useEffect(() => {
    if (error) {
      console.error("Context verification error:", error);
    }
  }, [error]);
  
  // Safely access contexts to verify availability
  const safeAccess = () => {
    if (!mounted) return false;
    
    try {
      // Try to access auth context first
      try {
        const authContext = useAuth();
        if (!authContext) return false;
      } catch (authError) {
        console.warn("Auth context not ready yet");
        return false;
      }
      
      // Then theme context
      try {
        const themeContext = useTheme();
        if (!themeContext || !themeContext.isThemeLoaded) return false;
      } catch (themeError) {
        console.warn("Theme context not ready yet");
        return false;
      }
      
      // Then language context
      try {
        const langContext = useLanguage();
        if (!langContext) return false;
      } catch (langError) {
        console.warn("Language context not ready yet");
        return false;
      }
      
      // If we got here, all essential contexts are available
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