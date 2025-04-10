
import React from 'react';
import AppLayout from './AppLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <AppLayout>{children}</AppLayout>;
};
