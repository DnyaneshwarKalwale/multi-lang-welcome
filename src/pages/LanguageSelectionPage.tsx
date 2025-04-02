import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function LanguageSelectionPage() {
  const { language, setLanguage, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { t } = useLanguage();
  const { current, total } = getStepProgress();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">{t('chooseLanguage')}</h1>
        <p className="text-lg text-gray-400 mb-10">
          {t('languageDescription')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div 
            className={`bg-gray-900 border-2 ${language === "english" ? "border-purple-600" : "border-gray-800"} rounded-xl p-8 cursor-pointer hover:border-purple-600/60 transition-all`}
            onClick={() => setLanguage("english")}
          >
            <div className="flex items-start">
              <div className="w-10 h-10 flex-shrink-0 rounded mr-4 overflow-hidden">
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
                <h3 className="text-xl font-semibold mb-2">{t('english')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('englishDescription')}
                </p>
              </div>
              {language === "english" && (
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div 
            className={`bg-gray-900 border-2 ${language === "german" ? "border-purple-600" : "border-gray-800"} rounded-xl p-8 cursor-pointer hover:border-purple-600/60 transition-all`}
            onClick={() => setLanguage("german")}
          >
            <div className="flex items-start">
              <div className="w-10 h-10 flex-shrink-0 rounded mr-4 overflow-hidden">
                <div className="w-full h-full flex flex-col">
                  <div className="flex-1 bg-black"></div>
                  <div className="flex-1 bg-red-600"></div>
                  <div className="flex-1 bg-yellow-400"></div>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">{t('german')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('germanDescription')}
                </p>
              </div>
              {language === "german" && (
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mb-12">
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="border-gray-700 text-gray-400"
          >
            {t('back')}
          </Button>
          <ContinueButton 
            onClick={nextStep}
            disabled={!language} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            {t('continue')}
          </ContinueButton>
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
}
