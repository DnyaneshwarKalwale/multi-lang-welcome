import React, { useState, useEffect } from 'react';

export default function ThemeDebug() {
  // Track component state
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('');
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
    setCurrentTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setHtmlClasses(document.documentElement.className);
    setLocalStorageTheme(localStorage.getItem('theme') || 'not set');
  };

  // Direct DOM manipulation functions
  const setLightTheme = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
    updateDebugInfo();
  };

  const setDarkTheme = () => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    updateDebugInfo();
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      setLightTheme();
    } else {
      setDarkTheme();
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-800 text-xs">
      <h3 className="font-bold text-sm mb-2">Theme Debug Panel</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p><strong>Current Theme:</strong> {currentTheme}</p>
          <p><strong>Local Storage:</strong> {localStorageTheme}</p>
          <p><strong>HTML Classes:</strong> {htmlClasses}</p>
          <p><strong>Updates:</strong> {debugCount}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button 
            onClick={setLightTheme}
            className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-black dark:text-white rounded"
          >
            Force Light Theme
          </button>
          <button 
            onClick={setDarkTheme}
            className="px-2 py-1 bg-blue-900 dark:bg-blue-800 text-white rounded"
          >
            Force Dark Theme
          </button>
          <button 
            onClick={toggleTheme}
            className="px-2 py-1 bg-purple-500 text-white rounded"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </div>
  );
} 