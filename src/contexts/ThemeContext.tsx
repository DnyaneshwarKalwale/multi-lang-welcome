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

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme state from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    
    // Check if theme is saved in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Default to dark if no theme is set or invalid value
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark';
  });
  
  const [mounted, setMounted] = useState(false);

  // Handle theme class on document and save to localStorage
  useEffect(() => {
    if (!mounted) return;
    
    // Add a transition class before changing theme to enable smooth transitions
    document.documentElement.classList.add('theme-transition');
    
    // Update class on document element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Remove transition class after the transition is complete
    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
    
    return () => clearTimeout(transitionTimeout);
  }, [theme, mounted]);

  // Set mounted to true on initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply the initial theme to the document immediately on mount
  useEffect(() => {
    // Apply theme to document right away to avoid flicker
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Provide the theme context with the current theme and isThemeLoaded flag
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

export { ThemeContext }; // Export the context itself so it can be accessed directly
