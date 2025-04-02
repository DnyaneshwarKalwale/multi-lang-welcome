import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { Check, Chrome } from "lucide-react";
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-cyan-200 dark:bg-cyan-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-teal-200 dark:bg-teal-900 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5 -z-10"></div>
      
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
          className="text-4xl font-bold mb-6 text-gradient"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Install the Novus Browser Extension
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Our browser extension helps you connect your social accounts and automate content creation.
        </motion.p>

        <motion.div 
          className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-8 max-w-xl mx-auto mb-12 shadow-lg"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
              <img 
                src="/images/novus-extension.png" 
                alt="Novus Browser Extension" 
                className="w-36 h-36 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                onError={(e) => {
                  // Fallback in case the image doesn't exist
                  e.currentTarget.src = "https://placehold.co/144x144/06B6D4/ffffff?text=Novus";
                }}
              />
            </div>
            
            <div className="text-left">
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Novus Browser Extension</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your social accounts to analyze your content and create personalized posts seamlessly.
              </p>
              
              <motion.div 
                className="space-y-3 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">One-click social authentication</span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Content analysis for better suggestions</span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Post directly to social platforms from Novus</span>
                </motion.div>
              </motion.div>
              
              <Button 
                variant="novus" 
                rounded="full"
                className="w-full md:w-auto py-3 px-6 shadow-lg flex items-center gap-2"
                onClick={() => window.open("https://chrome.google.com/webstore/detail/novus-extension/", "_blank")}
              >
                <Chrome size={18} />
                <span>Add to Chrome</span>
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
            className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full px-8 py-3 mt-4 transition-all duration-300 text-sm"
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
          <ProgressDots total={total} current={current} color="novus" />
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
} 