import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Sun, Moon, Home, Upload, FileText, Lightbulb, Calendar, 
  BarChart, BookOpen, Twitter, Image, Plus, Bell, 
  ChevronRight, Grid, Settings, LogOut, User,
  BarChart3, Sparkles, Zap, Users, MessageSquare
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TeamInvitationNotification from "@/components/TeamInvitationNotification";
import { DashboardPostCard, DashboardAnalyticsCard, DashboardProfileCard } from "@/components/DashboardCard";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScripeIconRounded } from "@/components/ScripeIcon";
import { Progress } from "@/components/ui/progress";

// Dashboard page
export default function DashboardPage() {
  const { firstName, lastName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'content' | 'analytics'>('overview');

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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-brand-gray-800 border-r border-brand-gray-700">
        <div className="flex flex-col h-full">
          <div className="p-4 sm:p-6">
            <ScripeIconRounded className="w-8 h-8" />
          </div>
          
          <nav className="flex-1 px-2 sm:px-4 space-y-1">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'overview'
                  ? 'bg-brand-primary/20 text-brand-primary'
                  : 'text-brand-gray-300 hover:bg-brand-gray-700/50 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              {t('overview')}
            </button>
            
            <button
              onClick={() => setSelectedTab('content')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'content'
                  ? 'bg-brand-primary/20 text-brand-primary'
                  : 'text-brand-gray-300 hover:bg-brand-gray-700/50 hover:text-white'
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              {t('content')}
            </button>
            
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'analytics'
                  ? 'bg-brand-primary/20 text-brand-primary'
                  : 'text-brand-gray-300 hover:bg-brand-gray-700/50 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              {t('analytics')}
            </button>
          </nav>
          
          <div className="p-4 sm:p-6 border-t border-brand-gray-700">
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-brand-gray-300 hover:bg-brand-gray-700/50 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5 mr-3" />
              {t('settings')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="h-16 border-b border-brand-gray-700 bg-brand-gray-800/50 backdrop-blur-sm">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">
              {t('dashboard')}
            </h1>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-brand-gray-300 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              <button className="flex items-center space-x-2 text-brand-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-brand-primary">JD</span>
                </div>
                <span className="text-sm">John Doe</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-brand-gray-300">{t('totalPosts')}</h3>
                <MessageSquare className="w-5 h-5 text-brand-primary" />
              </div>
              <p className="text-2xl font-semibold text-white mb-2">24</p>
              <div className="flex items-center text-sm text-brand-success">
                <span className="mr-1">↑</span>
                <span>12%</span>
                <span className="ml-1 text-brand-gray-400">vs last month</span>
              </div>
            </motion.div>

            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-brand-gray-300">{t('engagement')}</h3>
                <BarChart3 className="w-5 h-5 text-brand-secondary" />
              </div>
              <p className="text-2xl font-semibold text-white mb-2">4.2%</p>
              <div className="flex items-center text-sm text-brand-success">
                <span className="mr-1">↑</span>
                <span>8%</span>
                <span className="ml-1 text-brand-gray-400">vs last month</span>
              </div>
            </motion.div>

            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-brand-gray-300">{t('followers')}</h3>
                <Users className="w-5 h-5 text-brand-accent" />
              </div>
              <p className="text-2xl font-semibold text-white mb-2">1.2K</p>
              <div className="flex items-center text-sm text-brand-success">
                <span className="mr-1">↑</span>
                <span>5%</span>
                <span className="ml-1 text-brand-gray-400">vs last month</span>
              </div>
            </motion.div>

            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-brand-gray-300">{t('scheduledPosts')}</h3>
                <Calendar className="w-5 h-5 text-brand-pink" />
              </div>
              <p className="text-2xl font-semibold text-white mb-2">8</p>
              <div className="flex items-center text-sm text-brand-success">
                <span className="mr-1">↑</span>
                <span>3</span>
                <span className="ml-1 text-brand-gray-400">for today</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{t('contentPerformance')}</h3>
                <Button variant="ghost" className="text-brand-primary hover:text-brand-primary/80">
                  {t('viewAll')}
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-gray-300">{t('engagementRate')}</span>
                    <span className="text-sm font-medium text-white">4.2%</span>
                  </div>
                  <Progress value={42} className="h-2 bg-brand-gray-700" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-gray-300">{t('reach')}</span>
                    <span className="text-sm font-medium text-white">12.5K</span>
                  </div>
                  <Progress value={75} className="h-2 bg-brand-gray-700" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-gray-300">{t('conversion')}</span>
                    <span className="text-sm font-medium text-white">2.8%</span>
                  </div>
                  <Progress value={28} className="h-2 bg-brand-gray-700" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="card-modern p-4 sm:p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{t('recentActivity')}</h3>
                <Button variant="ghost" className="text-brand-primary hover:text-brand-primary/80">
                  {t('viewAll')}
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-white">{t('newPostCreated')}</p>
                    <p className="text-xs text-brand-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-success/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-brand-success" />
                  </div>
                  <div>
                    <p className="text-sm text-white">{t('postScheduled')}</p>
                    <p className="text-xs text-brand-gray-400">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-warning/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-brand-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-white">{t('performanceAlert')}</p>
                    <p className="text-xs text-brand-gray-400">6 hours ago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
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
