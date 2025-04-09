
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { LinkedPulseLogotype } from "@/components/LinkedPulseIcon";
import { CheckCircle, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function LinkedCompletionPage() {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  // Update step
  useEffect(() => {
    setCurrentStep("completion");
  }, [setCurrentStep]);

  // Launch confetti effect when page loads
  useEffect(() => {
    const launchConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0077b5', '#0098d3', '#00a0dc', '#004c75']
      });
    };
    
    // Launch initial confetti
    launchConfetti();
    
    // Launch more confetti after a delay
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0077b5', '#0098d3', '#00a0dc', '#004c75']
      });
      
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0077b5', '#0098d3', '#00a0dc', '#004c75']
      });
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <div className="container mx-auto max-w-3xl flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          className="mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-linkedin-blue rounded-full blur-xl opacity-30 animate-pulse-slow"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-full p-4 border border-linkedin-blue/20">
              <CheckCircle className="h-16 w-16 text-linkedin-blue" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <LinkedPulseLogotype className="h-14 mx-auto mb-8" />
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-linkedin-blue to-blue-400">
            Setup Complete!
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            Your LinkedIn content generator is ready to go. You're all set to create engaging professional content.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 mb-8">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">
              What's next?
            </h3>
            
            <ul className="space-y-4">
              {[
                "Create your first LinkedIn post using AI-powered templates",
                "Schedule content for the optimal posting times",
                "Analyze engagement metrics to improve your strategy",
                "Connect with more accounts to expand your reach"
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="bg-linkedin-blue/10 rounded-full p-1 mr-3 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-linkedin-blue" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleComplete}
              className="bg-linkedin-blue hover:bg-linkedin-darkBlue text-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 flex items-center group"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
