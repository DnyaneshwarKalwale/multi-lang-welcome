import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { workspaceApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Check, X, AlertTriangle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface WorkspaceInvite {
  _id: string;
  workspaceName: string;
  sender: {
    firstName: string;
    lastName: string;
    email: string;
  };
  role: 'admin' | 'member';
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export function WorkspaceInvitations() {
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch invitations when the component mounts
  useEffect(() => {
    async function fetchInvites() {
      // Don't fetch if user is not authenticated
      if (!user?.email) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const response = await workspaceApi.getMyInvites();
        if (response.success && response.data) {
          setInvites(response.data);
          // Auto-open the dialog if there are invites
          if (response.data.length > 0) {
            setOpen(true);
          }
        }
      } catch (err) {
        console.error('Error fetching workspace invites:', err);
        // Only show error if it's not a 404 (which is expected when no invites exist)
        if (err instanceof Error && !err.message.includes('404')) {
          setError('Failed to load workspace invitations');
          toast({
            title: 'Error',
            description: 'Failed to load workspace invitations. Please try again later.',
            variant: 'destructive',
          });
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchInvites();
  }, [user]);

  const handleInviteResponse = async (inviteId: string, action: 'accept' | 'reject') => {
    if (!user?.email) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to respond to invitations.',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(inviteId);
    try {
      await workspaceApi.respondToInvite(inviteId, action);
      
      // Update the local state to remove the processed invite
      setInvites(invites.filter(invite => invite._id !== inviteId));
      
      toast({
        title: action === 'accept' ? 'Invitation accepted' : 'Invitation declined',
        description: action === 'accept' 
          ? 'You have successfully joined the workspace.' 
          : 'You have declined the workspace invitation.',
        variant: action === 'accept' ? 'default' : 'destructive',
      });
      
      // If accepting, refresh the user to get updated workspace info
      if (action === 'accept') {
        await refreshUser();
      }
      
      // Close the dialog if no more invites
      if (invites.length <= 1) {
        setOpen(false);
      }
      
    } catch (err) {
      console.error(`Error ${action}ing invitation:`, err);
      toast({
        title: 'Error',
        description: `Failed to ${action} the invitation. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };
  
  // Handle "Decide Later" - just close the dialog
  const handleDefer = () => {
    setOpen(false);
    toast({
      title: 'Invitations saved',
      description: 'You can find your workspace invitations in notifications.',
      variant: 'default',
    });
  };
  
  // Handle "Create New Workspace" - navigate to onboarding
  const handleCreateWorkspace = () => {
    setOpen(false);
    navigate('/onboarding/team-selection');
  };

  // Don't render anything if user is not authenticated
  if (!user?.email) return null;
  
  // Don't render if there's an error or no invites
  if (error || invites.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl">Workspace Invitations</DialogTitle>
          <DialogDescription className="text-gray-400">
            You have been invited to join the following workspace(s). Accept to join or decline to remove.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
            </div>
          ) : invites.map((invite) => (
            <div key={invite._id} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Users className="text-purple-500" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{invite.workspaceName}</h3>
                  <p className="text-sm text-gray-400">
                    Invitation from {invite.sender.firstName} {invite.sender.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Role: {invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white h-8 px-2"
                    onClick={() => handleInviteResponse(invite._id, 'accept')}
                    disabled={!!processing}
                  >
                    {processing === invite._id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    <span className="ml-1">Accept</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-400 h-8 px-2"
                    onClick={() => handleInviteResponse(invite._id, 'reject')}
                    disabled={!!processing}
                  >
                    {processing === invite._id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    <span className="ml-1">Decline</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-400"
            onClick={handleDefer}
          >
            Decide Later
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleCreateWorkspace}
          >
            Create New Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 