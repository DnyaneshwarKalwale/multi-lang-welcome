import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

// Define types for our context
type OnboardingStep = 
  | "welcome" 
  | "personal-info"
  | "team-selection" 
  | "team-workspace" 
  | "team-invite"
  | "post-format" 
  | "post-frequency"
  | "inspiration-profiles" 
  | "extension-install"
  | "completion"
  | "dashboard";

type WorkspaceType = "team" | "personal" | null;
type TeamMember = {
  email: string;
  role: "admin" | "member";
};

// Simplified types - remove theme options, only support light mode
type LanguageType = "english" | "german";
type PostFormat = "thread" | "concise" | "hashtag" | "visual" | "viral" | null;
type PostFrequency = 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;

type SelectedDays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

// Update the context type to match our component structure
type OnboardingContextType = {
  currentStep: OnboardingStep;
  workspaceType: WorkspaceType;
  workspaceName: string;
  teamMembers: TeamMember[];
  language: LanguageType;
  postFormat: PostFormat;
  postFrequency: PostFrequency;
  selectedDays: SelectedDays;
  firstName: string;
  lastName: string;
  email: string;
  website: string;
  mobileNumber: string;
  inspirationProfiles: string[];
  setCurrentStep: (step: OnboardingStep) => void;
  setWorkspaceType: (type: WorkspaceType) => void;
  setWorkspaceName: (name: string) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setLanguage: (language: LanguageType) => void;
  setPostFormat: (format: PostFormat) => void;
  setPostFrequency: (frequency: PostFrequency) => void;
  setSelectedDays: (days: SelectedDays) => void;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setEmail: (email: string) => void;
  setWebsite: (website: string) => void;
  setMobileNumber: (mobileNumber: string) => void;
  addInspirationProfile: (profile: string) => void;
  removeInspirationProfile: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  saveProgress: () => void;
  getStepProgress: () => { current: number; total: number };
  getApplicableSteps: () => OnboardingStep[];
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Define all possible steps in order
const allSteps: OnboardingStep[] = [
  "welcome",
  "personal-info",
  "team-selection",
  "team-workspace",
  "team-invite",
  "post-format",
  "post-frequency",
  "inspiration-profiles",
  "extension-install",
  "completion",
  "dashboard"
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  
  // Access theme context directly without attempting to access it at import time
  const themeContext = useTheme();
  const { setLanguage: setGlobalLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [language, setLanguage] = useState<LanguageType>("english");
  const [postFormat, setPostFormat] = useState<PostFormat>(null);
  const [postFrequency, setPostFrequency] = useState<PostFrequency>(null);
  
  // Add selected days state with default values
  const [selectedDays, setSelectedDays] = useState<SelectedDays>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [inspirationProfiles, setInspirationProfiles] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved onboarding progress when user authenticates
  useEffect(() => {
    const loadOnboardingProgress = async () => {
      if (isAuthenticated && user && !user.onboardingCompleted && !isInitialized) {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
          
          const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
          const response = await axios.get(`${baseApiUrl}/onboarding`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const data = response.data.data;
          
          // Only set the state if we have saved data
          if (data) {
            // Set the last step the user was on
            if (data.currentStep) {
              setCurrentStep(data.currentStep);
              navigate(`/onboarding/${data.currentStep}`);
            }
            
            if (data.workspaceType) setWorkspaceType(data.workspaceType);
            if (data.workspaceName) setWorkspaceName(data.workspaceName);
            if (data.teamMembers) setTeamMembers(data.teamMembers);
            if (data.language) setLanguage(data.language);
            if (data.postFormat) setPostFormat(data.postFormat);
            if (data.postFrequency) setPostFrequency(data.postFrequency);
            if (data.firstName) setFirstName(data.firstName);
            if (data.lastName) setLastName(data.lastName);
            if (data.email) setEmail(data.email);
            if (data.website) setWebsite(data.website);
            if (data.mobileNumber) setMobileNumber(data.mobileNumber);
            if (data.inspirationProfiles) setInspirationProfiles(data.inspirationProfiles);
          }
          
          setIsInitialized(true);
        } catch (error) {
          console.error("Error loading onboarding progress:", error);
          setIsInitialized(true);
        }
      } else if (!isAuthenticated || !user) {
        // Mark as initialized if not authenticated
        setIsInitialized(true);
      }
    };
    
    loadOnboardingProgress();
  }, [isAuthenticated, user, navigate, isInitialized]);

  // Function to save current onboarding progress
  const saveProgress = async () => {
    // Only save if user is authenticated
    if (!isAuthenticated || !user) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      
      // Build the onboarding data object
      const onboardingData = {
        currentStep,
        workspaceType,
        workspaceName,
        teamMembers,
        language,
        postFormat,
        postFrequency,
        firstName,
        lastName,
        email,
        website,
        mobileNumber,
        inspirationProfiles
      };
      
      // Save to backend
      await axios.post(`${baseApiUrl}/onboarding`, onboardingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
    } catch (error) {
      console.error("Error saving onboarding progress:", error);
    }
  };

  // Function to get only the steps that apply to current workspace type
  const getApplicableSteps = () => {
    if (workspaceType === 'team') {
      // Include team-specific steps
      return allSteps;
    } else if (workspaceType === 'personal') {
      // Skip team-workspace and team-invite for personal workspaces
      return allSteps.filter(step => 
        step !== 'team-workspace' && step !== 'team-invite'
      );
    }
    // Default - only show steps before workspace type selection
    return allSteps.filter(step => 
      step === 'welcome' || step === 'team-selection'
    );
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
      saveProgress(); // Save progress when moving to next step
    } else {
      // At the end of onboarding, mark as completed and go to dashboard
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Try to complete onboarding in database
      const completeOnboarding = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
          
          const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
          
          await axios.patch(`${baseApiUrl}/users/me`, { onboardingCompleted: true }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
        } catch (error) {
          console.error("Error marking onboarding as completed:", error);
        }
      };
      
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  const prevStep = () => {
    const steps = getApplicableSteps();
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      setCurrentStep(prevStep);
      navigate(`/onboarding/${prevStep}`);
      saveProgress(); // Save progress when moving to previous step
    }
  };

  // Update global language when onboarding language changes
  useEffect(() => {
    if (language) {
      setGlobalLanguage(language as "english" | "german" | "spanish" | "french");
    }
  }, [language, setGlobalLanguage]);

  // Function to add an inspiration profile
  const addInspirationProfile = (profile: string) => {
    setInspirationProfiles(prev => [...prev, profile]);
  };
  
  // Function to remove an inspiration profile
  const removeInspirationProfile = (index: number) => {
    setInspirationProfiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        workspaceType,
        workspaceName,
        teamMembers,
        language,
        postFormat,
        postFrequency,
        selectedDays,
        firstName,
        lastName,
        email,
        website,
        mobileNumber,
        inspirationProfiles,
        setCurrentStep,
        setWorkspaceType,
        setWorkspaceName,
        setTeamMembers,
        setLanguage,
        setPostFormat,
        setPostFrequency,
        setSelectedDays,
        setFirstName,
        setLastName,
        setEmail,
        setWebsite,
        setMobileNumber,
        addInspirationProfile,
        removeInspirationProfile,
        nextStep,
        prevStep,
        saveProgress,
        getStepProgress,
        getApplicableSteps
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within a OnboardingProvider");
  }
  return context;
};
