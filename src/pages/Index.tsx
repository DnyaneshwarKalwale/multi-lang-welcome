import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { LoginSheet } from '@/components/LoginSheet';
import { RegistrationSheet } from '@/components/RegistrationSheet';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import dashboard from '@/assets/images/dashboard.png';

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // Check URL parameters on mount and when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'true') {
      setIsLoginOpen(true);
      // Clean up URL
      navigate('/', { replace: true });
    } else if (params.get('register') === 'true') {
      setIsRegisterOpen(true);
      // Clean up URL
      navigate('/', { replace: true });
    }
  }, [location, navigate]);
  
  // Handle successful login/registration
  const handleAuthSuccess = () => {
    navigate('/onboarding/welcome');
  };
  
  // Handle beginning onboarding directly (for demo)
  const handleStartDemo = () => {
    navigate('/onboarding/welcome');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />
      
      <main className="flex-1 flex flex-col items-center px-4 py-12 md:py-24">
        <div className="max-w-5xl w-full flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Create content that resonates with <span className="text-purple-500">your audience</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mb-8">
            Streamline your social media strategy with AI-powered content generation that understands your brand voice and connects with your followers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button 
              onClick={() => setIsRegisterOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 px-8 rounded-lg"
              size="lg"
            >
              Get started for free
            </Button>
            
            <Button 
              onClick={handleStartDemo}
              className="bg-gray-800 hover:bg-gray-700 text-white text-lg py-6 px-8 rounded-lg"
              size="lg"
            >
              Explore platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="w-full max-w-4xl relative">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 absolute inset-0 rounded-xl blur-xl"></div>
            <img 
              src={dashboard} 
              alt="Dashboard Preview" 
              className="w-full h-auto rounded-xl border border-gray-800 relative shadow-2xl" 
            />
          </div>
        </div>
      </main>
      
      <LoginSheet 
        open={isLoginOpen} 
        onOpenChange={setIsLoginOpen}
        onSuccess={handleAuthSuccess}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      
      <RegistrationSheet 
        open={isRegisterOpen} 
        onOpenChange={setIsRegisterOpen}
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}
