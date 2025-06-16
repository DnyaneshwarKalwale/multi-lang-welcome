import React from "react";
import { useNavigate } from "react-router-dom";
import { BrandOutIcon, BrandOutLogotype } from "@/components/BrandOutIcon";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Youtube, Linkedin, FileText, Layout, Image } from "lucide-react";

export default function WelcomePage() {
  const { nextStep, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setCurrentStep("personal-info");
    navigate("/onboarding/personal-info");
  };

  // Floating icons animation
  const floatingIcons = [
    { icon: <Linkedin size={32} />, delay: 0 },
    { icon: <Youtube size={32} />, delay: 0.2 },
    { icon: <FileText size={32} />, delay: 0.4 },
    { icon: <Layout size={32} />, delay: 0.6 },
    { icon: <Image size={32} />, delay: 0.8 }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      {/* Background with simple blue gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary/5"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-primary/20"
            initial={{ y: "100vh", x: Math.random() * 100 - 50 }}
            animate={{ 
              y: "-100vh",
              x: Math.random() * 100 - 50,
              rotate: [0, 360]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              delay: item.delay,
              ease: "linear"
            }}
            style={{
              left: `${(index + 1) * 20}%`,
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="max-w-3xl w-full text-center relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div 
          className="mb-10 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <BrandOutLogotype className="h-12 w-auto" />
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-bold mb-6 text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Welcome to BrandOut
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-xl mb-2 font-medium">
            Transform Your LinkedIn Presence with AI-Powered Content
          </p>
          <p className="text-xl mb-8 font-medium">
            Create, Schedule, and Grow Your Professional Brand
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center justify-center mb-12 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Button 
            onClick={handleGetStarted} 
            className="w-full py-6 px-8 text-lg font-bold mb-4 flex items-center justify-center gap-2 group bg-primary hover:bg-primary/90 text-white rounded-full"
          >
            <span>Get started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
        
        {/* Modern Content Preview Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* LinkedIn Post Preview */}
        <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Linkedin className="text-primary" size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">LinkedIn Posts</h3>
                <p className="text-gray-600 text-sm">Professional content that engages</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-800 text-left">Create compelling LinkedIn posts that drive engagement and establish thought leadership.</p>
            </div>
          </motion.div>
          
          {/* Carousel Preview */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Layout className="text-primary" size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Carousel Posts</h3>
                <p className="text-gray-600 text-sm">Visual storytelling made easy</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-800 text-left">Design beautiful carousel posts that educate and inspire your professional network.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
