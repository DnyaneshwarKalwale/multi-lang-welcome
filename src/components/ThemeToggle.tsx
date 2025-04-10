
import React from "react";
import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  variant?: "minimal" | "expanded";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = "minimal" }) => {
  const { theme, toggleTheme } = useTheme();
  
  // Spring animation for the toggle
  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30
  };
  
  if (variant === "minimal") {
    return (
      <motion.button
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        onClick={toggleTheme}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div 
          initial={false}
          animate={{ rotate: theme === "light" ? 0 : 180 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {theme === "light" ? (
            <SunIcon className="h-5 w-5 text-amber-500" />
          ) : (
            <MoonIcon className="h-5 w-5 text-indigo-400" />
          )}
        </motion.div>
      </motion.button>
    );
  }
  
  return (
    <motion.button
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={toggleTheme}
      className="bg-gray-200 dark:bg-gray-700 flex items-center px-1 py-1 rounded-full w-20 h-10 relative"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
        layout
        transition={spring}
        animate={{ x: theme === "light" ? 0 : 40 }}
      >
        {theme === "light" ? (
          <SunIcon className="h-5 w-5 text-amber-500" />
        ) : (
          <MoonIcon className="h-5 w-5 text-indigo-400" />
        )}
      </motion.div>
      
      <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none text-xs font-medium">
        <span className={`${theme === 'light' ? 'opacity-0' : 'text-gray-400'}`}>
          Dark
        </span>
        <span className={`${theme === 'dark' ? 'opacity-0' : 'text-gray-600'}`}>
          Light
        </span>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
