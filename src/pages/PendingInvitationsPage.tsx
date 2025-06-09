import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Twitter, UserCheck, UserX, 
  SkipForward, Loader2, Users, 
  Clock, UserPlus, Building
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { tokenManager } from "@/services/api";

interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  role: string;
  createdAt: string;
}

export default function PendingInvitationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processingToken, setProcessingToken] = useState(false);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Process URL token if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    
    if (token) {
      processInvitationToken(token);
    }
  }, [location]);

  // Process the invitation token from the URL
  const processInvitationToken = async (token: string) => {
    try {
      setProcessingToken(true);
      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // First verify the invitation token
      const verifyResponse = await axios.post(`${baseApiUrl}/teams/invitations/verify-token`, { token });
      const invitationData = verifyResponse.data.data;
      
      // Get the user token
      const userToken = tokenManager.getToken(localStorage.getItem('auth-method') || undefined);
      
      if (!userToken) {
        // If user is not logged in, redirect to login with returnUrl
        // Store the invitation token in localStorage to process after login
        localStorage.setItem('pendingInvitationToken', token);
        navigate('/login', { state: { returnTo: `/invitations?token=${token}` } });
        return;
      }

      // If user is authenticated, check their email
      try {
        const userResponse = await axios.get(`${baseApiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        
        const userEmail = userResponse.data.data.email;
        
        // If the invitation matches the user's email, add it to the invitations list
        if (userEmail.toLowerCase() === invitationData.email.toLowerCase()) {
          // Create a new invitation object
          const newInvitation: TeamInvitation = {
            id: token, // Using token as ID for now
            teamId: invitationData.teamId,
            teamName: invitationData.teamName,
            role: invitationData.role,
            createdAt: new Date().toISOString() // We don't have created date from API
          };
          
          // Add to invitations if not already in the list
          setInvitations(prev => {
            const exists = prev.some(inv => inv.teamId === invitationData.teamId);
            if (!exists) {
              return [...prev, newInvitation];
            }
            return prev;
          });
          
          setProcessingToken(false);
          setLoading(false);
        } else {
          setError(`This invitation was sent to ${invitationData.email}, but you're logged in with a different email.`);
          setProcessingToken(false);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to get user information:', err);
        setError('Failed to verify your account. Please try logging in again.');
        setProcessingToken(false);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to process invitation token:', err);
      setError('Invalid or expired invitation link.');
      setProcessingToken(false);
      setLoading(false);
    }
  };

  // Fetch invitations when component mounts
  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const token = tokenManager.getToken(localStorage.getItem('auth-method') || undefined);
      if (!token) {
        // If no token, redirect to login
        navigate('/login');
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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
      const token = tokenManager.getToken(localStorage.getItem('auth-method') || undefined);
      if (!token) {
        navigate('/login');
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Check if this is a token-based invitation (from URL) or a regular invitation
      if (invitationId.length > 30) { // Token is typically longer than regular IDs
        // Get the user email
        const userResponse = await axios.get(`${baseApiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userEmail = userResponse.data.data.email;
        
        // Accept by token
        await axios.post(`${baseApiUrl}/teams/invitations/accept-by-token`, { 
          token: invitationId,
          email: userEmail 
        });
      } else {
        // Regular invitation
        await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/accept`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

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
      const token = tokenManager.getToken(localStorage.getItem('auth-method') || undefined);
      if (!token) {
        navigate('/login');
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Check if this is a token-based invitation (from URL) or a regular invitation
      if (invitationId.length > 30) { // Token is typically longer than regular IDs
        // Get the user email
        const userResponse = await axios.get(`${baseApiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userEmail = userResponse.data.data.email;
        
        // Decline by token
        await axios.post(`${baseApiUrl}/teams/invitations/decline-by-token`, { 
          token: invitationId,
          email: userEmail 
        });
      } else {
        // Regular invitation
        await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/decline`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 relative overflow-hidden">
      {/* Twitter-inspired background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-blue-100 dark:bg-blue-900/30 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-blue-200 dark:bg-blue-800/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
      </div>
      
      {/* Social media floating elements for decoration - hidden on smallest screens */}
      <div className="hidden sm:block">
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8, 
            ease: "easeInOut" 
          }}
          style={{ top: '15%', right: '10%' }}
        >
          <Twitter size={80} className="text-blue-500" />
        </motion.div>
        
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10, 
            ease: "easeInOut",
            delay: 1 
          }}
          style={{ bottom: '20%', left: '8%' }}
        >
          <Users size={60} className="text-blue-500" />
        </motion.div>
      </div>
      
      <motion.div 
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        {loading || processingToken ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              {processingToken ? "Processing invitation link..." : "Loading invitations..."}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-6 border border-red-100 dark:border-red-800/30">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
            <Button 
              variant="twitter"
              rounded="full"
              onClick={() => navigate('/dashboard')}
              className="px-6"
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full mr-3">
                  <UserPlus size={22} />
                </div>
                <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-900 p-0.5 rounded-full">
                  <Twitter className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Twitter Invitations</h1>
            </div>
            
            {invitations.length === 0 ? (
              <div className="text-center py-8">
                <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Building className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-1">No pending invitations</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">You're all caught up!</p>
                </div>
                <Button 
                  variant="twitter"
                  rounded="full"
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-2"
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <>
                <p className="mb-6 text-gray-600 dark:text-gray-300 text-center">
                  You've been invited to join these Twitter teams:
                </p>
                
                <motion.div 
                  className="space-y-4 mb-8"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {invitations.map(invitation => (
                    <motion.div 
                      key={invitation.id} 
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      variants={itemVariants}
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                          {invitation.teamName.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{invitation.teamName}</h3>
                          <div className="flex items-center text-xs text-gray-500">
                            <div className="flex items-center mr-3">
                              <UserCheck size={12} className="mr-1 text-blue-500" />
                              <span className="capitalize">{invitation.role}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={12} className="mr-1 text-blue-500" />
                              <span>{formatDate(invitation.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          rounded="full"
                          onClick={() => handleDeclineInvitation(invitation.id)}
                          className="text-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800/30"
                        >
                          <UserX size={14} className="mr-1" />
                          Decline
                        </Button>
                        <Button 
                          variant="twitter"
                          size="sm"
                          rounded="full"
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          className="text-sm"
                        >
                          <UserCheck size={14} className="mr-1" />
                          Accept
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <div className="text-center mt-8 py-3 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="ghost" 
                    rounded="full"
                    onClick={handleSkip}
                    className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <SkipForward size={16} className="mr-1.5" />
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
      </motion.div>
    </div>
  );
} 