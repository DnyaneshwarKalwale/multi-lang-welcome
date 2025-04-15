import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Users, User, UserPlus, UserCircle, Check, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { BrandOutIcon } from "@/components/BrandOutIcon";
import { Button } from "@/components/ui/button";

export default function TeamSelectionPage() {
  const { workspaceType, setWorkspaceType, nextStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white text-gray-900 relative overflow-hidden">
      {/* Light background with subtle pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-50 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-50 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
      </div>
      
      <motion.div 
        className="max-w-3xl w-full text-center"
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
            <BrandOutIcon className="w-20 h-20" />
            <Linkedin className="absolute bottom-0 right-0 text-[#0088FF] bg-white p-1 rounded-full w-7 h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-gray-900"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          How would you like to use BrandOut?
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 mb-10"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          We'll setup your workspace accordingly.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className={`bg-white border ${workspaceType === "team" ? "border-blue-500 ring-2 ring-blue-500/30" : "border-gray-200"} rounded-xl p-6 flex flex-col items-center cursor-pointer shadow-sm hover:shadow-md transition-all`}
            onClick={() => setWorkspaceType("team")}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className={`p-5 rounded-full mb-6 ${workspaceType === "team" ? "bg-blue-100" : "bg-gray-100"}`}>
              <Users className={`w-14 h-14 ${workspaceType === "team" ? "text-blue-500" : "text-gray-500"}`} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">For my team</h3>
            <p className="text-gray-600 text-base mb-6">
              One place to create, review and track content for your team.
            </p>
            {workspaceType === "team" && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-blue-500">Selected</span>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            className={`bg-white border ${workspaceType === "personal" ? "border-blue-500 ring-2 ring-blue-500/30" : "border-gray-200"} rounded-xl p-6 flex flex-col items-center cursor-pointer shadow-sm hover:shadow-md transition-all`}
            onClick={() => setWorkspaceType("personal")}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className={`p-5 rounded-full mb-6 ${workspaceType === "personal" ? "bg-blue-100" : "bg-gray-100"}`}>
              <UserCircle className={`w-14 h-14 ${workspaceType === "personal" ? "text-blue-500" : "text-gray-500"}`} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">For personal use</h3>
            <p className="text-gray-600 text-base mb-6">
              Create content for a single social media profile.
            </p>
            {workspaceType === "personal" && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-blue-500">Selected</span>
              </div>
            )}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="default"
            className="w-64 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl"
            disabled={!workspaceType}
            onClick={nextStep}
          >
            Continue
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center mt-4"
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
