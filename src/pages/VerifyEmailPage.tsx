import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ScripeLogotype } from '@/components/ScripeIcon';
import { Button } from '@/components/ui/button';
import { authApi } from '@/services/api';
import { AlertCircle, CheckCircle2, Loader2, Twitter, Mail, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [email] = useState<string | null>(location.state?.email || null);

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
          
          // After 2 seconds, redirect to onboarding
          setTimeout(() => {
            navigate('/onboarding/welcome');
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
  }, [token, navigate]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-6 md:p-8 relative">
      {/* Twitter-inspired background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 dark:bg-blue-900/30 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-800/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
      </div>
      
      <motion.div 
        className="self-start mb-8 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          rounded="full"
          className="mr-4 flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="relative">
          <ScripeLogotype className="h-8 text-blue-500" />
          <Twitter className="absolute -top-1 -right-6 text-blue-500 bg-white dark:bg-gray-900 p-1 rounded-full w-5 h-5 shadow-sm" />
        </div>
      </motion.div>
      
      <motion.div 
        className="max-w-md w-full flex flex-col items-center"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {!token ? (
          // No token - show verification instructions
          <>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 mb-6">
              <Mail className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Check your inbox</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
              We've sent a verification link to <span className="font-bold text-blue-500">{email || 'your email address'}</span>. 
              Please check your inbox and click the link to verify your account.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 w-full mb-8">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                <span className="font-bold">The email should arrive within a few minutes.</span> If you don't see it, check your spam folder or try the options below.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-sm text-gray-500 dark:text-gray-400">
                Can't find the email? Check your spam folder or request a new verification link.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                rounded="full"
                className="flex-1 py-3 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
              >
                Return to login
              </Button>
              <Button 
                onClick={() => {/* Request new verification email */}}
                variant="twitter"
                rounded="full"
                className="flex-1 py-3 font-bold"
              >
                Resend email
              </Button>
            </div>
          </>
        ) : (
          // Token provided - show verification status
          loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 mb-6">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Verifying your email</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">Please wait while we verify your email address...</p>
              <div className="w-full max-w-sm bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          ) : verificationResult === 'success' ? (
            // Success state
            <div className="flex flex-col items-center justify-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Email verified successfully!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Your email has been verified. You'll be redirected to continue the onboarding process.</p>
              <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-6 text-blue-800 dark:text-blue-300">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertTitle>Redirecting you...</AlertTitle>
                </div>
                <AlertDescription>
                  You'll be redirected automatically in a few seconds.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => navigate('/onboarding/welcome')}
                variant="twitter"
                rounded="full"
                className="py-3 px-8 font-bold"
              >
                Continue to onboarding
              </Button>
            </div>
          ) : (
            // Error state
            <div className="flex flex-col items-center justify-center">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-6">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Verification failed</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{error || 'An error occurred during verification.'}</p>
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-8 text-red-800 dark:text-red-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  The verification link may be expired or invalid. Please try again or request a new verification email.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  rounded="full"
                  className="flex-1 py-3 border-gray-300 dark:border-gray-700"
                >
                  Return to login
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="twitter"
                  rounded="full"
                  className="flex-1 py-3 font-bold"
                >
                  Request new link
                </Button>
              </div>
            </div>
          )
        )}
      </motion.div>
    </div>
  );
} 