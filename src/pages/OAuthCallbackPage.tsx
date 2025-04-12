import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Use an async function to handle the authentication process
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
        navigate('/');
        return;
      }
      
      if (!token) {
        console.error('No authentication token received');
        navigate('/');
        return;
      }
      
      // Set token in localStorage immediately
      localStorage.setItem('token', token);
      
      try {
        // Update user state in AuthContext
        await fetchUser();
        
        // Check for pending invitation token
        const pendingInvitationToken = localStorage.getItem('pendingInvitationToken');
        
        // Check for redirect after auth (set during LinkedIn connection on completion page)
        const redirectAfterAuth = localStorage.getItem('redirectAfterAuth');
        
        // Determine where to redirect the user
        if (pendingInvitationToken) {
          navigate(`/invitations?token=${pendingInvitationToken}`, { replace: true });
          localStorage.removeItem('pendingInvitationToken');
        } else if (redirectAfterAuth) {
          // Navigate to the stored redirect path and remove it from localStorage
          navigate(redirectAfterAuth, { replace: true });
          localStorage.removeItem('redirectAfterAuth');
        } else {
          // Get onboarding status from localStorage (set by fetchUser)
          const onboardingCompleted = localStorage.getItem('onboardingCompleted');
          
          console.log('OAuthCallback - Onboarding param:', onboarding);
          console.log('OAuthCallback - onboardingCompleted from localStorage:', onboardingCompleted);
          
          if (onboarding || onboardingCompleted !== 'true') {
            console.log('OAuthCallback - Redirecting to onboarding');
            navigate('/onboarding/welcome', { replace: true });
          } else {
            console.log('OAuthCallback - Redirecting to dashboard');
            navigate('/dashboard', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error verifying user data:', error);
        // Continue with navigation anyway since we have a token
        
        // Check for pending invitation
        const pendingInvitationToken = localStorage.getItem('pendingInvitationToken');
        
        // Check for redirect after auth
        const redirectAfterAuth = localStorage.getItem('redirectAfterAuth');
        
        if (pendingInvitationToken) {
          navigate(`/invitations?token=${pendingInvitationToken}`, { replace: true });
          localStorage.removeItem('pendingInvitationToken');
        } else if (redirectAfterAuth) {
          navigate(redirectAfterAuth, { replace: true });
          localStorage.removeItem('redirectAfterAuth');
        } else if (onboarding) {
          navigate('/onboarding/welcome', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    };
    
    // Process authentication immediately
    processAuth();
  }, [location, navigate, fetchUser]);

  // Return a minimal loading indicator that matches the design system
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-20 h-20"
        >
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-primary/30 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" style={{animationDuration: '1.5s'}}></div>
        </motion.div>
      </div>
    </div>
  );
}
