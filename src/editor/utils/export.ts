import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/use-toast';
import { Slide, PdfElement } from '../types';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as pdfjs from 'pdfjs-dist';
import { LINKEDIN_SLIDE_WIDTH, LINKEDIN_SLIDE_HEIGHT } from '../constants';
import { getPdfPageCount, createPdfDataUrl } from './pdfUtils';

// Add TypeScript declaration for window.carouselContext
declare global {
  interface Window {
    carouselContext?: {
      slides: Slide[];
      currentSlideIndex: number;
    };
  }
}

// Set worker path for PDF.js
// Initialize PDF.js (moved from top-level await to function)
const initPdfJs = () => {
  try {
    // Use dynamic import for the worker
    import('pdfjs-dist/build/pdf.worker.mjs')
      .then(worker => {
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      })
      .catch(error => {
        console.error('Error loading PDF.js worker:', error);
      });
  } catch (error) {
    console.error('Error initializing PDF.js:', error);
  }
};

// Initialize PDF.js
initPdfJs();

/**
 * Export a slide as a PNG image
 * @param slideId The id of the slide to export
 */
export const exportSlideToPng = async (slideId: string) => {
  const slideElement = document.getElementById(`slide-${slideId}`);
  if (!slideElement) {
    throw new Error(`Slide element with id "slide-${slideId}" not found`);
  }

  try {
    // Dispatch event to hide controls before export
    window.dispatchEvent(new Event('carousel-export-start'));
    
    // Small delay to ensure the UI has updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create a clone of the slide with full dimensions (not scaled down)
    const slideClone = slideElement.cloneNode(true) as HTMLElement;
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.appendChild(slideClone);
    document.body.appendChild(tempContainer);
    
    // Reset the transform to ensure full size rendering
    slideClone.style.transform = 'scale(1)';
    slideClone.style.width = `${LINKEDIN_SLIDE_WIDTH}px`;
    slideClone.style.height = `${LINKEDIN_SLIDE_HEIGHT}px`;
    
    // Remove any UI controls or indicators
    const controls = slideClone.querySelectorAll('.controls, .resize-handle, .button');
    controls.forEach(control => control.parentNode?.removeChild(control));
    
    const canvas = await html2canvas(slideClone, {
      backgroundColor: null,
      scale: 2, // Good balance between quality and file size
      width: LINKEDIN_SLIDE_WIDTH,
      height: LINKEDIN_SLIDE_HEIGHT,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 0 // No timeout for image loading
    });

    // Clean up the temporary container
    document.body.removeChild(tempContainer);
    
    // For PNG we keep a higher quality but use browser compression
    const dataUrl = canvas.toDataURL('image/png', 0.92);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `slide-${slideId}.png`;
    link.click();
    
    // Dispatch event to show controls again after export
    window.dispatchEvent(new Event('carousel-export-end'));
  } catch (error) {
    // Make sure to re-enable controls even if there's an error
    window.dispatchEvent(new Event('carousel-export-end'));
    console.error('Error exporting slide as PNG:', error);
    throw error;
  }
};

/**
 * Export a slide as a PDF document
 * @param slideId The id of the slide to export
 */
