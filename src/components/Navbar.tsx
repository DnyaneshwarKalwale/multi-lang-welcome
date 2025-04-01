import React, { useState } from "react";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, Twitter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const isMobile = useIsMobile();
  const { twitterAuth, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Direct login for development
  const handleTwitterAuth = () => {
    // Generate a random ID for demonstration purposes
    const twitterId = `twitter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Call the direct Twitter auth function
    twitterAuth({
      name: "Jane Smith",
      twitterId,
      email: `${twitterId}@twitter.com`,
      profileImage: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
    });
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };
  
  // Determines what to show in the right side of navbar based on auth state
  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <>
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/10"
            onClick={handleDashboardClick}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/10"
            onClick={logout}
          >
            Logout
          </Button>
        </>
      );
    }
    
    return (
      <>
        <Button 
          variant="ghost" 
          className="text-white hover:text-white hover:bg-white/10"
          onClick={onLoginClick}
        >
          Log in
        </Button>
        <Button 
          variant="outline" 
          className="text-white hover:text-white hover:bg-white/10 gap-2"
          onClick={handleTwitterAuth}
        >
          <Twitter size={18} className="text-[#1DA1F2]" />
          Dev Login
        </Button>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={onRegisterClick}
        >
          Start for free
        </Button>
      </>
    );
  };

  // Mobile menu items
  const mobileMenuItems = [
    { label: "Features", onClick: () => {} },
    { label: "Resources", onClick: () => {} },
    { label: "About us", onClick: () => {} },
    { label: "Pricing", onClick: () => {} },
    { label: "Affiliates", onClick: () => {} },
    ...(isAuthenticated 
      ? [
          { label: "Dashboard", onClick: handleDashboardClick },
          { label: "Logout", onClick: logout }
        ] 
      : [
          { label: "Login", onClick: onLoginClick },
          { label: "Start for free", onClick: onRegisterClick }
        ])
  ];
  
  return (
    <nav className="w-full py-4 px-6 md:px-12 lg:px-16 flex items-center justify-between bg-transparent">
      <div className="flex items-center gap-12">
        <ScripeLogotype className="text-white" />
        
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-8">
            <NavItem label="Features" />
            <NavItem label="Resources" />
            <NavItem label="About us" />
            <NavItem label="Pricing" />
            <NavItem label="Affiliates" />
          </div>
        )}
      </div>
      
      <div>
        {isMobile ? (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-gray-800 px-0">
              <div className="flex flex-col gap-1 mt-8">
                {mobileMenuItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-lg py-6 rounded-none hover:bg-gray-800"
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-3">
            {renderAuthButtons()}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavItem({ label }: { label: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-300 hover:text-white flex items-center gap-1 focus:outline-none">
          {label}
          {(label === "Features" || label === "Resources") && (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </DropdownMenuTrigger>
      
      {(label === "Features" || label === "Resources") && (
        <DropdownMenuContent align="start" className="bg-gray-900 border-gray-800 text-white min-w-[200px]">
          <DropdownMenuItem className="hover:bg-gray-800">
            Option 1
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-800">
            Option 2
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-800">
            Option 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
