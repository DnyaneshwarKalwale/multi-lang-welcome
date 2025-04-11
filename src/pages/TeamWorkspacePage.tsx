import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Linkedin, 
  Building2, User, Users, Hash, UserPlus, Globe, Users2 
} from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function TeamWorkspacePage() {
  const { workspaceName, setWorkspaceName, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative overflow-hidden">
      {/* LinkedIn-inspired background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 dark:bg-blue-900/30 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-800/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
      </div>
      
      {/* Social media floating elements for decoration - hidden on smallest screens */}
      <div className="hidden sm:block">
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8, 
            ease: "easeInOut" 
          }}
          style={{ top: '15%', right: '10%' }}
        >
          <Linkedin size={80} className="text-blue-500" />
        </motion.div>
        
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10, 
            ease: "easeInOut",
            delay: 1 
          }}
          style={{ bottom: '20%', left: '8%' }}
        >
          <Building2 size={60} className="text-blue-500" />
        </motion.div>
        
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, -10, 0],
            x: [0, -10, 0],
            rotate: [0, 3, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 7, 
            ease: "easeInOut",
            delay: 0.5 
          }}
          style={{ top: '30%', left: '15%' }}
        >
          <Users size={50} className="text-blue-500" />
        </motion.div>
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
          className="flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400"
          onClick={prevStep}
        >
          <ArrowLeft size={18} />
        </Button>
      </motion.div>
      
      <motion.div 
        className="max-w-lg w-full"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-6 sm:mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <ScripeIconRounded className="w-14 h-14 sm:w-20 sm:h-20 text-blue-500" />
            <Linkedin className="absolute bottom-0 right-0 text-primary bg-white dark:bg-gray-900 p-1 rounded-full w-6 h-6 sm:w-7 sm:h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Create a team workspace
        </motion.h1>
        
        <motion.p 
          className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 text-center max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Your team workspace is where your content creators will collaborate on tweets, 
          analyze engagement stats, and build your audience together.
        </motion.p>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-md"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <Hash size={22} className="text-blue-500 mr-2" />
            <label htmlFor="workspace-name" className="block text-base font-medium text-gray-800 dark:text-gray-200">
              Workspace name
            </label>
          </div>
          
          <Input 
            id="workspace-name" 
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="My LinkedIn Team"
            className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-full h-12 pl-4 focus:border-blue-500 focus:ring-blue-500 transition-all text-gray-900 dark:text-white mb-4"
          />
          
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-start">
              <div className="text-blue-500 mt-0.5 mr-2">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path>
                  <path d="M12 13.415c-1.892 0-3.633.95-4.656 2.544-.224.348-.123.81.226 1.035.348.226.812.124 1.036-.226.747-1.162 2.016-1.855 3.395-1.855s2.648.693 3.396 1.854c.145.226.39.35.637.35.14 0 .282-.04.4-.125.35-.226.45-.687.226-1.036-1.022-1.594-2.762-2.545-4.655-2.545zm-3.25-4.17C8.75 7.9 9.9 6.75 11.25 6.75S13.75 7.9 13.75 9.25s-1.15 2.5-2.5 2.5-2.5-1.15-2.5-2.5zm1.5 0c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"></path>
                </svg>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Your workspace name will be visible to all team members. Choose something recognizable for your organization.
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <Button 
            variant="linkedin"
            rounded="full"
            className="w-64 py-3 text-white font-bold"
            onClick={nextStep}
            disabled={!workspaceName.trim()}
          >
            Create workspace
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
