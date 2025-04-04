import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
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
        navigate('/');
        return;
      }
      
      if (!token) {
        console.error('No authentication token received');
        navigate('/');
        return;
      }
      
      // Set token in localStorage
      localStorage.setItem('token', token);
      
      // Fetch user info to verify token works
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
        
        // Directly redirect based on onboarding status - no more waiting
        if (onboarding) {
          navigate('/onboarding/welcome');
        } else {
          navigate('/dashboard');
        }
        return;
      } catch (error) {
        console.error('Error verifying user data:', error);
        // Continue anyway since we have a token
      }
      
      // Skip invitation check to simplify login flow
      // Directly redirect based on onboarding status
      console.log('Redirecting to', onboarding ? 'onboarding' : 'dashboard');
      if (onboarding) {
        navigate('/onboarding/welcome');
      } else {
        navigate('/dashboard');
      }
    };
    
    // Process auth immediately
    processAuth();
  }, [location, navigate]);

  // Return null to avoid showing any UI during the redirect
  return null;
} 
