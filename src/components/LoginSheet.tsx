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
                      
                      <div className="space-y-4">
                        <motion.div variants={itemVariants}>
                          <Button 
                            variant="outline" 
                            className="w-full h-12 flex justify-center gap-3 bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700 shadow-sm" 
                            onClick={handleGoogleAuth}
                            disabled={loading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                            <span className="text-lg font-medium">Google</span>
                          </Button>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                          <Button 
                            variant="outline" 
                            className="w-full h-12 flex justify-center gap-3 bg-white border-gray-200 hover:bg-[#0077B5]/10 transition-all duration-200 text-gray-700 shadow-sm" 
                            onClick={handleLinkedInAuth}
                            disabled={loading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0077B5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            <span className="text-lg font-medium">LinkedIn</span>
                          </Button>
                        </motion.div>
                      </div>
                      
                      <motion.p 
                        className="text-center mt-6 text-sm text-gray-500"
                        variants={itemVariants}
                      >
                        {t('dont have account') || "Don't have an account?"}{' '}
                        <a 
                          href="#" 
                          className="text-primary hover:text-primary-600 transition-colors font-medium" 
                          onClick={handleSignUp}
                        >
                          {t('create one') || 'Create one'}
                        </a>
                      </motion.p>
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