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
        const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const invitations = response.data.data || [];
        setHasInvitations(invitations.length > 0);
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
    // You could return a loading spinner here
    return null;
  }

  // If user has invitations, redirect to the pending invitations page
  if (hasInvitations) {
    return <Navigate to="/pending-invitations" replace />;
  }

  // Otherwise, render the protected child route
  return <Outlet />;
};

export default InvitationCheckRoute; 