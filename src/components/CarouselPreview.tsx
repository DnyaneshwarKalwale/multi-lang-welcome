import React, { useState } from 'react';
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
          enter: { opacity: 0, scale: 0.8, rotateY: -45, z: -300 },
          center: { opacity: 1, scale: 1, rotateY: 0, z: 0 },
          exit: { opacity: 0, scale: 0.8, rotateY: 45, z: -300 }
        };
      case 'vertical':
        return {
          enter: { opacity: 0, y: 50 },
          center: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -50 }
        };
      default:
        return {
          enter: { opacity: 0, x: 100 },
          center: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -100 }
        };
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
        className={`relative overflow-hidden rounded-lg bg-neutral-lightest border aspect-[4/3] flex items-center justify-center`}
      >
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
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="bg-white rounded-lg p-6 shadow-sm w-full h-full overflow-y-auto flex flex-col justify-center">
                <p className="text-sm text-center">{slides[currentIndex].content}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        
        {/* Multiple slides display (grid variant) */}
        {showMultipleSlides && (
          <div className="grid grid-cols-2 gap-2 p-3 w-full h-full">
            {slides.slice(0, 4).map((slide, index) => (
              <div 
                key={slide.id} 
                className={`bg-white rounded border p-2 text-xs overflow-hidden flex items-center justify-center text-center 
                  ${index === currentIndex ? 'ring-2 ring-primary' : ''}`}
                onClick={() => goToSlide(index)}
              >
                {slide.content.length > 50 
                  ? `${slide.content.substring(0, 50)}...` 
                  : slide.content}
              </div>
            ))}
          </div>
        )}
        
        {/* Navigation arrows */}
        {!showMultipleSlides && slides.length > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
              onClick={prevSlide}
            >
              <ChevronLeft size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
              onClick={nextSlide}
            >
              <ChevronRight size={18} />
            </Button>
          </>
        )}
        
        {/* Pagination dots for basic and pagination variants */}
        {(variant === 'basic' || variant === 'pagination') && slides.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-neutral-medium/30'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Slide count indicator */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
} 