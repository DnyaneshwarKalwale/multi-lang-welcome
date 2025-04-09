
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Linkedin, CheckCircle, ArrowRight, Users, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { LoginSheet } from "@/components/LoginSheet";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    navigate("/dashboard");
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

  // Features data
  const features = [
    {
      title: "AI-Powered Content",
      description: "Generate professional LinkedIn posts tailored to your voice and industry expertise",
      icon: <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-linkedin-blue dark:text-linkedin-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
    },
    {
      title: "Network Analytics",
      description: "Get detailed insights on your content performance and audience engagement",
      icon: <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-linkedin-blue dark:text-linkedin-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
    },
    {
      title: "Professional Branding",
      description: "Maintain consistent voice and branding across all your LinkedIn content",
      icon: <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
              <CheckCircle className="h-7 w-7 text-linkedin-blue dark:text-linkedin-blue" />
            </div>
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      {/* Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : ''}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-linkedin-blue dark:text-linkedin-blue">
                LinkedPulse
              </span>
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
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-linkedin-blue/10 dark:bg-linkedin-blue/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-24 w-64 h-64 bg-blue-100/60 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-3/4 h-48 bg-linkedin-lightBlue/10 dark:bg-linkedin-lightBlue/5 rounded-full blur-3xl"></div>
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Elevate Your <span className="text-linkedin-blue dark:text-linkedin-blue">LinkedIn</span> Presence
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Create engaging professional content, grow your network, and unlock career opportunities with our AI-powered LinkedIn content platform.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
                <Button 
                  onClick={() => setIsRegisterOpen(true)}
                  className="bg-linkedin-blue hover:bg-linkedin-darkBlue text-white px-8 py-6 rounded-xl text-lg shadow-md transition-all duration-300"
                  size="lg"
                >
                  <span>Start creating</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0 justify-center lg:justify-start">
                  <div className="flex -space-x-3 mr-3">
                    <div className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 overflow-hidden">
                      <Users size={14} />
                    </div>
                    <div className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 overflow-hidden">
                      <Star size={14} />
                    </div>
                    <div className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 bg-linkedin-blue/20 dark:bg-linkedin-blue/30 flex items-center justify-center text-linkedin-blue dark:text-linkedin-blue overflow-hidden">
                      <Linkedin size={14} />
                    </div>
                  </div>
                  <span>Joined by 2,500+ professionals</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-linkedin-blue/10 dark:bg-linkedin-blue/20 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-linkedin-blue" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">No credit card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-linkedin-blue/10 dark:bg-linkedin-blue/20 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-linkedin-blue" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">Free starter plan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-linkedin-blue/10 dark:bg-linkedin-blue/20 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-linkedin-blue" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">Cancel anytime</span>
                </div>
              </div>
              
              {/* Theme Toggle in Hero Section */}
              <div className="mt-10 flex items-center justify-center lg:justify-start">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/40 transition-all">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Choose Theme:</span>
                  <ThemeToggle variant="expanded" />
                </div>
              </div>
            </motion.div>
            
            {/* Right column - Feature showcase with glassmorphism */}
            <motion.div 
              className="flex-1 w-full max-w-md lg:max-w-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/30 shadow-xl">
                <div className="flex items-center justify-between bg-gray-50/90 dark:bg-gray-900/90 p-3 border-b border-gray-100/80 dark:border-gray-700/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Content Generator</div>
                  <Linkedin className="w-5 h-5 text-linkedin-blue" />
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Create new content</h3>
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-linkedin-blue" />
                        <span className="text-xs font-medium bg-linkedin-blue/10 text-linkedin-blue py-1 px-2 rounded-full">Pro</span>
                      </div>
                    </div>
                    
                    {/* Content Generator Interface */}
                    <div className="space-y-4">
                      <div className="bg-gray-50/70 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-5 border border-gray-100/50 dark:border-gray-800/50">
                        <div className="flex items-start mb-3">
                          <Avatar className="h-10 w-10 rounded-full mr-3">
                            <AvatarImage src="https://randomuser.me/api/portraits/men/42.jpg" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white">John Doe</p>
                            <p className="text-gray-500 text-xs">Marketing Professional</p>
                          </div>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mb-4 line-height-relaxed text-sm">
                          I'm excited to announce our new AI-driven marketing analytics platform that helps businesses gain actionable insights from their customer data. #MarketingAnalytics #AI #DataDrivenDecisions
                        </p>
                        <div className="flex gap-4 text-gray-500 text-xs">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            28
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                            52
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            215
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="gap-2 rounded-lg text-sm">
                          Regenerate
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-lg bg-linkedin-blue/10 text-linkedin-blue border-linkedin-blue/20 text-sm">
                          Save draft
                        </Button>
                      </div>
                      
                      <Button className="w-full bg-linkedin-blue hover:bg-linkedin-darkBlue text-white rounded-lg text-sm h-10">
                        <Linkedin className="w-4 h-4 mr-2" />
                        Post to LinkedIn
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100/70 dark:border-gray-700/30 pt-5">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-linkedin-blue"></span>
                      Engagement Analytics
                    </h4>
                    <div className="h-32 relative">
                      <div className="absolute inset-0 flex items-end">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <motion.div 
                            key={i}
                            className="flex-1 mx-1"
                            initial={{ height: 0 }}
                            animate={{ height: `${30 + Math.random() * 70}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                          >
                            <div 
                              className="rounded-t bg-gradient-to-b from-linkedin-blue/50 to-linkedin-darkBlue/50 dark:from-linkedin-blue/60 dark:to-linkedin-darkBlue/60 w-full h-full"
                            ></div>
                          </motion.div>
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
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
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
                    className="w-12 h-12 rounded-full object-cover border-2 border-linkedin-blue" 
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
                  "LinkedPulse has completely transformed how I create content for LinkedIn. The AI understands my professional voice and generates posts that resonate with my network."
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
              <div className="text-2xl font-bold text-linkedin-blue dark:text-linkedin-blue mb-4">
                LinkedPulse
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2025 LinkedPulse. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-500 hover:text-linkedin-blue dark:text-gray-400 dark:hover:text-linkedin-blue transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-linkedin-blue dark:text-gray-400 dark:hover:text-linkedin-blue transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-linkedin-blue dark:text-gray-400 dark:hover:text-linkedin-blue transition-colors text-sm">
                Help Center
              </a>
              <a href="#" className="text-gray-500 hover:text-linkedin-blue dark:text-gray-400 dark:hover:text-linkedin-blue transition-colors text-sm">
                Contact
              </a>
            </div>
            
            <div className="flex items-center gap-4 mt-8 md:mt-0">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-linkedin-blue dark:hover:bg-linkedin-blue hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-linkedin-blue dark:hover:bg-linkedin-blue hover:text-white transition-colors">
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
