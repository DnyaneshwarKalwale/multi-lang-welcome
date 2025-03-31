
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Home, Upload, FileText, Lightbulb, Calendar, BarChart, BookOpen, MessageSquare, Image, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DashboardPage() {
  const { firstName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-60 bg-gray-900 p-4 flex flex-col h-screen">
        <div className="p-2 mb-6">
          <ScripeLogotype />
        </div>
        
        <Button variant="default" className="bg-primary hover:bg-primary/90 gap-2 mb-6">
          <Plus size={16} />
          Create posts
        </Button>
        
        <div className="space-y-1 mb-8">
          {sidebarItems.map((item) => (
            <Button 
              key={item.label} 
              variant="ghost" 
              className="w-full justify-start gap-3 text-gray-400 hover:text-white"
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-4 mb-2">
          <p className="text-sm text-gray-500 px-3 mb-2">Personal Brand</p>
        </div>
        
        <div className="space-y-1 mb-auto">
          {personalBrandItems.map((item) => (
            <Button 
              key={item.label} 
              variant="ghost" 
              className="w-full justify-start gap-3 text-gray-400 hover:text-white"
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center justify-between px-3">
            <p className="text-sm text-gray-500">Free trial - 15 credits left</p>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-2xl font-semibold mb-1">
            Welcome to Scripe, {firstName} <span className="text-yellow-500">👋</span>
          </h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cards.map((card, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">{card.icon}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => {
                    if (index === 0) {
                      setInviteDialogOpen(true);
                    }
                  }}
                >
                  ...
                </Button>
              </div>
              
              <h3 className="text-lg font-medium mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm mb-6">{card.description}</p>
              
              <Button 
                variant={index === 0 ? "default" : "secondary"} 
                className={index === 0 ? "bg-primary hover:bg-primary/90 w-full" : "w-full"}
                onClick={() => {
                  if (index === 0) {
                    setInviteDialogOpen(true);
                  }
                }}
              >
                {card.buttonText}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent posts</h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-400">
                &lt;
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400">
                &gt;
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-8 flex items-center justify-center">
            <div className="text-center">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full mb-4 bg-gray-800 border-gray-700"
              >
                <Plus />
              </Button>
              <p className="text-gray-400">New post</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Invite members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">Type or paste in emails below, separated by commas.</p>
            <div>
              <label className="text-sm font-medium">Email addresses</label>
              <textarea 
                placeholder="Type or paste emails" 
                className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <select className="w-full mt-1 p-3 bg-gray-800 border border-gray-700 rounded-md text-white">
                <option>Personal Brand</option>
                <option>Admin</option>
                <option>Editor</option>
              </select>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Send invite
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
