import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  role: string;
  createdAt: string;
}

export default function TeamInvitationNotification() {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  const fetchInvitations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setInvitations(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
    
    // Poll for new invitations every minute
    const intervalId = setInterval(fetchInvitations, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      const response = await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove this invitation from the list
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      // Show success toast
      toast.success(`You've joined ${response.data.data.teamName}`);
      
      // Close the dropdown
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to accept invitation:', err);
      toast.error('Failed to accept invitation. Please try again.');
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/decline`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove this invitation from the list
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      // Show success toast
      toast.success('Invitation declined');
    } catch (err) {
      console.error('Failed to decline invitation:', err);
      toast.error('Failed to decline invitation. Please try again.');
    }
  };
  
  // Only show the component if there are invitations
  if (loading) {
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
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      className="text-xs text-gray-400 hover:text-gray-300"
                    >
                      Decline
                    </button>
                    <Button
                      onClick={() => handleAcceptInvitation(invitation.id)}
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