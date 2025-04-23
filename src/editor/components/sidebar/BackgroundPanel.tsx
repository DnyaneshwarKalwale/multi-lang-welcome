import React from 'react';
import { useCarousel } from '../../contexts/CarouselContext';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { CopyCheck } from 'lucide-react';

const BackgroundPanel = () => {
  const { slides, currentSlideIndex, updateSlideBackground, updateAllSlidesBackground } = useCarousel();
  const currentSlide = slides[currentSlideIndex];

  const handleBackgroundChange = (color: string) => {
    if (!currentSlide) return;
    updateSlideBackground(currentSlide.id, color);
  };

  const handleApplyToAllSlides = () => {
    if (!currentSlide) return;
    updateAllSlidesBackground(currentSlide.backgroundColor);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-medium text-lg">Background</h2>
      
      {currentSlide ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bgColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="bgColor"
                type="color"
                className="w-12 h-10 p-0"
                value={currentSlide.backgroundColor}
                onChange={(e) => handleBackgroundChange(e.target.value)}
              />
              <Input
                value={currentSlide.backgroundColor}
                onChange={(e) => handleBackgroundChange(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2" 
            onClick={handleApplyToAllSlides}
          >
            <CopyCheck className="h-4 w-4" />
            Apply to All Slides
          </Button>
          
          <div className="grid grid-cols-4 gap-2 mt-4">
            {['#FFFFFF', '#3B82F6', '#F97316', '#8B5CF6', 
              '#10B981', '#EF4444', '#F59E0B', '#EC4899'].map((color) => (
              <div
                key={color}
                className="w-full aspect-square rounded-md cursor-pointer border"
                style={{ backgroundColor: color }}
                onClick={() => handleBackgroundChange(color)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          Create a slide to customize its background
        </div>
      )}
    </div>
  );
};

export default BackgroundPanel;
