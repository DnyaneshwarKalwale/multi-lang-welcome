import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sun, Moon, 
  Users, ChevronRight,
  BarChart2, LineChart, 
  Calendar, Settings, LogOut, 
  BellRing, Menu, X,
  ArrowUpRight, Clock, TrendingUp,
  Mic, Video, Upload, Type,
  MessageSquare, Repeat, Heart,
  Twitter, Eye, Send,
  PenTool, LayoutGrid, User
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TwitterDashboardPage() {
  const { firstName, lastName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("overview");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState(null);

  const dashboardName = workspaceType === "team" ? workspaceName : `${firstName}'s workspace`;
  const userFullName = `${firstName} ${lastName}`;
  const userInitials = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : "US";

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { 
      id: "overview", 
      icon: LayoutGrid, 
      label: language === "english" ? "Dashboard" : "Dashboard",
    },
    { 
      id: "create", 
      icon: PenTool, 
      label: language === "english" ? "Create" : "Erstellen",
    },
    { 
      id: "scheduler", 
      icon: Calendar, 
      label: language === "english" ? "Schedule" : "Zeitplan",
    },
    { 
      id: "analytics", 
      icon: BarChart2, 
      label: language === "english" ? "Analytics" : "Analytik",
    },
    { 
      id: "settings", 
      icon: Settings, 
      label: language === "english" ? "Settings" : "Einstellungen",
    },
  ];

  // Draft tweets
  const draftTweets = [
    {
      id: 1,
      content: "Just launched our new AI-powered Twitter dashboard! Schedule, analyze, and optimize your Twitter content in one place. #TwitterTools #ContentCreation",
      status: "scheduled",
      scheduledTime: "Today, 3:00 PM",
      estimatedEngagement: "High",
      type: "single"
    },
    {
      id: 2,
      content: "Creating engaging Twitter threads has never been easier. Our AI helps you craft compelling narratives that keep your audience engaged. Try it today!",
      status: "draft",
      estimatedEngagement: "Medium",
      type: "thread"
    },
    {
      id: 3,
      content: "Voice-to-tweet feature is now live! Simply record your thoughts and our AI will create polished tweets ready to share. #VoiceToText #AITwitter",
      status: "scheduled",
      scheduledTime: "Tomorrow, 10:00 AM",
      estimatedEngagement: "Very High",
      type: "single"
    }
  ];

  // Tweet performance stats
  const tweetStats = [
    {
      title: language === "english" ? "Engagement Rate" : "Engagement-Rate",
      value: "4.8%",
      change: "+1.2%",
      trend: "up",
      icon: MessageSquare,
      color: "bg-blue-500"
    },
    {
      title: language === "english" ? "Retweets" : "Retweets",
      value: "347",
      change: "+23.5%",
      trend: "up",
      icon: Repeat,
      color: "bg-green-500"
    },
    {
      title: language === "english" ? "Likes" : "Likes",
      value: "1,842",
      change: "+12.3%",
      trend: "up",
      icon: Heart,
      color: "bg-red-500"
    },
    {
      title: language === "english" ? "Impressions" : "Impressionen",
      value: "24.3K",
      change: "+18.7%",
      trend: "up",
      icon: Eye,
      color: "bg-purple-500"
    }
  ];

  // Content creation methods
  const contentCreationMethods = [
    { 
      icon: Mic, 
      label: language === "english" ? "Voice Note" : "Sprachnotiz",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    { 
      icon: Type, 
      label: language === "english" ? "Text" : "Text",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    { 
      icon: Video, 
      label: language === "english" ? "Video" : "Video",
      color: "bg-red-500/10 text-red-500 border-red-500/20"
    },
    { 
      icon: Upload, 
      label: language === "english" ? "Upload" : "Hochladen",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    }
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-10 overflow-hidden">
        <div className="absolute top-[10%] -right-[30%] w-[70%] h-[70%] rounded-full bg-blue-400 dark:bg-blue-600 blur-[120px]"></div>
        <div className="absolute bottom-[10%] -left-[30%] w-[70%] h-[70%] rounded-full bg-purple-400 dark:bg-purple-600 blur-[120px]"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dots-pattern opacity-5 dark:opacity-10 -z-10"></div>
      
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-background/60 backdrop-blur-sm border border-border shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <motion.div 
        className={`bg-card border-r border-border h-screen flex flex-col fixed lg:static top-0 left-0 w-72 z-40 transition-transform transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Twitter size={20} className="text-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-xl font-semibold truncate">{dashboardName}</h1>
            <p className="text-sm text-muted-foreground truncate">
              {language === "english" ? "Twitter Dashboard" : "Twitter-Dashboard"}
            </p>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start py-6 px-4 text-base mb-1 ${
                  currentTab === item.id 
                    ? "bg-primary/10 dark:bg-primary/20 text-primary font-medium"
                    : "hover:bg-primary/5 dark:hover:bg-primary/10"
                }`}
                onClick={() => setCurrentTab(item.id)}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            {language === "english" ? "Logout" : "Abmelden"}
          </Button>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold hidden sm:block">
                {menuItems.find(item => item.id === currentTab)?.label}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full relative"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <BellRing size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </div>
              
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 rounded-full"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{userInitials}</span>
                  </div>
                </Button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-card rounded-lg border border-border shadow-xl z-50">
                    <div className="p-4 border-b border-border">
                      <p className="font-medium">{userFullName}</p>
                      <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
                    </div>
                    <div className="p-2">
                      <Button variant="ghost" className="w-full justify-start">
                        <User size={16} className="mr-2" />
                        {language === "english" ? "Profile" : "Profil"}
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings size={16} className="mr-2" />
                        {language === "english" ? "Settings" : "Einstellungen"}
                      </Button>
                    </div>
                    <div className="p-2 border-t border-border">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="mr-2" />
                        {language === "english" ? "Logout" : "Abmelden"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main dashboard content */}
        <main className="p-6">
          {/* Welcome section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              {language === "english" ? "Welcome back, " : "Willkommen zurück, "} 
              <span className="text-primary">{firstName}</span>
            </h1>
            <p className="text-muted-foreground">
              {language === "english" 
                ? "Ready to create and schedule your Twitter content? Let's get started." 
                : "Bereit, Twitter-Inhalte zu erstellen und zu planen? Lass uns anfangen."}
            </p>
          </motion.div>
          
          {/* Quick content creation */}
          <motion.div 
            className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {language === "english" ? "Create New Content" : "Neue Inhalte erstellen"}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {contentCreationMethods.map((method, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  className={`flex-col h-24 rounded-xl ${method.color} border`}
                >
                  <method.icon size={24} className="mb-2" />
                  <span>{method.label}</span>
                </Button>
              ))}
            </div>
          </motion.div>
          
          {/* Stats grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tweetStats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} mr-1`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {language === "english" ? "vs last week" : "im Vgl. zur letzten Woche"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Two-column layout for draft tweets and tweet preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Draft tweets */}
            <motion.div 
              className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {language === "english" ? "Your Content" : "Deine Inhalte"}
                </h3>
                <Button variant="outline" size="sm" className="text-xs">
                  {language === "english" ? "View All" : "Alle anzeigen"}
                </Button>
              </div>
              
              <div className="divide-y divide-border">
                {draftTweets.map((tweet) => (
                  <div 
                    key={tweet.id} 
                    className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${selectedTweet === tweet.id ? 'bg-primary/5' : ''}`}
                    onClick={() => setSelectedTweet(tweet.id)}
                  >
                    <div className="flex justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tweet.status === 'scheduled' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {tweet.status === 'scheduled' 
                          ? (language === "english" ? "Scheduled" : "Geplant") 
                          : (language === "english" ? "Draft" : "Entwurf")}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tweet.type === 'thread' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {tweet.type === 'thread' 
                          ? (language === "english" ? "Thread" : "Thread") 
                          : (language === "english" ? "Single" : "Einzeln")}
                      </span>
                    </div>
                    <p className="line-clamp-2 mb-2">{tweet.content}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      {tweet.scheduledTime && <span className="flex items-center gap-1"><Clock size={12} /> {tweet.scheduledTime}</span>}
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} /> 
                        {language === "english" ? "Est. engagement: " : "Geschätztes Engagement: "}
                        <span className={`
                          ${tweet.estimatedEngagement === 'High' || tweet.estimatedEngagement === 'Very High' ? 'text-green-500' : ''}
                          ${tweet.estimatedEngagement === 'Medium' ? 'text-amber-500' : ''}
                          ${tweet.estimatedEngagement === 'Low' ? 'text-red-500' : ''}
                        `}>
                          {tweet.estimatedEngagement}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-border">
                <Button variant="outline" className="w-full">
                  <PenTool size={16} className="mr-2" />
                  {language === "english" ? "Create New Tweet" : "Neuen Tweet erstellen"}
                </Button>
              </div>
            </motion.div>
            
            {/* Tweet preview */}
            <motion.div 
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">
                  {language === "english" ? "Tweet Preview" : "Tweet-Vorschau"}
                </h3>
              </div>
              
              <div className="p-6">
                {selectedTweet ? (
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{userInitials}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold">{userFullName}</p>
                          <p className="text-muted-foreground">@{firstName.toLowerCase()}_{lastName.toLowerCase()}</p>
                        </div>
                        <p className="mt-1">
                          {draftTweets.find(t => t.id === selectedTweet)?.content}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground mb-6">
                      <span className="flex items-center gap-1 text-sm"><MessageSquare size={14} /> 0</span>
                      <span className="flex items-center gap-1 text-sm"><Repeat size={14} /> 0</span>
                      <span className="flex items-center gap-1 text-sm"><Heart size={14} /> 0</span>
                      <span className="flex items-center gap-1 text-sm"><Eye size={14} /> 0</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="default" className="flex-1">
                        <PenTool size={16} className="mr-2" />
                        {language === "english" ? "Edit" : "Bearbeiten"}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Calendar size={16} className="mr-2" />
                        {language === "english" ? "Schedule" : "Planen"}
                      </Button>
                      <Button variant="default" className="flex-none bg-blue-500 hover:bg-blue-600 text-white">
                        <Send size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Twitter className="mx-auto h-12 w-12 text-blue-500 opacity-50 mb-4" />
                    <p className="text-muted-foreground mb-2">
                      {language === "english" ? "Select a tweet to preview" : "Wähle einen Tweet zur Vorschau aus"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Performance chart */}
          <motion.div 
            className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {language === "english" ? "Performance Overview" : "Leistungsübersicht"}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  {language === "english" ? "Weekly" : "Wöchentlich"}
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-primary/10 border-primary/20 text-primary">
                  {language === "english" ? "Monthly" : "Monatlich"}
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  {language === "english" ? "Yearly" : "Jährlich"}
                </Button>
              </div>
            </div>
            
            {/* Chart placeholder */}
            <div className="h-72 w-full relative bg-gradient-to-b from-blue-500/10 to-transparent rounded-lg flex items-center justify-center">
              <div className="absolute inset-0 bg-dots-pattern opacity-10"></div>
              <div className="text-center">
                <LineChart className="mx-auto h-10 w-10 text-blue-500 opacity-80 mb-2" />
                <p className="text-muted-foreground mb-3">
                  {language === "english" ? "Tweet performance analytics" : "Tweet-Performance-Analyse"}
                </p>
                <Button variant="outline" size="sm" className="border-dashed">
                  {language === "english" ? "Generate Analytics" : "Analytik generieren"}
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Content calendar */}
          <motion.div 
            className="bg-card border border-border rounded-xl p-6 shadow-sm"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {language === "english" ? "Content Calendar" : "Inhaltskalender"}
              </h3>
              <Button variant="outline" size="sm">
                {language === "english" ? "Add Content" : "Inhalt hinzufügen"}
              </Button>
            </div>
            
            {/* Calendar placeholder */}
            <div className="min-h-[250px] w-full border border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
              <div className="text-center p-8">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <h4 className="text-lg font-medium mb-2">
                  {language === "english" ? "Drag & Drop Calendar" : "Drag & Drop-Kalender"}
                </h4>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  {language === "english" 
                    ? "Easily plan and organize your Twitter content by dragging and dropping tweets onto your calendar." 
                    : "Plane und organisiere deine Twitter-Inhalte ganz einfach, indem du Tweets per Drag & Drop in deinen Kalender einfügst."}
                </p>
                <Button variant="default">
                  {language === "english" ? "Open Calendar View" : "Kalenderansicht öffnen"}
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border p-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Twitter AI Dashboard. {language === "english" ? "All rights reserved." : "Alle Rechte vorbehalten."}
          </p>
        </footer>
      </div>
    </div>
  );
} 