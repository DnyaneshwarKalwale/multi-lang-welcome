
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

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
  | "extension-install"
  | "completion"
  | "dashboard"
  // LinkedIn flow steps
  | "user-info"
  | "inspiration"
  | "writing-style"
  | "extension"
  | "connect-account";

type WorkspaceType = "team" | "personal" | null;
type ThemeType = "light" | "dark";
type LanguageType = "english" | "german" | "spanish" | "french" | null;
type PostFormat = "thread" | "concise" | "hashtag" | "visual" | "viral" | null;
type PostFrequency = 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;

// LinkedIn specific types
type WritingStyle = "professional" | "conversational" | "thoughtLeader" | "storytelling" | "educational" | "motivational" | null;

// New type for selected days
export type SelectedDays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

// LinkedIn inspiration profile type
export type InspirationProfile = {
  id: string;
  name: string;
  url: string;
  avatar?: string;
};

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
  selectedDays: SelectedDays; 
  setSelectedDays: (days: SelectedDays) => void; 
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  // LinkedIn specific fields
  writingStyle: WritingStyle;
  setWritingStyle: (style: WritingStyle) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (url: string) => void;
  inspirationProfiles: InspirationProfile[];
  setInspirationProfiles: (profiles: InspirationProfile[]) => void;
  linkedInConnected: boolean;
  setLinkedInConnected: (connected: boolean) => void;
  // Navigation functions
  nextStep: () => void;
  prevStep: () => void;
  getStepProgress: () => { current: number; total: number };
  saveProgress: () => Promise<void>;
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
  "extension-install",
  "completion",
  "dashboard"
];

// Define LinkedIn flow steps
const linkedInSteps: OnboardingStep[] = [
  "welcome",
  "user-info",
  "inspiration",
  "writing-style",
  "post-frequency",
  "extension",
  "connect-account",
  "completion",
  "dashboard"
];

