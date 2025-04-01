import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onboardingApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Invitation {
  id: string;
  workspaceId: string;
  workspaceName: string;
  invitedBy: string;
  inviterName: string;
  inviterEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  role: string;
}

interface InvitationContextType {
  invitations: Invitation[];
  loading: boolean;
  error: string | null;
  hasUnreadInvitations: boolean;
  refreshInvitations: () => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<void>;
  declineInvitation: (invitationId: string) => Promise<void>;
  markAllRead: () => void;
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

// Local storage keys
const INVITATIONS_SEEN_KEY = 'invitations_seen';

export function InvitationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seenInvitationIds, setSeenInvitationIds] = useState<string[]>(() => {
    // Get seen invitation IDs from localStorage
    try {
      const stored = localStorage.getItem(INVITATIONS_SEEN_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error parsing seen invitations:", e);
      return [];
    }
  });

  // Helper function to determine if there are unread invitations
  const hasUnreadInvitations = invitations.some(
    invitation => !seenInvitationIds.includes(invitation.id) && invitation.status === 'pending'
  );

  // Mark all invitations as read
  const markAllRead = () => {
    const pendingIds = invitations
      .filter(inv => inv.status === 'pending')
      .map(inv => inv.id);
    
    const newSeenIds = [...new Set([...seenInvitationIds, ...pendingIds])];
    setSeenInvitationIds(newSeenIds);
    localStorage.setItem(INVITATIONS_SEEN_KEY, JSON.stringify(newSeenIds));
  };

  // Fetch invitations for the current user
  const refreshInvitations = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await onboardingApi.getWorkspaceInvitations();
      setInvitations(response.invitations || []);
    } catch (err: any) {
      console.error("Error fetching invitations:", err);
      setError("Failed to load workspace invitations");
    } finally {
      setLoading(false);
    }
  };

  // Accept invitation
  const acceptInvitation = async (invitationId: string) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onboardingApi.acceptInvitation(invitationId);
      
      // Update local state
      setInvitations(prevInvitations => 
        prevInvitations.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status: 'accepted' as const } 
            : inv
        )
      );
      
      // Show success toast
      toast({
        title: "Invitation accepted",
        description: "You have joined the workspace.",
        variant: "default"
      });
      
      // Refresh invitations
      await refreshInvitations();
    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      setError("Failed to accept workspace invitation");
      
      toast({
        title: "Error accepting invitation",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Decline invitation
  const declineInvitation = async (invitationId: string) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onboardingApi.declineInvitation(invitationId);
      
      // Update local state
      setInvitations(prevInvitations => 
        prevInvitations.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status: 'declined' as const } 
            : inv
        )
      );
      
      toast({
        title: "Invitation declined",
        description: "You have declined the workspace invitation.",
        variant: "default"
      });
      
      // Refresh invitations
      await refreshInvitations();
    } catch (err: any) {
      console.error("Error declining invitation:", err);
      setError("Failed to decline workspace invitation");
      
      toast({
        title: "Error declining invitation",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load invitations on mount and when user changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshInvitations();
    } else {
      setInvitations([]);
    }
  }, [isAuthenticated]);

  return (
    <InvitationContext.Provider
      value={{
        invitations,
        loading,
        error,
        hasUnreadInvitations,
        refreshInvitations,
        acceptInvitation,
        declineInvitation,
        markAllRead
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