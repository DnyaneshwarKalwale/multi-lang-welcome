import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, ArrowLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function PostFrequencyPage() {
  const { postFrequency, setPostFrequency, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  const frequencyOptions = [1, 2, 3, 4, 5, 6, 7];

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px] animate-pulse-slow-delay"></div>
      </div>
      
      {/* Back button */}
      <motion.button
        className="absolute top-10 left-10 flex items-center text-gray-400 hover:text-white transition-colors"
        onClick={prevStep}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </motion.button>
      
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
          <ScripeIconRounded className="w-20 h-20" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          How often do you want to post per week?
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-10 text-center"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          We recommend posting at least 1-2 times per week to maintain engagement.
        </motion.p>
        
        <motion.div 
          className="flex justify-center gap-2 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          {frequencyOptions.map((frequency) => (
            <Button
              key={frequency}
              variant={postFrequency === frequency ? "default" : "outline"}
              onClick={() => setPostFrequency(frequency as any)}
              className={`
                w-16 h-16 rounded-xl text-xl font-semibold p-0 transition-all duration-300
                ${postFrequency === frequency 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-xl hover:shadow-indigo-500/20 border-none text-white' 
                  : 'border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-500 backdrop-blur-sm bg-gray-900/50'}
              `}
            >
              {frequency}
            </Button>
          ))}
        </motion.div>
        
        <motion.div 
          className="mb-24 relative"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-md mx-auto p-6 bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-800 shadow-lg">
            <div className="flex items-center mb-6">
              <Calendar className="text-indigo-500 mr-3" size={28} />
              <h3 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Posting Schedule</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-6">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div 
                  key={day + i} 
                  className={`
                    h-12 flex items-center justify-center rounded transition-all duration-300
                    ${i < (postFrequency || 0) ? 'bg-indigo-600/20 border border-indigo-600/50' : 'bg-gray-800/70 border border-gray-700'}
                  `}
                >
                  <span className="text-sm font-medium">{day}</span>
                  {i < (postFrequency || 0) && (
                    <CheckCircle className="ml-1 text-indigo-500" size={12} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
              <div className="flex items-center text-gray-400">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Optimal posting time</span>
              </div>
              <span className="text-sm text-white bg-indigo-600/20 px-3 py-1 rounded border border-indigo-600/50">
                9:00 - 11:00 AM
              </span>
            </div>
          </div>
          
          {postFrequency && (
            <motion.div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-8 py-3 px-5 bg-indigo-600/20 border border-indigo-600 rounded-lg text-white text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <strong className="mr-1">AI will suggest:</strong> 
              {postFrequency === 1 ? 'One post per week' : `${postFrequency} posts per week`}
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.8 }}
        >
          <Button 
            onClick={nextStep}
            disabled={!postFrequency}
            variant="gradient"
            animation="pulse"
            rounded="full"
            className="group px-8 py-3 flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25"
          >
            <span>Continue</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.9 }}
          className="flex justify-center"
        >
          <ProgressDots total={total} current={current} />
        </motion.div>
      </motion.div>
    </div>
  );
}
