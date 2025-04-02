import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import MobileMenu from '@/components/MobileMenu';
import { ScripeIcon } from '@/components/ScripeIcon';
import { LogOut } from 'lucide-react';
import { LoginSheet } from '@/components/LoginSheet';
import { RegistrationSheet } from '@/components/RegistrationSheet';

const CustomNavbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);
  const [registrationSheetOpen, setRegistrationSheetOpen] = useState(false);

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

  const handleSignIn = () => {
    setLoginSheetOpen(true);
  };

  const handleSignUp = () => {
    setRegistrationSheetOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
              <ScripeIcon className="h-8 w-8" />
              <span className="text-xl font-bold">Scripe</span>
            </Link>
            
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center ml-8 space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
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
                  <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-semibold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden xl:inline">
                    {user?.firstName || 'User'}
                  </span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleSignIn}>Sign in</Button>
                <Button size="sm" onClick={handleSignUp}>Sign up</Button>
              </div>
            )}
            
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Login Sheet */}
      <LoginSheet 
        open={loginSheetOpen} 
        onOpenChange={setLoginSheetOpen}
      />

      {/* Registration Sheet */}
      <RegistrationSheet 
        open={registrationSheetOpen} 
        onOpenChange={setRegistrationSheetOpen}
      />
    </>
  );
};

export default CustomNavbar;
