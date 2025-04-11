import React, { createContext, useContext, ReactNode } from "react";

// Theme is now fixed as 'light' with no switching functionality
type ThemeContextType = {
  theme: 'light';
  isThemeLoaded: boolean;
};

// Always use light theme
export function applyTheme() {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isThemeLoaded: true
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Apply light theme
  applyTheme();

  return (
    <ThemeContext.Provider value={{ theme: 'light', isThemeLoaded: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
