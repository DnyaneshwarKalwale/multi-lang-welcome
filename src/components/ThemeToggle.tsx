
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 rounded-full overflow-hidden border border-primary-100 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-gray-800"
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Toggle theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 30, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="h-5 w-5 text-yellow-400" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 30, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -30, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {isHovered && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
          >
            <SunMoon className="h-10 w-10 text-primary-400" />
          </motion.div>
        )}
      </div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-200/20 to-violet-200/20 dark:from-primary-900/30 dark:to-violet-900/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
