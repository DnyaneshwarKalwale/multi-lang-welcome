import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, Twitter, CalendarDays } from "lucide-react";
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-teal-200 dark:bg-teal-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-cyan-200 dark:bg-cyan-900 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5 -z-10"></div>
      
      {/* Back button */}
      <BackButton 
        onClick={prevStep} 
        absolute 
      />
      
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
            <ScripeIconRounded className="w-20 h-20" />
            <motion.div 
              className="absolute -bottom-2 -right-2 text-teal-500 dark:text-teal-400"
              animate={{ 
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <CalendarDays size={24} />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-center gap-2 mb-4"
          variants={fadeIn}
          transition={{ delay: 0.15 }}
        >
          <Twitter size={20} className="text-cyan-600 dark:text-cyan-400" />
          <span className="text-cyan-600 dark:text-cyan-400 font-medium">Publishing Schedule</span>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center text-gradient"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          How often do you want to post per week?
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-10"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          We recommend posting at least 1-2 times per week for optimal engagement.
        </motion.p>
        
        <motion.div 
          className="flex justify-center gap-3 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          {frequencyOptions.map((frequency) => (
            <motion.div
              key={frequency}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <Button
                variant="ghost"
                onClick={() => setPostFrequency(frequency as any)}
                className={`
                  w-14 h-14 rounded-xl text-xl font-semibold p-0 border-2
                  ${postFrequency === frequency 
                    ? 'bg-gradient-to-br from-teal-400/20 to-cyan-500/20 border-teal-400 text-teal-600 dark:text-teal-400 shadow-md hover:shadow-lg' 
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-teal-400/50 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20'}
                `}
              >
                {frequency}
              </Button>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mb-24 relative"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-md mx-auto p-6 bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="flex items-center mb-6">
              <Calendar className="text-teal-500 dark:text-teal-400 mr-3" size={28} />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Posting Schedule</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div 
                  key={day + i} 
                  className={`
                    h-12 flex items-center justify-center rounded-lg transition-all
                    ${i < (postFrequency || 0) 
                      ? 'bg-gradient-to-br from-teal-400/20 to-cyan-500/20 border border-teal-400/50 dark:border-teal-400/30' 
                      : 'bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700'}
                  `}
                >
                  <span className={`text-sm font-medium ${i < (postFrequency || 0) ? 'text-teal-700 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {day}
                  </span>
                  {i < (postFrequency || 0) && (
                    <CheckCircle className="ml-1 text-teal-500 dark:text-teal-400" size={12} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Optimal posting time</span>
              </div>
              <span className="text-sm text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30 px-3 py-1 rounded-lg border border-teal-200 dark:border-teal-800/50">
                9:00 - 11:00 AM
              </span>
            </div>
          </div>
          
          {postFrequency && (
            <motion.div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-8 py-3 px-5 bg-gradient-to-r from-teal-400/20 to-cyan-500/20 border border-teal-400/50 dark:border-teal-400/30 rounded-lg text-teal-700 dark:text-teal-300 text-sm shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <strong className="mr-1">AI will suggest:</strong> 
              {postFrequency === 1 ? 'One post per week' : `${postFrequency} posts per week`}
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="flex justify-center gap-4 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <ContinueButton 
            onClick={nextStep}
            disabled={!postFrequency}
            variant="cyan"
          >
            Continue
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <ProgressDots total={total} current={current} color="novus" />
        </motion.div>
      </motion.div>
    </div>
  );
}
