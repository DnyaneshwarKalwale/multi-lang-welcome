import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function LanguageSelectionPage() {
  const { language, setLanguage, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { t } = useLanguage();
  const { current, total } = getStepProgress();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
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
          className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {t('chooseLanguage')}
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-10 text-center"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {t('languageDescription')}
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className={`bg-gray-900/50 backdrop-blur-sm border-2 ${language === "english" ? "border-purple-600" : "border-gray-800"} rounded-xl p-8 cursor-pointer hover:border-purple-600/60 transition-all`}
            onClick={() => setLanguage("english")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start">
              <div className="w-10 h-10 flex-shrink-0 rounded mr-4 overflow-hidden">
                <div className="w-full h-full flex flex-col">
                  <div className="flex-1 bg-blue-700"></div>
                  <div className="flex-1 flex">
                    <div className="w-1/3 bg-red-600"></div>
                    <div className="w-1/3 bg-white"></div>
                    <div className="w-1/3 bg-red-600"></div>
                  </div>
                  <div className="flex-1 bg-blue-700"></div>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">{t('english')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('englishDescription')}
                </p>
              </div>
              {language === "english" && (
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className={`bg-gray-900/50 backdrop-blur-sm border-2 ${language === "german" ? "border-purple-600" : "border-gray-800"} rounded-xl p-8 cursor-pointer hover:border-purple-600/60 transition-all`}
            onClick={() => setLanguage("german")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start">
              <div className="w-10 h-10 flex-shrink-0 rounded mr-4 overflow-hidden">
                <div className="w-full h-full flex flex-col">
                  <div className="flex-1 bg-black"></div>
                  <div className="flex-1 bg-red-600"></div>
                  <div className="flex-1 bg-yellow-400"></div>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">{t('german')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('germanDescription')}
                </p>
              </div>
              {language === "german" && (
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={nextStep}
            disabled={!language}
          >
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
