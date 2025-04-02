import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function LanguageSelectionPage() {
  const { language, setLanguage, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { t } = useLanguage();
  const { current, total } = getStepProgress();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-teal-200 dark:bg-teal-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-cyan-200 dark:bg-cyan-900 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5 -z-10"></div>
      
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
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <ScripeIconRounded className="w-20 h-20" />
            <motion.div 
              className="absolute -bottom-1 -right-1 text-teal-500 dark:text-teal-400"
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Globe size={24} />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center text-gradient"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {t('chooseLanguage')}
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 mb-10 text-center"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {t('languageDescription')}
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className={`bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border ${language === "english" ? "border-teal-400 ring-2 ring-teal-400/30" : "border-gray-200 dark:border-gray-800"} rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all`}
            onClick={() => setLanguage("english")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start">
              <div className="w-12 h-12 flex-shrink-0 rounded-lg mr-4 overflow-hidden shadow-md">
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('english')}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('englishDescription')}
                </p>
              </div>
              {language === "english" && (
                <div className="ml-auto">
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className={`bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border ${language === "german" ? "border-cyan-400 ring-2 ring-cyan-400/30" : "border-gray-200 dark:border-gray-800"} rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all`}
            onClick={() => setLanguage("german")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start">
              <div className="w-12 h-12 flex-shrink-0 rounded-lg mr-4 overflow-hidden shadow-md">
                <div className="w-full h-full flex flex-col">
                  <div className="flex-1 bg-black"></div>
                  <div className="flex-1 bg-red-600"></div>
                  <div className="flex-1 bg-yellow-400"></div>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('german')}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('germanDescription')}
                </p>
              </div>
              {language === "german" && (
                <div className="ml-auto">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
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
            variant="cyan"
          >
            {t('continue')}
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <ProgressDots total={total} current={current} color="novus" />
        </motion.div>
      </motion.div>
    </div>
  );
}
