
import React from "react";
import { useNavigate } from "react-router-dom";
import { ScripeIcon } from "@/components/ScripeIcon";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock, LineChart, Zap, Twitter, MessageCircle, BarChart, Heart, Users } from "lucide-react";

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
      {/* Background pattern with Twitter-inspired blue gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 dark:bg-blue-900/30 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-800/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
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
          <div className="relative">
            <ScripeIcon className="text-blue-500 w-20 h-20" />
            <Twitter className="absolute bottom-0 right-0 text-blue-500 bg-white dark:bg-gray-900 p-1 rounded-full shadow-md" size={24} />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Welcome to TweetSphere
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Create engaging Twitter content in minutes, not hours.
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            AI-powered tweets optimized for maximum engagement and reach.
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
            variant="twitter"
            rounded="full"
            className="w-full py-6 px-8 text-lg font-bold mb-4 flex items-center justify-center gap-2 group"
          >
            <span>Get started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <Button
            variant="ghost"
            rounded="full"
            className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 px-8 py-3 text-sm"
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
        
        {/* Tweet previews */}
        <motion.div 
          className="mt-16 flex flex-col gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 text-left shadow-sm hover:shadow-md transition-all duration-300 max-w-lg mx-auto w-full">
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                <Users size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">John Smith <span className="text-blue-500">✓</span></p>
                <p className="text-gray-500 text-sm">@johnsmith</p>
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-3">
              Just discovered this amazing tool for Twitter content creation! AI-powered tweets that sound exactly like me. Game changer for busy creators. #TwitterTips
            </p>
            <div className="flex justify-between text-gray-500 text-sm">
              <span className="flex items-center gap-1"><MessageCircle size={14} /> 24</span>
              <span className="flex items-center gap-1"><ArrowRight size={14} className="rotate-90" /> 142</span>
              <span className="flex items-center gap-1"><Heart size={14} /> 358</span>
              <span className="flex items-center gap-1"><BarChart size={14} /> 12.8K</span>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 text-left shadow-sm hover:shadow-md transition-all duration-300 max-w-lg mx-auto w-full">
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                <Users size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Sarah Johnson <span className="text-blue-500">✓</span></p>
                <p className="text-gray-500 text-sm">@sarahjohnson</p>
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-3">
              5 reasons why TweetSphere has transformed my Twitter strategy:
              <br/><br/>
              1. Saves hours per week
              <br/>
              2. Engagement up 43%
              <br/>
              3. Audience growth doubled
              <br/>
              4. AI learns my voice perfectly
              <br/>
              5. Analytics that actually help
            </p>
            <div className="flex justify-between text-gray-500 text-sm">
              <span className="flex items-center gap-1"><MessageCircle size={14} /> 36</span>
              <span className="flex items-center gap-1"><ArrowRight size={14} className="rotate-90" /> 215</span>
              <span className="flex items-center gap-1"><Heart size={14} /> 687</span>
              <span className="flex items-center gap-1"><BarChart size={14} /> 24.3K</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
