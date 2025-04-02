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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50 text-gray-900">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-10 flex justify-center">
          <ScripeIcon size={100} />
        </div>
        
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          {t('welcomeTitle')}
        </h1>
        
        <div>
          <p className="text-xl text-gray-600 mb-2">
            {t('welcomeSubtitle')}
          </p>
          <p className="text-xl text-gray-600 mb-8">
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
              className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 h-12 text-lg"
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
          <div className="bg-white shadow p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Twitter className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI-Powered Twitter Content</h3>
            <p className="text-gray-600 text-sm">Generate high-quality Twitter posts based on your unique voice and audience preferences.</p>
          </div>
          
          <div className="bg-white shadow p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Twitter Analytics</h3>
            <p className="text-gray-600 text-sm">Track performance metrics and optimize your Twitter strategy with detailed engagement insights.</p>
          </div>
          
          <div className="bg-white shadow p-6 rounded-xl border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span className="text-2xl">⏱️</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Save Time</h3>
            <p className="text-gray-600 text-sm">Create weeks of Twitter content in minutes and schedule posts for optimal engagement times.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
