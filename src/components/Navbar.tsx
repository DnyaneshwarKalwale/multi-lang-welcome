import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScripeLogotype, ScripeIconRounded } from "@/components/ScripeIcon";
import { Menu, X, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
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
        scrolled ? "bg-black/80 backdrop-blur-md shadow-md" : "bg-transparent"
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
              <ScripeLogotype className="h-8 w-auto" />
            </a>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors duration-200 relative group text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
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
                variant="transparent" 
                className="text-gray-300 hover:text-white hover:bg-gray-800/30"
              onClick={onLoginClick}
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
                animation="pulse"
                rounded="full"
                className="px-6 shine"
                onClick={onRegisterClick}
              >
                <span>Start for free</span>
                <ChevronRight size={16} className="ml-1" />
            </Button>
            </motion.div>
          </div>
            
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="transparent" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-50 pt-20 bg-black/95 backdrop-blur-md"
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
                    className="text-xl text-gray-300 hover:text-white font-medium transition-colors"
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
                    className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
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
                >
                  <Button 
                    variant="gradient"
                    rounded="full"
                    className="w-full"
                    onClick={() => {
                      onRegisterClick();
                      handleClose();
                    }}
                  >
                    Start for free
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
