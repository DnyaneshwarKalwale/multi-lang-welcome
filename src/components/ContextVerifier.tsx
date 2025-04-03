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
  const [checkedContexts, setCheckedContexts] = useState(false);
  
  // Set mounted state on first render
  useEffect(() => {
    setMounted(true);
    
    // Add a short delay to ensure contexts are fully initialized
    setTimeout(() => {
      setCheckedContexts(true);
    }, 500);
    
    // Force render after a longer timeout as failsafe
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
  
  // Check contexts after the initial delay
  useEffect(() => {
    if (checkedContexts && mounted) {
      try {
        // Now we can safely check for contexts
        const authContext = useAuth();
        const themeContext = useTheme();
        const langContext = useLanguage();
        
        // If all contexts are accessible, we can proceed
        setIsLoading(false);
      } catch (error) {
        console.error("Context verification failed:", error);
        setError(error as Error);
      }
    }
  }, [checkedContexts, mounted]);
  
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