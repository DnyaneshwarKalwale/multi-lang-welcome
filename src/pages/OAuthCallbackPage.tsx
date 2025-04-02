import React, { useEffect, useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Authenticating...');

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
          setError(error);
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!token) {
          console.error('No token received');
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
          
          const userData = response.data;
          console.log('User authenticated successfully:', { 
            id: userData.id, 
            email: userData.email || '(no email)',
            onboardingCompleted: userData.onboardingCompleted,
            authMethod: userData.authMethod
          });
          
          // Store onboarding status in localStorage
          localStorage.setItem('onboardingCompleted', userData.onboardingCompleted ? 'true' : 'false');
        } catch (error) {
          console.error('Error verifying user data:', error);
        }
        
        // Check for pending invitations
        setStatus('Checking for invitations...');
        try {
          const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
          const response = await axios.get(`${baseApiUrl}/invitations/pending`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const invitations = response.data || [];
          console.log(`Found ${invitations.length} pending invitations`);
          
          // If has invitations, go to pending invitations page
          if (invitations.length > 0) {
            navigate('/pending-invitations');
            return;
          }
        } catch (error) {
          console.error('Error checking invitations:', error);
        }
        
        // Normal flow - redirect based on onboarding status
        if (onboarding === 'true') {
          navigate('/language-selection');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        setError('Failed to complete authentication');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate, location]);

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