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

        console.log('Checking for invitations in InvitationCheckRoute');
        const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
        console.log(`Using API URL: ${baseApiUrl}`);
        
        try {
          const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000 // Add timeout to avoid long waits
          });

          const invitations = response.data.data || [];
          console.log(`Found ${invitations.length} pending invitations:`, invitations);
          
          // Store invitations in localStorage for offline access
          if (invitations.length > 0) {
            localStorage.setItem('cachedInvitations', JSON.stringify(invitations));
          }
          
          setHasInvitations(invitations.length > 0);
        } catch (apiError: any) {
          console.error('Failed to check invitations:', apiError);
          
          // Log detailed error information for debugging
          if (apiError.response) {
            console.error('Error response:', {
              status: apiError.response.status,
              statusText: apiError.response.statusText,
              data: apiError.response.data
            });
          } else if (apiError.request) {
            console.error('Error request:', apiError.request);
          }
          
          // Check if we have cached invitations we can use
          const cachedInvitations = localStorage.getItem('cachedInvitations');
          if (cachedInvitations) {
            try {
              const invitations = JSON.parse(cachedInvitations);
              console.log('Using cached invitations:', invitations);
              setHasInvitations(invitations.length > 0);
              return;
            } catch (cacheError) {
              console.error('Error parsing cached invitations:', cacheError);
            }
          }
          
          // If API endpoint doesn't exist or returns error, just proceed
          console.log('Continuing without invitations after error');
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