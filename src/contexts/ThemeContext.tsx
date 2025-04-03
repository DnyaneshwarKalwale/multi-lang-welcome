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
  // Temporarily disable transitions
  document.documentElement.classList.remove('theme-transition-ready');
  
  // Apply theme class to document - using classList methods which are more reliable
  if (theme === "dark") {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
  
  // Save to localStorage
  localStorage.setItem("theme", theme);
  
  // Re-enable transitions after DOM updates
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('theme-transition-ready');
    });
  });
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
    
    // Synchronize theme with DOM - ensure there's no mismatch
    if (theme === 'dark' && !document.documentElement.classList.contains('dark')) {
      applyTheme('dark');
    } else if (theme === 'light' && !document.documentElement.classList.contains('light')) {
      applyTheme('light');
    }
    
    // Listen for manual theme changes from ThemeToggle or other sources
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = e.newValue as Theme;
        if (newTheme === "dark" || newTheme === "light") {
          setThemeState(newTheme);
        }
      }
    };
    
    // Listen for class changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          const isLight = document.documentElement.classList.contains('light');
          
          // Only update if there's a clear theme (not during transitions)
          if (isDark && !isLight) {
            setThemeState('dark');
          } else if (isLight && !isDark) {
            setThemeState('light');
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [theme]);

  // Setter function that updates both state and DOM
  const setTheme = (newTheme: Theme) => {
    // Apply the theme change first to update DOM
    applyTheme(newTheme);
    
    // Then update the state
    setThemeState(newTheme);
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
