
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Component for debugging theme functionality
 * Note: Since we only have light theme, this is mostly a placeholder
 * that shows the current theme state
 */
const ThemeDebug: React.FC = () => {
  const { theme, isThemeLoaded } = useTheme();
  
  useEffect(() => {
    console.log("ThemeDebug mounted, current theme:", theme);
    console.log("localStorage theme:", localStorage.getItem("theme"));
    console.log("Dark class on HTML:", document.documentElement.classList.contains("dark"));
  }, [theme]);
  
  const forceLight = () => {
    // Use the applyTheme function directly
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    localStorage.setItem("theme", "light");
    console.log("Forced light theme");
  };
  
  const syncWithLocalStorage = () => {
    // Ensure localStorage has light theme
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    console.log("Synced with localStorage: light");
  };
  
  return (
    <div className="fixed bottom-4 right-4 p-4 glass-card rounded-lg z-50 bg-white/80 backdrop-blur-md border border-gray-200/30 text-foreground">
      <h3 className="text-sm font-medium mb-2 text-blue-600">Theme Debug</h3>
      <p className="text-xs mb-2 text-muted-foreground">
        Current theme: <strong className="text-blue-500">light</strong>
      </p>
      <div className="flex flex-col gap-2">
        <Button size="sm" onClick={forceLight} variant="outline" className="text-xs border-blue-200 hover:bg-blue-50">Force Light</Button>
        <Button size="sm" onClick={syncWithLocalStorage} variant="outline" className="text-xs border-blue-200 hover:bg-blue-50">Sync with localStorage</Button>
      </div>
    </div>
  );
};

export default ThemeDebug;
