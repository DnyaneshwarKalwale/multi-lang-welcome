import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselPreviewProps {
  slides: { id: string; content: string; imageUrl?: string }[];
  variant?: 'basic';
  showPreviewIcon?: boolean;
  onPreviewClick?: () => void;
}

export function CarouselPreview({ 
  slides, 
  variant = 'basic', 
  showPreviewIcon = false,
  onPreviewClick
}: CarouselPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
  
  // Simple slide transition
  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };
  
  if (slides.length === 0) {
    return <div className="text-center p-4">No slides to display</div>;
  }
  
  return (
    <div className="relative">
      {/* Smaller LinkedIn dimensions container */}
      <div className="relative overflow-hidden rounded-lg aspect-square w-full max-w-[320px] mx-auto bg-white">
        {showPreviewIcon && (
          <button
            onClick={onPreviewClick}
            className="absolute top-2 right-2 z-20 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full transition-colors"
            aria-label="Preview carousel"
          >
            <Eye size={14} />
          </button>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 flex items-center justify-center"
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
          >
            {/* Display the slide exactly as saved, with image if available */}
            <div className="w-full h-full">
              {slides[currentIndex].imageUrl ? (
                <img 
                  src={slides[currentIndex].imageUrl} 
                  alt={`Slide ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-base font-bold">{slides[currentIndex].content}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-sm z-10 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-sm z-10 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
      
      {/* Simple slide indicators */}
      {slides.length > 1 && (
        <div className="flex justify-center mt-2 gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Slide counter - minimal and unobtrusive */}
      <div className="text-center text-xs text-gray-400 mt-1">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
} 