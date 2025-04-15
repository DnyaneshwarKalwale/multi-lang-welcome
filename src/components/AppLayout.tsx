import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children?: React.ReactNode;
}

/**
 * AppLayout component that includes a collapsible sidebar and renders children or Outlet
 * This serves as a wrapper for protected routes to ensure consistent navigation
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(localStorage.getItem('sidebarExpanded') !== 'false');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { user } = useAuth();

  // Listen for changes to localStorage sidebarExpanded
  useEffect(() => {
    const handleStorageChange = () => {
      const isExpanded = localStorage.getItem('sidebarExpanded') !== 'false';
      setSidebarOpen(isExpanded);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check every 500ms in case localStorage is updated without triggering storage event
    const interval = setInterval(handleStorageChange, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Monitor window resize to determine if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        localStorage.setItem('sidebarExpanded', 'false');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  // Content margin changes based on sidebar state and screen size
  const contentMargin = !isMobile && sidebarOpen ? 'lg:ml-[240px]' : !isMobile ? 'lg:ml-[72px]' : 'ml-0';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar container with fixed positioning and high z-index */}
      <div className="fixed top-0 left-0 z-50 h-full">
        <CollapsibleSidebar />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setSidebarOpen(false);
            localStorage.setItem('sidebarExpanded', 'false');
          }}
        />
      )}
      
      {/* Main content area with proper margin and wrapping */}
      <div className={cn("flex flex-col flex-1 h-screen w-full transition-all duration-300", contentMargin)}>
        {/* Top header bar */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 bg-blue-50 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {user?.firstName ? `Welcome, ${user.firstName}!` : 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-blue-100">
              <Bell size={20} className="text-blue-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-white text-[10px] flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="md:flex">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="cursor-pointer"
              >
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-blue-200 shadow-sm">
                  <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
          </div>
        </header>
        
        {/* Main scrollable content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 min-h-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 