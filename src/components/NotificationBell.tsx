import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvitations } from '@/contexts/InvitationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export function NotificationBell() {
  const { invitations, loading, hasUnreadInvitations, markAllRead, acceptInvitation, declineInvitation } = useInvitations();
  const [open, setOpen] = useState(false);
  
  // Filter to only show pending invitations
  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      markAllRead();
    }
  };

  const handleAccept = async (invitationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await acceptInvitation(invitationId);
  };

  const handleDecline = async (invitationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await declineInvitation(invitationId);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {hasUnreadInvitations && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : pendingInvitations.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            No new notifications
          </div>
        ) : (
          <DropdownMenuGroup>
            {pendingInvitations.map((invitation) => (
              <DropdownMenuItem key={invitation.id} className="py-2 px-3">
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{invitation.workspaceName}</h4>
                      <p className="text-muted-foreground text-xs">
                        Invited by {invitation.inviterName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(invitation.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">
                      {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 px-2 text-xs"
                      onClick={(e) => handleDecline(invitation.id, e)}
                    >
                      Decline
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={(e) => handleAccept(invitation.id, e)}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 