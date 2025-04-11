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
import { LovableLogo } from './LovableLogo';
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
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Share expanded state with parent via localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', expanded.toString());
  }, [expanded]);
  
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
    setExpanded(!expanded);
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
  
  return (
    <motion.div
      variants={sidebarVariants}
      initial={expanded ? 'expanded' : 'collapsed'}
      animate={expanded ? 'expanded' : 'collapsed'}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800',
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
              <LovableLogo variant="icon" size="sm" className="w-8 h-8 text-primary" />
              <span className="font-semibold text-gray-900 dark:text-white">Lovable</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="rounded-full h-8 w-8 hidden lg:flex"
        >
          {expanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                  ? 'bg-primary-50 text-primary dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
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
        'mt-auto border-t border-gray-200 dark:border-gray-800 p-3 w-full',
        expanded ? 'flex items-center gap-3' : 'flex flex-col items-center gap-3'
      )}>
        <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
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
              <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full',
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