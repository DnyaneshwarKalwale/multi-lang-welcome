import React from "react";
import { useNavigate } from "react-router-dom";
import { ScripeIcon } from "@/components/ScripeIcon";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const { nextStep } = useOnboarding();
  const navigate = useNavigate();

  const handleSkipToDashboard = () => {
    // Mark onboarding as completed in localStorage
    localStorage.setItem('onboardingCompleted', 'true');
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
      </div>
      
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
          <ScripeIcon size={100} />
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Welcome to Scripe
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-xl text-gray-300 mb-2">
            Scripe is the content workspace to share valuable posts everyday.
          </p>
          <p className="text-xl text-gray-300 mb-8">
            Receive tailored, algorithm-optimized Twitter posts in &lt;5 minutes.
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
            className="group w-full py-4 px-8 rounded-full text-lg font-medium mb-4 flex items-center justify-center gap-2 shadow-xl hover:shadow-indigo-500/25 transition-all duration-300"
          >
            <span>Get started</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-full px-8 py-3 transition-all duration-300 flex items-center gap-1 text-sm"
            onClick={handleSkipToDashboard}
          >
            <span>Skip to dashboard</span>
            <ArrowRight size={16} className="ml-1" />
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-medium mb-2">AI-Powered Content</h3>
            <p className="text-gray-400 text-sm">Generate high-quality Twitter posts based on your unique voice and audience preferences.</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Engagement Analytics</h3>
            <p className="text-gray-400 text-sm">Track performance metrics and optimize your content strategy with detailed insights.</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⏱️</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Save Time</h3>
            <p className="text-gray-400 text-sm">Create weeks of content in minutes and schedule posts for optimal engagement times.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
