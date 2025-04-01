import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { ArrowLeft, ChevronRight, Globe, Check } from "lucide-react";

export default function LanguageSelectionPage() {
  const navigate = useNavigate();
  const { nextStep, prevStep, language, setLanguage, getStepProgress } = useOnboarding();
  const { setLanguage: setGlobalLanguage, t } = useLanguage();
  const { current, total } = getStepProgress();

  // Map language codes to onboarding language types
  const languageMap: Record<string, string> = {
    "en": "english",
    "de": "german",
    "es": "english", // Default to English for unsupported languages
    "fr": "english",
    "it": "english",
    "pt": "english",
    "ru": "english",
    "zh": "english",
    "ja": "english",
    "ko": "english",
    "ar": "english",
    "hi": "english",
  };

  const languages = [
    { value: "en", name: "English", flag: "🇺🇸" },
    { value: "de", name: "Deutsch", flag: "🇩🇪" },
    { value: "es", name: "Español", flag: "🇪🇸" },
    { value: "fr", name: "Français", flag: "🇫🇷" },
    { value: "it", name: "Italiano", flag: "🇮🇹" },
    { value: "pt", name: "Português", flag: "🇵🇹" },
    { value: "ru", name: "Русский", flag: "🇷🇺" },
    { value: "zh", name: "中文", flag: "🇨🇳" },
    { value: "ja", name: "日本語", flag: "🇯🇵" },
    { value: "ko", name: "한국어", flag: "🇰🇷" },
    { value: "ar", name: "العربية", flag: "🇸🇦" },
    { value: "hi", name: "हिन्दी", flag: "🇮🇳" },
  ];
  
  const handleLanguageSelect = (langCode: string) => {
    // Map the language code to the appropriate onboarding value
    const onboardingLang = languageMap[langCode] || "english";
    
    // Set both onboarding and global language
    setLanguage(onboardingLang);
    
    // Convert to the format expected by the LanguageContext (only supports english and german)
    const globalLang = langCode === "de" ? "german" : "english";
    setGlobalLanguage(globalLang);
    
    // Store the selected language code in localStorage for future reference
    localStorage.setItem("languageCode", langCode);
  };

  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/post-format");
  };

  const handlePrev = () => {
    prevStep();
    navigate("/onboarding/theme-selection");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px] animate-pulse-slow animation-delay-2000"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 rounded-full bg-indigo-500"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.3,
              scale: Math.random() * 2 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.3, 0.8, 0.3],
              scale: [null, Math.random() + 0.5]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
      
      {/* Back button */}
      <motion.button
        className="absolute top-10 left-10 flex items-center text-gray-400 hover:text-white transition-colors"
        onClick={handlePrev}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowLeft size={16} className="mr-2" />
        {t('back')}
      </motion.button>
      
      <motion.div 
        className="max-w-4xl w-full text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScripeIconRounded className="w-20 h-20" />
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="p-2 rounded-full bg-gradient-to-br from-indigo-600/30 to-indigo-900/30 border border-indigo-500/40"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Globe className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{t('chooseLanguage')}</h1>
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {t('languageDescription')}
        </motion.p>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {languages.map((lang) => {
            // Get the mapped onboarding language for checking selection
            const onboardingLang = languageMap[lang.value] || "english";
            return (
              <motion.div
                key={lang.value}
                className={`relative bg-gray-900/50 backdrop-blur-sm border-2 overflow-hidden
                  ${language === onboardingLang ? "border-indigo-500" : "border-gray-800"}
                  rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/60 transition-all duration-300`}
                onClick={() => handleLanguageSelect(lang.value)}
                variants={itemVariants}
                whileHover={{ 
                  y: -5, 
                  boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.3)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {language === onboardingLang && (
                  <motion.div 
                    className="absolute inset-0 bg-indigo-600/10" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <span className="text-3xl mb-2">{lang.flag}</span>
                <span className={`font-medium ${language === onboardingLang ? "text-white" : "text-gray-300"}`}>
                  {lang.name}
                </span>
                {language === onboardingLang && (
                  <motion.div 
                    className="absolute top-2 right-2 bg-indigo-600/40 w-5 h-5 flex items-center justify-center rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 200 }}
                  >
                    <Check size={12} className="text-white" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ContinueButton 
            onClick={handleContinue}
            disabled={!language}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <ProgressDots total={total} current={current} />
        </motion.div>
        
        {/* Language info */}
        <motion.div
          className="mt-8 text-center max-w-2xl mx-auto p-5 border border-indigo-800/30 rounded-lg bg-indigo-900/10 backdrop-blur-sm shadow-lg shadow-indigo-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-indigo-300 text-sm">
            {t('languageDescription')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
