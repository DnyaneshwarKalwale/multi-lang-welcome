import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ScripeLogotype } from '@/components/ScripeIcon';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const onboarding = params.get('onboarding') === 'true';
    const errorParam = params.get('error');
    
    if (errorParam) {
      setError(errorParam);
      setTimeout(() => navigate('/'), 3000);
      return;
    }
    
    if (token) {
      // Set token in localStorage
      localStorage.setItem('token', token);
      
      // Redirect based on onboarding status
      if (onboarding) {
        navigate('/onboarding/welcome');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('No authentication token received');
      setTimeout(() => navigate('/'), 3000);
    }
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
              You're being redirected, please wait...
            </p>
          </>
        )}
      </div>
    </div>
  );
} 