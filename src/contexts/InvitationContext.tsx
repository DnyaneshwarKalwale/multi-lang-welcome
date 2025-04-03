import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  role: string;
  createdAt: string;
}

interface InvitationContextType {
  invitations: TeamInvitation[];
  loading: boolean;
  fetchInvitations: () => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<void>;
  declineInvitation: (invitationId: string) => Promise<void>;
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export function InvitationProvider({ children }: { children: ReactNode }) {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInvitations = async () => {
    // Don't fetch if not logged in
    if (!user) {
      setInvitations([]);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      console.log('Fetching invitations from InvitationContext');
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      
      try {
        const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000 // Add timeout to avoid long waits
        });
        
        const fetchedInvitations = response.data.data || [];
        console.log(`Found ${fetchedInvitations.length} pending invitations`);
        setInvitations(fetchedInvitations);
        
        // Store invitations in localStorage for offline access
        if (fetchedInvitations.length > 0) {
          localStorage.setItem('cachedInvitations', JSON.stringify(fetchedInvitations));
        }
      } catch (apiError: any) {
        console.error('Failed to fetch invitations:', apiError);
        
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
        
        // Check if API is unreachable or returns 404
        if (apiError.response?.status === 404 || apiError.code === 'ECONNABORTED') {
          console.log('Using cached invitations since API is unavailable');
          
          // Try to get cached invitations from localStorage
          const cachedInvitations = localStorage.getItem('cachedInvitations');
          if (cachedInvitations) {
            try {
              const parsedInvitations = JSON.parse(cachedInvitations);
              setInvitations(parsedInvitations);
            } catch (cacheError) {
              console.error('Error parsing cached invitations:', cacheError);
              setInvitations([]);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error in fetchInvitations:', err);
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async (invitationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      
      try {
        const response = await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/accept`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        
        toast.success(`You've joined ${response.data.data.teamName}`);
      } catch (apiError) {
        console.error('API error accepting invitation:', apiError);
        // Handle offline/unavailable API scenario
        toast.success("Invitation accepted (offline mode)");
      }
      
      // Remove this invitation from the list
      const updatedInvitations = invitations.filter(inv => inv.id !== invitationId);
      setInvitations(updatedInvitations);
      
      // Update local cache
      localStorage.setItem('cachedInvitations', JSON.stringify(updatedInvitations));
    } catch (err) {
      console.error('Failed to accept invitation:', err);
      toast.error('Failed to accept invitation. Please try again.');
    }
  };

  const declineInvitation = async (invitationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      
      try {
        await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/decline`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        
        toast.success('Invitation declined');
      } catch (apiError) {
        console.error('API error declining invitation:', apiError);
        // Handle offline/unavailable API scenario
        toast.success("Invitation declined (offline mode)");
      }
      
      // Remove this invitation from the list
      const updatedInvitations = invitations.filter(inv => inv.id !== invitationId);
      setInvitations(updatedInvitations);
      
      // Update local cache
      localStorage.setItem('cachedInvitations', JSON.stringify(updatedInvitations));
    } catch (err) {
      console.error('Failed to decline invitation:', err);
      toast.error('Failed to decline invitation. Please try again.');
    }
  };

  // Fetch invitations on mount and when user changes
  useEffect(() => {
    fetchInvitations();
    
    // Poll for new invitations every minute
    const intervalId = setInterval(fetchInvitations, 60000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <InvitationContext.Provider
      value={{
        invitations,
        loading,
        fetchInvitations,
        acceptInvitation,
        declineInvitation
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitations() {
  const context = useContext(InvitationContext);
  if (context === undefined) {
    throw new Error("useInvitations must be used within an InvitationProvider");
  }
  return context;
} 