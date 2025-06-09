import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { tokenManager } from "@/services/api";

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

type PostFormat = "text" | "carousel" | "document" | "visual" | "poll" | null;
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
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
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
          const token = tokenManager.getToken(localStorage.getItem('auth-method') || undefined);
          if (!token) return;
          
          const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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
      const token = tokenManager.getToken(localStorage.getItem('auth-method') || undefined);
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Build the onboarding data object
      const onboardingData = {
        currentStep,
        workspaceType,
        workspaceName,
        teamMembers,
        postFormat,
        postFrequency,
        firstName,
        lastName,
        email,
        website,
        mobileNumber,
        inspirationProfiles
      };
      
      console.log("Saving onboarding progress:", onboardingData);
      
      // Save to backend
      const response = await axios.post(`${baseApiUrl}/onboarding`, onboardingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Onboarding progress saved successfully:", response.data);
      
    } catch (error) {
      console.error("Error saving onboarding progress:", error);
      // Don't block the UI flow if saving fails
      // The user can still continue through the onboarding process
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
    // Default - include welcome, personal-info, and other essential steps
    // This ensures users can flow through the onboarding without selecting workspace type
    return allSteps.filter(step => 
      step === 'welcome' || 
      step === 'personal-info' || 
      step === 'team-selection' ||
      step === 'post-format' ||
      step === 'post-frequency' ||
      step === 'inspiration-profiles' ||
      step === 'extension-install' ||
      step === 'completion' ||
      step === 'dashboard'
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
      
      // If going to team specific pages but workspaceType is personal, skip them
      if (
        (nextStep === 'team-workspace' || nextStep === 'team-invite') && 
        workspaceType === 'personal'
      ) {
        // Skip to post-format page for personal workspaces
        const newIndex = steps.indexOf('post-format');
        if (newIndex > 0) {
          const skipToStep = steps[newIndex];
          setCurrentStep(skipToStep);
          navigate(`/onboarding/${skipToStep}`);
          console.log(`Skipping to ${skipToStep} for personal workspace`);
        } else {
          // Fallback to directly referencing post-format
          setCurrentStep('post-format');
          navigate('/onboarding/post-format');
          console.log('Skipping to post-format for personal workspace (fallback)');
        }
      } else {
        // Normal flow
        setCurrentStep(nextStep);
        navigate(`/onboarding/${nextStep}`);
        console.log(`Moving to next step: ${nextStep}`);
      }
      
      saveProgress(); // Save progress when moving to next step
    } else {
      // At the end of onboarding, mark as completed and go to dashboard
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Try to complete onboarding in database
      const completeOnboarding = async () => {
        try {
          const token = tokenManager.getToken(localStorage.getItem('auth-method') || undefined);
          if (!token) return;
          
          const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          
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
