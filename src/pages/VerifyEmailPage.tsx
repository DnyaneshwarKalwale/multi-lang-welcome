import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SekcionLogotype } from '@/components/ScripeIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/services/api';
import { AlertCircle, CheckCircle2, Loader2, Twitter, Mail, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [email] = useState<string | null>(location.state?.email || localStorage.getItem('pendingVerificationEmail') || null);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // References for OTP input fields
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  
  // Legacy token verification for backward compatibility
  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
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
      };
      
      verifyToken();
    }
  }, [token, navigate]);
  
  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;
    
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Check if all digits are filled
    if (newOtpDigits.every(digit => digit !== '') && newOtpDigits.join('').length === 6) {
      verifyOtp(newOtpDigits.join(''));
    }
  };
  
  // Handle key press in OTP inputs
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle pasting OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.slice(0, 6).split('');
    const newOtpDigits = [...otpDigits];
    
    digits.forEach((digit, index) => {
      if (index < 6) newOtpDigits[index] = digit;
    });
    
    setOtpDigits(newOtpDigits);
    
    // Focus on the appropriate input
    if (digits.length < 6) {
      inputRefs.current[digits.length]?.focus();
    } else {
      inputRefs.current[5]?.focus();
      // Verify OTP automatically
      setTimeout(() => verifyOtp(newOtpDigits.join('')), 100);
    }
  };
  
  // Verify the entered OTP code
  const verifyOtp = async (otp: string) => {
    if (!email) {
      toast.error('Email address is missing. Please go back to login.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await authApi.verifyOTP(email, otp);
      
      // Success
      setVerificationResult('success');
      localStorage.setItem('token', response.token);
      localStorage.removeItem('pendingVerificationEmail');
      
      // After 2 seconds, redirect to onboarding
      setTimeout(() => {
        navigate('/onboarding/welcome');
      }, 2000);
    } catch (err: any) {
      setVerificationResult('error');
      setError(err.response?.data?.error || 'Verification failed. Please check your code and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Resend OTP to email
  const resendOtp = async () => {
    if (!email) {
      toast.error('Email address is missing. Please go back to login.');
      return;
    }
    
    try {
      setResendDisabled(true);
      setCountdown(60); // Disable for 60 seconds
      
      const response = await authApi.resendOTP(email);
      toast.success('A new verification code has been sent to your email');
      
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to resend code. Please try again.');
      setResendDisabled(false);
    }
  };
  
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
          <SekcionLogotype className="h-8 text-blue-500" />
          <Twitter className="absolute -top-1 -right-6 text-blue-500 bg-white dark:bg-gray-900 p-1 rounded-full w-5 h-5 shadow-sm" />
        </div>
      </motion.div>
      
      <motion.div 
        className="max-w-md w-full flex flex-col items-center"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {token ? (
          // Legacy token verification UI
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
                  Request new code
                </Button>
              </div>
            </div>
          )
        ) : loading ? (
          // Loading state for OTP verification
          <div className="flex flex-col items-center justify-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 mb-6">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Verifying your code</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">Please wait while we verify your code...</p>
            <div className="w-full max-w-sm bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        ) : verificationResult === 'success' ? (
          // Success state for OTP verification
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
        ) : verificationResult === 'error' ? (
          // Error state for OTP verification
          <div className="flex flex-col items-center justify-center">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Verification failed</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{error || 'Invalid verification code.'}</p>
            <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-8 text-red-800 dark:text-red-300">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                The verification code is incorrect or has expired. Please check your email for the latest code or request a new one.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button 
                onClick={() => {
                  setVerificationResult('pending');
                  setOtpDigits(Array(6).fill(''));
                  setError(null);
                }}
                variant="outline"
                rounded="full"
                className="flex-1 py-3 border-gray-300 dark:border-gray-700"
              >
                Try again
              </Button>
              <Button 
                onClick={resendOtp}
                variant="twitter"
                rounded="full"
                className="flex-1 py-3 font-bold"
                disabled={resendDisabled}
              >
                {resendDisabled ? `Resend code (${countdown}s)` : 'Resend code'}
              </Button>
            </div>
          </div>
        ) : (
          // OTP entry form
          <>
            <div className="bg-blue-100 rounded-full p-4 mb-6">
              <Mail className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Verify your email</h1>
            <p className="text-gray-600 mb-8 text-center">
              We've sent a verification code to <span className="font-bold text-blue-500">{email || 'your email address'}</span>. 
              Enter the 6-digit code below to verify your account.
            </p>
            <div className="bg-white rounded-xl p-6 border border-gray-200 w-full mb-8">
              <p className="text-gray-600 text-sm mb-4">
                <span className="font-bold">Enter the code from your email</span>
              </p>
              
              {/* OTP Input */}
              <div className="flex gap-2 mb-6 justify-center" onPaste={handlePaste}>
                {otpDigits.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    className="w-12 h-12 text-center text-xl font-bold bg-white"
                    maxLength={1}
                    value={digit}
                    ref={el => inputRefs.current[index] = el}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500">
                Didn't receive a code? Check your spam folder or request a new code.
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
                onClick={resendOtp}
                variant="twitter"
                rounded="full"
                className="flex-1 py-3 font-bold"
                disabled={resendDisabled}
              >
                {resendDisabled ? `Resend code (${countdown}s)` : 'Resend code'}
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
} 