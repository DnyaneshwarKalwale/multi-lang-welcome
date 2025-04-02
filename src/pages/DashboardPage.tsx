import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Sun, Moon, Home, 
  BarChart, Twitter, Bell, 
  ChevronRight, Settings, LogOut, User, 
  MessageCircle, Sparkles,
  TrendingUp, Heart, Repeat2, MoreHorizontal,
  Bookmark, Hash, Zap, 
} from "lucide-react";
import TeamInvitationNotification from "@/components/TeamInvitationNotification";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Dashboard page
export default function DashboardPage() {
  const { firstName, lastName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const dashboardName = workspaceType === "team" ? workspaceName : `${firstName}'s workspace`;
  const userFullName = `${firstName} ${lastName}`;
  const userInitials = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : "US";
  const userHandle = "@" + (firstName?.toLowerCase() || "") + (lastName?.toLowerCase() || "");

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Home, label: language === "english" ? "Home" : "Startseite", id: "home" },
    { icon: Hash, label: language === "english" ? "Explore" : "Entdecken", id: "explore" },
    { icon: Bell, label: language === "english" ? "Notifications" : "Benachrichtigungen", id: "notifications" },
    { icon: MessageCircle, label: language === "english" ? "Messages" : "Nachrichten", id: "messages" },
    { icon: Bookmark, label: language === "english" ? "Bookmarks" : "Lesezeichen", id: "bookmarks" },
    { icon: BarChart, label: language === "english" ? "Analytics" : "Analysen", id: "analytics" },
    { icon: Sparkles, label: language === "english" ? "AI Tools" : "KI-Tools", id: "ai-tools" },
  ];

  const trendingTopics = [
    { tag: "#ContentCreation", posts: language === "english" ? "5.2K tweets" : "5,2K Tweets" },
    { tag: "#TwitterTips", posts: language === "english" ? "3.8K tweets" : "3,8K Tweets" },
    { tag: "#SocialMedia", posts: language === "english" ? "12.7K tweets" : "12,7K Tweets" },
  ];

  const tweets = [
    {
      id: 1,
      content: language === "english" 
        ? "Just discovered a game-changing approach to content creation that has 10x'd my engagement rate. The secret? Consistency and audience-first thinking. #ContentCreation #SocialMediaTips"
        : "Gerade einen bahnbrechenden Ansatz für Content-Erstellung entdeckt, der meine Engagement-Rate verzehnfacht hat. Das Geheimnis? Konsistenz und publikumsorientiertes Denken. #ContentCreation #SocialMediaTips",
      time: language === "english" ? "2h ago" : "vor 2 Std.",
      stats: {
        replies: 24,
        retweets: 142,
        likes: 358,
        views: 12800
      }
    },
    {
      id: 2,
      content: language === "english"
        ? "5 Twitter features that most people overlook but can dramatically increase your engagement:\n\n1. Twitter Analytics\n2. Tweet scheduling\n3. Twitter Lists\n4. Advanced search operators\n5. Bookmarks for content inspiration"
        : "5 Twitter-Funktionen, die die meisten übersehen, aber Ihr Engagement dramatisch steigern können:\n\n1. Twitter Analytics\n2. Tweet-Planung\n3. Twitter-Listen\n4. Erweiterte Suchoperatoren\n5. Lesezeichen für Content-Inspiration",
      time: language === "english" ? "1d ago" : "vor 1 Tag",
      stats: {
        replies: 42,
        retweets: 215,
        likes: 687,
        views: 24300
      }
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
          <div className="flex items-center gap-3">
            <Twitter className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-blue-500">Scripe</h1>
          </div>
        </div>
        
        <div className="space-y-1 px-3 mt-4">
          {sidebarItems.map((item) => (
            <Button 
              key={item.id} 
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 text-lg font-semibold py-3 ${
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
          {language === "english" ? "Tweet" : "Twittern"}
        </Button>
        
        <div className="mt-auto p-4">
          <button 
            className="flex items-center w-full p-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img 
              src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInitials)}&background=1DA1F2&color=fff`} 
              alt={userFullName}
              className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-100 dark:border-blue-900" 
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{userFullName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{userHandle}</p>
            </div>
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
          
          {showUserMenu && (
            <div className="absolute bottom-16 left-4 w-64 bg-card rounded-xl border border-border shadow-xl z-20 py-1">
              <Button variant="ghost" className="w-full justify-start text-sm gap-2 px-3 py-3">
                <User size={16} />
                {language === "english" ? "Profile" : "Profil"}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm gap-2 px-3 py-3">
                <Settings size={16} />
                {language === "english" ? "Settings" : "Einstellungen"}
              </Button>
              <div className="border-t border-border my-1"></div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm gap-2 px-3 py-3 text-red-500"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                {language === "english" ? "Log out" : "Abmelden"}
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
            <h1 className="text-xl font-bold">{language === "english" ? "Home" : "Startseite"}</h1>
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
            <button className="flex-1 py-4 text-center font-bold text-blue-500 border-b-2 border-blue-500">
              {language === "english" ? "For you" : "Für dich"}
            </button>
            <button className="flex-1 py-4 text-center font-medium text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/10">
              {language === "english" ? "Following" : "Folge ich"}
            </button>
          </div>
        </motion.div>
        
        {/* Tweet composer */}
        <motion.div 
          className="p-4 border-b border-border flex"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <img 
            src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInitials)}&background=1DA1F2&color=fff`} 
            alt={userFullName}
            className="w-12 h-12 rounded-full mr-4 object-cover" 
          />
          <div className="flex-1">
            <div className="border-b border-border mb-3">
              <textarea 
                placeholder={language === "english" ? "What's happening?" : "Was gibt's Neues?"}
                className="w-full bg-transparent border-none focus:outline-none text-lg py-2 min-h-[60px] placeholder:text-gray-500"
              ></textarea>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 text-blue-500">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    <circle cx="16" cy="8" r="2" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M20.4 14.5L16 10 4 20" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 10V16m0-6H8m4 0h4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </Button>
              </div>
              <Button 
                variant="twitter" 
                rounded="full" 
                className="font-bold px-5 py-2"
                disabled={true}
              >
                {language === "english" ? "Tweet" : "Twittern"}
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Tweets */}
        {tweets.map((tweet, index) => (
          <motion.div 
            key={tweet.id}
            className="p-4 border-b border-border hover:bg-gray-50 dark:hover:bg-gray-950/40 transition-colors"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex">
              <img 
                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInitials)}&background=1DA1F2&color=fff`} 
                alt={userFullName}
                className="w-12 h-12 rounded-full mr-4 object-cover flex-shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap mb-1">
                  <span className="font-bold text-gray-900 dark:text-gray-100">{userFullName}</span>
                  <span className="text-sm text-gray-500">{userHandle}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-sm text-gray-500">{tweet.time}</span>
                </div>
                <p className="mb-3 whitespace-pre-line text-gray-800 dark:text-gray-200">{tweet.content}</p>
                
                <div className="flex justify-between text-gray-500 mt-2 max-w-md">
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-sm">{tweet.stats.replies}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                    <Repeat2 size={18} />
                    <span className="text-sm">{tweet.stats.retweets}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                    <span className="text-sm">{tweet.stats.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <BarChart size={18} />
                    <span className="text-sm">{tweet.stats.views}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Right sidebar */}
      <motion.div 
        className="w-80 flex-shrink-0 p-4 sticky top-0 h-screen overflow-y-auto hidden lg:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Search */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-full p-3 mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder={language === "english" ? "Search Twitter" : "Twitter durchsuchen"}
              className="bg-transparent border-none outline-none w-full text-sm"
            />
          </div>
        </div>
        
        {/* Trending */}
        <div className="bg-gray-50 dark:bg-gray-900/80 rounded-xl mb-6">
          <h2 className="font-bold text-xl p-4">{language === "english" ? "Trends for you" : "Trends für dich"}</h2>
          
          {trendingTopics.map((topic, idx) => (
            <div 
              key={idx} 
              className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{language === "english" ? "Trending" : "Trend"}</p>
                  <p className="font-bold text-gray-900 dark:text-white my-0.5">{topic.tag}</p>
                  <p className="text-sm text-gray-500">{topic.posts}</p>
                </div>
                <button className="text-gray-500 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full p-2 transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
          
          <button className="p-4 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors w-full text-left rounded-b-xl">
            {language === "english" ? "Show more" : "Mehr anzeigen"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