export const exportSlideAsPdf = async (slideId: string) => {
  const slideElement = document.getElementById(`slide-${slideId}`);
  if (!slideElement) {
    throw new Error(`Slide element with id "slide-${slideId}" not found`);
  }

  try {
    // Dispatch event to hide controls before export
    window.dispatchEvent(new Event('carousel-export-start'));
    
    // Small delay to ensure the UI has updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create a clone of the slide with full dimensions (not scaled down)
    const slideClone = slideElement.cloneNode(true) as HTMLElement;
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.appendChild(slideClone);
    document.body.appendChild(tempContainer);
    
    // Reset the transform to ensure full size rendering
    slideClone.style.transform = 'scale(1)';
    slideClone.style.width = `${LINKEDIN_SLIDE_WIDTH}px`;
    slideClone.style.height = `${LINKEDIN_SLIDE_HEIGHT}px`;
    
    // Remove any UI controls or indicators
    const controls = slideClone.querySelectorAll('.controls, .resize-handle, .button');
    controls.forEach(control => control.parentNode?.removeChild(control));
    
    const canvas = await html2canvas(slideClone, {
      backgroundColor: null,
      scale: 2.5, // Good balance between quality and file size
      width: LINKEDIN_SLIDE_WIDTH,
      height: LINKEDIN_SLIDE_HEIGHT,
      useCORS: true,
      allowTaint: true,
      logging: false // Disable logging for better performance
    });

    // Clean up the temporary container
    document.body.removeChild(tempContainer);

    // Use JPEG format with optimized compression
    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [LINKEDIN_SLIDE_WIDTH, LINKEDIN_SLIDE_HEIGHT],
      compress: true,
      precision: 3, // Good precision but not excessive
      putOnlyUsedFonts: true
    });
    
    // Add image with optimized settings
    pdf.addImage({
      imageData: imgData,
      format: 'JPEG',
      x: 0,
      y: 0,
      width: LINKEDIN_SLIDE_WIDTH,
      height: LINKEDIN_SLIDE_HEIGHT,
      compression: 'MEDIUM',
      rotation: 0
    });
    
    // Set PDF metadata for better organization
    pdf.setProperties({
      title: 'LinkedIn Slide Export',
      creator: 'BrandOut',
      subject: 'LinkedIn Slide'
    });
    
    // Save the PDF
    pdf.save(`slide-${slideId}.pdf`);
    
    // Dispatch event to show controls again after export
    window.dispatchEvent(new Event('carousel-export-end'));
  } catch (error) {
    // Make sure to re-enable controls even if there's an error
    window.dispatchEvent(new Event('carousel-export-end'));
    console.error('Error exporting slide as PDF:', error);
    throw error;
  }
};

/**
 * Gets the source URL from an image element
 * @param img The image element to get the source from
 * @returns The source URL of the image
 */
function getImageSource(img: any): string {
  return img.src || img.imageUrl || img.url || '';
}

/**
 * Export a carousel as a PDF document using direct canvas rendering
 */
