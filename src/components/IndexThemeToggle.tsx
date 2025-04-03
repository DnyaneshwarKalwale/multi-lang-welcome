import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { onboardingApi } from "@/services/api";

/**
 * A simplified ThemeToggle component specifically for the Index page
 * This component doesn't rely on any contexts and uses direct DOM manipulation
 */
export default function IndexThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize state on mount
  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    
    // Check authentication status
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Try to save theme to backend if authenticated
  const saveThemeToBackend = async (theme: "light" | "dark") => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      await onboardingApi.updateTheme(theme);
      console.log(`IndexThemeToggle: Theme saved to backend: ${theme}`);
    } catch (error) {
      console.error("IndexThemeToggle: Failed to save theme to backend:", error);
    }
  };

  // Handle theme toggle
  const handleToggle = () => {
    // Get current state directly from DOM
    const currentIsDark = document.documentElement.classList.contains("dark");
    const newIsDark = !currentIsDark;
    const newTheme = newIsDark ? "dark" : "light";
    
    // Update DOM
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    
    // Update localStorage
    localStorage.setItem("theme", newTheme);
    
    // Update component state
    setIsDark(newIsDark);
    
    // Log for debugging
    console.log(`IndexThemeToggle: Theme toggled to ${newTheme}`);
    
    // Sync with backend if authenticated
    if (isAuthenticated) {
      saveThemeToBackend(newTheme);
    }
    
    // Dispatch storage event for other components to detect the change
    window.dispatchEvent(new StorageEvent("storage", {
      key: "theme",
      newValue: newTheme,
      storageArea: localStorage
    }));
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button 
        className="w-10 h-10 p-2 rounded-md bg-gray-100 dark:bg-gray-800 opacity-50"
        disabled
        aria-label="Theme loading"
      >
        <div className="w-5 h-5"></div>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
      )}
    </button>
  );
} 