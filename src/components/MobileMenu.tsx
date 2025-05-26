import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, LayoutDashboard, PlusCircle, BookOpen, BarChart3, Settings, Bell, LogOut, 
  Home, FileText, Upload, LayoutGrid, Search, CreditCard, MessageSquare, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BrandOutIcon, BrandOutLogotype } from '@/components/BrandOutIcon';
import { Badge } from '@/components/ui/badge';
import { usePostCount } from '@/components/CollapsibleSidebar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { totalPostCount } = usePostCount();
  
  const navItems = [
    { title: 'Home', icon: <Home size={20} />, path: '/dashboard/home' },
    { title: 'Create Post', icon: <PlusCircle size={20} />, path: '/dashboard/post' },
    { title: 'Post Library', icon: <FileText size={20} />, path: '/dashboard/posts', badge: totalPostCount },
    { title: 'Request Carousel', icon: <Upload size={20} />, path: '/dashboard/request-carousel' },
    { title: 'My Carousels', icon: <LayoutGrid size={20} />, path: '/dashboard/my-carousels' },
    { title: 'Scraper', icon: <Search size={20} />, path: '/dashboard/scraper' },
    { title: 'Billing', icon: <CreditCard size={20} />, path: '/dashboard/billing' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
    { isSeparator: true, title: 'Coming Soon' },
    { title: 'AI Writer', icon: <MessageSquare size={20} />, path: '/dashboard/ai', disabled: true },
    { title: 'Analytics', icon: <BarChart3 size={20} />, path: '/dashboard/analytics', disabled: true },
    { title: 'Inspiration Vault', icon: <Lightbulb size={20} />, path: '/dashboard/inspiration', disabled: true },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-lg z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <BrandOutLogotype className="h-8" />
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500">
                <X size={24} />
              </Button>
            </div>
            
            {/* User info section */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold text-lg">
                  {user?.firstName ? user.firstName.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="font-medium">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user?.email || ''}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation links */}
            <nav className="p-4 space-y-1">
              {navItems.map((item, index) => (
                item.isSeparator ? (
                  <div key={index} className="text-gray-400 font-semibold text-sm pt-4 pb-2 px-3">
                    {item.title}
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={item.disabled ? '#' : item.path}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                      } else {
                        onClose();
                      }
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-600'
                        : item.disabled 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant="outline" 
                        className="ml-auto bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              ))}
            </nav>
            
            {/* Actions */}
            <div className="p-4 border-t mt-auto">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-gray-700 hover:text-gray-900"
                >
                  <Bell size={18} className="mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="justify-start text-gray-700 hover:text-gray-900"
                >
                  <LogOut size={18} className="mr-2" />
                  Sign out
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 