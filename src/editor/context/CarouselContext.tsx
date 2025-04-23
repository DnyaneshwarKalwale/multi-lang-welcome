import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Slide, TextElement, ImageElement, PdfElement, Template } from '../types';
import { defaultSlide, availableTemplates } from '../constants';

interface CarouselContextType {
  slides: Slide[];
  selectedSlideId: string | null;
  selectedElementId: string | null;
  addSlide: (templateId?: string) => void;
  removeSlide: (slideId: string) => void;
  duplicateSlide: (slideId: string) => void;
  updateSlideBackground: (slideId: string, backgroundColor: string) => void;
  selectSlide: (slideId: string | null) => void;
  selectElement: (elementId: string | null) => void;
  addTextElement: (slideId: string) => void;
  updateTextElement: (slideId: string, elementId: string, updates: Partial<TextElement>) => void;
  removeElement: (slideId: string, elementId: string) => void;
  addImageElement: (slideId: string, src: string, alt: string) => void;
  updateImageElement: (slideId: string, elementId: string, updates: Partial<ImageElement>) => void;
  addPdfElement: (slideId: string, src: string, totalPages: number) => void;
  updatePdfElement: (slideId: string, elementId: string, updates: Partial<PdfElement>) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;
  getAvailableTemplates: () => Template[];
  applyTemplateToSlide: (slideId: string, templateId: string) => void;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export function useCarousel(): CarouselContextType {
  const context = useContext(CarouselContext);
  if (context === undefined) {
    throw new Error('useCarousel must be used within a CarouselProvider');
  }
  return context;
}

interface CarouselProviderProps {
  children: ReactNode;
}

export function CarouselProvider({ children }: CarouselProviderProps) {
  const [slides, setSlides] = useState<Slide[]>([{ ...defaultSlide, id: uuidv4() }]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(slides[0]?.id || null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const addSlide = (templateId?: string) => {
    let newSlide: Slide;

    if (templateId) {
      const template = availableTemplates.find(t => t.id === templateId);
      if (template) {
        newSlide = { ...template.slide, id: uuidv4() };
        // Create new IDs for all elements in the slide
        newSlide.textElements = newSlide.textElements.map(el => ({ ...el, id: uuidv4() }));
        newSlide.imageElements = newSlide.imageElements.map(el => ({ ...el, id: uuidv4() }));
        newSlide.pdfElements = newSlide.pdfElements.map(el => ({ ...el, id: uuidv4() }));
      } else {
        newSlide = { ...defaultSlide, id: uuidv4() };
      }
    } else {
      newSlide = { ...defaultSlide, id: uuidv4() };
    }

    setSlides(prev => [...prev, newSlide]);
    setSelectedSlideId(newSlide.id);
  };

  const removeSlide = (slideId: string) => {
    // Don't remove the last slide
    if (slides.length <= 1) return;

    setSlides(prev => prev.filter(slide => slide.id !== slideId));
    
    // If the removed slide was selected, select the first slide
    if (selectedSlideId === slideId) {
      const remainingSlides = slides.filter(slide => slide.id !== slideId);
      setSelectedSlideId(remainingSlides[0]?.id || null);
      setSelectedElementId(null);
    }
  };

  const duplicateSlide = (slideId: string) => {
    const slideIndex = slides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) return;

    const slideToClone = slides[slideIndex];
    const newSlide: Slide = {
      ...JSON.parse(JSON.stringify(slideToClone)),
      id: uuidv4(),
      textElements: slideToClone.textElements.map(el => ({ ...el, id: uuidv4() })),
      imageElements: slideToClone.imageElements.map(el => ({ ...el, id: uuidv4() })),
      pdfElements: slideToClone.pdfElements.map(el => ({ ...el, id: uuidv4() }))
    };

    setSlides(prev => [
      ...prev.slice(0, slideIndex + 1),
      newSlide,
      ...prev.slice(slideIndex + 1)
    ]);
    setSelectedSlideId(newSlide.id);
  };

  const updateSlideBackground = (slideId: string, backgroundColor: string) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId ? { ...slide, backgroundColor } : slide
      )
    );
  };

  const selectSlide = (slideId: string | null) => {
    setSelectedSlideId(slideId);
    setSelectedElementId(null);
  };

  const selectElement = (elementId: string | null) => {
    setSelectedElementId(elementId);
  };

  const addTextElement = (slideId: string) => {
    const newElement: TextElement = {
      id: uuidv4(),
      text: 'New Text',
      position: { x: 20, y: 20 },
      fontSize: 16,
      fontFamily: 'inter',
      fontWeight: '400',
      color: '#000000',
      textAlign: 'left',
    };

    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { ...slide, textElements: [...slide.textElements, newElement] } 
          : slide
      )
    );
    setSelectedElementId(newElement.id);
  };

  const updateTextElement = (slideId: string, elementId: string, updates: Partial<TextElement>) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? {
              ...slide,
              textElements: slide.textElements.map(element => 
                element.id === elementId 
                  ? { ...element, ...updates } 
                  : element
              )
            } 
          : slide
      )
    );
  };

  const removeElement = (slideId: string, elementId: string) => {
    setSlides(prev => 
      prev.map(slide => {
        if (slide.id !== slideId) return slide;
        
        return {
          ...slide,
          textElements: slide.textElements.filter(el => el.id !== elementId),
          imageElements: slide.imageElements.filter(el => el.id !== elementId),
          pdfElements: slide.pdfElements.filter(el => el.id !== elementId)
        };
      })
    );

    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const addImageElement = (slideId: string, src: string, alt: string) => {
    const newElement: ImageElement = {
      id: uuidv4(),
      type: 'overlay',
      src,
      imageUrl: src,
      alt,
      position: { x: 20, y: 20 },
      size: { width: 200, height: 200 }
    };

    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { ...slide, imageElements: [...slide.imageElements, newElement] } 
          : slide
      )
    );
    setSelectedElementId(newElement.id);
  };

  const updateImageElement = (slideId: string, elementId: string, updates: Partial<ImageElement>) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? {
              ...slide,
              imageElements: slide.imageElements.map(element => 
                element.id === elementId 
                  ? { ...element, ...updates } 
                  : element
              )
            } 
          : slide
      )
    );
  };

  const addPdfElement = (slideId: string, src: string, totalPages: number) => {
    const newElement: PdfElement = {
      id: uuidv4(),
      src,
      currentPage: 1,
      totalPages,
      position: { x: 20, y: 20 },
      size: { width: 400, height: 600 }
    };

    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { ...slide, pdfElements: [...slide.pdfElements, newElement] } 
          : slide
      )
    );
    setSelectedElementId(newElement.id);
  };

  const updatePdfElement = (slideId: string, elementId: string, updates: Partial<PdfElement>) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? {
              ...slide,
              pdfElements: slide.pdfElements.map(element => 
                element.id === elementId 
                  ? { ...element, ...updates } 
                  : element
              )
            } 
          : slide
      )
    );
  };

  const reorderSlides = (startIndex: number, endIndex: number) => {
    const result = Array.from(slides);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setSlides(result);
  };

  const getAvailableTemplates = () => {
    return availableTemplates;
  };

  const applyTemplateToSlide = (slideId: string, templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId);
    if (!template) return;

    setSlides(prev => 
      prev.map(slide => {
        if (slide.id !== slideId) return slide;
        
        // Apply template while keeping the slide ID
        const newSlide: Slide = {
          ...template.slide,
          id: slide.id,
          // Generate new IDs for all elements
          textElements: template.slide.textElements.map(el => ({ ...el, id: uuidv4() })),
          imageElements: template.slide.imageElements.map(el => ({ ...el, id: uuidv4() })),
          pdfElements: template.slide.pdfElements.map(el => ({ ...el, id: uuidv4() }))
        };
        
        return newSlide;
      })
    );
    
    setSelectedElementId(null);
  };

  return (
    <CarouselContext.Provider value={{
      slides,
      selectedSlideId,
      selectedElementId,
      addSlide,
      removeSlide,
      duplicateSlide,
      updateSlideBackground,
      selectSlide,
      selectElement,
      addTextElement,
      updateTextElement,
      removeElement,
      addImageElement,
      updateImageElement,
      addPdfElement,
      updatePdfElement,
      reorderSlides,
      getAvailableTemplates,
      applyTemplateToSlide
    }}>
      {children}
    </CarouselContext.Provider>
  );
} 