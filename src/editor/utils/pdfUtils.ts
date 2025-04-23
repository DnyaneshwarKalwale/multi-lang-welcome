import * as pdfjs from 'pdfjs-dist';

// Configure the worker once the module is imported
const initPdfjs = () => {
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    // Set the worker source
    import('pdfjs-dist/build/pdf.worker.mjs')
      .then(worker => {
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      })
      .catch(error => {
        console.error('Error loading PDF.js worker:', error);
      });
  }
};

// Initialize on import
initPdfjs();

/**
 * Gets the number of pages in a PDF file
 * @param file PDF file to analyze
 * @returns Promise resolving to the number of pages
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document using PDF.js
    const loadingTask = pdfjs.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    
    // Return the number of pages
    return pdf.numPages;
  } catch (error) {
    console.error('Error getting PDF page count:', error);
    // Default to 1 page if there's an error
    return 1;
  }
}

/**
 * Renders a specific page of a PDF to a canvas element
 * @param src URL of the PDF file
 * @param pageNumber Page number to render (1-based)
 * @param canvas Canvas element to render to
 * @param scale Scale factor for rendering
 */
export async function renderPdfPageToCanvas(
  src: string,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.0
): Promise<void> {
  try {
    // Load the PDF
    const loadingTask = pdfjs.getDocument(src);
    const pdf = await loadingTask.promise;
    
    // Check if page number is valid
    if (pageNumber < 1 || pageNumber > pdf.numPages) {
      throw new Error(`Invalid page number: ${pageNumber}. PDF has ${pdf.numPages} pages.`);
    }
    
    // Get the page
    const page = await pdf.getPage(pageNumber);
    
    // Get the canvas context
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    // Calculate dimensions at the specified scale
    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Render the PDF page to the canvas
    await page.render({
      canvasContext: context,
      viewport
    }).promise;
  } catch (error) {
    console.error('Error rendering PDF page:', error);
    
    // Draw an error message on the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#f8f9fa';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = '14px Arial';
      context.fillStyle = '#dc2626';
      context.textAlign = 'center';
      context.fillText('Error loading PDF', canvas.width / 2, canvas.height / 2);
    }
  }
}

/**
 * Creates a data URL from a PDF file
 * @param file PDF file
 * @returns Promise resolving to a data URL
 */
export function createPdfDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read PDF file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
} 