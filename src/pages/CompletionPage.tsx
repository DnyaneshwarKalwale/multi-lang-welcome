import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { CheckCircle, Loader2, Share2, Twitter, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import confetti from 'canvas-confetti';

export default function CompletionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nextStep, workspaceType, workspaceName, firstName, language, theme, postFormat, postFrequency } = useOnboarding();
  const { user, fetchUser } = useAuth();
  
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [error, setError] = useState("");
  
  // Block returning to onboarding steps if onboarding is completed
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (location.pathname.includes('/onboarding/completion')) {
        e.preventDefault();
        e.returnValue = ''; // This is required for Chrome
      }
    };

    // Add event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location]);
  
  // Prevent back navigation after completion
  useEffect(() => {
    // When onboarding is completed, prevent going back to previous steps
    if (localStorage.getItem('onboardingCompleted') === 'true') {
      // Push current state to history to prevent direct back navigation
      window.history.pushState(null, '', window.location.href);
      
      const handlePopState = () => {
        // If user tries to go back, push current state again and redirect to dashboard
        window.history.pushState(null, '', window.location.href);
        navigate("/dashboard", { replace: true });
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [navigate]);
  
  // Trigger confetti effect on load
  useEffect(() => {
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    
    // Add a small delay to make sure the component is mounted
    const timer = setTimeout(() => {
      triggerConfetti();
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Mark onboarding as complete
  useEffect(() => {
    const markOnboardingComplete = async () => {
      if (user && !user.onboardingCompleted) {
        try {
          setIsMarkingComplete(true);
          
          // Make sure localStorage is updated first
          localStorage.setItem('onboardingCompleted', 'true');
          
          // Get API URL from env or fallback
          const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
          
          // Update the user's onboarding progress on the server
          await axios.post(
            `${baseApiUrl}/users/update-onboarding`, 
            {
              onboardingCompleted: true,
              workspaceType,
              workspaceName,
              language,
              theme,
              postFormat,
              postFrequency
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              // Add timeout to prevent hanging requests
              timeout: 10000
            }
          );
          
          // Fetch updated user data
          await fetchUser();
          setIsMarkingComplete(false);
        } catch (err) {
          console.error("Error marking onboarding as complete:", err);
          // Show error but don't block navigation
          setError("Failed to update your profile. You can try again from the dashboard.");
          setIsMarkingComplete(false);
          // Even if there's an error, set onboarding as completed in localStorage
          localStorage.setItem('onboardingCompleted', 'true');
        }
      }
    };
    
    markOnboardingComplete();
  }, [user, workspaceType, workspaceName, language, theme, postFormat, postFrequency, fetchUser]);
  
  const handleSkip = () => {
    // Ensure onboarding is marked as completed in localStorage regardless of API success
    localStorage.setItem('onboardingCompleted', 'true');
    navigate("/dashboard", { replace: true });
  };
  
  const handleGenerateContent = () => {
    setIsGeneratingContent(true);
    
    // Simulate content generation (would connect to real API in production)
    setTimeout(() => {
      setIsGeneratingContent(false);
      navigate("/dashboard", { replace: true });
    }, 2000);
  };
  
  const handleUploadFiles = () => {
    setIsUploadingFiles(true);
    
    // Simulate file upload (would connect to real API in production)
    setTimeout(() => {
      setIsUploadingFiles(false);
      navigate("/dashboard", { replace: true });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
      </div>
      
      {/* Particle effect */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-2 h-2 rounded-full bg-indigo-500"
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
      
      <motion.div 
        className="max-w-3xl w-full text-center space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex flex-col items-center" variants={itemVariants}>
          <motion.div 
            className="p-4 mb-6 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-500/40 shadow-lg shadow-green-500/10"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15,
              duration: 0.6
            }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold flex items-center justify-center gap-2 mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              Onboarding Complete!
            </span>
            <motion.span 
              role="img" 
              aria-label="celebration"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
            >
              🎉
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 text-xl mt-4 max-w-xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Your setup is finished. Now let's make your Twitter content strategy easier with Scripe.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 max-w-2xl mx-auto shadow-xl shadow-indigo-900/10"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <span>Next Steps</span>
          </h2>
          
          <div className="space-y-6">
            <motion.div 
              className="flex flex-col md:flex-row gap-4 items-center bg-gray-800/50 p-5 rounded-lg hover:bg-gray-800/70 transition-colors duration-300 border border-gray-700/50"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <Twitter className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-lg mb-1">Generate your first Twitter content</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Let our AI create personalized Twitter content based on your preferences
                </p>
                <Button 
                  variant="gradient" 
                  className="w-full md:w-auto rounded-full font-medium shadow-lg shadow-indigo-600/10 gap-2"
                  onClick={handleGenerateContent}
                  disabled={isGeneratingContent}
                >
                  {isGeneratingContent ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate content
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col md:flex-row gap-4 items-center bg-gray-800/50 p-5 rounded-lg hover:bg-gray-800/70 transition-colors duration-300 border border-gray-700/50"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <Share2 className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-lg mb-1">Connect your accounts</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Link your Twitter accounts to publish content directly
                </p>
                <Button 
                  variant="outline"
                  className="w-full md:w-auto rounded-full font-medium border-indigo-600/30 gap-2"
                  onClick={handleUploadFiles}
                  disabled={isUploadingFiles}
                >
                  {isUploadingFiles ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Twitter className="w-4 h-4" />
                      Connect accounts
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button 
            onClick={handleSkip}
            className="w-full md:w-auto group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg shadow-indigo-500/25"
          >
            Go to dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </motion.div>
        
        {isMarkingComplete && (
          <motion.div 
            className="text-sm text-gray-400 flex items-center justify-center mt-4"
            variants={itemVariants}
          >
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving your preferences...
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            className="bg-red-900/30 border border-red-900 text-red-200 p-3 rounded-lg"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 