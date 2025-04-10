
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const TeamInvitationNotification = () => {
  const [invitations, setInvitations] = React.useState([
    {
      id: 1,
      senderName: 'Jennifer Miller',
      workspaceName: 'Content Strategy Team',
      timestamp: 'Just now',
    },
  ]);

  const handleAccept = (id: number) => {
    setInvitations(invitations.filter(invitation => invitation.id !== id));
    toast.success('Invitation accepted!');
  };

  const handleDecline = (id: number) => {
    setInvitations(invitations.filter(invitation => invitation.id !== id));
    toast.info('Invitation declined');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {invitations.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
              {invitations.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Team Invitations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {invitations.length > 0 ? (
          invitations.map((invitation) => (
            <div key={invitation.id} className="p-3">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-linkedin-blue/10 flex items-center justify-center text-linkedin-blue">
                  {invitation.senderName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    <span className="font-semibold">{invitation.senderName}</span> invited you to join{' '}
                    <span className="text-linkedin-blue">{invitation.workspaceName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{invitation.timestamp}</p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      className="h-8 bg-linkedin-blue hover:bg-linkedin-darkBlue text-white"
                      onClick={() => handleAccept(invitation.id)}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={() => handleDecline(invitation.id)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p className="mb-1">No new invitations</p>
            <p className="text-xs">Team invitations will appear here</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamInvitationNotification;
