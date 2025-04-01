import React, { useState } from "react";
import { X, Twitter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginSheet({ open, onOpenChange, onSuccess, onSwitchToRegister }: LoginSheetProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { login, error, clearError, loading, googleAuth, twitterAuth } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Handle Google auth
  const handleGoogleAuth = () => {
    // Generate a random ID for demonstration purposes
    const googleId = `google_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Call the direct Google auth function
    googleAuth({
      name: "Google User",
      googleId,
      email: `${googleId}@gmail.com`,
      profileImage: "https://lh3.googleusercontent.com/a/default-user=s400-c"
    });
    
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };
  
  // Handle Twitter auth
  const handleTwitterAuth = () => {
    // Generate a random ID for demonstration purposes
    const twitterId = `twitter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Call the direct Twitter auth function
    twitterAuth({
      name: "Twitter User",
      twitterId,
      email: `${twitterId}@twitter.com`,
      profileImage: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
    });
    
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (email && password) {
      await login(email, password);
      if (onSuccess) onSuccess();
      onOpenChange(false);
    }
  };
  
  const handleClose = () => {
    clearError();
    onOpenChange(false);
  };
  
  const handleSwitchToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenChange(false);
    if (onSwitchToRegister) {
      setTimeout(() => onSwitchToRegister(), 100);
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"} className="bg-gray-900 border-gray-800 p-0 w-full sm:max-w-md">
        <div className="bg-gray-900 p-6 sm:p-8 rounded-xl w-full h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Welcome back</h2>
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
            <Alert variant="destructive" className="mb-4 bg-red-900/30 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4 mb-6">
            <Button 
              variant="outline" 
              className="w-full py-6 flex justify-center gap-2" 
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full py-6 flex justify-center gap-2" 
              onClick={handleTwitterAuth}
              disabled={loading}
            >
              <Twitter size={20} className="text-[#1DA1F2]" />
              Continue with Twitter
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">OR CONTINUE WITH</span>
            </div>
          </div>
          
          <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address <span className="text-red-500">*</span></label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-700 border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password <span className="text-red-500">*</span></label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                className="bg-gray-700 border-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
          
          <p className="text-center mt-6 text-sm text-gray-400">
            Don't have an account? <a href="#" className="text-primary hover:underline" onClick={handleSwitchToRegister}>Sign up</a>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
