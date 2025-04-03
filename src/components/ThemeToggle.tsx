import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  // Keep track of the current theme
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // On mount, initialize state from HTML class and set up listeners
  useEffect(() => {
    // Get initial state from HTML
    const initialIsDark = document.documentElement.classList.contains("dark");
    setIsDark(initialIsDark);
    setMounted(true);
    
    // Set up storage event listener for syncing across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = e.newValue;
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
          setIsDark(true);
        } else if (newTheme === "light") {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
          setIsDark(false);
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    // Determine new theme
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Apply theme to document
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
    
    // Log for debugging
    console.log(`Theme toggled to: ${newIsDark ? "dark" : "light"}`);
    
    // Dispatch storage event for other components to detect the change
    window.dispatchEvent(new StorageEvent("storage", {
      key: "theme",
      newValue: newIsDark ? "dark" : "light",
      storageArea: localStorage
    }));
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
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
      onClick={toggleTheme}
      className="w-10 h-10 p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
      )}
    </button>
  );
}
