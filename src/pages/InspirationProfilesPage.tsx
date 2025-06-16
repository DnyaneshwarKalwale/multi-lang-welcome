import { useState } from "react";
import { ArrowRight, X, Plus, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { BrandOutLogotype } from "@/components/BrandOutIcon";

export default function InspirationProfilesPage() {
  const { 
    nextStep, 
    inspirationProfiles, 
    addInspirationProfile, 
    removeInspirationProfile
  } = useOnboarding();
  
  const [inputValue, setInputValue] = useState("");

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
          Which LinkedIn profiles inspire you?
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          Add LinkedIn profiles whose content style you'd like to emulate for better recommendations
        </p>
        
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
                className="h-12 shrink-0 bg-primary hover:bg-primary/90"
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
        
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleSubmit} 
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