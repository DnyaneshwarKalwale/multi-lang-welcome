
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Component for debugging theme toggle functionality
 */
const ThemeDebug: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  useEffect(() => {
    console.log("ThemeDebug mounted, current theme:", theme);
    console.log("localStorage theme:", localStorage.getItem("theme"));
    console.log("Dark class on HTML:", document.documentElement.classList.contains("dark"));
  }, [theme]);
  
  const forceLight = () => {
    setTheme("light");
    console.log("Forced light theme");
  };
  
  const forceDark = () => {
    setTheme("dark");
    console.log("Forced dark theme");
  };
  
  const toggleManually = () => {
    toggleTheme();
    console.log("Toggled theme manually");
  };
  
  const syncWithLocalStorage = () => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      console.log("Synced with localStorage:", savedTheme);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 p-4 glass-card rounded-lg z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30 text-foreground">
      <h3 className="text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">Theme Debug</h3>
      <p className="text-xs mb-2 text-muted-foreground">
        Current theme: <strong className="text-blue-500 dark:text-blue-300">{theme}</strong>
      </p>
      <div className="flex flex-col gap-2">
        <Button size="sm" onClick={forceLight} variant="outline" className="text-xs border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30">Force Light</Button>
        <Button size="sm" onClick={forceDark} variant="outline" className="text-xs border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30">Force Dark</Button>
        <Button size="sm" onClick={toggleManually} variant="outline" className="text-xs border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30">Toggle Theme</Button>
        <Button size="sm" onClick={syncWithLocalStorage} variant="outline" className="text-xs border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30">Sync with localStorage</Button>
      </div>
    </div>
  );
};

export default ThemeDebug;
