import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, User, Settings, FileText, BookOpen, Users, 
  Zap, Calendar, BarChart3, Linkedin, ChevronLeft, 
  Menu, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { LovableLogo } from './LovableLogo';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: {
    text: string | number;
    variant: 'default' | 'outline' | 'primary' | 'secondary';
  };
}

export function CollapsibleSidebar() {
  const [expanded, setExpanded] = useState(true);
  const { user, logout } = useAuth();
  
  const navItems: NavItem[] = [
    { title: 'Dashboard', icon: Home, path: '/dashboard' },
    { title: 'Content Generator', icon: Zap, path: '/content-generator' },
    { title: 'My Posts', icon: FileText, path: '/my-posts' },
    { title: 'Calendar', icon: Calendar, path: '/calendar' },
    { title: 'Analytics', icon: BarChart3, path: '/analytics' },
    { title: 'Connections', icon: Users, path: '/connections' },
    { title: 'Learning Hub', icon: BookOpen, path: '/learning-hub' },
    { title: 'Settings', icon: Settings, path: '/settings' },
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
        
        {expanded && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        
        {!expanded && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full h-8 w-8">
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className={cn(
        'mt-2 flex flex-col gap-1 w-full px-3 py-2 overflow-hidden',
        !expanded && 'items-center'
      )}>
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
              isActive 
                ? 'bg-primary text-white hover:bg-primary/90' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
              !expanded && 'justify-center px-2'
            )}
          >
            <item.icon className="h-5 w-5" />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium"
                >
                  {item.title}
                </motion.span>
              )}
            </AnimatePresence>
            {expanded && item.badge && (
              <span className={cn(
                'ml-auto rounded-full px-2 py-0.5 text-xs font-medium',
                item.badge.variant === 'primary' && 'bg-primary/10 text-primary',
                item.badge.variant === 'secondary' && 'bg-secondary/10 text-secondary',
                item.badge.variant === 'default' && 'bg-gray-100 text-gray-600',
                item.badge.variant === 'outline' && 'border border-gray-200 text-gray-600'
              )}>
                {item.badge.text}
              </span>
            )}
          </NavLink>
        ))}
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
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
} 