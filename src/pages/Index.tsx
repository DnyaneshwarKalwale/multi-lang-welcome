
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
              onClick={() => setIsRegisterOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 px-8 rounded-full text-lg"
            >
              Try Scripe for free
            </Button>
            
            <p className="text-gray-500 text-sm mt-2">No credit card required</p>
          </div>
        </div>
        
        <div className="hidden lg:block flex-1">
          {/* Visualization goes here - showing dashboard */}
          <div className="h-full w-full bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
            <img 
              src="/lovable-uploads/78d56c74-af86-44d8-ad5b-de1023e7abc5.png" 
              alt="Scripe Dashboard"
              className="object-cover object-left-top w-full h-full opacity-70"
            />
          </div>
        </div>
      </div>

      {/* Login Sheet */}
      <LoginSheet open={isLoginOpen} onOpenChange={setIsLoginOpen} onSuccess={() => navigate("/onboarding/welcome")} />

      {/* Registration Sheet */}
      <RegistrationSheet open={isRegisterOpen} onOpenChange={setIsRegisterOpen} onSuccess={() => navigate("/onboarding/welcome")} />
    </div>
  );
};

export default Index;
