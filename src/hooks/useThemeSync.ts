
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Hook to synchronize theme changes across the application
 * Can be used in any component that needs to listen for or trigger theme changes
 */
export function useThemeSync() {
  const { theme, setTheme, isThemeLoaded } = useTheme();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark' | null>(null);
  
  // Detect system theme
  useEffect(() => {
    const detectSystemTheme = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setSystemTheme('dark');
      } else {
        setSystemTheme('light');
      }
    };
    
    detectSystemTheme();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => detectSystemTheme();
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  useEffect(() => {
    // Listen for localStorage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue && (e.newValue === 'light' || e.newValue === 'dark')) {
        if (e.newValue !== theme) {
          console.log(`useThemeSync detected theme change in another tab: ${e.newValue}`);
          setTheme(e.newValue as 'light' | 'dark');
        }
      }
    };
    
    // Verify DOM class match
    const verifyDomTheme = () => {
      const hasLightClass = document.documentElement.classList.contains('light');
      const hasDarkClass = document.documentElement.classList.contains('dark');
      
      if ((theme === 'light' && !hasLightClass) || (theme === 'dark' && !hasDarkClass)) {
        console.log('useThemeSync detected DOM theme mismatch, fixing...');
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Verify DOM theme alignment
    if (isThemeLoaded) {
      verifyDomTheme();
    }
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [theme, setTheme, isThemeLoaded]);
  
  return { theme, setTheme, isThemeLoaded, systemTheme };
}
