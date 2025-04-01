import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Bell, Check, X, Users, Loader2 } from 'lucide-react';
import { workspaceApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
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

export function NotificationBell() {
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  // Get all invites for the current user
  const fetchInvites = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const response = await workspaceApi.getMyInvites();
      if (response.success && response.data) {
        setInvites(response.data);
      }
    } catch (err) {
      console.error('Error fetching workspace invites:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch invitations when the component mounts or when popover opens
  useEffect(() => {
    if (open) {
      fetchInvites();
    }
  }, [open, user]);
  
  // Initial fetch
  useEffect(() => {
    fetchInvites();
  }, [user]);
  
  const handleInviteResponse = async (inviteId: string, action: 'accept' | 'reject') => {
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
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Bell size={20} />
          {invites.length > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 bg-gray-900 text-white border-gray-800 p-0"
      >
        <div className="p-3 border-b border-gray-800">
          <h3 className="font-medium">Notifications</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : invites.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No notifications
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-800">
            {invites.map((invite) => (
              <div key={invite._id} className="p-3 hover:bg-gray-800/50">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-purple-600/20 rounded-lg">
                    <Users className="text-purple-500" size={16} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Workspace Invitation</h4>
                    <p className="text-xs text-gray-400">
                      You've been invited to join <span className="text-white">{invite.workspaceName}</span> by {invite.sender.firstName}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs rounded"
                        onClick={() => handleInviteResponse(invite._id, 'accept')}
                        disabled={!!processing}
                      >
                        {processing === invite._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 text-gray-400 h-7 text-xs rounded"
                        onClick={() => handleInviteResponse(invite._id, 'reject')}
                        disabled={!!processing}
                      >
                        {processing === invite._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3 mr-1" />
                        )}
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
} 