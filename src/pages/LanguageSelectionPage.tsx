import React, { useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Twitter, CheckCircle, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelectionPage() {
  const { language: onboardingLanguage, setLanguage: setOnboardingLanguage, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { setLanguage: setAppLanguage } = useLanguage();
  const { current, total } = getStepProgress();

  // Array of available languages - only English and German as specified in LanguageContext
  const languageOptions = [
    { code: "english", name: "English", description: "Most widely used", flag: "🇺🇸" },
    { code: "german", name: "Deutsch", description: "German language option", flag: "🇩🇪" }
  ];

  // When onboarding language changes, also update the app language
  useEffect(() => {
    if (onboardingLanguage) {
      setAppLanguage(onboardingLanguage);
    }
  }, [onboardingLanguage, setAppLanguage]);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative overflow-hidden">
      {/* Animated gradient background with Twitter blue */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-900 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dots-pattern opacity-10 -z-10"></div>
      
      {/* Back button */}
      <BackButton 
        onClick={prevStep} 
        absolute 
      />
      
      <motion.div 
        className="max-w-md w-full"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-10 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <ScripeIconRounded className="w-20 h-20" />
            <motion.div 
              className="absolute -bottom-2 -right-2 text-blue-500"
              animate={{ 
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Twitter size={24} />
            </motion.div>
          </div>
        </motion.div>

        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            Select Your Language
          </motion.h1>
          
          <motion.p 
            className="text-base text-gray-600 dark:text-gray-300"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
          >
            Choose the language you'll use throughout the app
          </motion.p>
        </div>
        
        <motion.div 
          className="space-y-4 mx-auto mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {languageOptions.map((lang) => (
            <motion.div key={lang.code} variants={itemVariants}>
              <Button
                variant={onboardingLanguage === lang.code ? "twitter" : "outline"}
                onClick={() => setOnboardingLanguage(lang.code as any)}
                className={`
                  relative w-full flex items-center p-5 text-left justify-between rounded-xl transition-all duration-300
                  ${onboardingLanguage === lang.code 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 border-gray-200 dark:border-gray-800/60'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <h3 className={`font-semibold text-lg`}>
                      {lang.name}
                    </h3>
                    <p className={`text-sm ${onboardingLanguage === lang.code ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      {lang.description}
                    </p>
                  </div>
                </div>
                
                {onboardingLanguage === lang.code && (
                  <CheckCircle className="w-5 h-5" />
                )}
              </Button>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="flex justify-center gap-4 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <Button 
            variant="twitter"
            rounded="full"
            className="py-5 px-8 gap-2 w-full font-semibold"
            onClick={nextStep}
            disabled={!onboardingLanguage}
          >
            Continue
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-2"
        >
          <ProgressDots total={total} current={current} color="novus" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
