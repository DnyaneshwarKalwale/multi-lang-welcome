
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import MobileMenu from '@/components/MobileMenu';
import { ScripeIcon } from '@/components/ScripeIcon';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/team-workspace', label: 'Workspace' },
    { path: '/language-selection', label: 'Content' },
  ];
  
  // Don't show navbar on welcome, login or registration pages
  if (location.pathname === '/' || location.pathname === '/registration') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-primary-100/30 dark:border-gray-800/50 transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
            <ScripeIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Scripe</span>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center ml-8 space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 
                    ${isActive(item.path) 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white font-semibold shadow-sm"
                >
                  {user?.firstName ? user.firstName.charAt(0) : 'U'}
                </motion.div>
                <span className="text-sm font-medium hidden xl:inline text-gray-800 dark:text-gray-200">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 group"
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-primary-200 dark:border-gray-700 text-primary-700 dark:text-primary-400 hover:border-primary-500 dark:hover:border-primary-600">Sign in</Button>
              </Link>
              <Link to="/registration">
                <Button size="sm" variant="gradient" className="shadow-sm">Sign up</Button>
              </Link>
            </div>
          )}
          
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default CustomNavbar;
