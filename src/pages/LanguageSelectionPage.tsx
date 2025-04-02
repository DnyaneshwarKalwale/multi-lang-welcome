import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Languages, MessageSquare, Globe2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function LanguageSelectionPage() {
  const { selectedLanguage, setSelectedLanguage, nextStep, getStepProgress } = useOnboarding();
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 py-6 sm:py-10 gradient-dark text-white relative overflow-hidden">
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
        <Globe2 size={80} className="text-brand-primary" />
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
          {t('chooseLanguage')}
        </motion.h1>
        
        <motion.p 
          className="text-base sm:text-xl text-brand-gray-300 mb-6 sm:mb-10 text-center max-w-2xl mx-auto px-2"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {t('languageDescription')}
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
              p-4 sm:p-6 flex flex-col items-center cursor-pointer 
              transition-all duration-300
              ${selectedLanguage === "en" ? 'ring-2 ring-brand-primary shadow-lg shadow-brand-primary/20' : 'opacity-90'}
            `}
            onClick={() => setSelectedLanguage("en")}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className={`
              p-4 sm:p-6 rounded-full mb-4 sm:mb-6 
              ${selectedLanguage === "en" ? 'bg-brand-primary/20' : 'bg-brand-gray-800/50'}
              transition-all duration-300
            `}>
              <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-brand-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-brand-gray-900 dark:text-white">{t('english')}</h3>
            <p className="text-sm sm:text-base text-brand-gray-600 dark:text-brand-gray-300 text-center">
              {t('englishDescription')}
            </p>
            {selectedLanguage === "en" && (
              <div className="mt-4 w-3 h-3 rounded-full bg-brand-primary"></div>
            )}
          </motion.div>
          
          <motion.div 
            className={`
              card-modern
              p-4 sm:p-6 flex flex-col items-center cursor-pointer 
              transition-all duration-300
              ${selectedLanguage === "es" ? 'ring-2 ring-brand-primary shadow-lg shadow-brand-primary/20' : 'opacity-90'}
            `}
            onClick={() => setSelectedLanguage("es")}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className={`
              p-4 sm:p-6 rounded-full mb-4 sm:mb-6 
              ${selectedLanguage === "es" ? 'bg-brand-primary/20' : 'bg-brand-gray-800/50'}
              transition-all duration-300
            `}>
              <Languages className="w-12 h-12 sm:w-16 sm:h-16 text-brand-secondary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-brand-gray-900 dark:text-white">{t('spanish')}</h3>
            <p className="text-sm sm:text-base text-brand-gray-600 dark:text-brand-gray-300 text-center">
              {t('spanishDescription')}
            </p>
            {selectedLanguage === "es" && (
              <div className="mt-4 w-3 h-3 rounded-full bg-brand-primary"></div>
            )}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center gap-4 sm:gap-6"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={nextStep}
            disabled={!selectedLanguage}
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
