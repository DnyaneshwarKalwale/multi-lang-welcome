import React from "react";
import { useNavigate } from "react-router-dom";
import { ScripeIcon } from "@/components/ScripeIcon";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock, LineChart, Zap } from "lucide-react";

export default function WelcomePage() {
  const { nextStep } = useOnboarding();
  const navigate = useNavigate();

  const handleSkipToDashboard = () => {
    // Mark onboarding as completed in localStorage
    localStorage.setItem('onboardingCompleted', 'true');
    navigate("/dashboard");
  };

  // Framer motion variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 50 } 
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
      
      <motion.div 
        className="max-w-3xl w-full text-center relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div 
          className="mb-10 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ScripeIcon size={100} className="animate-spin-slow" />
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-bold mb-6 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Welcome to Novus
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Novus is the modern content workspace for creating engaging posts.
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Receive tailored, algorithm-optimized social media content in minutes.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center justify-center mb-12 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Button 
            onClick={nextStep} 
            variant="gradient"
            animation="lift"
            rounded="full"
            className="w-full py-4 px-8 text-lg font-medium mb-4 flex items-center justify-center gap-2 group"
          >
            <span>Get started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-full px-8 py-3 text-sm"
            onClick={handleSkipToDashboard}
          >
            Skip to dashboard
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <ProgressDots total={8} current={0} />
        </motion.div>
        
        {/* Features highlight */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">AI-Powered Content</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Generate high-quality social media posts based on your unique voice and audience preferences.</p>
          </motion.div>
          
          <motion.div variants={item} className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center mb-4">
              <LineChart className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Engagement Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Track performance metrics and optimize your content strategy with detailed insights.</p>
          </motion.div>
          
          <motion.div variants={item} className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Save Time</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Create weeks of content in minutes and schedule posts for optimal engagement times.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
