
import React, { createContext, useContext, useState, ReactNode } from "react";

export type OnboardingStep = 
  | "welcome" 
  | "team-selection" 
  | "workspace-name" 
  | "personal-info" 
  | "website" 
  | "style-preference" 
  | "formatting" 
  | "frequency" 
  | "connect-linkedin";

type OnboardingContextType = {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  onboardingData: Record<string, any>;
  updateOnboardingData: (data: Record<string, any>) => void;
};

const onboardingSteps: OnboardingStep[] = [
  "welcome",
  "team-selection",
  "workspace-name",
  "personal-info",
  "website",
  "style-preference",
  "formatting",
  "frequency",
  "connect-linkedin"
];

const OnboardingContext = createContext<OnboardingContextType>({
  currentStep: "welcome",
  setCurrentStep: () => {},
  nextStep: () => {},
  prevStep: () => {},
  onboardingData: {},
  updateOnboardingData: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

type OnboardingProviderProps = {
  children: ReactNode;
};

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({});

  const nextStep = () => {
    const currentIndex = onboardingSteps.indexOf(currentStep);
    if (currentIndex < onboardingSteps.length - 1) {
      setCurrentStep(onboardingSteps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = onboardingSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(onboardingSteps[currentIndex - 1]);
    }
  };

  const updateOnboardingData = (data: Record<string, any>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        onboardingData,
        updateOnboardingData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
