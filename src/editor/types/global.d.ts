import { Slide } from '../contexts/KonvaCarouselContext';

declare global {
  interface Window {
    konvaCarouselContext?: {
      slides: Slide[];
      currentSlideIndex: number;
    };
    carouselContext?: {
      slides: any[];
      currentSlideIndex: number;
    };
  }
} 