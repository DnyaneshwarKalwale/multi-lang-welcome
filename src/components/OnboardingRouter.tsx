import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
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
  const { workspaceType, currentStep } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redirect logic for team vs personal workspace
  React.useEffect(() => {
    // If on team-workspace or team-invite but not a team workspace, skip
    if (workspaceType === "personal") {
      if (location.pathname.includes("team-workspace") || 
          location.pathname.includes("team-invite")) {
        navigate("/onboarding/theme-selection");
      }
    }
  }, [workspaceType, location.pathname, navigate]);

  return (
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
  );
}
