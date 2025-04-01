import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  invitedBy: string;
  invitedByName: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export default function PendingInvitationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
        const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setInvitations(response.data.data);
      } catch (err) {
        console.error('Failed to fetch invitations:', err);
        setError('Failed to load invitations');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Navigate to team dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to accept invitation:', err);
      setError('Failed to accept invitation');
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
    } catch (err) {
      console.error('Failed to decline invitation:', err);
      setError('Failed to decline invitation');
    }
  };
  
  const handleSkipAll = () => {
    // Store in local storage that user has skipped invitations
    localStorage.setItem('skippedInvitations', 'true');
    navigate('/onboarding/welcome');
  };
  
  const handleCreateNewWorkspace = () => {
    navigate('/onboarding/welcome');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4">Loading invitations...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Pending Invitations</h1>
        <p className="text-gray-400 mb-8 text-center">
          You have pending team invitations and suggestions
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {invitations.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p>No pending invitations</p>
            <Button 
              className="mt-4 bg-indigo-600 hover:bg-indigo-700" 
              onClick={handleCreateNewWorkspace}
            >
              Create new workspace
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map(invitation => (
              <div key={invitation.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center text-white font-semibold text-lg mr-3">
                    {invitation.teamName.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded mr-2">new</span>
                      <h3 className="font-medium">{invitation.teamName}</h3>
                    </div>
                    <p className="text-sm text-gray-400">Team Invitation</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleDeclineInvitation(invitation.id)}
                    className="text-sm text-gray-400 hover:text-gray-300"
                  >
                    Decline
                  </button>
                  <Button
                    onClick={() => handleAcceptInvitation(invitation.id)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    size="sm"
                  >
                    Join →
                  </Button>
                </div>
              </div>
            ))}

            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleCreateNewWorkspace}
              >
                <span className="mr-2">+</span> Create new workspace
              </Button>
            </div>

            {invitations.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleSkipAll}
                  className="text-sm text-gray-500 hover:text-gray-400"
                >
                  Skip for now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 