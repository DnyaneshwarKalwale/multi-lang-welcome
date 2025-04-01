import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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

const queryClient = new QueryClient();

// Protected Onboarding Route Component
function ProtectedOnboardingRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  
  // If still loading user or onboarding progress, show loading spinner
  if (loading || isLoadingProgress) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // If user is authenticated and has completed onboarding, redirect to dashboard
  if (isAuthenticated && user?.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, show the onboarding flow
  // The OnboardingRouter will handle loading saved progress internally
  return <OnboardingRouter />;
}

// Protected Dashboard Route Component
function ProtectedDashboardRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // First check localStorage for onboarding status
  // This gives priority to localStorage which is updated at completion time
  // and only falls back to the user object if localStorage isn't set
  const onboardingCompleted = 
    localStorage.getItem('onboardingCompleted') === 'true' || 
    (user && user.onboardingCompleted);
  
  if (!onboardingCompleted) {
    const savedStep = localStorage.getItem('onboardingStep') || 'welcome';
    return <Navigate to={`/onboarding/${savedStep}`} replace />;
  }
  
  return <DashboardPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <OnboardingProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
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
              </TooltipProvider>
            </OnboardingProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
