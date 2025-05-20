import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart, 
  Settings, 
  FileText,
  Layers,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronDown,
  Home,
  Sparkles,
  MessageSquare,
  MoonStar,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandOutIcon, BrandOutLogotype } from '@/components/BrandOutIcon';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Content',
    href: '/admin/content',
    icon: <FileText className="h-5 w-5" />
  },
  {
    title: 'Carousel Requests',
    href: '/admin/carousel-requests',
    icon: <Layers className="h-5 w-5" />
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart className="h-5 w-5" />
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  
  useEffect(() => {
    // Check for dark mode preference
    const darkModePreference = localStorage.getItem('adminDarkMode') === 'true';
    setIsDarkMode(darkModePreference);
    
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    }
    
    // Load admin user data
    const storedUser = localStorage.getItem("admin-user");
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
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
    // Remove admin auth token
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin-user');
    
    toast({
      title: "Logged out",
      description: "Successfully logged out of admin panel",
    });
    
    // Redirect to login page
    navigate('/admin/login');
  };
  
  // Function to get the active page title
  const getActivePageTitle = () => {
    const active = sidebarItems.find(item => item.href === location.pathname);
    return active ? active.title : 'Admin Dashboard';
  };
  
  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar - desktop */}
      <div className="hidden md:flex md:w-72 md:flex-col">
        <div className={`flex flex-col flex-grow pt-5 overflow-y-auto border-r shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center flex-shrink-0 px-6">
            <Link to="/admin" className="flex items-center space-x-2">
              <BrandOutLogotype className="h-8" />
            </Link>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    item.href === location.pathname
                      ? `${isDarkMode ? 'bg-primary/30 text-primary' : 'bg-primary/10 text-primary'} border-l-4 border-primary font-medium`
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-primary' : 'text-gray-700 hover:bg-primary/5 hover:text-primary'}`,
                    "group rounded-md py-3 px-4 flex items-center text-sm transition-all duration-200"
                  )}
                >
                  <div
                    className={cn(
                      item.href === location.pathname
                        ? `${isDarkMode ? 'text-primary' : 'text-primary'}`
                        : `${isDarkMode ? 'text-gray-400 group-hover:text-primary' : 'text-gray-500 group-hover:text-primary'}`,
                      "mr-3 flex-shrink-0"
                    )}
                  >
                    {item.icon}
                  </div>
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className={`flex-shrink-0 rounded-lg mx-4 mb-4 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <Avatar>
                    <AvatarImage src="/admin-avatar.png" alt="Admin" />
                    <AvatarFallback className="bg-primary text-white">AD</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {adminUser?.firstName || 'Admin'} {adminUser?.lastName || 'User'}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {adminUser?.email || 'admin@example.com'}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-500 hover:text-primary'}`}
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/50' : 'bg-white/80'} backdrop-blur-sm`} onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              className={`fixed top-0 left-0 w-full max-w-xs h-full overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              initial={{ translateX: "-100%" }}
              animate={{ translateX: 0 }}
              exit={{ translateX: "-100%" }}
              transition={{ duration: 0.2 }}
            >
              <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <div className="flex items-center space-x-2">
                  <BrandOutLogotype className="h-7" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className={isDarkMode ? 'text-gray-300' : ''}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      item.href === location.pathname
                        ? `${isDarkMode ? 'bg-primary/30 text-primary' : 'bg-primary/10 text-primary'} border-l-4 border-primary font-medium`
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-primary' : 'text-gray-700 hover:bg-primary/5 hover:text-primary'}`,
                      "group rounded-md py-3 px-4 flex items-center text-sm transition-all duration-200"
                    )}
                  >
                    <div
                      className={cn(
                        item.href === location.pathname
                          ? `${isDarkMode ? 'text-primary' : 'text-primary'}`
                          : `${isDarkMode ? 'text-gray-400 group-hover:text-primary' : 'text-gray-500 group-hover:text-primary'}`,
                        "mr-3 flex-shrink-0"
                      )}
                    >
                      {item.icon}
                    </div>
                    {item.title}
                  </Link>
                ))}
              </nav>
              <div className={`mx-4 rounded-lg p-4 my-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="/admin-avatar.png" alt="Admin" />
                    <AvatarFallback className="bg-primary text-white">AD</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminUser?.firstName || 'Admin'} {adminUser?.lastName || 'User'}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {adminUser?.email || 'admin@example.com'}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-500 hover:text-primary'}`}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header bar */}
        <header className={`w-full shadow-sm border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Left side with menu and title */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`md:hidden ${isDarkMode ? 'text-primary' : 'text-primary'}`} 
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className={`text-xl font-bold hidden sm:block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {getActivePageTitle()}
              </h1>
            </div>
            
            {/* Right side with search, theme toggle, and notifications */}
            <div className="flex items-center space-x-4">
              <div className="relative w-full max-w-xs hidden sm:block">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <Input 
                  placeholder="Search..." 
                  className={`pl-10 h-9 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-primary' : 'bg-gray-50 border-gray-200 focus:border-primary'}`}
                />
              </div>
              
              {/* Theme toggle button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className={isDarkMode ? 'text-yellow-300' : 'text-primary'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={`relative ${isDarkMode ? 'text-primary' : 'text-primary'}`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full h-8 w-8 ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}
                  >
                    <User className={`h-4 w-4 ${isDarkMode ? 'text-primary' : 'text-primary'}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className={`w-56 ${isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : ''}`}
                >
                  <DropdownMenuLabel className={isDarkMode ? 'text-gray-300' : ''}>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
                  <DropdownMenuItem className={isDarkMode ? 'hover:bg-gray-700 hover:text-white' : ''}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className={isDarkMode ? 'hover:bg-gray-700 hover:text-white' : ''}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className={`flex-1 relative overflow-y-auto focus:outline-none ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50'}`}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 