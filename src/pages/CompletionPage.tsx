import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { CheckCircle, Loader2, Share2, Twitter, RefreshCw, ChevronRight, CloudIcon, Globe, FileEdit, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export default function CompletionPage() {
  const navigate = useNavigate();
  const { nextStep, workspaceType, workspaceName, firstName, postFormat, postFrequency } = useOnboarding();
  const { user, fetchUser } = useAuth();
  
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);
  const [contentGenerated, setContentGenerated] = useState(false);
  const [accountsConnected, setAccountsConnected] = useState(false);
  
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
  
  // No longer automatically mark onboarding as complete when component mounts
  useEffect(() => {
    // This is now empty as we don't want automatic redirection
    // We'll only mark onboarding complete when user clicks the dashboard button
  }, []);

  const markOnboardingComplete = async () => {
    if (!user) {
      return;
    }
    
    setIsMarkingComplete(true);
    
    try {
      // Get API URL from env or fallback
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      // Prepare onboarding data
      const onboardingData = {
        onboardingCompleted: true,
        workspaceType: workspaceType || 'personal',
        workspaceName: workspaceName || `${firstName}'s Workspace`,
        postFormat: postFormat || 'casual',
        postFrequency: postFrequency || 'daily'
      };
      
      console.log("Updating onboarding status with data:", onboardingData);
      
      // Update the user's onboarding progress on the server
      const response = await axios({
        method: 'post',
        url: `${baseApiUrl}/users/update-onboarding`,
        data: onboardingData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 15000 // Extended timeout
      });
      
      console.log("Update onboarding response:", response.data);
      
      // Fetch updated user data
      await fetchUser();
      setIsMarkingComplete(false);
      setError("");
      
      // Set onboarding as completed and navigate to dashboard
      localStorage.setItem('onboardingCompleted', 'true');
      navigate("/dashboard");
    } catch (err) {
      console.error("Error marking onboarding as complete:", err);
      
      // More detailed error message with retry info
      const errorMsg = err.response?.data?.error || err.message || 'Failed to connect to the server';
      setError(`${errorMsg}. ${retryCount < maxRetries ? 'You can retry the update.' : 'Your settings are saved locally.'}`);
      
      setIsMarkingComplete(false);
    }
  };
  
  const handleGoToDashboard = () => {
    // Call the markOnboardingComplete function which will set localStorage and navigate
    markOnboardingComplete();
  };
  
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setError("");
      setRetryCount(prev => prev + 1);
    } else {
      setError("Maximum retry attempts reached. Your settings are saved locally.");
      // Still allow proceeding to dashboard
      localStorage.setItem('onboardingCompleted', 'true');
    }
  };
  
  const handleGenerateContent = () => {
    setIsGeneratingContent(true);
    
    // Simulate content generation (would connect to real API in production)
    setTimeout(() => {
      setIsGeneratingContent(false);
      setContentGenerated(true);
      // Remove automatic redirect to dashboard
    }, 2000);
  };
  
  const handleUploadFiles = () => {
    setIsUploadingFiles(true);
    
    // Simulate file upload (would connect to real API in production)
    setTimeout(() => {
      setIsUploadingFiles(false);
      setAccountsConnected(true);
      // Remove automatic redirect to dashboard
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      {/* Animated gradient background with Twitter blue */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-900 blur-[120px]"></div>
        <div className="absolute -bottom-10 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-900 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dots-pattern opacity-10 -z-10"></div>
      
      <motion.div 
        className="max-w-3xl w-full text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex flex-col items-center" variants={itemVariants}>
          <div className="p-4 mb-6 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-500/20 border border-blue-400/30 shadow-lg">
            <CheckCircle className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center gap-2">
            Setup Complete!
            <span role="img" aria-label="celebration">🎉</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl mt-4 max-w-xl mx-auto">
            Your profile is ready! Let's make your content creation experience exceptional with Scripe.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-8 max-w-2xl mx-auto shadow-xl"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">Choose your next step</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center bg-gradient-to-r from-blue-50/80 to-blue-50/80 dark:from-blue-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-all duration-300 hover:shadow-md group">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <FileEdit className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Create first content</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our AI will craft personalized content based on your preferences and style
                </p>
                {contentGenerated ? (
                  <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Content successfully generated! You can view it in your dashboard.</span>
                  </div>
                ) : (
                  <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                    <Button 
                      onClick={handleGenerateContent}
                      variant="linkedin"
                      rounded="full"
                      className="w-full md:w-auto px-8 py-6 font-medium shadow-md hover:shadow-lg"
                      disabled={isGeneratingContent}
                    >
                      {isGeneratingContent ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate First Post
                          <FileEdit className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center bg-gradient-to-r from-blue-50/80 to-blue-50/80 dark:from-blue-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-all duration-300 hover:shadow-md group">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Linkedin className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Connect LinkedIn account</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Link your LinkedIn to publish content with a single click
                </p>
                {accountsConnected ? (
                  <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>LinkedIn account successfully connected! You can manage it in your dashboard.</span>
                  </div>
                ) : (
                  <Button 
                    variant="outline"
                    rounded="full"
                    className="w-full md:w-auto border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 group"
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
                        Connect LinkedIn
                        <Linkedin className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      
        <motion.div variants={itemVariants} className="mt-6 flex justify-center w-full max-w-md mx-auto">
          <Button 
            onClick={handleGoToDashboard}
            variant="linkedin"
            rounded="full"
            className="px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Go to Dashboard
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
        
        {error && (
          <motion.div 
            variants={itemVariants}
            className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg text-sm"
          >
            <p>{error}</p>
            {retryCount < maxRetries && (
              <Button 
                variant="outline"
                size="sm"
                rounded="full"
                className="mt-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/50"
                onClick={handleRetry}
                disabled={isMarkingComplete}
              >
                {isMarkingComplete ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Retry Update
                  </>
                )}
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 