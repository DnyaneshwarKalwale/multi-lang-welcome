import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Settings, Users, FileText, LogOut, Sparkles, Stars, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/team-workspace', icon: <Users className="h-5 w-5" />, label: 'Workspace' },
    { path: '/language-selection', icon: <FileText className="h-5 w-5" />, label: 'Content' },
    { path: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' }
  ];

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden rounded-full w-10 h-10"
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={closeMenu}>
          <motion.div 
            className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-xl p-6 overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating decorative icons */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div 
                className="absolute top-[15%] left-[10%] text-primary-400/10 dark:text-primary-400/5"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles size={30} />
              </motion.div>
              
              <motion.div 
                className="absolute bottom-[20%] left-[20%] text-violet-400/10 dark:text-violet-400/5"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Stars size={40} />
              </motion.div>
              
              <motion.div 
                className="absolute top-[40%] right-[10%] text-amber-400/10 dark:text-amber-400/5"
                animate={{ 
                  x: [0, 10, 0],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 12, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                <Zap size={25} />
              </motion.div>
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-xl font-bold text-gradient">Dekcion</h2>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={closeMenu}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {isAuthenticated && (
              <nav className="space-y-2 mb-8 relative z-10">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path) 
                          ? 'bg-primary-100/80 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800/70'
                      }`}
                      onClick={closeMenu}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      {isActive(item.path) && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            )}

            <div className="absolute bottom-8 left-0 right-0 px-6 z-10">
              {isAuthenticated ? (
                <Button 
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/registration" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">Sign Up</Button>
                  </Link>
                  <Link to="/" onClick={closeMenu}>
                    <Button className="w-full">Login</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
