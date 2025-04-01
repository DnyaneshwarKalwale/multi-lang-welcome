import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Sun, Moon, Home, Upload, FileText, Lightbulb, Calendar, BarChart, BookOpen, 
  MessageSquare, Image, Plus, Bell, Settings, LogOut, ChevronDown, Search,
  Users, TrendingUp, Zap, Clock, ExternalLink, Edit, Sparkles, Award,
  User, Puzzle, Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

//dashboard page

export default function DashboardPage() {
  const { firstName, lastName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [createContentDialogOpen, setCreateContentDialogOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const dashboardName = workspaceType === "team" ? workspaceName : `${firstName}'s workspace`;
  const userInitials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: FileText, label: "Content", active: false },
    { icon: Upload, label: "Uploads", active: false },
    { icon: Lightbulb, label: "Ideas", active: false },
    { icon: Calendar, label: "Calendar", active: false },
    { icon: BarChart, label: "Analytics", active: false },
    { icon: Users, label: "Team", active: false },
  ];

  const personalBrandItems = [
    { icon: BookOpen, label: "Knowledge Base", active: false },
    { icon: MessageSquare, label: "Tone of Voice", active: false },
    { icon: Image, label: "AI Photos", active: false },
  ];

  const notifications = [
    {
      id: 1,
      title: "New comment on your post",
      message: "Jane Smith commented on your LinkedIn post about AI",
      time: "10 min ago",
      read: false
    },
    {
      id: 2,
      title: "Content suggestion ready",
      message: "We've prepared a new content suggestion based on your audience",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      title: "Weekly analytics update",
      message: "Your content performance is up 12% this week",
      time: "Yesterday",
      read: true
    }
  ];

  const recentActivity = [
    {
      title: "7 Ways AI is Transforming Content Creation",
      type: "LinkedIn post",
      status: "Published",
      date: "Today, 10:45 AM",
      engagement: 78,
      views: 1240
    },
    {
      title: "The Future of Remote Work",
      type: "Twitter thread",
      status: "Draft",
      date: "Yesterday, 3:22 PM",
      engagement: null,
      views: null
    },
    {
      title: "How to Build a Personal Brand Online",
      type: "LinkedIn article",
      status: "Scheduled",
      date: "Tomorrow, 9:00 AM",
      engagement: null,
      views: null
    }
  ];

  const contentIdeas = [
    "10 Best Practices for Digital Marketing in 2023",
    "How AI is Changing the Landscape of [Your Industry]",
    "Case Study: How [Company] Increased Engagement by 200%",
    "The Ultimate Guide to Building a Personal Brand"
  ];

  const statsCards = [
    {
      title: "Total Posts",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: <FileText className="h-5 w-5 text-blue-400" />
    },
    {
      title: "Engagement Rate",
      value: "4.8%",
      change: "+0.6%",
      trend: "up",
      icon: <TrendingUp className="h-5 w-5 text-green-400" />
    },
    {
      title: "Content Quality",
      value: "High",
      change: "Consistent",
      trend: "neutral",
      icon: <Award className="h-5 w-5 text-purple-400" />
    },
    {
      title: "AI Credits",
      value: "86",
      change: "14 used this week",
      trend: "neutral",
      icon: <Zap className="h-5 w-5 text-yellow-400" />
    }
  ];

  const contentTypes = [
    {
      title: "LinkedIn Post",
      description: "Perfect for professional updates and insights",
      icon: <FileText className="text-blue-500 w-6 h-6" />,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      title: "Twitter Thread",
      description: "Share thoughts in bite-sized chunks",
      icon: <MessageSquare className="text-teal-500 w-6 h-6" />,
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/30"
    },
    {
      title: "Blog Article",
      description: "Deep dive into complex topics",
      icon: <BookOpen className="text-purple-500 w-6 h-6" />,
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      title: "AI-Assisted Creation",
      description: "Generate content with AI guidance",
      icon: <Sparkles className="text-amber-500 w-6 h-6" />,
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 flex flex-col h-screen border-r border-gray-800">
        <div className="p-4 mb-2">
          <ScripeLogotype />
        </div>
        
        <div className="px-3 py-2 mb-6">
          <Button 
            variant="default" 
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 w-full gap-2 font-medium"
            onClick={() => setCreateContentDialogOpen(true)}
          >
            <Plus size={16} />
            Create Content
          </Button>
        </div>
        
        <div className="space-y-1 px-3 mb-8">
          {sidebarItems.map((item) => (
            <Button 
              key={item.label} 
              variant="ghost" 
              className={`w-full justify-start gap-3 ${
                item.active 
                  ? "bg-gray-800 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-4 mb-2 px-4">
          <p className="text-sm text-gray-500 mb-2 font-medium">Personal Brand</p>
        </div>
        
        <div className="space-y-1 px-3 mb-auto">
          {personalBrandItems.map((item) => (
            <Button 
              key={item.label} 
              variant="ghost" 
              className={`w-full justify-start gap-3 ${
                item.active 
                  ? "bg-gray-800 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-4 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-purple-400">Pro Plan</p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-gray-800"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">AI Credits</span>
              <span className="text-gray-300">86/100</span>
            </div>
            <Progress value={86} className="h-1.5 bg-gray-800" />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top header/navbar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search content, ideas..." 
                className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={18} />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 mr-4 bg-gray-900 border border-gray-800 text-white p-0">
                <div className="p-3 border-b border-gray-800">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b border-gray-800 last:border-0 hover:bg-gray-800 ${
                        notification.read ? 'opacity-70' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-xs text-gray-400">{notification.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-800">
                  <Button variant="ghost" size="sm" className="w-full text-sm text-gray-400 hover:text-white">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon">
              <Settings size={18} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{firstName}</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2 bg-gray-900 border border-gray-800 text-white">
                <div className="p-2 border-b border-gray-800">
                  <p className="text-sm font-medium">{firstName} {lastName}</p>
                  <p className="text-xs text-gray-400">Pro Plan</p>
                </div>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                  <User size={16} /> Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                  <Settings size={16} /> Preferences
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 text-red-400 hover:text-red-300">
                  <LogOut size={16} /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Welcome back, {firstName} <span className="text-yellow-500">👋</span>
                </h1>
                <p className="text-gray-400">Here's what's happening with your content today</p>
              </div>
              <Button 
                variant="outline" 
                className="border-gray-700 hover:bg-gray-800 gap-2"
                onClick={() => setInviteDialogOpen(true)}
              >
                <Users size={16} />
                Invite Team
              </Button>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statsCards.map((card, index) => (
                <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:bg-gray-900/80 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 rounded-lg bg-gray-800">
                      {card.icon}
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                      card.trend === 'up' ? 'text-green-400 bg-green-400/10' : 
                      card.trend === 'down' ? 'text-red-400 bg-red-400/10' : 
                      'text-gray-400 bg-gray-500/10'
                    }`}>
                      {card.trend === 'up' && <TrendingUp size={12} />}
                      {card.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{card.value}</div>
                  <div className="text-sm text-gray-400">{card.title}</div>
                </div>
              ))}
            </div>
            
            {/* Content tabs */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl mb-8">
              <Tabs defaultValue="recent" className="w-full">
                <div className="border-b border-gray-800 p-4">
                  <TabsList className="bg-gray-800">
                    <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                    <TabsTrigger value="ideas">Content Ideas</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="recent" className="p-4">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium mb-1">{activity.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <FileText size={14} /> {activity.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} /> {activity.date}
                              </span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'Published' ? 'text-green-400 bg-green-400/10' : 
                            activity.status === 'Draft' ? 'text-yellow-400 bg-yellow-400/10' : 
                            'text-blue-400 bg-blue-400/10'
                          }`}>
                            {activity.status}
                          </div>
                        </div>
                        
                        {activity.status === 'Published' && (
                          <div className="flex gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-400/10 p-1.5 rounded-md">
                                <TrendingUp size={14} className="text-blue-400" />
                              </div>
                              <div>
                                <p className="text-gray-400">Engagement</p>
                                <p className="font-medium">{activity.engagement}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-purple-400/10 p-1.5 rounded-md">
                                <Eye size={14} className="text-purple-400" />
                              </div>
                              <div>
                                <p className="text-gray-400">Views</p>
                                <p className="font-medium">{activity.views}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-white">
                            <Edit size={14} /> Edit
                          </Button>
                          {activity.status === 'Published' && (
                            <Button variant="ghost" size="sm" className="gap-1 text-gray-400 hover:text-white">
                              <ExternalLink size={14} /> View
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="ideas" className="p-4">
                  <div className="space-y-4">
                    {contentIdeas.map((idea, index) => (
                      <div key={index} className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-all">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{idea}</h3>
                          <Button variant="outline" size="sm" className="gap-1 border-gray-700 text-gray-300">
                            <Sparkles size={14} className="text-yellow-400" /> Create from idea
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="ghost" className="gap-2 text-purple-400 hover:text-purple-300 w-full">
                      <Lightbulb size={16} /> Generate more content ideas
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="scheduled" className="p-4">
                  <div className="flex items-center justify-center py-10 text-gray-400">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <h3 className="text-lg font-medium mb-1">No scheduled content</h3>
                      <p className="mb-4">Plan your content calendar for consistent posting</p>
                      <Button variant="outline" className="gap-2 border-gray-700">
                        <Calendar size={16} /> Open Calendar
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Suggested actions */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">Recommended Actions</h2>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  View all
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <BarChart className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Complete your content strategy</h3>
                  <p className="text-sm text-gray-300 mb-4">Define your goals and target audience to improve content performance</p>
                  <Button className="bg-blue-500 hover:bg-blue-600 w-full">
                    Get started
                  </Button>
                </div>
                
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <Puzzle size={20} className="h-5 w-5 text-amber-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Install the browser extension</h3>
                  <p className="text-sm text-gray-300 mb-4">Enhance your content creation workflow with our powerful browser tool</p>
                  <Button className="bg-amber-500 hover:bg-amber-600 w-full">
                    Add to browser
                  </Button>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <BookOpen className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Build your knowledge base</h3>
                  <p className="text-sm text-gray-300 mb-4">Create a repository of expertise to power your AI content generation</p>
                  <Button className="bg-green-500 hover:bg-green-600 w-full">
                    Start building
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-md">
          <DialogHeader>
            <DialogTitle>Invite team members</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add colleagues to collaborate on content creation and management.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email addresses</label>
              <textarea 
                placeholder="name@company.com, name@company.com..." 
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Role</label>
              <select className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none">
                <option>Admin (Full access)</option>
                <option>Editor (Can edit content)</option>
                <option>Viewer (Read-only access)</option>
              </select>
            </div>
            <div className="pt-2">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                Send invitations
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Create Content Dialog */}
      <Dialog open={createContentDialogOpen} onOpenChange={setCreateContentDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create new content</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose a content type to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {contentTypes.map((type, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border ${type.borderColor} ${type.bgColor} hover:bg-opacity-75 cursor-pointer transition-all`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-gray-900 flex items-center justify-center">
                    {type.icon}
                  </div>
                  <h3 className="font-medium">{type.title}</h3>
                </div>
                <p className="text-sm text-gray-300">{type.description}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="outline" 
              className="border-gray-700"
              onClick={() => setCreateContentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
              Blank document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
