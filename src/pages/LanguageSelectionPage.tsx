import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";

export default function LanguageSelectionPage() {
  const navigate = useNavigate();
  const { nextStep, prevStep, language, setLanguage, getStepProgress } = useOnboarding();
  const { setLanguage: setGlobalLanguage, t } = useLanguage();
  const { current, total } = getStepProgress();

  // Map language codes to onboarding language types
  const languageMap: Record<string, string> = {
    "en": "english",
    "de": "german",
    "es": "spanish",
    "fr": "french",
    "it": "italian",
    "pt": "portuguese",
    "ru": "russian",
  };

  // Reverse mapping for displaying the selected language
  const reverseLanguageMap: Record<string, string> = {
    "english": "en",
    "german": "de",
    "spanish": "es",
    "french": "fr",
    "italian": "it",
    "portuguese": "pt",
    "russian": "ru",
  };

  const languages = [
    { value: "en", name: "English", flag: "🇺🇸" },
    { value: "de", name: "Deutsch", flag: "🇩🇪" },
    { value: "es", name: "Español", flag: "🇪🇸" },
    { value: "fr", name: "Français", flag: "🇫🇷" },
    { value: "it", name: "Italiano", flag: "🇮🇹" },
    { value: "pt", name: "Português", flag: "🇵🇹" },
    { value: "ru", name: "Русский", flag: "🇷🇺" },
  ];
  
  const handleLanguageSelect = (langCode: string) => {
    // Map the language code to the appropriate onboarding value
    const onboardingLang = languageMap[langCode] || "english";
    
    // Set both onboarding and global language
    setLanguage(onboardingLang);
    
    // Convert to the format expected by the LanguageContext
    setGlobalLanguage(onboardingLang);
    
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white">
      {/* Back button */}
      <button
        className="absolute top-10 left-10 flex items-center text-gray-400 hover:text-white transition-colors"
        onClick={handlePrev}
      >
        <ArrowLeft size={16} className="mr-2" />
        {t('back')}
      </button>
      
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          {t('chooseLanguage')}
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          {t('languageDescription')}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {languages.map((lang) => {
            // Get the mapped onboarding language for checking selection
            const onboardingLang = languageMap[lang.value] || "english";
            const isSelected = language === onboardingLang;
            
            return (
              <div
                key={lang.value}
                className={`relative bg-gray-900/50 border-2 
                  ${isSelected ? "border-indigo-500" : "border-gray-800"}
                  rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all duration-300`}
                onClick={() => handleLanguageSelect(lang.value)}
              >
                <span className="text-3xl mb-2">{lang.flag}</span>
                <span className={`font-medium ${isSelected ? "text-white" : "text-gray-300"}`}>
                  {lang.name}
                </span>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-indigo-600 w-5 h-5 flex items-center justify-center rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mb-12">
          <ContinueButton 
            onClick={handleContinue}
            disabled={!language}
          />
        </div>
        
        <div>
          <ProgressDots total={total} current={current} />
        </div>
      </div>
    </div>
  );
}
