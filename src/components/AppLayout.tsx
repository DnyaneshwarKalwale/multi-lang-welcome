import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu, X } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Monitor window resize to determine if mobile view
  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isSmallScreen);
      
      // Close sidebar on resize to mobile
      if (isSmallScreen && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Sidebar - CollapsibleSidebar handles responsive behavior internally */}
      <CollapsibleSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content container with proper margin */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen w-full transition-all duration-300",
        isMobile ? "ml-0" : "ml-64" // Fixed margin for desktop to prevent content going under sidebar
      )}>
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
            
            <div className="flex items-center">
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
            
            {/* Hamburger menu button - visible only on mobile/tablet */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 text-gray-600 hover:bg-blue-100"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            )}
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 