export const exportCarouselAsPdf = async () => {
  try {
    // Notify export start
    window.dispatchEvent(new Event('carousel-export-start'));
    toast({
      title: 'Preparing PDF export...',
      description: 'Please wait while we generate your PDF.'
    });

    // Use a simpler approach - get slides directly from context
    const { slides } = window.carouselContext || {};
    
    if (!slides || slides.length === 0) {
      toast({
        title: 'Export Failed',
        description: 'No slides found to export',
        variant: 'destructive'
      });
      return;
    }
    
    console.log(`Starting export of ${slides.length} slides`);

    // Create PDF with optimized settings for size reduction
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [1080, 1350], // 4:5 ratio (1080x1350)
      compress: true,
      precision: 3, // Good precision but not excessive
      putOnlyUsedFonts: true, // Only include used fonts
      userUnit: 1.0 // Keep default user unit
    });

    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      try {
        console.log(`Processing slide ${i+1} of ${slides.length}`);
      const slide = slides[i];
      
        // Create a canvas for this slide - use 1.2x resolution instead of 1.5x for better size/quality balance
        const canvas = document.createElement('canvas');
        canvas.width = 1296; // 1.2x the original width (1080 * 1.2)
        canvas.height = 1620; // 1.2x the original height (1350 * 1.2)
        const ctx = canvas.getContext('2d', { alpha: false });
        
        if (!ctx) {
          console.error('Could not get canvas context');
          continue;
        }
        
        // Fill background
        ctx.fillStyle = slide.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Scale factor for elements due to our increased canvas size
        const scaleFactor = canvas.width / 1080;
        
        // Draw background images first
        if (slide.imageElements) {
          const backgroundImages = slide.imageElements.filter(img => img.type === 'background');
          
          // Load and draw each background image
          for (const img of backgroundImages) {
            try {
              const imgObj = await loadImage(img.src || img.imageUrl);
              ctx.drawImage(imgObj, 0, 0, canvas.width, canvas.height);
            } catch (err) {
              console.error('Error loading background image:', err);
            }
          }
        }
        
        // Draw regular images
        if (slide.imageElements) {
          const regularImages = slide.imageElements.filter(img => img.type !== 'background');
          
          // Load and draw each image
          for (const img of regularImages) {
            try {
              const imgObj = await loadImage(img.src || img.imageUrl);
              const x = (img.position.x - (img.size.width / 2)) * scaleFactor;
              const y = (img.position.y - (img.size.height / 2)) * scaleFactor;
              const width = img.size.width * scaleFactor;
              const height = img.size.height * scaleFactor;
              
              if (img.isCircle) {
                // Draw circular image
                ctx.save();
                ctx.beginPath();
                const centerX = x + width / 2;
                const centerY = y + height / 2;
                const radius = Math.min(width, height) / 2;
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(imgObj, x, y, width, height);
                ctx.restore();
              } else {
                // Draw regular image
                ctx.drawImage(imgObj, x, y, width, height);
              }
            } catch (err) {
              console.error('Error loading image:', err);
            }
          }
        }
        
        // Draw text elements with improved rendering
        if (slide.textElements) {
          for (const text of slide.textElements) {
            try {
              // Set text styles
              ctx.fillStyle = text.color || '#000000';
              const fontSize = (text.fontSize || 24) * scaleFactor;
              const fontFamily = text.fontFamily || 'Arial';
              const fontWeight = text.fontWeight || '400';
              const fontStyle = text.isItalic ? 'italic' : 'normal';
              
              ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
              ctx.textAlign = text.textAlign === 'center' 
                ? 'center' 
                : text.textAlign === 'right' ? 'right' : 'left';
              
              // Calculate position for text alignment
              let x = text.position.x * scaleFactor;
              if (text.textAlign === 'center') {
                x = text.position.x * scaleFactor;
              } else if (text.textAlign === 'right') {
                x = (text.position.x + ((text.width || 300) / 2)) * scaleFactor;
              } else {
                x = (text.position.x - ((text.width || 300) / 2)) * scaleFactor;
              }
              
              const y = (text.position.y - ((text.height || 40) / 2) + text.fontSize) * scaleFactor;
              
              // If there's a background color, draw a background rectangle
              if (text.backgroundColor) {
                ctx.save();
                ctx.fillStyle = text.backgroundColor;
                const textWidth = ctx.measureText(text.text).width;
                const bgX = text.textAlign === 'center' 
                  ? x - (textWidth / 2) 
                  : text.textAlign === 'right' 
                    ? x - textWidth 
                    : x;
                const bgY = y - fontSize + 2;
                ctx.fillRect(bgX, bgY, textWidth, fontSize + 4);
                ctx.restore();
                
                // Reset fill style after drawing background
                ctx.fillStyle = text.color || '#000000';
              }
              
              // Draw the text with optimized rendering
              ctx.textRendering = 'optimizeLegibility';
              ctx.fillText(text.text, x, y);
            } catch (err) {
              console.error('Error rendering text:', err);
            }
          }
        }
        
        // Add PDF content if needed (showing a placeholder for PDFs)
        if (slide.pdfElements && slide.pdfElements.length > 0) {
          for (const pdf of slide.pdfElements) {
            try {
              const x = pdf.position.x * scaleFactor - (pdf.size.width * scaleFactor / 2);
              const y = pdf.position.y * scaleFactor - (pdf.size.height * scaleFactor / 2);
              const width = pdf.size.width * scaleFactor;
              const height = pdf.size.height * scaleFactor;
              
              // Draw a box placeholder for the PDF
              ctx.strokeStyle = '#cccccc';
              ctx.lineWidth = 2 * scaleFactor;
              ctx.strokeRect(x, y, width, height);
              
              // Add PDF icon or label with optimized text
              ctx.fillStyle = '#666666';
              ctx.font = `bold ${24 * scaleFactor}px Arial`;
              ctx.textAlign = 'center';
              ctx.fillText('PDF content', x + width / 2, y + height / 2);
              
              // Add page number indicator
              ctx.font = `${18 * scaleFactor}px Arial`;
              ctx.fillText(`Page ${pdf.currentPage} of ${pdf.totalPages}`, 
                x + width / 2, y + height / 2 + 30 * scaleFactor);
            } catch (err) {
              console.error('Error rendering PDF placeholder:', err);
            }
          }
        }

      // Add new page for slides after the first one
      if (i > 0) {
          pdf.addPage([1080, 1350], 'portrait');
        }

        // Add the canvas as image to PDF with optimized compression
        // Use a lower JPEG quality (0.85) for much better compression with minimal quality loss
        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        
        // Add image with optimized settings for better compression
        pdf.addImage({
          imageData: imgData,
          format: 'JPEG',
          x: 0,
          y: 0,
          width: 1080,
          height: 1350,
          compression: 'MEDIUM', // Use MEDIUM compression (FAST compresses less)
          rotation: 0,
          alias: `slide_${i + 1}`
        });
        
        console.log(`Added slide ${i+1} to PDF`);
      } catch (error) {
        console.error(`Error processing slide ${i+1}:`, error);
        toast({
          title: 'Warning',
          description: `Slide ${i+1} could not be processed properly`,
          variant: 'destructive' 
        });
      }
    }

    // Apply additional PDF optimization
    const pdfOptions = {
      compress: true,
      precision: 3,
      optimalPdfSize: true
    };

    // Set PDF metadata
    pdf.setProperties({
      title: 'LinkedIn Carousel',
      creator: 'BrandOut',
      subject: 'LinkedIn Carousel Export',
      keywords: 'linkedin,carousel,export'
    });

    // Save PDF with optimized compression
    pdf.save('linkedin-carousel.pdf');
    
    toast({
      title: 'Success',
      description: `Successfully exported ${slides.length} slides to PDF!`,
      variant: 'default'
    });
  } catch (error) {
    console.error('Export error:', error);
    toast({
      title: 'Export Failed',
      description: 'Failed to export PDF. Please try again.',
      variant: 'destructive'
    });
  } finally {
    window.dispatchEvent(new Event('carousel-export-end'));
  }
};

