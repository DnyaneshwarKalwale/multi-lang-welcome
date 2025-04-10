
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const MobileMenu = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/team-workspace", label: "Workspace" },
    { path: "/posting", label: "Posting" },
    { path: "/analytics", label: "Analytics" },
    { path: "/ai-content", label: "AI Content" },
    { path: "/settings", label: "Settings" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-bold">LinkedPulse</span>
          <ThemeToggle />
        </div>
        
        <nav className="flex flex-col space-y-3 flex-grow">
          {isAuthenticated && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors 
                ${isActive(item.path) 
                  ? 'bg-linkedin-blue/10 text-linkedin-blue dark:bg-linkedin-blue/20 dark:text-linkedin-blue'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 space-y-3">
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          ) : (
            <div className="space-y-3">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">Sign in</Button>
              </Link>
              <Link to="/registration" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-linkedin-blue hover:bg-linkedin-darkBlue">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
