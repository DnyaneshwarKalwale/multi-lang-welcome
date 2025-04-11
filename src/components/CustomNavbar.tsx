import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/MobileMenu';
import { LogOut, Bell, BarChart3, PlusCircle, BookOpen, Settings, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import TeamInvitationNotification from '@/components/TeamInvitationNotification';
import { BrandOutLogo } from '@/components/BrandOutLogo';

const CustomNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={16} className="mr-1" /> },
    { path: '/create-post', label: 'Create', icon: <PlusCircle size={16} className="mr-1" /> },
    { path: '/post-library', label: 'Library', icon: <BookOpen size={16} className="mr-1" /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={16} className="mr-1" /> },
  ];
  
  // Don't show navbar on welcome, login or registration pages
  if (location.pathname === '/' || location.pathname === '/registration') {
    return null;
  }

  return (
    <motion.header 
      className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-primary-100/30 transition-colors duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container relative flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="transition-transform hover:scale-[1.02]">
            <BrandOutLogo variant="full" size="md" />
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center ml-8 space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center
                    ${isActive(item.path) 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-neutral-dark hover:bg-gray-100 hover:text-primary-600'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated && <TeamInvitationNotification />}
          
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-neutral-medium hover:text-primary bg-transparent hover:bg-primary-50"
              >
                <Bell size={18} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="text-neutral-medium hover:text-primary bg-transparent hover:bg-primary-50"
              >
                <Settings size={18} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="text-neutral-medium hover:text-primary bg-transparent hover:bg-primary-50"
              >
                <Users size={18} />
              </Button>
              
              <div className="h-6 w-px bg-neutral-light mx-1"></div>
              
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold shadow-sm"
                >
                  {user?.firstName ? user.firstName.charAt(0) : 'U'}
                </motion.div>
              </motion.div>
              
              <span className="text-sm font-medium hidden xl:inline text-neutral-dark">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
              </span>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-neutral-medium hover:text-neutral-dark group"
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-primary-200 text-primary-700 hover:border-primary-500">Sign in</Button>
              </Link>
              <Link to="/registration">
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-600 hover:to-primary-light text-white shadow-sm">Sign up</Button>
              </Link>
            </div>
          )}
          
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
};

export default CustomNavbar;
