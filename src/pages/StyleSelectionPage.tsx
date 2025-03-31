import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import OnboardingStep from "@/components/OnboardingStep";

export default function StyleSelectionPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { strings } = useLanguage();
  const { workspaceType, setCurrentStep } = useOnboarding();

  const handleContinue = () => {
    setCurrentStep("language-selection");
    navigate("/onboarding/language-selection");
  };

  const handleBack = () => {
    navigate("/onboarding/plan-selection");
  };

  return (
    <OnboardingStep
      title={strings.chooseStyle}
      subtitle={strings.styleDescription}
      current={3}
      total={8}
      onBack={handleBack}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        <div
          onClick={() => setTheme("light")}
          className={`bg-white border-2 ${
            theme === "light" ? "border-blue-500" : "border-gray-200"
          } rounded-xl p-6 cursor-pointer transition-all shadow-sm text-black`}
        >
          <div className="mb-4 bg-gray-100 w-12 h-12 flex items-center justify-center rounded-lg">
            <Sun size={24} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">{strings.light}</h3>
          <p className="text-gray-600 mb-4">Clear and bright interface, perfect for daytime use.</p>
          
          {theme === "light" && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>Selected</span>
            </div>
          )}
        </div>

        <div
          onClick={() => setTheme("dark")}
          className={`bg-gray-900 border-2 ${
            theme === "dark" ? "border-blue-500" : "border-gray-800"
          } rounded-xl p-6 cursor-pointer transition-all shadow-sm`}
        >
          <div className="mb-4 bg-gray-800 w-12 h-12 flex items-center justify-center rounded-lg">
            <Moon size={24} className="text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">{strings.dark}</h3>
          <p className="text-gray-400 mb-4">Dark mode for reduced eye strain and better focus.</p>
          
          {theme === "dark" && (
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>Selected</span>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleContinue}
        className="mt-8 bg-primary hover:bg-primary/90 text-white px-8 py-2"
      >
        {strings.continue}
      </Button>
    </OnboardingStep>
  );
} 