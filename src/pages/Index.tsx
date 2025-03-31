import React, { useState } from "react";
import { ScripeLogotype, ScripeIcon } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { LoginSheet } from "@/components/LoginSheet";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  const handleContinue = () => {
    navigate("/onboarding/welcome");
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    navigate("/onboarding/welcome");
  };

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
    navigate("/onboarding/welcome");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Navbar */}
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-16">
          <div className="max-w-2xl mx-auto md:mx-0">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-sm mb-6">
              For founders and their teams
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Create LinkedIn content <br />
              with <span className="scripe-gradient-text">high reach</span> in &lt;5 minutes
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 max-w-xl">
              Scripe knows what works by analyzing thousands of viral LinkedIn posts daily. 
              No generic AI fluff - train the AI with your knowledge to generate personalized content.
            </p>
            
            <Button 
              onClick={handleContinue}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 px-8 rounded-full text-lg shine-effect"
            >
              Get Started
            </Button>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16">
          <div className="relative w-full max-w-lg animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 overflow-hidden">
              {/* Dashboard Preview */}
              <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-400">Scripe Dashboard</div>
                  <div className="w-4"></div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium">LinkedIn Content</div>
                    <div className="bg-purple-600 text-xs text-white px-2 py-1 rounded">Generate</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-700 rounded w-2/3"></div>
                  </div>
                  <div className="mt-4 bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-600"></div>
                      <div>
                        <div className="h-2 bg-gray-600 rounded w-24"></div>
                        <div className="h-2 mt-1 bg-gray-600 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-600 rounded w-full"></div>
                      <div className="h-2 bg-gray-600 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-600 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Sheet */}
      <LoginSheet 
        open={isLoginOpen} 
        onOpenChange={setIsLoginOpen}
        onSuccess={handleLoginSuccess}
      />

      {/* Registration Sheet */}
      <RegistrationSheet 
        open={isRegisterOpen} 
        onOpenChange={setIsRegisterOpen}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

export default Index;
