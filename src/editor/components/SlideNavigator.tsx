import React from 'react';
import { useCarousel } from '../contexts/CarouselContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Plus, 
  Trash, 
  MoveUp, 
  MoveDown, 
  Linkedin 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SlideNavigator = () => {
  const { 
    slides, 
    currentSlideIndex, 
    setCurrentSlideIndex,
    addSlide,
    removeSlide,
    duplicateSlide
  } = useCarousel();

  const handleAddSlide = () => {
    addSlide();
    toast({
      title: "Slide added",
      description: "New blank slide created",
    });
  };

  const handleRemoveSlide = () => {
    if (slides.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one slide",
        variant: "destructive"
      });
      return;
    }
    
    removeSlide(slides[currentSlideIndex].id);
    toast({
      title: "Slide removed",
      description: "Slide has been deleted",
    });
  };

  const handleDuplicateSlide = () => {
    duplicateSlide(slides[currentSlideIndex].id);
    toast({
      title: "Slide duplicated",
      description: "A copy of the slide has been created",
    });
  };

  // Get preview text for the slide (first 30 characters of the first text element)
  const getSlidePreviewText = (index: number) => {
    const slide = slides[index];
    if (!slide || !slide.textElements.length) return '';
    
    const text = slide.textElements[0].text;
    return text.length > 30 ? `${text.substring(0, 30)}...` : text;
  };

  return (
    <div className="h-28 border-t flex flex-col bg-white shadow-sm">
      <div className="h-full flex items-center justify-between px-4">
        <TooltipProvider>
      <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
        <Button
                  variant="ghost"
          size="icon"
          onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
          disabled={currentSlideIndex === 0}
                  className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
              </TooltipTrigger>
              <TooltipContent>Previous slide</TooltipContent>
            </Tooltip>
            
            <div className="flex items-center space-x-2 overflow-x-auto p-2 max-w-4xl scrollbar-thin scrollbar-thumb-gray-300">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
                  className={`
                    relative 
                    w-20 
                    h-20 
                    rounded-md 
                    cursor-pointer 
                    flex-shrink-0 
                    shadow-sm 
                    border
                    ${index === currentSlideIndex 
                      ? 'border-primary ring-2 ring-primary ring-opacity-30' 
                      : 'border-gray-200'
                    }
                    transition-all
                    hover:scale-105
                    overflow-hidden
                  `}
              onClick={() => setCurrentSlideIndex(index)}
                >
                  {/* Slide thumbnail with LinkedIn styling */}
                  <div 
                    className="w-full h-full flex items-center justify-center p-1"
              style={{ backgroundColor: slide.backgroundColor }}
                  >
                    <div className="text-[7px] line-clamp-3 text-center">
                      {getSlidePreviewText(index)}
                    </div>
                    
                    {/* LinkedIn logo indicator */}
                    <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[5px] px-0.5 rounded flex items-center">
                      <span className="font-bold">in</span>
                    </div>
                    
                    {/* Slide number */}
                    <div className="absolute top-1 right-1 bg-white/80 text-[6px] px-1 rounded-sm text-gray-700 font-medium">
                      {index + 1}/{slides.length}
                    </div>
                  </div>
                </div>
          ))}
        </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
        <Button
                  variant="ghost"
          size="icon"
          onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
          disabled={currentSlideIndex === slides.length - 1 || slides.length === 0}
                  className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
              </TooltipTrigger>
              <TooltipContent>Next slide</TooltipContent>
            </Tooltip>
      </div>
          
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleAddSlide} className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
              </TooltipTrigger>
              <TooltipContent>Add slide</TooltipContent>
            </Tooltip>
            
        {slides.length > 0 && (
          <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleDuplicateSlide} className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate slide</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleRemoveSlide} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash className="h-4 w-4" />
            </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete slide</TooltipContent>
                </Tooltip>
          </>
        )}
          </div>
        </TooltipProvider>
      </div>
      
      {/* Carousel indicator dots */}
      <div className="flex justify-center pb-2 gap-1">
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 rounded-full cursor-pointer transition-all ${
              index === currentSlideIndex ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => setCurrentSlideIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideNavigator;
