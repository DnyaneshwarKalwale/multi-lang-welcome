import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useAuth();
  
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
      
      try {
        // Update user state in AuthContext before redirecting
        await fetchUser();
        
        // Store onboarding status in localStorage
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
        
        // Add a small delay to ensure auth context is updated
        setTimeout(() => {
          // Directly redirect based on onboarding status
          if (onboarding) {
            navigate('/onboarding/welcome', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }, 100);
        
        return;
      } catch (error) {
        console.error('Error verifying user data:', error);
        // Continue anyway since we have a token
        
        // Add a small delay to ensure auth context is updated
        setTimeout(() => {
          // Directly redirect based on onboarding status
          if (onboarding) {
            navigate('/onboarding/welcome', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }, 100);
      }
    };
    
    // Process auth immediately
    processAuth();
  }, [location, navigate, fetchUser]);

  // Return null to avoid showing any UI during the redirect
  return null;
} 
