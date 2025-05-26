import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BrandOutHorizontalLogo, BrandOutIcon, BrandOutLogotype } from "@/components/BrandOutIcon";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const isMobile = useIsMobile();
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
              <BrandOutHorizontalLogo className="h-8 w-auto text-gray-900" />
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
          <div className="flex items-center space-x-4">
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
              className="hidden md:block"
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
              className="hidden md:block"
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
        </div>
      </div>
    </div>
  );
}
