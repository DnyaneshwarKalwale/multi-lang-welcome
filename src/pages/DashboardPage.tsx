import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Sun, Moon, Home, Upload, FileText, Lightbulb, Calendar, 
  BarChart, BookOpen, Twitter, Image, Plus, Bell, 
  ChevronRight, Grid, Settings, LogOut, User, LayoutDashboard,
  PenTool, Share2, Users, GanttChart, MessagesSquare, Sparkles,
  TrendingUp, Heart, MessageCircle, Repeat2, MoreHorizontal,
  Bookmark, Hash, Zap, AtSign, Activity
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
  const [activeTab, setActiveTab] = useState("home");

  const dashboardName = workspaceType === "team" ? workspaceName : `${firstName}'s workspace`;
  const userFullName = `${firstName} ${lastName}`;
  const userInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Hash, label: "Explore", id: "explore" },
    { icon: Bell, label: "Notifications", id: "notifications" },
    { icon: MessageCircle, label: "Messages", id: "messages" },
    { icon: Bookmark, label: "Bookmarks", id: "bookmarks" },
    { icon: PenTool, label: "Create", id: "create" },
    { icon: Activity, label: "Analytics", id: "analytics" },
    { icon: Sparkles, label: "AI Tools", id: "ai-tools" },
  ];

  const trendingTopics = [
    { tag: "#ContentCreation", posts: "5.2K tweets" },
    { tag: "#TwitterTips", posts: "3.8K tweets" },
    { tag: "#SocialMedia", posts: "12.7K tweets" },
    { tag: "#DigitalMarketing", posts: "8.4K tweets" },
    { tag: "#GrowthHacking", posts: "2.9K tweets" },
  ];

  const suggestedAccounts = [
    { name: "Marketing Pro", handle: "@marketingpro", avatar: "https://ui-avatars.com/api/?name=MP&background=1DA1F2&color=fff" },
    { name: "Growth Hacker", handle: "@growthhacker", avatar: "https://ui-avatars.com/api/?name=GH&background=1DA1F2&color=fff" },
    { name: "Content Creator", handle: "@contentcreator", avatar: "https://ui-avatars.com/api/?name=CC&background=1DA1F2&color=fff" },
  ];

  const tweets = [
    {
      id: 1,
      author: {
        name: userFullName,
        handle: "@" + firstName.toLowerCase() + lastName.toLowerCase(),
        avatar: user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInitials) + "&background=1DA1F2&color=fff",
        verified: true
      },
      content: "Just discovered a game-changing approach to content creation that has 10x'd my engagement rate. The secret? Consistency and audience-first thinking. #ContentCreation #SocialMediaTips",
      time: "2h ago",
      stats: {
        replies: 24,
        retweets: 142,
        likes: 358,
        views: 12800
      },
      hasPoll: false,
      hasMedia: false
    },
    {
      id: 2,
      author: {
        name: userFullName,
        handle: "@" + firstName.toLowerCase() + lastName.toLowerCase(),
        avatar: user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInitials) + "&background=1DA1F2&color=fff",
        verified: true
      },
      content: "5 Twitter features that most people overlook but can dramatically increase your engagement:\n\n1. Twitter Analytics\n2. Tweet scheduling\n3. Twitter Lists\n4. Advanced search operators\n5. Bookmarks for content inspiration\n\nWhich one surprised you the most?",
      time: "1d ago",
      stats: {
        replies: 42,
        retweets: 215,
        likes: 687,
        views: 24300
      },
      hasPoll: true,
      hasMedia: false
    },
    {
      id: 3,
      author: {
        name: userFullName,
        handle: "@" + firstName.toLowerCase() + lastName.toLowerCase(),
        avatar: user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInitials) + "&background=1DA1F2&color=fff",
        verified: true
      },
      content: "Just wrapped up our monthly analytics review. Our Twitter growth has surpassed LinkedIn for the first time! Strategic content planning makes all the difference.",
      time: "3d ago",
      stats: {
        replies: 18,
        retweets: 94,
        likes: 276,
        views: 9700
      },
      hasPoll: false,
      hasMedia: true,
      media: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  const draftTweets = [
    {
      title: "Content Creation Strategy",
      content: "The most overlooked aspect of Twitter growth is...",
      timeCreated: "10 min ago"
    },
    {
      title: "Weekly Analytics Insights",
      content: "My engagement has increased by 32% this week by doing these 3 things...",
      timeCreated: "2 days ago"
    }
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <motion.div 
        className="w-72 bg-card border-r border-border flex flex-col sticky top-0 h-screen overflow-y-auto overflow-x-hidden flex-shrink-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-6">
          <ScripeLogotype className="h-8 text-blue-500 dark:text-blue-400" />
        </div>
        
        <div className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <Button 
              key={item.id} 
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 text-lg font-medium py-3 ${
                activeTab === item.id 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                  : "text-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={22} />
              {item.label}
            </Button>
          ))}
        </div>
        
        <Button 
          variant="twitter" 
          className="mx-4 mt-6 py-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold"
        >
          Tweet
        </Button>
        
        <div className="mt-auto p-4">
          <button 
            className="flex items-center w-full p-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img 
              src={user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInitials) + "&background=1DA1F2&color=fff"} 
              alt={userFullName}
              className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-100 dark:border-blue-900" 
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{userFullName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">@{firstName.toLowerCase() + lastName.toLowerCase()}</p>
            </div>
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
          
          {showUserMenu && (
            <div className="absolute bottom-16 left-4 w-64 bg-card rounded-xl border border-border shadow-xl z-20 py-1">
              <Button variant="ghost" className="w-full justify-start text-sm gap-2 px-3 py-3">
                <User size={16} />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm gap-2 px-3 py-3">
                <Settings size={16} />
                Settings
              </Button>
              <div className="border-t border-border my-1"></div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm gap-2 px-3 py-3 text-red-500"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Log out
              </Button>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 min-h-screen border-l border-r border-border max-w-2xl">
        {/* Header */}
        <motion.div 
          className="bg-background/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Home</h1>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10 text-blue-500"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
          
          <div className="flex mt-4 border-b border-border">
            <button className="flex-1 py-4 text-center font-bold text-blue-500 border-b-2 border-blue-500">For you</button>
            <button className="flex-1 py-4 text-center font-medium text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/10">Following</button>
          </div>
        </motion.div>
        
        {/* Tweet composer */}
        <div className="p-4 border-b border-border">
          <div className="flex">
            <img 
              src={user?.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInitials) + "&background=1DA1F2&color=fff"} 
              alt={userFullName}
              className="w-12 h-12 rounded-full mr-3 object-cover" 
            />
            <div className="flex-1">
              <textarea 
                className="w-full bg-transparent border-none outline-none text-lg resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400 pt-2 min-h-[60px]"
                placeholder="What's happening?"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2 text-blue-500">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10 p-2">
                    <Image size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10 p-2">
                    <FileText size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10 p-2">
                    <Bookmark size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10 p-2">
                    <Calendar size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10 p-2">
                    <AtSign size={18} />
                  </Button>
                </div>
                <Button variant="twitter" className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white">
                  Tweet
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tweets feed */}
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {tweets.map((tweet) => (
            <motion.div 
              key={tweet.id}
              className="p-4 border-b border-border hover:bg-gray-50 dark:hover:bg-gray-900/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex">
                <img 
                  src={tweet.author.avatar} 
                  alt={tweet.author.name}
                  className="w-12 h-12 rounded-full mr-3 object-cover" 
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 dark:text-gray-100 mr-1">{tweet.author.name}</span>
                    {tweet.author.verified && (
                      <span className="text-blue-500 mr-1">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      </span>
                    )}
                    <span className="text-gray-500 text-sm mr-1">{tweet.author.handle}</span>
                    <span className="text-gray-500 text-sm">· {tweet.time}</span>
                  </div>
                  <p className="mt-1 mb-3 whitespace-pre-line">{tweet.content}</p>
                  
                  {tweet.hasMedia && (
                    <div className="mb-3 rounded-xl overflow-hidden">
                      <img 
                        src={tweet.media}
                        alt="Tweet media" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  
                  {tweet.hasPoll && (
                    <div className="mb-3 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                      <div className="mb-2 relative h-8 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <div className="absolute h-full bg-blue-100 dark:bg-blue-900/40" style={{ width: "42%" }}></div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="font-medium text-sm">Twitter Analytics</span>
                          <span className="text-sm">42%</span>
                        </div>
                      </div>
                      <div className="mb-2 relative h-8 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <div className="absolute h-full bg-blue-100 dark:bg-blue-900/40" style={{ width: "28%" }}></div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="font-medium text-sm">Tweet scheduling</span>
                          <span className="text-sm">28%</span>
                        </div>
                      </div>
                      <div className="mb-2 relative h-8 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <div className="absolute h-full bg-blue-100 dark:bg-blue-900/40" style={{ width: "15%" }}></div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="font-medium text-sm">Twitter Lists</span>
                          <span className="text-sm">15%</span>
                        </div>
                      </div>
                      <div className="mb-2 relative h-8 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <div className="absolute h-full bg-blue-100 dark:bg-blue-900/40" style={{ width: "10%" }}></div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="font-medium text-sm">Advanced search</span>
                          <span className="text-sm">10%</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">3,842 votes · 1 day left</div>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-500 mt-1">
                    <button className="flex items-center hover:text-blue-500 transition-colors">
                      <MessageCircle size={18} className="mr-2" />
                      <span className="text-sm">{tweet.stats.replies}</span>
                    </button>
                    <button className="flex items-center hover:text-green-500 transition-colors">
                      <Repeat2 size={18} className="mr-2" />
                      <span className="text-sm">{tweet.stats.retweets}</span>
                    </button>
                    <button className="flex items-center hover:text-red-500 transition-colors">
                      <Heart size={18} className="mr-2" />
                      <span className="text-sm">{tweet.stats.likes}</span>
                    </button>
                    <button className="flex items-center hover:text-blue-500 transition-colors">
                      <BarChart size={18} className="mr-2" />
                      <span className="text-sm">{(tweet.stats.views / 1000).toFixed(1)}K</span>
                    </button>
                    <button className="flex items-center hover:text-blue-500 transition-colors">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Right sidebar */}
      <motion.div 
        className="w-80 bg-card sticky top-0 h-screen overflow-y-auto p-4 hidden xl:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Search bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search Twitter"
            className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-3 text-gray-500">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M21.53 20.47l-3.66-3.66A8.98 8.98 0 0020 11a9 9 0 10-9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66a.746.746 0 001.06 0 .747.747 0 00.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
            </svg>
          </div>
        </div>
        
        {/* Drafts section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-xl mb-3">Your drafts</h3>
          {draftTweets.map((draft, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 mb-3 last:pb-0 last:mb-0">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">{draft.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-1">{draft.content}</p>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">{draft.timeCreated}</span>
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 transition-colors -my-1 -mr-2 h-8">
                  Edit
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10">
            View all drafts
          </Button>
        </div>
        
        {/* Trending topics */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-xl mb-3">Trends for you</h3>
          {trendingTopics.map((topic, index) => (
            <div key={index} className="py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 px-2 -mx-2 rounded-lg cursor-pointer">
              <span className="text-sm text-gray-500">{topic.posts}</span>
              <h4 className="font-bold text-gray-900 dark:text-gray-100">{topic.tag}</h4>
            </div>
          ))}
          <Button variant="ghost" className="text-blue-500 hover:text-blue-600 mt-1 px-0">
            Show more
          </Button>
        </div>
        
        {/* Who to follow */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
          <h3 className="font-bold text-xl mb-3">Who to follow</h3>
          {suggestedAccounts.map((account, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div className="flex items-center">
                <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">{account.name}</h4>
                  <span className="text-sm text-gray-500">{account.handle}</span>
                </div>
              </div>
              <Button variant="outline" className="rounded-full px-4 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                Follow
              </Button>
            </div>
          ))}
          <Button variant="ghost" className="text-blue-500 hover:text-blue-600 mt-1 px-0">
            Show more
          </Button>
        </div>
      </motion.div>
      
      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Team Invitation</DialogTitle>
          </DialogHeader>
          <TeamInvitationNotification />
        </DialogContent>
      </Dialog>
    </div>
  );
}
