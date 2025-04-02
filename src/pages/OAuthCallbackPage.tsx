import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ScripeLogotype } from '@/components/ScripeIcon';
import axios from 'axios';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token and onboarding status from URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const onboarding = params.get('onboarding');
        const error = params.get('error');

        if (error) {
          console.error('OAuth error:', error);
          navigate('/login?error=' + error);
          return;
        }

        if (!token) {
          console.error('No token received');
          navigate('/login?error=no_token');
          return;
        }

        // Store the token
        localStorage.setItem('token', token);

        // If onboarding is not completed, redirect to language selection
        if (onboarding === 'true') {
          navigate('/language-selection');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        navigate('/login?error=callback_error');
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-purple/5 to-brand-pink/5 dark:from-gray-900 dark:to-gray-800">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 mx-auto border-4 border-t-brand-purple border-r-brand-purple border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Completing authentication...
        </p>
      </motion.div>
    </div>
  );
} 