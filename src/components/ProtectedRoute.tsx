import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireVerified = true
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Check if email verification is required and user's email is not verified
  if (requireVerified && user?.authMethod === 'email' && !user?.isEmailVerified) {
    // Redirect to verification page with email info
    return <Navigate to="/verify-email" state={{ email: user.email }} />;
  }

  return <>{children}</>;
}; 