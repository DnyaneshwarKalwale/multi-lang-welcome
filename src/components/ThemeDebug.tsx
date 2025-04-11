
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeDebug() {
  // Get theme from context
  const { theme, isThemeLoaded } = useTheme();
  
  // Track component state
  const [mounted, setMounted] = useState(false);
  const [htmlClasses, setHtmlClasses] = useState('');
  const [localStorageTheme, setLocalStorageTheme] = useState('');
  const [debugCount, setDebugCount] = useState(0);

  // Update state on mount and every second
  useEffect(() => {
    setMounted(true);
    updateDebugInfo();
    
    const interval = setInterval(() => {
      updateDebugInfo();
      setDebugCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to update all debug information
  const updateDebugInfo = () => {
    setHtmlClasses(document.documentElement.className);
    setLocalStorageTheme(localStorage.getItem('theme') || 'not set');
  };

  // Direct DOM manipulation functions for testing
  const setLightThemeDirect = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
    updateDebugInfo();
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 p-4 border-t border-gray-200 text-xs">
      <h3 className="font-bold text-sm mb-2">Theme Debug Panel</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p><strong>Context Theme:</strong> {theme}</p>
          <p><strong>Local Storage:</strong> {localStorageTheme}</p>
          <p><strong>HTML Classes:</strong> {htmlClasses}</p>
          <p><strong>Updates:</strong> {debugCount}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button 
            onClick={setLightThemeDirect}
            className="px-2 py-1 bg-orange-300 text-black rounded mt-2"
          >
            Force Light Theme (DOM)
          </button>
        </div>
      </div>
    </div>
  );
}
