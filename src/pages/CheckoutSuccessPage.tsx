 import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const CheckoutSuccessPage = () => {
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
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Payment Successful!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your subscription has been activated and your credits have been added to your account.
        </p>
        
        <Button 
          onClick={() => navigate('/settings/billing')}
          className="w-full flex items-center justify-center gap-2"
        >
          View My Subscription
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          You will be redirected automatically in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage; 