import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const InvitationCheckRoute = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [hasInvitations, setHasInvitations] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for token directly, as an additional safeguard
    const authMethod = localStorage.getItem('auth-method');
    const hasToken = authMethod && localStorage.getItem(`${authMethod}-login-token`);
    
    // Skip invitation check if user has previously skipped invitations
    const skippedInvitations = localStorage.getItem('skippedInvitations');
    if (skippedInvitations === 'true') {
      setHasInvitations(false);
      return;
    }

    // Don't check if user isn't authenticated
    if (!isAuthenticated || authLoading || !hasToken) {
      return;
    }

    const checkInvitations = async () => {
      // Quick check for cached invitations first
      const cachedInvitations = localStorage.getItem('cachedInvitations');
      if (cachedInvitations) {
        try {
          const invitations = JSON.parse(cachedInvitations);
          if (invitations.length > 0) {
            setHasInvitations(true);
            return;
          }
        } catch (e) {
          console.error('Error parsing cached invitations');
        }
      }

      try {
        const authMethod = localStorage.getItem('auth-method');
        const token = authMethod ? localStorage.getItem(`${authMethod}-login-token`) : null;

        if (!token) {
          console.error('No authentication token found');
          setHasInvitations(false);
          return;
        }

        const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
        
        // Do this check in the background without blocking the UI
        axios.get(`${baseApiUrl}/teams/invitations`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000 // Shorter timeout to avoid slow loading
        }).then(response => {
          const invitations = response.data.data || [];
          
          // Store invitations in localStorage for offline access
          if (invitations.length > 0) {
            localStorage.setItem('cachedInvitations', JSON.stringify(invitations));
            setHasInvitations(true);
          } else {
            setHasInvitations(false);
          }
        }).catch((error) => {
          // If API call fails, assume no invitations and continue
          console.error('Failed to check invitations:', error);
          setHasInvitations(false);
        });
      } catch (error) {
        console.error('Failed to check invitations:', error);
        setHasInvitations(false);
      }
    };

    // Run invitation check without blocking
    checkInvitations();
  }, [isAuthenticated, authLoading, user]);

  // Only show loading indicator if authentication is still loading
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // Check for token directly, as an additional safeguard
  const authMethod = localStorage.getItem('auth-method');
  const hasToken = authMethod && localStorage.getItem(`${authMethod}-login-token`);

  // If not authenticated or no token, redirect to the homepage
  if ((!isAuthenticated && !authLoading) || !hasToken) {
    console.log('InvitationCheckRoute - User not authenticated, redirecting to homepage');
    return <Navigate to="/" replace />;
  }

  // If user has invitations, redirect to the pending invitations page
  if (hasInvitations) {
    return <Navigate to="/pending-invitations" replace />;
  }

  // Otherwise, render the protected child route
  return <Outlet />;
};

export default InvitationCheckRoute; 