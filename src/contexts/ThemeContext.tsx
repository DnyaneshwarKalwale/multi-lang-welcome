import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeContextType = {
  theme: 'light';
  isThemeLoaded?: boolean;
};

// Apply light theme function
export function applyTheme() {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
  localStorage.setItem("theme", "light");
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always use light theme
  const [theme] = useState<'light'>('light');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Apply light theme on mount
  useEffect(() => {
    applyTheme();
    setIsThemeLoaded(true);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isThemeLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
