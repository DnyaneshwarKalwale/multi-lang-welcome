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
  const { fetchUser, updateUserProfile } = useAuth();
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
      const linkedinConnected = params.get('linkedin_connected') === 'true';
      
      console.log('OAuth callback received with params:', { 
        token: token ? '(token present)' : '(no token)', 
        onboarding, 
        error: errorParam,
        linkedinConnected
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
      
      // Determine auth method from URL path or LinkedIn connection
      let authMethod = 'linkedin'; // Default to LinkedIn instead of email
      console.log('OAuth callback - Full pathname:', location.pathname);
      console.log('OAuth callback - Full URL:', window.location.href);
      
      // Check if this is a LinkedIn connection from a Google user
      if (linkedinConnected) {
        // For Google user LinkedIn connections, keep the auth method but fetch updated user data
        const storedAuthMethod = localStorage.getItem('auth-method');
        authMethod = storedAuthMethod === 'google' ? 'google' : 'linkedin';
        console.log('OAuth callback - LinkedIn connected to existing account, using auth method:', authMethod);
      } else {
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
      }
      
      console.log('OAuth callback - Determined authMethod:', authMethod);
      
      try {
        // For LinkedIn connections to existing accounts, don't clear all tokens
        if (!linkedinConnected) {
        // Clear any existing tokens first
        tokenManager.clearAllTokens();
        localStorage.removeItem('onboardingCompleted');
        localStorage.removeItem('onboardingStep');
        }
        
        // Store the new token
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
        
        console.log('OAuth callback - User data loaded successfully', { 
          id: userData.id, 
          linkedinConnected: userData.linkedinConnected,
          authMethod: userData.authMethod
        });
        
        // Check for pending invitation token
        const pendingInvitationToken = localStorage.getItem('pendingInvitationToken');
        
        // Check for redirect after auth (set during LinkedIn connection on completion page)
        const redirectAfterAuth = localStorage.getItem('redirectAfterAuth');
        
        // Determine where to redirect the user
        if (pendingInvitationToken) {
          console.log('OAuth callback - Redirecting to handle pending invitation');
          navigate(`/invitations?token=${pendingInvitationToken}`, { replace: true });
          localStorage.removeItem('pendingInvitationToken');
        } else if (linkedinConnected) {
          // For LinkedIn connections, always redirect to dashboard with completed onboarding
          console.log('OAuth callback - LinkedIn connected, redirecting to dashboard');
          localStorage.setItem('onboardingCompleted', 'true');
          
          // Update the stored auth method to keep the original method but mark as LinkedIn connected
          const originalAuthMethod = localStorage.getItem('auth-method');
          if (originalAuthMethod) {
            localStorage.setItem('auth-method', originalAuthMethod);
          }
          
          // Force update the user data with LinkedIn connection status
          if (userData) {
            userData.onboardingCompleted = true;
            userData.linkedinConnected = true;
            // Update the AuthContext user state immediately
            updateUserProfile({ linkedinConnected: true, onboardingCompleted: true });
          }
          
          // Clear the linkedin-login-type flag
          localStorage.removeItem('linkedin-login-type');
          
          // Force refresh the user data from server
          setTimeout(async () => {
            try {
              console.log('Force refreshing user data after LinkedIn connection');
              const freshUserData = await fetchUser(true);
              console.log('Refreshed user data after LinkedIn connection:', { 
                linkedinConnected: freshUserData?.linkedinConnected, 
                authMethod: freshUserData?.authMethod 
              });
              
              // Update localStorage with fresh user data
              if (freshUserData?.linkedinConnected) {
                console.log('Confirming LinkedIn connection in localStorage');
                localStorage.setItem('linkedinConnected', 'true');
              }
            } catch (error) {
              console.error('Error refreshing user data:', error);
            }
          }, 100);
          
          // Navigate to dashboard with a success indicator
          navigate('/dashboard?linkedin=connected', { replace: true });
          localStorage.removeItem('redirectAfterAuth');
        } else if (redirectAfterAuth) {
          // Navigate to the stored redirect path and remove it from localStorage
          console.log('OAuth callback - Redirecting to previously stored path:', redirectAfterAuth);
          // Mark onboarding as completed if redirecting to dashboard
          if (redirectAfterAuth === '/dashboard') {
            localStorage.setItem('onboardingCompleted', 'true');
            if (userData) {
              userData.onboardingCompleted = true;
            }
          }
          navigate(redirectAfterAuth, { replace: true });
          localStorage.removeItem('redirectAfterAuth');
        } else {
          // Get onboarding status from the server response
          const onboardingCompleted = userData.onboardingCompleted;
          
          console.log('OAuthCallback - Onboarding param:', onboarding);
          console.log('OAuthCallback - onboardingCompleted from server:', onboardingCompleted);
          
          // If onboarding is true in query params OR onboardingCompleted is false from server, go to onboarding
          if (onboarding || !onboardingCompleted) {
            console.log('OAuthCallback - Redirecting to onboarding');
            navigate('/onboarding/welcome', { replace: true });
          } else {
            console.log('OAuthCallback - Redirecting to dashboard');
            // Ensure onboarding is marked as completed
            localStorage.setItem('onboardingCompleted', 'true');
            if (userData) {
              userData.onboardingCompleted = true;
            }
            navigate('/dashboard', { replace: true });
          }
        }
      } catch (error) {
        console.error('OAuth callback - Error processing authentication:', error);
        setError('Failed to process authentication. Please try again.');
        setTimeout(() => navigate('/', { replace: true }), 2000);
      } finally {
        setIsLoading(false);
      }
    };
    
    processAuth();
  }, [navigate, location, fetchUser]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg text-gray-600">Processing your login...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600"
          >
            {error}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
