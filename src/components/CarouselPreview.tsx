import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SliderVariant } from '@/types/LinkedInPost';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselPreviewProps {
  slides: { id: string; content: string }[];
  variant: SliderVariant;
}

export function CarouselPreview({ slides, variant }: CarouselPreviewProps) {
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
      <div 
        className={`${getContainerClass()} aspect-[3/2] bg-gradient-to-b from-blue-50/80 to-white flex items-center justify-center`}
      >
        {/* Single slide display */}
        {!showMultipleSlides && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0 p-6 flex items-center justify-center"
              initial="enter"
              animate="center"
              exit="exit"
              variants={getSlideVariants()}
              transition={getTransitionSettings()}
            >
              <div className="bg-white rounded-xl p-6 shadow-lg w-full h-full flex flex-col justify-center relative overflow-hidden border border-gray-100">
                {/* Style 1: Professional gradient header */}
                {variant === 'basic' && (
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl"></div>
                )}
                
                {/* Style 2: Circular design element */}
                {variant === 'coverflow' && (
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-100 rounded-full opacity-40"></div>
                )}
                
                {/* Style 3: Corner accent */}
                {variant === 'parallax' && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400 to-amber-200 opacity-70 rounded-bl-full"></div>
                )}
                
                {/* Modern slide content layout */}
                <div className="z-10 flex flex-col h-full justify-center items-center text-center relative px-4">
                  {/* Slide number */}
                  <span className={`text-xs uppercase font-medium tracking-wider mb-3 ${
                    variant === 'basic' ? 'text-white' : 'text-blue-600'
                  }`}>
                    Slide {currentIndex + 1}
                  </span>
                  
                  {/* Title part (first part of content) */}
                  <div className="text-lg font-bold text-gray-800 mb-3">
                    {slides[currentIndex].content.split(':')[0]}
                  </div>
                  
                  {/* Content part (after colon) */}
                  <div className="text-md text-gray-600">
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
          <div className="grid grid-cols-2 gap-3 p-4 w-full h-full">
            {slides.slice(0, 4).map((slide, index) => (
              <motion.div 
                key={slide.id} 
                className={`bg-white rounded-lg shadow-sm border p-3 text-sm overflow-hidden flex flex-col justify-center items-center text-center cursor-pointer transition-all
                  ${index === currentIndex ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-md'}`}
                onClick={() => goToSlide(index)}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <span className="text-xs text-blue-600 font-medium mb-1">Slide {index + 1}</span>
                <p className="text-gray-800">
                  {slide.content.split(':')[0]}
                </p>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Navigation arrows - with improved styling */}
        {!showMultipleSlides && slides.length > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-white rounded-full h-8 w-8 shadow-md z-10 transition-transform hover:scale-110"
              onClick={prevSlide}
            >
              <ChevronLeft size={16} className="text-gray-700" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-white rounded-full h-8 w-8 shadow-md z-10 transition-transform hover:scale-110"
              onClick={nextSlide}
            >
              <ChevronRight size={16} className="text-gray-700" />
            </Button>
          </>
        )}
        
        {/* Pagination dots for basic and pagination variants - with improved styling */}
        {(variant === 'basic' || variant === 'pagination') && slides.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-4' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        )}
        
        {/* Thumbnail navigation for thumbs variant */}
        {variant === 'thumbs' && slides.length > 1 && (
          <div className="absolute -bottom-14 left-0 right-0 flex justify-center gap-2 overflow-x-auto py-2 px-4">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center text-xs font-medium ${
                  index === currentIndex 
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => goToSlide(index)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
        )}
        
        {/* Gallery thumbnails */}
        {variant === 'gallery' && slides.length > 1 && (
          <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-1.5 overflow-x-auto py-2">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className={`flex-shrink-0 w-12 h-8 rounded-sm cursor-pointer ${
                  index === currentIndex 
                    ? 'ring-2 ring-primary' 
                    : 'ring-1 ring-gray-200'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${
                    index % 3 === 0 ? '#e0f2fe' : index % 3 === 1 ? '#ede9fe' : '#fef3c7'
                  } 0%, #ffffff 100%)`
                }}
                onClick={() => goToSlide(index)}
                whileHover={{ y: -2 }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Slide count indicator - with improved styling */}
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium z-10">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
} 