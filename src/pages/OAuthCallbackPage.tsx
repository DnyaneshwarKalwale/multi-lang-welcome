import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { Loader2, CheckCircle2, XCircle, Sparkles, Zap } from "lucide-react";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nextStep } = useOnboarding();
  const { t } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState("");

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
          setStatus('error');
          setError(t('oauthError'));
          return;
        }

        if (!code) {
          setStatus('error');
          setError(t('noCodeProvided'));
          return;
        }

        // Add your OAuth token exchange logic here
        // For example:
        // const response = await exchangeCodeForToken(code);
        // if (response.success) {
        //   setStatus('success');
        //   setTimeout(() => nextStep(), 2000);
        // } else {
        //   setStatus('error');
        //   setError(response.error);
        // }

        // For demo purposes, we'll simulate a successful OAuth flow
        setTimeout(() => {
          setStatus('success');
          setTimeout(() => nextStep(), 2000);
        }, 1500);

      } catch (err) {
        setStatus('error');
        setError(t('oauthError'));
      }
    };

    handleOAuthCallback();
  }, [location, nextStep, t]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 py-6 sm:py-10 gradient-dark text-white relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 opacity-30 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-brand-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-brand-secondary/20 blur-[120px]"></div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute opacity-10 pointer-events-none hidden sm:block"
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8, 
          ease: "easeInOut" 
        }}
        style={{ top: '15%', right: '10%' }}
      >
        <Sparkles size={80} className="text-brand-primary" />
      </motion.div>
      
      <motion.div 
        className="absolute opacity-10 pointer-events-none hidden sm:block"
        animate={{ 
          y: [0, 20, 0],
          x: [0, -15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10, 
          ease: "easeInOut",
          delay: 1 
        }}
        style={{ bottom: '20%', left: '8%' }}
      >
        <Zap size={60} className="text-brand-pink" />
      </motion.div>
      
      <motion.div 
        className="max-w-md w-full px-2 sm:px-4 text-center" 
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-4 sm:mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScripeIconRounded className="w-16 h-16 sm:w-20 sm:h-20" />
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center justify-center"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-brand-primary animate-spin mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-brand-gray-900 dark:text-white">
                {t('connecting')}
              </h2>
              <p className="text-brand-gray-300">
                {t('connectingDescription')}
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-brand-success mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-brand-gray-900 dark:text-white">
                {t('connected')}
              </h2>
              <p className="text-brand-gray-300">
                {t('connectedDescription')}
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-brand-error mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-brand-gray-900 dark:text-white">
                {t('connectionError')}
              </h2>
              <p className="text-brand-gray-300 mb-4">
                {error}
              </p>
              <button
                onClick={() => navigate(-1)}
                className="text-brand-primary hover:text-brand-primary/80 transition-colors"
              >
                {t('tryAgain')}
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
} 