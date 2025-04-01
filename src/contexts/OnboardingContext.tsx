import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { onboardingApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

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
  | "extension"
  | "content-generation" 
  | "registration" 
  | "dashboard"
  | "initial";

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
  saveOnboardingProgress: () => void;
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
  "extension",
  "content-generation",
  "registration",
  "dashboard"
];

// Create a key for local storage
const ONBOARDING_STORAGE_KEY = 'onboarding_state';

// Helper to get the initial state from localStorage
const getInitialState = () => {
  try {
    const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return {
    currentStep: "welcome" as OnboardingStep,
    workspaceType: null as WorkspaceType,
    workspaceName: "",
    teamMembers: [] as TeamMember[],
    theme: "light" as ThemeType,
    language: "english" as LanguageType,
    postFormat: null as PostFormat,
    postFrequency: null as PostFrequency,
    firstName: "",
    lastName: "",
    email: ""
  };
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { setTheme: setGlobalTheme } = useTheme();
  const { setLanguage: setGlobalLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  
  // Initialize state from localStorage if available
  const initialState = getInitialState();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialState.currentStep);
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(initialState.workspaceType);
  const [workspaceName, setWorkspaceName] = useState(initialState.workspaceName);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialState.teamMembers);
  const [theme, setTheme] = useState<ThemeType>(initialState.theme);
  const [language, setLanguage] = useState<LanguageType>(initialState.language);
  const [postFormat, setPostFormat] = useState<PostFormat>(initialState.postFormat);
  const [postFrequency, setPostFrequency] = useState<PostFrequency>(initialState.postFrequency);
  const [firstName, setFirstName] = useState(initialState.firstName);
  const [lastName, setLastName] = useState(initialState.lastName);
  const [email, setEmail] = useState(initialState.email);
  const [isSaving, setIsSaving] = useState(false);

  // Function to save onboarding progress to server
  const saveOnboardingProgress = async () => {
    if (!isAuthenticated || isSaving) return;
    
    try {
      setIsSaving(true);
      
      // Only save if we're past the welcome step
      if (currentStep !== 'welcome' && currentStep !== 'initial') {
        console.log('Saving onboarding progress:', currentStep);
        
        // Prepare data to save
        const onboardingData = {
          lastOnboardingStep: currentStep,
          workspaceType,
          workspaceName,
          teamMembers,
          theme,
          language,
          postFormat,
          postFrequency
        };
        
        // Save to server
        await onboardingApi.saveOnboarding(onboardingData);
      }
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = {
        currentStep,
        workspaceType,
        workspaceName,
        teamMembers,
        theme,
        language,
        postFormat,
        postFrequency,
        firstName,
        lastName,
        email
      };
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(stateToSave));
      
      // Also save progress to server if user is authenticated
      if (isAuthenticated && currentStep !== 'initial' && currentStep !== 'welcome') {
        saveOnboardingProgress();
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [
    currentStep, workspaceType, workspaceName, teamMembers,
    theme, language, postFormat, postFrequency,
    firstName, lastName, email, isAuthenticated
  ]);

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
      current: currentIndex !== -1 ? currentIndex : 0,
      total: steps.length
    };
  };

  const nextStep = () => {
    const steps = getApplicableSteps();
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      navigate(`/onboarding/${nextStep}`, { replace: true });
      
      // Save progress after step change
      saveOnboardingProgress();
    }
  };

  const prevStep = () => {
    const steps = getApplicableSteps();
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      setCurrentStep(prevStep);
      navigate(`/onboarding/${prevStep}`, { replace: true });
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

  // If user profile has a last onboarding step, go there
  useEffect(() => {
    if (user && user.lastOnboardingStep && currentStep === 'initial') {
      const lastStep = user.lastOnboardingStep as OnboardingStep;
      
      // Verify this is a valid step
      if (allSteps.includes(lastStep)) {
        console.log('Resuming onboarding from:', lastStep);
        setCurrentStep(lastStep);
        navigate(`/onboarding/${lastStep}`, { replace: true });
      }
    }
  }, [user, currentStep, navigate]);

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
    getStepProgress,
    saveOnboardingProgress
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
