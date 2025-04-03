import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function InvitationTokenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [invitationDetails, setInvitationDetails] = useState<{
    teamName: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const processInvitation = async () => {
      try {
        // Extract token from URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError("Invalid invitation link. No token provided.");
          setLoading(false);
          return;
        }
        
        // Check if user is authenticated
        if (!isAuthenticated) {
          // Store token in localStorage to process after login
          localStorage.setItem('pendingInvitationToken', token);
          
          // Redirect to login
          toast({
            title: "Authentication Required",
            description: "Please login to accept this invitation",
            duration: 5000
          });
          
          navigate('/', { state: { returnUrl: location.pathname + location.search } });
          return;
        }
        
        // Verify and process token
        const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
        
        try {
          const response = await axios.post(
            `${baseApiUrl}/teams/invitations/verify-token`, 
            { token },
            { 
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              timeout: 5000,
            }
          );
          
          // If successful, show team details
          setInvitationDetails({
            teamName: response.data.data.teamName,
            role: response.data.data.role,
          });
          
          setSuccess(true);
          setLoading(false);
        } catch (apiError: any) {
          console.error("Error processing invitation:", apiError);
          
          if (apiError.response?.status === 404) {
            setError("Invalid or expired invitation link.");
          } else if (apiError.response?.status === 401) {
            setError("You need to be logged in to accept this invitation.");
          } else if (apiError.response?.data?.message) {
            setError(apiError.response.data.message);
          } else {
            setError("An error occurred while processing your invitation. Please try again later.");
          }
          
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error processing invitation:", err);
        setError("An unexpected error occurred. Please try again later.");
        setLoading(false);
      }
    };
    
    processInvitation();
  }, [location, isAuthenticated, navigate, toast]);
  
  const handleAcceptInvitation = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (!token) {
        setError("Invalid invitation link. No token provided.");
        setLoading(false);
        return;
      }
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      
      try {
        await axios.post(
          `${baseApiUrl}/teams/invitations/accept-by-token`, 
          { token },
          { 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            timeout: 5000,
          }
        );
        
        // Show success message
        toast({
          title: "Invitation Accepted",
          description: `You've successfully joined ${invitationDetails?.teamName}`,
          duration: 5000
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (apiError: any) {
        console.error("Error accepting invitation:", apiError);
        
        if (apiError.response?.data?.message) {
          setError(apiError.response.data.message);
        } else {
          setError("An error occurred while accepting the invitation. Please try again later.");
        }
        
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };
  
  const handleDeclineInvitation = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (!token) {
        setError("Invalid invitation link. No token provided.");
        setLoading(false);
        return;
      }
      
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      
      try {
        await axios.post(
          `${baseApiUrl}/teams/invitations/decline-by-token`, 
          { token },
          { 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            timeout: 5000,
          }
        );
        
        // Show success message
        toast({
          title: "Invitation Declined",
          description: "You've declined the team invitation",
          duration: 5000
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (apiError: any) {
        console.error("Error declining invitation:", apiError);
        
        if (apiError.response?.data?.message) {
          setError(apiError.response.data.message);
        } else {
          setError("An error occurred while declining the invitation. Please try again later.");
        }
        
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Error declining invitation:", err);
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div 
        className="max-w-md w-full bg-card rounded-xl shadow-lg p-8 border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Processing invitation...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Invitation Error</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button 
              variant="default"
              className="px-6"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        ) : success && invitationDetails ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Team Invitation</h1>
            <p className="text-muted-foreground mb-6">
              You've been invited to join <span className="font-semibold">{invitationDetails.teamName}</span> as a {invitationDetails.role}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={handleDeclineInvitation}
              >
                Decline
              </Button>
              <Button 
                variant="default"
                onClick={handleAcceptInvitation}
              >
                Accept Invitation
              </Button>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
} 