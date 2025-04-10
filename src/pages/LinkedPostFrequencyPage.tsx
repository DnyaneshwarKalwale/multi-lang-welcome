
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function LinkedPostFrequencyPage() {
  const navigate = useNavigate();
  const { nextStep, selectedDays, setSelectedDays, postFrequency, setPostFrequency } = useOnboarding();
  const [localSelectedDays, setLocalSelectedDays] = useState<Record<string, boolean>>({
    monday: selectedDays?.monday || false,
    tuesday: selectedDays?.tuesday || false,
    wednesday: selectedDays?.wednesday || false,
    thursday: selectedDays?.thursday || false,
    friday: selectedDays?.friday || false,
    saturday: selectedDays?.saturday || false,
    sunday: selectedDays?.sunday || false,
  });

  // Calculate frequency based on selected days
  const calculateFrequency = (): number => {
    return Object.values(localSelectedDays).filter(Boolean).length;
  };

  useEffect(() => {
    // Update onboarding context when local state changes
    setSelectedDays(localSelectedDays);
    
    const newFrequency = calculateFrequency() as 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
    setPostFrequency(newFrequency || null);
  }, [localSelectedDays, setSelectedDays, setPostFrequency]);

  const handleDayToggle = (dayId: string) => {
    setLocalSelectedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const handleContinue = () => {
    if (calculateFrequency() === 0) {
      toast.error("Please select at least one day before continuing");
      return;
    }
    
    nextStep();
    navigate("/onboarding/extension");
  };

  const daysOfWeek = [
    { id: 'monday', label: 'M', fullName: 'Monday' },
    { id: 'tuesday', label: 'T', fullName: 'Tuesday' },
    { id: 'wednesday', label: 'W', fullName: 'Wednesday' },
    { id: 'thursday', label: 'T', fullName: 'Thursday' },
    { id: 'friday', label: 'F', fullName: 'Friday' },
    { id: 'saturday', label: 'S', fullName: 'Saturday' },
    { id: 'sunday', label: 'S', fullName: 'Sunday' }
  ];

  return (
    <div className="max-w-lg mx-auto p-6 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Calendar className="h-12 w-12 mx-auto mb-4 text-linkedin-blue" />
        <h1 className="text-2xl font-bold mb-2">Set Your Posting Schedule</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose which days you want to post content to LinkedIn. We recommend 3-5 days per week.
        </p>
      </motion.div>

      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-medium mb-6 flex items-center">
          <span className="text-linkedin-blue mr-2">●</span> 
          Posting Days
        </h2>
        
        <div className="grid grid-cols-7 gap-2 mb-6">
          {daysOfWeek.map((day) => (
            <div 
              key={day.id}
              onClick={() => handleDayToggle(day.id)}
              className={`
                relative h-16 flex flex-col items-center justify-center rounded-md cursor-pointer transition-all
                ${localSelectedDays[day.id] 
                  ? 'bg-linkedin-50 border border-linkedin-300 dark:bg-linkedin-900/20 dark:border-linkedin-700/50' 
                  : 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'}
              `}
            >
              <div className="absolute top-2 left-2">
                <Checkbox 
                  id={day.id}
                  checked={localSelectedDays[day.id]}
                  onCheckedChange={() => handleDayToggle(day.id)}
                  className="h-3 w-3"
                />
              </div>
              <span className={`text-base font-medium ${localSelectedDays[day.id] ? 'text-linkedin-600 dark:text-linkedin-400' : 'text-gray-800 dark:text-gray-300'}`}>
                {day.label}
              </span>
              <span className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
                {day.fullName.substring(0, 3)}
              </span>
            </div>
          ))}
        </div>

        {calculateFrequency() > 0 && (
          <div className="flex items-center justify-between bg-linkedin-50 dark:bg-linkedin-900/20 p-4 rounded-lg">
            <span className="font-medium">Selected:</span>
            <span className="text-linkedin-600 dark:text-linkedin-400 font-medium">
              {calculateFrequency() === 1 
                ? '1 day per week' 
                : `${calculateFrequency()} days per week`}
            </span>
          </div>
        )}

        <div className="mt-6 flex items-start text-sm bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
          <Info className="w-5 h-5 mr-2 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-800 dark:text-amber-300">
            On your selected days, we'll generate a high-quality post for your review. You can edit and schedule it for the optimal time.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button 
          onClick={handleContinue}
          disabled={calculateFrequency() === 0}
          className="bg-linkedin-600 hover:bg-linkedin-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
