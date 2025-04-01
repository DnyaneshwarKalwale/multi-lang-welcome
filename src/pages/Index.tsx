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
        {/* Gradient background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 -left-[10%] w-[40%] h-[40%] rounded-full opacity-20 filter blur-[120px] bg-purple-700"></div>
          <div className="absolute bottom-0 -right-[10%] w-[40%] h-[40%] rounded-full opacity-20 filter blur-[120px] bg-blue-700"></div>
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
                For founders and their teams
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Get more leads on <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">LinkedIn</span> <br />
                with high-performing posts
              </h1>
              
              <p className="text-gray-400 text-lg mb-8 max-w-xl">
                Scripe knows what works by analyzing thousands of viral LinkedIn posts daily. 
                No generic AI fluff - train the AI with your knowledge to generate personalized content.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  onClick={handleContinue}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 px-8 rounded-full text-lg group transition-all"
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
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 blur-xl opacity-20 -z-10 transform rotate-3"></div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  {/* Dashboard mockup header */}
                  <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <ScripeIcon className="w-5 h-5" />
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
                          <div className="text-2xl font-bold text-indigo-400">10.2k</div>
                          <div className="text-xs text-gray-500">Followers</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-400">4.7k</div>
                          <div className="text-xs text-gray-500">Impressions</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-400">139</div>
                          <div className="text-xs text-gray-500">Posts</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                            <div>
                              <div className="text-sm font-medium">New Post</div>
                              <div className="text-xs text-gray-500">Today, 2:34 PM</div>
                            </div>
                          </div>
                          <div className="bg-indigo-600 text-xs text-white px-2 py-1 rounded">Publish</div>
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
                                className="w-[8%] bg-indigo-600 rounded-t-sm"
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
              Trusted by the leading LinkedIn Top Voices
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
              The first human-quality LinkedIn tool
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Scripe simplifies strategy and content creation for LinkedIn by turning unstructured voice, 
              video and text inputs into personalized social posts with human-level quality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13a1 1 0 112 0v4a1 1 0 01-.293.707l-3 3a1 1 0 01-1.414-1.414L9 8.586V5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Voice to content</h3>
              <p className="text-gray-400">
                Speak your thoughts with Scripe's Voice-to-Post, or write down your ideas, and Scripe will create LinkedIn posts for you.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Posts that sound like you</h3>
              <p className="text-gray-400">
                Scripe adapts to your writing style and voice, ensuring all content sounds authentically like you.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Goal-oriented analytics</h3>
              <p className="text-gray-400">
                Track your LinkedIn performance to optimize your strategy and posts for maximum engagement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Finally solve your content creation
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              by simply saying what you think
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" />
                <span>No writing skills required</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" />
                <span>Post creation in seconds</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" />
                <span>Personalized strategy</span>
              </div>
            </div>
            
            <Button 
              onClick={handleContinue}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 px-8 rounded-full text-lg group transition-all"
              size="lg"
            >
              <span>Start creating</span>
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 md:py-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="mb-4">
                <ScripeLogotype className="h-8 w-auto" />
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Empowering the world's professionals to share their stories.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Features</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Content Assistant</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics & Insights</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Content Strategy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Voice-To-Content</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn Hacks</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Personal Branding</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Scripe News</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Affiliates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Jobs</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-900 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Scripe GmbH. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-500 text-sm hover:text-gray-400 transition-colors">Imprint</a>
                <a href="#" className="text-gray-500 text-sm hover:text-gray-400 transition-colors">Privacy</a>
                <a href="#" className="text-gray-500 text-sm hover:text-gray-400 transition-colors">Terms</a>
                <a href="#" className="text-gray-500 text-sm hover:text-gray-400 transition-colors">Cookie Manager</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
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
