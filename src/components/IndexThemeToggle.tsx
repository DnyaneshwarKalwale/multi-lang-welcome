import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

// Declare global window interface to include our theme functions
declare global {
  interface Window {
    setTheme?: (theme: "dark" | "light") => void;
  }
}

/**
 * A standalone ThemeToggle component specifically for the Index page
 * This component works both with direct DOM manipulation and will try to use ThemeContext if available
 */
export default function IndexThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Get theme directly from DOM
  const getThemeFromDOM = (): "dark" | "light" => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  };

  // Apply theme directly to DOM
  const applyThemeToDOM = (theme: "dark" | "light") => {
    if (typeof document === "undefined") return;
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark"); 
      document.documentElement.classList.add("light");
    }
    
    // Also update localStorage
    localStorage.setItem("theme", theme);
  };

  // Initialize state on mount
  useEffect(() => {
    // Set mounted flag to prevent hydration mismatch
    setMounted(true);
    
    // Get initial state from DOM
    const currentTheme = getThemeFromDOM();
    setIsDark(currentTheme === "dark");
    
    // Set up a mutation observer to detect theme changes
    const observer = new MutationObserver(() => {
      const newTheme = getThemeFromDOM();
      setIsDark(newTheme === "dark");
    });
    
    // Start observing
    observer.observe(document.documentElement, { attributes: true });
    
    // Clean up
    return () => observer.disconnect();
  }, []);

  // Handle theme toggle
  const handleToggle = () => {
    // Toggle theme
    const newIsDark = !isDark;
    const newTheme = newIsDark ? "dark" : "light";
    
    // Update DOM directly
    applyThemeToDOM(newTheme);
    
    // Update local state
    setIsDark(newIsDark);
    
    // Dispatch storage event for other components to detect
    window.dispatchEvent(new StorageEvent("storage", {
      key: "theme",
      newValue: newTheme,
      storageArea: localStorage
    }));
    
    // If global context function exists, use it
    if (window.setTheme) {
      try {
        window.setTheme(newTheme);
      } catch (error) {
        console.error("Error using global setTheme:", error);
      }
    }
  };

  // Don't render until client-side to prevent hydration issues
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
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
      )}
    </button>
  );
} 