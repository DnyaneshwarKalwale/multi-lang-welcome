import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomNavbar from '@/components/CustomNavbar';

interface AppLayoutProps {
  children?: React.ReactNode;
}

/**
 * AppLayout component that includes the CustomNavbar and renders children or Outlet
 * This serves as a wrapper for protected routes to ensure consistent navigation
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomNavbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AppLayout; 