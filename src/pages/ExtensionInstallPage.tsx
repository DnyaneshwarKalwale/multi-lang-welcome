import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Twitter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExtensionInstallPage() {
  const navigate = useNavigate();
  const { prevStep, nextStep, getStepProgress } = useOnboarding();

  const { current, total } = getStepProgress();
  
  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/completion");
  };

  const handlePrev = () => {
    prevStep();
    navigate("/onboarding/post-frequency");
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const benefits = [
    "One-click Twitter authentication",
    "Content analysis for better suggestions",
    "Post directly to Twitter from Scripe",
    "Automate your content calendar",
    "Access analytics and insights"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
      </div>
      
      {/* Back button */}
      <motion.button
        className="absolute top-10 left-10 flex items-center text-gray-400 hover:text-white transition-colors"
        onClick={handlePrev}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </motion.button>
      
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
          className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Supercharge Your Experience
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Install the Scripe Twitter extension to connect your account and automate content creation
        </motion.p>

        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 max-w-xl mx-auto mb-12 shadow-xl shadow-indigo-900/10"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0 relative">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 5 }}
              >
                <div className="w-40 h-40 relative rounded-xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-80"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Twitter className="w-20 h-20 text-white" />
                    <motion.div 
                      className="absolute top-0 right-0 m-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5, duration: 0.3, type: "spring" }}
                    >
                      <Check size={12} className="text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Orbit animation */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{ delay: 2, duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute w-2 h-2 rounded-full bg-indigo-400" style={{ top: '10%', left: '90%' }}></div>
              </motion.div>
            </div>
            
            <div className="text-left">
              <h3 className="text-xl font-medium mb-3 flex items-center">
                <Twitter className="w-5 h-5 text-indigo-400 mr-2" />
                Scripe Twitter Extension
              </h3>
              <p className="text-gray-400 mb-6">
                Connect your Twitter account to analyze your content and create personalized posts seamlessly.
              </p>
              
              <motion.div 
                className="space-y-2 mb-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center" 
                    variants={listItemVariants}
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/20 flex items-center justify-center mr-2">
                      <Check size={10} className="text-indigo-400" />
                    </div>
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              <Button 
                variant="gradient" 
                className="group w-full md:w-auto rounded-full font-medium shadow-lg shadow-indigo-600/10 gap-2"
                onClick={() => window.open("https://chrome.google.com/webstore/detail/scripe-twitter-extension/", "_blank")}
              >
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Add to Chrome</span>
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05, opacity: 0.15 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row justify-center gap-4 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={handleContinue}
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25"
          >
            <span>Continue without installing</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <ProgressDots total={total} current={current} />
        </motion.div>
      </motion.div>
    </div>
  );
} 