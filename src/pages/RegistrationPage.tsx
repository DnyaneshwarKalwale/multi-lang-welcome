import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, User, UserPlus } from "lucide-react";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { firstName, setFirstName, lastName, setLastName, nextStep, prevStep, getStepProgress } = useOnboarding();

  const { current, total } = getStepProgress();

  const handleContinue = () => {
    // Save data to localStorage to ensure persistence
    localStorage.setItem('user_firstName', firstName);
    localStorage.setItem('user_lastName', lastName);
    
    nextStep();
    navigate("/onboarding/extension-install");
  };
  
  const handleSkipToDashboard = () => {
    // Mark onboarding as completed in localStorage
    localStorage.setItem('onboardingCompleted', 'true');
    navigate("/dashboard");
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
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-violet-200 dark:bg-violet-900 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5 -z-10"></div>
      
      {/* Back button */}
      <BackButton 
        onClick={handlePrev} 
        absolute 
      />
      
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
          className="text-4xl font-bold mb-6 text-gradient"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Who would you like to create this account for?
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Let's personalize your experience with Novus
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-12 max-w-xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="group">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left flex items-center">
              <User className="w-4 h-4 mr-2 text-cyan-600 dark:text-cyan-400" />
              First Name
            </label>
            <Input 
              id="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="bg-white/70 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 h-12 pl-4 
                         focus:border-cyan-500 dark:focus:border-cyan-500 focus:ring-cyan-500 dark:focus:ring-cyan-500 
                         transition-all text-gray-900 dark:text-white shadow-sm group-hover:shadow-md"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="group">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left flex items-center">
              <UserPlus className="w-4 h-4 mr-2 text-violet-600 dark:text-violet-400" />
              Last Name
            </label>
            <Input 
              id="lastName" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="bg-white/70 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 h-12 pl-4 
                         focus:border-cyan-500 dark:focus:border-cyan-500 focus:ring-cyan-500 dark:focus:ring-cyan-500 
                         transition-all text-gray-900 dark:text-white shadow-sm group-hover:shadow-md"
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={handleContinue} 
            disabled={!firstName.trim() || !lastName.trim()}
          >
            Continue
          </ContinueButton>
          
          <Button
            variant="outline"
            rounded="full"
            className="px-8 py-3 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 
                     hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-cyan-600 dark:hover:text-cyan-400 
                     transition-all duration-300"
            onClick={handleSkipToDashboard}
          >
            Skip to dashboard
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <ProgressDots total={total} current={current} color="gradient" />
        </motion.div>
      </motion.div>
    </div>
  );
}
