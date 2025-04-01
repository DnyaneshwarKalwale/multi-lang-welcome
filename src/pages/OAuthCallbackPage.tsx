import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ScripeLogotype } from '@/components/ScripeIcon';
import { useAuth } from '@/contexts/AuthContext';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { refreshUser } = useAuth();
  
  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Parse query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const onboarding = params.get('onboarding') === 'true';
        const errorParam = params.get('error');
        const userDataParam = params.get('userData');
        
        if (errorParam) {
          setError(errorParam);
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        if (token) {
          // Set token in localStorage
          localStorage.setItem('token', token);
          
          // Get fresh user data
          const user = await refreshUser();
          
          // Redirect based on onboarding status
          if (user?.onboardingCompleted) {
            // User has completed onboarding, go straight to dashboard
            navigate('/dashboard', { replace: true });
          } else if (onboarding) {
            // User needs to complete onboarding
            navigate('/onboarding/welcome', { replace: true });
          } else {
            // Default to dashboard if there's no clear direction
            navigate('/dashboard', { replace: true });
          }
        } else {
          // Handle direct access with name and twitterId (from mock Twitter auth)
          const name = params.get('name');
          const twitterId = params.get('twitterId');
          const email = params.get('email');
          const profileImage = params.get('profileImage');
          
          if (name && twitterId) {
            try {
              // We have direct Twitter auth parameters, use them
              const nameParts = name.split(' ');
              const firstName = nameParts[0] || 'User';
              const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
              
              // Call auth API with direct data
              await useAuth().twitterAuth({
                name,
                twitterId,
                email: email || undefined,
                profileImage: profileImage || undefined
              });
              
              // The token should now be in localStorage from the twitterAuth function
              // Refresh user data to get the latest state
              const user = await refreshUser();
              
              // Redirect based on onboarding status
              if (user?.onboardingCompleted) {
                navigate('/dashboard', { replace: true });
              } else {
                navigate('/onboarding/welcome', { replace: true });
              }
            } catch (authError) {
              console.error('Twitter auth failed:', authError);
              setError('Authentication failed. Please try again.');
              setTimeout(() => navigate('/'), 3000);
            }
          } else {
            setError('No authentication token or credentials received');
            setTimeout(() => navigate('/'), 3000);
          }
        }

        // Handle userData if it exists
        if (userDataParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(userDataParam));
            // Store this to populate forms later
            localStorage.setItem('social_profile', JSON.stringify(userData));
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      } catch (e) {
        console.error('OAuth callback error:', e);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };
    
    handleAuth();
  }, [location, navigate, refreshUser]);

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
              You're being redirected, please wait...
            </p>
          </>
        )}
      </div>
    </div>
  );
} 