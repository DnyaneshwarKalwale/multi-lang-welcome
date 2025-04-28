import React, { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Bell,
  User,
  ChevronDown,
  Linkedin,
  MoonStar,
  Sun,
  Search,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const AdminLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    
    // Load admin user from localStorage
    const storedUser = localStorage.getItem("admin-user");
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
    
    // Check for dark mode preference
    const darkModePreference = localStorage.getItem('adminDarkMode') === 'true';
    setIsDarkMode(darkModePreference);
    
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    }
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('adminDarkMode', (!isDarkMode).toString());
    
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-user");
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel.",
    });
    navigate("/admin/login");
  };
  
  // Navigation items
  const navItems = [
    { 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" />,
      path: "/admin/dashboard" 
    },
    { 
      label: "Analytics", 
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/admin/analytics" 
    },
    { 
      label: "Users", 
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users" 
    },
    { 
      label: "User Limits", 
      icon: <Layers className="h-5 w-5" />,
      path: "/admin/user-limits" 
    },
    { 
      label: "Content", 
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/content" 
    },
    { 
      label: "Carousel Requests", 
      icon: <Layers className="h-5 w-5" />,
      path: "/admin/carousel-requests" 
    },
    { 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings" 
    },
  ];

  // Sidebar for desktop view
  const DesktopSidebar = () => (
    <aside className={`w-64 h-screen fixed left-0 top-0 border-r hidden md:block ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="p-6">
        <Link to="/admin/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Linkedin className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>Admin Panel</h1>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>LinkkedIn Clone</p>
          </div>
        </Link>
      </div>
      <div className="px-4 pb-6">
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <Input 
            placeholder="Search..." 
            className={`pl-10 h-9 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'}`}
          />
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                item.path === location.pathname 
                  ? `${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} font-medium` 
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
              )}
            >
              <span className={item.path === location.pathname 
                ? `${isDarkMode ? 'text-blue-400' : 'text-blue-600'}` 
                : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              {item.label}
              {item.path === location.pathname && (
                <div className={`ml-auto w-1.5 h-6 rounded-sm ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`} />
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src="/admin-avatar.png" alt="Admin" />
            <AvatarFallback className="bg-blue-600 text-white">
              {adminUser?.firstName?.charAt(0) || 'A'}{adminUser?.lastName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {adminUser?.firstName || 'Admin'} {adminUser?.lastName || 'User'}
            </p>
            <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {adminUser?.email || 'admin@example.com'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`flex w-full items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'bg-gray-700 text-red-400 hover:bg-gray-600' : 'bg-gray-100 text-red-600 hover:bg-gray-200'} transition-colors`}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  // Mobile header with offcanvas menu
  const MobileHeader = () => (
    <header className={`fixed top-0 left-0 right-0 h-16 border-b flex items-center justify-between px-4 md:hidden z-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={isDarkMode ? 'text-gray-300 hover:text-white' : ''}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={`w-64 p-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <SheetHeader className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Linkedin className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <SheetTitle className={`text-left ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>Admin Panel</SheetTitle>
                  <p className={`text-xs text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>LinkkedIn Clone</p>
                </div>
              </div>
            </SheetHeader>
            <div className="p-4">
              <div className="relative mb-6">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <Input 
                  placeholder="Search..." 
                  className={`pl-10 h-9 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'}`}
                />
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      item.path === location.pathname 
                        ? `${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} font-medium` 
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
                    )}
                  >
                    <span className={item.path === location.pathname 
                      ? `${isDarkMode ? 'text-blue-400' : 'text-blue-600'}` 
                      : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                    {item.path === location.pathname && (
                      <div className={`ml-auto w-1.5 h-6 rounded-sm ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`} />
                    )}
                  </Link>
                ))}
              </nav>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src="/admin-avatar.png" alt="Admin" />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {adminUser?.firstName?.charAt(0) || 'A'}{adminUser?.lastName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {adminUser?.firstName || 'Admin'} {adminUser?.lastName || 'User'}
                  </p>
                  <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {adminUser?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`flex w-full items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'bg-gray-700 text-red-400 hover:bg-gray-600' : 'bg-gray-100 text-red-600 hover:bg-gray-200'} transition-colors`}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center ml-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Linkedin className="h-4 w-4 text-white" />
          </div>
          <h1 className={`text-lg font-bold ml-2 ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>Admin</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleDarkMode}
          className={isDarkMode ? 'text-yellow-300' : 'text-blue-600'}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className={isDarkMode ? 'text-gray-300' : ''}>
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-blue-600 text-white">
                  {adminUser?.firstName?.charAt(0) || 'A'}{adminUser?.lastName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : ''}>
            <DropdownMenuLabel className={isDarkMode ? 'text-gray-300' : ''}>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
            <DropdownMenuItem className={isDarkMode ? 'hover:bg-gray-700 hover:text-white' : ''}>Profile</DropdownMenuItem>
            <DropdownMenuItem className={isDarkMode ? 'hover:bg-gray-700 hover:text-white' : ''}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
            <DropdownMenuItem onClick={handleLogout} className={isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600'}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );

  // Desktop header
  const DesktopHeader = () => (
    <header className={`h-16 border-b flex items-center justify-between px-6 ml-64 fixed top-0 right-0 left-0 z-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex-1 flex items-center">
        <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <Input 
            placeholder="Search..." 
            className={`pl-10 h-9 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'}`}
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleDarkMode}
          className={isDarkMode ? 'text-yellow-300' : 'text-blue-600'}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className={`relative ${isDarkMode ? 'text-gray-300' : ''}`}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <span className={isDarkMode ? 'text-white' : ''}>
                {adminUser?.firstName || 'Admin'} {adminUser?.lastName || 'User'}
              </span>
              <Avatar className="h-8 w-8 ml-1">
                <AvatarImage src="/admin-avatar.png" alt="Admin" />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {adminUser?.firstName?.charAt(0) || 'A'}{adminUser?.lastName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : ''}>
            <DropdownMenuLabel className={isDarkMode ? 'text-gray-300' : ''}>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
            <DropdownMenuItem className={isDarkMode ? 'hover:bg-gray-700 hover:text-white' : ''}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className={isDarkMode ? 'hover:bg-gray-700 hover:text-white' : ''}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
            <DropdownMenuItem onClick={handleLogout} className={isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600'}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-gray-200' : 'bg-gray-50'}`}>
      {isMobile ? <MobileHeader /> : <DesktopSidebar />}
      {!isMobile && <DesktopHeader />}
      
      <main className={`p-6 ${isMobile ? 'pt-24' : 'ml-64 pt-24'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 