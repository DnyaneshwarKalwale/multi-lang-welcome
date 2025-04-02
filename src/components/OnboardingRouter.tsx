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
  const { workspaceType, currentStep, setCurrentStep, saveProgress, getApplicableSteps } = useOnboarding();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle browser back/forward button navigation
  useEffect(() => {
    const handleHistoryChange = () => {
      const path = location.pathname;
      if (path.startsWith('/onboarding/')) {
        const step = path.replace('/onboarding/', '') as any;
        const applicableSteps = getApplicableSteps();
        
        // Check if this is a valid step in our flow
        if (applicableSteps.includes(step)) {
          // Update the current step in our context
          setCurrentStep(step);
        } else {
          // If we're on an invalid step (e.g., team pages for personal workspace),
          // redirect to the appropriate step in the flow
          const currentIndex = applicableSteps.indexOf(currentStep);
          if (currentIndex >= 0) {
            navigate(`/onboarding/${applicableSteps[currentIndex]}`, { replace: true });
          } else {
            // Fallback to the beginning if we can't determine current position
            navigate('/onboarding/welcome', { replace: true });
          }
        }
      }
    };
    
    handleHistoryChange();
  }, [location.pathname, workspaceType, currentStep, setCurrentStep, navigate, getApplicableSteps]);
  
  // Redirect logic for team vs personal workspace
  useEffect(() => {
    // If on team-workspace or team-invite but not a team workspace, skip
    if (workspaceType === "personal") {
      if (location.pathname.includes("team-workspace") || 
          location.pathname.includes("team-invite")) {
        navigate("/onboarding/theme-selection", { replace: true });
      }
    }
  }, [workspaceType, location.pathname, navigate]);

  // Save current step to localStorage when route changes
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.startsWith('/onboarding/')) {
      const currentOnboardingStep = currentPath.replace('/onboarding/', '');
      
      // Only save if we're on a valid onboarding step
      if (currentOnboardingStep && currentOnboardingStep !== '') {
        localStorage.setItem('onboardingStep', currentOnboardingStep);
        
        // Only call saveProgress if user is authenticated
        if (user) {
          saveProgress();
        }
      }
    }
  }, [location.pathname, saveProgress, user]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress indicator - more subtle design */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-gray-900 z-50 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 ease-in-out"
          style={{ 
            width: `${getProgressPercentage(currentStep, workspaceType)}%`,
            boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)'
          }}
        />
      </div>
      
      {/* Session progress tooltip - only show briefly and then fade out */}
      {localStorage.getItem('returningUser') === 'true' && (
        <div className="fixed top-4 right-4 hidden">
          <div className="bg-indigo-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-md text-sm z-50 flex items-center shadow-lg border border-indigo-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Resumed from last session
          </div>
        </div>
      )}
      
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
