
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
  | "connect-linkedin"
  | "user-info"
  | "inspiration"
  | "writing-style"
  | "post-frequency"
  | "extension"
  | "connect-account"
  | "completion";

type OnboardingContextType = {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  onboardingData: Record<string, any>;
  updateOnboardingData: (data: Record<string, any>) => void;
  
  // Team/workspace properties
  workspaceType: "team" | "personal" | null;
  setWorkspaceType: (type: "team" | "personal" | null) => void;
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  teamMembers: Array<{ email: string, role: "admin" | "member" }>;
  setTeamMembers: (members: Array<{ email: string, role: "admin" | "member" }>) => void;
  
  // User info properties
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  
  // Content preferences
  language: string | null;
  setLanguage: (lang: string | null) => void;
  theme: string | null;
  setTheme: (theme: string | null) => void;
  postFormat: "thread" | "concise" | "hashtag" | "visual" | "viral" | null;
  setPostFormat: (format: "thread" | "concise" | "hashtag" | "visual" | "viral" | null) => void;
  postFrequency: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  setPostFrequency: (freq: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null) => void;
  
  // Day selection for post frequency
  selectedDays: Record<string, boolean>;
  setSelectedDays: (days: Record<string, boolean>) => void;
  
  // Helper functions
  getStepProgress: () => { current: number, total: number };
  saveProgress: () => void;
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
  
  workspaceType: null,
  setWorkspaceType: () => {},
  workspaceName: "",
  setWorkspaceName: () => {},
  teamMembers: [],
  setTeamMembers: () => {},
  
  firstName: "",
  setFirstName: () => {},
  lastName: "",
  setLastName: () => {},
  email: "",
  setEmail: () => {},
  
  language: null,
  setLanguage: () => {},
  theme: null,
  setTheme: () => {},
  postFormat: null,
  setPostFormat: () => {},
  postFrequency: null,
  setPostFrequency: () => {},
  
  selectedDays: {},
  setSelectedDays: () => {},
  
  getStepProgress: () => ({ current: 0, total: 0 }),
  saveProgress: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

type OnboardingProviderProps = {
  children: ReactNode;
};

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({});
  
  // Team/workspace state
  const [workspaceType, setWorkspaceType] = useState<"team" | "personal" | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<Array<{ email: string, role: "admin" | "member" }>>([]);
  
  // User info state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  
  // Content preferences state
  const [language, setLanguage] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [postFormat, setPostFormat] = useState<"thread" | "concise" | "hashtag" | "visual" | "viral" | null>(null);
  const [postFrequency, setPostFrequency] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | null>(null);
  
  // Day selection for post frequency
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });

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
  
  // Helper to get current step progress
  const getStepProgress = () => {
    const totalSteps = onboardingSteps.length;
    const currentIndex = onboardingSteps.indexOf(currentStep);
    return {
      current: currentIndex >= 0 ? currentIndex : 0,
      total: totalSteps
    };
  };
  
  // Save progress to backend or localStorage
  const saveProgress = () => {
    // Collect all data
    const progressData = {
      currentStep,
      workspaceType,
      workspaceName,
      teamMembers,
      firstName,
      lastName,
      email,
      language,
      theme,
      postFormat,
      postFrequency,
      selectedDays
    };
    
    // Save to localStorage for now
    localStorage.setItem('onboardingProgress', JSON.stringify(progressData));
    
    // Here you would typically also save to a backend API
    console.log("Saving progress:", progressData);
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
        
        workspaceType,
        setWorkspaceType,
        workspaceName,
        setWorkspaceName,
        teamMembers,
        setTeamMembers,
        
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        
        language,
        setLanguage,
        theme,
        setTheme,
        postFormat,
        setPostFormat,
        postFrequency,
        setPostFrequency,
        
        selectedDays,
        setSelectedDays,
        
        getStepProgress,
        saveProgress
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
