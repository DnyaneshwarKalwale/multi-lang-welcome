import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "@/components/ContinueButton";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { SekcionIconRounded } from "@/components/ScripeIcon";
import { CheckCircle, Loader2, Share2, Twitter, RefreshCw, ChevronRight, CloudIcon, Globe, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CompletionPage() {
  const navigate = useNavigate();
  const { nextStep, workspaceType, workspaceName, firstName, language: onboardingLanguage, theme, postFormat, postFrequency } = useOnboarding();
  const { user, fetchUser } = useAuth();
  const { t, language: appLanguage } = useLanguage();
  
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
  
  // Mark onboarding as complete on the server but do NOT automatically redirect
  useEffect(() => {
    // Do NOT set this flag yet, we'll only set it when the user explicitly clicks to dashboard
    // localStorage.setItem('onboardingCompleted', 'true');
    
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
          language: onboardingLanguage || appLanguage,
          theme: theme || 'dark',
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
      } catch (err: any) {
        console.error("Error marking onboarding as complete:", err);
        
        // More detailed error message with retry info
        const errorMsg = err.response?.data?.error || err.message || 'Failed to connect to the server';
        setError(`${errorMsg}. ${retryCount < maxRetries ? 'You can retry the update.' : 'Your settings are saved locally.'}`);
        
        setIsMarkingComplete(false);
      }
    };
    
    markOnboardingComplete();
  }, [user, workspaceType, workspaceName, firstName, onboardingLanguage, appLanguage, theme, postFormat, postFrequency, fetchUser, retryCount, maxRetries]);
  
  const handleGoToDashboard = () => {
    // ONLY set the flag when the user explicitly clicks to go to dashboard
    localStorage.setItem('onboardingCompleted', 'true');
    navigate("/dashboard");
  };
  
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setError("");
      setRetryCount(prev => prev + 1);
    } else {
      setError("Maximum retry attempts reached. Your settings are saved locally.");
      // Do NOT automatically proceed to dashboard
    }
  };
  
  const handleGenerateContent = () => {
    setIsGeneratingContent(true);
    
    // Simulate content generation (would connect to real API in production)
    setTimeout(() => {
      setIsGeneratingContent(false);
      setContentGenerated(true);
      // No automatic redirect to dashboard
    }, 2000);
  };
  
  const handleUploadFiles = () => {
    setIsUploadingFiles(true);
    
    // Simulate file upload (would connect to real API in production)
    setTimeout(() => {
      setIsUploadingFiles(false);
      setAccountsConnected(true);
      // No automatic redirect to dashboard
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
            {t('setupComplete')}
            <span role="img" aria-label="celebration">🎉</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl mt-4 max-w-xl mx-auto">
            {t('profileReady')}
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-white/90 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-8 max-w-2xl mx-auto shadow-xl"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">{t('chooseNextStep')}</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center bg-gradient-to-r from-blue-50/80 to-blue-50/80 dark:from-blue-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-all duration-300 hover:shadow-md group">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <FileEdit className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('createFirstContent')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('aiContentDescription')}
                </p>
                {contentGenerated ? (
                  <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>{t('contentGenerated')}</span>
                  </div>
                ) : (
                  <Button 
                    variant="twitter"
                    rounded="full"
                    className="w-full md:w-auto group"
                    onClick={handleGenerateContent}
                    disabled={isGeneratingContent}
                  >
                    {isGeneratingContent ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('generating')}
                      </>
                    ) : (
                      <>
                        {t('generateContent')}
                        <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center bg-gradient-to-r from-blue-50/80 to-blue-50/80 dark:from-blue-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-all duration-300 hover:shadow-md group">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <Twitter className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('connectTwitterAccount')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('twitterLinkDescription')}
                </p>
                {accountsConnected ? (
                  <div className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>{t('twitterConnected')}</span>
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
                        {t('connecting')}
                      </>
                    ) : (
                      <>
                        {t('connectTwitter')}
                        <Twitter className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-start gap-3">
              <div className="text-red-600 dark:text-red-400 p-1 bg-red-100 dark:bg-red-800/30 rounded-full flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">{t('errorOccurred')}</p>
                <p className="text-sm mt-1">{error}</p>
                {retryCount < maxRetries && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                    onClick={handleRetry}
                    disabled={isMarkingComplete}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    {t('retry')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Skip for now button */}
        <motion.div className="mt-6" variants={itemVariants}>
          <Button 
            variant="subtle"
            rounded="full"
            className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-300"
            onClick={handleGoToDashboard}
            disabled={isMarkingComplete}
          >
            {isMarkingComplete ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('savingPreferences')}
              </>
            ) : (
              <>
                {t('goToDashboard')}
                <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
} 