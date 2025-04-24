import React, { useState } from 'react';
import { useKonvaCarousel } from '../../contexts/KonvaCarouselContext';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { CopyCheck, Upload, Image as ImageIcon } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { toast } from '@/components/ui/use-toast';

const BackgroundPanel = () => {
  const { 
    slides, 
    currentSlideIndex, 
    updateSlideBackground, 
    updateAllSlidesBackground,
    updateAllSlidesBackgroundImage
  } = useKonvaCarousel();
  
  const currentSlide = slides[currentSlideIndex];
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleBackgroundChange = (color: string) => {
    if (!currentSlide) return;
    updateSlideBackground(currentSlide.id, color);
  };

  const handleApplyToAllSlides = () => {
    if (!currentSlide) return;
    updateAllSlidesBackground(currentSlide.backgroundColor);
    
    toast({
      title: "Applied to all slides",
      description: "Background color has been applied to all slides",
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentSlide) return;
    
    setUploadingImage(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        updateSlideBackground(currentSlide.id, currentSlide.backgroundColor, event.target.result);
        setUploadingImage(false);
        
        toast({
          title: "Background image added",
          description: "Image has been set as the slide background",
        });
      }
    };
    
    reader.onerror = () => {
      setUploadingImage(false);
      toast({
        title: "Error",
        description: "Failed to load image",
        variant: "destructive"
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleApplyImageToAllSlides = () => {
    if (!currentSlide || !currentSlide.backgroundImage) return;
    
    updateAllSlidesBackgroundImage(currentSlide.backgroundImage);
    
    toast({
      title: "Applied to all slides",
      description: "Background image has been applied to all slides",
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="font-medium text-lg">Background</h2>
      
      {currentSlide ? (
        <div className="space-y-4">
          {/* Color picker */}
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
            Apply Color to All Slides
          </Button>
          
          {/* Background image section */}
          <div className="space-y-2 pt-2 border-t">
            <Label>Background Image</Label>
            
            {currentSlide.backgroundImage ? (
              <div className="space-y-2">
                <div className="relative aspect-video rounded-md overflow-hidden border">
                  <img 
                    src={currentSlide.backgroundImage} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center gap-2"
                  onClick={handleApplyImageToAllSlides}
                >
                  <CopyCheck className="h-4 w-4" />
                  Apply Image to All Slides
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => updateSlideBackground(currentSlide.id, currentSlide.backgroundColor, undefined)}
                >
                  Remove Background Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload an image to use as background</p>
                  <input
                    type="file"
                    id="bg-image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={() => document.getElementById('bg-image-upload')?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-black animate-spin rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
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
