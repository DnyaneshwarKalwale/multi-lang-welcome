import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingRouter } from "@/components/OnboardingRouter";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// This component wraps our routes and handles auth redirects
function AppRoutes() {
  const { isAuthenticated, loading, user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the app state
  useEffect(() => {
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  // Show loading screen while checking auth state
  if (loading || !isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes accessible to all */}
      <Route path="/" element={
        isAuthenticated && user?.onboardingCompleted ? <Navigate to="/dashboard" replace /> : 
        isAuthenticated ? <Navigate to="/onboarding/welcome" replace /> : <Index />
      } />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/auth/social-callback" element={<OAuthCallbackPage />} />

      {/* Protected routes */}
      <Route 
        path="/onboarding/*" 
        element={
          <ProtectedRoute requireVerified={false}>
            <OnboardingRouter />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requireVerified={true}>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
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
                <AppRoutes />
              </TooltipProvider>
            </OnboardingProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
