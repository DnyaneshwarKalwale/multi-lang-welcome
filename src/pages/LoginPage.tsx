import React, { useState, useRef } from "react";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { X, Twitter, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const { setCurrentStep } = useOnboarding();
  const { login, error, clearError, loading, twitterAuth } = useAuth();
  const isMobile = useIsMobile();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Handle Google auth
  const handleGoogleAuth = () => {
    // Redirect to backend Google auth endpoint
    window.location.href = 'http://localhost:5000/api/auth/google';
  };
  
  // Handle Twitter auth - using our mock for development
  const handleTwitterAuth = () => {
    // For development, we'll use direct API endpoint instead of OAuth
    // Generate a mock Twitter ID and user info
    const mockTwitterUser = {
      twitterId: 'twitter_' + Math.random().toString(36).substring(7),
      name: 'Twitter User',
      email: 'twitter.user' + Math.random().toString(36).substring(7) + '@example.com',
      profileImage: 'https://via.placeholder.com/150'
    };
    
    // Call the Twitter auth function from the AuthContext
    twitterAuth(mockTwitterUser);
  };
  
  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    login(loginEmail, loginPassword);
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-between p-6 md:p-8">
        <div>
          <ScripeLogotype />
        </div>
        
        <div className="max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Create LinkedIn content with <span className="scripe-gradient-text">high reach</span> in &lt;5 minutes</h2>
          
          <p className="text-gray-400 mb-8">
            Scripe knows what works by analyzing thousands of viral LinkedIn posts daily. No generic AI fluff - train the AI with your knowledge to generate personalized content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Sheet open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <SheetTrigger asChild>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 rounded-full"
                >
                  Log in
                </Button>
              </SheetTrigger>
              <SheetContent side={isMobile ? "bottom" : "right"} className="bg-gray-900 border-gray-800 p-0 w-full sm:max-w-md">
                <div className="bg-gray-900 p-6 sm:p-8 rounded-xl w-full h-full overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Log in</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setIsLoginOpen(false);
                        clearError();
                      }}
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
                  
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-900 text-gray-400">OR CONTINUE WITH</span>
                    </div>
                  </div>
                  
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address <span className="text-red-500">*</span></label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-gray-700 border-gray-600"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
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
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
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
                    Don't have an account? <a href="#" className="text-primary hover:underline" onClick={(e) => { e.preventDefault(); setIsLoginOpen(false); setIsRegisterOpen(true); }}>Sign up</a>
                  </p>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button 
              onClick={() => setIsRegisterOpen(true)} 
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 rounded-full"
            >
              Try Scripe for free
            </Button>
          </div>
          
          <p className="text-gray-500 text-sm mt-2">No credit card required</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-black" />
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            Loved by founders, freelancers and professionals.
          </p>
        </div>
      </div>
      
      <div className="hidden md:flex bg-gray-900 flex-1 items-center justify-center p-8">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Create your account</h2>
          <p className="text-gray-400 mb-6">Sign up for a new account to get started.</p>
          
          <div className="space-y-4 mb-6">
            <Button variant="outline" className="w-full py-6 flex justify-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </Button>
            
            <Button variant="outline" className="w-full py-6 flex justify-center gap-2">
              <Twitter size={20} className="text-[#1DA1F2]" />
              Continue with Twitter
            </Button>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">OR CONTINUE WITH</span>
            </div>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setCurrentStep("team-selection"); }}>
            <div>
              <label htmlFor="firstNameSignup" className="block text-sm font-medium text-gray-400 mb-1">First Name <span className="text-red-500">*</span></label>
              <Input id="firstNameSignup" placeholder="Enter your first name" className="bg-gray-700 border-gray-600" />
            </div>
            
            <div>
              <label htmlFor="lastNameSignup" className="block text-sm font-medium text-gray-400 mb-1">Last Name <span className="text-red-500">*</span></label>
              <Input id="lastNameSignup" placeholder="Enter your last name" className="bg-gray-700 border-gray-600" />
            </div>
            
            <div>
              <label htmlFor="emailSignup" className="block text-sm font-medium text-gray-400 mb-1">Email Address <span className="text-red-500">*</span></label>
              <Input id="emailSignup" type="email" placeholder="Enter your email" className="bg-gray-700 border-gray-600" />
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign up</Button>
          </form>
          
          <p className="text-center mt-6 text-sm text-gray-400">
            Already have an account? <a href="#" className="text-primary hover:underline">Log in</a>
          </p>
          
          <p className="text-center mt-6 text-xs text-gray-500">
            By continuing, you agree to the <a href="#" className="underline">terms of service</a> and <a href="#" className="underline">privacy policy</a>.
          </p>
        </div>
      </div>

      {/* Registration Sheet */}
      <RegistrationSheet open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
    </div>
  );
}
