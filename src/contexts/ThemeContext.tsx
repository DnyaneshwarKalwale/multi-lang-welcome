
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  theme: "light";
  isThemeLoaded: boolean;
}

// Initialize with light theme only
const initialThemeContext: ThemeContextType = {
  theme: "light",
  isThemeLoaded: false
};

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>(initialThemeContext);

/**
 * Directly sets the theme in the DOM and localStorage
 * This function applies the light theme consistently
 */
export function applyTheme() {
  // Remove any existing theme classes
  document.documentElement.classList.remove("dark");
  
  // Add the light theme class
  document.documentElement.classList.add("light");
  
  // Save to localStorage
  localStorage.setItem("theme", "light");
  
  console.log("Light theme applied, DOM updated, localStorage set");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always use light theme
  const [mounted, setMounted] = useState(false);

  // Ensure theme is applied to DOM on initial load
  useEffect(() => {
    // Make sure DOM reflects light theme initially
    applyTheme();
    
    // Special handling for dashboard page
    const isDashboard = window.location.pathname.includes('/dashboard');
    if (isDashboard) {
      console.log("ThemeContext: Dashboard page detected, ensuring light theme is applied");
      // Double-check theme application after a small delay
      setTimeout(() => {
        const hasCorrectClass = document.documentElement.classList.contains("light");
        if (!hasCorrectClass) {
          console.log("ThemeContext: Fixing theme on dashboard, applying light theme");
          applyTheme();
        }
      }, 50);
    }
    
    // Mark as mounted
    setMounted(true);
  }, []);

  // Provide context
  const themeContextValue: ThemeContextType = {
    theme: "light",
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
