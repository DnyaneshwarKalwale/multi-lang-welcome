
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginSheet } from '@/components/LoginSheet';
import { RegistrationSheet } from '@/components/RegistrationSheet';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScripeLogotype, ScripeIconRounded } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { Twitter, ChevronRight, CheckCircle2, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CustomIndex() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);
  const [registerSheetOpen, setRegisterSheetOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll events to change navbar appearance
  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = () => {
    setLoginSheetOpen(true);
    setIsMenuOpen(false);
  };
  
  const handleRegister = () => {
    setRegisterSheetOpen(true);
    setIsMenuOpen(false);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLoginSuccess = () => {
    setLoginSheetOpen(false);
    navigate("/dashboard");
  };

  const handleRegisterSuccess = () => {
    setRegisterSheetOpen(false);
    navigate("/language-selection");
  };

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Resources", href: "#resources" },
    { label: "About us", href: "#about" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-purple/5 to-brand-pink/5 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 overflow-x-hidden">
      {/* Navbar */}
      <div className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <a href="/" className="flex items-center">
                <ScripeLogotype className="h-8 w-auto" />
              </a>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-pink transition-colors duration-200 relative group text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-purple dark:bg-brand-pink transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
            </div>
          
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Button 
                  variant="outline" 
                  className="text-gray-700 dark:text-gray-300"
                  onClick={handleLogin}
                >
                  Log in
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Button 
                  variant="gradient"
                  rounded="full"
                  className="px-6 shine"
                  onClick={handleRegister}
                >
                  <span>Start for free</span>
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </motion.div>
            </div>
              
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 dark:text-gray-300"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-50 pt-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-start p-6 h-full">
              <motion.div 
                className="w-full mb-8 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ScripeIconRounded className="w-16 h-16" />
              </motion.div>
              
              <div className="flex flex-col items-center space-y-8 w-full">
                {navItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="text-xl text-gray-700 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-pink font-medium transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
              
              <div className="mt-auto w-full space-y-4 pb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="w-full"
                >
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleLogin}
                  >
                    Log in
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="w-full"
                >
                  <Button 
                    variant="gradient"
                    rounded="full"
                    className="w-full"
                    onClick={handleRegister}
                  >
                    Start for free
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Hero Section */}
      <section className="flex-grow flex items-center py-12 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left column - Text content */}
            <motion.div 
              className="flex-1 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-block px-4 py-1 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 text-sm mb-6">
                For Twitter creators and businesses
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Create algorithm-optimized <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">Twitter content</span> that grows your audience
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-xl">
                Scripe analyzes thousands of viral Twitter posts to help you create engaging content that resonates with your audience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  onClick={handleRegister}
                  className="bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold py-6 px-8 rounded-full text-lg group transition-all"
                  size="lg"
                >
                  <span>Try Scripe for free</span>
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle2 className="mr-2 w-5 h-5 text-green-500" />
                  No credit card required
                </div>
              </div>
            </motion.div>
            
            {/* Right column - Image or illustration */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink blur-xl opacity-20 -z-10 transform rotate-3"></div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
                  {/* Twitter post mockup */}
                  <div className="p-5">
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <div className="font-semibold">Jane Cooper</div>
                          <div className="text-gray-500 dark:text-gray-400 ml-2 text-sm">@janecooper</div>
                        </div>
                        <div className="mt-1 space-y-2">
                          <p>The key to building a successful Twitter audience isn't just posting—it's posting content that resonates with your target audience.</p>
                          <p>Here are 5 strategies I've used to grow from 0 to 10K followers in 3 months:</p>
                          <p>🧵👇</p>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                          <div className="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>48</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            <span>152</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>984</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <LoginSheet 
        open={loginSheetOpen} 
        onOpenChange={setLoginSheetOpen}
        onSuccess={handleLoginSuccess}
      />

      <RegistrationSheet 
        open={registerSheetOpen} 
        onOpenChange={setRegisterSheetOpen}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
}
