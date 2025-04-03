import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onboardingApi } from "@/services/api";
import { useAuth } from "./AuthContext";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isThemeLoaded: boolean; // Added to track theme loading state
}

// Initialize with sensible defaults to avoid null/undefined errors
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
  // Apply theme class to document
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }
  
  // Save to localStorage
  localStorage.setItem("theme", theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Get the authentication context to check if user is logged in
  const auth = useAuth();
  
  // Initialize theme state based on document class
  const [theme, setThemeState] = useState<Theme>(() => {
    // Default to dark if window not available (SSR)
    if (typeof window === 'undefined') return 'dark';
    
    // Check HTML class first (most reliable)
    if (document.documentElement.classList.contains("dark")) return "dark";
    if (document.documentElement.classList.contains("light")) return "light";
    
    // Check localStorage as fallback
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Default to dark
    return 'dark';
  });
  
  const [mounted, setMounted] = useState(false);

  // Set mounted when component mounts
  useEffect(() => {
    setMounted(true);
    
    // Listen for manual theme changes from ThemeToggle or other sources
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = e.newValue as Theme;
        if (newTheme === "dark" || newTheme === "light") {
          setThemeState(newTheme);
        }
      }
    };
    
    // Use MutationObserver to detect changes to the HTML class
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setThemeState(isDark ? 'dark' : 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Save theme to backend when it changes and user is authenticated
  useEffect(() => {
    // Only attempt to save if user is authenticated and component is mounted
    if (auth.isAuthenticated && mounted) {
      // Call the API to update theme preference
      onboardingApi.updateTheme(theme)
        .then(() => {
          console.log(`Theme preference saved to backend: ${theme}`);
        })
        .catch(error => {
          console.error("Failed to save theme preference:", error);
        });
    }
  }, [theme, auth.isAuthenticated, mounted]);

  // Setter function that updates both state and DOM
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Manually dispatch storage event for other components
    window.dispatchEvent(new StorageEvent("storage", {
      key: "theme",
      newValue: newTheme,
      storageArea: localStorage
    }));
  };

  // Toggle function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
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
