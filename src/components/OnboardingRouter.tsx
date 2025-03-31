
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
  const { currentStep } = useOnboarding();
  
  return (
    <Routes>
      <Route path="welcome" element={<WelcomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="team-selection" element={<TeamSelectionPage />} />
      <Route path="theme-selection" element={<ThemeSelectionPage />} />
      <Route path="language-selection" element={<LanguageSelectionPage />} />
      <Route path="post-format" element={<PostFormatPage />} />
      <Route path="post-frequency" element={<PostFrequencyPage />} />
      <Route path="registration" element={<RegistrationPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="" element={<Navigate to="welcome" replace />} />
    </Routes>
  );
}
