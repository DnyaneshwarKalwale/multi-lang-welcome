import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, isThemeLoaded } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // On mount, mark component as mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rapid clicking by adding a small debounce
  const handleThemeToggle = () => {
    if (isChanging) return;
    
    setIsChanging(true);
    toggleTheme();
    
    // Reset changing state after transition completes
    setTimeout(() => {
      setIsChanging(false);
    }, 300);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted || !isThemeLoaded) {
    return (
      <button 
        className="w-10 h-10 p-2 rounded-md bg-gray-100 dark:bg-gray-800 opacity-50"
        disabled
        aria-label="Theme loading"
      >
        <div className="w-5 h-5"></div>
      </button>
    );
  }

  return (
    <button
      onClick={handleThemeToggle}
      disabled={isChanging}
      className={`
        w-10 h-10 p-2 rounded-md 
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
        transition-colors
        ${isChanging ? 'opacity-70 cursor-not-allowed' : ''}
      `}
      aria-label={`Toggle theme to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
      )}
    </button>
  );
}
