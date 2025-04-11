import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, FileText, BookOpen, Settings, Users, 
  PlusCircle, BarChart3, Linkedin, ChevronLeft, 
  LogOut, Menu, Bell, MessageSquare, Lightbulb,
  Heart, BookMarked, CreditCard, LayoutGrid,
  Search, Upload, Headphones, Youtube, Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { BrandOutLogo } from './BrandOutLogo';
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
  const [expanded, setExpanded] = useState(localStorage.getItem('sidebarExpanded') !== 'false');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Listen for changes to localStorage sidebarExpanded
  useEffect(() => {
    const handleStorageChange = () => {
      const isExpanded = localStorage.getItem('sidebarExpanded') !== 'false';
      setExpanded(isExpanded);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check every 500ms in case localStorage is updated without triggering storage event
    const interval = setInterval(handleStorageChange, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  // Monitor window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setExpanded(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  
  const toggleSidebar = () => {
    const newState = !expanded;
    setExpanded(newState);
    localStorage.setItem('sidebarExpanded', newState.toString());
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };
  
  const sidebarVariants = {
    expanded: {
      width: '240px',
      transition: {
        duration: 0.3,
        type: 'spring',
        stiffness: 200,
        damping: 25
      }
    },
    collapsed: {
      width: '72px',
      transition: {
        duration: 0.3,
        type: 'spring',
        stiffness: 200,
        damping: 25
      }
    }
  };
  
  // Hide sidebar completely on mobile if not expanded
  if (isMobile && !expanded) {
    return null;
  }
  
  return (
    <motion.div
      variants={sidebarVariants}
      initial={expanded ? 'expanded' : 'collapsed'}
      animate={expanded ? 'expanded' : 'collapsed'}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-gray-200 bg-white',
        expanded ? 'items-start' : 'items-center'
      )}
    >
      {/* Sidebar Header */}
      <div className={cn(
        'flex h-16 items-center px-4 py-3 w-full',
        expanded ? 'justify-between' : 'justify-center'
      )}>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <BrandOutLogo variant="icon" size="sm" className="w-8 h-8" showText={false} />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">BrandOut</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="rounded-full h-8 w-8 hidden lg:flex"
        >
          {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5 rotate-180" />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 w-full overflow-y-auto">
        <div className={cn(
          'mt-2 flex flex-col gap-1 w-full px-3 py-2',
          !expanded && 'items-center'
        )}>
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                isActive 
                  ? 'bg-primary-50 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100',
                !expanded && 'justify-center px-2',
                expanded ? 'w-full' : 'w-auto'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium flex-1 whitespace-nowrap"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && (
                expanded ? (
                  <Badge 
                    variant="outline" 
                    className="ml-auto bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-xs"
                  >
                    {item.badge.count}
                  </Badge>
                ) : (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center">
                    {item.badge.count}
                  </span>
                )
              )}
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className={cn(
        'mt-auto border-t border-gray-200 p-3 w-full',
        expanded ? 'flex items-center gap-3' : 'flex flex-col items-center gap-3'
      )}>
        <Avatar className="h-9 w-9 border border-gray-200">
          <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || 'User'} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 overflow-hidden"
            >
              <div className="truncate text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="truncate text-xs text-gray-500">
                {user?.email}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'text-gray-500 hover:text-gray-700 rounded-full',
            expanded ? 'ml-auto' : 'mt-3'
          )}
          onClick={logout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
} 