// Toggle for LinkedIn flow
const useLinkedInFlow = true;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  
  // Access theme context directly without attempting to access it at import time
  const themeContext = useTheme();
  const { setLanguage: setGlobalLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  
  // Only access theme methods if themeContext exists
  const setGlobalTheme = themeContext ? themeContext.setTheme : () => {};

  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [theme, setTheme] = useState<ThemeType>("dark");
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
  const [isInitialized, setIsInitialized] = useState(false);

  // LinkedIn specific states
  const [writingStyle, setWritingStyle] = useState<WritingStyle>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [inspirationProfiles, setInspirationProfiles] = useState<InspirationProfile[]>([]);
  const [linkedInConnected, setLinkedInConnected] = useState(false);

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
              
              // Map old steps to new steps if using LinkedIn flow
              if (useLinkedInFlow) {
                const newStep = mapOldStepToNewStep(data.currentStep);
                navigate(`/onboarding/${newStep}`);
              } else {
                navigate(`/onboarding/${data.currentStep}`);
              }
            }
            
            if (data.workspaceType) setWorkspaceType(data.workspaceType);
            if (data.workspaceName) setWorkspaceName(data.workspaceName);
            if (data.teamMembers) setTeamMembers(data.teamMembers);
            if (data.theme) setTheme(data.theme);
            if (data.language) setLanguage(data.language);
            if (data.postFormat) setPostFormat(data.postFormat);
            if (data.postFrequency) setPostFrequency(data.postFrequency);
            
            // Load selected days if available
            if (data.selectedDays) {
              setSelectedDays(data.selectedDays);
            } else if (data.postFrequency) {
              // Fallback: initialize selected days based on postFrequency
              const defaultSelectedDays = {
                monday: data.postFrequency >= 1,
                tuesday: data.postFrequency >= 2,
                wednesday: data.postFrequency >= 3,
                thursday: data.postFrequency >= 4,
                friday: data.postFrequency >= 5,
                saturday: data.postFrequency >= 6,
                sunday: data.postFrequency >= 7
              };
              setSelectedDays(defaultSelectedDays);
            }
            
            // Load user info
            if (data.firstName) setFirstName(data.firstName);
            if (data.lastName) setLastName(data.lastName);
            if (data.email) setEmail(data.email);
            
            // Load LinkedIn specific fields
            if (data.writingStyle) setWritingStyle(data.writingStyle);
            if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
            if (data.websiteUrl) setWebsiteUrl(data.websiteUrl);
            if (data.inspirationProfiles) setInspirationProfiles(data.inspirationProfiles);
            if (data.linkedInConnected) setLinkedInConnected(data.linkedInConnected);
          }
          
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to load onboarding progress:', error);
          setIsInitialized(true);
        }
      }
    };
    
    loadOnboardingProgress();
  }, [isAuthenticated, user, navigate, isInitialized]);

  // Function to map old step names to new LinkedIn flow step names
  const mapOldStepToNewStep = (oldStep: OnboardingStep): string => {
    switch (oldStep) {
      case "team-selection":
      case "team-workspace":
      case "team-invite":
      case "registration":
        return "user-info";
      case "theme-selection":
      case "language-selection":
      case "post-format":
        return "writing-style";
      case "extension-install":
        return "extension";
      default:
        return oldStep;
    }
  };

  // Save onboarding progress to backend
  const saveProgress = async () => {
    if (isAuthenticated && user && !user.onboardingCompleted) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const onboardingData = {
          currentStep,
          workspaceType,
          workspaceName,
          teamMembers,
          theme,
          language,
          postFormat,
          postFrequency,
          selectedDays,
          firstName,
          lastName,
          email,
          // LinkedIn specific data
          writingStyle,
          phoneNumber,
          websiteUrl,
          inspirationProfiles,
          linkedInConnected
        };
        
        // Save key data to localStorage as a fallback
        localStorage.setItem('onboardingStep', currentStep);
        if (workspaceType) localStorage.setItem('workspaceType', workspaceType);
        if (theme) localStorage.setItem('theme', theme);
        if (language) localStorage.setItem('language', language);
        
        try {
          const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
          await axios.post(`${baseApiUrl}/onboarding`, onboardingData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (apiError) {
          console.error('Failed to save onboarding progress to API:', apiError);
          // We'll continue with the local storage backup we created above
        }
        
      } catch (error) {
        console.error('Failed to save onboarding progress:', error);
      }
    }
  };

  // Get applicable steps based on workspace type and flow
  const getApplicableSteps = (): OnboardingStep[] => {
    if (useLinkedInFlow) {
      return linkedInSteps;
    } else if (workspaceType === "personal") {
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
      saveProgress(); // Save progress when moving to next step
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

  // Save progress when current step changes
  useEffect(() => {
    if (isInitialized) {
      saveProgress();
    }
  }, [currentStep, isInitialized]);

  // Update global theme when onboarding theme changes
  useEffect(() => {
    if (theme && themeContext) {
      setGlobalTheme(theme);
    }
  }, [theme, themeContext, setGlobalTheme]);

  // Update global language when onboarding language changes
  useEffect(() => {
    if (language) {
      setGlobalLanguage(language as "english" | "german" | "spanish" | "french");
    }
  }, [language, setGlobalLanguage]);

  // When postFrequency changes, update selectedDays accordingly if they aren't already set
  useEffect(() => {
    // Skip if we have any selected days already
    const hasSelectedDays = Object.values(selectedDays).some(day => day);
    
    if (postFrequency !== null && !hasSelectedDays) {
      // Default to selecting first N days of the week based on frequency
      const defaultSelectedDays = {
        monday: postFrequency >= 1,
        tuesday: postFrequency >= 2,
        wednesday: postFrequency >= 3,
        thursday: postFrequency >= 4,
        friday: postFrequency >= 5,
        saturday: postFrequency >= 6,
        sunday: postFrequency >= 7
      };
      setSelectedDays(defaultSelectedDays);
    }
  }, [postFrequency, selectedDays]);

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
    selectedDays,
    setSelectedDays,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    // LinkedIn specific fields
    writingStyle,
    setWritingStyle,
    phoneNumber,
    setPhoneNumber,
    websiteUrl,
    setWebsiteUrl,
    inspirationProfiles,
    setInspirationProfiles,
    linkedInConnected,
    setLinkedInConnected,
    // Navigation functions
    nextStep,
    prevStep,
    getStepProgress,
    saveProgress
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
