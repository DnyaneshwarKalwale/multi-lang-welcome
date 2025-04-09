
import React, { useState, useEffect } from "react";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { ChevronRight, Linkedin, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { LoginSheet } from "@/components/LoginSheet";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import IndexHero from "@/components/IndexHero";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      {/* Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ScripeLogotype className="h-9 text-linkedin-blue dark:text-linkedin-blue" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-linkedin-blue dark:hover:text-linkedin-blue text-sm font-medium transition-colors duration-200">
                Features
              </a>
              <Link to="/how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-linkedin-blue dark:hover:text-linkedin-blue text-sm font-medium transition-colors duration-200">
                How It Works
              </Link>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-linkedin-blue dark:hover:text-linkedin-blue text-sm font-medium transition-colors duration-200">
                Testimonials
              </a>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-linkedin-blue dark:hover:text-linkedin-blue text-sm font-medium transition-colors duration-200">
                Pricing
              </Link>
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle variant="minimal" />
              <Button 
                variant="ghost" 
                className="text-gray-700 dark:text-gray-300 hover:text-linkedin-blue dark:hover:text-linkedin-blue"
                onClick={() => setIsLoginOpen(true)}
              >
                Log in
              </Button>
              <Button 
                className="bg-linkedin-blue hover:bg-linkedin-darkBlue text-white rounded-full px-6"
                onClick={() => setIsRegisterOpen(true)}
              >
                Try for free
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <ThemeToggle variant="minimal" />
              <button 
                className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                <div className="relative w-6 h-5">
                  <span className={`absolute block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 transform transition duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                  <span className={`absolute top-2 block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 transition duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`absolute top-4 block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 transform transition duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="container mx-auto px-6 pt-24 pb-16 h-full flex flex-col justify-between">
            <nav className="space-y-8">
              <a href="#features" 
                className="block text-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-linkedin-blue dark:hover:text-linkedin-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <Link to="/how-it-works" 
                className="block text-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-linkedin-blue dark:hover:text-linkedin-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <a href="#testimonials" 
                className="block text-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-linkedin-blue dark:hover:text-linkedin-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <Link to="/pricing" 
                className="block text-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-linkedin-blue dark:hover:text-linkedin-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </nav>
            
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-center text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                onClick={() => {
                  setIsLoginOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Log in
              </Button>
              <Button 
                className="w-full justify-center bg-linkedin-blue hover:bg-linkedin-darkBlue text-white"
                onClick={() => {
                  setIsRegisterOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Try for free
              </Button>
            </div>
          </div>
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Hero Section - using existing component */}
      <IndexHero 
        onLogin={() => setIsLoginOpen(true)} 
        onRegister={() => setIsRegisterOpen(true)} 
      />
      
      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-linkedin-pattern"></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Why professionals choose <span className="text-linkedin-blue dark:text-linkedin-blue">LinkedPulse</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Tools and features designed to help you create better LinkedIn content, grow your network, and advance your career.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-linkedin-blue dark:text-linkedin-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">AI-Powered Content</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate high-performing LinkedIn posts based on your professional voice, industry expertise, and topics that resonate with your network.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-linkedin-blue dark:text-linkedin-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Network Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track engagement metrics and get actionable insights to optimize your LinkedIn strategy and expand your professional network.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
                <CheckCircle className="h-7 w-7 text-linkedin-blue dark:text-linkedin-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Professional Branding</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Maintain consistent voice and personal brand identity across all your LinkedIn content with smart templates and style guides.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Trusted by professionals worldwide
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See what our users are saying about their LinkedIn growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.img} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-500" 
                  />
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-4 text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "This platform has completely transformed how I create content. The AI understands my voice and generates posts that actually sound like me."
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-linkedin-blue to-linkedin-darkBlue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-linkedin-pattern mix-blend-overlay opacity-10"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to elevate your LinkedIn presence?
            </motion.h2>
            <motion.p 
              className="text-xl mb-10 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join thousands of professionals who are already using LinkedPulse to grow their network and advance their careers.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button 
                onClick={() => setIsRegisterOpen(true)}
                className="bg-white text-linkedin-blue hover:bg-gray-100 rounded-xl py-6 px-10 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                size="lg"
              >
                Get Started for Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <ScripeLogotype className="h-8 text-linkedin-blue dark:text-linkedin-blue mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2025 LinkedPulse. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors text-sm">
                Help Center
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors text-sm">
                Contact
              </a>
            </div>
            
            <div className="flex items-center gap-4 mt-8 md:mt-0">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
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
