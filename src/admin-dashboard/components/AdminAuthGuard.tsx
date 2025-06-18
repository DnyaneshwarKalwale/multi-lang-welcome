import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

/**
 * Auth guard component that checks if the user is authenticated as an admin
 */
const AdminAuthGuard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const validateAdminToken = async () => {
      try {
        const token = localStorage.getItem("admin-token");
        
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        
        // Verify the token with the backend
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Check if the user has admin role
        const user = response.data.user;
        if (user && user.role === "admin") {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("admin-token");
          localStorage.removeItem("admin-user");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Admin token validation error:", error);
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin-user");
        setIsAuthenticated(false);
      }
    };
    
    validateAdminToken();
  }, []);
  
  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying admin access...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // Render the protected route
  return <Outlet />;
};

export default AdminAuthGuard; 