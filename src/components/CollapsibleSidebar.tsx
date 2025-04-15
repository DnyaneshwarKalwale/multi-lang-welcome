import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, FileText, BookOpen, Settings, Users, 
  PlusCircle, BarChart3, Linkedin, 
  LogOut, Bell, MessageSquare, Lightbulb,
  Heart, BookMarked, CreditCard, LayoutGrid,
  Search, Upload, Headphones, Youtube, Server,
  Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { BrandOutIcon } from './BrandOutIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: {
    count: number;
    variant: 'default' | 'outline' | 'primary' | 'secondary';
  };
}

export function CollapsibleSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Monitor window resize
  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isSmallScreen);
      
      // Only expanded on desktop (always)
      if (!isSmallScreen) {
        setExpanded(true);
        setIsOpen(true);
      } else {
        setExpanded(true);
        setIsOpen(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isOpen]);
  
  const navItems: NavItem[] = [
    { title: 'Home', icon: Home, path: '/dashboard/home' },
    { title: 'Create Post', icon: PlusCircle, path: '/dashboard/post' },
    { title: 'Post Library', icon: FileText, path: '/dashboard/posts', badge: { count: 3, variant: 'primary' } },
    { title: 'Request Carousel', icon: Upload, path: '/dashboard/request-carousel' },
    { title: 'My Carousels', icon: LayoutGrid, path: '/dashboard/my-carousels' },
    { title: 'Team', icon: Users, path: '/dashboard/team' },
    { title: 'Scraper', icon: Search, path: '/dashboard/scraper' },
    { title: 'Inspiration Vault', icon: Lightbulb, path: '/dashboard/inspiration' },
    { title: 'AI Writer', icon: MessageSquare, path: '/dashboard/ai' },
    { title: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { title: 'Settings', icon: Settings, path: '/dashboard/settings' },
    { title: 'Billing', icon: CreditCard, path: '/dashboard/billing' },
  ];
  
  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };
  
  // For desktop - always show the full sidebar
  // For mobile - render a hamburger menu and show sidebar only when opened
  
  // Mobile sidebar with hamburger button
  if (isMobile) {
    return (
      <>
        {/* Hamburger Menu Button */}
        <button 
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md border border-gray-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      
        {/* Sidebar Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={sidebarRef}
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 z-50 h-screen w-64 flex flex-col border-r border-gray-200 bg-white shadow-lg"
            >
              {/* Sidebar Header */}
              <div className="flex h-16 items-center px-4 py-3 w-full justify-between">
                <div className="flex items-center gap-2">
                  <BrandOutIcon className="w-8 h-8" />
                  <span className="font-semibold text-gray-900">BrandOut</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-500">
                  <X size={20} />
                </button>
              </div>
    
              {/* Navigation Menu */}
              <div className="flex-1 w-full overflow-y-auto">
                <div className="mt-2 flex flex-col gap-1 w-full px-3 py-2">
                  {navItems.map((item, index) => (
                    <NavLink
                      key={index}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full',
                        isActive 
                          ? 'bg-primary-50 text-primary' 
                          : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium flex-1 whitespace-nowrap">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          className="ml-auto bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-xs"
                        >
                          {item.badge.count}
                        </Badge>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
              
              {/* User Profile Section */}
              <div className="mt-auto border-t border-gray-200 p-3 w-full flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-gray-200">
                  <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 overflow-hidden">
                  <div className="truncate text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {user?.email}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 rounded-full ml-auto"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
  
  // Desktop sidebar - always expanded with full text
  return (
    <div
      className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col border-r border-gray-200 bg-white shadow-sm"
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center px-4 py-3 w-full">
        <div className="flex items-center gap-2 overflow-hidden">
          <BrandOutIcon className="w-8 h-8" />
          <span className="font-semibold text-gray-900">BrandOut</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 w-full overflow-y-auto">
        <div className="mt-2 flex flex-col gap-1 w-full px-3 py-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full',
                isActive 
                  ? 'bg-primary-50 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium flex-1 whitespace-nowrap">{item.title}</span>
              {item.badge && (
                <Badge 
                  variant="outline" 
                  className="ml-auto bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-xs"
                >
                  {item.badge.count}
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className="mt-auto border-t border-gray-200 p-3 w-full flex items-center gap-3">
        <Avatar className="h-9 w-9 border border-gray-200">
          <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || 'User'} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 overflow-hidden">
          <div className="truncate text-sm font-medium text-gray-900">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="truncate text-xs text-gray-500">
            {user?.email}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700 rounded-full ml-auto"
          onClick={logout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
} 