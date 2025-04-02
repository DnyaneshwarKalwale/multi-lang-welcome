import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { firstName, setFirstName, lastName, setLastName, nextStep, prevStep, getStepProgress } = useOnboarding();

  const { current, total } = getStepProgress();

  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/extension-install");
  };

  const handlePrev = () => {
    prevStep();
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
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
        className="max-w-2xl w-full text-center"
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
          Who would you like to create this account for?
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Let's personalize your experience with Scripe
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div variants={itemVariants}>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              First Name
            </label>
            <Input 
              id="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="bg-gray-900/50 border-gray-800 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              Last Name
            </label>
            <Input 
              id="lastName" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="bg-gray-900/50 border-gray-800 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={handleContinue} 
            disabled={!firstName.trim() || !lastName.trim()}
            variant="gradient"
            animation="pulse"
            rounded="full"
            className="group px-8 py-3 flex items-center gap-2 transition-all duration-300"
          >
            <span>Continue</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
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
