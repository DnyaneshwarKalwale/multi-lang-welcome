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
import PostFormatPage from "@/pages/PostFormatPage";
import ExtensionDownloadPage from "@/pages/ExtensionDownloadPage";
import ProfileInputPage from "@/pages/ProfileInputPage";
import OnboardingCompletedPage from "@/pages/OnboardingCompletedPage";
import ContentGenerationPage from "@/pages/ContentGenerationPage";
import RegistrationPage from "@/pages/RegistrationPage";
import DashboardPage from "@/pages/DashboardPage";
import PlanSelectionPage from "@/pages/PlanSelectionPage";
import StyleSelectionPage from "@/pages/StyleSelectionPage";
import { LoadingScreen } from "./LoadingScreen";

export const OnboardingRouter = () => {
  const { currentStep, setCurrentStep } = useOnboarding();
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the current path without the '/onboarding/' prefix
  const currentPath = location.pathname.replace('/onboarding/', '');
  
  // Handle direct access to pages during refresh or direct URL access
  useEffect(() => {
    // Only run this if currentStep is 'initial' (app just loaded) or on page reload
    if (currentStep === 'initial' && !loading) {
      // These are valid onboarding steps
      const validSteps = [
        'welcome', 
        'team-selection', 
        'team-workspace',
        'team-invite',
        'theme-selection', 
        'language-selection', 
        'post-format', 
        'post-frequency',
        'extension-download',
        'profile-input',
        'completed',
        'content-generation',
        'registration', 
        'dashboard'
      ];
      
      // If the current path is a valid step, set it as the current step
      if (validSteps.includes(currentPath)) {
        setCurrentStep(currentPath as any);
      } else if (currentPath === '' || currentPath === 'onboarding') {
        // Default to welcome page if no specific page is requested
        navigate('/onboarding/welcome', { replace: true });
      }
    }
  }, [currentPath, currentStep, loading, navigate, setCurrentStep]);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Routes>
      <Route path="welcome" element={<WelcomePage />} />
      <Route path="team-selection" element={<TeamSelectionPage />} />
      <Route path="theme-selection" element={<ThemeSelectionPage />} />
      <Route path="language-selection" element={<LanguageSelectionPage />} />
      <Route path="team-workspace" element={<TeamWorkspacePage />} />
      <Route path="post-format" element={<PostFormatPage />} />
      <Route path="post-frequency" element={<PostFrequencyPage />} />
      <Route path="extension-download" element={<ExtensionDownloadPage />} />
      <Route path="profile-input" element={<ProfileInputPage />} />
      <Route path="completed" element={<OnboardingCompletedPage />} />
      <Route path="content-generation" element={<ContentGenerationPage />} />
      <Route path="registration" element={<RegistrationPage />} />
      <Route path="plan-selection" element={<PlanSelectionPage />} />
      <Route path="style-selection" element={<StyleSelectionPage />} />
      <Route 
        path="dashboard" 
        element={<Navigate to="/dashboard" replace />}
      />
      <Route 
        path="*" 
        element={
          <Navigate to={currentStep === 'initial' ? '/onboarding/welcome' : `/onboarding/${currentStep}`} replace />
        } 
      />
    </Routes>
  );
};
