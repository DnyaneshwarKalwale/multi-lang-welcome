import React, { useState, useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Users, X, UserPlus, Mail, 
  UserCircle2, UserCog, UserCircle,
  Loader2
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function TeamInvitePage() {
  const { workspaceName, teamMembers, setTeamMembers, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { user } = useAuth();
  const { current, total } = getStepProgress();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);

  // Fetch user's teams on component mount to see if team already exists
  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
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

      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">Invite members to {workspaceName}</h1>
        <p className="text-lg text-gray-400 mb-12 text-center">
          Team members can collaborate on content creation and share analytics.
        </p>
        
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <label className="block text-lg font-medium mb-4">
            <Mail className="inline-block mr-2" />
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
              className="bg-gray-800 border-gray-700 rounded-r-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTeamMember();
                }
              }}
            />
            <Button 
              onClick={addTeamMember}
              className="rounded-l-none bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="mr-2" size={18} />
              Add
            </Button>
          </div>
          
          {emailError && (
            <p className="text-red-500 text-sm mt-1 mb-4">{emailError}</p>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-400 mb-4">
              Team members ({teamMembers.length})
            </label>
            
            {teamMembers.length === 0 ? (
              <div className="text-center py-6 bg-gray-800/50 rounded-lg border border-gray-800">
                <UserCircle className="mx-auto mb-2 text-gray-500" size={32} />
                <p className="text-gray-500">No team members added yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div 
                    key={member.email}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center">
                      {member.role === "admin" ? (
                        <UserCog className="mr-3 text-purple-400" size={20} />
                      ) : (
                        <UserCircle2 className="mr-3 text-blue-400" size={20} />
                      )}
                      <span className="text-sm">{member.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRole(member.email)}
                        className="text-xs"
                      >
                        {member.role === "admin" ? "Admin" : "Member"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTeamMember(member.email)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>You can invite more members after setup is complete</p>
          </div>
        </div>
        
        <div className="flex justify-between mb-12">
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="border-gray-700 text-gray-400"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <ContinueButton 
            onClick={sendInvitations}
            className="bg-purple-600 hover:bg-purple-700"
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
          </ContinueButton>
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
} 