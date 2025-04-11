import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Bell } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  // Content margin changes based on sidebar state
  const contentMargin = sidebarOpen ? 'ml-[240px]' : 'ml-[72px]';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Collapsible sidebar */}
      <CollapsibleSidebar />
      
      {/* Main content area */}
      <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300", contentMargin)}>
        {/* Top header bar */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-gray-900 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-full lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.firstName ? `Welcome, ${user.firstName}!` : 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="hidden md:flex">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="cursor-pointer"
              >
                <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
                  <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 