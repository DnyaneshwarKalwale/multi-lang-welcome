import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import ThemeDebugHelper from "@/components/ThemeDebugHelper";
import LoadingScreen from "./components/LoadingScreen";

// Pages
const Index = lazy(() => import("@/pages/Index"));
const ThemeSelectionPage = lazy(() => import("@/pages/ThemeSelectionPage"));
const LanguageSelectionPage = lazy(() => import("@/pages/LanguageSelectionPage"));
const LoginPage = lazy(() => import("@/pages/Index"));
const RegisterPage = lazy(() => import("@/pages/Index"));
const ForgotPasswordPage = lazy(() => import("@/pages/Index"));
const ResetPasswordPage = lazy(() => import("@/pages/Index"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

// Create a client
const queryClient = new QueryClient();

// Initialize theme based on local storage and system preference
function initializeTheme() {
  try {
    // Check if theme already exists in localStorage
    const savedTheme = localStorage.getItem("theme");
    
    // If we already have a theme class on the document, don't override it
    const hasThemeClass = document.documentElement.classList.contains("dark") || 
                          document.documentElement.classList.contains("light");
    
    if (hasThemeClass) {
      console.log("Theme class already exists on document");
      return;
    }
    
    // Apply saved theme if it exists
    if (savedTheme) {
      console.log(`Applying saved theme: ${savedTheme}`);
      document.documentElement.classList.add(savedTheme);
      document.documentElement.classList.remove(savedTheme === "dark" ? "light" : "dark");
      return;
    }
    
    // Otherwise check user preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    console.log(`System prefers dark mode: ${prefersDark}`);
    document.documentElement.classList.add(prefersDark ? "dark" : "light");
    document.documentElement.classList.remove(prefersDark ? "light" : "dark");
    localStorage.setItem("theme", prefersDark ? "dark" : "light");
  } catch (error) {
    console.error("Failed to initialize theme, defaulting to dark", error);
    // Default to dark theme if something goes wrong
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }
}

// Add global functions for manually toggling theme in development
if (process.env.NODE_ENV === "development") {
  (window as any).forceDarkTheme = () => {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
    console.log("Forced dark theme");
  };
  
  (window as any).forceLightTheme = () => {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    console.log("Forced light theme");
  };
}

// Add global setTheme function for compatibility with IndexThemeToggle
window.setTheme = (theme: "dark" | "light") => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }
  localStorage.setItem("theme", theme);
  console.log(`Theme set to ${theme} via global setTheme`);
};

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// App routes with context usage
function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/theme" element={<ThemeSelectionPage />} />
        <Route path="/language" element={<LanguageSelectionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

// Context loading guard
function ContextLoadingGuard() {
  const { loading: authLoading } = useAuth();
  const { isThemeLoaded } = useTheme();
  
  // Let's assume language doesn't have a loading state
  const isLoading = authLoading || !isThemeLoaded;
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return <AppRoutes />;
}

// Initialize theme on load
initializeTheme();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider>
                <ContextLoadingGuard />
                <Toaster />
                <ThemeDebugHelper />
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
