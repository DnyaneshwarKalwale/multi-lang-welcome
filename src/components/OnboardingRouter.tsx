import React, { useEffect, useState } from "react";
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
import RegistrationPage from "@/pages/RegistrationPage";
import DashboardPage from "@/pages/DashboardPage";
import PlanSelectionPage from "@/pages/PlanSelectionPage";
import StyleSelectionPage from "@/pages/StyleSelectionPage";
import ExtensionPage from "@/pages/ExtensionPage";
import ContentGenerationPage from "@/pages/ContentGenerationPage";
import { LoadingScreen } from "./LoadingScreen";

export const OnboardingRouter = () => {
  const { currentStep, setCurrentStep } = useOnboarding();
  const { isAuthenticated, loading, user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  
  // Extract the current path without the '/onboarding/' prefix
  const currentPath = location.pathname.replace('/onboarding/', '');
  
  // Refresh user data when onboarding router loads
  useEffect(() => {
    if (isAuthenticated && !loading && !initialized) {
      refreshUser().then(() => {
        setInitialized(true);
      });
    } else if (!loading) {
      setInitialized(true);
    }
  }, [isAuthenticated, loading, refreshUser, initialized]);
  
  // Handle direct access to pages during refresh or direct URL access
  useEffect(() => {
    // Only run this if currentStep is 'initial' (app just loaded) or on page reload
    if ((currentStep === 'initial' || !currentStep) && !loading && initialized) {
      // Redirect to dashboard if onboarding is already completed
      if (user?.onboardingCompleted) {
        console.log("User already completed onboarding, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
        return;
      }
      
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
        'extension',
        'content-generation',
        'registration',
        'plan-selection',
        'style-selection'
      ];
      
      // Debug log for helping diagnose login issues
      console.log(`OnboardingRouter - Current step: ${currentStep}, Path: ${currentPath}, User auth method: ${user?.authMethod}`);
      
      // If the current path is a valid step, set it as the current step
      if (validSteps.includes(currentPath)) {
        console.log(`Setting current step to: ${currentPath}`);
        setCurrentStep(currentPath as any);
      } else if (currentPath === '' || currentPath === 'onboarding') {
        // Default to welcome page if no specific page is requested
        // If user comes from Google/Twitter auth, ensure we properly handle it
        const startingPage = user?.lastOnboardingStep || 'welcome';
        console.log(`No specific page requested, starting from: ${startingPage}`);
        
        // Only navigate if we're not already at the welcome page to prevent loops
        if (location.pathname !== `/onboarding/${startingPage}`) {
          navigate(`/onboarding/${startingPage}`, { replace: true });
        }
      }
    }
  }, [currentPath, currentStep, loading, navigate, setCurrentStep, user, initialized, location.pathname]);
  
  // Redirect completed users to dashboard when they try to access onboarding pages
  useEffect(() => {
    if (!loading && initialized && user?.onboardingCompleted && location.pathname.includes('/onboarding')) {
      console.log("Onboarding already completed, redirecting to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [loading, navigate, user, location.pathname, initialized]);
  
  // Log for debugging
  useEffect(() => {
    console.log("Current step in OnboardingRouter:", currentStep);
    console.log("Current path:", location.pathname);
    console.log("User:", user);
    console.log("User onboarding completed:", user?.onboardingCompleted);
    console.log("User last onboarding step:", user?.lastOnboardingStep);
  }, [currentStep, location.pathname, user]);
  
  // Show loading screen while initializing or checking auth
  if (loading || !initialized) {
    return <LoadingScreen />;
  }
  
  // If user not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/?login=true" replace />;
  }
  
  // If user has completed onboarding, redirect to dashboard
  if (user?.onboardingCompleted) {
    console.log("User completed onboarding, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
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
      <Route path="extension" element={<ExtensionPage />} />
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
          <Navigate to={
            currentStep === 'initial' || !currentStep 
              ? '/onboarding/welcome' 
              : `/onboarding/${currentStep}`
          } replace />
        } 
      />
    </Routes>
  );
};
