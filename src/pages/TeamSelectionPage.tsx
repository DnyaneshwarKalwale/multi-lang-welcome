import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { ArrowLeft, ChevronRight, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeamSelectionPage() {
  const navigate = useNavigate();
  const { nextStep, prevStep, workspaceType, setWorkspaceType, getStepProgress } = useOnboarding();
  
  const [selectedOption, setSelectedOption] = useState<"personal" | "team" | null>(workspaceType);
  
  const { current, total } = getStepProgress();

  const handleContinue = () => {
    if (selectedOption) {
      setWorkspaceType(selectedOption);
      nextStep();
      
      if (selectedOption === "personal") {
        navigate("/onboarding/post-format");
      } else {
        navigate("/onboarding/team-workspace");
      }
    }
  };

  const handlePrev = () => {
    prevStep();
    navigate("/onboarding/language-selection");
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.03, 
      boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.3)",
      y: -5
    },
    selected: {
      scale: 1.05,
      boxShadow: "0 15px 30px -10px rgba(99, 102, 241, 0.4)",
      y: -5,
      borderColor: "#6366f1"
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
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
        className="max-w-4xl w-full text-center"
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
          className="text-4xl font-bold mb-6"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          How do you plan to use Scripe?
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          We'll streamline your experience based on how you plan to use the platform
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className={`bg-gray-900/50 backdrop-blur-sm border-2 ${
              selectedOption === "personal" ? "border-indigo-500" : "border-gray-800"
            } rounded-xl p-8 text-left cursor-pointer hover-lift transition-all duration-300`}
            onClick={() => setSelectedOption("personal")}
            variants={cardVariants}
            initial="initial"
            animate={selectedOption === "personal" ? "selected" : "animate"}
            whileHover={selectedOption === "personal" ? "selected" : "hover"}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-400" />
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                selectedOption === "personal" ? "border-indigo-500 bg-indigo-500" : "border-gray-600"
              } flex items-center justify-center transition-all duration-200`}>
                {selectedOption === "personal" && (
                  <motion.div 
                    className="w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </div>
            <h3 className="text-xl font-medium mb-3">Personal</h3>
            <p className="text-gray-400 text-sm mb-4">
              For individuals managing their own content and personal brand. Create and optimize your social media presence.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
                <span>AI content creation</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
                <span>Personal analytics dashboard</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
                <span>Single-user workspace</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            className={`bg-gray-900/50 backdrop-blur-sm border-2 ${
              selectedOption === "team" ? "border-indigo-500" : "border-gray-800"
            } rounded-xl p-8 text-left cursor-pointer hover-lift transition-all duration-300`}
            onClick={() => setSelectedOption("team")}
            variants={cardVariants}
            initial="initial"
            animate={selectedOption === "team" ? "selected" : "animate"}
            whileHover={selectedOption === "team" ? "selected" : "hover"}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                selectedOption === "team" ? "border-indigo-500 bg-indigo-500" : "border-gray-600"
              } flex items-center justify-center transition-all duration-200`}>
                {selectedOption === "team" && (
                  <motion.div 
                    className="w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </div>
            <h3 className="text-xl font-medium mb-3">Team</h3>
            <p className="text-gray-400 text-sm mb-4">
              For teams collaborating on content strategy. Invite members, assign roles, and streamline your workflow.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
                <span>Collaborative workspace</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
                <span>Role-based permissions</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
                <span>Team analytics & reporting</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={handleContinue}
            disabled={!selectedOption}
            className={`group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 ${
              !selectedOption ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>Continue</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </ContinueButton>
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
