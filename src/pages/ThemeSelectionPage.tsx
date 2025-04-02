
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import BackButton from "@/components/BackButton";
import ContinueButton from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeSelectionPage = () => {
  const { theme, setTheme } = useTheme();
  const { nextStep, prevStep, getStepProgress } = useOnboarding();
  const { t } = useLanguage();
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">(theme as "light" | "dark");

  const handleThemeSelect = (themeValue: "light" | "dark") => {
    setSelectedTheme(themeValue);
    setTheme(themeValue);
  };

  const handleContinue = () => {
    nextStep();
  };

  const { current, total } = getStepProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose your interface theme</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the theme that you prefer for your workspace interface
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card
            className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 hover:shadow-lg ${
              selectedTheme === "light"
                ? "border-brand-purple/70 shadow-brand-purple/20"
                : "border-transparent"
            }`}
            onClick={() => handleThemeSelect("light")}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Light Theme</h3>
                {selectedTheme === "light" && (
                  <div className="bg-brand-purple text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-6">
                A clean, bright theme that's perfect for daytime use and provides high contrast for better readability.
              </p>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="h-2 w-24 bg-gray-200 rounded mb-3"></div>
                <div className="flex gap-2 items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-brand-purple/20"></div>
                  <div className="h-2 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="h-16 bg-gray-100 rounded mb-3"></div>
                <div className="flex justify-end">
                  <div className="h-6 w-20 bg-brand-purple rounded"></div>
                </div>
              </div>
            </div>
          </Card>

          <Card
            className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 hover:shadow-lg ${
              selectedTheme === "dark"
                ? "border-brand-purple/70 shadow-brand-purple/20"
                : "border-transparent"
            }`}
            onClick={() => handleThemeSelect("dark")}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Dark Theme</h3>
                {selectedTheme === "dark" && (
                  <div className="bg-brand-purple text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                A sleek, dark interface that reduces eye strain in low-light environments and saves battery life.
              </p>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-sm">
                <div className="h-2 w-24 bg-gray-700 rounded mb-3"></div>
                <div className="flex gap-2 items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-brand-purple/30"></div>
                  <div className="h-2 w-20 bg-gray-700 rounded"></div>
                </div>
                <div className="h-16 bg-gray-800 rounded mb-3"></div>
                <div className="flex justify-end">
                  <div className="h-6 w-20 bg-brand-purple rounded"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <BackButton onClick={prevStep} />
          <ProgressDots current={current} total={total} color="purple" className="my-6 md:my-0" />
          <ContinueButton onClick={handleContinue} />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectionPage;
