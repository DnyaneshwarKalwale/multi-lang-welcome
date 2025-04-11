import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Check, Star, Linkedin, Users, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BrandOutLogo } from "@/components/BrandOutLogo";

interface IndexHeroProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function IndexHero({ onLogin, onRegister }: IndexHeroProps) {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    onRegister();
  };

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-primary-100/60 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-64 h-64 bg-blue-100/60 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-3/4 h-48 bg-secondary-100/40 rounded-full blur-3xl"></div>
        
        {/* Geometric shapes */}
        <motion.div 
          className="absolute top-36 right-1/4 w-16 h-16 border-2 border-primary-200 rounded-xl"
          animate={{ 
            rotate: 45, 
            y: [0, -10, 0],
            opacity: [0.8, 1, 0.8] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className="absolute top-1/2 left-1/6 w-10 h-10 border-2 border-blue-200 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-32 right-1/6 w-14 h-14 border-2 border-secondary-200 rounded-full"
          animate={{ 
            rotate: [0, 12, 0],
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        ></motion.div>
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Elevate Your LinkedIn Presence
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Create professional-grade LinkedIn content that helps you stand out, build your personal brand, and grow your professional network.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
              <Button 
                onClick={handleContinue}
                className="bg-primary hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/20 text-white px-8 py-7 rounded-2xl text-lg shadow-md transition-all duration-300 transform hover:scale-[1.02]"
                size="lg"
              >
                <span>Start creating</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 justify-center lg:justify-start">
                <div className="flex -space-x-3 mr-3">
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-primary overflow-hidden">
                    <Users size={14} />
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
                    <Linkedin size={14} />
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-secondary-100 flex items-center justify-center text-secondary-600 overflow-hidden">
                    <Star size={14} />
                  </div>
                </div>
                <span>Joined by 2,500+ professionals</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-gray-600">AI-powered content</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-gray-600">LinkedIn analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-gray-600">Carousel posts</span>
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
            <div className="rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between bg-gray-50/90 p-3 border-b border-gray-100/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-medium text-gray-500">LinkedIn Content Creator</div>
                <BrandOutLogo variant="icon" size="sm" className="w-5 h-5" />
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">Create new LinkedIn post</h3>
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium bg-primary-50 text-primary py-1 px-2 rounded-full">Ready</span>
                    </div>
                  </div>
                  
                  {/* Content Generator Interface */}
                  <div className="space-y-4">
                    <div className="bg-gray-50/70 rounded-xl p-5 border border-gray-100/50">
                      <div className="flex items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-sm mr-3">
                          <Users size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">Sarah Johnson</p>
                          <p className="text-gray-500 text-xs">Product Marketing Manager</p>
                        </div>
                      </div>
                      <p className="text-gray-800 mb-4 line-height-relaxed text-sm">
                        Just discovered an incredible tool that has transformed how I create LinkedIn content! It's like having a professional writer and strategist on standby. My engagement has increased by 78% in just two weeks. #LinkedInTips #ProfessionalGrowth #ContentCreation
                      </p>
                      <div className="flex gap-4 text-gray-500 text-xs">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                          32
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                          78
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                          214
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-gray-50/70 hover:bg-gray-100 rounded-xl p-3 transition-all text-sm font-medium text-gray-700 border border-gray-100/50 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                        Enhance
                      </button>
                      <button className="bg-primary-50/70 hover:bg-primary-100 rounded-xl p-3 transition-all text-sm font-medium text-primary border border-primary-100/50 flex items-center justify-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Save draft
                      </button>
                    </div>
                    
                    <button className="w-full bg-primary hover:bg-primary-600 text-white rounded-xl p-3 transition-all text-sm font-medium flex items-center justify-center shadow-sm hover:shadow-md">
                      <Linkedin className="w-4 h-4 mr-2" />
                      Post to LinkedIn
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-100/70 pt-5">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Performance Analytics
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
                            className="rounded-t bg-gradient-to-b from-primary/70 to-secondary/70 w-full h-full"
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
  );
}
