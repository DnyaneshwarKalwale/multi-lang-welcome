import React, { useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} relative overflow-hidden`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className={`absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-200'} blur-[120px]`}></div>
        <div className={`absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-200'} blur-[120px]`}></div>
      </div>
      
      {/* Back button */}
      <BackButton 
        onClick={prevStep} 
        absolute
      />
      
      <motion.div 
        className="max-w-3xl w-full text-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.h1 
          className={`text-4xl font-bold mb-4 text-center ${theme === 'dark' ? 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400' : 'text-indigo-900'}`}
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {t('chooseStyle')}
        </motion.h1>
        
        <motion.p 
          className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-10 text-center`}
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {t('styleDescription')}
        </motion.p>
        
        <motion.div 
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} rounded-xl overflow-hidden mb-12`}
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className={`${theme === "light" ? "ring-2 ring-purple-600" : ""} cursor-pointer ${theme === 'dark' ? 'bg-gray-900/50 backdrop-blur-sm' : 'bg-gray-100'} p-6 flex flex-col items-center justify-center transition-all`}
            onClick={() => handleThemeChange("light")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="mb-6 w-full rounded-lg overflow-hidden shadow-lg relative">
              <div className="bg-white p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-gray-100 h-6 w-full mb-4 rounded flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-gray-100 rounded mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-gray-100 rounded mb-2"></div>
                    <div className="h-full bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-purple-100 text-purple-600 p-1 rounded-full">
                  <SunIcon size={16} />
                </div>
              </div>
              <div className={`absolute inset-0 ${theme === "light" ? "bg-transparent" : "bg-black/30"}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${theme === "light" ? "border-purple-600 bg-purple-600" : "border-gray-500"}`}>
                {theme === "light" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <span className={`text-lg ${theme === "light" ? (theme === 'dark' ? "text-white" : "text-black") : (theme === 'dark' ? "text-gray-400" : "text-gray-600")}`}>{t('light')}</span>
            </div>
          </motion.div>
          
          <motion.div 
            className={`${theme === "dark" ? "ring-2 ring-purple-600" : ""} cursor-pointer ${theme === 'dark' ? 'bg-gray-900/50 backdrop-blur-sm' : 'bg-gray-100'} p-6 flex flex-col items-center justify-center transition-all`}
            onClick={() => handleThemeChange("dark")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="mb-6 w-full rounded-lg overflow-hidden shadow-lg relative">
              <div className="bg-gray-800 p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-gray-700 h-6 w-full mb-4 rounded flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-gray-700 rounded mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-full bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-purple-900/50 text-purple-400 p-1 rounded-full">
                  <MoonIcon size={16} />
                </div>
              </div>
              <div className={`absolute inset-0 ${theme === "dark" ? "bg-transparent" : "bg-black/30"}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${theme === "dark" ? "border-purple-600 bg-purple-600" : "border-gray-500"}`}>
                {theme === "dark" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <span className={`text-lg ${theme === "dark" ? (theme === 'dark' ? "text-white" : "text-black") : (theme === 'dark' ? "text-gray-400" : "text-gray-600")}`}>{t('dark')}</span>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton onClick={nextStep}>
            {t('continue')}
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <ProgressDots total={total} current={current} color="purple" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
