import React, { useState, useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Sun, Moon, Home, Upload, FileText, Lightbulb, Calendar, 
  BarChart, BookOpen, Twitter, Image, Plus, Bell, 
  ChevronRight, Grid, Settings, LogOut, User, Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TeamInvitationNotification from "@/components/TeamInvitationNotification";
import { DashboardPostCard, DashboardAnalyticsCard, DashboardProfileCard } from "@/components/DashboardCard";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSettingsSheet } from "@/components/ProfileSettingsSheet";

// Dashboard page
export default function DashboardPage() {
  const { firstName, lastName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

  // Prevent navigating back to onboarding once in the dashboard
  useEffect(() => {
    // Set onboarding as completed if not already set
    if (localStorage.getItem('onboardingCompleted') !== 'true') {
      localStorage.setItem('onboardingCompleted', 'true');
    }
    
    // Handle browser back button to prevent going back to onboarding pages
    window.history.pushState(null, '', window.location.href);
    
    const handlePopState = () => {
      // If user tries to go back, push current state again to stay on dashboard
      if (location.pathname === '/onboarding/dashboard' || location.pathname === '/dashboard') {
        window.history.pushState(null, '', window.location.href);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  const dashboardName = workspaceType === "team" ? workspaceName : `${firstName}'s workspace`;
  const userFullName = `${firstName} ${lastName}`;
  const userInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const handleOpenProfileSettings = () => {
    setShowUserMenu(false);
    setProfileSettingsOpen(true);
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
        className="w-64 bg-gray-900/50 border-r border-gray-800 flex flex-col h-screen overflow-y-auto overflow-x-hidden backdrop-blur-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Top section with logo */}
        <div className="p-5 border-b border-gray-800/50">
          <div className="mb-6">
            <ScripeLogotype className="h-8" />
          </div>
          
          <Button 
            variant="gradient" 
            className="w-full gap-2 rounded-lg shadow-lg shadow-indigo-900/20 hover:shadow-indigo-600/40 transition-shadow duration-300 font-medium py-5 relative overflow-hidden"
          >
            <Plus size={16} className="relative z-10" />
            <span className="relative z-10">Create new post</span>
            <motion.div 
              className="absolute inset-0 bg-white/10" 
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </Button>
        </div>
        
        {/* Main menu */}
        <div className="p-3 flex-1">
          <div className="space-y-1 mb-8">
            {sidebarItems.map((item) => (
              <Button 
                key={item.label} 
                variant={item.active ? "ghost" : "transparent"}
                className={`w-full justify-start gap-3 text-sm rounded-lg transition-all duration-200 ${
                  item.active 
                    ? "bg-gradient-to-r from-indigo-900/50 to-indigo-800/30 text-white font-medium border-l-2 border-indigo-500" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                }`}
              >
                <item.icon size={18} className={item.active ? "text-indigo-400" : "text-gray-500"} />
                {item.label}
                {item.active && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-indigo-500/10 -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Button>
            ))}
          </div>
          
          <div className="border-t border-gray-800/50 pt-5 mb-5">
            <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3 font-medium">Personal Brand</p>
          </div>
          
          <div className="space-y-1 mb-auto">
            {personalBrandItems.map((item) => (
              <Button 
                key={item.label} 
                variant="transparent" 
                className="w-full justify-start gap-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800/30 rounded-lg"
              >
                <item.icon size={18} className="text-gray-500" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* User section */}
        <div className="border-t border-gray-800/50 p-3">
          <div className="flex items-center p-2 rounded-lg bg-gray-800/30 mb-4">
            <div 
              className="w-9 h-9 rounded-full bg-indigo-600 flex-shrink-0 mr-3 flex items-center justify-center overflow-hidden border-2 border-indigo-500/30"
              style={{ 
                backgroundImage: `url(${user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInitials)}&background=6366F1&color=fff`})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!user?.profilePicture && (
                <span className="text-xs font-medium">{userInitials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userFullName}</p>
              <p className="text-xs text-gray-400 truncate">@{firstName.toLowerCase()}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowUserMenu(!showUserMenu)}>
              <Settings size={16} className="text-gray-400" />
            </Button>
          </div>
          
          {showUserMenu && (
            <motion.div 
              className="bg-gray-800 rounded-lg p-1 mb-4 overflow-hidden shadow-xl"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm text-gray-300 hover:bg-gray-700 rounded-md py-2"
                onClick={handleOpenProfileSettings}
              >
                <User size={14} className="mr-2" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm text-gray-300 hover:bg-gray-700 rounded-md py-2">
                <Settings size={14} className="mr-2" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-md py-2" onClick={handleLogout}>
                <LogOut size={14} className="mr-2" />
                Logout
              </Button>
            </motion.div>
          )}
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <Sparkles size={14} className="text-yellow-500 mr-1.5" />
              <p className="text-xs text-gray-300">15 credits left</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-800" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-indigo-400" />}
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
        <div className="p-5 space-y-8">
          {/* First row - Quick action cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.1 }}
          >
            {cards.map((card, index) => (
              <motion.div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-indigo-500/30 transition-colors rounded-xl p-6 flex flex-col hover-lift"
                variants={fadeInUp}
              >
                <div className="bg-indigo-900/20 w-12 h-12 flex items-center justify-center rounded-full text-2xl mb-4">
                  {card.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">{card.description}</p>
                <Button 
                  variant="outline" 
                  className="justify-center w-full border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/20 hover:text-indigo-200"
                >
                  {card.buttonText}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Second row - Recent posts and analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent posts - Wider column */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent posts</h2>
                <Button variant="link" className="text-indigo-400 hover:text-indigo-300 p-0">
                  View all <ChevronRight size={16} />
                </Button>
              </div>
              
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
            </motion.div>
            
            {/* Analytics sidebar - Narrower column */}
            <motion.div 
              className="space-y-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-xl font-bold">Analytics</h2>
              
              <DashboardAnalyticsCard 
                title="Profile views" 
                data={analyticsData.views.data}
                labels={analyticsData.views.labels}
                increase={analyticsData.views.increase}
                timeframe={analyticsData.views.timeframe}
              />
              
              <DashboardAnalyticsCard 
                title="Engagement rate" 
                data={analyticsData.engagement.data}
                labels={analyticsData.engagement.labels}
                increase={analyticsData.engagement.increase}
                timeframe={analyticsData.engagement.timeframe}
              />
              
              <DashboardProfileCard 
                user={profileData.user}
                stats={profileData.stats}
              />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Dialog for team invitations */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Team Invitation</DialogTitle>
          </DialogHeader>
          <TeamInvitationNotification />
          <Button className="mt-4" onClick={() => setInviteDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>

      {/* Profile Settings Sheet */}
      <ProfileSettingsSheet
        open={profileSettingsOpen}
        onOpenChange={setProfileSettingsOpen}
        onSuccess={() => {
          // Refresh any profile-dependent data if needed
        }}
      />
    </div>
  );
}
