
import React from "react";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function LoginPage() {
  const { setCurrentStep } = useOnboarding();
  
  return (
    <div className="min-h-screen bg-black flex">
      <div className="flex-1 flex flex-col justify-between p-8">
        <div>
          <ScripeLogotype />
        </div>
        
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4">Create LinkedIn content with <span className="scripe-gradient-text">high reach</span> in &lt;5 minutes</h2>
          
          <p className="text-gray-400 mb-8">
            Scripe knows what works by analyzing thousands of viral LinkedIn posts daily. No generic AI fluff - train the AI with your knowledge to generate personalized content.
          </p>
          
          <Button 
            onClick={() => setCurrentStep("welcome")} 
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 rounded-full"
          >
            Try Scripe for free
          </Button>
          
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
      
      <div className="bg-gray-900 flex-1 flex items-center justify-center p-8">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Create your account</h2>
          <p className="text-gray-400 mb-6">Sign up for a new account to get started.</p>
          
          <div className="space-y-4 mb-6">
            <Button variant="outline" className="w-full py-6 flex justify-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </Button>
            
            <Button variant="outline" className="w-full py-6 flex justify-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="w-5 h-5" />
              Continue with LinkedIn
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
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">First Name <span className="text-red-500">*</span></label>
              <Input id="firstName" placeholder="Enter your first name" className="bg-gray-700 border-gray-600" />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">Last Name <span className="text-red-500">*</span></label>
              <Input id="lastName" placeholder="Enter your last name" className="bg-gray-700 border-gray-600" />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address <span className="text-red-500">*</span></label>
              <Input id="email" type="email" placeholder="Enter your email" className="bg-gray-700 border-gray-600" />
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
    </div>
  );
}
