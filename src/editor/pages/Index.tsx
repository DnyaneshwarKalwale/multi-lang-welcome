import React, { useEffect, useState } from 'react';
import { CarouselProvider } from '@/editor/contexts/CarouselContext';
import Header from '@/editor/components/Header';
import Sidebar from '@/editor/components/Sidebar';
import Canvas from '@/editor/components/Canvas';
import SlideNavigator from '@/editor/components/SlideNavigator';
import { toast } from 'sonner';
import { Slide } from '@/editor/types';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const location = useLocation();
  const [initialSlides, setInitialSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to create a default blank slide
  const createBlankSlide = (): Slide => ({
    id: uuidv4(),
    backgroundColor: '#ffffff',
    textElements: [],
    imageElements: [],
    pdfElements: []
  });
  
  // Function to validate and position text elements correctly
  const validateTextElement = (text: any) => {
    // LinkedIn slide dimensions
    const SLIDE_WIDTH = 1080;
    const SLIDE_HEIGHT = 1080;
    
    return {
      ...text,
      id: text.id || uuidv4(),
      position: text.position || { 
        x: (SLIDE_WIDTH / 2) - 400, // Center horizontally
        y: (SLIDE_HEIGHT / 2) - 250  // Center vertically
      },
      fontSize: text.fontSize || 24,
      fontWeight: text.fontWeight || '500',
      fontFamily: text.fontFamily || 'inter',
      textAlign: text.textAlign || 'center',
      color: text.color || '#000000',
      width: text.width || 800,
      height: text.height || 500,
      zIndex: text.zIndex || 1
    };
  };
  
  useEffect(() => {
    // First check for slides from RequestCarouselPage
    const storedSlidesJson = localStorage.getItem('editor_slides');
    
    // Then check for pending carousel data (saved when user was redirected to login)
    const pendingCarouselJson = localStorage.getItem('pending_carousel_data');
    
    try {
      if (storedSlidesJson) {
        // Parse the stored slides
        const storedSlides = JSON.parse(storedSlidesJson) as Slide[];
        
        // Ensure slides are valid and have required properties
        const validatedSlides = storedSlides.map(slide => ({
          ...slide,
          id: slide.id || uuidv4(),
          backgroundColor: slide.backgroundColor || '#ffffff',
          textElements: (slide.textElements || []).map(validateTextElement),
          imageElements: slide.imageElements || [],
          pdfElements: slide.pdfElements || []
        }));
        
        // Set as initial slides
        setInitialSlides(validatedSlides);
        
        // Clear the storage after retrieving to avoid reloading on refresh
        localStorage.removeItem('editor_slides');
        
        // Debug output
        console.log("Loaded slides:", validatedSlides.length, validatedSlides);
        
        toast.success(`Loaded ${validatedSlides.length} slides from your carousel content`);
      } else if (pendingCarouselJson) {
        // Parse the pending carousel data
        const pendingData = JSON.parse(pendingCarouselJson);
        
        if (pendingData.slides && Array.isArray(pendingData.slides) && pendingData.slides.length > 0) {
          // Set the slides from pending data
          setInitialSlides(pendingData.slides);
          
          toast.success("Restored your unsaved carousel");
        } else {
          // Create a default slide if no valid slides in pending data
          setInitialSlides([createBlankSlide()]);
          toast.info("Created a blank slide for you");
        }
        
        // We'll handle title and description in the Header component
        // Don't remove from localStorage yet - Header component will need it
      } else {
        // No saved slides, create a blank one
        setInitialSlides([createBlankSlide()]);
        toast.info("Welcome to Carousel Builder! Start by selecting a template or create a blank slide");
      }
    } catch (error) {
      console.error("Failed to parse stored slides:", error);
      toast.error("There was a problem loading your carousel content");
      
      // If there was an error, ensure we have at least one blank slide
      setInitialSlides([createBlankSlide()]);
    } finally {
      setIsLoading(false);
    }
    
    // Clean up function
    return () => {
      // Note: We don't remove pending_carousel_data here to allow Header component to use it
    };
  }, []);

  // Force a re-render if loading state changes
  useEffect(() => {
    if (!isLoading && initialSlides.length > 0) {
      console.log("Editor initialized with slides:", initialSlides.length);
    }
  }, [isLoading, initialSlides]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your carousel...</p>
        </div>
      </div>
    );
  }

  return (
    <CarouselProvider initialSlides={initialSlides}>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
        </div>
        <SlideNavigator />
      </div>
    </CarouselProvider>
  );
};

export default Index;
