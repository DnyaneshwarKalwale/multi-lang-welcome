
import React from "react";
import { motion } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { LinkedPulseLogotype } from "@/components/LinkedPulseIcon";
import { Outlet, useLocation } from "react-router-dom";

interface ProgressStep {
  step: string;
  label: string;
}

const linkedSteps: ProgressStep[] = [
  { step: "welcome", label: "Welcome" },
  { step: "user-info", label: "Profile" },
  { step: "inspiration", label: "Inspiration" },
  { step: "writing-style", label: "Style" },
  { step: "post-frequency", label: "Schedule" },
  { step: "extension", label: "Extension" },
  { step: "connect-account", label: "Connect" },
  { step: "completion", label: "Complete" }
];

export function LinkedOnboardingLayout() {
  const { currentStep } = useOnboarding();
  const location = useLocation();
  
  const getCurrentStepIndex = () => {
    // Special case for getting the correct index from the pathname
    const path = location.pathname.split('/').pop() || '';
    
    // Try to find direct match first
    const directIndex = linkedSteps.findIndex(step => step.step === path);
    if (directIndex !== -1) return directIndex;
    
    // If no direct match, use the context's currentStep
    return linkedSteps.findIndex(step => step.step === currentStep);
  };
  
  const currentIndex = getCurrentStepIndex();
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 py-4 px-6 bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <LinkedPulseLogotype className="h-8" />
          
          <div className="hidden md:flex items-center space-x-1">
            {linkedSteps.map((step, index) => (
              <React.Fragment key={step.step}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center ${
                    index <= currentIndex
                      ? 'text-linkedin-blue'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentIndex === index
                        ? 'bg-linkedin-blue ring-4 ring-linkedin-blue/20'
                        : index < currentIndex
                        ? 'bg-linkedin-blue'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                  {index < linkedSteps.length - 1 && (
                    <div
                      className={`w-6 h-0.5 ${
                        index < currentIndex
                          ? 'bg-linkedin-blue'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </motion.div>
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex md:hidden items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentIndex + 1} of {linkedSteps.length}
            </span>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 sm:px-6 py-6 flex-1">
        <Outlet />
      </div>
      
      <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="mb-2 sm:mb-0">
            © {new Date().getFullYear()} LinkedPulse. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="hover:text-linkedin-blue transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-linkedin-blue transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-linkedin-blue transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
