import React, { useState, useEffect } from "react";
import { ScripeLogotype, ScripeIcon } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { Twitter, ChevronRight, CheckCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { LoginSheet } from "@/components/LoginSheet";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContinue = () => {
    setIsRegisterOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    navigate("/onboarding/welcome");
  };

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
    navigate("/onboarding/welcome");
  };
  
  // Testimonial data
  const testimonials = [
    { name: "Steven Hille", role: "Founder - Hill Productions", img: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Laura Raggl", role: "Co-Founder - ROI Ventures", img: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Marina Ziblis", role: "Senior Consultant - PwC", img: "https://randomuser.me/api/portraits/women/3.jpg" },
    { name: "Alexander Valtingojer", role: "CSO - Altify", img: "https://randomuser.me/api/portraits/men/4.jpg" },
    { name: "Sherin Maruhn", role: "Venture Deals Manager - PwC", img: "https://randomuser.me/api/portraits/women/5.jpg" },
    { name: "Claudio Santoro", role: "Pharmacist & Author", img: "https://randomuser.me/api/portraits/men/6.jpg" },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden">
      {/* Navbar */}
      <div className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'}`}>
        <Navbar 
          onLoginClick={() => setIsLoginOpen(true)}
          onRegisterClick={() => setIsRegisterOpen(true)}
        />
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden">
        {/* Gradient background with Twitter blue */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 -left-[10%] w-[40%] h-[40%] rounded-full opacity-20 filter blur-[120px] bg-blue-600"></div>
          <div className="absolute bottom-0 -right-[10%] w-[40%] h-[40%] rounded-full opacity-20 filter blur-[120px] bg-blue-600"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left column - Text content */}
            <motion.div 
              className="flex-1 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-sm mb-6 backdrop-blur-sm">
                <Twitter className="w-4 h-4 inline-block mr-2" />
                Twitter-powered content creation
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Get more engagement on <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500">Twitter</span> <br />
                with high-performing posts
              </h1>
              
              <p className="text-gray-400 text-lg mb-8 max-w-xl">
                Scripe knows what works by analyzing thousands of viral Twitter posts daily. 
                No generic AI fluff - train the AI with your knowledge to generate personalized tweets.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  onClick={handleContinue}
                  variant="twitter"
                  rounded="full"
                  className="py-6 px-8 text-lg group transition-all"
                  size="lg"
                >
                  <span>Try Scripe for free</span>
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="flex items-center text-sm text-gray-400">
                  <CheckCircle2 className="mr-2 w-5 h-5 text-green-500" />
                  No credit card required
                </div>
              </div>
            </motion.div>
            
            {/* Right column - Dashboard preview */}
            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 blur-xl opacity-20 -z-10 transform rotate-3"></div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  {/* Dashboard mockup header */}
                  <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Twitter className="w-5 h-5" />
                      </div>
                      <span className="font-medium">Dashboard</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                    </div>
                  </div>
                  
                  {/* Dashboard mockup content */}
                  <div className="p-5">
                    <div className="mb-5">
                      <h3 className="text-xl font-semibold mb-3">Welcome to Scripe 👋</h3>
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">10.2k</div>
                          <div className="text-xs text-gray-500">Followers</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">4.7k</div>
                          <div className="text-xs text-gray-500">Impressions</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">139</div>
                          <div className="text-xs text-gray-500">Tweets</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                            <div>
                              <div className="text-sm font-medium">New Tweet</div>
                              <div className="text-xs text-gray-500">Today, 2:34 PM</div>
                            </div>
                          </div>
                          <div className="bg-blue-500 text-xs text-white px-2 py-1 rounded">Tweet</div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-gray-700 rounded w-full"></div>
                          <div className="h-2 bg-gray-700 rounded w-5/6"></div>
                          <div className="h-2 bg-gray-700 rounded w-4/6"></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                            <div>
                              <div className="text-sm font-medium">Analytics</div>
                              <div className="text-xs text-gray-500">This month</div>
                            </div>
                          </div>
                        </div>
                        <div className="h-20 relative">
                          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-16">
                            {Array.from({ length: 7 }).map((_, i) => (
                              <div 
                                key={i} 
                                className="w-[8%] bg-blue-500 rounded-t-sm"
                                style={{ height: `${Math.random() * 100}%` }}
                              />
                            ))}
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
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by the leading Twitter Influencers
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From leading creators to established enterprises
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-3 bg-gray-900 border border-gray-800 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={testimonial.img} 
                  alt={testimonial.name} 
                  className="w-full aspect-square object-cover rounded-lg mb-3" 
                />
                <h4 className="font-medium text-sm">{testimonial.name}</h4>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The first human-quality Twitter tool
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our platform combines deep Twitter analysis with your unique expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 group hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-blue-900/20 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-900/30 group-hover:scale-110 transition-all duration-300">
                <Twitter className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Twitter-optimized Content</h3>
              <p className="text-gray-400">
                Generate tweets optimized for engagement based on analysis of top-performing content in your niche
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 group hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-blue-900/20 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-900/30 group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-gray-400">
                Detailed performance metrics to track growth and optimize your Twitter strategy
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 group hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-blue-900/20 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-900/30 group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">1-Click Publishing</h3>
              <p className="text-gray-400">
                Write once, publish anywhere with our seamless Twitter integration
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative bg-gradient-to-b from-transparent to-blue-900/10">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to grow your <span className="text-blue-400">Twitter presence</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Join thousands of content creators who use Scripe to create engaging Twitter content
            </p>
            
            <Button 
              onClick={handleContinue}
              variant="twitter"
              rounded="full"
              className="py-6 px-8 text-lg shadow-lg"
            >
              Get Started for Free
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <ScripeLogotype className="h-8 mb-4" />
              <p className="text-gray-500 text-sm">
                © 2023 Scripe. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Login & Registration Sheets */}
      <LoginSheet 
        open={isLoginOpen} 
        onOpenChange={setIsLoginOpen}
        onSuccess={handleLoginSuccess}
      />
      
      <RegistrationSheet 
        open={isRegisterOpen} 
        onOpenChange={setIsRegisterOpen}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

export default Index;
