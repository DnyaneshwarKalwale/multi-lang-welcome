import React, { useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";

export default function RegistrationPage() {
  const { firstName, setFirstName, lastName, setLastName, nextStep, setEmail } = useOnboarding();

  useEffect(() => {
    // Check if we have social profile data from OAuth
    const socialProfileStr = localStorage.getItem('social_profile');
    if (socialProfileStr) {
      try {
        const socialProfile = JSON.parse(socialProfileStr);
        // Populate form with available social data
        if (socialProfile.firstName) setFirstName(socialProfile.firstName);
        if (socialProfile.lastName) setLastName(socialProfile.lastName);
        if (socialProfile.email) setEmail(socialProfile.email);
        // Clear after using
        localStorage.removeItem('social_profile');
      } catch (e) {
        console.error('Error parsing social profile data:', e);
      }
    }
  }, []);

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
