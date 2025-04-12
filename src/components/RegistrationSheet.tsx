import React, { useState } from "react";
import { X, Linkedin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginSheet } from "./LoginSheet";
import { motion } from "framer-motion";
import { BrandOutIcon } from "@/components/BrandOutIcon";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/useLanguage";

interface RegistrationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RegistrationSheet({ open, onOpenChange, onSuccess }: RegistrationSheetProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { register, error, clearError, loading } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Add state for login sheet navigation
  const [openLoginSheet, setOpenLoginSheet] = useState(false);
  
  // Handle Google auth
  const handleGoogleAuth = () => {
    // Get the backend URL from environment variable or fallback to Render deployed URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Close the registration sheet immediately
    onOpenChange(false);
    
    // Redirect to backend Google auth endpoint with the dynamic URL
    window.location.href = `${baseUrl}/api/auth/google`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (firstName && lastName && email && password) {
      try {
        // Register the user
        await register(firstName, lastName, email, password);
        
        // Close the registration sheet
        onOpenChange(false);
        
        // Navigate to email verification page
        // The register function in AuthContext already handles redirecting to the verify-email page
        // and storing the email in localStorage
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };
  
  const handleClose = () => {
    clearError();
    onOpenChange(false);
  }
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Close registration sheet
    onOpenChange(false);
    // Open login sheet with a small delay to allow for the transition
    setTimeout(() => {
      setOpenLoginSheet(true);
    }, 300);
  };
  
  // Animation variants
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
        <SheetContent side={isMobile ? "bottom" : "right"} className="bg-white border-none p-0 w-full sm:max-w-md overflow-hidden">
          <motion.div 
            className="p-6 sm:p-8 rounded-xl w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-blue-50 to-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-8">
              <motion.div 
                className="flex items-center gap-3"
                variants={itemVariants}
              >
                <BrandOutIcon className="w-12 h-12" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('createAccount') || 'Create your account'}
                </h2>
              </motion.div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 rounded-full"
              >
                <X size={20} />
              </Button>
            </div>
            
            {error && (
              <motion.div variants={itemVariants}>
                <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            <div className="space-y-4 mb-8">
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full h-12 flex justify-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700 shadow-sm" 
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
                  className="w-full h-12 flex justify-center gap-2 bg-white border-gray-200 hover:bg-blue-50 transition-all duration-200 text-gray-700 shadow-sm" 
                  onClick={() => {
                    // Get the backend URL from environment variable or fallback to Render deployed URL
                    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
                    const baseUrl = baseApiUrl.replace('/api', '');
                    
                    // Close the registration sheet immediately
                    onOpenChange(false);
                    
                    // Redirect to backend direct LinkedIn auth endpoint
                    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
                  }}
                  disabled={loading}
                >
                  <Linkedin size={18} className="text-[#0077B5]" />
                  <span>{t('continueWithLinkedIn') || 'Continue with LinkedIn'}</span>
                </Button>
              </motion.div>
            </div>
            
            <motion.div className="relative mb-8" variants={itemVariants}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 uppercase text-xs tracking-wider">{t('orContinueWithEmail') || 'Or continue with email'}</span>
              </div>
            </motion.div>
            
            <motion.form 
              className="space-y-5" 
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div variants={itemVariants}>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">{t('firstName') || 'First name'}</label>
                  <div className="relative">
                    <Input 
                      id="firstName" 
                      placeholder={t('enterFirstName') || 'Enter your first name'}
                      className="bg-white border-gray-200 h-12 pl-4 
                                 focus:border-primary focus:ring-primary 
                                 transition-all text-gray-900 shadow-sm"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">{t('lastName') || 'Last name'}</label>
                  <div className="relative">
                    <Input 
                      id="lastName" 
                      placeholder={t('enterLastName') || 'Enter your last name'}
                      className="bg-white border-gray-200 h-12 pl-4 
                                 focus:border-primary focus:ring-primary 
                                 transition-all text-gray-900 shadow-sm"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
              </div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">{t('email') || 'Email'}</label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="bg-white border-gray-200 h-12 pl-4 
                               focus:border-primary focus:ring-primary 
                               transition-all text-gray-900 shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">{t('password') || 'Password'}</label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder={t('createSecurePassword') || 'Create a secure password (min. 8 characters)'}
                    className="bg-white border-gray-200 h-12 pl-4 
                               focus:border-primary focus:ring-primary 
                               transition-all text-gray-900 shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-600 text-white font-medium h-12 rounded-md transition-all duration-200 shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('creatingAccount') || 'Creating account...'}
                    </div>
                  ) : t('createAccount') || 'Create account'}
                </Button>
              </motion.div>
            </motion.form>
            
            <motion.p 
              className="text-center mt-8 text-sm text-gray-500"
              variants={itemVariants}
            >
              {t('alreadyHaveAccount') || 'Already have an account?'}{' '}
              <a 
                href="#" 
                className="text-primary hover:text-primary-600 transition-colors font-medium" 
                onClick={handleLogin}
              >
                {t('logIn') || 'Log in'}
              </a>
            </motion.p>
            
            <motion.p
              className="text-center mt-6 text-xs text-gray-600"
              variants={itemVariants}
            >
              {t('byConnecting') || 'By continuing, you agree to our'}{' '}
              <a href="#" className="text-primary hover:text-primary-600 underline">
                {t('termsService') || 'Terms of Service'}
              </a>
              {' '}{t('and') || 'and'}{' '}
              <a href="#" className="text-primary hover:text-primary-600 underline">
                {t('privacyPolicy') || 'Privacy Policy'}
              </a>.
            </motion.p>

            <motion.div 
              className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100 mt-8 mb-2"
              variants={itemVariants}
            >
              <Linkedin className="flex-shrink-0 w-5 h-5 mr-3 text-[#0077B5]" />
              <p className="text-sm text-gray-700">
                {t('connectLinkedInPrompt') || 'Connect your LinkedIn account to share content directly from BrandOut to your professional network.'}
              </p>
            </motion.div>
          </motion.div>
        </SheetContent>
      </Sheet>
      
      {/* Add the login sheet */}
      {openLoginSheet && (
        <LoginSheet 
          open={openLoginSheet}
          onOpenChange={setOpenLoginSheet}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
