import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

/**
 * A simple debugging tool for theme issues
 * Shows current theme status and provides manual controls
 * Only visible when ?debugTheme=true is in the URL
 */
export default function ThemeDebugHelper() {
  // Access context hooks at the component level
  const themeContext = useTheme();
  const authContext = useAuth();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [themeState, setThemeState] = useState({
    contextTheme: null as string | null,
    domTheme: null as string | null,
    localStorageTheme: null as string | null,
    isLoggedIn: false
  });

  // Update the theme state information
  const updateThemeState = () => {
    // Get theme directly from DOM
    const domIsDark = document.documentElement.classList.contains("dark");
    const domTheme = domIsDark ? "dark" : "light";
    
    // Get theme from localStorage
    const storedTheme = localStorage.getItem("theme");
    
    // Get context values safely
    const contextTheme = themeContext?.theme || null;
    const isLoggedIn = !!authContext?.user;
    
    setThemeState({
      contextTheme,
      domTheme,
      localStorageTheme: storedTheme,
      isLoggedIn
    });
  };

  // Check if debug mode is enabled via URL and initialize
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldDebug = urlParams.get("debugTheme") === "true";
    setIsVisible(shouldDebug);
    
    if (shouldDebug) {
      updateThemeState();
    }
    
    // Set up an interval to periodically update the theme state
    const intervalId = setInterval(updateThemeState, 2000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [themeContext?.theme, authContext?.user]);

  // Helper functions to manipulate theme
  const forceDarkTheme = () => {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
    
    // Use context if available
    if (themeContext?.setTheme) {
      themeContext.setTheme("dark");
    }
    
    updateThemeState();
  };

  const forceLightTheme = () => {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    
    // Use context if available
    if (themeContext?.setTheme) {
      themeContext.setTheme("light");
    }
    
    updateThemeState();
  };
  
  const syncWithBackend = async () => {
    try {
      if (authContext?.syncThemeWithBackend) {
        await authContext.syncThemeWithBackend();
        console.log("Theme synced with backend via AuthContext");
      } else if (themeContext?.saveThemeToBackend) {
        await themeContext.saveThemeToBackend(themeContext.theme);
        console.log("Theme saved to backend via ThemeContext");
      } else {
        console.log("No method available to sync theme with backend");
      }
    } catch (error) {
      console.error("Failed to sync theme with backend:", error);
    }
    
    updateThemeState();
  };

  // If not visible, don't render
  if (!isVisible) {
    return null;
  }

  // Display a minimal or full debug panel
  return (
    <div 
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 text-sm"
      style={{ maxWidth: '300px' }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Theme Debug</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isMinimized ? "+" : "-"}
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="space-y-2 mb-3">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <strong>Context Theme:</strong> {themeState.contextTheme || "Not available"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <strong>DOM Theme:</strong> {themeState.domTheme || "Not detected"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <strong>localStorage Theme:</strong> {themeState.localStorageTheme || "Not set"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <strong>Logged In:</strong> {themeState.isLoggedIn ? "Yes" : "No"}
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <button 
              onClick={forceDarkTheme}
              className="px-2 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700"
            >
              Force Dark Theme
            </button>
            <button 
              onClick={forceLightTheme}
              className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
            >
              Force Light Theme
            </button>
            <button 
              onClick={syncWithBackend}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              disabled={!themeState.isLoggedIn}
            >
              Sync with Backend
            </button>
            <button 
              onClick={updateThemeState}
              className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
            >
              Refresh Status
            </button>
          </div>
        </>
      )}
    </div>
  );
} 