import React, { useState, useEffect } from "react";
import { ScripeLogotype, ScripeIcon } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronRight, Star, Twitter, Users, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { LoginSheet } from "@/components/LoginSheet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      {/* Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ScripeLogotype className="h-9 text-teal-600 dark:text-teal-400" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition-colors duration-200">
                Features
              </a>
              <Link to="/how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition-colors duration-200">
                How It Works
              </Link>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition-colors duration-200">
                Testimonials
              </a>
              <Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition-colors duration-200">
                Pricing
              </Link>
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                onClick={() => setIsLoginOpen(true)}
              >
                Log in
              </Button>
              <Button 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-full px-6"
                onClick={() => setIsRegisterOpen(true)}
              >
                Try for free
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
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
        
        {/* Mobile Menu */}
        <div className={`md:hidden absolute w-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-80 py-4' : 'max-h-0 overflow-hidden'}`}>
          <div className="container mx-auto px-6 space-y-4">
            <a href="#features" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium">
              Features
            </a>
            <Link to="/how-it-works" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium">
              How It Works
            </Link>
            <a href="#testimonials" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium">
              Testimonials
            </a>
            <Link to="/pricing" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium">
              Pricing
            </Link>
            <div className="pt-2 pb-4 space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-center text-gray-700 dark:text-gray-300"
                onClick={() => {
                  setIsLoginOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Log in
              </Button>
              <Button 
                className="w-full justify-center bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                onClick={() => {
                  setIsRegisterOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Try for free
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-teal-100/60 dark:bg-teal-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-24 w-64 h-64 bg-indigo-100/60 dark:bg-indigo-900/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-3/4 h-48 bg-emerald-100/40 dark:bg-emerald-900/20 rounded-full blur-3xl"></div>
          {/* Geometric shapes */}
          <div className="absolute top-36 right-1/4 w-16 h-16 border-2 border-teal-200 dark:border-teal-700 rounded-xl transform rotate-45"></div>
          <div className="absolute top-1/2 left-1/6 w-10 h-10 border-2 border-indigo-200 dark:border-indigo-700 rounded-full"></div>
          <div className="absolute bottom-32 right-1/6 w-14 h-14 border-2 border-emerald-200 dark:border-emerald-700 rounded-full transform rotate-12"></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
            {/* Left column - Text content */}
            <motion.div 
              className="flex-1 max-w-xl text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 dark:from-teal-400 dark:via-emerald-400 dark:to-teal-300">
                Craft Impactful Content That Resonates
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-xl mx-auto lg:mx-0">
                Generate authentic, engaging Twitter content powered by AI that captures your unique voice. Stand out from the generic noise and connect with your audience.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
                <Button 
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-6 rounded-xl text-lg shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all"
                  size="lg"
                >
                  <span>Start creating</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0 justify-center lg:justify-start">
                  <div className="flex -space-x-2 mr-3">
                    <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://randomuser.me/api/portraits/women/42.jpg" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://randomuser.me/api/portraits/women/53.jpg" alt="User" />
                  </div>
                  <span>Joined by 2,500+ creators</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-600 dark:text-gray-300">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-600 dark:text-gray-300">Free starter plan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-600 dark:text-gray-300">Cancel anytime</span>
                </div>
              </div>
            </motion.div>
            
            {/* Right column - Feature showcase */}
            <motion.div 
              className="flex-1 w-full max-w-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="rounded-2xl shadow-xl bg-white dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700 p-1">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Content Generator</div>
                  <div className="w-5"></div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-lg text-gray-900 dark:text-white">Create new tweet</h3>
                      <Twitter className="w-5 h-5 text-teal-500" />
                    </div>
                    
                    {/* Tweet Generator Interface */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <div className="flex items-start mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 flex items-center justify-center text-white mr-3">
                            <Users size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white">Your Name</p>
                            <p className="text-gray-500 text-sm">@yourhandle</p>
                          </div>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mb-3">
                          Just discovered this amazing tool that's transforming how I create content! It's like having a personal content strategist that knows exactly what my audience wants to see. Game-changer for busy creators! #ContentCreation #WorkSmarter
                        </p>
                        <div className="flex justify-between text-gray-500 text-sm">
                          <span>Comments: 24</span>
                          <span>Retweets: 42</span>
                          <span>Likes: 187</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg p-3 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                          Regenerate
                        </button>
                        <button className="flex-1 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 rounded-lg p-3 transition-colors text-sm font-medium text-teal-700 dark:text-teal-300">
                          Save to drafts
                        </button>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg p-3 transition-colors text-sm font-medium flex items-center justify-center">
                        <Twitter className="w-4 h-4 mr-2" />
                        Post to Twitter
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Performance Analytics
                    </h4>
                    <div className="h-32 relative">
                      <div className="absolute inset-0 flex items-end">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div 
                            key={i}
                            className="flex-1 mx-1"
                          >
                            <div 
                              className="rounded-t bg-gradient-to-b from-teal-400 to-emerald-500"
                              style={{ height: `${30 + Math.random() * 70}%` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white dark:from-gray-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why creators choose <span className="text-teal-600 dark:text-teal-400">our platform</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Tools and features designed to help you create better content, grow your audience, and save time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">AI-Powered Content</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate high-performing tweets based on your unique voice, style, and topics that resonate with your audience.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Growth Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track performance metrics and get actionable insights to optimize your content strategy and grow your audience.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Personalized Branding</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Maintain consistent voice and brand identity across all your content with smart templates and style guides.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Loved by creators worldwide
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See what our users are saying about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.img} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-500" 
                  />
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-4 text-yellow-400 flex">
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
      <section className="py-16 md:py-24 bg-gradient-to-r from-teal-500 to-emerald-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-white opacity-5 transform -skew-x-12"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-white opacity-5 transform skew-x-12"></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to elevate your content strategy?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join thousands of creators who are already using our platform to grow their audience and save time.
            </p>
            
            <Button 
              onClick={handleContinue}
              className="bg-white text-teal-600 hover:bg-gray-100 rounded-xl py-6 px-10 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
              size="lg"
            >
              Get Started for Free
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <ScripeLogotype className="h-8 text-teal-600 dark:text-teal-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2023 All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors text-sm">
                Help Center
              </a>
              <a href="#" className="text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors text-sm">
                Contact
              </a>
            </div>
            
            <div className="flex items-center gap-4 mt-8 md:mt-0">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-teal-500 dark:hover:bg-teal-500 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-teal-500 dark:hover:bg-teal-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-teal-500 dark:hover:bg-teal-500 hover:text-white transition-colors">
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
