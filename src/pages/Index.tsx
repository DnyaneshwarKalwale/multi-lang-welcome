import React, { useState, useEffect, useRef } from "react";
import { LovableLogo } from "@/components/LovableLogo";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Linkedin, BarChart3, PlusCircle, Lightbulb, FileText, X, Sparkles, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { RegistrationSheet } from "@/components/RegistrationSheet";
import { LoginSheet } from "@/components/LoginSheet";
import { Link } from "react-router-dom";
import IndexHero from "@/components/IndexHero";
import { motion } from "framer-motion";
import { BrandOutHorizontalLogo } from "@/components/BrandOutIcon";
import { useAuth } from "@/contexts/AuthContext";
import { tokenManager } from "@/services/api";
import gsap from "gsap";

const Index = () => {  const navigate = useNavigate();  const isMobile = useIsMobile();  const { isAuthenticated, user, loading } = useAuth();  const [isLoginOpen, setIsLoginOpen] = useState(false);  const [isRegisterOpen, setIsRegisterOpen] = useState(false);  const [scrolled, setScrolled] = useState(false);  
  
  // References for animated elements  
  const featuresRef = useRef<HTMLDivElement>(null);  
  const testimonialsRef = useRef<HTMLDivElement>(null);  
  const ctaRef = useRef<HTMLDivElement>(null);    
  
  // Check authentication status and redirect if needed
  useEffect(() => {
    // Skip redirect if auth is still loading
    if (loading) return;
    
    // Check for token directly as an additional safeguard
    const authMethod = localStorage.getItem('auth-method');
    const hasToken = authMethod && localStorage.getItem(`${authMethod}-login-token`);
    
    // If authenticated with a token, redirect to appropriate page
    if ((isAuthenticated || hasToken) && !loading) {
      console.log('Index - User is authenticated, redirecting to appropriate page');
      
      // Check if onboarding is completed
      const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
      
      if (onboardingCompleted) {
        // Redirect to dashboard if onboarding is completed
        navigate('/dashboard', { replace: true });
      } else {
        // Redirect to onboarding if not completed
        const savedStep = localStorage.getItem('onboardingStep') || 'welcome';
        navigate(`/onboarding/${savedStep}`, { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, user]);
  
  // Handle scroll events to change navbar appearance
    useEffect(() => {    const handleScroll = () => {      setScrolled(window.scrollY > 50);    };        window.addEventListener('scroll', handleScroll);    return () => window.removeEventListener('scroll', handleScroll);  }, []);    // Initialize animations  useEffect(() => {    // Add animation to features section    if (featuresRef.current) {      const featureItems = featuresRef.current.querySelectorAll('.feature-item');      featureItems.forEach((item, index) => {        gsap.set(item, { y: 50, opacity: 0 });        const observer = new IntersectionObserver(          (entries) => {            entries.forEach((entry) => {              if (entry.isIntersecting) {                gsap.to(item, {                   y: 0,                   opacity: 1,                   duration: 0.8,                   delay: index * 0.2,                  ease: 'power2.out'                 });                observer.unobserve(entry.target);              }            });          },          { threshold: 0.2 }        );        observer.observe(item);      });    }        // Add animation to testimonials    if (testimonialsRef.current) {      const testimonialItems = testimonialsRef.current.querySelectorAll('.testimonial-item');      testimonialItems.forEach((item, index) => {        gsap.set(item, { scale: 0.9, opacity: 0 });        const observer = new IntersectionObserver(          (entries) => {            entries.forEach((entry) => {              if (entry.isIntersecting) {                gsap.to(item, {                   scale: 1,                   opacity: 1,                   duration: 0.8,                   delay: index * 0.2,                  ease: 'power2.out'                 });                observer.unobserve(entry.target);              }            });          },          { threshold: 0.2 }        );        observer.observe(item);      });    }        // Add animation to CTA section    if (ctaRef.current) {      gsap.set(ctaRef.current, { y: 50, opacity: 0 });      const observer = new IntersectionObserver(        (entries) => {          entries.forEach((entry) => {            if (entry.isIntersecting) {              gsap.to(ctaRef.current, {                 y: 0,                 opacity: 1,                 duration: 1,                ease: 'power2.out'               });              observer.unobserve(entry.target);            }          });        },        { threshold: 0.2 }      );      if (ctaRef.current) observer.observe(ctaRef.current);    }  }, []);

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    navigate("/onboarding/welcome");
  };

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
    navigate("/onboarding/welcome");
  };
  
  // If auth is loading, show minimal loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Testimonial data
  const testimonials = [
    { name: "Steven Hille", role: "LinkedIn Growth Strategist", img: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Laura Raggl", role: "Content Creator - LinkedIn Top Voice", img: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Marina Ziblis", role: "Senior Consultant - Content Marketing", img: "https://randomuser.me/api/portraits/women/3.jpg" },
    { name: "Alexander Valtingojer", role: "Director of Community Growth", img: "https://randomuser.me/api/portraits/men/4.jpg" },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white text-gray-800 overflow-x-hidden">
      {/* Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : ''}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BrandOutHorizontalLogo className="h-8" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors duration-200">
                Features
              </a>
              <Link to="/how-it-works" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors duration-200">
                How It Works
              </Link>
              <a href="#testimonials" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors duration-200">
                Testimonials
              </a>
              <Link to="/pricing" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors duration-200">
                Pricing
              </Link>
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-primary"
                onClick={() => setIsLoginOpen(true)}
              >
                Log in
              </Button>
              <Button 
                className="bg-primary hover:bg-primary-600 text-white rounded-full px-6"
                onClick={() => setIsRegisterOpen(true)}
              >
                Try for free
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <IndexHero 
        onLogin={() => setIsLoginOpen(true)} 
        onRegister={() => setIsRegisterOpen(true)} 
      />
      
      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-white via-blue-50/20 to-white relative overflow-hidden px-4" >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-40 bg-grid-pattern"></div>
        </div>
        
        <div className="container mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-2xl md:text-4xl font-bold mb-4 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Why professionals choose <span className="text-primary">BrandOut</span>
            </motion.h2>
            <motion.p 
              className="text-base md:text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Tools and features designed to help you create better LinkedIn content, grow your professional network, and elevate your personal brand.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div               className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card feature-item"              initial={{ opacity: 0, y: 20 }}              whileInView={{ opacity: 1, y: 0 }}              transition={{ duration: 0.5 }}              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <PlusCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI-Powered Content</h3>
              <p className="text-gray-600">
                Generate professional LinkedIn content that reflects your authentic voice and expertise while driving meaningful engagement.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-secondary-100 flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Growth Analytics</h3>
              <p className="text-gray-600">
                Track performance metrics and get actionable insights to optimize your LinkedIn strategy and grow your professional network.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-accent-100 flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Carousel Creator</h3>
              <p className="text-gray-600">
                Create eye-catching LinkedIn carousel posts with professional templates designed to increase engagement and shares.
              </p>
            </motion.div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                <Lightbulb className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Content Ideas</h3>
              <p className="text-gray-600">
                Get industry-specific content ideas and prompts to beat writer's block and maintain a consistent posting schedule.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Linkedin className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">LinkedIn Optimization</h3>
              <p className="text-gray-600">
                Optimize your content with best practices for LinkedIn's algorithm to maximize reach and engagement with your network.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-8 rounded-2xl transform transition-all duration-300 hover:translate-y-[-5px] glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Content Calendar</h3>
              <p className="text-gray-600">
                Schedule and automate your LinkedIn posts for optimal posting times, ensuring consistent engagement with your audience.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 bg-white px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span 
              className="text-primary font-semibold testimonial-item"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              TESTIMONIALS
            </motion.span>
            <motion.h2 
              className="text-2xl md:text-4xl font-bold mt-2 mb-4 text-gray-900"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Trusted by LinkedIn professionals worldwide
            </motion.h2>
            <motion.p 
              className="text-base md:text-lg text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              See how BrandOut has helped professionals grow their personal brand and create impactful content on LinkedIn.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-4 items-start mb-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden">
                    <img src={testimonial.img} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic">
                  "BrandOut has completely transformed how I approach content creation. The analytics help me understand what's working, and the AI content suggestions save me hours every week. My engagement has increased by over 200% since I started using it."
                </blockquote>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Button 
              className="bg-primary hover:bg-primary-600 text-white px-8 py-6 rounded-xl text-lg"
              onClick={() => setIsRegisterOpen(true)}
            >
              Start your free trial
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-gray-500 mt-4">No credit card required. 14-day free trial.</p>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-blue-50 to-primary/5 px-4">
        <div className="container mx-auto">
            <motion.div
            
            className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-gray-900">
              Ready to transform your <span className="text-primary">brand presence</span>?
            </h2>
            <p className="text-base md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals already using BrandOut to create better content and grow their professional network.
            </p>
              <Button 
              className="bg-primary hover:bg-primary-600 text-white px-6 py-5 md:px-8 md:py-7 rounded-xl text-lg shadow-lg hover:shadow-primary/30"
                onClick={() => setIsRegisterOpen(true)}
              >
              Get started today
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <BrandOutHorizontalLogo className="h-8 mb-6" />
              <p className="text-gray-500 text-sm">
                The professional content platform for creators and thought leaders.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-500 hover:text-primary text-sm">Features</a></li>
                <li><Link to="/pricing" className="text-gray-500 hover:text-primary text-sm">Pricing</Link></li>
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">Integrations</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">LinkedIn Guide</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">Content Library</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">About us</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} BrandOut. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Link to="/admin/login" className="text-sm text-gray-500 hover:text-primary transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
      
      {/* Registration & Login Sheets */}
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
