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
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state on component mount
  useEffect(() => {
    setMounted(true);
    
    // Verify theme is correctly set in the DOM
    const themeInLocalStorage = localStorage.getItem('theme');
    const isDarkInDOM = document.documentElement.classList.contains('dark');
    const isLightInDOM = document.documentElement.classList.contains('light');
    
    // Log initial theme state for debugging
    console.log({
      themeInLocalStorage,
      isDarkInDOM,
      isLightInDOM
    });
    
    // Make sure DOM has at least one theme class set
    if (!isDarkInDOM && !isLightInDOM) {
      const theme = themeInLocalStorage === 'light' ? 'light' : 'dark';
      document.documentElement.classList.add(theme);
      console.log(`Fixed missing theme class by adding: ${theme}`);
    }
    
    // Synchronize localStorage with DOM if needed
    if (isDarkInDOM && themeInLocalStorage !== 'dark') {
      localStorage.setItem('theme', 'dark');
      console.log('Synchronized localStorage with dark theme from DOM');
    } else if (isLightInDOM && themeInLocalStorage !== 'light') {
      localStorage.setItem('theme', 'light');
      console.log('Synchronized localStorage with light theme from DOM');
    }
  }, []);
  
  // Safely access contexts to verify availability
  const safeAccess = () => {
    if (!mounted) return false;
    
    try {
      // Get theme context
      const themeContext = useTheme();
      
      // If theme is not loaded yet, just wait
      if (!themeContext.isThemeLoaded) {
        return false;
      }
      
      // Try to access other contexts
      try {
        // Get auth context (suppress any error)
        const authContext = useAuth();
      } catch (authError) {
        console.warn("Auth context not ready yet");
        return false;
      }
      
      try {
        // Get language context (suppress any error)
        const langContext = useLanguage();
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