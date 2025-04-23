import React, { useState, useEffect, useRef } from 'react';
import { useCarousel } from '../contexts/CarouselContext';
import TextElement from './TextElement';
import ImageElement from './ImageElement';
import PdfElement from './PdfElement';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LINKEDIN_SLIDE_WIDTH, LINKEDIN_SLIDE_HEIGHT } from '../constants';
import { cn } from '@/lib/utils';

// Canvas scale for display purposes
const CANVAS_SCALE = 0.35;

const Canvas = () => {
  const { slides, currentSlideIndex, setCurrentSlideIndex, addSlide } = useCarousel();
  const currentSlide = slides[currentSlideIndex];
  const [isPrinting, setIsPrinting] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Enhanced debugging to help identify render issues
  useEffect(() => {
    console.log("Canvas rendered with slides:", slides?.length);
    console.log("Current slide index:", currentSlideIndex);
    console.log("Current slide:", currentSlide);
    
    // Check and log specific slide details for better debugging
    if (slides && slides.length > 0) {
      console.log("First slide details:", slides[0]);
      console.log("First slide text elements:", slides[0]?.textElements?.length);
    }
  }, [slides, currentSlideIndex, currentSlide]);
  
  // Force a re-render after loading to ensure slides appear
  useEffect(() => {
    // Initial render
    setForceRender(prev => prev + 1);
    
    // Then force another render after a delay
    const timer = setTimeout(() => {
      setForceRender(prev => prev + 1);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [slides.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys if no element is being edited
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA' ||
          document.activeElement?.getAttribute('contenteditable') === 'true') {
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        handlePreviousSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlideIndex, slides.length]);

  // Listen for print/export events
  useEffect(() => {
    const handleExportStart = () => setIsPrinting(true);
    const handleExportEnd = () => setIsPrinting(false);

    window.addEventListener('beforeprint', handleExportStart);
    window.addEventListener('afterprint', handleExportEnd);
    window.addEventListener('carousel-export-start', handleExportStart);
    window.addEventListener('carousel-export-end', handleExportEnd);

    return () => {
      window.removeEventListener('beforeprint', handleExportStart);
      window.removeEventListener('afterprint', handleExportEnd);
      window.removeEventListener('carousel-export-start', handleExportStart);
      window.removeEventListener('carousel-export-end', handleExportEnd);
    };
  }, []);

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };
  
  const handleAddNewSlide = () => {
    addSlide();
  };

  // Render function for a single slide
  const renderSlide = (slide: typeof currentSlide, isVisible: boolean) => {
    if (!slide) {
      console.warn("Attempted to render undefined slide");
      return null;
    }
    
    // Verify content is ready to render
    const hasTextElements = slide.textElements && slide.textElements.length > 0;
    const hasImageElements = slide.imageElements && slide.imageElements.length > 0;
    const hasPdfElements = slide.pdfElements && slide.pdfElements.length > 0;
    
    // Log slide content for debugging
    console.log(`Rendering slide ${slide.id}:`, {
      hasTextElements,
      textElementsCount: slide.textElements?.length,
      hasImageElements,
      hasPdfElements,
      backgroundColor: slide.backgroundColor
    });
    
    return (
      <motion.div 
        key={slide.id}
        className="absolute top-0 left-0 origin-top-left slide-canvas"
        style={{ 
          backgroundColor: slide.backgroundColor || '#ffffff',
          width: `${LINKEDIN_SLIDE_WIDTH}px`,
          height: `${LINKEDIN_SLIDE_HEIGHT}px`,
          transform: isPrinting ? 'none' : `scale(${CANVAS_SCALE})`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: isPrinting || isVisible ? 'block' : 'none',
          position: 'absolute',
          top: '0',
          left: '0',
          transformOrigin: '0 0'
        }} 
        id={`slide-${slide.id}`}
        data-export-slide
        initial={isVisible && !isPrinting ? { opacity: 0, scale: CANVAS_SCALE } : false}
        animate={isVisible && !isPrinting ? { opacity: 1, scale: CANVAS_SCALE } : false}
        transition={{ duration: 0.2 }}
      >
        {/* Empty state indicator when no elements */}
        {!hasTextElements && !hasImageElements && !hasPdfElements && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
            <p className="text-sm">Empty slide. Add text or images from the sidebar.</p>
          </div>
        )}
      
        {/* Background images first */}
        {slide.imageElements && slide.imageElements
          .filter(img => img.type === 'background')
          .map(image => (
            <ImageElement 
              key={image.id} 
              slideId={slide.id}
              image={image} 
              isPrinting={isPrinting}
            />
          ))}

        {/* Text elements */}
        {slide.textElements && slide.textElements.map(text => (
          <TextElement
            key={text.id}
            slideId={slide.id}
            text={text}
            isPrinting={isPrinting}
            data-text-element
          />
        ))}

        {/* PDF elements */}
        {slide.pdfElements && slide.pdfElements.map(pdf => (
          <PdfElement
            key={pdf.id}
            slideId={slide.id}
            pdf={pdf}
            isPrinting={isPrinting}
            data-pdf-element
          />
        ))}

        {/* Regular images last (foreground) */}
        {slide.imageElements && slide.imageElements
          .filter(img => img.type !== 'background')
          .map(image => (
            <ImageElement 
              key={image.id} 
              slideId={slide.id}
              image={image} 
              isPrinting={isPrinting}
            />
          ))}
          
        {/* BrandOut logo watermark */}
        {!isPrinting && (
          <div className="absolute bottom-2 left-2 bg-white rounded-md p-1 shadow-sm">
            <img 
              src="/BrandOut.svg" 
              alt="BrandOut" 
              className="h-6 w-auto"
            />
          </div>
        )}
      </motion.div>
    );
  };

  // If there are no slides or current slide is undefined
  if (!slides.length || !currentSlide) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border-2 border-red-200">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-800">No slides available</h3>
          <p className="text-gray-500 mt-2 mb-4">There seems to be an issue loading your slides.</p>
          <Button onClick={handleAddNewSlide}>Create a New Slide</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto bg-slate-50">
      {/* BrandOut logo header */}
      {!isPrinting && (
        <div className="mb-4">
          <img 
            src="/BrandOut.svg" 
            alt="BrandOut" 
            className="h-8 w-auto"
          />
        </div>
      )}
      
      {/* Navigation controls above canvas */}
      {!isPrinting && (
        <div className="flex items-center justify-between w-full max-w-md mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousSlide}
            disabled={currentSlideIndex === 0}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Canvas wrapper */}
      <div
        className={cn(
          "relative shadow-lg rounded-md border overflow-hidden",
          isPrinting && "shadow-none border-0"
        )}
        style={isPrinting ? {
          width: 'auto',
          height: 'auto'
        } : {
          width: `${LINKEDIN_SLIDE_WIDTH * CANVAS_SCALE}px`,
          height: `${LINKEDIN_SLIDE_HEIGHT * CANVAS_SCALE}px`,
          backgroundColor: currentSlide?.backgroundColor || '#ffffff'
        }}
      >
        <div 
          ref={canvasRef}
          className={cn(
            isPrinting && "flex flex-col gap-8"
          )}
          key={`canvas-${forceRender}`}
        >
          {/* Debug panel for development */}
          <div className="absolute top-0 right-0 z-10 text-xs bg-white/80 p-1" style={{display: "none"}}>
            Slides: {slides.length} | Current: {currentSlideIndex}
          </div>
          
          {isPrinting
            ? slides.map(slide => renderSlide(slide, true))
            : renderSlide(currentSlide, true)}
        </div>
      </div>
      
      {/* Information text */}
      {!isPrinting && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>LinkedIn recommended image size: 1080×1080 pixels (1:1 square ratio)</p>
          <p className="mt-1">Drag elements to position • Click elements to edit • Use arrow buttons to navigate slides</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
