import React, { useState, useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Users, X, UserPlus, Mail, 
  UserCircle2, UserCog, UserCircle,
  Loader2
} from "lucide-react";
import { workspaceApi } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

export default function TeamInvitePage() {
  const { workspaceName, teamMembers, setTeamMembers, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const parseEmails = (emailInput: string): string[] => {
    if (!emailInput) return [];
    
    // Split by comma and clean each email
    return emailInput
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
  };

  const validateEmails = (emails: string[]): { valid: string[], invalid: string[] } => {
    const valid: string[] = [];
    const invalid: string[] = [];
    
    emails.forEach(email => {
      if (validateEmail(email)) {
        valid.push(email);
      } else {
        invalid.push(email);
      }
    });
    
    return { valid, invalid };
  };

  const addTeamMember = async () => {
    if (!newMemberEmail.trim()) {
      setEmailError("Please enter at least one email address");
      return;
    }

    const emails = parseEmails(newMemberEmail);
    const { valid, invalid } = validateEmails(emails);
    
    if (invalid.length > 0) {
      setEmailError(`Invalid email format: ${invalid.join(', ')}`);
      return;
    }

    // Check for duplicates in the current list
    const duplicates = valid.filter(email => 
      teamMembers.some(member => member.email.toLowerCase() === email.toLowerCase())
    );
    
    if (duplicates.length > 0) {
      setEmailError(`These emails are already added: ${duplicates.join(', ')}`);
      return;
    }

    // Add emails to the team members list in the context
    const newMembers = valid.map(email => ({ email, role: "member" as const }));
    setTeamMembers([...teamMembers, ...newMembers]);
    
    // Also send invitations to the backend
    setIsLoading(true);
    try {
      await workspaceApi.sendInvites(valid, "member");
      toast({
        title: "Invitations sent",
        description: `Successfully sent ${valid.length} invitation${valid.length === 1 ? '' : 's'}`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast({
        title: "Error",
        description: "Failed to send invitations. Team members were added locally only.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
    
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
          
          <div className="mb-2">
            <p className="text-sm text-gray-400 mb-2">
              Enter email addresses, separated by commas
            </p>
            <div className="flex">
              <Input 
                value={newMemberEmail}
                onChange={(e) => {
                  setNewMemberEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="colleague@example.com, teammate@example.com"
                className="bg-gray-800 border-gray-700 rounded-r-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTeamMember();
                  }
                }}
                disabled={isLoading}
              />
              <Button 
                onClick={addTeamMember}
                className="rounded-l-none bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2" size={18} />
                )}
                Add
              </Button>
            </div>
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
          >
            Back
          </Button>
          <ContinueButton 
            onClick={nextStep}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Continue
          </ContinueButton>
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
} 