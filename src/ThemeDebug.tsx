
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
    <div className="fixed bottom-4 right-4 p-4 glass-card rounded-lg z-50 text-foreground">
      <h3 className="text-sm font-medium mb-2 text-foreground">Theme Debug</h3>
      <p className="text-xs mb-2 text-muted-foreground">
        Current theme: <strong>{theme}</strong>
      </p>
      <div className="flex flex-col gap-2">
        <Button size="sm" onClick={forceLight} variant="outline" className="text-xs">Force Light</Button>
        <Button size="sm" onClick={forceDark} variant="outline" className="text-xs">Force Dark</Button>
        <Button size="sm" onClick={toggleManually} variant="outline" className="text-xs">Toggle Theme</Button>
        <Button size="sm" onClick={syncWithLocalStorage} variant="outline" className="text-xs">Sync with localStorage</Button>
      </div>
    </div>
  );
};

export default ThemeDebug;
