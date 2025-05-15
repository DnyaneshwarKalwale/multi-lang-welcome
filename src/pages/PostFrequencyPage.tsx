import React, { useState } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { CheckCircle, Users, ArrowLeft, Calendar, Clock, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { BrandOutIcon, BrandOutLogotype } from "@/components/BrandOutIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const daysOfWeek = [
  { id: 'mon', label: 'M', fullName: 'Monday' },
  { id: 'tue', label: 'T', fullName: 'Tuesday' },
  { id: 'wed', label: 'W', fullName: 'Wednesday' },
  { id: 'thu', label: 'T', fullName: 'Thursday' },
  { id: 'fri', label: 'F', fullName: 'Friday' },
  { id: 'sat', label: 'S', fullName: 'Saturday' },
  { id: 'sun', label: 'S', fullName: 'Sunday' },
];

export default function PostFrequencyPage() {
  const { nextStep, prevStep, selectedDays: contextSelectedDays, setSelectedDays, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  
  // Convert the context selectedDays format to the format needed in this component
  const [localSelectedDays, setLocalSelectedDays] = useState<Record<string, boolean>>({
    mon: contextSelectedDays.monday || false,
    tue: contextSelectedDays.tuesday || false,
    wed: contextSelectedDays.wednesday || false,
    thu: contextSelectedDays.thursday || false,
    fri: contextSelectedDays.friday || false,
    sat: contextSelectedDays.saturday || false,
    sun: contextSelectedDays.sunday || false,
  });
  
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  // Calculate the number of days selected
  const calculateFrequency = (): number => {
    return Object.values(localSelectedDays).filter(Boolean).length;
  };
  
  // Handle day selection toggle
  const handleDayToggle = (dayId: string) => {
    setLocalSelectedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };
  
  // Handle continue button click
  const handleContinue = () => {
    // Save the selected days to context using the appropriate format
    setSelectedDays({
      monday: localSelectedDays.mon,
      tuesday: localSelectedDays.tue,
      wednesday: localSelectedDays.wed,
      thursday: localSelectedDays.thu,
      friday: localSelectedDays.fri,
      saturday: localSelectedDays.sat,
      sunday: localSelectedDays.sun,
    });
    nextStep();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white text-gray-900 relative overflow-hidden">
      {/* Light background with subtle pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-50 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-50 blur-[120px]"></div>
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
          className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-blue-50 hover:text-blue-500 rounded-full"
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
            <BrandOutLogotype className="h-20 w-auto" />
            <Linkedin className="absolute bottom-0 right-0 text-[#0088FF] bg-white p-1 rounded-full w-7 h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          When do you want to post?
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-600 mb-10"
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
          <div className="max-w-md mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-md">
            <div className="flex items-center mb-6">
              <Calendar className="text-blue-500 mr-3" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Choose Your Tweet Days</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-6">
              {daysOfWeek.map((day, i) => (
                <div 
                  key={day.id}
                  className={`
                    relative h-16 flex flex-col items-center justify-center rounded-md transition-all cursor-pointer
                    ${localSelectedDays[day.id] 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-gray-50 border border-gray-200 hover:border-blue-300'}
                  `}
                  onClick={() => handleDayToggle(day.id)}
                >
                  <div className="absolute top-2 left-2">
                    <Checkbox 
                      id={day.id}
                      checked={localSelectedDays[day.id]}
                      onCheckedChange={() => handleDayToggle(day.id)}
                      className="h-3 w-3"
                    />
                  </div>
                  <span className={`text-sm font-medium ${localSelectedDays[day.id] ? 'text-blue-600' : 'text-gray-600'}`}>
                    {day.label}
                  </span>
                  <span className="text-[10px] mt-0.5 text-gray-500">
                    {day.fullName.substring(0, 3)}
                  </span>
                  {localSelectedDays[day.id] && (
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
            
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Optimal posting time</span>
              </div>
              <span className="text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 font-medium">
                9:00 - 11:00 AM
              </span>
            </div>
          </div>
          
          {calculateFrequency() > 0 && (
            <motion.div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-8 py-3 px-5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm shadow-md"
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
            variant="default"
            className="w-64 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl"
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
