import React, { useState } from 'react';
import { useCarousel } from '../../contexts/CarouselContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { CopyCheck, Maximize2, FileText } from 'lucide-react';
import { importPdfAsSlides } from '../../utils/export';
import { getPdfPageCount, createPdfDataUrl } from '../../utils/pdfUtils';
import AddPdfButton from './AddPdfButton';
import { LINKEDIN_SLIDE_WIDTH, LINKEDIN_SLIDE_HEIGHT } from '../../constants';

const UploadPanel = () => {
  const [imageType, setImageType] = useState<'background' | 'overlay'>('background');
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 400, height: 400 });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { slides, currentSlideIndex, addImageElement, applyImageToAllSlides, addPdfElement, addSlide, setCurrentSlideIndex } = useCarousel();
  const currentSlide = slides[currentSlideIndex];
  const [uploadType, setUploadType] = useState<'image' | 'pdf'>('image');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentSlide || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        const result = event.target.result as string;
        setImageUrl(result);
        
        if (imageType === 'background') {
        addImageElement(currentSlide.id, {
            type: 'background',
            imageUrl: result,
            src: result,
            alt: file.name,
            position: { x: 0, y: 0 },
            size: { width: 1080, height: 1080 }
        });
        
        toast({
            title: "Background image added",
            description: "You can apply this background to all slides",
          });
        } else {
          // For overlay, don't add immediately - let user adjust size first
          toast({
            title: "Image ready",
            description: "Adjust size and click Add to Slide",
        });
        }
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }
    
    setPdfFile(file);
    
    toast({
      title: "PDF ready",
      description: "You can add this PDF to the current slide or import it as multiple slides",
    });
  };

  const handleAddPdf = async () => {
    if (!currentSlide || !pdfFile) return;
    
    try {
      // Create a URL for the PDF file
      const pdfUrl = URL.createObjectURL(pdfFile);
      
      // Get the number of pages in the PDF
      const pageCount = await getPdfPageCount(pdfFile);

      // Define PDF dimensions
      const pdfWidth = 500;
      const pdfHeight = 700;
      
      // Calculate center position for the PDF element - use the center of the slide
      const centerX = LINKEDIN_SLIDE_WIDTH / 2;
      const centerY = LINKEDIN_SLIDE_HEIGHT / 2;
      
      // Add the PDF to the slide
      addPdfElement(currentSlide.id, {
        src: pdfUrl,
        currentPage: 1,
        totalPages: pageCount,
        position: { x: centerX, y: centerY },
        size: { width: pdfWidth, height: pdfHeight }
      });
      
      toast({
        title: "PDF added",
        description: "PDF added to current slide",
      });
    } catch (error) {
      console.error("Error adding PDF:", error);
      toast({
        title: "Error adding PDF",
        description: "There was an error processing your PDF file",
        variant: "destructive"
      });
    }
  };

  const handleImportPdfAsSlides = async () => {
    if (!pdfFile) return;
    
    try {
      toast({
        title: "Processing PDF",
        description: "Creating slides from your PDF...",
      });
      
      // Import the PDF and create slides
      const newSlides = await importPdfAsSlides(pdfFile);
      
      if (newSlides.length > 0) {
        // Add the slides to the carousel
        newSlides.forEach(slide => {
          // Call the add slide function with the prepared slide
          addSlide(undefined, slide); // Pass undefined as template and the prepared slide
        });
        
        // Navigate to the first new slide
        setCurrentSlideIndex(slides.length);
        
        setPdfFile(null);
      }
    } catch (error) {
      console.error("Error importing PDF:", error);
      toast({
        title: "Import failed",
        description: "There was an error processing the PDF",
        variant: "destructive"
      });
    }
  };

  const handleAddOverlayImage = () => {
    if (!currentSlide || !imageUrl) return;
    
    // Use the center of the canvas for better positioning
    // LinkedIn canvas size is 1080x1080, and we use a center positioning approach
    // Calculate the center position for the overlay image
    const centerX = LINKEDIN_SLIDE_WIDTH / 2;
    const centerY = LINKEDIN_SLIDE_HEIGHT / 2;
    
    addImageElement(currentSlide.id, {
      type: 'overlay',
      imageUrl: imageUrl,
      src: imageUrl,
      alt: 'Overlay image',
      position: { x: centerX, y: centerY },
      size: { width: imageSize.width, height: imageSize.height }
    });
    
    toast({
      title: "Overlay image added",
      description: "Image added to current slide",
    });
  };

  const handleApplyToAllSlides = () => {
    if (!imageUrl) return;
    
    applyImageToAllSlides({
      type: 'background',
      imageUrl: imageUrl,
      src: imageUrl,
      alt: 'Background image',
      position: { x: 0, y: 0 },
      size: { width: 1080, height: 1080 }
    });
    
    toast({
      title: "Background applied",
      description: "Background image applied to all slides",
    });
  };

  const handleSizeChange = (value: number[]) => {
    if (value.length > 0) {
      const newSize = value[0];
      const aspectRatio = imageSize.width / imageSize.height;
      
      setImageSize({
        width: newSize,
        height: newSize / aspectRatio
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-medium text-lg">Upload Media</h2>
      
      {currentSlide ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={uploadType === 'image' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setUploadType('image')}
              >
                Image
              </Button>
              <Button
                type="button"
                size="sm"
                variant={uploadType === 'pdf' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setUploadType('pdf')}
              >
                PDF
              </Button>
            </div>
          </div>
          
          {uploadType === 'image' && (
            <>
              <div className="space-y-2">
                <Label>Image Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={imageType === 'background' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setImageType('background')}
                  >
                    Background
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={imageType === 'overlay' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setImageType('overlay')}
              >
                Overlay
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUpload">Upload Image</Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-brand-blue focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-blue focus-within:ring-offset-2 hover:text-brand-blue-light"
                  >
                    <span>Upload a file</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

              {/* Image preview and resize controls - only show for overlay type */}
              {imageUrl && imageType === 'overlay' && (
                <div className="space-y-3 p-3 border rounded-md">
                  <div className="text-sm font-medium">Resize Image</div>
                  
                  <div className="w-full h-24 flex justify-center items-center bg-slate-100 rounded-md">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <Slider
                        defaultValue={[400]}
                        min={100}
                        max={800}
                        step={10}
                        onValueChange={handleSizeChange}
                      />
                    </div>
                    <span className="text-xs font-medium">{Math.round(imageSize.width)}px</span>
                  </div>
                  
                  <Button 
                    onClick={handleAddOverlayImage} 
                    className="w-full" 
                    size="sm"
                  >
                    Add to Slide
                  </Button>
                </div>
              )}
              
              {/* Apply background to all slides - only show for background */}
              {imageUrl && imageType === 'background' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center gap-2" 
                  onClick={handleApplyToAllSlides}
                >
                  <CopyCheck className="h-4 w-4" />
                  Apply to All Slides
                </Button>
              )}
            </>
          )}
          
          {uploadType === 'pdf' && (
            <>
              <AddPdfButton />
              
              {pdfFile && (
                <div className="p-4 border rounded-md mt-4">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <p className="text-sm font-medium">{pdfFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round(pdfFile.size / 1024)} KB
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 w-full mt-2">
                      <Button 
                        size="sm" 
                        onClick={handleAddPdf}
                      >
                        Add to Slide
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleImportPdfAsSlides}
                      >
                        Import as Slides
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="col-span-2"
                        onClick={() => setPdfFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border border-dashed rounded-md">
          <p className="text-sm text-gray-500">Select a slide to upload media</p>
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
