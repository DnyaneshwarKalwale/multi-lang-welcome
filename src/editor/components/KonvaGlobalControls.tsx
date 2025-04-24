import React, { useState } from 'react';
import { useKonvaCarousel, CANVAS_SIZES } from '../contexts/KonvaCarouselContext';
import { HexColorPicker } from 'react-colorful';
import { 
  PaintBucket, 
  ImagePlus, 
  Text, 
  Square,
  Share,
  Download,
  Palette,
  Image as ImageIcon,
  CopyCheck
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const KonvaGlobalControls: React.FC = () => {
  const { 
    slides, 
    currentSlideIndex,
    updateSlideBackground,
    updateAllSlidesBackground,
    updateAllSlidesBackgroundImage,
    addNode,
    toggleCanvasSize,
    currentCanvasSize,
    setCurrentSlideIndex
  } = useKonvaCarousel();
  
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [applyToAllSlides, setApplyToAllSlides] = useState(false);
  const [applyImageToAllSlides, setApplyImageToAllSlides] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [backgroundMenuOpen, setBackgroundMenuOpen] = useState(false);
  
  const currentSlide = slides[currentSlideIndex];
  
  // Handle background color changes
  const handleBackgroundColorChange = (color: string) => {
    if (!currentSlide) return;
    
    if (applyToAllSlides) {
      updateAllSlidesBackground(color);
    } else {
      updateSlideBackground(currentSlide.id, color);
    }
  };
  
  // Add a new text element
  const addTextElement = () => {
    if (!currentSlide) return;
    
    addNode(currentSlide.id, {
      type: 'text',
      text: 'Double-click to edit',
      position: {
        x: currentCanvasSize.width / 2 - 100,
        y: currentCanvasSize.height / 2 - 20
      },
      fontSize: 24,
      fontFamily: 'Inter',
      fill: '#000000',
      align: 'center',
      draggable: true,
      zIndex: 10
    });
  };
  
  // Add a new image
  const addImageElement = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentSlide) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size and type
    if (file.size > 10 * 1024 * 1024 || !file.type.startsWith('image/')) {
      return; // Error handling could be added here
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        // Create a temporary image to get dimensions
        const img = new Image();
        img.onload = () => {
          // Scale image if it's too large
          let width = img.width;
          let height = img.height;
          
          const maxDimension = 600;
          if (width > maxDimension || height > maxDimension) {
            const aspectRatio = width / height;
            if (width > height) {
              width = maxDimension;
              height = width / aspectRatio;
            } else {
              height = maxDimension;
              width = height * aspectRatio;
            }
          }
          
          // Add the image node
          addNode(currentSlide.id, {
            type: 'image',
            src: event.target.result as string,
            position: {
              x: (currentCanvasSize.width - width) / 2,
              y: (currentCanvasSize.height - height) / 2
            },
            size: {
              width,
              height
            },
            draggable: true,
            zIndex: 1
          });
        };
        img.src = event.target.result as string;
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  // Handle background image upload
  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentSlide) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const imageUrl = event.target.result;
        
        if (applyImageToAllSlides) {
          // Apply to all slides
          updateAllSlidesBackgroundImage(imageUrl);
        } else {
          // Apply to current slide only
          updateSlideBackground(
            currentSlide.id, 
            currentSlide.backgroundColor, 
            imageUrl
          );
        }
      }
    };
    
    reader.readAsDataURL(file);
  };

  // Remove background image
  const removeBackgroundImage = () => {
    if (!currentSlide) return;
    updateSlideBackground(currentSlide.id, currentSlide.backgroundColor, undefined);
  };
  
  // Export all slides as PDF
  const exportToPDF = async () => {
    setExportLoading(true);
    setExportProgress(0);
    
    try {
      // Store original slide index to restore it later
      const originalSlideIndex = currentSlideIndex;
      
      // Create PDF with slide dimensions
      const pdf = new jsPDF({
        orientation: currentCanvasSize.width > currentCanvasSize.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [currentCanvasSize.width, currentCanvasSize.height]
      });
      
      // Dispatch event to prepare for export
      window.dispatchEvent(new CustomEvent('carousel-export-start'));
      
      for (let i = 0; i < slides.length; i++) {
        // Update progress
        setExportProgress(Math.round(((i) / slides.length) * 100));
        
        // Change to the slide we want to export
        setCurrentSlideIndex(i);
        
        // Wait for the slide to be fully rendered
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get the stage element
        const stageElement = document.querySelector(`#slide-${slides[i].id}`);
        if (!stageElement) continue;
        
        // Get canvas from stage
        const canvas = await html2canvas(stageElement as HTMLElement, {
          scale: 2, // Higher quality
          logging: false,
          backgroundColor: slides[i].backgroundColor,
          useCORS: true, // Allow cross-origin images
          allowTaint: true
        });
        
        // Add to PDF
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(
          imgData, 
          'PNG', 
          0, 
          0, 
          currentCanvasSize.width, 
          currentCanvasSize.height
        );
        
        // Small delay to ensure PDF processing is complete
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Save PDF
      pdf.save('carousel-slides.pdf');
      
      // Restore original slide index
      setCurrentSlideIndex(originalSlideIndex);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExportLoading(false);
      setExportProgress(100);
      // Dispatch event to indicate export is done
      window.dispatchEvent(new CustomEvent('carousel-export-end'));
    }
  };
  
  // Helper to determine canvas ratio label
  const canvasRatioLabel = 
    currentCanvasSize.width === CANVAS_SIZES.LINKEDIN_PORTRAIT.width && 
    currentCanvasSize.height === CANVAS_SIZES.LINKEDIN_PORTRAIT.height
      ? '4:5'
      : '1:1';
  
  return (
    <div className="p-4 bg-white border-b">
      <div className="flex flex-wrap gap-2 justify-between">
        {/* Element Controls */}
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
            onClick={addTextElement}
          >
            <Text className="h-4 w-4" />
            <span className="text-sm">Add Text</span>
          </button>
          
          <label className="flex items-center justify-center gap-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors cursor-pointer">
            <ImagePlus className="h-4 w-4" />
            <span className="text-sm">Add Image</span>
            <input 
              type="file"
              accept="image/*"
              className="hidden"
              onChange={addImageElement}
            />
          </label>
        </div>
        
        {/* Background Controls */}
        <div className="relative">
          <button
            className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
            onClick={() => setBackgroundMenuOpen(!backgroundMenuOpen)}
          >
            <PaintBucket className="h-4 w-4" />
            <span className="text-sm">Background</span>
            <div 
              className="w-4 h-4 rounded-full border" 
              style={{ backgroundColor: currentSlide?.backgroundColor || '#ffffff' }}
            ></div>
          </button>
          
          {backgroundMenuOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white p-3 rounded-md shadow-lg border z-20 w-64">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-6 h-6 border rounded-md cursor-pointer" 
                    style={{ backgroundColor: currentSlide?.backgroundColor || '#ffffff' }}
                  />
                  <input
                    type="text"
                    className="border rounded-md px-2 py-1 w-24 text-sm"
                    value={currentSlide?.backgroundColor || '#ffffff'}
                    onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  />
                </div>
                <HexColorPicker
                  color={currentSlide?.backgroundColor || '#ffffff'}
                  onChange={handleBackgroundColorChange}
                  className="w-full mb-3"
                />
                
                <div className="mb-3">
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox"
                      checked={applyToAllSlides}
                      onChange={(e) => setApplyToAllSlides(e.target.checked)}
                    />
                    Apply color to all slides
                  </label>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Image
                  </label>
                  
                  <label className="flex items-center justify-center gap-1 w-full py-2 px-3 border border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer mb-2">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Upload background image</span>
                    <input 
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBackgroundImageUpload}
                    />
                  </label>
                  
                  <div className="mb-3">
                    <label className="flex items-center gap-2 text-xs">
                      <input 
                        type="checkbox"
                        checked={applyImageToAllSlides}
                        onChange={(e) => setApplyImageToAllSlides(e.target.checked)}
                      />
                      Apply image to all slides
                    </label>
                  </div>
                  
                  {currentSlide?.backgroundImage && (
                    <div>
                      <button
                        className="w-full text-sm text-blue-600 hover:text-blue-700 py-1 mb-1 flex items-center justify-center gap-1"
                        onClick={() => updateAllSlidesBackgroundImage(currentSlide.backgroundImage!)}
                      >
                        <CopyCheck className="h-3 w-3" />
                        Apply current image to all slides
                      </button>
                      
                      <button
                        className="w-full text-sm text-red-600 hover:text-red-700 py-1"
                        onClick={removeBackgroundImage}
                      >
                        Remove background image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Canvas Controls */}
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
            onClick={toggleCanvasSize}
          >
            <Square className="h-4 w-4" />
            <span className="text-sm">{canvasRatioLabel}</span>
          </button>
          
          <button
            className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
            onClick={exportToPDF}
            disabled={exportLoading}
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">Export PDF</span>
          </button>
        </div>
      </div>
      
      {/* Export Progress */}
      {exportLoading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Exporting slides: {exportProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default KonvaGlobalControls; 