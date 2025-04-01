import React, { useState } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { onboardingApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileInputPage() {
  const { firstName, setFirstName, lastName, setLastName, nextStep, prevStep, getStepProgress, saveOnboardingProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const [errors, setErrors] = useState({ firstName: "", lastName: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser } = useAuth();

  const validateForm = () => {
    const newErrors = { firstName: "", lastName: "" };
    let isValid = true;

    if (!firstName?.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!lastName?.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Save profile information to backend
        await onboardingApi.saveProfileInfo({ 
          firstName, 
          lastName 
        });
        
        // Also update the user profile if possible
        if (updateUser) {
          await updateUser({ firstName, lastName });
        }
        
        // Proceed to next step
        nextStep();
      } catch (error) {
        console.error('Error saving profile information:', error);
        // Continue anyway to ensure the user isn't blocked
        nextStep();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center">Tell us about yourself</h1>
          <p className="text-gray-400 text-center mt-2">
            We use this information to personalize your experience
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-900 border-gray-700 focus:border-purple-600 text-white"
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-900 border-gray-700 focus:border-purple-600 text-white"
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-12 mb-12">
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="border-gray-700 text-gray-400"
          >
            Back
          </Button>
          <ContinueButton 
            onClick={handleNext}
            disabled={!firstName || !lastName || isSubmitting} 
            loading={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          />
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
} 