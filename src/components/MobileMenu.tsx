
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Settings, Users, FileText, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout, isAuthenticated } = useContext(AuthContext);

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
          <div 
            className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-xl p-6 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gradient">Scripe</h2>
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
              <nav className="space-y-2 mb-8">
                {menuItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path) 
                        ? 'bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            )}

            <div className="absolute bottom-8 left-0 right-0 px-6">
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
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
