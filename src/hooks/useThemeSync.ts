
import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Hook to synchronize theme changes across the application
 * Can be used in any component that needs to listen for or trigger theme changes
 */
export function useThemeSync() {
  const { theme, setTheme, isThemeLoaded } = useTheme();
  
  useEffect(() => {
    // We don't need to apply the theme here as it's already handled in the ThemeContext
    // Just listen for localStorage changes from other tabs/windows
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue && (e.newValue === 'light' || e.newValue === 'dark')) {
        if (e.newValue !== theme) {
          console.log(`useThemeSync detected theme change in another tab: ${e.newValue}`);
          setTheme(e.newValue as 'light' | 'dark');
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [theme, setTheme]);
  
  return { theme, setTheme, isThemeLoaded };
}
