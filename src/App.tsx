
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { LanguageContext } from "@/contexts/LanguageContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { OnboardingContext } from "@/contexts/OnboardingContext";
import { api } from "@/services/api";
import { toast } from "sonner";
import OnboardingRouter from "@/components/OnboardingRouter";
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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState("english");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isSettingUpAuth, setIsSettingUpAuth] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [pendingInvitationCount, setPendingInvitationCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    localStorage.getItem("onboardingCompleted") === "true"
  );
  const [onboardingStep, setOnboardingStep] = useState(
    localStorage.getItem("onboardingStep") || "language"
  );

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Auth effect
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const response = await api.get("/auth/me");
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error during authentication:", error);
          localStorage.removeItem("token");
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setIsSettingUpAuth(false);
    };

    initAuth();
  }, [token]);

  // Check pending invitations
  useEffect(() => {
    const fetchPendingInvitations = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get("/invitations/pending");
          setPendingInvitationCount(response.data.length);
        } catch (error) {
          console.error("Error fetching pending invitations:", error);
        }
      }
    };

    fetchPendingInvitations();
  }, [isAuthenticated]);

  // Auth functions
  const login = (token, user) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.Authorization;
    toast.success("You have been logged out.");
  };

  // Onboarding functions
  const updateOnboardingStep = (step) => {
    localStorage.setItem("onboardingStep", step);
    setOnboardingStep(step);
  };

  const completeOnboarding = () => {
    localStorage.setItem("onboardingCompleted", "true");
    setOnboardingCompleted(true);
  };

  // Loading is true during initial auth setup
  if (isSettingUpAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 dark:from-brand-purple/30 dark:to-brand-pink/30">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-t-brand-purple border-r-brand-purple border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <AuthContext.Provider
            value={{
              isAuthenticated,
              user,
              login,
              logout,
              loading,
              setLoading,
              pendingInvitationCount,
              setPendingInvitationCount,
            }}
          >
            <OnboardingContext.Provider
              value={{
                onboardingCompleted,
                onboardingStep,
                updateOnboardingStep,
                completeOnboarding,
              }}
            >
              <CustomNavbar />
              <Toaster position="top-center" />
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
                    element={
                      <OnboardingRouter
                        component={<DashboardPage />}
                        redirectTo="/language-selection"
                      />
                    }
                  />
                  <Route
                    path="/team-workspace"
                    element={
                      <OnboardingRouter
                        component={<TeamWorkspacePage />}
                        redirectTo="/language-selection"
                      />
                    }
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
            </OnboardingContext.Provider>
          </AuthContext.Provider>
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
