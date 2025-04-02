import React, { useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";

export default function ThemeSelectionPage() {
  const { theme, setTheme, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { setTheme: setGlobalTheme } = useTheme();
  const { t } = useLanguage();
  const { current, total } = getStepProgress();

  // Apply theme change immediately and globally
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setGlobalTheme(newTheme);
    
    // Apply directly to document to ensure immediate change
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Ensure theme is applied when component loads
  useEffect(() => {
    if (theme) {
      handleThemeChange(theme);
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">{t('chooseStyle')}</h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-10`}>
          {t('styleDescription')}
        </p>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} rounded-xl overflow-hidden mb-12`}>
          <div 
            className={`${theme === "light" ? "ring-2 ring-purple-600" : ""} cursor-pointer ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-6 flex flex-col items-center justify-center`}
            onClick={() => handleThemeChange("light")}
          >
            <div className="mb-6 w-full rounded-lg overflow-hidden shadow-lg relative">
              <div className="bg-white p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-gray-100 h-6 w-full mb-4 rounded flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-gray-100 rounded mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-gray-100 rounded mb-2"></div>
                    <div className="h-full bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-purple-100 text-purple-600 p-1 rounded-full">
                  <SunIcon size={16} />
                </div>
              </div>
              <div className={`absolute inset-0 ${theme === "light" ? "bg-transparent" : "bg-black/30"}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${theme === "light" ? "border-purple-600 bg-purple-600" : "border-gray-500"}`}>
                {theme === "light" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <span className={`text-lg ${theme === "light" ? (theme === 'dark' ? "text-white" : "text-black") : (theme === 'dark' ? "text-gray-400" : "text-gray-600")}`}>{t('light')}</span>
            </div>
          </div>
          
          <div 
            className={`${theme === "dark" ? "ring-2 ring-purple-600" : ""} cursor-pointer ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-6 flex flex-col items-center justify-center`}
            onClick={() => handleThemeChange("dark")}
          >
            <div className="mb-6 w-full rounded-lg overflow-hidden shadow-lg relative">
              <div className="bg-gray-800 p-4 rounded-lg w-full aspect-video flex flex-col">
                <div className="bg-gray-700 h-6 w-full mb-4 rounded flex items-center px-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-gray-700 rounded mr-2"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-full bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-purple-900/50 text-purple-400 p-1 rounded-full">
                  <MoonIcon size={16} />
                </div>
              </div>
              <div className={`absolute inset-0 ${theme === "dark" ? "bg-transparent" : "bg-black/30"}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${theme === "dark" ? "border-purple-600 bg-purple-600" : "border-gray-500"}`}>
                {theme === "dark" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <span className={`text-lg ${theme === "dark" ? (theme === 'dark' ? "text-white" : "text-black") : (theme === 'dark' ? "text-gray-400" : "text-gray-600")}`}>{t('dark')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mb-12">
          <Button 
            variant="outline" 
            onClick={prevStep}
            className={`${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-600'}`}
          >
            {t('back')}
          </Button>
          <ContinueButton 
            onClick={nextStep}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {t('continue')}
          </ContinueButton>
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
}
