
import React from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import WelcomePage from "@/pages/WelcomePage";
import LoginPage from "@/pages/LoginPage";
import TeamSelectionPage from "@/pages/TeamSelectionPage";
import TeamWorkspacePage from "@/pages/TeamWorkspacePage";
import ThemeSelectionPage from "@/pages/ThemeSelectionPage";
import LanguageSelectionPage from "@/pages/LanguageSelectionPage";
import PostFormatPage from "@/pages/PostFormatPage";
import PostFrequencyPage from "@/pages/PostFrequencyPage";
import RegistrationPage from "@/pages/RegistrationPage";
import DashboardPage from "@/pages/DashboardPage";

export function OnboardingRouter() {
  const { currentStep, workspaceType } = useOnboarding();

  switch (currentStep) {
    case "welcome":
      return <WelcomePage />;
    case "login":
      return <LoginPage />;
    case "team-selection":
      return <TeamSelectionPage />;
    case "theme-selection":
      return <ThemeSelectionPage />;
    case "language-selection":
      return <LanguageSelectionPage />;
    case "post-format":
      return <PostFormatPage />;
    case "post-frequency":
      return <PostFrequencyPage />;
    case "registration":
      return <RegistrationPage />;
    case "dashboard":
      return <DashboardPage />;
    default:
      return <WelcomePage />;
  }
}
