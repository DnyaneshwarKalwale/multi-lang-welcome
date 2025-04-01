import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { ArrowLeft, ChevronRight, Palette, Check, Moon, Sun } from "lucide-react";

export default function ThemeSelectionPage() {
  const navigate = useNavigate();
  const { nextStep, prevStep, theme, setTheme, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  const themes = [
    {
      id: "dark",
      name: "Dark Mode",
      description: "A sleek dark interface that's easy on the eyes and perfect for nighttime use",
      icon: <Moon className="w-8 h-8 text-indigo-400" />,
      fallbackBg: "bg-gradient-to-br from-gray-800 to-gray-900",
      textColor: "text-white"
    },
    {
      id: "light",
      name: "Light Mode",
      description: "A clean, bright interface with excellent readability in daylight",
      icon: <Sun className="w-8 h-8 text-amber-400" />,
      fallbackBg: "bg-gradient-to-br from-gray-100 to-white",
      textColor: "text-gray-900"
    }
  ];

  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/post-format");
  };

  const handlePrev = () => {
    prevStep();
    navigate("/onboarding/language-selection");
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
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px] animate-pulse-slow animation-delay-2000"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 rounded-full bg-indigo-500"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.3,
              scale: Math.random() * 2 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.3, 0.8, 0.3],
              scale: [null, Math.random() + 0.5]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
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
        className="max-w-4xl w-full text-center relative z-10"
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
          <motion.div 
            className="p-2 rounded-full bg-gradient-to-br from-indigo-600/30 to-indigo-900/30 border border-indigo-500/40"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Palette className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Choose your theme</h1>
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Select your preferred visual style for the Scripe platform
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {themes.map((themeOption) => (
            <motion.div
              key={themeOption.id}
              className={`relative overflow-hidden bg-gray-900/50 backdrop-blur-sm border-2 ${
                theme === themeOption.id ? "border-indigo-500" : "border-gray-800"
              } rounded-xl cursor-pointer hover:border-indigo-500/60 transition-all duration-300 py-8 px-6`}
              onClick={() => setTheme(themeOption.id)}
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.3)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {theme === themeOption.id && (
                <motion.div 
                  className="absolute inset-0 bg-indigo-600/10 z-10 pointer-events-none" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              {theme === themeOption.id && (
                <motion.div 
                  className="absolute top-3 right-3 bg-indigo-600 w-7 h-7 flex items-center justify-center rounded-full z-20 shadow-lg shadow-indigo-600/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 200 }}
                >
                  <Check size={14} className="text-white" />
                </motion.div>
              )}
              
              <div className="flex flex-col items-center justify-center text-center">
                <div className={`w-20 h-20 ${themeOption.id === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-full mb-6 flex items-center justify-center shadow-lg ${themeOption.id === 'light' ? 'shadow-white/20' : 'shadow-indigo-500/20'}`}>
                  {themeOption.icon}
                </div>
                
                <h3 className={`text-xl font-medium mb-3 ${themeOption.textColor}`}>{themeOption.name}</h3>
                <p className="text-gray-400 text-sm max-w-[250px] mx-auto">{themeOption.description}</p>
              </div>

              {/* Preview */}
              <div className="mt-6 w-full h-24 overflow-hidden rounded-lg border border-gray-700">
                <div className={`w-full h-full ${themeOption.id === 'dark' ? 'bg-gray-900' : 'bg-white'} p-3 flex flex-col`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${themeOption.id === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-2 w-24 rounded-full ${themeOption.id === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className={`h-2 w-full rounded-full ${themeOption.id === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} mb-1.5`}></div>
                  <div className={`h-2 w-4/5 rounded-full ${themeOption.id === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
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
          />
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
