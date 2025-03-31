
import React from "react";
import { X, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface RegistrationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationSheet({ open, onOpenChange }: RegistrationSheetProps) {
  const { setCurrentStep } = useOnboarding();
  const isMobile = useIsMobile();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("team-selection");
    onOpenChange(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"} className="bg-gray-900 border-gray-800 p-0 w-full sm:max-w-md">
        <div className="bg-gray-900 p-6 sm:p-8 rounded-xl w-full h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create your account</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>
          
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
              <span className="px-2 bg-gray-900 text-gray-400">OR CONTINUE WITH</span>
            </div>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
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
            Already have an account? <a href="#" className="text-primary hover:underline" onClick={(e) => { e.preventDefault(); onOpenChange(false); }}>Log in</a>
          </p>
          
          <p className="text-center mt-6 text-xs text-gray-500">
            By continuing, you agree to the <a href="#" className="underline">terms of service</a> and <a href="#" className="underline">privacy policy</a>.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
