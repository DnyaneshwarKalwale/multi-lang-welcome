import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { tokenManager } from '@/services/api';

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
      
      // Determine auth method from URL path
      let authMethod = 'email';
      console.log('OAuth callback - Full pathname:', location.pathname);
      console.log('OAuth callback - Full URL:', window.location.href);
      
      // Check the URL path first - most reliable indicator
      if (location.pathname.includes('linkedin') || window.location.href.includes('linkedin')) {
        authMethod = 'linkedin';
        console.log('OAuth callback - Setting auth method to LinkedIn based on URL path');
      } else if (location.pathname.includes('google')) {
        authMethod = 'google';
      } else if (location.pathname.includes('social-callback')) {
        // For social-callback endpoints, try to determine from other means
        const params = new URLSearchParams(location.search);
        const provider = params.get('provider');
        if (provider === 'linkedin' || provider?.toLowerCase().includes('linkedin')) {
          authMethod = 'linkedin';
          console.log('OAuth callback - Setting auth method to LinkedIn based on provider param');
        } else if (provider === 'google') {
          authMethod = 'google';
        }
      }
      
      console.log('OAuth callback - Determined authMethod:', authMethod);
      
      // Don't set the token yet, wait until we get user data to confirm the auth method
      
      try {
        // Update user state in AuthContext
        const userData = await fetchUser();
        
        // Determine the correct auth method based on user data
        let finalAuthMethod = authMethod;
        
        // Update authMethod based on user data if available
        if (userData) {
          console.log('OAuth callback - User data received:', {
            id: userData.id,
            authMethod: userData.authMethod,
            hasLinkedinId: !!userData.linkedinId,
            hasGoogleId: !!userData.googleId
          });
          
          if (userData.authMethod) {
            console.log(`OAuth callback - Using authMethod from user data: ${userData.authMethod}`);
            finalAuthMethod = userData.authMethod;
          } else if (userData.linkedinId) {
            console.log('OAuth callback - Found linkedinId in user data, updating authMethod to linkedin');
            finalAuthMethod = 'linkedin';
          } else if (userData.googleId) {
            console.log('OAuth callback - Found googleId in user data, updating authMethod to google');
            finalAuthMethod = 'google';
          }
        }
        
        // Now set the token with the correct auth method
        console.log(`OAuth callback - Setting token with finalAuthMethod: ${finalAuthMethod}`);
        tokenManager.storeToken(token, finalAuthMethod as 'email' | 'linkedin' | 'google');
        
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
          
          // If onboarding is true in query params OR onboardingCompleted is not 'true', go to onboarding
          if (onboarding === true || onboardingCompleted !== 'true') {
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
