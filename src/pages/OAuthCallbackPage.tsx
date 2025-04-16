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
  const [error, setError] = useState<string | null>(null);
  
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
        setError(`Authentication failed: ${errorParam}`);
        // Wait a moment before redirecting on error
        setTimeout(() => navigate('/', { replace: true }), 2000);
        return;
      }
      
      if (!token) {
        console.error('No authentication token received');
        setError('No authentication token received');
        // Wait a moment before redirecting on error
        setTimeout(() => navigate('/', { replace: true }), 2000);
        return;
      }
      
      // Determine auth method from URL path
      let authMethod = 'linkedin'; // Default to LinkedIn instead of email
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
      
      try {
        // First store the token - important to do this before fetchUser
        console.log('OAuth callback - Storing token with authMethod:', authMethod);
        tokenManager.storeToken(token, authMethod as 'linkedin' | 'google');
        
        // Now fetch user data to ensure we have a user object loaded
        console.log('OAuth callback - Fetching user data');
        const userData = await fetchUser();
        
        if (!userData) {
          console.error('OAuth callback - User data could not be loaded');
          setError('Could not load user data, please try again');
          // Wait a moment before redirecting on error
          setTimeout(() => navigate('/', { replace: true }), 2000);
          return;
        }
        
        console.log('OAuth callback - User data loaded successfully', { id: userData.id });
        
        // Check for pending invitation token
        const pendingInvitationToken = localStorage.getItem('pendingInvitationToken');
        
        // Check for redirect after auth (set during LinkedIn connection on completion page)
        const redirectAfterAuth = localStorage.getItem('redirectAfterAuth');
        
        // Determine where to redirect the user
        if (pendingInvitationToken) {
          console.log('OAuth callback - Redirecting to handle pending invitation');
          navigate(`/invitations?token=${pendingInvitationToken}`, { replace: true });
          localStorage.removeItem('pendingInvitationToken');
        } else if (redirectAfterAuth) {
          // Navigate to the stored redirect path and remove it from localStorage
          console.log('OAuth callback - Redirecting to previously stored path:', redirectAfterAuth);
          navigate(redirectAfterAuth, { replace: true });
          localStorage.removeItem('redirectAfterAuth');
        } else {
          // Get onboarding status from localStorage (set by fetchUser)
          const onboardingCompleted = localStorage.getItem('onboardingCompleted');
          
          console.log('OAuthCallback - Onboarding param:', onboarding);
          console.log('OAuthCallback - onboardingCompleted from localStorage:', onboardingCompleted);
          
          // If onboarding is true in query params OR onboardingCompleted is not 'true', go to onboarding
          if (onboarding || onboardingCompleted !== 'true') {
            console.log('OAuthCallback - Redirecting to onboarding');
            navigate('/onboarding/welcome', { replace: true });
          } else {
            console.log('OAuthCallback - Redirecting to dashboard');
            navigate('/dashboard', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error processing authentication:', error);
        setError('Error processing authentication. Please try again.');
        // Wait a moment before redirecting on error
        setTimeout(() => navigate('/', { replace: true }), 2000);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Process authentication immediately
    processAuth();
  }, [location, navigate, fetchUser]);

  // Return loading indicator or error message
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        {error ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-gray-500">{error}</p>
            <p className="text-sm mt-4">Redirecting you back...</p>
          </div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-20 h-20"
            >
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-primary/30 animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" style={{animationDuration: '1.5s'}}></div>
            </motion.div>
            <p className="text-gray-500 mt-4">Completing authentication...</p>
          </>
        )}
      </div>
    </div>
  );
}
