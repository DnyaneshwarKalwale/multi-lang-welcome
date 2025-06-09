import React, { useState } from "react";
import { Linkedin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginSheet } from "./LoginSheet";
import { motion, AnimatePresence } from "framer-motion";
import { BrandOutIcon, BrandOutLogotype } from "@/components/BrandOutIcon";
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
    // Get the base API URL and normalize it
    let baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
    
    // Remove trailing slashes and /api suffix to get the clean base URL
    baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    
    // Close the registration sheet immediately
    onOpenChange(false);
    
    // Construct the clean Google auth URL
    const loginUrl = `${baseUrl}/api/auth/google`;
    
    console.log('Google OAuth URL (registration):', loginUrl);
    window.location.href = loginUrl;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (firstName && email && password) {
      try {
        // Register the user - lastName is optional
        await register(firstName, lastName || '', email, password);
        
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
    }, 100);
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
      <AnimatePresence>
        {open && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-start justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />
            
            <motion.div 
              className="w-full h-full flex flex-col z-50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* Left side with content and branding - hidden on mobile */}
                <div className="hidden md:flex flex-col relative bg-gradient-to-br from-primary/10 to-slate-900 text-white">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-900"
                    style={{
                      backgroundImage: "radial-gradient(circle at 25% 25%, rgba(74, 76, 252, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(74, 76, 252, 0.1) 0%, transparent 50%)"
                    }}
                  />
                  
                  <div className="relative z-10 p-8">
                    <a href="/" className="inline-block" onClick={(e) => {
                      e.preventDefault();
                      onOpenChange(false);
                      navigate('/');
                    }}>
                      <BrandOutIcon className="w-10 h-10" />
                    </a>
                  </div>
                  
                  <div className="flex-1 relative z-10 flex flex-col justify-center px-12 pb-12">
                    <div className="space-y-6 max-w-md">
                      <h1 className="text-3xl font-bold">Not a Generic AI Content Tool</h1>
                      <p className="text-lg text-white/80">
                        It's like working with an experienced marketer who knows your brand inside out.
                      </p>
                      
                      <div className="pt-4">
                        <div className="flex -space-x-2">
                          <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/72.jpg" alt="User" />
                          <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                          <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/45.jpg" alt="User" />
                          <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/67.jpg" alt="User" />
                          <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/52.jpg" alt="User" />
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-sm mt-1 text-white/90">Loved by founders, freelancers and professionals.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right side with registration form */}
                <div className="h-full flex flex-col bg-white overflow-y-auto">
                  <div className="md:hidden p-6">
                    <a href="/" className="inline-block" onClick={(e) => {
                      e.preventDefault();
                      onOpenChange(false);
                      navigate('/');
                    }}>
                      <BrandOutIcon className="w-8 h-8" />
                    </a>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center p-6 md:p-8">
                    <motion.div 
                      className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
                      <motion.div variants={itemVariants} className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {t('create account') || 'Create your account'}
                </h2>
                        <p className="text-gray-600">
                          {t('signup text') || 'Sign up for a new account to get started.'}
                        </p>
              </motion.div>
            
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
                            <span>{t('continue with google') || 'Continue with Google'}</span>
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full h-12 flex justify-center gap-2 bg-white border-gray-200 hover:bg-blue-50 transition-all duration-200 text-gray-700 shadow-sm" 
                  onClick={() => {
                    // Get the base API URL and normalize it
                    let baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
                    
                    // Remove trailing slashes and /api suffix to get the clean base URL
                    baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
                    
                    // Close the registration sheet immediately
                    onOpenChange(false);
                    
                    // Construct the clean LinkedIn auth URL
                    const loginUrl = `${baseUrl}/api/auth/linkedin-direct`;
                    
                    console.log('LinkedIn OAuth URL (registration):', loginUrl);
                    window.location.href = loginUrl;
                  }}
                  disabled={loading}
                >
                  <Linkedin size={18} className="text-[#0077B5]" />
                            <span>{t('continue with linkedin') || 'Continue with LinkedIn'}</span>
                </Button>
              </motion.div>
            </div>
            
            <motion.div className="relative mb-8" variants={itemVariants}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500 uppercase text-xs tracking-wider">OR CONTINUE WITH</span>
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
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">{t('first name') || 'First Name'}</label>
                  <div className="relative">
                    <Input 
                      id="firstName" 
                                placeholder={t('enter first name') || 'Enter your first name'}
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
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">{t('last name') || 'Last Name'} <span className="text-gray-400 text-xs">(Optional)</span></label>
                  <div className="relative">
                    <Input 
                      id="lastName" 
                                placeholder={t('enter last name') || 'Enter your last name (optional)'}
                      className="bg-white border-gray-200 h-12 pl-4 
                                 focus:border-primary focus:ring-primary 
                                 transition-all text-gray-900 shadow-sm"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </motion.div>
              </div>
              
              <motion.div variants={itemVariants}>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">{t('email') || 'Email Address'}</label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                              placeholder="Enter your email" 
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
                              placeholder={t('create secure password') || 'Create a secure password (min. 8 characters)'}
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
                                {t('creating account') || 'Creating account...'}
                    </div>
                            ) : t('sign up') || 'Sign up'}
                </Button>
              </motion.div>
            </motion.form>
            
            <motion.p 
                        className="text-center mt-6 text-sm text-gray-500"
              variants={itemVariants}
            >
                        {t('already have account') || 'Already have an account?'}{' '}
              <a 
                href="#" 
                className="text-primary hover:text-primary-600 transition-colors font-medium" 
                onClick={handleLogin}
              >
                          {t('log in') || 'Log in'}
              </a>
            </motion.p>
            
            <motion.p
                        className="text-center mt-5 text-xs text-gray-600"
              variants={itemVariants}
            >
                        {t('by connecting') || 'By continuing, you agree to our'}{' '}
              <a href="#" className="text-primary hover:text-primary-600 underline">
                          {t('terms of service') || 'Terms of Service'}
              </a>
              {' '}{t('and') || 'and'}{' '}
              <a href="#" className="text-primary hover:text-primary-600 underline">
                          {t('privacy policy') || 'Privacy Policy'}
              </a>.
            </motion.p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
