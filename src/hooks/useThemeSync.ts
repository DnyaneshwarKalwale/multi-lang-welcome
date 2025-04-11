
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Hook to ensure light theme is consistently applied throughout the application
 */
export function useThemeSync() {
  const { theme, isThemeLoaded } = useTheme();
  
  // Ensure light theme synchronization
  useEffect(() => {
    // Verify DOM class match and forcibly apply if needed
    const verifyDomTheme = () => {
      const hasLightClass = document.documentElement.classList.contains('light');
      
      if (!hasLightClass) {
        console.log('useThemeSync detected DOM theme mismatch, fixing...');
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light'); // Ensure localStorage is also updated
      }
    };
    
    // Verify DOM theme alignment
    if (isThemeLoaded) {
      verifyDomTheme();
    }
    
    return () => {};
  }, [theme, isThemeLoaded]);
  
  return { theme, isThemeLoaded };
}
