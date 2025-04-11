import { useState } from "react";
import { ArrowRight, X, Plus, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { motion } from "framer-motion";
import { LovableLogo } from "@/components/LovableLogo";

export default function InspirationProfilesPage() {
  const { 
    nextStep, 
    prevStep, 
    inspirationProfiles, 
    addInspirationProfile, 
    removeInspirationProfile,
    getStepProgress 
  } = useOnboarding();
  
  const [inputValue, setInputValue] = useState("");
  const { current, total } = getStepProgress();

  const handleAddProfile = () => {
    if (inputValue.trim()) {
      addInspirationProfile(inputValue.trim());
      setInputValue("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addInspirationProfile(inputValue.trim());
      setInputValue("");
    }
    nextStep();
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 50 } 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-b from-white via-blue-50/20 to-white text-gray-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-50 opacity-80 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 opacity-60 blur-[120px]"></div>
      </div>
      
      <motion.div 
        className="max-w-xl w-full mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <LovableLogo variant="icon" size="lg" className="w-20 h-20 text-primary" />
            <Linkedin className="absolute bottom-0 right-0 text-[#0077B5] bg-white p-1 rounded-full shadow-md" size={26} />
          </div>
        </div>
        
        <motion.h1 
          className="text-3xl font-bold text-center mb-3 text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Which LinkedIn profiles inspire you?
        </motion.h1>
        
        <motion.p 
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Add LinkedIn profiles whose content style you'd like to emulate for better recommendations
        </motion.p>
        
        <motion.div 
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.form onSubmit={handleSubmit} className="space-y-6" variants={item}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="https://linkedin.com/in/username"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-200 focus:border-primary focus:ring-primary shadow-sm pr-3"
                />
                <Linkedin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              <Button 
                type="button" 
                onClick={handleAddProfile}
                className="h-12 shrink-0 bg-primary hover:bg-primary-600"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {inspirationProfiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Added profiles:</p>
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                  {inspirationProfiles.map((profile, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded px-4 py-3 border border-gray-200">
                      <span className="text-sm text-gray-700 truncate flex-1">{profile}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeInspirationProfile(index)}
                        className="h-7 w-7 rounded-full p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Pro tip:</span> Adding at least 3 profiles will help us generate better content recommendations for you
              </p>
            </div>
          </motion.form>
        </motion.div>
        
        <motion.div 
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <BackButton 
            onClick={prevStep} 
            variant="subtle" 
            className="px-8"
          />
          
          <Button 
            onClick={handleSubmit} 
            className="bg-primary hover:bg-primary-600 text-white px-8 py-6 text-base rounded-full shadow-md"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col items-center mt-8"
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
} 