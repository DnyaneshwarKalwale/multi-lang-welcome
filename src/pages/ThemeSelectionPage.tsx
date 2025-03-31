
import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ScripeLogotype } from "@/components/ScripeIcon";

export default function ThemeSelectionPage() {
  const { theme, setTheme, nextStep } = useOnboarding();
  const { setTheme: setGlobalTheme } = useTheme();

  const handleThemeChange = (selectedTheme: "light" | "dark") => {
    setTheme(selectedTheme);
    setGlobalTheme(selectedTheme);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Choose your style</h1>
        <p className="text-lg text-gray-400 mb-12">You can change the UI style at any time in the settings.</p>
        
        <div className="grid grid-cols-2 gap-4 bg-gray-900 rounded-xl p-6 mb-12">
          <div 
            className={`bg-gray-800 border-2 ${theme === "light" ? "border-primary" : "border-transparent"} rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-primary/60 transition-all`}
            onClick={() => handleThemeChange("light")}
          >
            <div className="bg-white rounded-lg w-full h-24 mb-4 flex items-center justify-center">
              <ScripeLogotype className="text-black" />
            </div>
            <h3 className="text-lg font-semibold">Light</h3>
          </div>
          
          <div 
            className={`bg-gray-800 border-2 ${theme === "dark" ? "border-primary" : "border-transparent"} rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-primary/60 transition-all`}
            onClick={() => handleThemeChange("dark")}
          >
            <div className="bg-gray-900 rounded-lg w-full h-24 mb-4 flex items-center justify-center">
              <ScripeLogotype className="text-white" />
            </div>
            <h3 className="text-lg font-semibold">Dark</h3>
          </div>
        </div>
        
        <div className="flex justify-center mb-12">
          <ContinueButton onClick={nextStep} />
        </div>
        
        <ProgressDots total={8} current={2} />
      </div>
    </div>
  );
}
