import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CheckoutCancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to billing page after 5 seconds if user doesn't click the button
    const redirectTimer = setTimeout(() => {
      navigate('/settings/billing');
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <X className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Payment Canceled</h1>
        
        <p className="text-gray-600 mb-6">
          Your payment process was canceled. No charges were made to your account.
          You can try again whenever you're ready.
        </p>
        
        <Button 
          onClick={() => navigate('/settings/billing')}
          className="w-full flex items-center justify-center gap-2"
        >
          Return to Billing
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          You will be redirected automatically in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default CheckoutCancelPage; 