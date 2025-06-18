import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Linkedin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import api, { tokenManager } from "@/services/api";

export default function CompletionPage() {
  const navigate = useNavigate();
  const { nextStep, workspaceType, workspaceName, firstName } = useOnboarding();
  const { user } = useAuth();
  
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);
  
  // Auto-redirect LinkedIn users to dashboard after 2 seconds
  useEffect(() => {
    if (user?.authMethod === 'linkedin') {
      let navigationTimer: NodeJS.Timeout;
      let mounted = true;

      const completeOnboarding = async () => {
        try {
          const token = localStorage.getItem('linkedin-login-token');
          
          if (!token) {
            console.error('No LinkedIn token found');
            return;
          }

          // First mark onboarding as complete using POST (not PUT)
          await api.post('/onboarding/complete', {
            workspaceType: workspaceType || 'personal',
            workspaceName: workspaceName || `${firstName}'s Workspace`,
            onboardingCompleted: true
          });

          // Update local storage
          localStorage.setItem('onboardingCompleted', 'true');
          
          // Only navigate if component is still mounted
          if (mounted) {
            navigate("/dashboard", { replace: true });
          }
        } catch (error) {
          console.error('Error completing LinkedIn onboarding:', error);
          // If backend update fails, still navigate after 2 seconds
          if (mounted) {
            navigationTimer = setTimeout(() => {
              localStorage.setItem('onboardingCompleted', 'true');
              navigate("/dashboard", { replace: true });
            }, 2000);
          }
        }
      };

      // Start the completion process
      completeOnboarding();

      // Cleanup function
      return () => {
        mounted = false;
        if (navigationTimer) {
          clearTimeout(navigationTimer);
        }
      };
    }
  }, [user, navigate, workspaceType, workspaceName, firstName]);

  const handleGoToDashboard = async () => {
    setIsMarkingComplete(true);
    try {
      // Get the token based on auth method
      let token;
      if (user?.authMethod === 'linkedin') {
        token = localStorage.getItem('linkedin-login-token');
      } else if (user?.authMethod === 'google') {
        token = localStorage.getItem('google-login-token');
      }
      
      // Fallback to checking auth-method in localStorage
      if (!token) {
        const authMethod = localStorage.getItem('auth-method');
        if (authMethod) {
          token = localStorage.getItem(`${authMethod}-login-token`);
        }
      }

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Using token for auth method:', user?.authMethod || localStorage.getItem('auth-method'));

      // Update onboarding status using POST
      await api.post('/onboarding/complete', {
        workspaceType: workspaceType || 'personal',
        workspaceName: workspaceName || `${firstName}'s Workspace`,
        onboardingCompleted: true
      });

      // Update local storage and navigate
      localStorage.setItem('onboardingCompleted', 'true');
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError("Failed to complete onboarding. Please try again.");
      setIsMarkingComplete(false);
      
      // If backend update fails after max retries, proceed to dashboard
      if (retryCount >= maxRetries - 1) {
        localStorage.setItem('onboardingCompleted', 'true');
        navigate("/dashboard", { replace: true });
      }
    }
  };
  
  const handleRetry = async () => {
    if (retryCount < maxRetries) {
      setError("");
      setRetryCount(prev => prev + 1);
      await handleGoToDashboard();
    } else {
      setError("Maximum retry attempts reached. Your settings are saved locally.");
      localStorage.setItem('onboardingCompleted', 'true');
      navigate("/dashboard");
    }
  };
  
  const handleConnectLinkedIn = () => {
    // Get the backend URL from environment variable or fallback to production URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
    
    // Store current URL in localStorage to redirect back after LinkedIn connection
    localStorage.setItem('redirectAfterAuth', '/dashboard');
    
    // Store that this is a LinkedIn connection attempt from a Google user
    localStorage.setItem('linkedin-login-type', 'google_connect');
    
    // Redirect to LinkedIn OAuth endpoint with connection type
    window.location.href = `${baseApiUrl}/auth/linkedin-direct?type=google_connect&googleUserId=${user?.id}`;
  };

  // If user is logged in with LinkedIn, show a simple completion message with animation
  if (user?.authMethod === 'linkedin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-primary/5"></div>
        </div>
        
        <motion.div 
          className="max-w-3xl w-full text-center space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="p-4 mb-6 rounded-full bg-gradient-to-r from-primary/20 to-primary/20 border border-primary/30 shadow-lg"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <CheckCircle className="w-16 h-16 text-primary" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Setup Complete!</h1>
            <p className="text-gray-600 text-xl mt-4">
              Redirecting you to your dashboard...
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary/5"></div>
      </div>
      
      <motion.div 
        className="max-w-3xl w-full text-center space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="flex flex-col items-center">
          <div className="p-4 mb-6 rounded-full bg-gradient-to-r from-primary/20 to-primary/20 border border-primary/30 shadow-lg">
            <CheckCircle className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Setup Complete!</h1>
          <p className="text-gray-600 text-xl mt-4">
            Your profile is ready! Let's make your content creation experience exceptional.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl p-8 max-w-2xl mx-auto shadow-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Choose your next step</h2>
          
          <div className="space-y-6">
            {user?.authMethod === 'google' && !user?.linkedinConnected && (
              <div className="flex flex-col md:flex-row gap-6 items-center bg-gradient-to-r from-blue-50/80 to-blue-50/80 p-6 rounded-xl border border-blue-100 transition-all duration-300 hover:shadow-md group">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Linkedin className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Connect LinkedIn account</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Link your LinkedIn to publish content with a single click
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full md:w-auto border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 group"
                    onClick={handleConnectLinkedIn}
                  >
                    Connect LinkedIn
                    <Linkedin className="w-4 h-4 ml-2 group-hover:text-blue-600" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Error display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <p className="mb-2 font-medium">{error}</p>
              {retryCount < maxRetries && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleRetry}
                >
                  Retry
                </Button>
              )}
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleGoToDashboard}
              className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-base rounded-full shadow-md w-full max-w-md flex items-center justify-center gap-2"
              disabled={isMarkingComplete}
            >
              {isMarkingComplete ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Go to Dashboard
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}