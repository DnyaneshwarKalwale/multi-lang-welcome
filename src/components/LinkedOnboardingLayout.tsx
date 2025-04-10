
import React from "react";
import { motion } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-950 dark:to-indigo-950">
      {/* Progress indicator */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center justify-center space-x-1">
          {linkedSteps.map((step, index) => (
            <React.Fragment key={step.step}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center ${
                  index <= currentIndex
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentIndex === index
                      ? 'bg-indigo-600 dark:bg-indigo-400 ring-4 ring-indigo-200 dark:ring-indigo-900/40'
                      : index < currentIndex
                      ? 'bg-indigo-600 dark:bg-indigo-400'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
                {index < linkedSteps.length - 1 && (
                  <div
                    className={`w-6 h-0.5 ${
                      index < currentIndex
                        ? 'bg-indigo-600 dark:bg-indigo-400'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                )}
              </motion.div>
            </React.Fragment>
          ))}
        </div>
        <motion.span 
          className="mt-2 text-xs text-gray-600 dark:text-gray-400 flex justify-center"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Step {currentIndex + 1} of {linkedSteps.length}
        </motion.span>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-16 flex-1">
        <Outlet />
      </div>
      
      <footer className="py-4 px-6 text-center">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <div className="mb-2 sm:mb-0 text-xs">
            © {new Date().getFullYear()} WritePulse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
