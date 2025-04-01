import React, { useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

export default function RegistrationPage() {
  const { firstName, setFirstName, lastName, setLastName, nextStep } = useOnboarding();
  const { user } = useAuth();
  
  // Populate name fields from authenticated user if available
  useEffect(() => {
    if (user) {
      // If the names are empty, populate them from the user context
      if (!firstName && user.firstName) {
        setFirstName(user.firstName);
      }
      
      if (!lastName && user.lastName) {
        setLastName(user.lastName);
      }
    }
  }, [user, firstName, lastName, setFirstName, setLastName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Who would you like to create this account for?</h1>
        
        <div className="grid grid-cols-2 gap-4 mt-12 mb-12">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              First Name
            </label>
            <Input 
              id="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2 text-left">
              Last Name
            </label>
            <Input 
              id="lastName" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </div>
        
        <div className="flex justify-center mb-12">
          <ContinueButton 
            onClick={nextStep}
            disabled={!firstName.trim() || !lastName.trim()} 
          />
        </div>
        
        <ProgressDots total={8} current={6} />
      </div>
    </div>
  );
}
