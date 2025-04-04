
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, isThemeLoaded } = useTheme();
  const [mounted, setMounted] = useState(false);

  // On mount, initialize state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted || !isThemeLoaded) {
    return (
      <button 
        className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800/60 opacity-50 flex items-center justify-center"
        disabled
        aria-label="Theme loading"
      >
        <div className="w-5 h-5 animate-pulse"></div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-md bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/40 
                hover:bg-blue-100/20 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 
                shadow-sm transition-all duration-300 flex items-center justify-center"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      )}
    </button>
  );
}
