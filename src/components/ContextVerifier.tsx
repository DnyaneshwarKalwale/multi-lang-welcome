
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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
    console.log("ContextVerifier - Initial theme state:", {
      themeInLocalStorage,
      isDarkInDOM,
      isLightInDOM
    });
    
    // Make sure DOM has at least one theme class set
    if (!isDarkInDOM && !isLightInDOM) {
      const theme = themeInLocalStorage === 'light' ? 'light' : 'dark';
      document.documentElement.classList.add(theme);
      console.log(`ContextVerifier - Fixed missing theme class by adding: ${theme}`);
    }
    
    // Synchronize localStorage with DOM if needed
    if (isDarkInDOM && themeInLocalStorage !== 'dark') {
      localStorage.setItem('theme', 'dark');
      console.log('ContextVerifier - Synchronized localStorage with dark theme from DOM');
    } else if (isLightInDOM && themeInLocalStorage !== 'light') {
      localStorage.setItem('theme', 'light');
      console.log('ContextVerifier - Synchronized localStorage with light theme from DOM');
    }
    
    // Check contexts after a short delay to ensure they're all loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If still loading, show spinner
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }
  
  // If error, show error message
  if (error) {
    console.error("Fatal context error:", error);
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-center p-4 transition-colors duration-300">
        <div className="p-6 glass-card rounded-xl">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Application Error</h2>
          <p className="text-sm text-muted-foreground mb-4">There was a problem initializing the application.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-md text-sm transition-colors"
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
