import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, Twitter } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-cyan-900 blur-[120px]"></div>
      </div>
      
      <motion.div 
        className="max-w-3xl w-full text-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="flex items-center justify-center gap-2 mb-4"
          variants={fadeIn}
          transition={{ delay: 0.1 }}
        >
          <Twitter size={20} className="text-blue-400" />
          <span className="text-blue-400 font-medium">Twitter Schedule</span>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          How often do you want to tweet per week?
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-400 mb-10"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          We recommend tweeting at least 1-2 times per week for optimal engagement.
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
                w-16 h-16 rounded-xl text-xl font-semibold p-0
                ${postFrequency === frequency 
                  ? 'bg-blue-600 hover:bg-blue-700 border-none text-white' 
                  : 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-500'}
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
          <div className="max-w-md mx-auto p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
            <div className="flex items-center mb-6">
              <Calendar className="text-blue-500 mr-3" size={28} />
              <h3 className="text-xl font-medium">Posting Schedule</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-6">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div 
                  key={day + i} 
                  className={`
                    h-12 flex items-center justify-center rounded 
                    ${i < (postFrequency || 0) ? 'bg-blue-600/20 border border-blue-600/50' : 'bg-gray-800 border border-gray-700'}
                  `}
                >
                  <span className="text-sm font-medium">{day}</span>
                  {i < (postFrequency || 0) && (
                    <CheckCircle className="ml-1 text-blue-500" size={12} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
              <div className="flex items-center text-gray-400">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Optimal tweeting time</span>
              </div>
              <span className="text-sm text-white bg-blue-600/20 px-3 py-1 rounded border border-blue-600/50">
                9:00 - 11:00 AM
              </span>
            </div>
          </div>
          
          {postFrequency && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-8 py-3 px-5 bg-blue-600/20 border border-blue-600 rounded-lg text-white text-sm">
              <strong className="mr-1">AI will suggest:</strong> 
              {postFrequency === 1 ? 'One tweet per week' : `${postFrequency} tweets per week`}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="flex justify-between mb-12"
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <BackButton 
            onClick={prevStep}
            variant="twitter"
          >
            Back
          </BackButton>
          <ContinueButton 
            onClick={nextStep}
            disabled={!postFrequency}
            variant="twitter"
          >
            Continue
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center"
        >
          <ProgressDots total={total} current={current} color="blue" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
