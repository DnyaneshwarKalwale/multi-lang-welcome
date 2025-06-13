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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // Remove trailing slashes and /api suffix to get the clean base URL
    baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    
    // Close the registration sheet immediately
    onOpenChange(false);
    
    // Construct the clean Google auth URL
    const loginUrl = `${baseUrl}/api/auth/google`;
    
    console.log('Google OAuth URL (registration):', loginUrl);
    window.location.href = loginUrl;
  };
  
  const handleLinkedInAuth = () => {
    // Get the backend URL from environment variable or fallback to Render deployed URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Store current URL in localStorage to redirect back after LinkedIn connection
    localStorage.setItem('redirectAfterAuth', '/dashboard');
    
    // Store that this is a direct LinkedIn registration attempt
    localStorage.setItem('linkedin-login-type', 'direct');
    
    // Redirect to LinkedIn OAuth endpoint
    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
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
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-md w-[95vw] max-w-[95vw] overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <SheetHeader>
              <SheetTitle>Create Account</SheetTitle>
              <SheetDescription>
                Sign up to get started with your account
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-4">
                <Button 
                  variant="outline" 
                className="w-full h-12 flex items-center gap-2"
                  onClick={handleGoogleAuth}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
                </Button>
              
                <Button 
                  variant="outline" 
                className="w-full h-12 flex items-center gap-2"
                onClick={handleLinkedInAuth}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
                </Button>
            </div>
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
