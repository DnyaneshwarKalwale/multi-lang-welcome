import axios from 'axios';
import { Slide } from '@/editor/types';
import { LINKEDIN_SLIDE_WIDTH, LINKEDIN_SLIDE_HEIGHT } from '../constants';
import html2canvas from 'html2canvas';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';

// Function to convert Slide structure to backend format
const convertSlideToBackendFormat = async (slide: Slide, index: number) => {
  // Create a content string from text elements with positions
  const content = slide.textElements
    .map(text => text.content || text.text || '')
    .join('\n\n');
  
  // Get the first image element's URL if any
  let imageUrl = '';
  if (slide.imageElements.length > 0) {
    imageUrl = slide.imageElements[0].src;
  }
  
  // Create a metadata object with full slide information
  const metadata = {
    dimensions: {
      width: LINKEDIN_SLIDE_WIDTH,
      height: LINKEDIN_SLIDE_HEIGHT
    },
    textElements: slide.textElements.map(el => ({
      id: el.id,
      text: el.text || el.content || '',
      position: el.position,
      fontSize: el.fontSize,
      fontFamily: el.fontFamily,
      color: el.color
    })),
    imageElements: slide.imageElements.map(el => ({
      id: el.id,
      src: el.src,
      position: el.position,
      size: el.size
    }))
  };
  
  return {
    content,
    imageUrl,
    order: index,
    backgroundColor: slide.backgroundColor,
    metadata: JSON.stringify(metadata)
  };
};

// Function to capture a slide as an image
const captureSlideAsImage = async (slideId: string): Promise<string | null> => {
  try {
    const slideElement = document.getElementById(`slide-${slideId}`);
    if (!slideElement) {
      console.error(`Slide element with id "slide-${slideId}" not found`);
      return null;
    }
    
    // Dispatch event to hide controls before export
    window.dispatchEvent(new Event('carousel-export-start'));
    
    // Small delay to ensure the UI has updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create a clone of the slide with full dimensions
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
    
    // Remove any UI controls
    const controls = slideClone.querySelectorAll('.controls, .resize-handle, .button');
    controls.forEach(control => control.parentNode?.removeChild(control));
    
    const canvas = await html2canvas(slideClone, {
      backgroundColor: null,
      scale: 1, // Use scale 1 for 1:1 pixel mapping
      width: LINKEDIN_SLIDE_WIDTH,
      height: LINKEDIN_SLIDE_HEIGHT,
      useCORS: true,
      allowTaint: true,
    });

    // Clean up the temporary container
    document.body.removeChild(tempContainer);
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // Dispatch event to show controls again after export
    window.dispatchEvent(new Event('carousel-export-end'));
    
    return dataUrl;
  } catch (error) {
    // Make sure to re-enable controls even if there's an error
    window.dispatchEvent(new Event('carousel-export-end'));
    console.error('Error capturing slide as image:', error);
    return null;
  }
};

// Get JWT token from localStorage
const getToken = () => {
  // First check for direct token
  const directToken = localStorage.getItem('token');
  if (directToken) return directToken;
  
  // Then check for auth method tokens
  const authMethod = localStorage.getItem('auth-method');
  if (authMethod) {
    const methodToken = localStorage.getItem(`${authMethod}-login-token`);
    if (methodToken) return methodToken;
  }
  
  // Finally check for specific auth provider tokens
  const linkedinToken = localStorage.getItem('linkedin-login-token');
  if (linkedinToken) return linkedinToken;
  
  const googleToken = localStorage.getItem('google-login-token');
  if (googleToken) return googleToken;
  
  return null;
};

// Get all carousels
export const getCarousels = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    
    const response = await axios.get(`${API_URL}/carousels`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching carousels:', error);
    throw new Error('Failed to fetch carousels');
  }
};

// Get a single carousel by ID
export const getCarouselById = async (id: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    
    const response = await axios.get(`${API_URL}/carousels/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching carousel ${id}:`, error);
    throw new Error('Failed to fetch carousel');
  }
};

// Create a new carousel from slides
export const createCarousel = async (title: string, description: string, slides: Slide[]) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    };
    
    // Capture the first slide as thumbnail
    let thumbnailUrl = '';
    if (slides.length > 0) {
      thumbnailUrl = await captureSlideAsImage(slides[0].id) || '';
    }
    
    // Convert slides to backend format
    const formattedSlides = await Promise.all(slides.map(async (slide, index) => {
      const formattedSlide = await convertSlideToBackendFormat(slide, index);
      
      // Capture this slide as an image and attach it to the slide data
      const slideImageUrl = await captureSlideAsImage(slide.id);
      if (slideImageUrl) {
        formattedSlide.imageUrl = slideImageUrl;
      }
      
      return formattedSlide;
    }));
    
    const payload = {
      title,
      description,
      slides: formattedSlides,
      status: 'draft',
      thumbnailUrl,
      dimensions: {
        width: LINKEDIN_SLIDE_WIDTH,
        height: LINKEDIN_SLIDE_HEIGHT
      }
    };
    
    const response = await axios.post(`${API_URL}/carousels`, payload, config);
    return response.data;
  } catch (error) {
    console.error('Error creating carousel:', error);
    throw new Error('Failed to create carousel');
  }
};

// Update an existing carousel
export const updateCarousel = async (id: string, title: string, description: string, slides: Slide[], status?: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    };
    
    // Capture the first slide as thumbnail
    let thumbnailUrl = '';
    if (slides.length > 0) {
      thumbnailUrl = await captureSlideAsImage(slides[0].id) || '';
    }
    
    // Convert slides to backend format
    const formattedSlides = await Promise.all(slides.map(async (slide, index) => {
      const formattedSlide = await convertSlideToBackendFormat(slide, index);
      
      // Capture this slide as an image and attach it to the slide data
      const slideImageUrl = await captureSlideAsImage(slide.id);
      if (slideImageUrl) {
        formattedSlide.imageUrl = slideImageUrl;
      }
      
      return formattedSlide;
    }));
    
    const payload = {
      title,
      description,
      slides: formattedSlides,
      thumbnailUrl,
      dimensions: {
        width: LINKEDIN_SLIDE_WIDTH,
        height: LINKEDIN_SLIDE_HEIGHT
      }
    };
    
    // Add status if provided
    if (status) {
      payload.status = status;
    }
    
    const response = await axios.put(`${API_URL}/carousels/${id}`, payload, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating carousel ${id}:`, error);
    throw new Error('Failed to update carousel');
  }
};

// Delete a carousel
export const deleteCarousel = async (id: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    
    const response = await axios.delete(`${API_URL}/carousels/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting carousel ${id}:`, error);
    throw new Error('Failed to delete carousel');
  }
};

// Download a carousel as PDF
export const downloadCarouselPdf = async (id: string, title: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      responseType: 'blob' as 'blob',
    };
    
    const response = await axios.get(`${API_URL}/carousels/${id}/download`, config);
    
    // Create a blob from the PDF data
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
    
    // Append to the body
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error(`Error downloading carousel ${id} as PDF:`, error);
    throw new Error('Failed to download carousel as PDF');
  }
}; 