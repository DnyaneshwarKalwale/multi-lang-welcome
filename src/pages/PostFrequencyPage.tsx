import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { ArrowLeft, ChevronRight, Calendar, Twitter } from "lucide-react";

export default function PostFrequencyPage() {
  const navigate = useNavigate();
  const { nextStep, prevStep, postFrequency, setPostFrequency, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  const frequencies = [
    {
      id: "daily",
      name: "Daily",
      description: "One tweet per day to maintain consistent visibility",
      details: "7 tweets per week"
    },
    {
      id: "frequent",
      name: "Frequent",
      description: "Multiple tweets throughout the day for higher engagement",
      details: "14+ tweets per week"
    },
    {
      id: "moderate",
      name: "Moderate",
      description: "A few tweets per week to build engagement without overwhelm",
      details: "3-5 tweets per week"
    },
    {
      id: "occasional",
      name: "Occasional",
      description: "Well-timed tweets for quality over quantity",
      details: "1-2 tweets per week"
    }
  ];

  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/extension-install");
  };

  const handlePrev = () => {
    prevStep();
    navigate("/onboarding/post-format");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScripeIconRounded className="w-20 h-20" />
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Calendar className="w-7 h-7 text-indigo-400" />
          <h1 className="text-4xl font-bold">Posting frequency</h1>
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          How often would you like to post on Twitter?
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {frequencies.map((frequency) => (
            <motion.div
              key={frequency.id}
              className={`bg-gray-900/50 backdrop-blur-sm border-2 ${
                postFrequency === frequency.id ? "border-indigo-500" : "border-gray-800"
              } rounded-xl p-6 cursor-pointer hover:border-indigo-500/60 transition-all duration-300 hover-lift`}
              onClick={() => setPostFrequency(frequency.id)}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-left">{frequency.name}</h3>
                    <p className="text-xs text-indigo-400">{frequency.details}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  postFrequency === frequency.id ? "border-indigo-500 bg-indigo-500" : "border-gray-600"
                } flex items-center justify-center transition-all duration-200`}>
                  {postFrequency === frequency.id && (
                    <motion.div 
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm text-left">{frequency.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ContinueButton 
            onClick={handleContinue}
            disabled={!postFrequency}
            className={`group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 ${
              !postFrequency ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>Continue</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </ContinueButton>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <ProgressDots total={total} current={current} />
        </motion.div>
        
        {/* Scheduling info */}
        <motion.div
          className="mt-12 flex items-center justify-center max-w-2xl mx-auto p-4 border border-indigo-800/30 rounded-lg bg-indigo-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Twitter className="flex-shrink-0 w-5 h-5 mr-3 text-indigo-400" />
          <p className="text-indigo-300 text-sm">
            Scripe will help you generate and schedule tweets based on your selected frequency. You can always adjust this later from your dashboard settings.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
