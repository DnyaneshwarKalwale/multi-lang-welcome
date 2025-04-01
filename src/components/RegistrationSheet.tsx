import React, { useState } from "react";
import { X, Twitter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginSheet } from "./LoginSheet";
import { motion } from "framer-motion";

interface RegistrationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RegistrationSheet({ open, onOpenChange, onSuccess }: RegistrationSheetProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { register, error, clearError, loading, twitterAuth } = useAuth();
  
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
    
    if (firstName && lastName && email && password) {
      await register(firstName, lastName, email, password);
      if (onSuccess) onSuccess();
      onOpenChange(false);
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
        <SheetContent side={isMobile ? "bottom" : "right"} className="bg-gray-900 border-gray-800 p-0 w-full sm:max-w-md">
          <motion.div 
            className="bg-gray-900 p-6 sm:p-8 rounded-xl w-full h-full overflow-y-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-8">
              <motion.h2 
                className="text-2xl font-bold text-white"
                variants={itemVariants}
              >
                Create your account
              </motion.h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
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
            
            <div className="space-y-5 mb-7">
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full py-6 flex justify-center gap-2 bg-transparent border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200" 
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
                  <span>Continue with Google</span>
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full py-6 flex justify-center gap-2 bg-transparent border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200" 
                  onClick={handleTwitterAuth}
                  disabled={loading}
                >
                  <Twitter size={20} className="text-[#1DA1F2]" />
                  <span>Continue with Twitter</span>
                </Button>
              </motion.div>
            </div>
            
            <motion.div className="relative mb-7" variants={itemVariants}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500 uppercase text-xs tracking-wider">Or continue with email</span>
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
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1.5">First name</label>
                  <div className="relative">
                    <Input 
                      id="firstName" 
                      placeholder="Enter your first name" 
                      className="bg-gray-800 border-gray-700 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1.5">Last name</label>
                  <div className="relative">
                    <Input 
                      id="lastName" 
                      placeholder="Enter your last name" 
                      className="bg-gray-800 border-gray-700 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
              </div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="bg-gray-800 border-gray-700 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Create a secure password (min. 8 characters)" 
                    className="bg-gray-800 border-gray-700 h-12 pl-4 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
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
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-12 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : 'Create account'}
                </Button>
              </motion.div>
            </motion.form>
            
            <motion.p 
              className="text-center mt-8 text-sm text-gray-500"
              variants={itemVariants}
            >
              Already have an account?{' '}
              <a 
                href="#" 
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium" 
                onClick={handleLogin}
              >
                Log in
              </a>
            </motion.p>
            
            <motion.p
              className="text-center mt-6 text-xs text-gray-600"
              variants={itemVariants}
            >
              By continuing, you agree to our{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</a>.
            </motion.p>

            {/* Add note about progress saving */}
            <motion.div 
              className="mt-8 flex items-center justify-center px-4 py-3 bg-indigo-900/20 border border-indigo-800/30 rounded-lg"
              variants={itemVariants}
            >
              <svg className="flex-shrink-0 w-5 h-5 mr-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-indigo-200">
                Your progress is automatically saved. You can continue from where you left off next time.
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
