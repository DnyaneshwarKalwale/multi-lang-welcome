import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Bell, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

interface AppLayoutProps {
  children?: React.ReactNode;
}

/**
 * AppLayout component that includes a collapsible sidebar and renders children or Outlet
 * This serves as a wrapper for protected routes to ensure consistent navigation
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [initialLoad, setInitialLoad] = useState(true);
  const { user } = useAuth();

  // Set initial sidebar state based on screen size
  useEffect(() => {
    if (initialLoad) {
      const isDesktop = window.innerWidth >= 1024;
      setSidebarOpen(isDesktop);
      setInitialLoad(false);
    }
  }, [initialLoad]);

  // Monitor window resize to determine if mobile view
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      setIsMobile(newIsMobile);
      
      // Auto-close sidebar on mobile view
      if (newIsMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
      
      // Auto-open sidebar when switching to desktop
      if (!newIsMobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Save sidebar state to localStorage
  useEffect(() => {
    if (!initialLoad) {
      localStorage.setItem('sidebarExpanded', sidebarOpen.toString());
    }
  }, [sidebarOpen, initialLoad]);

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  // Setup swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (isMobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    },
    onSwipedLeft: () => {
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    },
    trackMouse: false,
    delta: 10,
  });

  // Content margin changes based on sidebar state and screen size
  const contentMargin = !isMobile && sidebarOpen ? 'lg:ml-[240px]' : !isMobile ? 'lg:ml-[72px]' : 'ml-0';

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Collapsible sidebar with AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-40 w-[240px]"
            >
              <CollapsibleSidebar expanded={true} />
            </motion.div>
            
            {/* Overlay for mobile when sidebar is open */}
            {isMobile && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </>
        )}
      </AnimatePresence>
      
      {/* Main content area with swipe capability on mobile */}
      <div 
        {...swipeHandlers}
        className={cn("flex-1 flex flex-col min-h-screen w-full transition-all duration-300", contentMargin)}
      >
        {/* Top header bar */}
        <header className="h-14 sm:h-16 border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 bg-purple-50 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-full p-2"
            >
              {sidebarOpen ? 
                <ChevronLeft className="h-5 w-5" /> : 
                <Menu className="h-5 w-5" />
              }
            </Button>
            
            <h1 className="text-sm sm:text-xl font-semibold text-gray-900 truncate max-w-[150px] sm:max-w-none">
              {user?.firstName ? `Welcome, ${user.firstName}!` : 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" className="rounded-full relative hover:bg-purple-100 p-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-white text-[10px] flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="cursor-pointer"
              >
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-purple-200 shadow-sm">
                  <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-xs sm:text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
          </div>
        </header>
        
        {/* Main content with improved padding for mobile */}
        <main className="flex-1 p-3 sm:p-6 overflow-auto">
          <div className="max-w-full sm:max-w-[95%] mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 