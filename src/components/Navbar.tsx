import React from "react";
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

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const isMobile = useIsMobile();
  const { twitterAuth } = useAuth();
  
  // Simple development login - works with any backend URL without CORS issues
  const handleTwitterAuth = () => {
    // Use direct browser redirect to the dev login endpoint
    const backendUrl = "http://localhost:5000"; // Hardcoded for development
    
    // Open the auth endpoint in a new tab for simplicity
    window.open(`${backendUrl}/api/auth/dev-login?redirect=true`, "_blank");
  };
  
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
      
      <div className="flex items-center gap-2 md:gap-4">
        {isMobile ? (
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        ) : (
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
