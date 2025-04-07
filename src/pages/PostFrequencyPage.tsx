
import React, { useState } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Twitter, 
  CalendarDays, 
  ArrowLeft 
} from "lucide-react";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { useToast } from "@/hooks/use-toast";

export default function PostFrequencyPage() {
  const { postFrequency, setPostFrequency, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const { toast } = useToast();

  // Track selected days instead of just frequency
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    monday: postFrequency && postFrequency >= 1 ? true : false,
    tuesday: postFrequency && postFrequency >= 2 ? true : false,
    wednesday: postFrequency && postFrequency >= 3 ? true : false,
    thursday: postFrequency && postFrequency >= 4 ? true : false,
    friday: postFrequency && postFrequency >= 5 ? true : false,
    saturday: postFrequency && postFrequency >= 6 ? true : false,
    sunday: postFrequency && postFrequency >= 7 ? true : false,
  });

  const daysOfWeek = [
    { id: 'monday', label: 'M', fullName: 'Monday' },
    { id: 'tuesday', label: 'T', fullName: 'Tuesday' },
    { id: 'wednesday', label: 'W', fullName: 'Wednesday' },
    { id: 'thursday', label: 'T', fullName: 'Thursday' },
    { id: 'friday', label: 'F', fullName: 'Friday' },
    { id: 'saturday', label: 'S', fullName: 'Saturday' },
    { id: 'sunday', label: 'S', fullName: 'Sunday' }
  ];

  // Calculate frequency based on selected days
  const calculateFrequency = (): number => {
    return Object.values(selectedDays).filter(Boolean).length;
  };

  // Handle day selection
  const handleDayToggle = (dayId: string) => {
    const updatedDays = { ...selectedDays, [dayId]: !selectedDays[dayId] };
    setSelectedDays(updatedDays);
    
    // Update postFrequency in the onboarding context based on selected days count
    const newFrequency = Object.values(updatedDays).filter(Boolean).length as 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
    setPostFrequency(newFrequency || null);
  };

  const handleContinue = () => {
    if (calculateFrequency() === 0) {
      toast({
        title: "Please select at least one day",
        description: "You need to select at least one day to continue.",
        variant: "destructive",
      });
      return;
    }
    nextStep();
  };

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      {/* Twitter-inspired background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 dark:bg-blue-900/30 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-800/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
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
            <ScripeIconRounded className="w-20 h-20 text-blue-500" />
            <Twitter className="absolute bottom-0 right-0 text-blue-500 bg-white dark:bg-gray-900 p-1 rounded-full w-7 h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          When do you want to tweet?
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 mb-10"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Select specific days of the week when you'd like to post. We recommend 3-5 days per week for optimal engagement.
        </motion.p>
        
        <motion.div 
          className="mb-12 relative"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            <div className="flex items-center mb-6">
              <Calendar className="text-blue-500 mr-3" size={24} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Choose Your Tweet Days</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-6">
              {daysOfWeek.map((day, i) => (
                <div 
                  key={day.id}
                  className={`
                    relative h-16 flex flex-col items-center justify-center rounded-md transition-all cursor-pointer
                    ${selectedDays[day.id] 
                      ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
                      : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
                  `}
                  onClick={() => handleDayToggle(day.id)}
                >
                  <div className="absolute top-2 left-2">
                    <Checkbox 
                      id={day.id}
                      checked={selectedDays[day.id]}
                      onCheckedChange={() => handleDayToggle(day.id)}
                      className="h-3 w-3"
                    />
                  </div>
                  <span className={`text-sm font-medium ${selectedDays[day.id] ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {day.label}
                  </span>
                  <span className="text-[10px] mt-0.5 text-gray-500 dark:text-gray-400">
                    {day.fullName.substring(0, 3)}
                  </span>
                  {selectedDays[day.id] && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5"
                    >
                      <CheckCircle className="text-white" size={14} />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Optimal posting time</span>
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50 font-medium">
                9:00 - 11:00 AM
              </span>
            </div>
          </div>
          
          {calculateFrequency() > 0 && (
            <motion.div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-8 py-3 px-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 text-sm shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <strong className="mr-1">Selected:</strong> 
              {calculateFrequency() === 1 ? 'One day per week' : `${calculateFrequency()} days per week`}
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="twitter"
            rounded="full"
            className="w-64 py-3 text-white font-bold"
            disabled={calculateFrequency() === 0}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center mt-4"
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
