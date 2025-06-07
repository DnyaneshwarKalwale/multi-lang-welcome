import React, { useState } from "react";
import { Linkedin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { motion, AnimatePresence } from "framer-motion";
import { BrandOutIcon, BrandOutLogotype } from "@/components/BrandOutIcon";
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
  const { t } = useLanguage();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openRegistrationSheet, setOpenRegistrationSheet] = useState(false);
  
  const handleGoogleAuth = () => {
    // Get the base API URL and normalize it
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // Remove trailing slashes and /api suffix to get the clean base URL
    baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    
    onOpenChange(false);
    toast.info("Redirecting to Google authentication...");
    
    // Construct the clean Google auth URL
    const loginUrl = `${baseUrl}/api/auth/google`;
    
    console.log('Google OAuth URL (login sheet):', loginUrl);
    window.location.href = loginUrl;
  };
  
  const handleLinkedInAuth = () => {
    // Get the base API URL and normalize it
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // Remove trailing slashes and /api suffix to get the clean base URL
    baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    
    onOpenChange(false);
    toast.info("Redirecting to LinkedIn authentication...");
    
    // Construct the clean LinkedIn auth URL
    const loginUrl = `${baseUrl}/api/auth/linkedin-direct`;
    
    console.log('LinkedIn OAuth URL (login sheet):', loginUrl);
    window.location.href = loginUrl;
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
    }, 100);
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
                
                {/* Right side with login form */}
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
                          {t('welcome back') || 'Welcome back'}
                        </h2>
                        <p className="text-gray-600">
                          {t('dont have account') || "If you don't have an account yet, you can"}{' '}
                          <a 
                            href="#" 
                            className="text-primary hover:text-primary-600 transition-colors font-medium" 
                            onClick={handleSignUp}
                          >
                            {t('create one') || 'create one'}
                          </a>
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
                            <span>{t('continue with google') || 'Log in with Google'}</span>
                          </Button>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                          <Button 
                            variant="outline" 
                            className="w-full h-12 flex justify-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700 shadow-sm" 
                            onClick={handleLinkedInAuth}
                            disabled={loading}
                          >
                            <Linkedin size={18} className="text-[#0077B5]" />
                            <span>{t('continue with linkedin') || 'Log in with LinkedIn'}</span>
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
                        <motion.div variants={itemVariants}>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
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
                          <div className="flex items-center justify-between mb-1.5">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('password') || 'Password'}</label>
                            <a href="#" className="text-xs text-primary hover:text-primary-600 transition-colors">{t('forgot password') || 'Forgot password?'}</a>
                          </div>
                          <div className="relative">
                            <Input 
                              id="password" 
                              type="password" 
                              placeholder={t('enter your password') || 'Enter your password'}
                              className="bg-white border-gray-200 h-12 pl-4 
                                         focus:border-primary focus:ring-primary 
                                         transition-all text-gray-900 shadow-sm"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
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
                                {t('logging in') || 'Logging in...'}
                              </div>
                            ) : t('log in') || 'Log in with Email'}
                          </Button>
                        </motion.div>
                      </motion.form>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
