
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { Toaster } from "sonner";

// Pages
import Index from "@/pages/Index";
import DashboardPage from "@/pages/DashboardPage";
import WelcomePage from "@/pages/WelcomePage";
import TeamSelectionPage from "@/pages/TeamSelectionPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import PostingPage from "@/pages/PostingPage";
import AIContentPage from "@/pages/AIContentPage";
import ThemeSelectionPage from "@/pages/ThemeSelectionPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import PricingPage from "@/pages/PricingPage";

function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/posting" element={<PostingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ai-content" element={<AIContentPage />} />
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/welcome" element={<WelcomePage />} />
          <Route path="/onboarding/team-selection" element={<TeamSelectionPage />} />
          <Route path="/onboarding/theme-selection" element={<ThemeSelectionPage />} />
        </Routes>
        
        <Toaster position="top-right" richColors closeButton />
      </OnboardingProvider>
    </AuthProvider>
  );
}

export default App;
