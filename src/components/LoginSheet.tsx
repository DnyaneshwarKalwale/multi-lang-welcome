import React, { useState } from "react";
import { X, Twitter, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

interface LoginSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LoginSheet({ open, onOpenChange, onSuccess }: LoginSheetProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { login, error, clearError, loading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Add state for registration sheet navigation
  const [openRegistrationSheet, setOpenRegistrationSheet] = useState(false);
  
  // Handle Google auth
  const handleGoogleAuth = () => {
    // Get the backend URL from environment variable or fallback to Render deployed URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Redirect to backend Google auth endpoint with the dynamic URL
    window.location.href = `${baseUrl}/api/auth/google`;
  };
  
  // Handle Twitter auth
  const handleTwitterAuth = () => {
    // Get the backend URL from environment variable or fallback to Render deployed URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Redirect to backend Twitter auth endpoint
    window.location.href = `${baseUrl}/api/auth/twitter`;
    onOpenChange(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (email && password) {
      try {
        await login(email, password);
        
        // Check if the login was successful before proceeding
        if (!error) {
          // After login, get the saved onboarding step from localStorage
          const savedStep = localStorage.getItem('onboardingStep');
          const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
          
          // If we have a saved step and onboarding is not completed, redirect to that step
          if (savedStep && !onboardingCompleted) {
            navigate(`/onboarding/${savedStep}`);
          } else if (onboardingCompleted) {
            // If onboarding is completed, navigate to dashboard
            navigate('/dashboard');
          } else {
            // If no saved step, start at the beginning of onboarding or use success callback
            if (onSuccess) onSuccess();
            else navigate("/onboarding/welcome");
          }
          
          // Close the login sheet
          onOpenChange(false);
        }
      } catch (err) {
        // Login error is already handled by the auth context
        console.error("Login error:", err);
      }
    }
  };
  
  const handleClose = () => {
    clearError();
    onOpenChange(false);
  };
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Close login sheet
    onOpenChange(false);
    // Open registration sheet with a small delay to allow for the transition
    setTimeout(() => {
      setOpenRegistrationSheet(true);
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
        <SheetContent side={isMobile ? "bottom" : "right"} className="bg-black border-gray-800 p-0 w-full sm:max-w-md">
          <motion.div 
            className="bg-gradient-to-b from-gray-900 to-black p-6 sm:p-8 rounded-xl w-full h-full overflow-y-auto overflow-x-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <motion.div 
                className="flex items-center gap-3"
                variants={itemVariants}
              >
                <ScripeIconRounded className="w-10 h-10" />
                <h2 className="text-2xl font-bold text-white">
                  Log in to Scripe
                </h2>
              </motion.div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose}
                className="text-gray-400 hover:text-white rounded-full"
              >
                <X size={18} />
              </Button>
            </div>
            
            {error && (
              <motion.div variants={itemVariants}>
                <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-900 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            <div className="space-y-4 mb-7">
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="relative w-full h-12 flex justify-center gap-2 bg-transparent border-gray-800 hover:bg-gray-800/40 hover:border-gray-700 transition-all duration-200 overflow-hidden rounded-lg text-white" 
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 text-white">Continue with Google</span>
                  <motion.div 
                    className="absolute inset-0 bg-white/5" 
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="relative w-full h-12 flex justify-center gap-2 bg-transparent border-gray-800 hover:bg-gray-800/40 hover:border-gray-700 transition-all duration-200 overflow-hidden rounded-lg text-white" 
                  onClick={handleTwitterAuth}
                  disabled={loading}
                >
                  <Twitter size={18} className="text-[#1DA1F2] relative z-10" />
                  <span className="relative z-10 text-white">Continue with Twitter</span>
                  <motion.div 
                    className="absolute inset-0 bg-white/5" 
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </motion.div>
            </div>
            
            <motion.div className="relative mb-7" variants={itemVariants}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400 uppercase text-xs tracking-wider">Or continue with email</span>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="bg-gray-900/50 border-gray-800 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all rounded-lg text-white placeholder:text-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                  <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    className="bg-gray-900/50 border-gray-800 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all rounded-lg text-white placeholder:text-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Log in</span>
                  )}
                </Button>
              </motion.div>
            </motion.form>
            
            <motion.div 
              className="flex justify-center mt-7 text-sm text-gray-300"
              variants={itemVariants}
            >
              <p>
                Don't have an account? <button onClick={handleSignUp} className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign up</button>
              </p>
            </motion.div>
          </motion.div>
        </SheetContent>
      </Sheet>
      
      {/* Registration Sheet */}
      <RegistrationSheet 
        open={openRegistrationSheet}
        onOpenChange={setOpenRegistrationSheet}
        onSuccess={onSuccess}
      />
    </>
  );
}
