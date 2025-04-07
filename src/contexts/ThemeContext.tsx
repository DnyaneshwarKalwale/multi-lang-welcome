
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
  // First, remove any existing theme classes
  document.documentElement.classList.remove("light", "dark");
  
  // Then add the new theme class
  document.documentElement.classList.add(theme);
  
  // Save to localStorage
  localStorage.setItem("theme", theme);
  
  // Dispatch a custom event that other components can listen for
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  
  // Debug theme change
  console.log(`Theme applied: ${theme}, DOM updated, localStorage set, classes: ${document.documentElement.classList.toString()}`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme state with better detection logic
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    
    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme as Theme;
      }
      
      // Check system preference as a fallback
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      // If no preference, use light
      return 'light';
    } catch (error) {
      console.error("Error determining theme:", error);
      return 'dark';
    }
  });
  
  const [mounted, setMounted] = useState(false);

  // Ensure theme is applied to DOM on initial load and reapply on dashboard if needed
  useEffect(() => {
    // Make sure DOM reflects current theme initially
    applyTheme(theme);
    
    // Special handling for dashboard page
    const isDashboard = window.location.pathname.includes('/dashboard');
    if (isDashboard) {
      console.log("ThemeContext: Dashboard page detected, ensuring theme is applied");
      // Double-check theme application after a small delay
      setTimeout(() => {
        const hasCorrectClass = document.documentElement.classList.contains(theme);
        if (!hasCorrectClass) {
          console.log(`ThemeContext: Fixing theme on dashboard, applying ${theme}`);
          applyTheme(theme);
        }
      }, 50);
    }
    
    // Mark as mounted
    setMounted(true);
    
    // Listen for theme changes from other components or tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as Theme;
        if (newTheme === "light" || newTheme === "dark") {
          setThemeState(newTheme);
          applyTheme(newTheme);
        }
      }
    };
    
    // Listen for custom themechange events
    const handleCustomThemeChange = (e: CustomEvent<Theme>) => {
      setThemeState(e.detail);
    };
    
    // Set up media query listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      // Only apply if user hasn't explicitly set a preference
      if (!localStorage.getItem("theme")) {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };
    
    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener('themechange', handleCustomThemeChange as EventListener);
    
    // Use the appropriate event listener based on browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      // @ts-ignore - For older browsers
      mediaQuery.addListener(handleMediaChange);
    }
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener('themechange', handleCustomThemeChange as EventListener);
      
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        // @ts-ignore - For older browsers
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Create separate effect to handle theme changes in state
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted]);

  // Setter function that updates both state and DOM
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Toggle function with improved logging
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
