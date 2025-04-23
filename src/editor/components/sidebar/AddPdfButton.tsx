import React, { useState } from 'react';
import { useCarousel } from '../../contexts/CarouselContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getPdfPageCount } from '../../utils/pdfUtils';
import { LINKEDIN_SLIDE_WIDTH, LINKEDIN_SLIDE_HEIGHT } from '../../constants';

const AddPdfButton: React.FC = () => {
  const { addPdfElement, slides, currentSlideIndex } = useCarousel();
  const [isUploading, setIsUploading] = useState(false);
  const currentSlide = slides[currentSlideIndex];

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !currentSlide) {
      return;
    }
    
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('PDF file size must be less than 10MB');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a URL for the PDF file
      const pdfUrl = URL.createObjectURL(file);
      
      // Get the number of pages in the PDF
      const pageCount = await getPdfPageCount(file);
      
      // Define PDF dimensions - maintain these proportions
      const pdfWidth = 500;
      const pdfHeight = 700;
      
      // Calculate center position for the PDF element
      const centerX = LINKEDIN_SLIDE_WIDTH / 2;
      const centerY = LINKEDIN_SLIDE_HEIGHT / 2;
      
      // Add the PDF to the current slide
      addPdfElement(currentSlide.id, {
        src: pdfUrl,
        currentPage: 1,
        totalPages: pageCount,
        position: { x: centerX, y: centerY },
        size: { width: pdfWidth, height: pdfHeight }
      });
      
      toast.success('PDF added to current slide');
      e.target.value = ''; // Reset the file input
    } catch (error) {
      console.error('Error adding PDF:', error);
      toast.error('There was an error processing your PDF file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <Label htmlFor="pdf-upload">Add PDF to Slide</Label>
      <div className="mt-2 flex items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 hover:border-primary transition-colors">
        <label
          htmlFor="pdf-upload"
          className="w-full cursor-pointer text-center"
        >
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-primary">
              {isUploading ? 'Uploading...' : 'Upload PDF'}
            </span>
            <p className="text-xs text-gray-500">Click to browse or drag and drop</p>
          </div>
          <input 
            id="pdf-upload" 
            type="file" 
            className="sr-only" 
            onChange={handlePdfUpload}
            accept="application/pdf"
            disabled={isUploading || !currentSlide}
          />
        </label>
      </div>
    </div>
  );
};

export default AddPdfButton; 