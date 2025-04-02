import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function LanguageSelectionPage() {
  const { language, setLanguage, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  // Array of available languages
  const languageOptions = [
    { code: "english", name: "English", description: "Most widely used" },
    { code: "spanish", name: "Español", description: "Segunda lengua más hablada" },
    { code: "french", name: "Français", description: "Excellente option européenne" },
    { code: "german", name: "Deutsch", description: "Zentral-europäische Option" }
  ];

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
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
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
        className="max-w-2xl w-full"
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

        <div className="text-center mb-10">
          <motion.h1 
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            Choose Your Preferred Language
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
          >
            Select the language you'd like to use for content creation
          </motion.p>
        </div>
        
        <motion.div 
          className="space-y-4 max-w-xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {languageOptions.map((lang) => (
            <motion.div key={lang.code} variants={itemVariants}>
              <Button
                variant="outline"
                onClick={() => setLanguage(lang.code as any)}
                className={`
                  relative w-full flex items-center p-5 text-left rounded-xl transition-all duration-300
                  ${language === lang.code 
                    ? 'bg-gradient-to-r from-blue-500/10 to-blue-500/10 border-blue-500 dark:border-blue-400 shadow-md' 
                    : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 border-gray-200 dark:border-gray-800/60'}
                `}
              >
                <span className="text-xl mr-4">{lang.code === "english" ? "🇺🇸" : lang.code === "spanish" ? "🇪🇸" : lang.code === "french" ? "🇫🇷" : "🇩🇪"}</span>
                <div className="flex-1">
                  <h3 className={`font-medium text-lg ${language === lang.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {lang.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lang.description}</p>
                </div>
                
                {language === lang.code && (
                  <CheckCircle className="text-blue-500 dark:text-blue-400 w-6 h-6 ml-2" />
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
            className="py-6 px-8 gap-2 w-full sm:w-auto font-medium max-w-xs"
            onClick={nextStep}
            disabled={!language}
          >
            Continue
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <ProgressDots total={total} current={current} color="novus" />
        </motion.div>
      </motion.div>
    </div>
  );
}
