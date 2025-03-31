
import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function LanguageSelectionPage() {
  const { language, setLanguage, nextStep } = useOnboarding();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Choose the language of your content</h1>
        <p className="text-lg text-gray-400 mb-12">
          Scripe is in English but you can answer all questions in your chosen language at all times.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div 
            className={`bg-gray-900 border-2 ${language === "english" ? "border-primary" : "border-gray-800"} rounded-xl p-6 flex items-center cursor-pointer hover:border-primary/60 transition-all`}
            onClick={() => setLanguage("english")}
          >
            <div className="w-10 h-10 mr-4 rounded-full overflow-hidden">
              <img 
                src="https://flagcdn.com/us.svg" 
                alt="US flag" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold">English</h3>
              <p className="text-gray-400 text-sm">Recommended for most users to reach larger audience.</p>
            </div>
            <div className="ml-auto">
              {language === "english" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </div>
          
          <div 
            className={`bg-gray-900 border-2 ${language === "german" ? "border-primary" : "border-gray-800"} rounded-xl p-6 flex items-center cursor-pointer hover:border-primary/60 transition-all`}
            onClick={() => setLanguage("german")}
          >
            <div className="w-10 h-10 mr-4 rounded-full overflow-hidden">
              <img 
                src="https://flagcdn.com/de.svg" 
                alt="German flag" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold">German</h3>
              <p className="text-gray-400 text-sm">Recommended if your main audience is German.</p>
            </div>
            <div className="ml-auto">
              {language === "german" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mb-12">
          <ContinueButton onClick={nextStep} disabled={!language} />
        </div>
        
        <ProgressDots total={8} current={3} />
      </div>
    </div>
  );
}
