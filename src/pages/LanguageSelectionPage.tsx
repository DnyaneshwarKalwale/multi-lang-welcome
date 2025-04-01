import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { ArrowLeft, ChevronRight, Globe } from "lucide-react";

export default function LanguageSelectionPage() {
  const navigate = useNavigate();
  const { nextStep, prevStep, language, setLanguage, getStepProgress } = useOnboarding();
  const { changeLanguage } = useLanguage();
  const { current, total } = getStepProgress();

  const languages = [
    { value: "en", name: "English", flag: "🇺🇸" },
    { value: "es", name: "Español", flag: "🇪🇸" },
    { value: "fr", name: "Français", flag: "🇫🇷" },
    { value: "de", name: "Deutsch", flag: "🇩🇪" },
    { value: "it", name: "Italiano", flag: "🇮🇹" },
    { value: "pt", name: "Português", flag: "🇵🇹" },
    { value: "ru", name: "Русский", flag: "🇷🇺" },
    { value: "zh", name: "中文", flag: "🇨🇳" },
    { value: "ja", name: "日本語", flag: "🇯🇵" },
    { value: "ko", name: "한국어", flag: "🇰🇷" },
    { value: "ar", name: "العربية", flag: "🇸🇦" },
    { value: "hi", name: "हिन्दी", flag: "🇮🇳" },
  ];
  
  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    changeLanguage(lang);
  };

  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/team-selection");
  };

  const handlePrev = () => {
    prevStep();
    navigate("/onboarding/welcome");
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
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
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
        Back
      </motion.button>
      
      <motion.div 
        className="max-w-4xl w-full text-center"
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
          <Globe className="w-7 h-7 text-indigo-400" />
          <h1 className="text-4xl font-bold">Choose your language</h1>
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Select your preferred language for Twitter content generation and platform navigation
        </motion.p>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {languages.map((lang) => (
            <motion.div
              key={lang.value}
              className={`bg-gray-900/50 backdrop-blur-sm border-2 ${
                language === lang.value ? "border-indigo-500" : "border-gray-800"
              } rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/60 transition-all duration-300 hover-lift`}
              onClick={() => handleLanguageSelect(lang.value)}
              variants={itemVariants}
            >
              <span className="text-3xl mb-2">{lang.flag}</span>
              <span className={`font-medium ${language === lang.value ? "text-white" : "text-gray-300"}`}>
                {lang.name}
              </span>
              {language === lang.value && (
                <motion.div 
                  className="mt-2 w-2 h-2 rounded-full bg-indigo-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          ))}
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
            className={`group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 ${
              !language ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>Continue</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </ContinueButton>
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
          className="mt-12 text-center max-w-2xl mx-auto p-4 border border-indigo-800/30 rounded-lg bg-indigo-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-indigo-300 text-sm">
            Scripe can generate and optimize Twitter content in multiple languages to help you reach a global audience. 
            Your selected language will determine the default language for content creation.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
