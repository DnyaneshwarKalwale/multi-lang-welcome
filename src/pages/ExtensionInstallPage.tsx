import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function ExtensionInstallPage() {
  const navigate = useNavigate();
  const { nextStep } = useOnboarding();

  const handleSkip = () => {
    nextStep();
    navigate("/onboarding/completion");
  };

  const handleInstall = () => {
    // Chrome extension installation logic here
    window.open("https://chrome.google.com/webstore/detail/scripe-extension/your-extension-id", "_blank");
    nextStep();
    navigate("/onboarding/completion");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/scripe-logo.png" alt="Scripe Logo" className="mx-auto w-16 h-16" />
          <h2 className="mt-6 text-3xl font-bold">Install the extension</h2>
          <p className="mt-2 text-gray-400">
            Supercharge your Scripe experience with our Chrome extension
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold">Analytics & Performance Insights</h3>
            <p className="text-sm text-gray-400">
              Track your LinkedIn post performance and get data-driven insights
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold">Personalized Content Creation</h3>
            <p className="text-sm text-gray-400">
              Scripe learns from your past posts to create content that matches your unique voice and style
            </p>
          </div>

          <p className="text-sm text-center text-gray-500">
            We use industry-leading encryption to keep your data secure
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleInstall}
            className="w-full"
            variant="default"
          >
            Add to Chrome
          </Button>
          
          <button
            onClick={handleSkip}
            className="w-full text-sm text-gray-500 hover:text-gray-400"
          >
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
} 