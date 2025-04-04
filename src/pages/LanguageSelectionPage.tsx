import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Twitter, Globe, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SekcionIconRounded } from "@/components/ScripeIcon";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelectionPage() {
  const navigate = useNavigate();
  const { language: onboardingLanguage, setLanguage: setOnboardingLanguage, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { setLanguage: setAppLanguage } = useLanguage();
  const { current, total } = getStepProgress();

  const languageOptions = [
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-50 dark:bg-blue-950/30 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-50 dark:bg-purple-950/30 blur-3xl opacity-70"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-teal-50 dark:bg-teal-950/30 blur-3xl opacity-50 animate-pulse"></div>
      </div>

      <motion.button
        className="absolute top-8 left-8 p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
        onClick={handleBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </motion.button>

      <div className="container mx-auto max-w-4xl px-4 py-8 z-10 relative">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex flex-col items-center mb-10"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <div className="relative mb-4">
              <SekcionIconRounded className="w-20 h-20 text-teal-500" />
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Globe className="w-6 h-6 text-teal-500" />
              </motion.div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
              {getPageTitle()}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-2">
              {getPageDescription()}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {languageOptions.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative overflow-hidden rounded-xl shadow-lg 
                  cursor-pointer bg-white dark:bg-gray-800
                  ${onboardingLanguage === lang.code 
                    ? 'ring-2 ring-teal-500 dark:ring-teal-400' 
                    : 'hover:shadow-xl'}
                  transition-all duration-300
                `}
                onClick={() => setOnboardingLanguage(lang.code)}
              >
                {onboardingLanguage === lang.code && (
                  <div className="absolute top-3 right-3 bg-teal-500 text-white p-1 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                <div className="p-6 flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl shadow-inner">
                    {lang.flag}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">
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
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              className="px-8 py-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all"
              disabled={!onboardingLanguage}
              onClick={handleContinue}
              size="lg"
            >
              {getContinueButtonText()}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <ProgressDots total={total} current={current} color="novus" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {getStepText()}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
