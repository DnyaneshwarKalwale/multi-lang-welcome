import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { CheckCircle, Loader2, Share2, Twitter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export default function CompletionPage() {
  const navigate = useNavigate();
  const { nextStep, workspaceType, workspaceName, firstName, language, theme, postFormat, postFrequency } = useOnboarding();
  const { user, fetchUser } = useAuth();
  
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  
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
    // Always set this flag locally to ensure we can navigate to dashboard
    localStorage.setItem('onboardingCompleted', 'true');
    
    const markOnboardingComplete = async () => {
      if (user) {
        setIsMarkingComplete(true);
        try {
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
              timeout: 10000 // Set a reasonable timeout
            }
          );
          
          // Fetch updated user data
          await fetchUser();
          setIsMarkingComplete(false);
          // Clear any previous errors
          setError("");
        } catch (err) {
          console.error("Error marking onboarding as complete:", err);
          setError("Failed to update your profile. Your settings will still be saved locally.");
          setIsMarkingComplete(false);
        }
      }
    };
    
    markOnboardingComplete();
  }, [user, workspaceType, workspaceName, language, theme, postFormat, postFrequency, fetchUser, retryCount]);
  
  const handleGoToDashboard = () => {
    // Ensure the onboarding is marked as completed before going to dashboard
    localStorage.setItem('onboardingCompleted', 'true');
    navigate("/dashboard");
  };
  
  const handleRetry = () => {
    setError("");
    setRetryCount(prev => prev + 1);
  };
  
  const handleGenerateContent = () => {
    setIsGeneratingContent(true);
    
    // Simulate content generation (would connect to real API in production)
    setTimeout(() => {
      setIsGeneratingContent(false);
      navigate("/dashboard");
    }, 2000);
  };
  
  const handleUploadFiles = () => {
    setIsUploadingFiles(true);
    
    // Simulate file upload (would connect to real API in production)
    setTimeout(() => {
      setIsUploadingFiles(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
      </div>
      
      <motion.div 
        className="max-w-3xl w-full text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex flex-col items-center" variants={itemVariants}>
          <div className="p-2 mb-4 rounded-full bg-green-500/20 border border-green-500/30">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            Onboarding Complete!
            <span role="img" aria-label="celebration">🎉</span>
          </h1>
          <p className="text-gray-300 text-xl mt-4 max-w-xl mx-auto">
            Your setup is finished. Now let's make your Twitter content strategy easier with Scripe.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-6">What's next?</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-800/50 p-4 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <Twitter className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium mb-1">Generate your first Twitter content</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Let our AI create personalized Twitter content based on your preferences
                </p>
                <Button 
                  variant="gradient"
                  rounded="full" 
                  className="w-full md:w-auto"
                  onClick={handleGenerateContent}
                  disabled={isGeneratingContent}
                >
                  {isGeneratingContent ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : "Generate content"}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-800/50 p-4 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium mb-1">Connect your accounts</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Link your Twitter accounts to publish content directly
                </p>
                <Button 
                  variant="outline"
                  rounded="full" 
                  className="w-full md:w-auto"
                  onClick={handleUploadFiles}
                  disabled={isUploadingFiles}
                >
                  {isUploadingFiles ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : "Connect accounts"}
                </Button>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="mt-6 pt-6 border-t border-gray-800 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-400 mb-4">
              You can also set these up later from your dashboard
            </p>
          </motion.div>
        </motion.div>
      
        <motion.div variants={itemVariants} className="mt-6 flex justify-center w-full max-w-md mx-auto">
          <Button 
            onClick={handleGoToDashboard}
            variant="gradient"
            className="w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-center shadow-xl hover:shadow-indigo-500/25 transition-all duration-300"
          >
            Go to dashboard
          </Button>
        </motion.div>
      
        {isMarkingComplete && (
          <motion.div 
            className="text-sm text-gray-500 flex items-center justify-center mt-4"
            variants={itemVariants}
          >
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving your preferences...
          </motion.div>
        )}
      
        {error && (
          <motion.div 
            className="bg-red-900/30 border border-red-900 text-red-200 p-3 rounded-lg flex flex-col items-center mt-4 max-w-md mx-auto"
            variants={itemVariants}
          >
            <p className="mb-2">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry} 
              className="mt-2 text-white border-red-700 hover:bg-red-900/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 