
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, Check, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

type Day = {
  id: keyof typeof daysLabel;
  label: string;
  shortLabel: string;
};

const daysLabel = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const daysOfWeek: Day[] = [
  { id: "monday", label: "Monday", shortLabel: "Mon" },
  { id: "tuesday", label: "Tuesday", shortLabel: "Tue" },
  { id: "wednesday", label: "Wednesday", shortLabel: "Wed" },
  { id: "thursday", label: "Thursday", shortLabel: "Thu" },
  { id: "friday", label: "Friday", shortLabel: "Fri" },
  { id: "saturday", label: "Saturday", shortLabel: "Sat" },
  { id: "sunday", label: "Sunday", shortLabel: "Sun" },
];

const frequencyPresets = [
  { id: "daily", label: "Daily", days: 7, description: "Post every day for maximum visibility" },
  { id: "weekdays", label: "Weekdays Only", days: 5, description: "Post Monday through Friday for a professional schedule" },
  { id: "moderate", label: "Moderate", days: 3, description: "Post 3 times per week for regular engagement" },
  { id: "minimal", label: "Minimal", days: 1, description: "Post once per week for focused quality" },
  { id: "custom", label: "Custom", days: 0, description: "Set your own custom posting schedule" },
];

export default function LinkedPostFrequencyPage() {
  const { nextStep, prevStep, selectedDays, setSelectedDays } = useOnboarding();
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Count how many days are selected
  const selectedCount = Object.values(selectedDays).filter(Boolean).length;
  
  // Set the initial preset based on selected days
  useEffect(() => {
    if (selectedCount === 0) {
      setActivePreset("moderate");
      applyPreset("moderate");
    } else if (selectedCount === 7) {
      setActivePreset("daily");
    } else if (
      selectedDays.monday && 
      selectedDays.tuesday && 
      selectedDays.wednesday && 
      selectedDays.thursday && 
      selectedDays.friday && 
      !selectedDays.saturday && 
      !selectedDays.sunday
    ) {
      setActivePreset("weekdays");
    } else if (selectedCount === 3) {
      setActivePreset("moderate");
    } else if (selectedCount === 1) {
      setActivePreset("minimal");
    } else {
      setActivePreset("custom");
    }
  }, []); // Only run once on mount

  const applyPreset = (presetId: string) => {
    // Reset all days
    const newSelectedDays = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };
    
    // Apply the preset
    switch(presetId) {
      case "daily":
        daysOfWeek.forEach(day => {
          newSelectedDays[day.id] = true;
        });
        break;
      case "weekdays":
        newSelectedDays.monday = true;
        newSelectedDays.tuesday = true;
        newSelectedDays.wednesday = true;
        newSelectedDays.thursday = true;
        newSelectedDays.friday = true;
        break;
      case "moderate":
        newSelectedDays.monday = true;
        newSelectedDays.wednesday = true;
        newSelectedDays.friday = true;
        break;
      case "minimal":
        newSelectedDays.tuesday = true;
        break;
      case "custom":
        // Don't override current selection for custom
        return;
    }
    
    setSelectedDays(newSelectedDays);
    setActivePreset(presetId);
  };

  const toggleDay = (day: keyof typeof daysLabel) => {
    const newSelectedDays = { ...selectedDays, [day]: !selectedDays[day] };
    setSelectedDays(newSelectedDays);
    
    // When manually changing days, update preset to "custom"
    setActivePreset("custom");
  };

  const handleNext = () => {
    // Check if at least one day is selected
    if (Object.values(selectedDays).some(selected => selected)) {
      nextStep();
    } else {
      toast({
        title: "Select posting days",
        description: "Please select at least one day for posting your content.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <div className="container mx-auto max-w-3xl flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Posting Schedule
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Select how frequently you want to post on LinkedIn
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-900 shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-linkedin-blue mr-2" />
                <h3 className="text-lg font-semibold">Select Posting Frequency</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-1 p-0 h-5 w-5">
                        <Info className="h-4 w-4 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs text-sm">
                        Regular posting helps build your audience. We recommend 3-5 posts per week for optimal growth.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {frequencyPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`flex items-center p-4 rounded-lg border transition-all ${
                      activePreset === preset.id 
                        ? 'border-linkedin-blue bg-linkedin-blue/5 dark:bg-linkedin-blue/10' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-900 dark:text-white">{preset.label}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{preset.description}</p>
                    </div>
                    {preset.id !== "custom" && (
                      <div className="ml-4 text-lg font-semibold text-linkedin-blue">
                        {preset.days}x
                      </div>
                    )}
                    {activePreset === preset.id && (
                      <div className="ml-2">
                        <Check className="h-5 w-5 text-linkedin-blue" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-linkedin-blue" />
                  Select specific days:
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
                  {daysOfWeek.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={selectedDays[day.id]}
                        onCheckedChange={() => toggleDay(day.id)}
                        className="data-[state=checked]:bg-linkedin-blue data-[state=checked]:border-linkedin-blue"
                      />
                      <Label 
                        htmlFor={day.id}
                        className="cursor-pointer select-none"
                      >
                        <span className="hidden sm:inline">{day.label}</span>
                        <span className="inline sm:hidden">{day.shortLabel}</span>
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  You've selected {selectedCount} {selectedCount === 1 ? 'day' : 'days'} for posting.
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between"
        >
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          
          <Button 
            onClick={handleNext} 
            className="bg-linkedin-blue hover:bg-linkedin-darkBlue text-white flex items-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
