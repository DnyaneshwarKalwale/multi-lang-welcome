
import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Hook to synchronize theme changes across the application
 * Can be used in any component that needs to listen for or trigger theme changes
 */
export function useThemeSync() {
  const { theme, setTheme, isThemeLoaded } = useTheme();
  
  useEffect(() => {
    // Apply the theme to the DOM whenever it changes
    if (isThemeLoaded && theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      
      // Update localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme, isThemeLoaded]);
  
  // Listen for theme changes from other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue && (e.newValue === 'light' || e.newValue === 'dark')) {
        if (e.newValue !== theme) {
          setTheme(e.newValue as 'light' | 'dark');
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [theme, setTheme]);
  
  return { theme, setTheme, isThemeLoaded };
}
