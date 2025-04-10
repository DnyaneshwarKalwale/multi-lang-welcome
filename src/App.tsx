
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { Toaster } from "sonner";

// Pages
import Index from "@/pages/Index";
import DashboardPage from "@/pages/DashboardPage";
import WelcomePage from "@/pages/WelcomePage";
import TeamSelectionPage from "@/pages/onboarding/TeamSelectionPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import PostingPage from "@/pages/PostingPage";
import AIContentPage from "@/pages/AIContentPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OnboardingProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/posting" element={<PostingPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/ai-content" element={<AIContentPage />} />
            
            {/* Onboarding Routes */}
            <Route path="/onboarding/welcome" element={<WelcomePage />} />
            <Route path="/onboarding/team-selection" element={<TeamSelectionPage />} />
          </Routes>
          
          <Toaster position="top-right" richColors closeButton />
        </OnboardingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
