import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { ArrowLeft, ChevronRight, Palette, Check } from "lucide-react";

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
              } rounded-xl cursor-pointer hover:border-indigo-500/60 transition-all duration-300`}
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
              
              <div className="aspect-[16/9] w-full overflow-hidden">
                <div className={`w-full h-full flex items-center justify-center ${themeOption.fallbackBg}`}>
                  <motion.img 
                    src={themeOption.preview} 
                    alt={themeOption.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                      // Hide the image if it fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Twitter UI mockup if image fails to load */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div 
                      className="w-3/4 h-3/4 bg-gray-800/90 rounded-lg flex flex-col p-4 overflow-hidden"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-900/50"></div>
                        <div className="ml-2">
                          <div className="h-3 w-24 bg-gray-700 rounded"></div>
                          <div className="h-2 w-16 bg-gray-700/70 rounded mt-1"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-gray-700 rounded"></div>
                        <div className="h-2 w-5/6 bg-gray-700 rounded"></div>
                        <div className="h-2 w-4/6 bg-gray-700 rounded"></div>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div className="h-2 w-8 bg-indigo-700/50 rounded"></div>
                        <div className="h-2 w-8 bg-indigo-700/50 rounded"></div>
                        <div className="h-2 w-8 bg-indigo-700/50 rounded"></div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <div className="p-5 text-left">
                <h3 className={`text-lg font-medium mb-1 ${themeOption.textColor}`}>{themeOption.name}</h3>
                <p className="text-gray-400 text-sm">{themeOption.description}</p>
              </div>
              
              {/* Theme color indicators */}
              <div className="absolute bottom-3 right-3 flex space-x-1">
                {['bg-indigo-500', 'bg-purple-500', 'bg-blue-500'].map((color, i) => (
                  <motion.div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${color}`}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: theme === themeOption.id ? 1 : 0.8, opacity: theme === themeOption.id ? 1 : 0.5 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
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
