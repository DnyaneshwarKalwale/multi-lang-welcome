import React, { useState, useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Users, X, UserPlus, Mail, 
  UserCircle2, UserCog, UserCircle, Check
} from "lucide-react";
import { onboardingApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

export default function TeamInvitePage() {
  const { workspaceName, teamMembers, setTeamMembers, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { user } = useAuth();
  const { toast } = useToast();
  const { current, total } = getStepProgress();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const addTeamMember = () => {
    if (!newMemberEmail.trim()) {
      setEmailError("Please enter an email address");
      return;
    }

    // Split by comma and process each email
    const emails = newMemberEmail.split(',').map(email => email.trim()).filter(email => email);
    
    // Validate each email
    const invalidEmails = emails.filter(email => !validateEmail(email));
    if (invalidEmails.length > 0) {
      setEmailError(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }
    
    // Check for duplicates
    const duplicates = emails.filter(email => 
      teamMembers.some(member => member.email.toLowerCase() === email.toLowerCase())
    );
    
    if (duplicates.length > 0) {
      setEmailError(`Already added: ${duplicates.join(', ')}`);
      return;
    }
    
    // Add all valid emails
    const newMembers = emails.map(email => ({ email, role: "member" }));
    setTeamMembers([...teamMembers, ...newMembers]);
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
    if (!user) return;
    
    setIsSending(true);
    try {
      // Save invitation in the backend
      await onboardingApi.inviteTeamMembers({
        workspaceId: user.id + "-" + workspaceName.toLowerCase().replace(/\s+/g, '-'),
        workspaceName,
        invitedBy: user.id,
        inviterName: `${user.firstName} ${user.lastName}`,
        inviterEmail: user.email,
        members: teamMembers
      });
      
      toast({
        title: "Invitations sent!",
        description: `${teamMembers.length} member${teamMembers.length === 1 ? '' : 's'} will be notified to join your workspace.`,
        variant: "default"
      });
      
      // Continue to next step
      nextStep();
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast({
        title: "Error sending invitations",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
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
              placeholder="colleague@example.com, teammate@company.com"
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
          
          <p className="text-xs text-gray-500 mt-2">
            You can add multiple emails separated by commas
          </p>

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
          >
            Back
          </Button>
          
          {teamMembers.length > 0 ? (
            <Button 
              onClick={sendInvitations}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isSending}
            >
              {isSending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending invites...
                </span>
              ) : (
                <span className="flex items-center">
                  <Mail className="mr-2" size={18} />
                  Send Invitations
                </span>
              )}
            </Button>
          ) : (
            <ContinueButton 
              onClick={nextStep}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Skip for now
            </ContinueButton>
          )}
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
} 