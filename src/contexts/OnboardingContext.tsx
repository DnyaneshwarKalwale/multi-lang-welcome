
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types for our context
type OnboardingStep = 
  | "welcome" 
  | "login" 
  | "team-selection" 
  | "theme-selection" 
  | "language-selection" 
  | "post-format" 
  | "post-frequency" 
  | "registration" 
  | "dashboard";

type WorkspaceType = "team" | "personal" | null;
type ThemeType = "light" | "dark";
type LanguageType = "english" | "german" | null;
type PostFormat = "standard" | "formatted" | "chunky" | "short" | "emojis" | null;
type PostFrequency = 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;

interface OnboardingContextType {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  workspaceType: WorkspaceType;
  setWorkspaceType: (type: WorkspaceType) => void;
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  postFormat: PostFormat;
  setPostFormat: (format: PostFormat) => void;
  postFrequency: PostFrequency;
  setPostFrequency: (frequency: PostFrequency) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(null);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [theme, setTheme] = useState<ThemeType>("dark");
  const [language, setLanguage] = useState<LanguageType>(null);
  const [postFormat, setPostFormat] = useState<PostFormat>(null);
  const [postFrequency, setPostFrequency] = useState<PostFrequency>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const stepOrder: OnboardingStep[] = [
    "welcome",
    "team-selection",
    "theme-selection",
    "language-selection",
    "post-format",
    "post-frequency",
    "registration",
    "dashboard"
  ];

  const nextStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        workspaceType,
        setWorkspaceType,
        workspaceName,
        setWorkspaceName,
        theme,
        setTheme,
        language,
        setLanguage,
        postFormat,
        setPostFormat,
        postFrequency,
        setPostFrequency,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        nextStep,
        prevStep
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
