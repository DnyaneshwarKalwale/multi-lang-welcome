import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SliderVariant } from '@/types/LinkedInPost';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselPreviewProps {
  slides: { id: string; content: string }[];
  variant: SliderVariant;
  showPreviewIcon?: boolean;
  onPreviewClick?: () => void;
}

export function CarouselPreview({ 
  slides, 
  variant, 
  showPreviewIcon = false,
  onPreviewClick
}: CarouselPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(variant === 'autoplay');
  
  // Handle autoplay behavior
  useEffect(() => {
    setIsAutoplay(variant === 'autoplay');
    
    let autoplayInterval: number | null = null;
    if (isAutoplay && slides.length > 1) {
      autoplayInterval = window.setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 3000);
    }
    
    return () => {
      if (autoplayInterval) {
        window.clearInterval(autoplayInterval);
      }
    };
  }, [variant, isAutoplay, slides.length]);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Get container class based on variant
  const getContainerClass = () => {
    let baseClass = "relative overflow-hidden rounded-lg border shadow-sm";
    
    if (variant === 'coverflow') {
      baseClass += " perspective-1000";
    }
    
    return baseClass;
  };
  
  // Slide transition variants based on selected variant
  const getSlideVariants = () => {
    switch (variant) {
      case 'fade':
        return {
          enter: { opacity: 0 },
          center: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'coverflow':
        return {
          enter: { opacity: 0, scale: 0.85, rotateY: -25, z: -200, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" },
          center: { opacity: 1, scale: 1, rotateY: 0, z: 0, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" },
          exit: { opacity: 0, scale: 0.85, rotateY: 25, z: -200, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }
        };
      case 'vertical':
        return {
          enter: { opacity: 0, y: 60, scale: 0.95 },
          center: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -60, scale: 0.95 }
        };
      case 'parallax':
        return {
          enter: { opacity: 0, scale: 1.2, x: 100 },
          center: { opacity: 1, scale: 1, x: 0 },
          exit: { opacity: 0, scale: 0.8, x: -100 }
        };
      case 'thumbs':
      case 'gallery':  
        return {
          enter: { opacity: 0, scale: 0.9 },
          center: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 }
        };
      case 'looped':
        return {
          enter: { opacity: 0, x: "100%", scale: 0.85 },
          center: { opacity: 1, x: "0%", scale: 1 },
          exit: { opacity: 0, x: "-100%", scale: 0.85, transition: { duration: 0.3 } }
        };
      default:
        return {
          enter: { opacity: 0, x: 75, scale: 0.95 },
          center: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -75, scale: 0.95 }
        };
    }
  };
  
  // Get transition settings based on variant
  const getTransitionSettings = () => {
    switch(variant) {
      case 'fade':
        return { duration: 0.7, ease: "easeInOut" };
      case 'coverflow':
        return { duration: 0.7, ease: [0.4, 0.0, 0.2, 1] };
      case 'looped':
        return { duration: 0.4, ease: "easeOut" };
      case 'parallax':
        return { duration: 0.8, ease: [0.4, 0.0, 0.2, 1] };
      default:
        return { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] };
    }
  };
  
  // For grid or multi-slide variants
  const showMultipleSlides = variant === 'grid' || variant === 'responsive';
  
  if (slides.length === 0) {
    return <div className="text-center p-8 text-neutral-medium">No slides to display</div>;
  }
  
  return (
    <div className="relative">
      {/* LinkedIn-like dimensions */}
      <div 
        className={`${getContainerClass()} aspect-video max-w-[450px] mx-auto bg-gradient-to-b from-blue-50/80 to-white flex items-center justify-center`}
      >
        {showPreviewIcon && (
          <button
            onClick={onPreviewClick}
            className="absolute top-2 right-2 z-20 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full transition-colors"
            aria-label="Preview carousel"
          >
            <Eye size={14} />
          </button>
        )}
        
        {/* Single slide display */}
        {!showMultipleSlides && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0 p-4 flex items-center justify-center"
              initial="enter"
              animate="center"
              exit="exit"
              variants={getSlideVariants()}
              transition={getTransitionSettings()}
            >
              <div className="bg-white rounded-lg p-4 shadow-md w-full h-full flex flex-col justify-center relative overflow-hidden border border-gray-100">
                {/* Style 1: Professional gradient header */}
                {variant === 'basic' && (
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg"></div>
                )}
                
                {/* Style 2: Circular design element */}
                {variant === 'coverflow' && (
                  <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-indigo-100 rounded-full opacity-40"></div>
                )}
                
                {/* Style 3: Corner accent */}
                {variant === 'parallax' && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-400 to-amber-200 opacity-70 rounded-bl-full"></div>
                )}
                
                {/* Modern slide content layout */}
                <div className="z-10 flex flex-col h-full justify-center items-center text-center relative px-3">
                  {/* Slide number */}
                  <span className={`text-xs uppercase font-medium tracking-wider mb-2 ${
                    variant === 'basic' ? 'text-white' : 'text-blue-600'
                  }`}>
                    {currentIndex + 1}/{slides.length}
                  </span>
                  
                  {/* Title part (first part of content) */}
                  <div className="text-base font-bold text-gray-800 mb-2">
                    {slides[currentIndex].content.split(':')[0]}
                  </div>
                  
                  {/* Content part (after colon) */}
                  <div className="text-sm text-gray-600">
                    {slides[currentIndex].content.split(':').length > 1 ? 
                      slides[currentIndex].content.split(':').slice(1).join(':') : ''}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        
        {/* Multiple slides display (grid variant) */}
        {showMultipleSlides && (
          <div className="grid grid-cols-2 gap-2 p-3 w-full h-full">
            {slides.slice(0, 4).map((slide, index) => (
              <motion.div 
                key={slide.id} 
                className={`bg-white rounded-lg shadow-sm border p-2 text-xs overflow-hidden flex flex-col justify-center items-center text-center cursor-pointer transition-all
                  ${index === currentIndex ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-md'}`}
                onClick={() => goToSlide(index)}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                {slide.content.split(':')[0]}
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Navigation arrows */}
        {slides.length > 1 && !showMultipleSlides && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md z-10 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md z-10 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
      
      {/* Slide indicators */}
      {slides.length > 1 && !showMultipleSlides && (
        <div className="flex justify-center mt-2 gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary w-4' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 