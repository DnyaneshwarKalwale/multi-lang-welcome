import React, { useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon, Palette, Sparkles } from "lucide-react";
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
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
    <div className={`min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 py-6 sm:py-10 gradient-dark text-white relative overflow-hidden`}>
      {/* Modern gradient background */}
      <div className="absolute inset-0 opacity-30 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-brand-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-brand-secondary/20 blur-[120px]"></div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute opacity-10 pointer-events-none hidden sm:block"
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8, 
          ease: "easeInOut" 
        }}
        style={{ top: '15%', right: '10%' }}
      >
        <Palette size={80} className="text-brand-primary" />
      </motion.div>
      
      <motion.div 
        className="absolute opacity-10 pointer-events-none hidden sm:block"
        animate={{ 
          y: [0, 20, 0],
          x: [0, -15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10, 
          ease: "easeInOut",
          delay: 1 
        }}
        style={{ bottom: '20%', left: '8%' }}
      >
        <Sparkles size={60} className="text-brand-pink" />
      </motion.div>
      
      {/* Back button */}
      <BackButton 
        onClick={prevStep} 
        absolute 
        variant="twitter" 
      />
      
      <motion.div 
        className="max-w-4xl w-full px-2 sm:px-4" 
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-4 sm:mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScripeIconRounded className="w-16 h-16 sm:w-20 sm:h-20" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent gradient-primary"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {t('chooseStyle')}
        </motion.h1>
        
        <motion.p 
          className="text-base sm:text-xl text-brand-gray-300 mb-6 sm:mb-10 text-center max-w-2xl mx-auto px-2"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {t('styleDescription')}
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className={`
              card-modern
              p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer 
              transition-all duration-300
              ${theme === "light" ? 'ring-2 ring-brand-primary shadow-lg shadow-brand-primary/20' : 'opacity-90'}
            `}
            onClick={() => handleThemeChange("light")}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="mb-4 sm:mb-6 w-full rounded-lg overflow-hidden shadow-lg relative">
              <div className="bg-white p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-brand-gray-100 h-6 w-full mb-4 rounded flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-brand-gray-300 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-gray-300 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-gray-300"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-brand-gray-100 rounded mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-brand-gray-100 rounded mb-2"></div>
                    <div className="h-full bg-brand-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-brand-primary/10 text-brand-primary p-1 rounded-full">
                  <SunIcon size={16} />
                </div>
              </div>
              <div className={`absolute inset-0 ${theme === "light" ? "bg-transparent" : "bg-black/30"}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${theme === "light" ? "border-brand-primary bg-brand-primary" : "border-brand-gray-500"}`}>
                {theme === "light" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <span className={`text-lg ${theme === "light" ? "text-brand-gray-900 dark:text-white" : "text-brand-gray-600 dark:text-brand-gray-400"}`}>{t('light')}</span>
            </div>
          </motion.div>
          
          <motion.div 
            className={`
              card-modern
              p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer 
              transition-all duration-300
              ${theme === "dark" ? 'ring-2 ring-brand-primary shadow-lg shadow-brand-primary/20' : 'opacity-90'}
            `}
            onClick={() => handleThemeChange("dark")}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="mb-4 sm:mb-6 w-full rounded-lg overflow-hidden shadow-lg relative">
              <div className="bg-brand-gray-800 p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-brand-gray-700 h-6 w-full mb-4 rounded flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-brand-gray-600 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-gray-600 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-gray-600"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-brand-gray-700 rounded mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-brand-gray-700 rounded mb-2"></div>
                    <div className="h-full bg-brand-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-brand-primary/20 text-brand-primary p-1 rounded-full">
                  <MoonIcon size={16} />
                </div>
              </div>
              <div className={`absolute inset-0 ${theme === "dark" ? "bg-transparent" : "bg-black/30"}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${theme === "dark" ? "border-brand-primary bg-brand-primary" : "border-brand-gray-500"}`}>
                {theme === "dark" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <span className={`text-lg ${theme === "dark" ? "text-brand-gray-900 dark:text-white" : "text-brand-gray-600 dark:text-brand-gray-400"}`}>{t('dark')}</span>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center gap-4 sm:gap-6"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={nextStep}
            className="button-primary"
          >
            {t('continue')}
          </ContinueButton>
        </motion.div>
      </motion.div>
      
      <ProgressDots 
        current={current} 
        total={total} 
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      />
    </div>
  );
}
