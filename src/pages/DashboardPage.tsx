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
  Terminal, Activity, Layers,
  Search, Upload, Download, User,
  Twitter
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { firstName, lastName, workspaceName, workspaceType } = useOnboarding();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("overview");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
      icon: Layers, 
      label: language === "english" ? "Overview" : "Übersicht",
    },
    { 
      id: "analytics", 
      icon: BarChart2, 
      label: language === "english" ? "Analytics" : "Analytik",
    },
    { 
      id: "activity", 
      icon: Activity, 
      label: language === "english" ? "Activity" : "Aktivität",
    },
    { 
      id: "calendar", 
      icon: Calendar, 
      label: language === "english" ? "Calendar" : "Kalender",
    },
    { 
      id: "terminal", 
      icon: Terminal, 
      label: language === "english" ? "Console" : "Konsole",
    },
    { 
      id: "settings", 
      icon: Settings, 
      label: language === "english" ? "Settings" : "Einstellungen",
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      title: language === "english" ? "Project created" : "Projekt erstellt",
      description: language === "english" ? "New dashboard project initialized" : "Neues Dashboard-Projekt initialisiert",
      time: language === "english" ? "2 hours ago" : "vor 2 Stunden",
      icon: Layers
    },
    {
      id: 2,
      title: language === "english" ? "Analytics report" : "Analysebericht",
      description: language === "english" ? "Weekly analytics report generated" : "Wöchentlicher Analysebericht generiert",
      time: language === "english" ? "Yesterday" : "Gestern",
      icon: LineChart
    },
    {
      id: 3,
      title: language === "english" ? "Team meeting" : "Team-Meeting",
      description: language === "english" ? "Scheduled for tomorrow at 10:00 AM" : "Geplant für morgen um 10:00 Uhr",
      time: language === "english" ? "12 hours ago" : "vor 12 Stunden",
      icon: Users
    }
  ];

  // Stats cards data
  const statsCards = [
    {
      title: language === "english" ? "Total Users" : "Gesamtbenutzer",
      value: "3,721",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: language === "english" ? "Active Sessions" : "Aktive Sitzungen",
      value: "584",
      change: "+7.2%",
      trend: "up",
      icon: Activity,
      color: "bg-purple-500"
    },
    {
      title: language === "english" ? "Conversion Rate" : "Konversionsrate",
      value: "24.8%",
      change: "-3.1%",
      trend: "down",
      icon: TrendingUp,
      color: "bg-amber-500"
    },
    {
      title: language === "english" ? "Avg. Session" : "Durchschn. Sitzung",
      value: "8m 42s",
      change: "+2.3%",
      trend: "up",
      icon: Clock,
      color: "bg-teal-500"
    }
  ];

  const notifications = [
    {
      id: 1,
      title: language === "english" ? "System Update" : "Systemupdate",
      description: language === "english" ? "New features available" : "Neue Funktionen verfügbar",
      time: language === "english" ? "Just now" : "Gerade eben",
      unread: true
    },
    {
      id: 2,
      title: language === "english" ? "New Team Member" : "Neues Teammitglied",
      description: language === "english" ? "John Doe joined your team" : "John Doe ist deinem Team beigetreten",
      time: language === "english" ? "2 hours ago" : "vor 2 Stunden",
      unread: true
    },
    {
      id: 3,
      title: language === "english" ? "Report Ready" : "Bericht fertig",
      description: language === "english" ? "Monthly report is ready to view" : "Monatsbericht ist bereit zur Ansicht",
      time: language === "english" ? "Yesterday" : "Gestern",
      unread: false
    }
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
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

  // Add navigate to Twitter dashboard function
  const navigateToTwitterDashboard = () => {
    navigate('/twitter-dashboard');
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
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{userInitials}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-xl font-semibold truncate">{dashboardName}</h1>
            <p className="text-sm text-muted-foreground truncate">
              {language === "english" ? "Dashboard" : "Armaturenbrett"}
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
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full relative"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <BellRing size={20} />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg border border-border shadow-xl z-50">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                      <h3 className="font-semibold">
                        {language === "english" ? "Notifications" : "Benachrichtigungen"}
                      </h3>
                      <Button variant="ghost" size="sm" className="text-primary">
                        {language === "english" ? "Mark all read" : "Alle als gelesen markieren"}
                      </Button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border-b border-border hover:bg-muted/50 ${notification.unread ? "bg-primary/5" : ""}`}
                        >
                          <div className="flex gap-3">
                            {notification.unread && <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>}
                            <div className={`flex-1 ${!notification.unread ? "pl-5" : ""}`}>
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-muted-foreground">{notification.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3">
                      <Button variant="outline" className="w-full">
                        {language === "english" ? "View all notifications" : "Alle Benachrichtigungen anzeigen"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
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
                ? "Here's what's happening with your projects today." 
                : "Hier ist, was heute mit deinen Projekten passiert."}
            </p>
            
            {/* Add Twitter Dashboard Button */}
            <div className="mt-4">
              <Button 
                onClick={navigateToTwitterDashboard}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Twitter className="mr-2 h-4 w-4" />
                {language === "english" ? "Go to Twitter Dashboard" : "Zum Twitter-Dashboard"}
              </Button>
            </div>
          </motion.div>
          
          {/* Stats grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {statsCards.map((card, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">{card.title}</p>
                      <h3 className="text-2xl font-bold">{card.value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg ${card.color} text-white`}>
                      <card.icon size={20} />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'} mr-1`}>
                      {card.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {language === "english" ? "vs last month" : "im Vgl. zum Vormonat"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Two-column layout for charts and activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart area */}
            <motion.div 
              className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.4, delay: 0.2 }}
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
              <div className="h-72 w-full relative bg-gradient-to-b from-primary/10 to-transparent rounded-lg flex items-center justify-center">
                <div className="absolute inset-0 bg-dots-pattern opacity-10"></div>
                <div className="text-center">
                  <LineChart className="mx-auto h-10 w-10 text-primary opacity-80 mb-2" />
                  <p className="text-muted-foreground mb-3">
                    {language === "english" ? "Interactive chart area" : "Interaktiver Diagrammbereich"}
                  </p>
                  <Button variant="outline" size="sm" className="border-dashed">
                    {language === "english" ? "Generate Chart" : "Diagramm generieren"}
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Recent activity */}
            <motion.div 
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">
                  {language === "english" ? "Recent Activity" : "Letzte Aktivität"}
                </h3>
              </div>
              
              <div className="divide-y divide-border max-h-[350px] overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex gap-4">
                      <div className="mt-1 p-2 rounded-full bg-primary/10 text-primary">
                        <activity.icon size={18} />
                      </div>
                      <div>
                        <p className="font-medium mb-1">{activity.title}</p>
                        <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-border">
                <Button variant="ghost" className="w-full">
                  {language === "english" ? "View All Activity" : "Alle Aktivitäten anzeigen"}
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Quick actions */}
          <motion.div 
            className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {language === "english" ? "Quick Actions" : "Schnellaktionen"}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { 
                  icon: Upload, 
                  label: language === "english" ? "Upload" : "Hochladen",
                  color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
                },
                { 
                  icon: Download, 
                  label: language === "english" ? "Download" : "Herunterladen",
                  color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
                },
                { 
                  icon: Search, 
                  label: language === "english" ? "Search" : "Suche",
                  color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                },
                { 
                  icon: Users, 
                  label: language === "english" ? "Team" : "Team",
                  color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
                },
                { 
                  icon: Settings, 
                  label: language === "english" ? "Settings" : "Einstellungen",
                  color: "bg-slate-500/10 text-slate-500 border-slate-500/20"
                },
                { 
                  icon: ArrowUpRight, 
                  label: language === "english" ? "Export" : "Exportieren",
                  color: "bg-rose-500/10 text-rose-500 border-rose-500/20"
                }
              ].map((action, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  className={`flex-col h-24 rounded-xl ${action.color} border`}
                >
                  <action.icon size={24} className="mb-2" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border p-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Scripe. {language === "english" ? "All rights reserved." : "Alle Rechte vorbehalten."}
          </p>
        </footer>
      </div>
    </div>
  );
}
