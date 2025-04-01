import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  role: string;
  createdAt: string;
}

export default function PendingInvitationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch invitations when component mounts
  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, redirect to login
        navigate('/login');
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInvitations(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
      setError('Failed to load invitations');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Navigate to team dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to accept invitation:', err);
      setError('Failed to accept invitation');
      setLoading(false);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/decline`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove this invitation from the list
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      setLoading(false);
    } catch (err) {
      console.error('Failed to decline invitation:', err);
      setError('Failed to decline invitation');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Store in local storage that user has skipped invitations
    localStorage.setItem('skippedInvitations', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="max-w-md w-full bg-gray-900 rounded-xl shadow-2xl p-8">
        {loading ? (
          <p className="mt-4">Loading invitations...</p>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Pending Invitations</h1>
            
            {invitations.length === 0 ? (
              <div className="text-center">
                <p className="mb-4">You have no pending invitations.</p>
                <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-gray-400">
                  You have been invited to join the following teams:
                </p>
                
                <div className="space-y-4 mb-6">
                  {invitations.map(invitation => (
                    <div 
                      key={invitation.id} 
                      className="p-4 border border-gray-800 rounded-lg bg-gray-800/50"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold mr-3">
                          {invitation.teamName.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium">{invitation.teamName}</h3>
                          <p className="text-xs text-gray-400">Role: {invitation.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => handleDeclineInvitation(invitation.id)}
                          className="text-sm border-gray-700 text-gray-400 hover:bg-gray-800"
                        >
                          Decline
                        </Button>
                        <Button 
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          className="text-sm bg-indigo-600 hover:bg-indigo-700"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button 
                    variant="ghost" 
                    onClick={handleSkip}
                    className="text-gray-400"
                  >
                    Skip for now
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    You can accept these invitations later from your dashboard
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
} 