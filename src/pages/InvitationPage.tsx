import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DekcionIcon } from "@/components/ScripeIcon";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const InvitationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  
  const [invitationDetails, setInvitationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    verifyToken();
  }, [token]);
  
  const verifyToken = async () => {
    if (!token) {
      setError("No invitation token found");
      setLoading(false);
      return;
    }
    
    try {
      const baseApiUrl = import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com/api";
      const response = await axios.post(`${baseApiUrl}/teams/invitations/verify-token`, { token });
      setInvitationDetails(response.data.data);
    } catch (error: any) {
      console.error("Error verifying invitation token:", error);
      setError(error.response?.data?.message || "Invalid or expired invitation token");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAccept = async () => {
    if (!token) return;
    
    try {
      setAccepting(true);
      const baseApiUrl = import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com/api";
      
      if (isAuthenticated) {
        // If user is logged in, use the authenticated endpoint
        const storedToken = localStorage.getItem("token");
        await axios.post(
          `${baseApiUrl}/teams/invitations/accept-by-token`, 
          { token, email: invitationDetails.email },
          { headers: { Authorization: `Bearer ${storedToken}` }}
        );
      } else {
        // If user is not logged in, use the public endpoint
        await axios.post(`${baseApiUrl}/teams/invitations/accept-by-token`, {
          token,
          email: invitationDetails.email
        });
      }
      
      toast.success(`You've successfully joined ${invitationDetails.teamName}`);
      
      // After accepting, navigate to the teams page if authenticated or to login if not
      if (isAuthenticated) {
        navigate("/teams");
      } else {
        navigate("/?redirect=teams");
      }
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      toast.error(error.response?.data?.message || "Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };
  
  const handleDecline = async () => {
    if (!token) return;
    
    try {
      setDeclining(true);
      const baseApiUrl = import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com/api";
      
      if (isAuthenticated) {
        // If user is logged in, use the authenticated endpoint
        const storedToken = localStorage.getItem("token");
        await axios.post(
          `${baseApiUrl}/teams/invitations/decline-by-token`, 
          { token, email: invitationDetails.email },
          { headers: { Authorization: `Bearer ${storedToken}` }}
        );
      } else {
        // If user is not logged in, use the public endpoint
        await axios.post(`${baseApiUrl}/teams/invitations/decline-by-token`, {
          token,
          email: invitationDetails.email
        });
      }
      
      toast.success("Invitation declined");
      
      // After declining, navigate to home page
      navigate("/");
    } catch (error: any) {
      console.error("Error declining invitation:", error);
      toast.error(error.response?.data?.message || "Failed to decline invitation");
    } finally {
      setDeclining(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-500" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying invitation...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <Card className="w-[90%] max-w-md shadow-lg border-red-200 dark:border-red-900/40">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <X className="h-12 w-12 text-red-500 mx-auto" />
            </div>
            <CardTitle className="text-xl text-red-600 dark:text-red-400">Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/")} variant="outline">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-primary-200 dark:border-primary-900/30">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <DekcionIcon className="h-16 w-16 mx-auto" />
              </div>
              <CardTitle className="text-2xl">Team Invitation</CardTitle>
              <CardDescription>
                You've been invited to join a team on Dekcion
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{invitationDetails?.teamName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-primary-600 dark:text-primary-400">Role:</span> {invitationDetails?.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-primary-600 dark:text-primary-400">Email:</span> {invitationDetails?.email}
                </p>
              </div>
              
              {!isAuthenticated && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    You need to sign in first to accept this invitation.
                  </p>
                  <Button 
                    className="mt-2 w-full bg-primary-600 hover:bg-primary-700"
                    onClick={() => navigate(`/?redirect=invitations&token=${token}`)}
                  >
                    Sign in to continue
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <div className="w-full flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={declining || accepting}
                  onClick={handleDecline}
                >
                  {declining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Declining...
                    </>
                  ) : (
                    <>Decline</>
                  )}
                </Button>
                
                <Button
                  className="flex-1 bg-primary-600 hover:bg-primary-700"
                  disabled={!isAuthenticated || declining || accepting}
                  onClick={handleAccept}
                >
                  {accepting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default InvitationPage; 