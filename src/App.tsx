import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { StateProvider } from "@/contexts/StateContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingRouter } from "@/components/OnboardingRouter";
import InvitationCheckRoute from "@/components/InvitationCheckRoute";
import AppLayout from "@/components/AppLayout";
import { PostCountProvider } from "@/components/CollapsibleSidebar";
import AdminRouter from "@/admin-dashboard/AdminRouter";

const queryClient = new QueryClient();

// Lazy load all pages
const Index = React.lazy(() => import('./pages/Index'));
const EditorIndex = React.lazy(() => import('./editor/pages/Index'));
const FeaturesPage = React.lazy(() => import('./pages/FeaturesPage'));
const HowItWorksPage = React.lazy(() => import('./pages/HowItWorksPage'));
const TestimonialsPage = React.lazy(() => import('./pages/TestimonialsPage'));
const PricingPage = React.lazy(() => import('./pages/PricingPage'));
const OAuthCallbackPage = React.lazy(() => import('./pages/OAuthCallbackPage'));
const VerifyEmailPage = React.lazy(() => import('./pages/VerifyEmailPage'));
const PendingInvitationsPage = React.lazy(() => import('./pages/PendingInvitationsPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const CreatePostPage = React.lazy(() => import('./pages/CreatePostPage'));
const PostLibraryPage = React.lazy(() => import('./pages/PostLibraryPage'));
const RequestCarouselPage = React.lazy(() => import('./pages/RequestCarouselPage'));
const CarouselsPage = React.lazy(() => import('./pages/CarouselsPage'));
const MyCarouselsPage = React.lazy(() => import('./pages/MyCarouselsPage'));
const CarouselTemplatesPage = React.lazy(() => import('./pages/CarouselTemplatesPage'));
const ScraperPage = React.lazy(() => import('./pages/ScraperPage'));
const InspirationPage = React.lazy(() => import('./pages/InspirationPage'));
const AIWriterPage = React.lazy(() => import('./pages/AIWriterPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const TeamsPage = React.lazy(() => import('./pages/TeamsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const BillingPage = React.lazy(() => import('./pages/BillingPage'));
const CheckoutSuccessPage = React.lazy(() => import('./pages/CheckoutSuccessPage'));
const CheckoutCancelPage = React.lazy(() => import('./pages/CheckoutCancelPage'));
const CreditsSuccessPage = React.lazy(() => import('./pages/CreditsSuccessPage'));
const ImageGalleryPage = React.lazy(() => import('./pages/ImageGalleryPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
  }

  // Protected Dashboard Route Component with optimized loading
  function ProtectedDashboardRoute() {
    const { user, isAuthenticated, loading } = useAuth();
    const [showLoader, setShowLoader] = useState(false);
    
    // Only show loader after 500ms of loading
    useEffect(() => {
    let loaderTimeout: NodeJS.Timeout;
      if (loading) {
      loaderTimeout = setTimeout(() => {
          setShowLoader(true);
        }, 500);
    }
    return () => {
      if (loaderTimeout) {
        clearTimeout(loaderTimeout);
      }
    };
    }, [loading]);
    
    // Show loading spinner while authenticating
    if (loading && showLoader) {
      return <LoadingSpinner />;
    }
    
    // Check for token directly, as an additional safeguard
    const authMethod = localStorage.getItem('auth-method');
    const hasToken = authMethod && localStorage.getItem(`${authMethod}-login-token`);
    
    // If not authenticated and not loading AND no token, redirect to homepage
    if (!isAuthenticated && !loading && !hasToken) {
      console.log('ProtectedDashboardRoute - User not authenticated, redirecting to homepage');
      return <Navigate to="/" replace />;
    }
    
    // Check both localStorage and user object for onboarding completion
    const localOnboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    const userOnboardingCompleted = user?.onboardingCompleted;
    
    // If user object says onboarding is completed, trust that and update localStorage
    if (user && userOnboardingCompleted && !localOnboardingCompleted) {
      console.log('ProtectedDashboardRoute - User has completed onboarding in database, updating localStorage');
      localStorage.setItem('onboardingCompleted', 'true');
      return <Navigate to="/dashboard/home" replace />;
    }
    
    // If user hasn't completed onboarding according to both sources, redirect to onboarding
    if (!localOnboardingCompleted && user && !userOnboardingCompleted) {
      console.log('ProtectedDashboardRoute - User needs to complete onboarding');
      const savedStep = localStorage.getItem('onboardingStep') || 'welcome';
      return <Navigate to={`/onboarding/${savedStep}`} replace />;
    }
    
    // If we have user data and they've completed onboarding, or localStorage says completed, go to dashboard
    if ((user && userOnboardingCompleted) || localOnboardingCompleted) {
      return <Navigate to="/dashboard/home" replace />;
    }
    
    // Default case - if we're still loading user data, show loading
    if (loading || !user) {
      return <LoadingSpinner />;
    }
    
    // Fallback - redirect to onboarding
    return <Navigate to="/onboarding/welcome" replace />;
  }

// The AppRoutes component without BrowserRouter wrapper
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <Index />
        </React.Suspense>
      } />
      <Route path="/features" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <FeaturesPage />
        </React.Suspense>
      } />
      <Route path="/how-it-works" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <HowItWorksPage />
        </React.Suspense>
      } />
      <Route path="/testimonials" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <TestimonialsPage />
        </React.Suspense>
      } />
      <Route path="/pricing" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <PricingPage />
        </React.Suspense>
      } />
      <Route path="/auth/social-callback" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <OAuthCallbackPage />
        </React.Suspense>
      } />
      <Route path="/auth/callback" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <OAuthCallbackPage />
        </React.Suspense>
      } />
      <Route path="/verify-email" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <VerifyEmailPage />
        </React.Suspense>
      } />
      <Route path="/invitations" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <PendingInvitationsPage />
        </React.Suspense>
      } />
      
      {/* Protected onboarding routes */}
      <Route path="/onboarding/*" element={<OnboardingRouter />} />
      
      {/* Editor route */}
      <Route path="/editor" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <EditorIndex />
        </React.Suspense>
      } />
      
      {/* Protected dashboard routes */}
      <Route path="/dashboard" element={<ProtectedDashboardRoute />} />
      
      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRouter />} />
      
      {/* Protected routes with AppLayout */}
      <Route element={<InvitationCheckRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard/home" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <DashboardPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/post" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <CreatePostPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/posts" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <PostLibraryPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/request-carousel" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <RequestCarouselPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/carousels" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <CarouselsPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/my-carousels" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <MyCarouselsPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/templates" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <CarouselTemplatesPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/scraper" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <ScraperPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/inspiration" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <InspirationPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/ai" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <AIWriterPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/analytics" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <AnalyticsPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/notifications" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <NotificationsPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/team" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <TeamsPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/settings" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <SettingsPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/billing" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <BillingPage />
            </React.Suspense>
          } />
          <Route path="/settings/billing" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <BillingPage />
            </React.Suspense>
          } />
          <Route path="/billing/success" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <CheckoutSuccessPage />
            </React.Suspense>
          } />
          <Route path="/billing/cancel" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <CheckoutCancelPage />
            </React.Suspense>
          } />
          <Route path="/billing/credits-success" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <CreditsSuccessPage />
            </React.Suspense>
          } />
          <Route path="/dashboard/images" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <ImageGalleryPage />
            </React.Suspense>
          } />
        </Route>
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={
        <React.Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </React.Suspense>
      } />
    </Routes>
  );
};

// Main App component
export default function App() {
  return (
  <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StateProvider>
          <AuthProvider>
            <LanguageProvider>
              <OnboardingProvider>
                <NotificationProvider>
                  <Toaster />
                        <AppRoutes />
                </NotificationProvider>
              </OnboardingProvider>
            </LanguageProvider>
          </AuthProvider>
        </StateProvider>
      </ThemeProvider>
  </QueryClientProvider>
);
}
