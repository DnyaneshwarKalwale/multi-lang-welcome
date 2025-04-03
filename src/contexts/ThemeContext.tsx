import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  // Apply theme class to document immediately
  if (theme === "dark") {
    // Apply dark theme in a single DOM operation to prevent flicker
    document.documentElement.className = document.documentElement.className
      .replace(/\blight\b/g, '')
      .concat(' dark')
      .trim();
  } else {
    // Apply light theme in a single DOM operation to prevent flicker
    document.documentElement.className = document.documentElement.className
      .replace(/\bdark\b/g, '')
      .concat(' light')
      .trim();
  }
  
  // Save to localStorage
  localStorage.setItem("theme", theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
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

  // Setter function that updates both state and DOM
  const setTheme = (newTheme: Theme) => {
    // Set the state immediately
    setThemeState(newTheme);
    
    // Apply the theme change (DOM update)
    applyTheme(newTheme);
    
    // Dispatch storage event for other components after a short delay to ensure DOM changes are applied
    setTimeout(() => {
      window.dispatchEvent(new StorageEvent("storage", {
        key: "theme",
        newValue: newTheme,
        storageArea: localStorage
      }));
    }, 10);
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
