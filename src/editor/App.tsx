import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const EditorRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Only show authentication check if we're on a protected route
  if (location.pathname !== "/") {
    // If we're checking authentication status, show loading
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    // If user is not authenticated, redirect to login with return path
    if (!isAuthenticated) {
      return <Navigate to="/" state={{ returnTo: location.pathname }} />;
    }
  }
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <EditorRoutes />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
