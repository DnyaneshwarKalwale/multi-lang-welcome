
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import MobileMenu from '@/components/MobileMenu';
import { DekcionIcon } from '@/components/ScripeIcon';
import { LogOut, Sparkles, Stars, MessageCircle, Bell, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import TeamInvitationNotification from '@/components/TeamInvitationNotification';

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
    <motion.header 
      className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-primary-100/30 dark:border-gray-800/50 transition-colors duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container relative flex h-16 items-center justify-between px-4 overflow-hidden">
        {/* Floating icons decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1 left-[20%] text-primary-400/20 dark:text-primary-400/10"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles size={16} />
          </motion.div>
          <motion.div 
            className="absolute bottom-1 left-[60%] text-violet-400/20 dark:text-violet-400/10"
            animate={{ 
              y: [0, 8, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Stars size={14} />
          </motion.div>
          <motion.div 
            className="absolute top-3 right-[30%] text-cyan-400/10 dark:text-cyan-400/5"
            animate={{ 
              y: [0, -6, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <MessageCircle size={18} />
          </motion.div>
          <motion.div 
            className="absolute bottom-2 right-[15%] text-amber-400/15 dark:text-amber-400/10"
            animate={{ 
              y: [0, 5, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          >
            <Zap size={12} />
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
            <DekcionIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Dekcion</span>
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
          <ThemeToggle variant="minimal" />
          
          {isAuthenticated && <TeamInvitationNotification />}
          
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-4">
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white font-semibold shadow-sm"
                >
                  {user?.firstName ? user.firstName.charAt(0) : 'U'}
                </motion.div>
              </motion.div>
              
              <span className="text-sm font-medium hidden xl:inline text-gray-800 dark:text-gray-200">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
              </span>
              
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
                <Button size="sm" className="bg-gradient-to-r from-primary-500 to-violet-500 hover:from-primary-600 hover:to-violet-600 text-white shadow-sm">Sign up</Button>
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
