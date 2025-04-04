
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Twitter, Globe, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SekcionIconRounded } from "@/components/ScripeIcon";
import { useLanguage } from "@/contexts/LanguageContext";

// Define the type for language options to match LanguageType
type LanguageCode = "english" | "german" | "spanish" | "french";

interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  speakers: string;
}

export default function LanguageSelectionPage() {
  const navigate = useNavigate();
  const { language: onboardingLanguage, setLanguage: setOnboardingLanguage, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { setLanguage: setAppLanguage } = useLanguage();
  const { current, total } = getStepProgress();

  const languageOptions: LanguageOption[] = [
    { 
      code: "english", 
      name: "English", 
      nativeName: "English",
      flag: "🇺🇸",
      region: "North America",
      speakers: "1.35 billion"
    },
    { 
      code: "german", 
      name: "German", 
      nativeName: "Deutsch",
      flag: "🇩🇪",
      region: "Europe",
      speakers: "95 million"
    },
    { 
      code: "spanish", 
      name: "Spanish", 
      nativeName: "Español",
      flag: "🇪🇸",
      region: "Europe, Latin America",
      speakers: "580 million"
    },
    { 
      code: "french", 
      name: "French", 
      nativeName: "Français",
      flag: "🇫🇷",
      region: "Europe, Africa",
      speakers: "300 million"
    }
  ];

  useEffect(() => {
    if (onboardingLanguage) {
      setAppLanguage(onboardingLanguage);
    }
  }, [onboardingLanguage, setAppLanguage]);

  const handleContinue = () => {
    if (onboardingLanguage) {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const getContinueButtonText = () => {
    switch (onboardingLanguage) {
      case "german":
        return "Fortfahren";
      case "spanish":
        return "Continuar";
      case "french":
        return "Continuer";
      default:
        return "Continue";
    }
  };

  const getPageTitle = () => {
    switch (onboardingLanguage) {
      case "german":
        return "Wähle deine Sprache";
      case "spanish":
        return "Elige tu idioma";
      case "french":
        return "Choisissez votre langue";
      default:
        return "Choose Your Language";
    }
  };

  const getPageDescription = () => {
    switch (onboardingLanguage) {
      case "german":
        return "Wähle die Sprache, die du beim Erkunden der App verwenden möchtest";
      case "spanish":
        return "Selecciona el idioma que usarás mientras exploras la aplicación";
      case "french":
        return "Sélectionnez la langue que vous utiliserez en explorant l'application";
      default:
        return "Select the language you'll use while exploring the app";
    }
  };

  const getStepText = () => {
    switch (onboardingLanguage) {
      case "german":
        return `Schritt ${current + 1} von ${total}`;
      case "spanish":
        return `Paso ${current + 1} de ${total}`;
      case "french":
        return `Étape ${current + 1} sur ${total}`;
      default:
        return `Step ${current + 1} of ${total}`;
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-white to-primary-50 dark:from-gray-900 dark:to-gray-800 text-foreground relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
        <div className="absolute top-0 -left-[30%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary-200 to-primary-300 dark:from-primary-900/30 dark:to-primary-800/20 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[30%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-900/30 dark:to-violet-800/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(79,70,229,0.1)%22%3E%3C/path%3E%3C/svg%3E')] opacity-50"></div>
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
          className="w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-primary-100/50 dark:hover:bg-primary-900/20 hover:text-primary-500 dark:hover:text-primary-400 rounded-full"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
        </Button>
      </motion.div>
      
      <motion.div 
        className="max-w-3xl w-full text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <div className="relative">
            <SekcionIconRounded className="w-20 h-20 text-primary-500 drop-shadow-lg" />
            <motion.div
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md"
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Globe className="w-7 h-7 text-primary-500" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-violet-600 dark:from-primary-400 dark:to-violet-400 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          {getPageTitle()}
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl mx-auto"
          variants={itemVariants}
        >
          {getPageDescription()}
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          {languageOptions.map((lang, index) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.4 }}
              whileHover={{ y: -5 }}
              className={`
                ${onboardingLanguage === lang.code ? "ring-2 ring-primary-500" : ""}
                relative bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 
                shadow-md cursor-pointer transition-all group overflow-hidden
              `}
              onClick={() => setOnboardingLanguage(lang.code)}
            >
              {onboardingLanguage === lang.code && (
                <div className="absolute top-3 right-3 bg-primary-500 text-white p-1 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
              )}
              
              <div className="mb-4 flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl shadow-inner">
                  {lang.flag}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {lang.nativeName}
                    </h3>
                    {lang.code !== "english" && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({lang.name})
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>{lang.region}</span>
                      <span>•</span>
                      <span>{lang.speakers} speakers</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {onboardingLanguage === lang.code && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-violet-500"></div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          variants={itemVariants}
        >
          <Button
            variant="gradient"
            className="w-64 py-3 text-white font-bold rounded-full shadow-lg hover:shadow-primary-500/20 relative overflow-hidden group"
            onClick={handleContinue}
            disabled={!onboardingLanguage}
          >
            <span className="relative z-10">{getContinueButtonText()}</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary-600 to-violet-600"
            />
          </Button>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mt-4"
        >
          <ProgressDots total={total} current={current} color="novus" />
          <span className="text-xs text-gray-500 mt-3">{getStepText()}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
