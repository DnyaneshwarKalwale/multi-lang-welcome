import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

/**
 * A simple debugging tool for theme issues
 * Shows current theme status and provides manual controls
 * Only visible when ?debugTheme=true is in the URL
 */
export default function ThemeDebugHelper() {
  const themeContext = useTheme();
  const authContext = useAuth();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [themeState, setThemeState] = useState({
    domTheme: "",
    localStorageTheme: "",
    isLoggedIn: false
  });

  // Set up the component on mount
  useEffect(() => {
    // Check if debug mode is enabled via URL
    const urlParams = new URLSearchParams(window.location.search);
    const shouldDebug = urlParams.get("debugTheme") === "true";
    setIsVisible(shouldDebug);
    
    if (shouldDebug) {
      // Initial update
      updateThemeState();
      
      // Set up an interval for periodic updates
      const intervalId = setInterval(updateThemeState, 2000);
      return () => clearInterval(intervalId);
    }
  }, []);

  // Update theme state (called on interval)
  function updateThemeState() {
    const domIsDark = document.documentElement.classList.contains("dark");
    const domTheme = domIsDark ? "dark" : "light";
    const storedTheme = localStorage.getItem("theme") || "not set";
    const isLoggedIn = !!authContext?.user;
    
    setThemeState({
      domTheme,
      localStorageTheme: storedTheme,
      isLoggedIn
    });
  }

  // Helper for direct DOM manipulation
  function applyThemeToDom(theme: "dark" | "light") {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }

  // Theme toggle handlers
  function handleForceDark() {
    applyThemeToDom("dark");
    
    // Also update via context if available
    if (themeContext?.setTheme) {
      themeContext.setTheme("dark");
    }
    
    updateThemeState();
  }
  
  function handleForceLight() {
    applyThemeToDom("light");
    
    // Also update via context if available
    if (themeContext?.setTheme) {
      themeContext.setTheme("light");
    }
    
    updateThemeState();
  }
  
  function handleSyncWithBackend() {
    if (authContext?.syncThemeWithBackend) {
      authContext.syncThemeWithBackend().catch(console.error);
    } else if (themeContext?.saveThemeToBackend) {
      themeContext.saveThemeToBackend(themeContext.theme).catch(console.error);
    }
    
    updateThemeState();
  }

  // If not visible, render nothing
  if (!isVisible) {
    return null;
  }

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
              <strong>Theme Context:</strong> {themeContext?.theme || "Not available"}
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
              onClick={handleForceDark}
              className="px-2 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700"
            >
              Force Dark Theme
            </button>
            <button 
              onClick={handleForceLight}
              className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
            >
              Force Light Theme
            </button>
            <button 
              onClick={handleSyncWithBackend}
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