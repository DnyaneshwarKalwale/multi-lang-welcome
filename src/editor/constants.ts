// LinkedIn slide dimensions
export const LINKEDIN_SLIDE_WIDTH = 1080; // LinkedIn recommended width in pixels
export const LINKEDIN_SLIDE_HEIGHT = 1350; // For a 4:5 portrait ratio - optimal for LinkedIn

// Default slide template
export const defaultSlide = {
  id: '',
  backgroundColor: '#ffffff',
  textElements: [],
  imageElements: [],
  pdfElements: []
};

// Available templates (placeholder for now)
export const availableTemplates = [];

export const DEFAULT_FORMAT = 'portrait';

export const getSlideDimensions = (format: string) => {
  switch (format) {
    case 'square':
      return { width: 1080, height: 1080 };
    case 'portrait':
      return { width: 1080, height: 1350 };
    case 'landscape':
      return { width: 1350, height: 1080 };
    default:
      return { width: 1080, height: 1350 };
  }
}; 