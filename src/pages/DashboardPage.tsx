import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Home, Upload, FileText, Lightbulb, Calendar, BarChart, BookOpen, MessageSquare, Image, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NotificationBell } from "@/components/NotificationBell";
import { useToast } from "@/components/ui/use-toast";
import { workspaceApi } from '@/services/api';

//dashboard page

export default function DashboardPage() {
  const { firstName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const dashboardName = workspaceType === "team" ? workspaceName : `${firstName}'s workspace`;

  const sidebarItems = [
    { icon: Home, label: "Home" },
    { icon: Upload, label: "Uploads" },
    { icon: FileText, label: "Posts" },
    { icon: Lightbulb, label: "Inspiration" },
    { icon: Calendar, label: "Calendar" },
    { icon: BarChart, label: "Analytics" },
  ];

  const personalBrandItems = [
    { icon: BookOpen, label: "Knowledge Base" },
    { icon: MessageSquare, label: "Tone of Voice" },
    { icon: Image, label: "AI Photos" },
  ];

  const cards = [
    {
      title: "Install the Chrome Extension",
      description: "Scripe learns from your past LinkedIn profile content",
      buttonText: "Add to Chrome",
      icon: "🔌",
    },
    {
      title: "Define Your LinkedIn Value Prop",
      description: "Outline your target audience and skills",
      buttonText: "Create now",
      icon: "📊",
    },
    {
      title: "Create content strategy",
      description: "Used to personalize your posts and create better analytics",
      buttonText: "Create now",
      icon: "✨",
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
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-20 bg-gray-900 border-r border-gray-800 items-center pt-6">
        <div className="mb-8">
          <ScripeLogotype className="w-8 h-8" />
        </div>
        
        <div className="flex flex-col items-center space-y-6">
          {sidebarItems.map((item, index) => (
            <button 
              key={index}
              className={`p-3 rounded-xl ${
                index === 0 ? "bg-purple-600" : "hover:bg-gray-800"
              }`}
            >
              <item.icon size={20} />
            </button>
          ))}
        </div>
        
        <div className="mt-auto mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">{dashboardName}</h1>
          
          <div className="flex items-center space-x-2">
            <NotificationBell />
            
            {workspaceType === "team" && (
              <Button 
                className="text-xs" 
                variant="outline"
                onClick={() => setInviteDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Invite
              </Button>
            )}
            
            <button className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              {firstName?.charAt(0) || "U"}
            </button>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Start creating</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                  <div 
                    key={index}
                    className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-purple-600/40 transition-all"
                  >
                    <div className="text-3xl mb-4">{card.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{card.description}</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">{card.buttonText}</Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Build your personal brand</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {personalBrandItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center space-x-4 hover:border-purple-600/40 transition-all cursor-pointer"
                  >
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <item.icon className="text-purple-500" size={20} />
                    </div>
                    <div className="font-medium">{item.label}</div>
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
            <DialogTitle>Invite members</DialogTitle>
            <DialogDescription className="text-gray-400">
              Type or paste in emails below, separated by commas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email addresses</label>
              <textarea 
                placeholder="colleague@example.com, teammate@example.com" 
                className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                rows={3}
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <select 
                className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "admin" | "member")}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleSendInvites}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send invite"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
