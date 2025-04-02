import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ScripeLogotype } from '@/components/ScripeIcon';
import axios from 'axios';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Authenticating...');
  
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
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      if (!token) {
        console.error('No authentication token received');
        setError('No authentication token received');
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
          authMethod: userData.authMethod
        });
        
        // Store onboarding status in localStorage for other components to use
        localStorage.setItem('onboardingCompleted', userData.onboardingCompleted ? 'true' : 'false');
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
          const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const invitations = response.data.data || [];
          console.log(`Found ${invitations.length} pending invitations`);
          
          // If has invitations, go to pending invitations page
          if (invitations.length > 0) {
            navigate('/pending-invitations');
            return;
          }
        } catch (invError) {
          console.error('Failed to check invitations:', invError);
          // If the endpoint doesn't exist or returns an error, continue with normal flow
          // This prevents the app from getting stuck during development
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <ScripeLogotype className="mb-8" />
      
      <div className="max-w-md text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Failed</h1>
            <p className="text-gray-400 mb-6">
              {error}. You'll be redirected to the login page.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Authentication Successful</h1>
            <p className="text-gray-400">
              {status}
            </p>
          </>
        )}
      </div>
    </div>
  );
} 