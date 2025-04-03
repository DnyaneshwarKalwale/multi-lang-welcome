import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, SunMoon, Sparkles } from "lucide-react";
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from "framer-motion";

// Internal ThemeToggle component
const InternalThemeToggle = () => {
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
              className="relative"
            >
              <Sun className="h-5 w-5 text-yellow-400" />
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 30, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -30, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -2, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        ease: "easeInOut" 
                      }}
                      className="h-2 w-2 rounded-full bg-indigo-300 dark:bg-indigo-500"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
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

// Safe wrapper that catches errors if used outside ThemeProvider
const ThemeToggle = () => {
  try {
    return <InternalThemeToggle />;
  } catch (error) {
    console.warn('ThemeToggle rendered outside of ThemeProvider');
    return null;
  }
};

export default ThemeToggle;
