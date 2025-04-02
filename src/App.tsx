import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import api from "@/services/api";
import { toast } from "sonner";
import { OnboardingRouter } from "@/components/OnboardingRouter";
import CustomNavbar from "@/components/CustomNavbar"; // Use custom navbar
import InvitationCheckRoute from "@/components/InvitationCheckRoute";
import CustomIndex from "./pages/CustomIndex"; // Use custom index
import RegistrationPage from "./pages/RegistrationPage";
import LanguageSelectionPage from "./pages/LanguageSelectionPage";
import PostFormatPage from "./pages/PostFormatPage";
import PostFrequencyPage from "./pages/PostFrequencyPage";
import ThemeSelectionPage from "./pages/ThemeSelectionPage";
import TeamSelectionPage from "./pages/TeamSelectionPage";
import TeamInvitePage from "./pages/TeamInvitePage";
import ExtensionInstallPage from "./pages/ExtensionInstallPage";
import CompletionPage from "./pages/CompletionPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashboardPage from "./pages/DashboardPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import PendingInvitationsPage from "./pages/PendingInvitationsPage";
import TeamWorkspacePage from "./pages/TeamWorkspacePage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <OnboardingProvider>
              <CustomNavbar />
              <Toaster />
              <Routes>
                <Route path="/" element={<CustomIndex />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
                <Route path="/verify" element={<VerifyEmailPage />} />

                {/* Protected routes */}
                <Route element={<InvitationCheckRoute />}>
                  <Route
                    path="/pending-invitations"
                    element={<PendingInvitationsPage />}
                  />
                  <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                  />
                  <Route
                    path="/team-workspace"
                    element={<TeamWorkspacePage />}
                  />

                  {/* Onboarding routes */}
                  <Route
                    path="/language-selection"
                    element={<LanguageSelectionPage />}
                  />
                  <Route path="/post-format" element={<PostFormatPage />} />
                  <Route
                    path="/post-frequency"
                    element={<PostFrequencyPage />}
                  />
                  <Route path="/theme" element={<ThemeSelectionPage />} />
                  <Route path="/team" element={<TeamSelectionPage />} />
                  <Route path="/team-invite" element={<TeamInvitePage />} />
                  <Route
                    path="/extension-install"
                    element={<ExtensionInstallPage />}
                  />
                  <Route path="/completion" element={<CompletionPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </OnboardingProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
