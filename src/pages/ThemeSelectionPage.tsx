import React, { useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
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
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Apply theme change immediately and globally
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setGlobalTheme(newTheme);
    
    // Apply directly to document to ensure immediate change
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      {/* Twitter-inspired background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 dark:bg-blue-900/30 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-800/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
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
          rounded="full"
          className="flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400"
          onClick={prevStep}
        >
          <ArrowLeft size={18} />
        </Button>
      </motion.div>
      
      <motion.div 
        className="max-w-3xl w-full text-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <ScripeIconRounded className="w-20 h-20 text-blue-500" />
            <Twitter className="absolute bottom-0 right-0 text-blue-500 bg-white dark:bg-gray-900 p-1 rounded-full w-7 h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {t('chooseStyle')}
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 mb-10"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {t('styleDescription')}
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className={`${theme === "light" ? "ring-2 ring-blue-500" : ""} bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md cursor-pointer transition-all`}
            onClick={() => handleThemeChange("light")}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="mb-6 w-full rounded-lg overflow-hidden shadow-sm">
              <div className="bg-white p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-gray-100 h-6 w-full mb-4 rounded-lg flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-gray-100 rounded-lg mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-gray-100 rounded-lg mb-2"></div>
                    <div className="h-full bg-gray-100 rounded-lg"></div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-blue-100 text-blue-500 p-1 rounded-full">
                  <SunIcon size={16} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className={`w-5 h-5 rounded-full border-2 border-blue-500 mr-3 flex items-center justify-center ${theme === "light" ? "bg-blue-500" : "bg-transparent"}`}>
                {theme === "light" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className={`text-lg font-medium ${theme === "light" ? "text-blue-500" : "text-gray-600 dark:text-gray-400"}`}>{t('light')}</span>
            </div>
          </motion.div>
          
          <motion.div 
            className={`${theme === "dark" ? "ring-2 ring-blue-500" : ""} bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md cursor-pointer transition-all`}
            onClick={() => handleThemeChange("dark")}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="mb-6 w-full rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-900 p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-gray-800 h-6 w-full mb-4 rounded-lg flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-gray-800 rounded-lg mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-gray-800 rounded-lg mb-2"></div>
                    <div className="h-full bg-gray-800 rounded-lg"></div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-blue-900/50 text-blue-400 p-1 rounded-full">
                  <MoonIcon size={16} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className={`w-5 h-5 rounded-full border-2 border-blue-500 mr-3 flex items-center justify-center ${theme === "dark" ? "bg-blue-500" : "bg-transparent"}`}>
                {theme === "dark" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className={`text-lg font-medium ${theme === "dark" ? "text-blue-500" : "text-gray-600 dark:text-gray-400"}`}>{t('dark')}</span>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="twitter"
            rounded="full"
            className="w-64 py-3 text-white font-bold"
            onClick={nextStep}
          >
            {t('continue')}
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center mt-4"
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
