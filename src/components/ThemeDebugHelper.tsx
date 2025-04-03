import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Theme Debug Helper Component
 * 
 * Shows debug information about theme state
 * Can be activated by adding ?debugTheme=true to the URL
 */
const ThemeDebugHelper: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [currentInfo, setCurrentInfo] = useState({
    htmlClass: '',
    localStorageTheme: '',
    documentClass: '',
    contextTheme: ''
  });
  
  // Access theme context if available
  let themeContext;
  let authContext;
  try {
    themeContext = useTheme();
    authContext = useAuth();
  } catch (error) {
    // Contexts not available
  }

  useEffect(() => {
    // Check if debug mode is enabled via URL parameter
    const params = new URLSearchParams(window.location.search);
    const debugTheme = params.get('debugTheme');
    setVisible(debugTheme === 'true');
    
    // Update theme info every 1 second
    const updateInfo = () => {
      setCurrentInfo({
        htmlClass: document.documentElement.classList.toString(),
        localStorageTheme: localStorage.getItem('theme') || 'not set',
        documentClass: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        contextTheme: themeContext?.theme || 'context not available'
      });
    };
    
    updateInfo();
    const interval = setInterval(updateInfo, 1000);
    
    return () => clearInterval(interval);
  }, [themeContext?.theme]);
  
  // Quick fix buttons
  const forceDarkTheme = () => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
    if (themeContext?.setTheme) {
      themeContext.setTheme('dark');
    }
  };
  
  const forceLightTheme = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
    if (themeContext?.setTheme) {
      themeContext.setTheme('light');
    }
  };
  
  const syncWithBackend = async () => {
    if (authContext?.syncThemeWithBackend) {
      await authContext.syncThemeWithBackend();
      alert('Theme synced with backend!');
    } else {
      alert('Auth context not available');
    }
  };
  
  if (!visible) return null;
  
  if (minimized) {
    return (
      <div 
        className="fixed bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg z-50 cursor-pointer"
        onClick={() => setMinimized(false)}
      >
        🎨
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-lg z-50 max-w-xs text-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Theme Debug</h3>
        <div className="space-x-2">
          <button 
            onClick={() => setMinimized(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            _
          </button>
          <button 
            onClick={() => setVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="space-y-2 mb-3 text-xs">
        <p><strong>HTML Classes:</strong> {currentInfo.htmlClass}</p>
        <p><strong>LocalStorage:</strong> {currentInfo.localStorageTheme}</p>
        <p><strong>Document Class:</strong> {currentInfo.documentClass}</p>
        <p><strong>Context Theme:</strong> {currentInfo.contextTheme}</p>
        <p><strong>Auth:</strong> {authContext?.isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
      </div>
      
      <div className="flex flex-col space-y-2">
        <button 
          onClick={forceDarkTheme}
          className="bg-gray-800 text-white px-2 py-1 rounded text-xs"
        >
          Force Dark Theme
        </button>
        <button 
          onClick={forceLightTheme}
          className="bg-yellow-100 text-black px-2 py-1 rounded text-xs"
        >
          Force Light Theme
        </button>
        {authContext?.isAuthenticated && (
          <button 
            onClick={syncWithBackend}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            Sync With Backend
          </button>
        )}
      </div>
    </div>
  );
};

export default ThemeDebugHelper; 