import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingRouter } from "@/components/OnboardingRouter";
import InvitationCheckRoute from "@/components/InvitationCheckRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import PendingInvitationsPage from "./pages/PendingInvitationsPage";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import FeaturesPage from "./pages/FeaturesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import PricingPage from "./pages/PricingPage";
import ContextVerifier from "./components/ContextVerifier";

const queryClient = new QueryClient();

// Set default theme class on document before React hydration
// This helps prevent theme flicker on page load
document.documentElement.classList.add("dark");
if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "dark");
}

// Add theme transition styles to prevent flicker
const style = document.createElement('style');
style.innerHTML = `
  .theme-transition {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
  }
  
  /* Add base colors that apply before React hydrates */
  :root {
    color-scheme: light;
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }
  
  .dark {
    color-scheme: dark;
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
  
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
`;
document.head.appendChild(style);

// Loading spinner component with our new design
function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="relative">
        {/* Background circle with subtle pulsing effect */}
        <motion.div 
          className="absolute inset-0 w-28 h-28 rounded-full bg-gradient-to-r from-teal-400/10 to-cyan-500/10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Spinning borders */}
        <div className="w-20 h-20 border-t-4 border-b-4 border-transparent rounded-full animate-spin-slow"></div>
        <div className="absolute inset-0 w-20 h-20 border-t-4 border-l-4 border-r-4 border-transparent border-t-teal-400 border-r-cyan-500 border-l-teal-400 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
        <div className="absolute inset-0 w-20 h-20 border-b-4 border-r-4 border-transparent border-r-cyan-500 border-b-cyan-500 rounded-full animate-spin-slow" style={{ animationDuration: '2s' }}></div>
        
        {/* Pulsing checkmark */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-teal-500 dark:text-teal-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 16L14 20L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
      
      {/* Loading text */}
      <motion.div 
        className="absolute mt-28 text-sm font-medium text-gray-600 dark:text-gray-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading Sekcion...
      </motion.div>
    </div>
  );
}

// The AppRoutes component remained unchanged, but now without BrowserRouter wrapper
const AppRoutes = () => {
  // Protected Onboarding Route Component
  function ProtectedOnboardingRoute() {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoadingProgress, setIsLoadingProgress] = useState(false);
    
    // Check for saved onboarding progress when component mounts
    useEffect(() => {
      // Only run this if the user is authenticated and hasn't completed onboarding
      if (isAuthenticated && user && !user.onboardingCompleted && !location.pathname.includes('/onboarding/')) {
        setIsLoadingProgress(true);
        
        // Get saved step from localStorage
        const savedStep = localStorage.getItem('onboardingStep');
        
        if (savedStep) {
          // Redirect to the saved step
          navigate(`/onboarding/${savedStep}`, { replace: true });
        } else {
          // If no saved step, start from the beginning
          navigate('/onboarding/welcome', { replace: true });
        }
        
        setIsLoadingProgress(false);
      }
    }, [isAuthenticated, user, navigate, location.pathname]);
    
    // If still loading user or onboarding progress.
    if (loading || isLoadingProgress) {
      return <LoadingSpinner />;
    }
    
    // If user is authenticated and has completed onboarding, redirect to dashboard
    if (isAuthenticated && user?.onboardingCompleted) {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Otherwise, show the onboarding flow
    return <OnboardingRouter />;
  }

  // Protected Dashboard Route Component
  function ProtectedDashboardRoute() {
    const { user, isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    
    // Always prioritize localStorage value since it's set immediately at completion time
    // This prevents redirection back to onboarding extension-install page
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    
    if (!onboardingCompleted) {
      // If we have a user object and it says onboarding is completed, update localStorage
      if (user && user.onboardingCompleted) {
        localStorage.setItem('onboardingCompleted', 'true');
        return <DashboardPage />;
      }
      
      // Otherwise redirect to onboarding
      const savedStep = localStorage.getItem('onboardingStep') || 'welcome';
      return <Navigate to={`/onboarding/${savedStep}`} replace />;
    }
    
    return <DashboardPage />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/auth/social-callback" element={<OAuthCallbackPage />} />
      
      {/* Check for invitations first, then redirect to onboarding or dashboard */}
      <Route element={<InvitationCheckRoute />}>
        <Route path="/onboarding/*" element={<ProtectedOnboardingRoute />} />
        <Route path="/dashboard" element={<ProtectedDashboardRoute />} />
      </Route>
      
      <Route path="/pending-invitations" element={<PendingInvitationsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <OnboardingProvider>
                <ContextVerifier>
                  <AppRoutes />
                </ContextVerifier>
              </OnboardingProvider>
            </AuthProvider>
          </LanguageProvider>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
