
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingContextType {
  onboardingCompleted: boolean;
  onboardingStep: string;
  firstName: string;
  lastName: string;
  language: string;
  theme: string;
  postFormat: string;
  postFrequency: number;
  workspaceType: string;
  workspaceName: string;
  teamMembers: any[];
  currentStep: string;
  updateOnboardingStep: (step: string) => void;
  completeOnboarding: () => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setPostFormat: (format: string) => void;
  setPostFrequency: (frequency: number) => void;
  setWorkspaceType: (type: string) => void;
  setWorkspaceName: (name: string) => void;
  setTeamMembers: (members: any[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  getStepProgress: () => { current: number; total: number };
  saveProgress: () => void;
}

// Export the context as a named export
export const OnboardingContext = createContext<OnboardingContextType>({
  onboardingCompleted: false,
  onboardingStep: 'language',
  firstName: '',
  lastName: '',
  language: 'english',
  theme: 'dark',
  postFormat: 'casual',
  postFrequency: 1,
  workspaceType: 'personal',
  workspaceName: '',
  teamMembers: [],
  currentStep: 'language',
  updateOnboardingStep: () => {},
  completeOnboarding: () => {},
  setFirstName: () => {},
  setLastName: () => {},
  setLanguage: () => {},
  setTheme: () => {},
  setPostFormat: () => {},
  setPostFrequency: () => {},
  setWorkspaceType: () => {},
  setWorkspaceName: () => {},
  setTeamMembers: () => {},
  nextStep: () => {},
  prevStep: () => {},
  getStepProgress: () => ({ current: 0, total: 1 }),
  saveProgress: () => {},
});

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    localStorage.getItem('onboardingCompleted') === 'true'
  );
  const [onboardingStep, setOnboardingStep] = useState(
    localStorage.getItem('onboardingStep') || 'language'
  );
  const [firstName, setFirstName] = useState(localStorage.getItem('user_firstName') || '');
  const [lastName, setLastName] = useState(localStorage.getItem('user_lastName') || '');
  const [language, setLanguage] = useState(localStorage.getItem('user_language') || 'english');
  const [theme, setTheme] = useState(localStorage.getItem('user_theme') || 'dark');
  const [postFormat, setPostFormat] = useState(localStorage.getItem('user_postFormat') || 'casual');
  const [postFrequency, setPostFrequency] = useState(Number(localStorage.getItem('user_postFrequency')) || 1);
  const [workspaceType, setWorkspaceType] = useState(localStorage.getItem('user_workspaceType') || 'personal');
  const [workspaceName, setWorkspaceName] = useState(localStorage.getItem('user_workspaceName') || '');
  const [teamMembers, setTeamMembers] = useState<any[]>(JSON.parse(localStorage.getItem('user_teamMembers') || '[]'));
  const [currentStep, setCurrentStep] = useState(onboardingStep);

  const updateOnboardingStep = (step: string) => {
    localStorage.setItem('onboardingStep', step);
    setOnboardingStep(step);
    setCurrentStep(step);
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setOnboardingCompleted(true);
  };

  const nextStep = () => {
    // Logic for determining next step based on current step
    const steps = ['language', 'post-format', 'post-frequency', 'theme', 'team', 'team-invite', 'extension-install', 'completion'];
    const currentIndex = steps.indexOf(onboardingStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      updateOnboardingStep(nextStep);
    }
  };

  const prevStep = () => {
    // Logic for determining previous step based on current step
    const steps = ['language', 'post-format', 'post-frequency', 'theme', 'team', 'team-invite', 'extension-install', 'completion'];
    const currentIndex = steps.indexOf(onboardingStep);
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      updateOnboardingStep(prevStep);
    }
  };

  const getStepProgress = () => {
    const steps = ['language', 'post-format', 'post-frequency', 'theme', 'team', 'team-invite', 'extension-install', 'completion'];
    const currentIndex = steps.indexOf(onboardingStep);
    return {
      current: currentIndex >= 0 ? currentIndex : 0,
      total: steps.length
    };
  };

  const saveProgress = () => {
    // Save all onboarding data to localStorage
    localStorage.setItem('user_firstName', firstName);
    localStorage.setItem('user_lastName', lastName);
    localStorage.setItem('user_language', language);
    localStorage.setItem('user_theme', theme);
    localStorage.setItem('user_postFormat', postFormat);
    localStorage.setItem('user_postFrequency', String(postFrequency));
    localStorage.setItem('user_workspaceType', workspaceType);
    localStorage.setItem('user_workspaceName', workspaceName);
    localStorage.setItem('user_teamMembers', JSON.stringify(teamMembers));
    
    // API call to save progress could be added here
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingCompleted,
        onboardingStep,
        firstName,
        lastName,
        language,
        theme,
        postFormat,
        postFrequency,
        workspaceType,
        workspaceName,
        teamMembers,
        currentStep,
        updateOnboardingStep,
        completeOnboarding,
        setFirstName,
        setLastName,
        setLanguage,
        setTheme,
        setPostFormat,
        setPostFrequency,
        setWorkspaceType,
        setWorkspaceName,
        setTeamMembers,
        nextStep,
        prevStep,
        getStepProgress,
        saveProgress
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
