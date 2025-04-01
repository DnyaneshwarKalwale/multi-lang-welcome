import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import WelcomePage from "@/pages/WelcomePage";
import TeamSelectionPage from "@/pages/TeamSelectionPage";
import ThemeSelectionPage from "@/pages/ThemeSelectionPage";
import LanguageSelectionPage from "@/pages/LanguageSelectionPage";
import TeamWorkspacePage from "@/pages/TeamWorkspacePage";
import PostFrequencyPage from "@/pages/PostFrequencyPage";
import RegistrationPage from "@/pages/RegistrationPage";
import DashboardPage from "@/pages/DashboardPage";
import PlanSelectionPage from "@/pages/PlanSelectionPage";
import StyleSelectionPage from "@/pages/StyleSelectionPage";
import { LoadingScreen } from "./LoadingScreen";

export const OnboardingRouter = () => {
  const { workspaceType, currentStep } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, refreshUser } = useAuth();
  
  // On mount, refresh user data to ensure we have latest onboarding status
  useEffect(() => {
    refreshUser();
  }, []);
  
  // Redirect logic for team vs personal workspace
  useEffect(() => {
    if (location.pathname === '/onboarding/team-workspace' && workspaceType !== 'team') {
      navigate('/onboarding/welcome');
    }
  }, [workspaceType, location.pathname, navigate]);
  
  // Show loading screen if auth is loading
  if (loading) {
    return <LoadingScreen />;
  }
  
  // If the user has completed onboarding, redirect them to the main dashboard
  if (user?.onboardingCompleted) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <Routes>
      <Route path="welcome" element={<WelcomePage />} />
      <Route path="team-selection" element={<TeamSelectionPage />} />
      <Route path="theme-selection" element={<ThemeSelectionPage />} />
      <Route path="language-selection" element={<LanguageSelectionPage />} />
      <Route path="team-workspace" element={<TeamWorkspacePage />} />
      <Route path="post-frequency" element={<PostFrequencyPage />} />
      <Route path="registration" element={<RegistrationPage />} />
      <Route path="plan-selection" element={<PlanSelectionPage />} />
      <Route path="style-selection" element={<StyleSelectionPage />} />
      <Route 
        path="dashboard" 
        element={<Navigate to="/dashboard" />}
      />
      <Route 
        path="*" 
        element={
          <Navigate to={currentStep === 'initial' ? '/onboarding/welcome' : `/onboarding/${currentStep}`} />
        } 
      />
    </Routes>
  );
};
