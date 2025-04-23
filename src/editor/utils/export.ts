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
      scale: 2, // Higher scale for better quality
      width: LINKEDIN_SLIDE_WIDTH,
      height: LINKEDIN_SLIDE_HEIGHT,
      useCORS: true,
      allowTaint: true,
    });

    // Clean up the temporary container
    document.body.removeChild(tempContainer);
    
    // Convert to a data URL and trigger download
    const dataUrl = canvas.toDataURL('image/png');
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
      scale: 2, // Higher scale for better quality
      width: LINKEDIN_SLIDE_WIDTH,
      height: LINKEDIN_SLIDE_HEIGHT,
      useCORS: true,
      allowTaint: true,
    });

    // Clean up the temporary container
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [LINKEDIN_SLIDE_WIDTH, LINKEDIN_SLIDE_HEIGHT],
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, LINKEDIN_SLIDE_WIDTH, LINKEDIN_SLIDE_HEIGHT);
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
 * Export a carousel as a PDF document
 */
export const exportCarouselAsPdf = async () => {
  try {
    // Notify export start
    window.dispatchEvent(new Event('carousel-export-start'));
    toast({
      title: 'Preparing PDF export...',
      description: 'Please wait while we generate your PDF.'
    });

    // Get all slides
    const slides = document.querySelectorAll('[data-export-slide]');
    if (!slides.length) {
      throw new Error('No slides found to export');
    }

    // Create PDF with compression settings
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [1080, 1080],
      compress: true
    });

    // Create a temporary container for rendering all slides
    const mainContainer = document.createElement('div');
    mainContainer.style.position = 'fixed';
    mainContainer.style.left = '-9999px';
    mainContainer.style.top = '0';
    mainContainer.style.width = '1080px';
    mainContainer.style.height = '1080px';
    document.body.appendChild(mainContainer);

    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      
      // Clear the container for the new slide
      mainContainer.innerHTML = '';

      // Clone the slide and prepare for export
      const slideClone = slide.cloneNode(true) as HTMLElement;
      slideClone.style.transform = 'none';
      slideClone.style.width = '1080px';
      slideClone.style.height = '1080px';
      slideClone.style.position = 'absolute';
      slideClone.style.top = '0';
      slideClone.style.left = '0';
      slideClone.style.display = 'block';
      
      // Remove UI controls from clone
      const controls = slideClone.querySelectorAll('.resize-handle, .drag-handle, .element-controls, .button, .indicator');
      controls.forEach(control => control.remove());
      
      mainContainer.appendChild(slideClone);

      // Wait a bit for images to load
      await new Promise(resolve => setTimeout(resolve, 100));

      // Convert to canvas with optimized settings
      const canvas = await html2canvas(mainContainer, {
        width: 1080,
        height: 1080,
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        imageTimeout: 15000,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-export-slide]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.display = 'block';
          }
        }
      });

      // Convert canvas to compressed image
      const imgData = canvas.toDataURL('image/jpeg', 0.7);

      // Add new page for slides after the first one
      if (i > 0) {
        pdf.addPage([1080, 1080], 'portrait');
      }

      // Add image to PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1080);
    }

    // Clean up
    mainContainer.remove();

    // Set PDF metadata
    pdf.setProperties({
      title: 'LinkedIn Carousel',
      creator: 'BrandOut',
      subject: 'LinkedIn Carousel Export'
    });

    // Save PDF
    const pdfData = pdf.output('datauristring');
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = 'linkedin-carousel.pdf';
    link.click();
    
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
