
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { theme, setTheme } = useTheme();
  
  // Set mounted state on component mount and verify theme
  useEffect(() => {
    setMounted(true);
    
    try {
      // Verify theme is correctly set in the DOM
      const themeInLocalStorage = localStorage.getItem('theme');
      const isDarkInDOM = document.documentElement.classList.contains('dark');
      const isLightInDOM = document.documentElement.classList.contains('light');
      
      // Log initial theme state for debugging
      console.log("ContextVerifier - Initial theme state:", {
        themeInLocalStorage,
        isDarkInDOM,
        isLightInDOM,
        currentThemeContext: theme
      });
      
      // Make sure DOM has at least one theme class set
      if (!isDarkInDOM && !isLightInDOM) {
        const themeToApply = themeInLocalStorage === 'light' ? 'light' : 'dark';
        document.documentElement.classList.add(themeToApply);
        console.log(`ContextVerifier - Fixed missing theme class by adding: ${themeToApply}`);
      }
      
      // Force theme class to match context if mismatch
      if ((theme === 'dark' && !isDarkInDOM) || (theme === 'light' && !isLightInDOM)) {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
        console.log(`ContextVerifier - Fixed theme class mismatch by setting: ${theme}`);
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
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (e) {
      console.error("Error in ContextVerifier:", e);
      setError(e as Error);
      setIsLoading(false);
    }
  }, [theme, setTheme]);
  
  // If still loading, show spinner with animation
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-24 h-24 mx-auto">
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-primary-300/30 dark:border-primary-700/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-indigo-500 border-b-transparent border-l-transparent"
              animate={{ rotate: -120 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.p 
            className="mt-6 text-base text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Initializing application...
          </motion.p>
        </motion.div>
      </div>
    );
  }
  
  // If error, show error message with animation
  if (error) {
    console.error("Fatal context error:", error);
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-800 text-center p-4 transition-colors duration-300">
        <motion.div 
          className="p-8 glass-card rounded-xl max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-rose-100 dark:border-rose-900/30 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-rose-500 mb-3">Application Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Sorry, there was a problem initializing the application. Please try again.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-auto max-h-32">
            {error.message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-base font-medium transition-all hover:shadow-lg hover:from-rose-600 hover:to-pink-600"
          >
            Reload Application
          </button>
        </motion.div>
      </div>
    );
  }
  
  // All contexts verified, render children with fade-in animation
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContextVerifier;
