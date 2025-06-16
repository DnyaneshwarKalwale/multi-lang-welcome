import React from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { BrandOutIcon, BrandOutLogotype } from "@/components/BrandOutIcon";
import { Check, Chrome, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExtensionInstallPage() {
  const navigate = useNavigate();
  const { nextStep } = useOnboarding();
  
  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/completion");
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
      {/* Background with simple blue gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary/5"></div>
      </div>
      
      <div className="max-w-xl w-full mb-8">
        <div className="mb-10 flex justify-center">
          <BrandOutLogotype className="h-12 w-auto" />
          </div>
        
        <h1 className="text-3xl font-bold text-center mb-3 text-gray-900">
          Install the Browser Extension
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          Our browser extension helps you create and manage your content.
        </p>

        <motion.div 
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 blur-md"></div>
                <div className="w-36 h-36 relative rounded-xl bg-white shadow-lg flex items-center justify-center">
                  <BrandOutIcon className="h-16 w-16 text-primary" />
                </div>
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
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700">
                    One-click authentication
                  </span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700">
                    Content analysis for better suggestions
                  </span>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-700">
                    Post directly from BrandOut
                  </span>
                </motion.div>
              </motion.div>
              
              <Button 
                variant="default" 
                rounded="full"
                className="w-full md:w-auto py-3 px-6 shadow-lg flex items-center gap-2 bg-primary hover:bg-primary/90"
                onClick={() => window.open("https://chrome.google.com/webstore/detail/brandout-extension/", "_blank")}
              >
                <Chrome size={18} />
                <span>Add to Chrome</span>
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleContinue}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base rounded-full shadow-md w-full max-w-md flex items-center justify-center gap-2"
          >
            Continue without installing
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 