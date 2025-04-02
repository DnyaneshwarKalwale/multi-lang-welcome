import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { Check, Chrome, Twitter } from "lucide-react";
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
      {/* Animated gradient background with Twitter blue */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-900 blur-[120px]"></div>
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
          <div className="relative">
            <ScripeIconRounded className="w-20 h-20" />
            <motion.div 
              className="absolute -bottom-2 -right-2 text-blue-500"
              animate={{ 
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Twitter size={24} />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Install the Twitter Extension
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Our Twitter extension helps you connect your account and automate content creation.
        </motion.p>

        <motion.div 
          className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-8 max-w-xl mx-auto mb-12 shadow-lg"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
              <img 
                src="/images/twitter-extension.png" 
                alt="Twitter Browser Extension" 
                className="w-36 h-36 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                onError={(e) => {
                  // Fallback in case the image doesn't exist
                  e.currentTarget.src = "https://placehold.co/144x144/1DA1F2/ffffff?text=Twitter";
                }}
              />
            </div>
            
            <div className="text-left">
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Twitter Browser Extension</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your Twitter account to analyze your content and create personalized tweets seamlessly.
              </p>
              
              <motion.div 
                className="space-y-3 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">One-click Twitter authentication</span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Tweet analysis for better suggestions</span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Post directly to Twitter from Scripe</span>
                </motion.div>
              </motion.div>
              
              <Button 
                variant="twitter" 
                rounded="full"
                className="w-full md:w-auto py-3 px-6 shadow-lg flex items-center gap-2"
                onClick={() => window.open("https://chrome.google.com/webstore/detail/twitter-extension/", "_blank")}
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
          <Button 
            variant="twitter"
            rounded="full"
            className="py-6 px-8 gap-2 w-full sm:w-auto font-medium"
            onClick={handleContinue}
          >
            Continue without installing
          </Button>
          
          <Button
            variant="ghost"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full px-8 py-3 mt-4 transition-all duration-300 text-sm"
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