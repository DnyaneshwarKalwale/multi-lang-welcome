import React, { useState } from "react";
import { X, Twitter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { motion } from "framer-motion";
import { SekcionIconRounded } from "@/components/ScripeIcon";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/useLanguage";
import { toast } from "sonner";

interface LoginSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LoginSheet({ open, onOpenChange, onSuccess }: LoginSheetProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { login, error, clearError, loading } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openRegistrationSheet, setOpenRegistrationSheet] = useState(false);
  
  const handleGoogleAuth = () => {
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    onOpenChange(false);
    toast.info("Redirecting to Google authentication...");
    
    window.location.href = `${baseUrl}/api/auth/google`;
  };
  
  const handleTwitterAuth = () => {
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    onOpenChange(false);
    toast.info("Redirecting to Twitter authentication...");
    
    window.location.href = `${baseUrl}/api/auth/twitter`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (email && password) {
      try {
        onOpenChange(false);
        const toastId = toast.loading("Signing you in...");
        
        await login(email, password);
        
        toast.dismiss(toastId);
        
        const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
        
        if (onboardingCompleted) {
          navigate('/dashboard', { replace: true });
          toast.success("Welcome back!");
        } else {
          navigate("/onboarding/welcome", { replace: true });
        }
      } catch (err) {
        console.error("Login error:", err);
        onOpenChange(true);
        toast.error("Login failed. Please try again.");
      }
    }
  };
  
  const handleClose = () => {
    clearError();
    onOpenChange(false);
  };
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
    setTimeout(() => {
      setOpenRegistrationSheet(true);
    }, 300);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side={isMobile ? "bottom" : "right"} className="bg-gradient-to-b from-primary-50/80 to-white dark:from-gray-900 dark:to-gray-950 border-primary-100 dark:border-gray-800 p-0 w-full sm:max-w-md">
          <motion.div 
            className="p-6 sm:p-8 rounded-xl w-full h-full overflow-y-auto overflow-x-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <motion.div 
                className="flex items-center gap-3"
                variants={itemVariants}
              >
                <SekcionIconRounded className="w-10 h-10 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('loginToScripe') || 'Log in to Scripe'}
                </h2>
              </motion.div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full"
              >
                <X size={18} />
              </Button>
            </div>
            
            {error && (
              <motion.div variants={itemVariants}>
                <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-900 text-red-600 dark:text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            <div className="space-y-4 mb-7">
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full h-12 flex justify-center gap-2 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-gray-700 dark:text-white" 
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
                  <span>{t('continueWithGoogle') || 'Continue with Google'}</span>
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full h-12 flex justify-center gap-2 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-gray-700 dark:text-white" 
                  onClick={handleTwitterAuth}
                  disabled={loading}
                >
                  <Twitter size={18} className="text-primary-500" />
                  <span>{t('continueWithTwitter') || 'Continue with Twitter'}</span>
                </Button>
              </motion.div>
            </div>
            
            <motion.div className="relative mb-7" variants={itemVariants}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">{t('orContinueWithEmail') || 'Or continue with email'}</span>
              </div>
            </motion.div>
            
            <motion.form 
              className="space-y-5" 
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('email') || 'Email'}</label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="bg-white/80 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 h-12 pl-4 
                               focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-500 
                               transition-all text-gray-900 dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('password') || 'Password'}</label>
                  <a href="#" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">{t('forgotPassword') || 'Forgot password?'}</a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder={t('enterYourPassword') || 'Enter your password'}
                    className="bg-white/80 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 h-12 pl-4 
                               focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-500 
                               transition-all text-gray-900 dark:text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium h-12 rounded-md transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('loggingIn') || 'Logging in...'}
                    </div>
                  ) : t('logIn') || 'Log in'}
                </Button>
              </motion.div>
            </motion.form>
            
            <motion.p 
              className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400"
              variants={itemVariants}
            >
              {t('dontHaveAccount') || "Don't have an account?"}{' '}
              <a 
                href="#" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors font-medium" 
                onClick={handleSignUp}
              >
                {t('signUpForFree') || 'Sign up for free'}
              </a>
            </motion.p>
          </motion.div>
        </SheetContent>
      </Sheet>
      
      {openRegistrationSheet && (
        <RegistrationSheet 
          open={openRegistrationSheet}
          onOpenChange={setOpenRegistrationSheet}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
