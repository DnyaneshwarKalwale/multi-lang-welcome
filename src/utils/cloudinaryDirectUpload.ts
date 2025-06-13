/**
 * Direct Cloudinary Upload Utility
 * This utility allows direct browser-to-Cloudinary uploads without going through our backend
 */

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUD_NAME || 'dexlsqpbvs',
  uploadPreset: import.meta.env.VITE_UPLOAD_PRESET || 'eventapp',
  folder: 'gallery'
};

// Debug log the configuration
console.log('Cloudinary Config:', {
  cloudName: CLOUDINARY_CONFIG.cloudName,
  uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
  usingEnvVars: {
    cloudName: !!import.meta.env.VITE_CLOUD_NAME,
    uploadPreset: !!import.meta.env.VITE_UPLOAD_PRESET
  }
});

// Local storage key for gallery images
const GALLERY_STORAGE_KEY = 'cloudinary_gallery_images';

// Interface for gallery image
export interface CloudinaryImage {
  id: string;
  url: string;
  secure_url: string;
  public_id: string;
  title?: string;
  tags?: string[];
  uploadedAt: string;
  type: 'ai-generated' | 'uploaded';
  width: number;
  height: number;
}

/**
 * Upload image through our secure backend endpoint
 * @param file File object to upload
 * @param options Additional options (folder, tags, etc)
 * @returns Promise with upload result
 */
export const uploadToCloudinaryDirect = async (
  file: File, 
  options: { 
    folder?: string, 
    tags?: string[], 
    title?: string,
    type?: 'ai-generated' | 'uploaded'
  } = {}
): Promise<CloudinaryImage> => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Get the API URL from environment or use default
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
    const apiUrl = baseUrl.endsWith('/api') 
      ? `${baseUrl}/upload/upload`
      : `${baseUrl}/api/upload/upload`;

    // Upload through our backend
    const response = await fetch(apiUrl, {
        method: 'POST',
      body: formData,
      // Include credentials if needed
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }
    
    const data = await response.json();
    
    // Create the result object
    const result: CloudinaryImage = {
      id: data.public_id,
      url: data.url,
      secure_url: data.secure_url,
      public_id: data.public_id,
      title: options.title || file.name.split('.')[0],
      tags: options.tags || [],
      uploadedAt: new Date().toISOString(),
      type: options.type || 'uploaded',
      width: data.width,
      height: data.height
    };
    
    // Save to local storage
    saveImageToGallery(result);
    
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Save image to local storage gallery
 * @param image Image to save
 */
export const saveImageToGallery = (image: CloudinaryImage): void => {
  try {
    // Get existing images
    const storedImages = localStorage.getItem(GALLERY_STORAGE_KEY);
    const images: CloudinaryImage[] = storedImages ? JSON.parse(storedImages) : [];
    
    // Check if image already exists (by public_id)
    const existingIndex = images.findIndex(img => img.public_id === image.public_id);
    
    if (existingIndex >= 0) {
      // Update existing image
      images[existingIndex] = image;
    } else {
      // Add new image to the beginning
      images.unshift(image);
    }
    
    // Save back to local storage
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    console.error('Error saving image to gallery:', error);
  }
};

/**
 * Get all images from gallery
 * @returns Array of gallery images
 */
export const getGalleryImages = (): CloudinaryImage[] => {
  try {
    const storedImages = localStorage.getItem(GALLERY_STORAGE_KEY);
    return storedImages ? JSON.parse(storedImages) : [];
  } catch (error) {
    console.error('Error getting gallery images:', error);
    return [];
  }
};

/**
 * Remove image from gallery
 * @param publicId Public ID of image to remove
 */
export const removeImageFromGallery = (publicId: string): void => {
  try {
    const storedImages = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!storedImages) return;
    
    const images = JSON.parse(storedImages);
    const filteredImages = images.filter((img: CloudinaryImage) => img.public_id !== publicId);
    
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(filteredImages));
  } catch (error) {
    console.error('Error removing image from gallery:', error);
  }
};

/**
 * Get image from gallery by public ID
 * @param publicId Public ID of image
 * @returns Image or null if not found
 */
export const getImageFromGallery = (publicId: string): CloudinaryImage | null => {
  try {
    const images = getGalleryImages();
    return images.find(img => img.public_id === publicId) || null;
  } catch (error) {
    console.error('Error getting image from gallery:', error);
    return null;
  }
}; 