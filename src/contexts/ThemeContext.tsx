import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  isThemeLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isThemeLoaded: false,
});

export const useTheme = () => useContext(ThemeContext);

// Apply theme function to set light theme only
export const applyTheme = () => {
  // Remove any dark class, ensure only light theme
  document.documentElement.classList.remove('dark');
  // Set localStorage to light
  localStorage.setItem('theme', 'light');
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  
  useEffect(() => {
    // Force light theme on mount and prevent dark theme
    applyTheme();
    setIsThemeLoaded(true);
    
    // Force check to prevent dark mode from being applied
    const intervalId = setInterval(() => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme: 'light', isThemeLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};
