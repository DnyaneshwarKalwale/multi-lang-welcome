import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Sun, Moon, Home, Upload, FileText, Lightbulb, Calendar, 
  BarChart, BookOpen, Twitter, Image, Plus, Bell, 
  ChevronRight, Grid, Settings, LogOut, User
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TeamInvitationNotification from "@/components/TeamInvitationNotification";
import { DashboardPostCard, DashboardAnalyticsCard, DashboardProfileCard } from "@/components/DashboardCard";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Dashboard page
export default function DashboardPage() {
  const { firstName, lastName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const dashboardName = workspaceType === "team" ? workspaceName : `${firstName}'s workspace`;
  const userFullName = `${firstName} ${lastName}`;
  const userInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Upload, label: "Uploads" },
    { icon: FileText, label: "Posts" },
    { icon: Lightbulb, label: "Inspiration" },
    { icon: Calendar, label: "Calendar" },
    { icon: BarChart, label: "Analytics" },
  ];

  const personalBrandItems = [
    { icon: BookOpen, label: "Knowledge Base" },
    { icon: Twitter, label: "Twitter Profile" },
    { icon: Image, label: "AI Photos" },
  ];

  const cards = [
    {
      title: "Install the Chrome Extension",
      description: "Scripe learns from your past Twitter profile content",
      buttonText: "Add to Chrome",
      icon: "🔌",
    },
    {
      title: "Define Your Twitter Value Prop",
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

  const recentPosts = [
    {
      title: "Leveraging Twitter Analytics for Business Growth",
      content: "Twitter analytics can provide valuable insights into your audience engagement patterns. Here's how you can use this data to optimize your content strategy and drive more meaningful engagement...",
      author: {
        name: userFullName,
        avatar: user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInitials) + "&background=6366F1&color=fff",
      },
      status: "published",
      date: "2 days ago",
      stats: {
        views: 432,
        likes: 53,
        comments: 7,
        shares: 12
      },
      imageSrc: "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2274&auto=format&fit=crop"
    },
    {
      title: "The Future of Social Media Marketing",
      content: "As we look toward the future of social media marketing, several emerging trends are poised to reshape how brands connect with their audiences...",
      author: {
        name: userFullName,
        avatar: user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInitials) + "&background=6366F1&color=fff",
      },
      status: "draft",
      date: "Just now",
    }
  ];

  const analyticsData = {
    views: {
      data: [125, 240, 310, 290, 410, 580, 650],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 28,
      timeframe: "Last 7 days"
    },
    engagement: {
      data: [8, 12, 15, 14, 18, 21, 19],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 34,
      timeframe: "Last 7 days"
    }
  };

  const profileData = {
    user: {
      name: userFullName,
      avatar: user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInitials) + "&background=6366F1&color=fff",
      role: "Content Creator"
    },
    stats: {
      posts: 12,
      followers: 2150,
      views: 32840
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <motion.div 
        className="w-64 bg-gray-900/50 border-r border-gray-800 p-5 flex flex-col h-screen overflow-y-auto overflow-x-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <ScripeLogotype className="h-8" />
        </div>
        
        <Button 
          variant="gradient" 
          className="gap-2 mb-8 hover-glow"
          rounded="lg"
        >
          <Plus size={16} />
          Create new post
        </Button>
        
        <div className="space-y-1 mb-8">
          {sidebarItems.map((item) => (
            <Button 
              key={item.label} 
              variant={item.active ? "ghost" : "transparent"}
              className={`w-full justify-start gap-3 text-sm ${
                item.active 
                  ? "bg-gray-800/70 text-white font-medium" 
                  : "text-gray-400 hover:text-white"
              }`}
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
              variant="transparent" 
              className="w-full justify-start gap-3 text-sm text-gray-400 hover:text-white"
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-4">
          <div className="relative">
            <button 
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img 
                src={user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInitials) + "&background=6366F1&color=fff"} 
                alt={userFullName}
                className="w-8 h-8 rounded-full mr-3 object-cover" 
              />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">{userFullName}</p>
                <p className="text-xs text-gray-500 truncate">Free plan</p>
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute bottom-full mb-2 left-0 w-full bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-20 py-1">
                <Button variant="transparent" className="w-full justify-start text-sm gap-2 px-3">
                  <User size={16} />
                  Profile
                </Button>
                <Button variant="transparent" className="w-full justify-start text-sm gap-2 px-3">
                  <Settings size={16} />
                  Settings
                </Button>
                <div className="border-t border-gray-700 my-1"></div>
                <Button 
                  variant="transparent" 
                  className="w-full justify-start text-sm gap-2 px-3 text-red-400 hover:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Log out
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-xs text-gray-500">15 credits left</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-black to-gray-900">
        {/* Header */}
        <motion.div 
          className="bg-black/50 backdrop-blur-sm border-b border-gray-800 p-5 sticky top-0 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{dashboardName}</h1>
              <p className="text-sm text-gray-400">Welcome back! Here's what's happening with your content</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="transparent" size="sm" className="hidden md:flex items-center gap-1">
                <Bell size={16} />
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                <Grid size={16} className="mr-1" />
                View all
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Dashboard content */}
        <div className="p-6">
          {/* Quick stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <DashboardAnalyticsCard 
              title="Profile Views"
              data={analyticsData.views.data}
              labels={analyticsData.views.labels}
              increase={analyticsData.views.increase}
              timeframe={analyticsData.views.timeframe}
            />
            
            <DashboardAnalyticsCard 
              title="Engagement Rate"
              data={analyticsData.engagement.data}
              labels={analyticsData.engagement.labels}
              increase={analyticsData.engagement.increase}
              timeframe={analyticsData.engagement.timeframe}
            />
            
            <DashboardProfileCard
              user={profileData.user}
              stats={profileData.stats}
            />
            
            <motion.div
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-5 text-white hover-lift"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="font-medium mb-2">Upgrade to Pro</h3>
              <p className="text-sm text-indigo-100 mb-4">Get unlimited posts, analytics, and AI features</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">50% OFF</span>
                <Button variant="transparent" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                  Upgrade <ChevronRight size={16} />
                </Button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Recent content */}
          <motion.div 
            className="mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Content</h2>
              <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {recentPosts.map((post, index) => (
                <DashboardPostCard
                  key={index}
                  title={post.title}
                  content={post.content}
                  author={post.author}
                  status={post.status as "draft" | "scheduled" | "published"}
                  date={post.date}
                  stats={post.stats}
                  imageSrc={post.imageSrc}
                  onEdit={() => console.log("Edit", post.title)}
                  onDelete={() => console.log("Delete", post.title)}
                  onPublish={() => console.log("Publish", post.title)}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Get started section */}
          <motion.div 
            className="mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Get Started</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cards.map((card, index) => (
                <div 
                  key={index} 
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover-lift"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{card.description}</p>
                  <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 px-0 hover:bg-transparent">
                    {card.buttonText}
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Team Invitation</DialogTitle>
          </DialogHeader>
          <TeamInvitationNotification />
        </DialogContent>
      </Dialog>
    </div>
  );
}
