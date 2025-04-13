import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, applyTheme } from "@/contexts/ThemeContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingRouter } from "@/components/OnboardingRouter";
import InvitationCheckRoute from "@/components/InvitationCheckRoute";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import TeamsPage from "./pages/TeamsPage";
import PendingInvitationsPage from "./pages/PendingInvitationsPage";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import FeaturesPage from "./pages/FeaturesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import PricingPage from "./pages/PricingPage";
import ContextVerifier from "./components/ContextVerifier";
import CreatePostPage from "./pages/CreatePostPage";
import PostLibraryPage from "./pages/PostLibraryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import InspirationPage from "./pages/InspirationPage";
import SettingsPage from "./pages/SettingsPage";
import RequestCarouselPage from "./pages/RequestCarouselPage";
import CarouselsPage from "./pages/CarouselsPage";
import MyCarouselsPage from "./pages/MyCarouselsPage";
import ScraperPage from "./pages/ScraperPage";
import AIWriterPage from "./pages/AIWriterPage";
import BillingPage from "./pages/BillingPage";
import ImageGalleryPage from "./pages/ImageGalleryPage";

const queryClient = new QueryClient();

// Initialize theme immediately to prevent flash
const initializeTheme = () => {
  // Always apply light theme
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("light");
  localStorage.setItem("theme", "light");
};

// Run theme initialization immediately
initializeTheme();

// Global theme functions (simplified to always use light theme)
// @ts-ignore
window.setLightTheme = () => {
  applyTheme();
  console.log("Light theme applied");
};

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
          className="absolute inset-0 w-28 h-28 rounded-full bg-gradient-to-r from-primary-light/10 to-primary/10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Spinning borders */}
        <div className="w-20 h-20 border-t-4 border-b-4 border-transparent rounded-full animate-spin-slow"></div>
        <div className="absolute inset-0 w-20 h-20 border-t-4 border-l-4 border-r-4 border-transparent border-t-primary-light border-r-primary border-l-primary-light rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
        <div className="absolute inset-0 w-20 h-20 border-b-4 border-r-4 border-transparent border-r-primary border-b-primary rounded-full animate-spin-slow" style={{ animationDuration: '2s' }}></div>
        
        {/* Pulsing checkmark */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-primary"
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
        className="absolute mt-28 text-sm font-medium text-gray-600"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading BrandOut...
      </motion.div>
    </div>
  );
}

// The AppRoutes component without BrowserRouter wrapper
const AppRoutes = () => {
  // Protected Onboarding Route Component with optimized loading
  function ProtectedOnboardingRoute() {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [loadingDuration, setLoadingDuration] = useState(0);
    const [showLoader, setShowLoader] = useState(false);
    
    // Start load timer to only show loader if loading takes more than 500ms
    useEffect(() => {
      if (loading) {
        const startTime = Date.now();
        const loaderTimeout = setTimeout(() => {
          setShowLoader(true);
        }, 500);
        
        return () => {
          clearTimeout(loaderTimeout);
          setLoadingDuration(Date.now() - startTime);
        };
      }
    }, [loading]);
    
    // Check for saved onboarding progress
    useEffect(() => {
      // Only run this if the user is authenticated and hasn't completed onboarding
      if (isAuthenticated && user && !user.onboardingCompleted && !location.pathname.includes('/onboarding/')) {
        // Get saved step from localStorage
        const savedStep = localStorage.getItem('onboardingStep');
        
        if (savedStep) {
          // Redirect to the saved step
          navigate(`/onboarding/${savedStep}`, { replace: true });
        } else {
          // If no saved step, start from the beginning
          navigate('/onboarding/welcome', { replace: true });
        }
      }
    }, [isAuthenticated, user, navigate, location.pathname]);
    
    // Only show loading indicator if loading takes more than 500ms
    if (loading && showLoader) {
      return <LoadingSpinner />;
    }
    
    // If user is authenticated and has completed onboarding, redirect to dashboard
    if (isAuthenticated && user?.onboardingCompleted) {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Otherwise, show the onboarding flow
    return <OnboardingRouter />;
  }

  // Protected Dashboard Route Component with optimized loading
  function ProtectedDashboardRoute() {
    const { user, isAuthenticated, loading } = useAuth();
    const [showLoader, setShowLoader] = useState(false);
    
    // Only show loader after 500ms of loading
    useEffect(() => {
      if (loading) {
        const loaderTimeout = setTimeout(() => {
          setShowLoader(true);
        }, 500);
        
        return () => clearTimeout(loaderTimeout);
      }
    }, [loading]);
    
    if (loading && showLoader) {
      return <LoadingSpinner />;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    
    // Always prioritize localStorage value since it's set immediately at completion time
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
    
    return <Navigate to="/dashboard/home" replace />;
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
      
      {/* Handle invitation token links */}
      <Route path="/invitations" element={<PendingInvitationsPage />} />
      
      {/* OAuth callback route - kept separate to avoid invitation check */}
      <Route path="/auth/social-callback" element={<OAuthCallbackPage />} />
      
      {/* Protected routes with invitation check wrapped in AppLayout */}
      <Route element={<InvitationCheckRoute />}>
        {/* Onboarding routes - without AppLayout */}
        <Route path="/onboarding/*" element={<ProtectedOnboardingRoute />} />
        
        {/* Dashboard and other pages - with AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />
          <Route path="/dashboard/home" element={<DashboardPage />} />
          <Route path="/dashboard/post" element={<CreatePostPage />} />
          <Route path="/dashboard/posts" element={<PostLibraryPage />} />
          <Route path="/dashboard/request-carousel" element={<RequestCarouselPage />} />
          <Route path="/dashboard/carousels" element={<CarouselsPage />} />
          <Route path="/dashboard/my-carousels" element={<MyCarouselsPage />} />
          <Route path="/dashboard/scraper" element={<ScraperPage />} />
          <Route path="/dashboard/inspiration" element={<InspirationPage />} />
          <Route path="/dashboard/ai" element={<AIWriterPage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="/dashboard/team" element={<TeamsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          <Route path="/dashboard/images" element={<ImageGalleryPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <ContextVerifier>
                <OnboardingProvider>
                  <AppRoutes />
                  <Toaster />
                  <Sonner position="top-right" />
                </OnboardingProvider>
              </ContextVerifier>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
