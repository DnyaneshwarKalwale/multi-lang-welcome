
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkedPulseLogotype } from '@/components/LinkedPulseIcon';

export default function LinkedCompletionPage() {
  const navigate = useNavigate();
  const { setCurrentStep } = useOnboarding();

  useEffect(() => {
    // Mark onboarding as complete
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Update the current step
    setCurrentStep("connect-linkedin");
  }, [setCurrentStep]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const completedSteps = [
    { title: "Profile Information", description: "Your personal details have been saved" },
    { title: "Content Preferences", description: "Your content preferences have been configured" },
    { title: "Posting Schedule", description: "Your posting schedule has been set" },
    { title: "LinkedIn Connection", description: "Your LinkedIn account has been connected" }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LinkedPulseLogotype className="mx-auto h-12 mb-6" />
        <h1 className="text-3xl font-bold mb-2">Setup Complete!</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          You're all set to start creating engaging LinkedIn content
        </p>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-6">Setup Summary</h2>

        <div className="space-y-4">
          {completedSteps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
            >
              <div className="bg-green-500 rounded-full p-1 mt-1 mr-4">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Button
          className="px-8 py-6 text-lg"
          onClick={handleContinue}
        >
          Go to Dashboard
          <ArrowRight className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
