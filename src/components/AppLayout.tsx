import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { BrandOutLogo } from './BrandOutLogo';

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
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Single Collapsible sidebar instance */}
      <CollapsibleSidebar />
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => {
            setSidebarOpen(false);
            localStorage.setItem('sidebarExpanded', 'false');
          }}
        />
      )}
      
      {/* Main content area */}
      <div className={cn("flex-1 flex flex-col min-h-screen w-full transition-all duration-300", contentMargin)}>
        {/* Top header bar */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                {user?.firstName ? `${user.firstName}'s Dashboard` : 'BrandOut Dashboard'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 w-full">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 