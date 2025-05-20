import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const CreditsSuccessPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Verify the session with the backend (optional but recommended)
    const verifySession = async () => {
      if (sessionId && token) {
        try {
          // You could implement an endpoint to verify the session if needed
          // For now we'll just use the existing subscription endpoint
          await axios.get(`${import.meta.env.VITE_API_URL}/stripe/subscription`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error verifying checkout session:', error);
        }
      }
    };

    verifySession();
    
    // Redirect to billing page after 5 seconds if user doesn't click the button
    const redirectTimer = setTimeout(() => {
      navigate('/settings/billing');
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [sessionId, token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <PlusCircle className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Credits Added!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. The credits have been added to your account and are ready to use.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button 
            onClick={() => navigate('/settings/billing')}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            View Credits
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={() => navigate('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2"
          >
            Start Creating
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          You will be redirected automatically in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default CreditsSuccessPage; 