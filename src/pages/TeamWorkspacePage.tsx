import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function TeamWorkspacePage() {
  const { workspaceName, setWorkspaceName, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
      </div>
      
      {/* Back button */}
      <BackButton 
        onClick={prevStep} 
        absolute 
      />
      
      <motion.div 
        className="max-w-lg w-full"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Create a new team workspace
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 text-center"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Workspaces are shared environments where teams can work 
          on content production, strategy and analytics together.
        </motion.p>
        
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 mb-12 border border-gray-800"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-300 mb-2">
            Workspace name
          </label>
          <Input 
            id="workspace-name" 
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Scripe GmbH"
            className="bg-gray-800/70 border-gray-700 mb-6 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all text-white"
          />
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={nextStep}
            disabled={!workspaceName.trim()}
          >
            Create workspace
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <ProgressDots total={total} current={current} color="purple" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
