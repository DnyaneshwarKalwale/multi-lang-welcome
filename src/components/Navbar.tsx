import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { BrandOutLogo } from "./BrandOutLogo";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  
  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleClose = () => {
    setIsMenuOpen(false);
  };
  
  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Resources", href: "#resources" },
    { label: "About us", href: "#about" },
    { label: "Pricing", href: "#pricing" },
    { label: "Affiliates", href: "#affiliates" },
  ];
  
  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
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
              <BrandOutLogo variant="full" size="md" />
            </a>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-cyan-600 transition-colors duration-200 relative group text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-violet-600 transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
      </div>
      
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <ThemeToggle />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
            <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-cyan-600 hover:bg-gray-100/80"
              onClick={onLoginClick}
            >
              Log in
            </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={onRegisterClick}
              >
                <span>Start for free</span>
                <ArrowRight size={16} className="ml-2 animate-slide-in-right" />
            </Button>
            </motion.div>
          </div>
            
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-700 hover:text-cyan-600 ml-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-50 pt-20 bg-white/95 backdrop-blur-md"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
          >
            <div className="flex flex-col items-center justify-start p-6 h-full">
              <motion.div 
                className="w-full mb-8 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <BrandOutLogo variant="full" size="lg" />
              </motion.div>
              
              <div className="flex flex-col items-center space-y-8 w-full">
                {navItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="text-xl text-gray-700 hover:text-cyan-600 font-medium transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={handleClose}
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
                    className="w-full bg-transparent border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-cyan-600"
                    onClick={() => {
                      onLoginClick();
                      handleClose();
                    }}
                  >
                    Log in
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="w-full"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => {
                      onRegisterClick();
                      handleClose();
                    }}
                  >
                    <span>Start for free</span>
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
