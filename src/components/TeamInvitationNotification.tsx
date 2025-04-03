import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvitations } from "@/contexts/InvitationContext";

export default function TeamInvitationNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const { invitations, loading, acceptInvitation, declineInvitation } = useInvitations();
  
  // Don't render if loading or no invitations
  if (loading || invitations.length === 0) {
    return null;
  }
  
  return (
    <div className="relative">
      <button 
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800 relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={invitations.length > 0 ? `${invitations.length} team invitations` : "No team invitations"}
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {invitations.length > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
            {invitations.length}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-gray-900 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-800">
            <h3 className="font-medium">Team Invitations</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {invitations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No pending invitations
              </div>
            ) : (
              invitations.map(invitation => (
                <div key={invitation.id} className="p-3 border-b border-gray-800 hover:bg-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-semibold mr-2">
                      {invitation.teamName.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{invitation.teamName}</p>
                      <p className="text-xs text-gray-400">Role: {invitation.role}</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        declineInvitation(invitation.id);
                        setIsOpen(false);
                      }}
                      className="text-xs text-gray-400 hover:text-gray-300"
                    >
                      Decline
                    </button>
                    <Button
                      onClick={() => {
                        acceptInvitation(invitation.id);
                        setIsOpen(false);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-xs py-1 h-auto"
                      size="sm"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 