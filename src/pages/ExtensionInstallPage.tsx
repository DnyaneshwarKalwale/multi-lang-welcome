import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function ExtensionInstallPage() {
  const navigate = useNavigate();
  const { nextStep } = useOnboarding();
  const [showPopup, setShowPopup] = useState(false);

  const handleSkip = () => {
    // Show popup when user tries to skip
    setShowPopup(true);
  };

  const handleInstall = () => {
    // Chrome extension installation logic here
    window.open("https://chrome.google.com/webstore/detail/scripe-extension/your-extension-id", "_blank");
    nextStep();
    navigate("/onboarding/completion");
  };

  const handleWantExtension = () => {
    setShowPopup(false);
    // Keep user on the same page so they can install the extension
  };

  const handleTryWithout = () => {
    setShowPopup(false);
    // Continue without the extension
    nextStep();
    navigate("/onboarding/completion");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="max-w-md w-full mx-auto space-y-8 px-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-400 rounded-xl flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12C8 9.79086 9.79086 8 12 8H15V36H12C9.79086 36 8 34.2091 8 32V12Z" fill="white"/>
              <path d="M17 8H20C22.2091 8 24 9.79086 24 12V16C24 18.2091 22.2091 20 20 20H17V8Z" fill="white"/>
              <path d="M17 22H20C22.2091 22 24 23.7909 24 26V32C24 34.2091 22.2091 36 20 36H17V22Z" fill="white"/>
              <path d="M26 16C26 13.7909 27.7909 12 30 12H33C35.2091 12 37 13.7909 37 16V28C37 30.2091 35.2091 32 33 32H30C27.7909 32 26 30.2091 26 28V16Z" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Install the extension</h2>
          <p className="text-gray-400">
            Supercharge your Scripe experience with our Chrome extension
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="mt-1 flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Analytics & Performance Insights</h3>
              <p className="text-sm text-gray-400">
                Track your LinkedIn post performance and get data-driven insights to improve your content
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="mt-1 flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Personalized Content Creation</h3>
              <p className="text-sm text-gray-400">
                Scripe learns from your past posts to create content that matches your unique voice and style
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-center text-gray-500">
          We use industry-leading encryption to keep your data secure
        </p>

        <div className="flex flex-col items-center mt-8">
          <Button
            onClick={handleInstall}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
          >
            Add to Chrome
          </Button>
          
          <button
            onClick={handleSkip}
            className="mt-4 text-sm text-gray-500 hover:text-gray-400"
          >
            I'll do this later
          </button>
        </div>
      </div>

      {/* Popup Modal - Only shown when user clicks skip */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-4">
                <div className="bg-amber-600/20 rounded-full p-2">
                  <svg className="h-6 w-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zM11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Scripe is 10x better with the extension</h3>
                <p className="text-gray-400 text-sm mb-4">
                  You can skip this step, but be aware that Scripe will not have access to your posts and you will get worse results.
                </p>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleWantExtension}
                    className="py-2 px-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 text-sm"
                  >
                    I want that extension
                  </button>
                  <button
                    onClick={handleTryWithout}
                    className="py-2 px-4 rounded-full bg-amber-500 text-gray-900 hover:bg-amber-400 text-sm font-medium"
                  >
                    Let me try without it
                  </button>
                </div>
              </div>
              <button 
                onClick={handleWantExtension} 
                className="text-gray-500 hover:text-gray-400 ml-4"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 