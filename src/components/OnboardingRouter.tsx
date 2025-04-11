import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuth } from "@/contexts/AuthContext";
import WelcomePage from "@/pages/WelcomePage";
import TeamSelectionPage from "@/pages/TeamSelectionPage";
import TeamWorkspacePage from "@/pages/TeamWorkspacePage";
import TeamInvitePage from "@/pages/TeamInvitePage";
import PostFormatPage from "@/pages/PostFormatPage";
import PostFrequencyPage from "@/pages/PostFrequencyPage";
import RegistrationPage from "@/pages/RegistrationPage";
import ExtensionInstallPage from "@/pages/ExtensionInstallPage";
import CompletionPage from "@/pages/CompletionPage";
import DashboardPage from "@/pages/DashboardPage";

export function OnboardingRouter() {
  const { workspaceType, currentStep, saveProgress, setCurrentStep } = useOnboarding();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ensure proper step routing when URL changes
  useEffect(() => {
    const currentPath = location.pathname;
    const step = currentPath.replace('/onboarding/', '');
    
    // Make sure currentStep in context matches URL
    if (step && step !== '' && step !== currentStep) {
      setCurrentStep(step as any);
    }
  }, [location.pathname, currentStep, setCurrentStep]);
  
  // Redirect logic for team vs personal workspace
  useEffect(() => {
    // If on team-workspace or team-invite but not a team workspace, skip
    if (workspaceType === "personal") {
      if (location.pathname.includes("team-workspace") || 
          location.pathname.includes("team-invite")) {
        navigate("/onboarding/post-format");
      }
    }
  }, [workspaceType, location.pathname, navigate]);

  // Save current step to localStorage when route changes
  useEffect(() => {
    const currentPath = location.pathname;
    const currentOnboardingStep = currentPath.replace('/onboarding/', '');
    
    // Only save if we're on a valid onboarding step
    if (currentOnboardingStep && currentOnboardingStep !== '') {
      localStorage.setItem('onboardingStep', currentOnboardingStep);
      
      // Only call saveProgress if user is authenticated
      if (user) {
        saveProgress();
      }
    }
  }, [location.pathname, saveProgress, user]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Progress indicator - visible on all onboarding pages */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 transition-all duration-500 ease-in-out"
          style={{ 
            width: `${getProgressPercentage(currentStep, workspaceType)}%`,
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
          }}
        />
      </div>
      
      <Routes>
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="team-selection" element={<TeamSelectionPage />} />
        <Route path="team-workspace" element={<TeamWorkspacePage />} />
        <Route path="team-invite" element={<TeamInvitePage />} />
        <Route path="post-format" element={<PostFormatPage />} />
        <Route path="post-frequency" element={<PostFrequencyPage />} />
        <Route path="registration" element={<RegistrationPage />} />
        <Route path="extension-install" element={<ExtensionInstallPage />} />
        <Route path="completion" element={<CompletionPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="" element={<Navigate to="welcome" replace />} />
      </Routes>
    </div>
  );
}

// Helper function to calculate progress percentage
function getProgressPercentage(currentStep: string, workspaceType: string | null): number {
  const allSteps = [
    "welcome",
    "team-selection",
    "team-workspace",
    "team-invite",
    "post-format",
    "post-frequency",
    "registration",
    "extension-install",
    "completion",
    "dashboard"
  ];
  
  // Filter steps based on workspace type
  const applicableSteps = workspaceType === "personal"
    ? allSteps.filter(step => step !== "team-workspace" && step !== "team-invite")
    : allSteps;
  
  const currentIndex = applicableSteps.indexOf(currentStep);
  
  if (currentIndex === -1) return 0;
  
  // Mark this as a returning user if they've already started onboarding
  if (currentIndex > 0) {
    localStorage.setItem('returningUser', 'true');
  }
  
  return (currentIndex / (applicableSteps.length - 1)) * 100;
}
