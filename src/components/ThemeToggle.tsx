import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, isThemeLoaded } = useTheme();
  const { isAuthenticated, syncThemeWithBackend } = useAuth();
  const [mounted, setMounted] = useState(false);

  // On mount, set mounted state to true
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme toggle and save to backend if authenticated
  const handleToggleTheme = () => {
    toggleTheme();
    
    // Sync with backend if user is authenticated
    if (isAuthenticated) {
      // Use setTimeout to ensure the theme is toggled first
      setTimeout(() => {
        syncThemeWithBackend();
      }, 0);
    }
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
      onClick={handleToggleTheme}
      className="w-10 h-10 p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
      )}
    </button>
  );
}
