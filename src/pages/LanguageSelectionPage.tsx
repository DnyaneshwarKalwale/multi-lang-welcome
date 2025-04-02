import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
      {/* Back button */}
      <button
        className="absolute top-10 left-10 flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        onClick={handlePrev}
      >
        <ArrowLeft size={16} className="mr-2" />
        {t('back')}
      </button>
      
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          {t('chooseLanguage')}
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          {t('languageDescription')}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {languages.map((lang) => {
            // Get the mapped onboarding language for checking selection
            const onboardingLang = languageMap[lang.value] || "english";
            return (
              <div
                key={lang.value}
                className={`relative bg-white shadow-sm border-2 
                  ${language === onboardingLang ? "border-indigo-500" : "border-gray-200"}
                  rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all duration-300`}
                onClick={() => handleLanguageSelect(lang.value)}
              >
                <span className="text-3xl mb-2">{lang.flag}</span>
                <span className={`font-medium ${language === onboardingLang ? "text-indigo-600" : "text-gray-800"}`}>
                  {lang.name}
                </span>
                {language === onboardingLang && (
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
