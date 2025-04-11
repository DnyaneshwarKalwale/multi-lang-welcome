import React from "react";
import { useNavigate } from "react-router-dom";
import { BrandOutLogo } from "@/components/BrandOutLogo";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock, LineChart, Zap, Linkedin, MessageCircle, BarChart, ThumbsUp, Users, FileText } from "lucide-react";

export default function WelcomePage() {
  const { nextStep, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Explicitly set the current step to ensure we go to personal-info
    setCurrentStep("personal-info");
    navigate("/onboarding/personal-info");
  };

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
      {/* Background pattern with LinkedIn-inspired blue gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-primary-100 dark:bg-primary/30 blur-[120px]"></div>
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
          <BrandOutLogo variant="full" size="lg" />
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Welcome to BrandOut
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Create engaging LinkedIn content in minutes, not hours.
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            AI-powered posts optimized for professional growth and influence.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center justify-center mb-12 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Button 
            onClick={handleGetStarted} 
            className="w-full py-6 px-8 text-lg font-bold mb-4 flex items-center justify-center gap-2 group bg-primary hover:bg-primary-600 text-white rounded-full"
          >
            <span>Get started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-800/50 px-8 py-3 text-sm rounded-full"
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
        
        {/* LinkedIn post previews */}
        <motion.div 
          className="mt-16 flex flex-col gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 text-left shadow-sm hover:shadow-md transition-all duration-300 max-w-lg mx-auto w-full">
            <div className="flex items-start mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mr-3">
                <Users size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">John Smith</p>
                <p className="text-gray-500 text-sm">Marketing Director at TechGrowth Solutions</p>
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-3">
              Just discovered an incredible platform for LinkedIn content creation! AI-powered posts that sound authentic and professional. Perfect for busy professionals looking to grow their personal brand. Engagement rates up 65% in just 2 weeks. #LinkedInTips #PersonalBranding
            </p>
            <div className="flex justify-between text-gray-500 text-sm">
              <span className="flex items-center gap-1"><MessageCircle size={14} /> 32</span>
              <span className="flex items-center gap-1"><ArrowRight size={14} className="rotate-90" /> 56</span>
              <span className="flex items-center gap-1"><ThumbsUp size={14} /> 198</span>
              <span className="flex items-center gap-1"><BarChart size={14} /> 8.4K</span>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 text-left shadow-sm hover:shadow-md transition-all duration-300 max-w-lg mx-auto w-full flex">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mr-3">
              <Users size={20} />
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <p className="font-bold text-gray-900 dark:text-white">Sarah Johnson</p>
                <p className="text-gray-500 text-sm">Senior Product Manager • SaaS Technology</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">5 ways Lovable transformed my LinkedIn strategy:</p>
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Professional Carousel Post</span>
                    <FileText size={14} className="text-primary" />
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-gray-700 dark:text-gray-200 font-medium">Carousel Preview</p>
                    <div className="flex mt-3 justify-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span className="flex items-center gap-1"><MessageCircle size={14} /> 45</span>
                <span className="flex items-center gap-1"><ArrowRight size={14} className="rotate-90" /> 98</span>
                <span className="flex items-center gap-1"><ThumbsUp size={14} /> 327</span>
                <span className="flex items-center gap-1"><BarChart size={14} /> 15.2K</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
