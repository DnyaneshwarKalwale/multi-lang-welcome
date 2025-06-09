import React, { useState, useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { BackButton } from "@/components/BackButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Users, X, UserPlus, Mail, 
  UserCircle2, UserCog, UserCircle,
  Loader2, ArrowLeft, Twitter,
  AtSign, BadgeCheck, UserMinus
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ScripeIconRounded } from "@/components/ScripeIcon";

export default function TeamInvitePage() {
  const { workspaceName, teamMembers, setTeamMembers, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { user } = useAuth();
  const { current, total } = getStepProgress();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);

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

  // Fetch user's teams on component mount to see if team already exists
  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(
          `${baseApiUrl}/teams`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Find a team with the current workspace name
        const existingTeam = response.data.data.find(
          (team: any) => team.name === workspaceName
        );

        if (existingTeam) {
          setTeamId(existingTeam._id);
        }
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchUserTeams();
  }, [workspaceName]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const addTeamMember = () => {
    if (!newMemberEmail.trim()) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!validateEmail(newMemberEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (teamMembers.some(member => member.email === newMemberEmail)) {
      setEmailError("This email has already been added");
      return;
    }

    setTeamMembers([...teamMembers, { email: newMemberEmail, role: "member" }]);
    setNewMemberEmail("");
    setEmailError("");
  };

  const removeTeamMember = (email: string) => {
    setTeamMembers(teamMembers.filter(member => member.email !== email));
  };

  const toggleRole = (email: string) => {
    setTeamMembers(
      teamMembers.map(member => 
        member.email === email 
          ? { ...member, role: member.role === "admin" ? "member" : "admin" } 
          : member
      )
    );
  };

  const sendInvitations = async () => {
    if (teamMembers.length === 0) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication error. Please login again.");
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // First, create the team if it doesn't exist
      let currentTeamId = teamId;
      if (!currentTeamId) {
        const createTeamResponse = await axios.post(
          `${baseApiUrl}/teams`,
          {
            name: workspaceName,
            description: `Team workspace for ${workspaceName}`
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        currentTeamId = createTeamResponse.data.data._id;
        setTeamId(currentTeamId);
      }
      
      // Then, send invitations to team members
      const formattedInvitations = teamMembers.map(member => ({
        email: member.email,
        role: member.role === "admin" ? "admin" : "editor"
      }));
      
      const inviteResponse = await axios.post(
        `${baseApiUrl}/teams/${currentTeamId}/invitations`,
        { invitations: formattedInvitations },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Get results of invitations
      const results = inviteResponse.data.data.invitationResults;
      const successfulInvites = results.filter((result: any) => result.success);
      
      // Store successful invites
      const invitedEmails = successfulInvites.map((result: any) => result.email);
      setPendingInvites(invitedEmails);

      if (successfulInvites.length > 0) {
        toast.success(`Invitations sent to ${successfulInvites.length} team members`);
      } else {
        toast.info("No new invitations were sent");
      }
      
      nextStep();
    } catch (error) {
      console.error("Failed to send invitations:", error);
      toast.error("Failed to send invitations. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background text-foreground relative overflow-hidden">
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
          <UserPlus size={60} className="text-blue-500" />
        </motion.div>
        
        <motion.div 
          className="absolute opacity-10 pointer-events-none"
          animate={{ 
            y: [0, -10, 0],
            x: [0, -10, 0],
            rotate: [0, 3, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 7, 
            ease: "easeInOut",
            delay: 0.5 
          }}
          style={{ top: '30%', left: '15%' }}
        >
          <AtSign size={50} className="text-blue-500" />
        </motion.div>
      </div>
      
      {/* Back button */}
      <motion.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          rounded="full"
          className="flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400"
          onClick={prevStep}
        >
          <ArrowLeft size={18} />
        </Button>
      </motion.div>
      
      <motion.div 
        className="max-w-2xl w-full"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="mb-6 sm:mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <ScripeIconRounded className="w-14 h-14 sm:w-20 sm:h-20 text-blue-500" />
            <Twitter className="absolute bottom-0 right-0 text-blue-500 bg-white dark:bg-gray-900 p-1 rounded-full w-6 h-6 sm:w-7 sm:h-7 shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          Invite team to {workspaceName}
        </motion.h1>
        
        <motion.p 
          className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 text-center max-w-2xl mx-auto"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          Build your tweet team! Collaborate on content creation and share analytics.
        </motion.p>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-md"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-lg font-medium mb-4 text-gray-800 dark:text-gray-200 flex items-center">
            <Mail className="mr-2 text-blue-500" size={20} />
            Invite team members
          </label>
          
          <div className="flex mb-2">
            <Input 
              value={newMemberEmail}
              onChange={(e) => {
                setNewMemberEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="colleague@example.com"
              className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 rounded-l-full h-12 focus:border-blue-500 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTeamMember();
                }
              }}
            />
            <Button 
              onClick={addTeamMember}
              variant="twitter"
              className="rounded-l-none rounded-r-full h-12"
            >
              <UserPlus className="mr-2" size={18} />
              Add
            </Button>
          </div>
          
          {emailError && (
            <p className="text-red-500 text-sm mt-1 mb-4">{emailError}</p>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <Users size={16} className="mr-2 text-blue-500" />
              Team members ({teamMembers.length})
            </label>
            
            {teamMembers.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <UserCircle className="mx-auto mb-2 text-gray-400 dark:text-gray-500" size={32} />
                <p className="text-gray-500 dark:text-gray-400">No team members added yet</p>
              </div>
            ) : (
              <motion.div 
                className="space-y-2 max-h-60 overflow-y-auto"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {teamMembers.map((member) => (
                  <motion.div 
                    key={member.email}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-gray-200 dark:border-gray-700"
                    variants={itemVariants}
                  >
                    <div className="flex items-center">
                      {member.role === "admin" ? (
                        <BadgeCheck className="mr-3 text-blue-500" size={20} />
                      ) : (
                        <UserCircle2 className="mr-3 text-gray-500" size={20} />
                      )}
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {member.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        rounded="full"
                        onClick={() => toggleRole(member.email)}
                        className={`text-xs border-gray-200 dark:border-gray-700 ${
                          member.role === "admin" 
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        {member.role === "admin" ? "Admin" : "Member"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        rounded="full"
                        onClick={() => removeTeamMember(member.email)}
                        className="text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <UserMinus size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>You can invite more team members after setup</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-8"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <Button 
            variant="twitter"
            rounded="full"
            className="w-64 py-3 text-white font-bold"
            onClick={sendInvitations}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending invites...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <ProgressDots total={total} current={current} color="cyan" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
} 