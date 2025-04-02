import React from "react";
import { ScripeIcon } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ChevronRight, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const { nextStep } = useOnboarding();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    nextStep();
    navigate("/onboarding/team-selection");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-10 flex justify-center">
          <ScripeIcon size={100} />
        </div>
        
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          {t('welcomeTitle')}
        </h1>
        
        <div>
          <p className="text-xl text-gray-300 mb-2">
            {t('welcomeSubtitle')}
          </p>
          <p className="text-xl text-gray-300 mb-8">
            {t('welcomeDescription')}
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleGetStarted}
              variant="default"
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 h-12 text-lg"
            >
              <span>{t('getStarted')}</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
        
        <div>
          <ProgressDots total={8} current={0} />
        </div>
        
        {/* Features highlight */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
              <Twitter className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">AI-Powered Twitter Content</h3>
            <p className="text-gray-400 text-sm">Generate high-quality Twitter posts based on your unique voice and audience preferences.</p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">Twitter Analytics</h3>
            <p className="text-gray-400 text-sm">Track performance metrics and optimize your Twitter strategy with detailed engagement insights.</p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⏱️</span>
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">Save Time</h3>
            <p className="text-gray-400 text-sm">Create weeks of Twitter content in minutes and schedule posts for optimal engagement times.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
