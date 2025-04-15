import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LogOut, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { BrandOutIcon } from './BrandOutIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
}

export function CollapsibleSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Get the sidebar state from localStorage
  const initialExpanded = localStorage.getItem('sidebarExpanded') !== 'false';
  const [expanded, setExpanded] = useState(initialExpanded);

  // Toggle the sidebar expanded state
  const toggleSidebar = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    localStorage.setItem('sidebarExpanded', String(newExpanded));
    
    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Templates',
      href: '/templates',
    },
    {
      label: 'My Carousels',
      href: '/my-carousels',
    },
    {
      label: 'Analytics',
      href: '/analytics',
    },
    {
      label: 'Settings',
      href: '/settings',
    }
  ];

  return (
    <motion.div
      className={cn(
        "flex flex-col h-full transition-all duration-300 border-r shadow-md bg-white",
        expanded ? "w-[180px]" : "w-0"
      )}
      animate={{ width: expanded ? '180px' : '0px' }}
      initial={{ width: expanded ? '180px' : '0px' }}
      transition={{ duration: 0.3 }}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center h-16 px-3 border-b">
        {expanded && (
          <>
            <Link to="/dashboard" className="flex items-center">
              <img
                src="/logo.svg"
                alt="LinkedIn Carousel"
                className="h-7 mr-2"
              />
              <span className="font-bold text-xs">Carousel Builder</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="ml-auto"
            >
              <X size={18} />
            </Button>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center h-9 px-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Section */}
      {user && (
        <div className="p-3 border-t mt-auto">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user.profilePicture} alt={user.firstName} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            {expanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
          {expanded && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                // You would implement actual logout functionality here
                console.log('Logging out...');
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
} 