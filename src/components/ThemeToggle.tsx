
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 rounded-full overflow-hidden border border-primary-100 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-gray-800"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {theme === 'dark' ? (
          <motion.div
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5 text-yellow-400" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
