import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ScripeLogotype, ScripeIcon } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Sun, Moon, Home, Upload, FileText, Lightbulb, Calendar, 
  BarChart, BookOpen, MessageSquare, Image, Plus, Loader2,
  ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NotificationBell } from "@/components/NotificationBell";
import { useToast } from "@/components/ui/use-toast";
import { workspaceApi } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

//dashboard page

export default function DashboardPage() {
  const { firstName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const dashboardName = workspaceType === "team" ? workspaceName : `${firstName}'s workspace`;

  const sidebarItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Upload, label: "Uploads" },
    { icon: FileText, label: "Posts" },
    { icon: Lightbulb, label: "Inspiration" },
    { icon: Calendar, label: "Calendar" },
    { icon: BarChart, label: "Analytics" },
    { icon: Users, label: "Team" },
    { icon: Settings, label: "Settings" }
  ];

  const personalBrandItems = [
    { icon: BookOpen, label: "Knowledge Base", color: "from-purple-500 to-blue-500" },
    { icon: MessageSquare, label: "Tone of Voice", color: "from-pink-500 to-purple-500" },
    { icon: Image, label: "AI Photos", color: "from-blue-500 to-teal-500" },
  ];

  const cards = [
    {
      title: "Install the Chrome Extension",
      description: "Quickly save ideas and content from anywhere on the web",
      buttonText: "Add to Chrome",
      icon: "🔌",
      color: "from-purple-500 to-blue-400"
    },
    {
      title: "Define Your Content Strategy",
      description: "Outline your target audience and content goals",
      buttonText: "Create now",
      icon: "📊",
      color: "from-pink-500 to-orange-400"
    },
    {
      title: "Generate your first post",
      description: "Let AI help you craft the perfect social media content",
      buttonText: "Create now",
      icon: "✨",
      color: "from-blue-500 to-teal-400"
    },
  ];

  // Handle sending invitations
  const handleSendInvites = async () => {
    if (!inviteEmails.trim()) {
      toast({
        title: "Email required",
        description: "Please enter at least one email address",
        variant: "destructive"
      });
      return;
    }

    // Parse comma-separated emails
    const emails = inviteEmails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emails.length === 0) {
      toast({
        title: "Email required",
        description: "Please enter at least one valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await workspaceApi.sendInvites(emails, inviteRole);
      
      toast({
        title: "Invitations sent",
        description: `${emails.length} invitation${emails.length === 1 ? '' : 's'} sent successfully`,
        variant: "default"
      });
      
      // Reset form and close dialog
      setInviteEmails("");
      setInviteRole("member");
      setInviteDialogOpen(false);
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <ScripeLogotype className="text-white" />
        </div>
        
        <div className="px-3 py-2">
          {sidebarItems.map((item, index) => (
            <button 
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-lg text-left ${
                index === 0 
                  ? "bg-gradient-to-r from-purple-600/80 to-purple-600/50 text-white" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {index === 0 && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2 py-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex justify-around px-2 py-3">
          {sidebarItems.slice(0, 5).map((item, index) => (
            <button 
              key={index}
              className={`flex flex-col items-center p-1 ${
                index === 0 ? "text-purple-500" : "text-gray-400"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="md:hidden">
              <ScripeIcon size={28} className="text-white" />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <NotificationBell />
            
            {workspaceType === "team" && (
              <Button 
                className="text-sm" 
                variant="outline"
                onClick={() => setInviteDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Invite
              </Button>
            )}
            
            <Avatar className="h-9 w-9 border border-gray-700">
              <AvatarImage src={user?.profilePicture || ""} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                {firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Welcome, {firstName || "User"}</h1>
                <p className="text-gray-400 mt-1">Let's create some amazing content today</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-1" />
                New Post
              </Button>
            </div>
            
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <span className="mr-2">Start creating</span>
                <div className="h-px bg-gradient-to-r from-purple-600/50 to-transparent flex-1 ml-2"></div>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                  <div 
                    key={index}
                    className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-purple-600/40 transition-all relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-15 transition-opacity" style={{backgroundImage: `linear-gradient(to bottom right, ${card.color.split(' ')[1]}, ${card.color.split(' ')[3]})`}}></div>
                    <div className="text-4xl mb-4">{card.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{card.description}</p>
                    <Button className={`w-full bg-gradient-to-r ${card.color} hover:saturate-150`}>
                      {card.buttonText}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <span className="mr-2">Build your personal brand</span>
                <div className="h-px bg-gradient-to-r from-purple-600/50 to-transparent flex-1 ml-2"></div>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {personalBrandItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center space-x-4 hover:border-purple-600/40 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-15 transition-opacity" style={{backgroundImage: `linear-gradient(to bottom right, ${item.color.split(' ')[1]}, ${item.color.split(' ')[3]})`}}></div>
                    <div className={`p-3 bg-gradient-to-br ${item.color} rounded-lg`}>
                      <item.icon className="text-white" size={20} />
                    </div>
                    <div className="font-medium">{item.label}</div>
                    <ChevronRight size={16} className="ml-auto text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Team invite dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Invite team members</DialogTitle>
            <DialogDescription className="text-gray-400">
              Type or paste email addresses below, separated by commas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email addresses</label>
              <textarea 
                placeholder="colleague@example.com, teammate@example.com" 
                className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-md text-white resize-none focus:border-purple-600 focus:ring-purple-600"
                rows={3}
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Team members will receive an email invitation to join your workspace.</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Role</label>
              <select 
                className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-purple-600 focus:ring-purple-600"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "admin" | "member")}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Admins can invite others and manage workspace settings.</p>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mt-4"
              onClick={handleSendInvites}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending invites...
                </>
              ) : (
                "Send invitations"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
