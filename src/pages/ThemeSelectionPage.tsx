
import React, { useEffect } from "react";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon, ArrowLeft, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function ThemeSelectionPage() {
  const { theme, setTheme, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { setTheme: setGlobalTheme } = useTheme();
  const { t } = useLanguage();
  const { current, total } = getStepProgress();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Apply theme change immediately and globally
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setGlobalTheme(newTheme);
    
    // Apply directly to document to ensure immediate change
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  // Ensure theme is applied when component loads
  useEffect(() => {
    if (theme) {
      handleThemeChange(theme);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-white to-primary-50 dark:from-gray-900 dark:to-gray-800 text-foreground relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
        <div className="absolute top-0 -left-[30%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary-200 to-primary-300 dark:from-primary-900/30 dark:to-primary-800/20 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[30%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-900/30 dark:to-violet-800/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z\" fill=\"rgba(79,70,229,0.1)\"%3E%3C/path%3E%3C/svg%3E')] opacity-50"></div>
      </div>
      
      {/* Back button */}
      <motion.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-primary-100/50 dark:hover:bg-primary-900/20 hover:text-primary-500 dark:hover:text-primary-400"
          onClick={prevStep}
        >
          <ArrowLeft size={18} />
        </Button>
      </motion.div>
      
      <motion.div 
        className="max-w-3xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <div className="relative">
            <ScripeIconRounded className="w-20 h-20 text-primary-500 drop-shadow-lg" />
            <Twitter className="absolute bottom-0 right-0 text-primary-500 bg-white dark:bg-gray-800 p-1 rounded-full w-7 h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-violet-600 dark:from-primary-400 dark:to-violet-400 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          {t('chooseStyle')}
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl mx-auto"
          variants={itemVariants}
        >
          {t('styleDescription')}
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <motion.div 
            className={`${theme === "light" ? "ring-2 ring-primary-500" : ""} relative bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md cursor-pointer transition-all group`}
            onClick={() => handleThemeChange("light")}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="mb-6 w-full rounded-lg overflow-hidden shadow-sm">
              <div className="bg-white p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-gray-100 h-6 w-full mb-4 rounded-lg flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-primary-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-300 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-200"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-gray-100 rounded-lg mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-gray-100 rounded-lg mb-2"></div>
                    <div className="h-full bg-gray-100 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className={`w-5 h-5 rounded-full border-2 border-primary-500 mr-3 flex items-center justify-center ${theme === "light" ? "bg-primary-500" : "bg-transparent"}`}>
                {theme === "light" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className={`text-lg font-medium ${theme === "light" ? "text-primary-500" : "text-gray-600 dark:text-gray-400"}`}>{t('light')}</span>
            </div>
            
            {/* Floating sun icon */}
            <motion.div 
              className="absolute top-2 right-2 bg-primary-100 text-primary-500 p-1 rounded-full"
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <SunIcon size={16} />
            </motion.div>
            
            {/* Gradient highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
          </motion.div>
          
          <motion.div 
            className={`${theme === "dark" ? "ring-2 ring-primary-500" : ""} relative bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md cursor-pointer transition-all group`}
            onClick={() => handleThemeChange("dark")}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="mb-6 w-full rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-900 p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-gray-800 h-6 w-full mb-4 rounded-lg flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-300"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-gray-800 rounded-lg mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-gray-800 rounded-lg mb-2"></div>
                    <div className="h-full bg-gray-800 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className={`w-5 h-5 rounded-full border-2 border-primary-500 mr-3 flex items-center justify-center ${theme === "dark" ? "bg-primary-500" : "bg-transparent"}`}>
                {theme === "dark" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className={`text-lg font-medium ${theme === "dark" ? "text-primary-500" : "text-gray-600 dark:text-gray-400"}`}>{t('dark')}</span>
            </div>
            
            {/* Floating moon icon */}
            <motion.div 
              className="absolute top-2 right-2 bg-primary-900/50 text-primary-400 p-1 rounded-full"
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, -10, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <MoonIcon size={16} />
            </motion.div>
            
            {/* Gradient highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          variants={itemVariants}
        >
          <Button
            variant="gradient"
            className="w-64 py-3 text-white font-bold"
            onClick={nextStep}
          >
            {t('continue')}
          </Button>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mt-4"
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
