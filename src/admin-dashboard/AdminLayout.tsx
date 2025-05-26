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
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className={`h-16 flex items-center justify-between px-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/admin" className="flex items-center">
              <BrandOutIcon className="h-8 w-8" />
            </Link>
            <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {getActivePageTitle()}
            </h1>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className={`relative rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <Input
                type="search"
                placeholder="Search..."
                className={`block w-72 pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-700 placeholder:text-gray-500'} border-none focus-visible:ring-1 focus-visible:ring-primary`}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun size={20} /> : <MoonStar size={20} />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Bell size={20} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'} rounded-full`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/admin-avatar.png" alt="Admin" />
                    <AvatarFallback className="bg-primary text-white">AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">
                    {adminUser?.firstName || 'Admin'}
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : ''}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Page content */}
        <main className={`flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 