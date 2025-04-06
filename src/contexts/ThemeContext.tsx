
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isThemeLoaded: boolean;
}

// Initialize with sensible defaults
const initialThemeContext: ThemeContextType = {
  theme: "dark", // Default to dark theme
  setTheme: () => {},
  toggleTheme: () => {},
  isThemeLoaded: false
};

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>(initialThemeContext);

/**
 * Directly sets the theme in the DOM and localStorage
 * This function should be used whenever the theme needs to change
 */
export function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }
  
  // Save to localStorage
  localStorage.setItem("theme", theme);
  
  // Dispatch a custom event that other components can listen for
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  
  // Debug theme change
  console.log(`Theme applied: ${theme}, DOM updated, localStorage set`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    // Default to dark if window not available (SSR)
    if (typeof window === 'undefined') return 'dark';
    
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Check HTML class as fallback
    if (document.documentElement.classList.contains("dark")) return "dark";
    if (document.documentElement.classList.contains("light")) return "light";
    
    // Default to dark
    return 'dark';
  });
  
  const [mounted, setMounted] = useState(false);

  // Ensure theme is applied to DOM on initial load
  useEffect(() => {
    // Apply current theme to ensure DOM reflects state
    applyTheme(theme);
    setMounted(true);
    
    // Listen for theme changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as Theme;
        if (newTheme === "light" || newTheme === "dark") {
          setThemeState(newTheme);
          applyTheme(newTheme);
        }
      }
    };
    
    // Listen for storage events from other tabs/windows
    window.addEventListener("storage", handleStorageChange);
    
    // Listen for custom themechange events
    const handleCustomThemeChange = (e: CustomEvent<Theme>) => {
      setThemeState(e.detail);
    };
    
    window.addEventListener('themechange', handleCustomThemeChange as EventListener);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener('themechange', handleCustomThemeChange as EventListener);
    };
  }, []);

  // Setter function that updates both state and DOM
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  // Toggle function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log(`Toggling theme from ${theme} to ${newTheme}`);
    setTheme(newTheme);
  };

  // Provide context
  const themeContextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isThemeLoaded: mounted
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeContext };
