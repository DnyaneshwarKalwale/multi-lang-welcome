import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogIn, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { LovableLogo } from '@/components/LovableLogo';
import { LoginSheet } from '@/components/LoginSheet';
import { RegistrationSheet } from '@/components/RegistrationSheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { motion } from 'framer-motion';

export function CustomNavbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { t } = useLanguage();
  
  // Track scroll position to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-purple-50 shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <LovableLogo variant="full" size="md" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/features" className="px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
            About
          </Link>
          <LanguageSwitcher />
        </nav>
        
        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <Button onClick={() => navigate('/dashboard/home')} className="gap-2">
              <User className="h-4 w-4" />
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setLoginOpen(true)}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t('login') || 'Login'}
              </Button>
              <Button 
                onClick={() => setRegisterOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {t('getStarted') || 'Get Started'}
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="mb-8 mt-4">
                <LovableLogo variant="full" size="md" />
              </div>
              <nav className="flex flex-col space-y-4">
                <Link to="/features" className="px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                  Features
                </Link>
                <Link to="/pricing" className="px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                  Pricing
                </Link>
                <Link to="/about" className="px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                  About
                </Link>
                <div className="px-3 pt-4 flex items-center">
                  <LanguageSwitcher />
                </div>
              </nav>
              <div className="mt-auto mb-8 space-y-3">
                {user ? (
                  <Button onClick={() => navigate('/dashboard/home')} className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setLoginOpen(true)}
                      className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      {t('login') || 'Login'}
                    </Button>
                    <Button 
                      onClick={() => setRegisterOpen(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {t('getStarted') || 'Get Started'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Login Sheet */}
      <LoginSheet open={loginOpen} onOpenChange={setLoginOpen} />
      
      {/* Registration Sheet */}
      <RegistrationSheet open={registerOpen} onOpenChange={setRegisterOpen} />
    </header>
  );
}
