import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExtensionInstallPage() {
  const navigate = useNavigate();
  const { prevStep, nextStep, getStepProgress } = useOnboarding();

  const { current, total } = getStepProgress();
  
  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/completion");
  };
  
  const handleSkipToDashboard = () => {
    // Mark onboarding as completed in localStorage
    localStorage.setItem('onboardingCompleted', 'true');
    navigate("/dashboard");
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
      </div>
      
      {/* Back button */}
      <BackButton 
        onClick={prevStep} 
        absolute 
      />
      
      <motion.div 
        className="max-w-3xl w-full text-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScripeIconRounded className="w-20 h-20" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Install the Scripe Twitter Extension
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Our browser extension helps you connect your Twitter account and automate content creation.
        </motion.p>

        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 max-w-xl mx-auto mb-12"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
              <img 
                src="/images/twitter-extension.png" 
                alt="Scripe Twitter Extension" 
                className="w-36 h-36 rounded-lg object-cover shadow-lg"
                onError={(e) => {
                  // Fallback in case the image doesn't exist
                  e.currentTarget.src = "https://placehold.co/144x144/6366F1/ffffff?text=Scripe+Twitter";
                }}
              />
            </div>
            
            <div className="text-left">
              <h3 className="text-xl font-medium mb-2">Scripe Twitter Extension</h3>
              <p className="text-gray-400 mb-6">
                Connect your Twitter account to analyze your content and create personalized posts seamlessly.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">One-click Twitter authentication</span>
                </div>
                <div className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Content analysis for better suggestions</span>
                </div>
                <div className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Post directly to Twitter from Scripe</span>
                </div>
              </div>
              
              <Button 
                variant="gradient" 
                rounded="full"
                className="w-full md:w-auto py-3 px-6 shadow-lg"
                onClick={() => window.open("https://chrome.google.com/webstore/detail/scripe-twitter-extension/", "_blank")}
              >
                Add to Chrome
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="flex flex-col items-center mb-12 max-w-md mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton onClick={handleContinue}>
            Continue without installing
          </ContinueButton>
          
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full px-8 py-3 mt-4 transition-all duration-300 text-sm"
            onClick={handleSkipToDashboard}
          >
            Skip to dashboard
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <ProgressDots total={total} current={current} color="indigo" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
} 