import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuth } from "@/contexts/AuthContext";
import WelcomePage from "@/pages/WelcomePage";
import TeamSelectionPage from "@/pages/TeamSelectionPage";
import TeamWorkspacePage from "@/pages/TeamWorkspacePage";
import TeamInvitePage from "@/pages/TeamInvitePage";
import ThemeSelectionPage from "@/pages/ThemeSelectionPage";
import LanguageSelectionPage from "@/pages/LanguageSelectionPage";
import PostFormatPage from "@/pages/PostFormatPage";
import PostFrequencyPage from "@/pages/PostFrequencyPage";
import RegistrationPage from "@/pages/RegistrationPage";
import ExtensionInstallPage from "@/pages/ExtensionInstallPage";
import CompletionPage from "@/pages/CompletionPage";
import DashboardPage from "@/pages/DashboardPage";

export function OnboardingRouter() {
  const { workspaceType, currentStep, saveProgress } = useOnboarding();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redirect logic for team vs personal workspace
  useEffect(() => {
    // If on team-workspace or team-invite but not a team workspace, skip
    if (workspaceType === "personal") {
      if (location.pathname.includes("team-workspace") || 
          location.pathname.includes("team-invite")) {
        navigate("/onboarding/theme-selection");
      }
    }
  }, [workspaceType, location.pathname, navigate]);

  // Save current step to localStorage when route changes
  useEffect(() => {
    const currentPath = location.pathname;
    const currentOnboardingStep = currentPath.replace('/onboarding/', '');
    
    // Only save if we're on a valid onboarding step
    if (currentOnboardingStep && currentOnboardingStep !== '') {
      // Store the current step in localStorage
      localStorage.setItem('onboardingStep', currentOnboardingStep);
      
      // Only call saveProgress if user is authenticated
      if (user) {
        saveProgress();
      }
    }
  }, [location.pathname, saveProgress, user]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress indicator - visible on all onboarding pages */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ 
            width: `${getProgressPercentage(currentStep, workspaceType)}%`
          }}
        />
      </div>
      
      <Routes>
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="team-selection" element={<TeamSelectionPage />} />
        <Route path="team-workspace" element={<TeamWorkspacePage />} />
        <Route path="team-invite" element={<TeamInvitePage />} />
        <Route path="theme-selection" element={<ThemeSelectionPage />} />
        <Route path="language-selection" element={<LanguageSelectionPage />} />
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
    "theme-selection",
    "language-selection",
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
