import React from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { ArrowLeft, ChevronRight, LayoutTemplate, Twitter } from "lucide-react";

export default function PostFormatPage() {
  const navigate = useNavigate();
  const { nextStep, prevStep, postFormat, setPostFormat, getStepProgress } = useOnboarding();
  const { t } = useLanguage();
  const { current, total } = getStepProgress();

  const formats = [
    {
      id: "thread",
      name: "Twitter Threads",
      description: "Multi-part threads that dive deep into a topic with 5-10 tweets",
      icon: (
        <div className="flex flex-col space-y-1.5">
          <div className="w-full h-2 bg-indigo-500/30 rounded-full"></div>
          <div className="w-4/5 h-2 bg-indigo-500/30 rounded-full"></div>
          <div className="w-full h-2 bg-indigo-500/30 rounded-full"></div>
          <div className="w-3/5 h-2 bg-indigo-500/30 rounded-full"></div>
        </div>
      )
    },
    {
      id: "single",
      name: "Single Tweets",
      description: "Concise, high-impact standalone tweets optimized for engagement",
      icon: (
        <div className="flex flex-col">
          <div className="w-full h-3 bg-indigo-500/30 rounded-full"></div>
          <div className="w-4/5 h-3 bg-indigo-500/30 rounded-full mt-1"></div>
        </div>
      )
    },
    {
      id: "mixed",
      name: "Mixed Formats",
      description: "Variety of formats including threads, standalone tweets, and polls",
      icon: (
        <div className="flex flex-col space-y-1.5">
          <div className="w-full h-2 bg-indigo-500/30 rounded-full"></div>
          <div className="flex space-x-1">
            <div className="w-1/3 h-2 bg-indigo-500/30 rounded-full"></div>
            <div className="w-1/3 h-2 bg-indigo-500/30 rounded-full"></div>
            <div className="w-1/3 h-2 bg-indigo-500/30 rounded-full"></div>
          </div>
          <div className="w-4/5 h-2 bg-indigo-500/30 rounded-full"></div>
        </div>
      )
    },
    {
      id: "visual",
      name: "Visual Tweets",
      description: "Image and video-focused content with minimal text for visual impact",
      icon: (
        <div className="flex flex-col space-y-1.5">
          <div className="w-full h-8 bg-indigo-500/30 rounded"></div>
          <div className="w-3/5 h-2 bg-indigo-500/30 rounded-full"></div>
        </div>
      )
    }
  ];

  const handleContinue = () => {
    nextStep();
    navigate("/onboarding/post-frequency");
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
        {t('back')}
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
          <LayoutTemplate className="w-7 h-7 text-indigo-400" />
          <h1 className="text-4xl font-bold">{t('formatTitle')}</h1>
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {t('formatDescription')}
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {formats.map((format) => (
            <motion.div
              key={format.id}
              className={`bg-gray-900/50 backdrop-blur-sm border-2 ${
                postFormat === format.id ? "border-indigo-500" : "border-gray-800"
              } rounded-xl p-6 cursor-pointer hover:border-indigo-500/60 transition-all duration-300 hover-lift`}
              onClick={() => setPostFormat(format.id)}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center p-3">
                  {format.icon}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  postFormat === format.id ? "border-indigo-500 bg-indigo-500" : "border-gray-600"
                } flex items-center justify-center transition-all duration-200`}>
                  {postFormat === format.id && (
                    <motion.div 
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium mb-2">{format.name}</h3>
                <p className="text-gray-400 text-sm">{format.description}</p>
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
            disabled={!postFormat}
            className={`group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 ${
              !postFormat ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>{t('continue')}</span>
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
        
        {/* Twitter connection info */}
        <motion.div
          className="mt-12 flex items-center justify-center max-w-2xl mx-auto p-4 border border-indigo-800/30 rounded-lg bg-indigo-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Twitter className="flex-shrink-0 w-5 h-5 mr-3 text-indigo-400" />
          <p className="text-indigo-300 text-sm">
            {t('formatDescription')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
