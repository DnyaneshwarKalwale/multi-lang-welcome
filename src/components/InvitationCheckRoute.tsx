import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const InvitationCheckRoute = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [hasInvitations, setHasInvitations] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to avoid blocking navigation

  useEffect(() => {
    // Skip invitation check if user has previously skipped invitations
    const skippedInvitations = localStorage.getItem('skippedInvitations');
    if (skippedInvitations === 'true') {
      setHasInvitations(false);
      return;
    }

    // Don't check if user isn't authenticated
    if (!isAuthenticated || authLoading) {
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
        const token = localStorage.getItem('token');
        if (!token) {
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
        }).catch(() => {
          // If API call fails, assume no invitations and continue
          setHasInvitations(false);
        });
      } catch (error) {
        console.error('Failed to check invitations:', error);
        setHasInvitations(false);
      }
    };

    // Run invitation check without blocking
    checkInvitations();
  }, [isAuthenticated, authLoading]);

  // Only show loading indicator if authentication is still loading
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to the homepage
  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/" replace />;
  }

  // If user has invitations, redirect to the pending invitations page
  if (hasInvitations) {
    return <Navigate to="/pending-invitations" replace />;
  }

  // Otherwise, render the protected child route immediately
  // while potentially checking for invitations in the background
  return <Outlet />;
};

export default InvitationCheckRoute; 