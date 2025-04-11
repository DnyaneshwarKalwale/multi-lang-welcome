import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/useLanguage";
import { motion } from "framer-motion";
import { PrismIconRounded } from "@/components/ScripeIcon";
import { Check, Chrome, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExtensionInstallPage() {
  const navigate = useNavigate();
  const { prevStep, nextStep, getStepProgress } = useOnboarding();
  const { language } = useLanguage();
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

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.9, 1, 0.9],
      transition: { 
        duration: 2, 
        ease: "easeInOut", 
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white text-gray-900 relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 opacity-10 -z-10"
        variants={pulseVariants}
        animate="animate"
      >
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-violet-200 blur-[120px]"></div>
      </motion.div>
      
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
            <PrismIconRounded className="w-24 h-24" />
            <motion.div 
              className="absolute -bottom-2 -right-2 text-blue-500"
              animate={{ 
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Puzzle size={26} className="drop-shadow-md" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Install the Browser Extension
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Our browser extension helps you create and manage your content.
        </motion.p>

        <motion.div 
          className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl p-8 max-w-xl mx-auto mb-12 shadow-lg"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 blur-md"></div>
                <img 
                  src="/images/browser-extension.png" 
                  alt="Browser Extension" 
                  className="w-36 h-36 relative rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                  onError={(e) => {
                    // Fallback in case the image doesn't exist
                    e.currentTarget.src = "https://placehold.co/144x144/4F46E5/ffffff?text=Extension";
                  }}
                />
              </div>
            </div>
            
            <div className="text-left">
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                Browser Extension
              </h3>
              <p className="text-gray-600 mb-6">
                Connect your account to analyze and create content seamlessly.
              </p>
              
              <motion.div 
                className="space-y-3 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700">
                    One-click authentication
                  </span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700">
                    Content analysis for better suggestions
                  </span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700">
                    Post directly from Prism
                  </span>
                </motion.div>
              </motion.div>
              
              <Button 
                variant="default" 
                rounded="full"
                className="w-full md:w-auto py-3 px-6 shadow-lg flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                onClick={() => window.open("https://chrome.google.com/webstore/detail/prism-extension/", "_blank")}
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
            variant="default"
            rounded="full"
            className="py-6 px-8 gap-2 w-full sm:w-auto font-medium bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
            onClick={handleContinue}
          >
            Continue without installing
          </Button>
          
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full px-8 py-3 mt-4 transition-all duration-300 text-sm"
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
          <span className="text-sm text-gray-500 mt-3">
            Step {current + 1} of {total}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
} 