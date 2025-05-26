import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import NotificationBell from '@/components/NotificationBell';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileMenu from './MobileMenu';

interface AppLayoutProps {
  children?: React.ReactNode;
}

/**
 * AppLayout component that includes a collapsible sidebar and renders children or Outlet
 * This serves as a wrapper for protected routes to ensure consistent navigation
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Monitor window resize to determine if mobile view
  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 1024;
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

  // Ensure the sidebar is closed when navigating on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
    
    // Close mobile menu on navigation
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [location]);  // Use location from react-router to detect navigation changes

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Sidebar - CollapsibleSidebar handles responsive behavior internally */}
      <CollapsibleSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

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
            <NotificationBell />
            
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
            
            {/* Hamburger Menu Button - Only visible on mobile/tablet */}
            <div className="lg:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(true)}
                className="h-9 w-9 rounded-full hover:bg-blue-100"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto hide-scrollbar">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 