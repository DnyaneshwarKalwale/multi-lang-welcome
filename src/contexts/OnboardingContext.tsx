
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingContextType {
  onboardingCompleted: boolean;
  onboardingStep: string;
  updateOnboardingStep: (step: string) => void;
  completeOnboarding: () => void;
}

// Export the context as a named export
export const OnboardingContext = createContext<OnboardingContextType>({
  onboardingCompleted: false,
  onboardingStep: 'language',
  updateOnboardingStep: () => {},
  completeOnboarding: () => {},
});

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    localStorage.getItem('onboardingCompleted') === 'true'
  );
  const [onboardingStep, setOnboardingStep] = useState(
    localStorage.getItem('onboardingStep') || 'language'
  );

  const updateOnboardingStep = (step: string) => {
    localStorage.setItem('onboardingStep', step);
    setOnboardingStep(step);
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setOnboardingCompleted(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingCompleted,
        onboardingStep,
        updateOnboardingStep,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
