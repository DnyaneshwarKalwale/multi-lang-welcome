import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Slide, Template, TextElement, ImageElement, PdfElement } from '@/editor/types';
import { templates } from '@/editor/data/templates';

interface CarouselContextType {
  slides: Slide[];
  currentSlideIndex: number;
  addSlide: (template?: Template, preparedSlide?: Slide) => void;
  removeSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  setCurrentSlideIndex: (index: number) => void;
  updateSlideBackground: (id: string, color: string) => void;
  updateAllSlidesBackground: (color: string) => void;
  addTextElement: (slideId: string, element: Omit<TextElement, 'id'>) => void;
  updateTextElement: (slideId: string, element: TextElement) => void;
  removeTextElement: (slideId: string, elementId: string) => void;
  addImageElement: (slideId: string, element: Omit<ImageElement, 'id'>) => void;
  updateImageElement: (slideId: string, element: ImageElement) => void;
  removeImageElement: (slideId: string, elementId: string) => void;
  addPdfElement: (slideId: string, element: Omit<PdfElement, 'id'>) => void;
  updatePdfElement: (slideId: string, element: PdfElement) => void;
  removePdfElement: (slideId: string, elementId: string) => void;
  applyImageToAllSlides: (image: Omit<ImageElement, 'id'>) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  reorderSlides: (sourceIndex: number, destinationIndex: number) => void;
  applyTemplateToSlide: (slideId: string, templateId: string) => void;
  getAvailableTemplates: () => Template[];
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

interface CarouselProviderProps {
  children: React.ReactNode;
  initialSlides?: Slide[];
}

export function CarouselProvider({ children, initialSlides = [] }: CarouselProviderProps) {
  // Log initial slides for debugging
  console.log("CarouselProvider initialSlides:", initialSlides);
  
  // Default blank slide for empty state
  const defaultSlide: Slide = {
    id: uuidv4(),
    backgroundColor: '#ffffff',
    textElements: [],
    imageElements: [],
    pdfElements: []
  };
  
  // Initialize with initialSlides or a default slide
  const startingSlides = initialSlides && initialSlides.length > 0 
    ? [...initialSlides]  // Create a copy to avoid reference issues
    : [defaultSlide];
  
  const [slides, setSlides] = useState<Slide[]>(startingSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Effect to ensure slides are set correctly and log info
  useEffect(() => {
    console.log("CarouselProvider - current slides:", slides.length);
    
    // Log each slide for debugging
    if (slides.length > 0) {
      slides.forEach((slide, index) => {
        console.log(`Slide ${index + 1}:`, {
          id: slide.id,
          textElements: slide.textElements.length,
          imageElements: slide.imageElements.length,
          pdfElements: slide.pdfElements.length
        });
      });
    }
    
    if (slides.length === 0) {
      // Add default slide if slides array is empty
      setSlides([defaultSlide]);
    }
  }, [slides.length]);
  
  // Effect to handle initialSlides changes
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      console.log("Updating slides from initialSlides:", initialSlides.length);
      setSlides(initialSlides);
    }
  }, [initialSlides]);

  const addSlide = (template?: Template, preparedSlide?: Slide) => {
    // If a prepared slide is provided, use it directly
    if (preparedSlide) {
      setSlides(prev => [...prev, preparedSlide]);
      setCurrentSlideIndex(slides.length);
      return;
    }

    // Otherwise create a new slide from template or default
    const newSlide: Slide = template
      ? {
          id: uuidv4(),
          backgroundColor: template.backgroundColor,
          textElements: template.textElements.map(el => ({
            ...el,
            id: uuidv4()
          })),
          imageElements: template.imageElements.map(el => ({
            ...el,
            id: uuidv4()
          })),
          pdfElements: []
        }
      : {
          id: uuidv4(),
          backgroundColor: '#ffffff',
          textElements: [],
          imageElements: [],
          pdfElements: []
        };
    
    setSlides(prev => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const removeSlide = (id: string) => {
    const index = slides.findIndex(slide => slide.id === id);
    if (index === -1) return;
    
    const newSlides = slides.filter(slide => slide.id !== id);
    setSlides(newSlides);
    
    if (newSlides.length === 0) {
      // If we've removed all slides, add a default one
      setSlides([defaultSlide]);
      setCurrentSlideIndex(0);
    } else if (currentSlideIndex >= index && currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const duplicateSlide = (id: string) => {
    const slideIndex = slides.findIndex(slide => slide.id === id);
    if (slideIndex === -1) return;
    
    const slideToDuplicate = slides[slideIndex];
    
    const duplicatedSlide: Slide = {
      id: uuidv4(),
      backgroundColor: slideToDuplicate.backgroundColor,
      textElements: slideToDuplicate.textElements.map(el => ({
        ...el,
        id: uuidv4()
      })),
      imageElements: slideToDuplicate.imageElements.map(el => ({
        ...el,
        id: uuidv4()
      })),
      pdfElements: slideToDuplicate.pdfElements.map(el => ({
        ...el,
        id: uuidv4()
      }))
    };
    
    const newSlides = [...slides];
    newSlides.splice(slideIndex + 1, 0, duplicatedSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(slideIndex + 1);
  };

  const updateSlideBackground = (id: string, color: string) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === id ? { ...slide, backgroundColor: color } : slide
      )
    );
  };

  const updateAllSlidesBackground = (color: string) => {
    setSlides(prev => 
      prev.map(slide => ({ ...slide, backgroundColor: color }))
    );
  };

  const addTextElement = (slideId: string, element: Omit<TextElement, 'id'>) => {
    const newElement = { ...element, id: uuidv4() };
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { ...slide, textElements: [...slide.textElements, newElement] } 
          : slide
      )
    );
    setSelectedElementId(newElement.id);
  };

  const updateTextElement = (slideId: string, element: TextElement) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { 
              ...slide, 
              textElements: slide.textElements.map(el => 
                el.id === element.id ? element : el
              ) 
            } 
          : slide
      )
    );
  };

  const removeTextElement = (slideId: string, elementId: string) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { 
              ...slide, 
              textElements: slide.textElements.filter(el => el.id !== elementId) 
            } 
          : slide
      )
    );
    
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const addImageElement = (slideId: string, element: Omit<ImageElement, 'id'>) => {
    const newElement = { ...element, id: uuidv4() };
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { ...slide, imageElements: [...slide.imageElements, newElement] } 
          : slide
      )
    );
    setSelectedElementId(newElement.id);
  };

  const updateImageElement = (slideId: string, element: ImageElement) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { 
              ...slide, 
              imageElements: slide.imageElements.map(el => 
                el.id === element.id ? element : el
              ) 
            } 
          : slide
      )
    );
  };

  const removeImageElement = (slideId: string, elementId: string) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { 
              ...slide, 
              imageElements: slide.imageElements.filter(el => el.id !== elementId) 
            } 
          : slide
      )
    );
    
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const addPdfElement = (slideId: string, element: Omit<PdfElement, 'id'>) => {
    const newElement = { ...element, id: uuidv4() };
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { ...slide, pdfElements: [...slide.pdfElements, newElement] } 
          : slide
      )
    );
    setSelectedElementId(newElement.id);
  };

  const updatePdfElement = (slideId: string, element: PdfElement) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { 
              ...slide, 
              pdfElements: slide.pdfElements.map(el => 
                el.id === element.id ? element : el
              ) 
            } 
          : slide
      )
    );
  };

  const removePdfElement = (slideId: string, elementId: string) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { 
              ...slide, 
              pdfElements: slide.pdfElements.filter(el => el.id !== elementId) 
            } 
          : slide
      )
    );
    
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const applyImageToAllSlides = (image: Omit<ImageElement, 'id'>) => {
    setSlides(prev => 
      prev.map(slide => {
        // Remove existing background images if this is a background
        const filteredImages = image.type === 'background' 
          ? slide.imageElements.filter(img => img.type !== 'background')
          : [...slide.imageElements];
        
        // Add the new image to each slide
        const newImage = { ...image, id: uuidv4() };
        return {
          ...slide,
          imageElements: [...filteredImages, newImage]
        };
      })
    );
  };

  const reorderSlides = (sourceIndex: number, destinationIndex: number) => {
    if (
      sourceIndex < 0 ||
      sourceIndex >= slides.length ||
      destinationIndex < 0 ||
      destinationIndex >= slides.length
    ) {
      return;
    }

    const result = Array.from(slides);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    setSlides(result);
    setCurrentSlideIndex(destinationIndex);
  };

  const getAvailableTemplates = () => {
    return templates;
  };

  const applyTemplateToSlide = (slideId: string, templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    setSlides(prev => 
      prev.map(slide => {
        if (slide.id === slideId) {
          return {
            ...slide,
            backgroundColor: template.backgroundColor,
            // Add new text elements but preserve existing ones that shouldn't be replaced
            textElements: [
              ...slide.textElements, 
              ...template.textElements.map(el => ({
                ...el,
                id: uuidv4()
              }))
            ],
            // Add new image elements but preserve existing ones that shouldn't be replaced
            imageElements: [
              ...slide.imageElements,
              ...template.imageElements.map(el => ({
                ...el,
                id: uuidv4()
              }))
            ]
          };
        }
        return slide;
      })
    );
  };

  return (
    <CarouselContext.Provider
      value={{
        slides,
        currentSlideIndex,
        addSlide,
        removeSlide,
        duplicateSlide,
        setCurrentSlideIndex,
        updateSlideBackground,
        updateAllSlidesBackground,
        addTextElement,
        updateTextElement,
        removeTextElement,
        addImageElement,
        updateImageElement,
        removeImageElement,
        addPdfElement,
        updatePdfElement,
        removePdfElement,
        applyImageToAllSlides,
        selectedElementId,
        setSelectedElementId,
        reorderSlides,
        applyTemplateToSlide,
        getAvailableTemplates
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
}

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (context === undefined) {
    throw new Error('useCarousel must be used within a CarouselProvider');
  }
  return context;
}
