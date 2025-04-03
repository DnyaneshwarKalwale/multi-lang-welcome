import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, setTheme, isThemeLoaded } = useTheme();
  const { isAuthenticated, syncThemeWithBackend } = useAuth();
  const [mounted, setMounted] = useState(false);

  // On mount, set mounted state to true
  useEffect(() => {
    setMounted(true);
  }, []);

  // Log theme state changes for debugging
  useEffect(() => {
    if (mounted) {
      console.log("ThemeToggle: Current theme is", theme);
    }
  }, [theme, mounted]);

  // Handle theme toggle with direct DOM manipulation as a fallback
  const handleToggleTheme = () => {
    console.log("ThemeToggle: Toggling theme from", theme);
    
    // Toggle theme using context first
    toggleTheme();
    
    // As a fallback, directly manipulate DOM and localStorage
    // This ensures theme changes even if there's an issue with the context
    const isDark = document.documentElement.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    
    if (isDark) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("theme", newTheme);
    
    // Force update the theme in context
    setTheme(newTheme as "light" | "dark");
    
    // Sync with backend if user is authenticated
    if (isAuthenticated) {
      // Use setTimeout to ensure the theme is toggled first
      setTimeout(() => {
        syncThemeWithBackend();
      }, 0);
    }
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

  // Get current theme directly from DOM if context hasn't loaded yet
  const currentTheme = isThemeLoaded 
    ? theme 
    : document.documentElement.classList.contains("dark") 
      ? "dark" 
      : "light";

  return (
    <button
      onClick={handleToggleTheme}
      className="w-10 h-10 p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
      )}
    </button>
  );
}
