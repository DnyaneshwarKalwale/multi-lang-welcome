import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ScripeLogotype } from '@/components/ScripeIcon';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { authApi } from '@/services/api';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useParams();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [email] = useState<string | null>(location.state?.email || user?.email || null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [redirectPath, setRedirectPath] = useState('/onboarding/welcome');

  useEffect(() => {
    const verifyToken = async () => {
      // Only attempt verification if a token is provided
      if (token) {
        try {
          setLoading(true);
          const response = await authApi.verifyEmail(token);
          setVerificationResult('success');
          
          // Store the token
          localStorage.setItem('token', response.token);
          
          // Determine where to redirect based on onboarding status
          if (response.user && response.user.onboardingCompleted) {
            setRedirectPath('/dashboard');
          } else {
            setRedirectPath('/onboarding/welcome');
          }
          
          // After 2 seconds, redirect to the appropriate page
          setTimeout(() => {
            navigate(redirectPath);
          }, 2000);
        } catch (err: any) {
          setVerificationResult('error');
          setError(err.response?.data?.error || 'Verification failed. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        // No token means just showing instructions
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate, redirectPath]);

  useEffect(() => {
    // Countdown timer for resend button
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendCountdown, resendDisabled]);

  const handleResendVerification = async () => {
    if (!email) return;
    
    try {
      setResendDisabled(true);
      setResendCountdown(60); // 60 seconds cooldown
      
      await authApi.resendVerification(email);
      
      // Show success message
      setError(null);
      alert('Verification email has been resent. Please check your inbox.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend verification email.');
    }
  };

  // Update the success button to use the dynamic redirect path
  const renderSuccessContent = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-green-900/20 rounded-full p-4 mb-4">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Email verified successfully!</h2>
      <p className="text-gray-400 mb-4">
        Your email has been verified. You'll be redirected in a moment.
      </p>
      <Alert variant="default" className="bg-gray-800 border-gray-700 mb-6">
        <AlertTitle>Redirecting you...</AlertTitle>
        <AlertDescription>
          You'll be redirected automatically in a few seconds.
        </AlertDescription>
      </Alert>
      <Button 
        onClick={() => navigate(redirectPath)}
        className="bg-primary hover:bg-primary/90 px-8 py-2"
      >
        {redirectPath.includes('dashboard') ? 'Go to Dashboard' : 'Continue to onboarding'}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 md:p-8">
      <div className="self-start mb-12">
        <ScripeLogotype />
      </div>
      
      <div className="max-w-md w-full text-center">
        {!token ? (
          // No token - show verification instructions
          <>
            <h1 className="text-3xl font-bold mb-6">Check your inbox</h1>
            <p className="text-gray-400 mb-8">
              We've sent a verification link to {email || 'your email address'}. 
              Please check your inbox and click the link to verify your account.
            </p>
            <p className="text-gray-500 mb-8">
              The email should arrive within a few minutes. If you don't see it, check your spam folder.
            </p>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleResendVerification}
                disabled={resendDisabled}
                className="bg-gray-800 hover:bg-gray-700 px-8 py-2"
              >
                {resendDisabled 
                  ? `Resend email (${resendCountdown}s)` 
                  : 'Resend verification email'}
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="px-8 py-2"
              >
                Return to login
              </Button>
            </div>
          </>
        ) : (
          // Token provided - show verification status
          loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verifying your email</h2>
              <p className="text-gray-400">Please wait while we verify your email address...</p>
            </div>
          ) : verificationResult === 'success' ? (
            // Success state
            renderSuccessContent()
          ) : (
            // Error state
            <div className="flex flex-col items-center justify-center">
              <div className="bg-red-900/20 rounded-full p-4 mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verification failed</h2>
              <p className="text-gray-400 mb-4">{error || 'An error occurred during verification.'}</p>
              <Alert variant="destructive" className="bg-red-900/20 border-red-900 mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  The verification link may be expired or invalid. Please try again or request a new verification email.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4">
                <Button 
                  onClick={handleResendVerification}
                  disabled={resendDisabled}
                  className="bg-primary hover:bg-primary/90 px-6 py-2"
                >
                  {resendDisabled 
                    ? `Resend (${resendCountdown}s)` 
                    : 'Resend verification email'}
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Return to login
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
} 