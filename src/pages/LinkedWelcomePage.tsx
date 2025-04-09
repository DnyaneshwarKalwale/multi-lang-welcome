
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { LinkedPulseLogotype, LinkedPulseIconRounded } from "@/components/LinkedPulseIcon";
import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, CheckCircle } from "lucide-react";

const staggerDelay = 0.1;

export default function LinkedWelcomePage() {
  const { nextStep, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Ensure we're on the correct step
    setCurrentStep("welcome");
  }, [setCurrentStep]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 bg-linkedin-pattern">
      <div className="container max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <LinkedPulseLogotype className="h-14 sm:h-16" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-linkedin-blue to-linkedin-lightBlue bg-clip-text text-transparent mb-4"
          >
            Welcome to LinkedPulse
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Your AI-powered LinkedIn content generator. Let's set up your profile to create engaging and professional content tailored to your audience.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 md:p-8 w-full max-w-3xl mx-auto mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Linkedin className="mr-2 h-5 w-5 text-linkedin-blue" />
            What LinkedPulse can do for you
          </h2>
          
          <ul className="space-y-4">
            {[
              "Generate professional LinkedIn posts tailored to your industry",
              "Schedule content based on optimal engagement times",
              "Analyze post performance and optimize content strategy",
              "Connect directly to your LinkedIn account for seamless posting",
              "Learn from top performers in your industry"
            ].map((benefit, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (index * staggerDelay) }}
                className="flex items-start"
              >
                <CheckCircle className="h-5 w-5 text-linkedin-blue mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800 dark:text-gray-200">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="default"
            size="lg"
            onClick={nextStep}
            className="bg-linkedin-blue hover:bg-linkedin-darkBlue text-white font-medium px-8 py-2.5 rounded-full transition-all duration-300 flex items-center justify-center group"
          >
            <span>Get Started</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm"
      >
        <p>© {new Date().getFullYear()} LinkedPulse. All rights reserved.</p>
      </motion.div>
    </div>
  );
}
