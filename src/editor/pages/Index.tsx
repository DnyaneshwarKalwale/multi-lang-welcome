import React, { useState, useEffect } from 'react';
import KonvaCarouselEditorWithProvider from '../components/KonvaCarouselEditor';
import { Slide, Node } from '../contexts/KonvaCarouselContext';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Helper to convert old slide format to Konva format if needed
const convertToKonvaSlides = (oldSlides: any[]): Slide[] => {
  try {
    console.log("Converting old slide format to Konva format:", oldSlides.length);
    
    // Map from old format (textElements, imageElements) to Konva format (nodes array)
    return oldSlides.map(slide => {
      const nodes: Node[] = [];
      
      // Convert text elements to nodes
      if (slide.textElements && Array.isArray(slide.textElements)) {
        slide.textElements.forEach(text => {
          nodes.push({
            id: text.id || uuidv4(),
            type: 'text',
            text: text.text,
            position: text.position || { x: 140, y: 290 },
            fontSize: text.fontSize || 24,
            fontFamily: text.fontFamily || 'inter',
            fill: text.color || '#000000',
            align: text.textAlign || 'center',
            fontStyle: text.fontWeight === '700' ? 'bold' : 
                      text.isItalic ? 'italic' : 'normal',
            width: text.width || 800,
            draggable: true,
            zIndex: text.zIndex || 1
          });
        });
      }
      
      // Convert image elements to nodes
      if (slide.imageElements && Array.isArray(slide.imageElements)) {
        slide.imageElements.forEach(image => {
          nodes.push({
            id: image.id || uuidv4(),
            type: 'image',
            src: image.src || image.imageUrl,
            position: image.position || { x: 140, y: 290 },
            size: image.size || { width: 400, height: 400 },
            draggable: true,
            zIndex: image.zIndex || 0
          });
        });
      }
      
      console.log(`Slide ${slide.id}: Converted to ${nodes.length} Konva nodes`);
      
      return {
        id: slide.id,
        backgroundColor: slide.backgroundColor || '#ffffff',
        nodes
      };
    });
  } catch (error) {
    console.error("Error converting slides to Konva format:", error);
    return [];
  }
};

const Index: React.FC = () => {
  const [initialSlides, setInitialSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Function to create a fallback slide if everything fails
    const createFallbackSlide = (): Slide[] => {
      console.log("Creating fallback slide with Konva format");
      return [{
        id: uuidv4(),
        backgroundColor: '#ffffff',
        nodes: [{
          id: uuidv4(),
          type: 'text',
          text: "Welcome to the Carousel Editor",
          fontFamily: 'inter',
          fontSize: 28,
          fontStyle: 'normal',
          align: 'center',
          fill: '#000000',
          position: { x: 140, y: 290 },
          width: 800,
          draggable: true,
          zIndex: 1
        }]
      }];
    };
    
    try {
      // Try to load slides from localStorage
      const savedSlides = localStorage.getItem('editor_slides');
      
      if (savedSlides) {
        console.log("Found 'editor_slides' in localStorage");
        let parsedSlides;
        
        try {
          parsedSlides = JSON.parse(savedSlides);
          console.log("Successfully parsed slides from localStorage");
        } catch (parseError) {
          console.error("Error parsing 'editor_slides' JSON:", parseError);
          setInitialSlides(createFallbackSlide());
          setLoading(false);
          return;
        }
        
        if (Array.isArray(parsedSlides) && parsedSlides.length > 0) {
          console.log(`Parsed ${parsedSlides.length} slides from localStorage`);
          console.log("First slide format:", Object.keys(parsedSlides[0]));
          
          // Check format more robustly
          const hasNodes = parsedSlides[0].nodes !== undefined;
          const hasTextElements = parsedSlides[0].textElements !== undefined;
          
          console.log(`Slide format detection: hasNodes=${hasNodes}, hasTextElements=${hasTextElements}`);
          
          let convertedSlides: Slide[];
          
          if (hasNodes) {
            console.log("Slides already in Konva format (nodes)");
            convertedSlides = parsedSlides as Slide[];
          } else if (hasTextElements) {
            console.log("Converting from old format (textElements) to Konva format");
            convertedSlides = convertToKonvaSlides(parsedSlides);
            console.log(`Converted ${parsedSlides.length} old slides to ${convertedSlides.length} Konva slides`);
          } else {
            console.warn("Unknown slide format, creating default slides");
            convertedSlides = createFallbackSlide();
          }
          
          // Make sure we have valid slides
          if (convertedSlides.length === 0) {
            console.warn("Conversion resulted in 0 slides, creating fallback");
            convertedSlides = createFallbackSlide();
          }
          
          // Set the slides state
          setInitialSlides(convertedSlides);
          
          // Set slides globally for debugging
          (window as any)['editorLoadedSlides'] = convertedSlides;
          
          // Show success message
          toast({
            title: "Slides loaded",
            description: `Loaded ${convertedSlides.length} slides for editing`,
          });
        } else {
          console.warn("No valid slides in localStorage, creating fallback");
          setInitialSlides(createFallbackSlide());
        }
      } else {
        console.log("No 'editor_slides' found in localStorage, checking other keys");
        
        // Try alternate keys
        const alternateKeys = ['carousel_slides', 'slides', 'saved_slides'];
        let found = false;
        
        for (const key of alternateKeys) {
          const altSlides = localStorage.getItem(key);
          if (altSlides) {
            console.log(`Found slides in '${key}'`);
            try {
              const parsed = JSON.parse(altSlides);
              if (Array.isArray(parsed) && parsed.length > 0) {
                console.log(`Using ${parsed.length} slides from '${key}'`);
                // Convert to Konva format if needed
                const hasNodes = parsed[0].nodes !== undefined;
                const slides = hasNodes ? parsed : convertToKonvaSlides(parsed);
                setInitialSlides(slides);
                found = true;
                break;
              }
            } catch (e) {
              console.error(`Error parsing ${key}:`, e);
            }
          }
        }
        
        if (!found) {
          console.log("No slides found in any storage key, creating fallback slide");
          setInitialSlides(createFallbackSlide());
        }
      }
    } catch (error) {
      console.error("Error loading slides:", error);
      setInitialSlides(createFallbackSlide());
      toast({
        title: "Error",
        description: "Failed to load saved slides, created a new slide",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Auto-focus window on load for keyboard shortcuts
  useEffect(() => {
    window.focus();
  }, []);
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading slides...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <KonvaCarouselEditorWithProvider initialSlides={initialSlides} />
    </div>
  );
};

export default Index;
