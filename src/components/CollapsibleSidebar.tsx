import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LogOut, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
}

interface CollapsibleSidebarProps {
  isOpen: boolean;
  isFixed?: boolean;
  onClose: () => void;
}

export function CollapsibleSidebar({ isOpen, isFixed = false, onClose }: CollapsibleSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

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

  // For fixed desktop sidebar, render without animation wrapper
  if (isFixed) {
    return (
      <div className="flex flex-col h-full border-r shadow-md bg-white w-[250px]">
        {/* Sidebar Header */}
        <div className="flex justify-between items-center h-16 px-4 border-b">
          <Link to="/dashboard" className="flex items-center">
            <img
              src="/logo.svg"
              alt="LinkedIn Carousel"
              className="h-7 mr-2"
            />
            <span className="font-bold text-sm">Carousel Builder</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center h-12 px-4 rounded-md text-sm font-medium transition-colors",
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
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.profilePicture} alt={user.firstName} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                // You would implement actual logout functionality here
                console.log('Logging out...');
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  // For mobile, use animated slide-in from right
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="flex flex-col h-full border-l shadow-lg bg-white w-[250px]"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Sidebar Header */}
          <div className="flex justify-between items-center h-16 px-4 border-b">
            <Link to="/dashboard" className="flex items-center">
              <img
                src="/logo.svg"
                alt="LinkedIn Carousel"
                className="h-7 mr-2"
              />
              <span className="font-bold text-sm">Carousel Builder</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto hover:bg-red-50"
            >
              <X size={18} className="text-red-500" />
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="flex flex-col gap-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center h-12 px-4 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={onClose}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* User Section */}
          {user && (
            <div className="p-4 border-t mt-auto">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={user.profilePicture} alt={user.firstName} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  // You would implement actual logout functionality here
                  console.log('Logging out...');
                  onClose();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 