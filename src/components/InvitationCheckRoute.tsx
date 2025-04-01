import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const InvitationCheckRoute = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [hasInvitations, setHasInvitations] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInvitations = async () => {
      // Don't check if user isn't authenticated
      if (!isAuthenticated || authLoading) {
        setLoading(false);
        return;
      }

      // Check if user has previously skipped invitations
      const skippedInvitations = localStorage.getItem('skippedInvitations');
      if (skippedInvitations === 'true') {
        setHasInvitations(false);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setHasInvitations(false);
          setLoading(false);
          return;
        }

        const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
        try {
          const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const invitations = response.data.data || [];
          setHasInvitations(invitations.length > 0);
        } catch (apiError) {
          console.error('Failed to check invitations:', apiError);
          // If API endpoint doesn't exist or returns error, just proceed
          setHasInvitations(false);
        }
      } catch (error) {
        console.error('Failed to check invitations:', error);
        setHasInvitations(false);
      } finally {
        setLoading(false);
      }
    };

    checkInvitations();
  }, [isAuthenticated, authLoading]);

  if (loading || authLoading) {
    // Show loading spinner
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to the homepage
  if (!isAuthenticated) {
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