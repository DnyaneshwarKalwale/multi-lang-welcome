import React, { useState, useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { CheckCircle, Calendar, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { BrandOutLogotype } from "@/components/BrandOutIcon";
import { Button } from "@/components/ui/button";

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
  const { nextStep, selectedDays: contextSelectedDays, setSelectedDays } = useOnboarding();
  
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
  
  // Auto-select Thursday when component mounts
  useEffect(() => {
    if (!Object.values(localSelectedDays).some(Boolean)) {
      setLocalSelectedDays(prev => ({
        ...prev,
        thu: true
      }));
    }
  }, []);
  
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      {/* Background with simple blue gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary/5"></div>
      </div>
      
      <div className="max-w-xl w-full mb-8">
        <div className="mb-10 flex justify-center">
          <BrandOutLogotype className="h-12 w-auto" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-3 text-gray-900">
          When do you want to post?
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          Select specific days of the week when you'd like to post. We recommend 3-5 days per week for optimal engagement.
        </p>
        
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <Calendar className="text-primary mr-3" size={24} />
            <h3 className="text-xl font-bold text-gray-900">Choose Your Tweet Days</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {daysOfWeek.map((day) => (
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
          
          <div className="flex items-center justify-between">
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
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block py-2 px-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong className="mr-1">Selected:</strong> 
              {calculateFrequency() === 1 ? 'One day per week' : `${calculateFrequency()} days per week`}
            </span>
          </motion.div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={calculateFrequency() === 0}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base rounded-full shadow-md w-full max-w-md flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