// Helper function to load an image and return a Promise
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
    
    img.src = src;
  });
}

/**
 * Export all slides in a carousel to a zip file
 * @param slides Array of slides to export
 */
export async function exportSlidesToZip(slides: Slide[]) {
  // Dispatch event to hide controls before export
  window.dispatchEvent(new Event('carousel-export-start'));
  
  try {
    const zip = new JSZip();
    
    // Create a folder for images in the zip
    const imgFolder = zip.folder('images');
    
    // Create a folder for PDFs in the zip
    const pdfFolder = zip.folder('pdfs');
    
    // Create a temporary container for rendering slides
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);
    
    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      
      try {
        const slideElement = document.getElementById(`slide-${slide.id}`);
        
        if (slideElement) {
          // Clone the slide
          const slideClone = slideElement.cloneNode(true) as HTMLElement;
          
          // Reset the transform to ensure full size rendering
          slideClone.style.transform = 'scale(1)';
          slideClone.style.width = `${LINKEDIN_SLIDE_WIDTH}px`;
          slideClone.style.height = `${LINKEDIN_SLIDE_HEIGHT}px`;
          slideClone.style.position = 'relative';
          slideClone.style.backgroundColor = slide.backgroundColor || '#ffffff';
          
          // Remove any UI controls or indicators
          const controls = slideClone.querySelectorAll('.controls, .resize-handle, .button, .indicator');
          controls.forEach(control => {
            control.parentNode?.removeChild(control);
          });
          
          tempContainer.innerHTML = '';
          tempContainer.appendChild(slideClone);
          
          // Use html2canvas to capture the slide as an image
          const canvas = await html2canvas(slideClone, {
            backgroundColor: slide.backgroundColor || '#ffffff',
            scale: 2, // Higher scale for better quality
            width: LINKEDIN_SLIDE_WIDTH,
            height: LINKEDIN_SLIDE_HEIGHT,
            logging: false,
            useCORS: true,
            allowTaint: true
          });
          
          // Convert canvas to PNG and add to zip
          canvas.toBlob((blob) => {
            if (blob) {
              zip.file(`slide_${i+1}.png`, blob);
            }
          }, 'image/png');
        } else {
          // Create a virtual slide if the DOM element doesn't exist
          const virtualSlide = document.createElement('div');
          virtualSlide.style.width = `${LINKEDIN_SLIDE_WIDTH}px`;
          virtualSlide.style.height = `${LINKEDIN_SLIDE_HEIGHT}px`;
          virtualSlide.style.position = 'relative';
          virtualSlide.style.backgroundColor = slide.backgroundColor || '#ffffff';
          
          // Add elements to the virtual slide based on the slide data
          // This code would be similar to the virtual slide creation in exportCarouselAsPdf
          
          tempContainer.innerHTML = '';
          tempContainer.appendChild(virtualSlide);
          
          // Use html2canvas to capture the slide as an image
          const canvas = await html2canvas(virtualSlide, {
            backgroundColor: slide.backgroundColor || '#ffffff',
            scale: 2, // Higher scale for better quality
            width: LINKEDIN_SLIDE_WIDTH,
            height: LINKEDIN_SLIDE_HEIGHT,
            logging: false,
            useCORS: true,
            allowTaint: true
          });
          
          // Convert canvas to PNG and add to zip
          canvas.toBlob((blob) => {
            if (blob) {
              zip.file(`slide_${i+1}.png`, blob);
            }
          }, 'image/png');
        }
        
        // Export PDF elements separately if needed
        if (slide.pdfElements && slide.pdfElements.length > 0 && pdfFolder) {
          for (const pdf of slide.pdfElements) {
            if (pdf.src.startsWith('data:') || pdf.src.startsWith('blob:') || pdf.src.startsWith('http')) {
              try {
                const response = await fetch(pdf.src);
                const blob = await response.blob();
                pdfFolder.file(`slide_${i+1}_pdf_${pdf.id}.pdf`, blob);
              } catch (error) {
                console.error('Error fetching PDF:', error);
              }
            }
          }
        }
        
        // Export image elements separately if needed
        if (slide.imageElements && slide.imageElements.length > 0 && imgFolder) {
          for (const img of slide.imageElements) {
            const src = getImageSource(img);
            if (src && (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http'))) {
              try {
                const response = await fetch(src);
                const blob = await response.blob();
                imgFolder.file(`slide_${i+1}_image_${img.id}.png`, blob);
              } catch (error) {
                console.error('Error fetching image:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error processing slide ${i+1}:`, error);
      }
    }
    
    // Clean up temporary container
    document.body.removeChild(tempContainer);
    
    // Generate the zip file and trigger download
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'carousel_export.zip');
    
    toast({
      title: 'Success',
      description: 'Carousel exported as ZIP file',
    });
  } catch (error) {
    console.error('Error generating zip file:', error);
    toast({
      title: 'Export Failed',
      description: 'There was an error exporting the carousel',
      variant: 'destructive'
    });
  } finally {
    // Dispatch event to show controls again after export
    window.dispatchEvent(new Event('carousel-export-end'));
  }
}

/**
 * Import a PDF and create slides from it
 * @param pdfFile The PDF file to import
 */
export const importPdfAsSlides = async (pdfFile: File): Promise<Slide[]> => {
  try {
    // Get the number of pages in the PDF
    const numPages = await getPdfPageCount(pdfFile);
    
    // Create a data URL from the PDF file
    const pdfDataUrl = await createPdfDataUrl(pdfFile);
    
    const slides: Slide[] = [];
    
    // Define PDF dimensions for each slide
    const pdfWidth = 500;
    const pdfHeight = 700;
    
    // Calculate center position
    const centerX = LINKEDIN_SLIDE_WIDTH / 2;
    const centerY = LINKEDIN_SLIDE_HEIGHT / 2;
    
    // Create a slide for each page of the PDF
    for (let i = 1; i <= numPages; i++) {
      // Create a unique ID for the PDF element
      const pdfElementId = `pdf-${Date.now()}-${i}`;
      
      // Create a new slide with the PDF element
      const slide: Slide = {
        id: `slide-${Date.now()}-${i}`,
        backgroundColor: '#ffffff',
        textElements: [],
        imageElements: [],
        pdfElements: [
          {
            id: pdfElementId,
            src: pdfDataUrl,
            currentPage: i,
            totalPages: numPages,
            position: { x: centerX, y: centerY },
            size: { width: pdfWidth, height: pdfHeight }
          }
        ]
      };
      
      slides.push(slide);
    }
    
    return slides;
  } catch (error) {
    console.error('Error importing PDF:', error);
    throw error;
  }
};
