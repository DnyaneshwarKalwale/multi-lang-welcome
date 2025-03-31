
import React, { useState } from "react";
import { ScripeLogotype, ScripeIcon } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { LoginSheet } from "@/components/LoginSheet";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  const handleContinue = () => {
    navigate("/onboarding/welcome");
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-between p-6 md:p-8">
        <div>
          <ScripeLogotype />
        </div>
        
        <div className="max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Twitter content with <span className="scripe-gradient-text">high reach</span> in &lt;5 minutes</h2>
          
          <p className="text-gray-400 mb-8">
            Scripe knows what works by analyzing thousands of viral Twitter posts daily. No generic AI fluff - train the AI with your knowledge to generate personalized content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => setIsLoginOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 rounded-full"
            >
              Log in
            </Button>
            
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
            <Button variant="outline" className="w-full py-6 flex justify-center gap-2" onClick={handleContinue}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </Button>
            
            <Button variant="outline" className="w-full py-6 flex justify-center gap-2" onClick={handleContinue}>
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
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate("/onboarding/welcome"); }}>
            <div>
              <label htmlFor="firstNameSignup" className="block text-sm font-medium text-gray-400 mb-1">First Name <span className="text-red-500">*</span></label>
              <input id="firstNameSignup" placeholder="Enter your first name" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            
            <div>
              <label htmlFor="lastNameSignup" className="block text-sm font-medium text-gray-400 mb-1">Last Name <span className="text-red-500">*</span></label>
              <input id="lastNameSignup" placeholder="Enter your last name" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            
            <div>
              <label htmlFor="emailSignup" className="block text-sm font-medium text-gray-400 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input id="emailSignup" type="email" placeholder="Enter your email" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign up</Button>
          </form>
          
          <p className="text-center mt-6 text-sm text-gray-400">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginOpen(true); }} className="text-primary hover:underline">Log in</a>
          </p>
          
          <p className="text-center mt-6 text-xs text-gray-500">
            By continuing, you agree to the <a href="#" className="underline">terms of service</a> and <a href="#" className="underline">privacy policy</a>.
          </p>
        </div>
      </div>

      {/* Login Sheet */}
      <LoginSheet open={isLoginOpen} onOpenChange={setIsLoginOpen} onSuccess={() => navigate("/onboarding/welcome")} />

      {/* Registration Sheet */}
      <RegistrationSheet open={isRegisterOpen} onOpenChange={setIsRegisterOpen} onSuccess={() => navigate("/onboarding/welcome")} />
    </div>
  );
};

export default Index;
