import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

// Define types for our context
type OnboardingStep = 
  | "welcome" 
  | "team-selection" 
  | "team-workspace" 
  | "team-invite"
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

interface TeamMember {
  email: string;
  role: "admin" | "member";
}

interface OnboardingContextType {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  workspaceType: WorkspaceType;
  setWorkspaceType: (type: WorkspaceType) => void;
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
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
  getStepProgress: () => { current: number; total: number };
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Define all possible steps in order
const allSteps: OnboardingStep[] = [
  "welcome",
  "team-selection",
  "team-workspace",
  "team-invite",
  "theme-selection",
  "language-selection",
  "post-format",
  "post-frequency",
  "registration",
  "dashboard"
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { setTheme: setGlobalTheme } = useTheme();
  const { setLanguage: setGlobalLanguage } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [theme, setTheme] = useState<ThemeType>("light");
  const [language, setLanguage] = useState<LanguageType>("english");
  const [postFormat, setPostFormat] = useState<PostFormat>(null);
  const [postFrequency, setPostFrequency] = useState<PostFrequency>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Get applicable steps based on workspace type
  const getApplicableSteps = (): OnboardingStep[] => {
    if (workspaceType === "personal") {
      // Skip team-workspace and team-invite steps for personal accounts
      return allSteps.filter(step => 
        step !== "team-workspace" && step !== "team-invite"
      );
    }
    return allSteps;
  };

  const getStepProgress = () => {
    const steps = getApplicableSteps();
    const currentIndex = steps.indexOf(currentStep);
    return {
      current: currentIndex,
      total: steps.length
    };
  };

  const nextStep = () => {
    const steps = getApplicableSteps();
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      navigate(`/onboarding/${nextStep}`);
    }
  };

  const prevStep = () => {
    const steps = getApplicableSteps();
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      setCurrentStep(prevStep);
      navigate(`/onboarding/${prevStep}`);
    }
  };

  // Update global theme when onboarding theme changes
  useEffect(() => {
    if (theme) {
      setGlobalTheme(theme);
    }
  }, [theme, setGlobalTheme]);

  // Update global language when onboarding language changes
  useEffect(() => {
    if (language) {
      setGlobalLanguage(language as "english" | "german");
    }
  }, [language, setGlobalLanguage]);

  // Update navigation if workspaceType changes
  useEffect(() => {
    if (currentStep === "team-selection" && workspaceType) {
      // If user has selected workspace type, prepare for next step
      const steps = getApplicableSteps();
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex >= 0) {
        // Just update the navigation state but don't navigate automatically
        setCurrentStep(currentStep);
      }
    }
  }, [workspaceType, currentStep]);

  const value = {
    currentStep,
    setCurrentStep,
    workspaceType,
    setWorkspaceType,
    workspaceName,
    setWorkspaceName,
    teamMembers,
    setTeamMembers,
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
    prevStep,
    getStepProgress
  };

  return (
    <OnboardingContext.Provider value={value}>
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
