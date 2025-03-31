import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ScripeLogotype } from '@/components/ScripeIcon';
import { Button } from '@/components/ui/button';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [onboarding, setOnboarding] = useState(false);
  
  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const onboardingParam = params.get('onboarding') === 'true';
    const errorParam = params.get('error');
    
    if (errorParam) {
      setError(errorParam);
      setTimeout(() => navigate('/'), 3000);
      return;
    }
    
    if (tokenParam) {
      // Store token and onboarding status
      setToken(tokenParam);
      setOnboarding(onboardingParam);
      
      // Set token in localStorage
      localStorage.setItem('token', tokenParam);
      
      // Show options to the user instead of redirecting immediately
      setShowOptions(true);
    } else {
      setError('No authentication token received');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [location, navigate]);
  
  const handleContinueToOnboarding = () => {
    navigate('/onboarding/welcome');
  };
  
  const handleContinueToDashboard = () => {
    navigate('/dashboard');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <ScripeLogotype className="mb-8" />
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Failed</h1>
          <p className="text-gray-400 mb-6">
            {error}. You'll be redirected to the login page.
          </p>
        </div>
      </div>
    );
  }
  
  if (showOptions) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <ScripeLogotype className="mb-8" />
        
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Successful</h1>
          <p className="text-gray-400 mb-8">
            You've successfully logged in. Where would you like to go next?
          </p>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 py-6"
              onClick={handleContinueToOnboarding}
            >
              Go to Onboarding
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full py-6 border-gray-700 hover:bg-gray-800"
              onClick={handleContinueToDashboard}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <ScripeLogotype className="mb-8" />
      
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Authentication Successful</h1>
        <p className="text-gray-400">
          Verifying your account, please wait...
        </p>
      </div>
    </div>
  );
} 