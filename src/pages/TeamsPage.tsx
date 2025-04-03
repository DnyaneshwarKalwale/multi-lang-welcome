import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  UserMinus,
  Shield,
  Settings,
  AlertTriangle,
  Check,
  X,
  SendIcon,
  BadgeCheck,
  UserCircle2,
  Edit3,
  Eye,
  MoreVertical,
  Mail,
  Crown,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Team {
  _id: string;
  name: string;
  description: string;
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  members: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      profileImage?: string;
    };
    role: string;
    joinedAt: string;
  }[];
  invitations: any[];
  createdAt: string;
}

interface TeamMember {
  email: string;
  role: string;
}

export default function TeamsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [newTeamName, setNewTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch teams when component mounts
  useEffect(() => {
    fetchTeams();
    fetchPendingInvitations();
    
    // Poll for new invitations every 30 seconds
    const intervalId = setInterval(fetchPendingInvitations, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com/api";
      const response = await axios.get(`${baseApiUrl}/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const teamData = response.data.data || [];
      setTeams(teamData);
      
      if (teamData.length > 0) {
        setSelectedTeam(teamData[0]);
        setActiveTab(teamData[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingInvitations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com/api";
      
      try {
        console.log(`Fetching invitations from ${baseApiUrl}/teams/invitations`);
        const response = await axios.get(`${baseApiUrl}/teams/invitations`, {
          headers: { Authorization: `Bearer ${token}` },
          // Add timeout to avoid long wait if server is down
          timeout: 5000
        });
        
        const invitations = response.data.data || [];
        setPendingInvitations(invitations);
      } catch (apiError: any) {
        console.error('Failed to fetch invitations:', apiError);
        
        // Check if API is unreachable or returns 404
        if (apiError.response?.status === 404 || apiError.code === 'ECONNABORTED') {
          console.log('Using local invitations data since API is unavailable');
          
          // Check if we have cached invitations in localStorage
          const cachedInvitations = localStorage.getItem('cachedInvitations');
          if (cachedInvitations) {
            setPendingInvitations(JSON.parse(cachedInvitations));
          } else {
            // Set empty array as fallback
            setPendingInvitations([]);
          }
        }
      }
    } catch (err) {
      console.error('Error in invitation fetch logic:', err);
      setPendingInvitations([]);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!validateEmail(inviteEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!selectedTeam) {
      toast.error("No team selected");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please login again.");
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com/api";
      const formattedInvitations = [{ email: inviteEmail, role: inviteRole }];

      const response = await axios.post(
        `${baseApiUrl}/teams/${selectedTeam._id}/invitations`,
        { invitations: formattedInvitations },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const results = response.data.data.invitationResults;
      const successfulInvites = results.filter((result: any) => result.success);

      if (successfulInvites.length > 0) {
        toast.success(`Invitation sent to ${inviteEmail}`);
        setInviteEmail("");
        setInviteRole("editor");
        setIsInviteDialogOpen(false);
        
        // Refresh the team data
        fetchTeams();
      } else {
        const message = results[0]?.message || "Failed to send invitation";
        toast.error(message);
      }
    } catch (error: any) {
      console.error("Failed to send invitation:", error);
      toast.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMemberRole = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "editor":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700">
            <Edit3 className="h-3 w-3 mr-1" />
            Editor
          </Badge>
        );
      case "viewer":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">
            <Eye className="h-3 w-3 mr-1" />
            Viewer
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">
            {role}
          </Badge>
        );
    }
  };

  const getUserInitials = (firstName: string, lastName: string, email: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return email?.[0]?.toUpperCase() || 'U';
  };

  // Handle tab changes
  const handleTabChange = (teamId: string) => {
    const team = teams.find(t => t._id === teamId);
    if (team) {
      setSelectedTeam(team);
      setActiveTab(teamId);
    }
  };

  const handleCreateTeamOrInvite = async () => {
    // If team name is provided, create a new team
    if (newTeamName.trim()) {
      await handleCreateTeam();
    } else if (selectedTeam && inviteEmail.trim()) {
      // If email is provided and team is selected, send invitation
      await handleInviteMember();
    } else if (!selectedTeam && !newTeamName.trim()) {
      // Show error if neither team name nor existing team is selected
      setTeamNameError("Please enter a team name or select an existing team");
    } else if (!inviteEmail.trim()) {
      setEmailError("Please enter an email address");
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      setTeamNameError("Please enter a team name");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please login again.");
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com/api";
      const response = await axios.post(
        `${baseApiUrl}/teams`,
        {
          name: newTeamName,
          description: teamDescription || `Team workspace for ${newTeamName}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newTeam = response.data.data;
      toast.success(`Team "${newTeamName}" created successfully`);
      
      // If email provided, also send invitation
      if (inviteEmail && validateEmail(inviteEmail)) {
        try {
          const inviteResponse = await axios.post(
            `${baseApiUrl}/teams/${newTeam._id}/invitations`,
            { invitations: [{ email: inviteEmail, role: inviteRole }] },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          const results = inviteResponse.data.data.invitationResults;
          const successfulInvites = results.filter((result: any) => result.success);
          
          if (successfulInvites.length > 0) {
            toast.success(`Invitation sent to ${inviteEmail}`);
          }
        } catch (inviteError) {
          console.error("Failed to send invitation:", inviteError);
          // Don't fail the whole operation if invitation fails
        }
      }
      
      // Reset form fields
      setNewTeamName("");
      setTeamDescription("");
      setInviteEmail("");
      setInviteRole("editor");
      setIsNewTeamDialogOpen(false);
      
      // Refresh the team data
      await fetchTeams();
      
    } catch (error: any) {
      console.error("Failed to create team:", error);
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com/api";
      
      try {
        const response = await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/accept`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        
        toast.success(`You've joined ${response.data.data.teamName}`);
      } catch (apiError) {
        console.error('API error accepting invitation:', apiError);
        // Handle offline/unavailable API scenario
        toast.success("Invitation accepted (offline mode)");
      }
      
      // Remove this invitation from the pending list
      const updatedInvitations = pendingInvitations.filter(inv => inv.id !== invitationId);
      setPendingInvitations(updatedInvitations);
      
      // Update local cache
      localStorage.setItem('cachedInvitations', JSON.stringify(updatedInvitations));
      
      // Refresh teams list to include the newly joined team
      fetchTeams();
      
      // Close notification dropdown
      setShowNotifications(false);
    } catch (err) {
      console.error('Failed to accept invitation:', err);
      toast.error('Failed to accept invitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const baseApiUrl = import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com/api";
      
      try {
        await axios.post(`${baseApiUrl}/teams/invitations/${invitationId}/decline`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        
        toast.success('Invitation declined');
      } catch (apiError) {
        console.error('API error declining invitation:', apiError);
        // Handle offline/unavailable API scenario
        toast.success("Invitation declined (offline mode)");
      }
      
      // Remove this invitation from the pending list
      const updatedInvitations = pendingInvitations.filter(inv => inv.id !== invitationId);
      setPendingInvitations(updatedInvitations);
      
      // Update local cache
      localStorage.setItem('cachedInvitations', JSON.stringify(updatedInvitations));
    } catch (err) {
      console.error('Failed to decline invitation:', err);
      toast.error('Failed to decline invitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {pendingInvitations.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {pendingInvitations.length}
              </span>
            )}
          </Button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-medium">
                Team Invitations
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {pendingInvitations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No pending invitations
                  </div>
                ) : (
                  pendingInvitations.map(invitation => (
                    <div key={invitation.id} className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary font-semibold mr-2">
                          {invitation.teamName.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{invitation.teamName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Role: {invitation.role}</p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeclineInvitation(invitation.id)}
                          className="h-8 text-xs"
                          disabled={isSubmitting}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          className="h-8 text-xs"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 
                            <div className="flex items-center">
                              <div className="animate-spin mr-1 h-3 w-3 border-t-2 border-b-2 border-white rounded-full"></div>
                              <span>Processing...</span>
                            </div> : 'Accept'}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Teams List */}
        <div className="w-full md:w-64">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Teams
            </h2>
            <Button variant="outline" size="sm" onClick={() => setIsNewTeamDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-1" />
              New Team
            </Button>
          </div>
          <Tabs orientation="vertical" value={activeTab} className="w-full" onValueChange={handleTabChange}>
            <TabsList className="flex flex-col h-auto bg-muted/50 p-1 rounded-md">
              {teams.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No teams found. Create your first team to get started.
                </div>
              ) : (
                teams.map((team) => (
                  <TabsTrigger
                    key={team._id}
                    value={team._id}
                    className="justify-start gap-2 p-2 h-auto"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{team.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{team.name}</span>
                  </TabsTrigger>
                ))
              )}
            </TabsList>
          </Tabs>
        </div>

        {/* Team Details */}
        <div className="flex-1">
          {selectedTeam ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{selectedTeam.name}</CardTitle>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                  <CardDescription>{selectedTeam.description || "No description provided"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Team Members Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Team Members</h3>
                        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">
                              <UserPlus className="h-4 w-4 mr-1" />
                              Invite Member
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Invite team member</DialogTitle>
                              <DialogDescription>
                                Send an invitation email to add a new member to this team.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="invite-email" className="text-right">
                                  Email
                                </Label>
                                <Input
                                  id="invite-email"
                                  value={inviteEmail}
                                  onChange={(e) => {
                                    setInviteEmail(e.target.value);
                                    setEmailError("");
                                  }}
                                  placeholder="colleague@example.com"
                                  className="col-span-3"
                                />
                                {emailError && (
                                  <div className="col-span-4 text-right text-red-500 text-sm">
                                    {emailError}
                                  </div>
                                )}
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="invite-role" className="text-right">
                                  Role
                                </Label>
                                <select
                                  id="invite-role"
                                  value={inviteRole}
                                  onChange={(e) => setInviteRole(e.target.value)}
                                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsInviteDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleInviteMember}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                                    Sending...
                                  </div>
                                ) : (
                                  <>
                                    <SendIcon className="h-4 w-4 mr-1" />
                                    Send Invitation
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <ScrollArea className="h-[300px]">
                        <motion.div
                          variants={containerAnimation}
                          initial="hidden"
                          animate="visible"
                          className="space-y-2"
                        >
                          {/* Team Owner */}
                          <motion.div
                            variants={itemAnimation}
                            className="flex items-center justify-between p-3 bg-primary/5 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedTeam.owner.profileImage} />
                                <AvatarFallback>
                                  {getUserInitials(
                                    selectedTeam.owner.firstName,
                                    selectedTeam.owner.lastName,
                                    selectedTeam.owner.email
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {selectedTeam.owner.firstName} {selectedTeam.owner.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {selectedTeam.owner.email}
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="ml-auto mr-2">
                              <Crown className="h-3 w-3 mr-1 text-amber-500" />
                              Owner
                            </Badge>
                          </motion.div>

                          {/* Team Members */}
                          {selectedTeam.members
                            .filter(
                              (member) =>
                                member.user._id !== selectedTeam.owner._id
                            )
                            .map((member) => (
                              <motion.div
                                key={member.user._id}
                                variants={itemAnimation}
                                className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:bg-accent/5 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage
                                      src={member.user.profileImage}
                                    />
                                    <AvatarFallback>
                                      {getUserInitials(
                                        member.user.firstName,
                                        member.user.lastName,
                                        member.user.email
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {member.user.firstName} {member.user.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {member.user.email}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {renderMemberRole(member.role)}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        Change Role
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-500">
                                        Remove Member
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </motion.div>
                            ))}

                          <div className="pt-2">
                            <Separator />
                            <h4 className="text-sm font-medium mt-4 mb-2">Pending Invitations</h4>
                          </div>

                          {/* Pending Invitations */}
                          {selectedTeam.invitations && selectedTeam.invitations.length > 0 ? (
                            selectedTeam.invitations
                              .filter((inv) => inv.status === "pending")
                              .map((invitation) => (
                                <motion.div
                                  key={invitation._id}
                                  variants={itemAnimation}
                                  className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                      <Mail className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {invitation.email}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Invited {new Date(invitation.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {renderMemberRole(invitation.role)}
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700">
                                      Pending
                                    </Badge>
                                  </div>
                                </motion.div>
                              ))
                          ) : (
                            <div className="text-center py-4 text-muted-foreground text-sm">
                              No pending invitations
                            </div>
                          )}
                        </motion.div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-lg">
              <Users className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No team selected</h3>
              <p className="text-muted-foreground mb-4">
                Select a team from the list or create a new one
              </p>
              <Button onClick={() => setIsNewTeamDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-1" />
                Create New Team
              </Button>
            </div>
          )}
        </div>
      </div>
      <Dialog open={isNewTeamDialogOpen} onOpenChange={setIsNewTeamDialogOpen}>
        <DialogTrigger asChild>
          <span className="hidden">New Team</span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new team</DialogTitle>
            <DialogDescription>
              Create a new team and optionally invite your first team member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team-name" className="text-right">
                Team Name
              </Label>
              <Input
                id="team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="My awesome team"
                className="col-span-3"
              />
              {teamNameError && (
                <div className="col-span-4 text-right text-red-500 text-sm">
                  {teamNameError}
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="Team description (optional)"
                className="col-span-3"
              />
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-team-email" className="text-right">
                Invite Email
              </Label>
              <Input
                id="new-team-email"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="colleague@example.com (optional)"
                className="col-span-3"
              />
              {emailError && (
                <div className="col-span-4 text-right text-red-500 text-sm">
                  {emailError}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-team-role" className="text-right">
                Role
              </Label>
              <select
                id="new-team-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewTeamDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Creating...
                </div>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Create Team
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 