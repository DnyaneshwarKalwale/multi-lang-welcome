import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { ScripeLogotype } from '@/components/ScripeIcon';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Authenticating...');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const { theme } = useTheme();
  
  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  useEffect(() => {
    const processAuth = async () => {
      // Parse query parameters
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const onboarding = params.get('onboarding') === 'true';
      const errorParam = params.get('error');
      
      console.log('OAuth callback received with params:', { 
        token: token ? '(token present)' : '(no token)', 
        onboarding, 
        error: errorParam 
      });
      
      if (errorParam) {
        console.error('OAuth error from server:', errorParam);
        setError(errorParam);
        setIsSuccess(false);
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      if (!token) {
        console.error('No authentication token received');
        setError('No authentication token received');
        setIsSuccess(false);
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      // Set token in localStorage
      localStorage.setItem('token', token);
      
      // Fetch user info to verify token works
      setStatus('Verifying authentication...');
      try {
        const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
        const response = await axios.get(`${baseApiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userData = response.data.user;
        console.log('User authenticated successfully:', { 
          id: userData.id, 
          email: userData.email || '(no email)',
          onboardingCompleted: userData.onboardingCompleted,
          authMethod: userData.authMethod,
          isEmailVerified: userData.isEmailVerified
        });
        
        // Store onboarding status in localStorage for other components to use
        localStorage.setItem('onboardingCompleted', userData.onboardingCompleted ? 'true' : 'false');
        
        setIsSuccess(true);
      } catch (error) {
        console.error('Error verifying user data:', error);
        // Continue anyway since we have a token
      }
      
      // Check for pending invitations
      setStatus('Checking for invitations...');
      try {
        // Don't check if user has skipped invitations
        const skippedInvitations = localStorage.getItem('skippedInvitations');
        if (skippedInvitations === 'true') {
          console.log('Skipping invitation check - user previously skipped');
          // Redirect based on onboarding status
          if (onboarding) {
            navigate('/onboarding/welcome');
          } else {
            navigate('/dashboard');
          }
          return;
        }
        
        // Fetch invitations
        const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
        try {
          console.log(`Checking for invitations using token for user ${token ? 'with token' : 'missing token'}`);
          console.log(`Using API URL: ${baseApiUrl}`);
          
          try {
            const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000 // Add timeout to prevent long waits
            });
            
            const invitations = response.data.data || [];
            console.log(`Found ${invitations.length} pending invitations:`, invitations);
            
            // Store invitations in localStorage for offline access
            if (invitations.length > 0) {
              localStorage.setItem('cachedInvitations', JSON.stringify(invitations));
              navigate('/pending-invitations');
              return;
            }
          } catch (invError: any) {
            console.error('Failed to check invitations:', invError);
            
            // Log detailed error information for debugging
            if (invError.response) {
              console.error('Error response:', {
                status: invError.response.status,
                statusText: invError.response.statusText,
                data: invError.response.data
              });
            } else if (invError.request) {
              console.error('Error request:', invError.request);
            }
            
            // Check if we have cached invitations we can use
            const cachedInvitations = localStorage.getItem('cachedInvitations');
            if (cachedInvitations) {
              const invitations = JSON.parse(cachedInvitations);
              if (invitations.length > 0) {
                console.log('Using cached invitations:', invitations);
                navigate('/pending-invitations');
                return;
              }
            }
            
            // If the endpoint doesn't exist (404) or server is down (500+), continue with normal flow
            // This prevents the app from getting stuck during development
            console.log('Continuing with normal flow after invitation check error');
          }
        } catch (err) {
          console.error('Failed to check invitations:', err);
          // Continue with normal flow even if invitation check fails
        }
      } catch (err) {
        console.error('Failed to check invitations:', err);
        // Continue with normal flow even if invitation check fails
      }
      
      // Normal flow - redirect based on onboarding status
      console.log('Redirecting to', onboarding ? 'onboarding' : 'dashboard');
      if (onboarding) {
        navigate('/onboarding/welcome');
      } else {
        navigate('/dashboard');
      }
    };
    
    processAuth();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 -left-[30%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary-800/20 to-primary-600/5 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[30%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-violet-800/20 to-violet-600/5 blur-[120px]"></div>
      </div>
      
      {/* Floating decoration elements */}
      <motion.div 
        className="absolute top-[15%] right-[20%] text-primary-500/20 z-0"
        variants={floatingVariants}
        animate="animate"
      >
        <ShieldAlert size={64} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[20%] left-[15%] text-violet-500/15 z-0"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <CheckCircle2 size={48} />
      </motion.div>
      
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 z-10"
      >
        <ScripeLogotype className="h-12 w-auto" />
      </motion.div>
      
      <motion.div 
        className="max-w-md w-full text-center bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-800 shadow-xl z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {error ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center bg-red-900/30 text-red-500 rounded-full">
              <XCircle className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Failed</h1>
            <p className="text-gray-400 mb-6">
              {error}. You'll be redirected to the login page.
            </p>
          </motion.div>
        ) : (
          <motion.div>
            <div className="flex justify-center mb-6">
              {isSuccess === true ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 flex items-center justify-center bg-green-900/30 text-green-500 rounded-full"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.div>
              ) : (
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    animate={{ 
                      boxShadow: ["0 0 0 0px rgba(139, 92, 246, 0.3)", "0 0 0 10px rgba(139, 92, 246, 0)"]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-16 h-16 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className={`h-10 w-10 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-500'}`} />
                  </motion.div>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-4 text-white">Authentication Successful</h1>
            <p className="text-gray-400">
              {status}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 
