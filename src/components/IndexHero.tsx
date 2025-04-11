import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { BrandOutLogo } from "./BrandOutLogo";

interface IndexHeroProps {
  onLogin: () => void;
  onRegister: () => void;
}

const IndexHero: React.FC<IndexHeroProps> = ({ onLogin, onRegister }) => {
  return (
    <section className="pt-32 pb-16 md:py-36 bg-gradient-to-r from-white via-blue-50/20 to-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        <div className="absolute -top-20 -right-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-32 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <BrandOutLogo variant="full" size="2xl" className="mb-6 mx-auto md:mx-0" />
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">LinkedIn Presence</span>
            </motion.h1>
            
            <motion.p
              className="text-lg text-gray-600 mb-8 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Create engaging LinkedIn content that reflects your expertise. Generate professional posts, carousels, and more with our AI-powered platform.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Button 
                className="bg-primary hover:bg-primary-600 text-white px-8 py-6 rounded-xl text-lg"
                onClick={onRegister}
              >
                Get started for free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 px-8 py-6 rounded-xl text-lg"
                onClick={onLogin}
              >
                Log in
              </Button>
            </motion.div>
            
            <motion.p
              className="mt-4 text-gray-500 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              No credit card required. 14-day free trial.
            </motion.p>
          </div>
          
          {/* Hero Image */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1664575599618-8f6bd76fc670?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80" 
              alt="LinkedIn content creation dashboard" 
              className="w-full max-w-lg rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IndexHero;
