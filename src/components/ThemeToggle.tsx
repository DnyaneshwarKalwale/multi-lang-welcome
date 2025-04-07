
import { useState, useEffect } from "react";
import { Moon, Sun, MonitorSmartphone } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { applyTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

interface ThemeToggleProps {
  variant?: "default" | "minimal" | "expanded";
  className?: string;
}

export default function ThemeToggle({ variant = "default", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme, isThemeLoaded } = useTheme();
  const [mounted, setMounted] = useState(false);

  // On mount, initialize state
  useEffect(() => {
    setMounted(true);
    
    // Debug
    console.log(`ThemeToggle mounted. Current theme: ${theme}, isThemeLoaded: ${isThemeLoaded}`);
  }, [theme, isThemeLoaded]);

  // Force apply theme on dashboard if needed
  useEffect(() => {
    if (mounted && theme && window.location.pathname.includes('/dashboard')) {
      console.log(`ThemeToggle on dashboard forcing theme check: ${theme}`);
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const hasThemeClass = document.documentElement.classList.contains(theme);
        if (!hasThemeClass) {
          console.log(`ThemeToggle fixing dashboard theme: ${theme}`);
          applyTheme(theme);
        }
      }, 100);
    }
  }, [mounted, theme]);

  // Log when toggle is clicked
  const handleToggle = () => {
    console.log("Theme toggle clicked on dashboard");
    
    // Force the theme toggle with direct DOM manipulation to ensure it takes effect
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Apply the theme directly to guarantee it changes
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Also trigger the context update
    toggleTheme();
    
    // Show toast for feedback
    toast.success(`Theme changed to ${newTheme} mode`);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));
  };

  const handleSelectTheme = (newTheme: 'light' | 'dark') => {
    console.log(`Setting theme to ${newTheme} from dashboard`);
    
    // Apply theme directly
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Update context
    setTheme(newTheme);
    
    // Show toast for feedback
    toast.success(`Theme changed to ${newTheme} mode`);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted || !isThemeLoaded) {
    return (
      <button 
        className={`w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800/60 opacity-50 flex items-center justify-center ${className}`}
        disabled
        aria-label="Theme loading"
      >
        <div className="w-5 h-5 animate-pulse"></div>
      </button>
    );
  }

  // Expanded variant with system option
  if (variant === "expanded") {
    return (
      <div className={`flex items-center gap-2 rounded-lg bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm p-1 border border-gray-200/20 dark:border-gray-700/40 shadow-sm ${className}`}>
        <button
          onClick={() => handleSelectTheme('light')}
          className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition-all duration-200 ${theme === "light" ? "bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium" : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"}`}
          aria-label="Light theme"
        >
          <Sun className={`h-4 w-4 ${theme === "light" ? "text-amber-500" : "text-gray-500 dark:text-gray-400"}`} />
          <span className="text-sm">Light</span>
        </button>
        <button
          onClick={() => handleSelectTheme('dark')}
          className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition-all duration-200 ${theme === "dark" ? "bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"}`}
          aria-label="Dark theme"
        >
          <Moon className={`h-4 w-4 ${theme === "dark" ? "text-indigo-400" : "text-gray-500 dark:text-gray-400"}`} />
          <span className="text-sm">Dark</span>
        </button>
      </div>
    );
  }

  // Minimal variant (just icon)
  if (variant === "minimal") {
    return (
      <button
        onClick={handleToggle}
        className={`w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100/80 dark:hover:bg-gray-800/50 transition-colors ${className}`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === "dark" ? (
          <Sun className="h-[18px] w-[18px] text-amber-400 dark:text-amber-300" />
        ) : (
          <Moon className="h-[18px] w-[18px] text-indigo-600 dark:text-indigo-400" />
        )}
      </button>
    );
  }

  // Default modern toggle with animation
  return (
    <button
      onClick={handleToggle}
      className={`relative w-12 h-6 rounded-full bg-gradient-to-r ${theme === "dark" 
        ? "from-indigo-800 to-violet-900 border border-indigo-700/40" 
        : "from-amber-200 to-yellow-300 border border-amber-300/40"} 
        shadow-inner flex items-center px-0.5 transition-all duration-500 ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <motion.div 
        className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center ${theme === "dark" ? "bg-indigo-400" : "bg-amber-500"}`}
        animate={{ x: theme === "dark" ? 24 : 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
      >
        {theme === "dark" ? (
          <Moon className="h-3 w-3 text-indigo-900" />
        ) : (
          <Sun className="h-3 w-3 text-amber-900" />
        )}
      </motion.div>
    </button>
  );
}
