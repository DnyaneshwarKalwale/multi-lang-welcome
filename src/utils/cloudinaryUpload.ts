/**


/**
 * Upload an image directly to Cloudinary
 * @param file The file to upload
 * @returns The uploaded image URL and public ID
 */
export const uploadToCloudinary = async (file: File) => {
  try {
    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
    
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error('Cloudinary configuration missing. Please check your environment variables.');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }
    
    const data = await response.json();
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Generate transformation URL for a Cloudinary image
 * @param publicId The public ID of the image
 * @param options Transformation options
 * @returns The transformed image URL
 */
export const getTransformedUrl = (publicId: string, options: any = {}) => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  
  if (!CLOUD_NAME) {
    throw new Error('Cloudinary configuration missing. Please check your environment variables.');
  }
  
  const {
    width = 800,
    height = 'auto',
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    ...otherOptions
  } = options;
  
  let transformations = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
  
  // Add any other transformations
  Object.entries(otherOptions).forEach(([key, value]) => {
    transformations += `,${key}_${value}`;
  });
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}; 