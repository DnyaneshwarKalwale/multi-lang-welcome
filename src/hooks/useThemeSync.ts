
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
    
    // Use addEventListener with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // @ts-ignore - For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore - For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  useEffect(() => {
    // Enforce theme synchronization across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue && (e.newValue === 'light' || e.newValue === 'dark')) {
        if (e.newValue !== theme) {
          console.log(`useThemeSync detected theme change in another tab: ${e.newValue}`);
          setTheme(e.newValue as 'light' | 'dark');
        }
      }
    };
    
    // Verify DOM class match and forcibly apply if needed
    const verifyDomTheme = () => {
      const hasLightClass = document.documentElement.classList.contains('light');
      const hasDarkClass = document.documentElement.classList.contains('dark');
      
      if ((theme === 'light' && !hasLightClass) || (theme === 'dark' && !hasDarkClass)) {
        console.log('useThemeSync detected DOM theme mismatch, fixing...');
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme); // Ensure localStorage is also updated
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Verify DOM theme alignment whenever theme changes
    if (isThemeLoaded && theme) {
      verifyDomTheme();
    }
    
    // Listen for custom theme events
    const handleCustomThemeChange = (e: Event) => {
      if ((e as CustomEvent).detail && ((e as CustomEvent).detail === 'light' || (e as CustomEvent).detail === 'dark')) {
        if ((e as CustomEvent).detail !== theme) {
          setTheme((e as CustomEvent).detail);
        }
      }
    };
    
    window.addEventListener('themechange', handleCustomThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themechange', handleCustomThemeChange as EventListener);
    };
  }, [theme, setTheme, isThemeLoaded]);
  
  return { theme, setTheme, isThemeLoaded, systemTheme };
}
