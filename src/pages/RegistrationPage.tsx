
import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, User, UserPlus, Twitter, AtSign } from "lucide-react";
import { SekcionIconRounded } from "@/components/ScripeIcon";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { firstName, setFirstName, lastName, setLastName, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { t } = useLanguage();
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
      {/* Twitter-inspired background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
      </div>
      
      {/* Back button */}
      <motion.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          rounded="full"
          className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-blue-50 hover:text-blue-500"
          onClick={handlePrev}
        >
          <ArrowLeft size={18} />
        </Button>
      </motion.div>
      
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
          <div className="relative">
            <SekcionIconRounded className="w-20 h-20 text-blue-500" />
            <Twitter className="absolute bottom-0 right-0 text-blue-500 bg-white p-1 rounded-full w-7 h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {t('createAccount')}
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 mb-10"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {t('personalizeExperience')}
        </motion.p>
        
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200 max-w-md mx-auto mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 text-left flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-500" />
              {t('firstName')}
            </label>
            <Input 
              id="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('firstName')}
              className="bg-gray-50 border-gray-200 h-12 pl-4 
                       focus:border-blue-500 focus:ring-blue-500 
                       transition-all text-gray-900 rounded-lg"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-6">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2 text-left flex items-center">
              <UserPlus className="w-4 h-4 mr-2 text-blue-500" />
              {t('lastName')}
            </label>
            <Input 
              id="lastName" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('lastName')}
              className="bg-gray-50 border-gray-200 h-12 pl-4 
                       focus:border-blue-500 focus:ring-blue-500
                       transition-all text-gray-900 rounded-lg"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 text-left flex items-center">
              <AtSign className="w-4 h-4 mr-2 text-blue-500" />
              {t('usernamePreview')}
            </label>
            <div className="bg-gray-50 border border-gray-200 h-12 pl-4 
                           text-gray-500 rounded-lg flex items-center">
              @{firstName.toLowerCase() + lastName.toLowerCase()}
            </div>
            <p className="text-xs text-gray-500 text-left mt-1">{t('profileAppear')}</p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col justify-center items-center gap-4 mb-8"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="twitter"
            rounded="full"
            className="w-64 py-3 text-white font-bold bg-gradient-to-r from-primary-500 to-secondary-500"
            disabled={!firstName.trim() || !lastName.trim()}
            onClick={handleContinue}
          >
            {t('continue')}
          </Button>
          
          <Button
            variant="ghost"
            rounded="full"
            className="text-gray-500 hover:text-blue-500 hover:bg-gray-100/50 px-6 py-2 text-sm"
            onClick={handleSkipToDashboard}
          >
            {t('skipToDashboard')}
          </Button>
        </motion.div>
        
        <motion.div
          className="flex flex-col items-center"
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <p className="text-sm text-gray-500 mt-2">
            {current + 1} / {total}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
