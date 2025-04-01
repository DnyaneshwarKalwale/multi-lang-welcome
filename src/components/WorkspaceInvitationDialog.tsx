import React, { useState, useEffect } from 'react';
import { useInvitations } from '@/contexts/InvitationContext';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Check, X, User, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

export function WorkspaceInvitationDialog() {
  const { invitations, loading, acceptInvitation, declineInvitation, markAllRead } = useInvitations();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // Filter to only show pending invitations
  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  
  // Show dialog after login if there are pending invitations
  useEffect(() => {
    if (pendingInvitations.length > 0) {
      setOpen(true);
    }
  }, [pendingInvitations.length]);
  
  const handleClose = () => {
    setOpen(false);
    markAllRead();
  };
  
  const handleAccept = async (invitationId: string) => {
    await acceptInvitation(invitationId);
    if (pendingInvitations.length <= 1) {
      setOpen(false);
    }
  };
  
  const handleDecline = async (invitationId: string) => {
    await declineInvitation(invitationId);
    if (pendingInvitations.length <= 1) {
      setOpen(false);
    }
  };
  
  const handleCreateNewWorkspace = () => {
    setOpen(false);
    markAllRead();
    navigate('/onboarding/team-selection');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Users size={24} className="text-purple-400" />
            Workspace Invitations
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You've been invited to join these workspaces
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : pendingInvitations.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto mb-2 text-gray-500" size={32} />
            <p className="text-gray-400">No pending invitations</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto py-4">
            {pendingInvitations.map((invitation) => (
              <div key={invitation.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-lg">{invitation.workspaceName}</h3>
                    <p className="text-gray-400 text-sm">
                      Invited by {invitation.inviterName} ({invitation.inviterEmail})
                    </p>
                  </div>
                  <div className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded">
                    {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Invited {format(new Date(invitation.createdAt), 'MMM d, yyyy')}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleAccept(invitation.id)}
                  >
                    <Check size={16} className="mr-1" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-700"
                    onClick={() => handleDecline(invitation.id)}
                  >
                    <X size={16} className="mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Separator className="bg-gray-800" />
        
        <DialogFooter className="flex sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            Skip for now
          </Button>
          
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCreateNewWorkspace}
          >
            <User size={16} className="mr-2" />
            Create my own workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 