import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { ArrowLeft, ChevronRight, Palette } from "lucide-react";

export default function ThemeSelectionPage() {
  const navigate = useNavigate();
  const { nextStep, prevStep, theme, setTheme, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  const themes = [
    {
      id: "minimal",
      name: "Minimal",
      description: "A clean, distraction-free experience with focused content presentation",
      preview: "/images/theme-minimal.png",
      fallbackBg: "bg-gradient-to-br from-gray-800 to-gray-900",
      textColor: "text-white"
    },
    {
      id: "modern",
      name: "Modern",
      description: "Bold typography and layouts optimized for engagement",
      preview: "/images/theme-modern.png",
      fallbackBg: "bg-gradient-to-br from-indigo-800 to-purple-900",
      textColor: "text-white"
    },
    {
      id: "vibrant",
      name: "Vibrant",
      description: "Eye-catching colors and dynamic elements that stand out",
      preview: "/images/theme-vibrant.png",
      fallbackBg: "bg-gradient-to-br from-blue-600 to-purple-600",
      textColor: "text-white"
    },
    {
      id: "professional",
      name: "Professional",
      description: "Sophisticated design elements for business-focused content",
      preview: "/images/theme-professional.png",
      fallbackBg: "bg-gradient-to-br from-slate-700 to-slate-900",
      textColor: "text-white"
    }
  ];

  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/post-format");
  };

  const handlePrev = () => {
    prevStep();
    navigate("/onboarding/team-selection");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
      </div>
      
      {/* Back button */}
      <motion.button
        className="absolute top-10 left-10 flex items-center text-gray-400 hover:text-white transition-colors"
        onClick={handlePrev}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </motion.button>
      
      <motion.div 
        className="max-w-4xl w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScripeIconRounded className="w-20 h-20" />
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Palette className="w-7 h-7 text-indigo-400" />
          <h1 className="text-4xl font-bold">Choose your theme</h1>
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Select a visual style for your Twitter content that matches your brand and personality
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {themes.map((themeOption) => (
            <motion.div
              key={themeOption.id}
              className={`relative overflow-hidden bg-gray-900/50 backdrop-blur-sm border-2 ${
                theme === themeOption.id ? "border-indigo-500" : "border-gray-800"
              } rounded-xl cursor-pointer hover:border-indigo-500/60 transition-all duration-300 hover-lift`}
              onClick={() => setTheme(themeOption.id)}
              variants={itemVariants}
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                <div className={`w-full h-full flex items-center justify-center ${themeOption.fallbackBg}`}>
                  <img 
                    src={themeOption.preview} 
                    alt={themeOption.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide the image if it fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Twitter UI mockup if image fails to load */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`${theme === themeOption.id ? 'opacity-100' : 'opacity-0'} absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center transition-opacity duration-200 z-10`}>
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 text-left">
                <h3 className={`text-lg font-medium mb-1 ${themeOption.textColor}`}>{themeOption.name}</h3>
                <p className="text-gray-400 text-sm">{themeOption.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ContinueButton 
            onClick={handleContinue}
            disabled={!theme}
            className={`group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 ${
              !theme ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>Continue</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </ContinueButton>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <ProgressDots total={total} current={current} />
        </motion.div>
      </motion.div>
    </div>
  );
}
