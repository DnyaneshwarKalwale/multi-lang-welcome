import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { templates } from '@/editor/data/templates';

// Types for the Konva implementation
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextNode {
  id: string;
  type: 'text';
  text: string;
  position: Position;
  fontSize: number;
  fontFamily: string;
  fill: string;
  width?: number;
  height?: number;
  align?: 'left' | 'center' | 'right';
  fontStyle?: string; // 'normal', 'bold', 'italic', 'bold italic'
  rotation?: number;
  draggable: boolean;
  zIndex: number;
  backgroundColor?: string;
}

export interface ImageNode {
  id: string;
  type: 'image';
  src: string;
  position: Position;
  size: Size;
  rotation?: number;
  opacity?: number;
  draggable: boolean;
  zIndex: number;
}

export type Node = TextNode | ImageNode;

export interface Slide {
  id: string;
  backgroundColor: string;
  backgroundImage?: string;
  nodes: Node[];
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  backgroundColor: string;
  nodes: Omit<Node, 'id'>[];
}

// Default Canvas Sizes
export const CANVAS_SIZES = {
  LINKEDIN_PORTRAIT: { width: 1080, height: 1350 }, // 4:5 ratio
  LINKEDIN_SQUARE: { width: 1080, height: 1080 }, // 1:1 ratio
  SCALE_FACTOR: 0.35 // Display scale for editing
};

// Local storage key
const CAROUSEL_STORAGE_KEY = 'linkedinCarouselState';

interface KonvaCarouselContextType {
  slides: Slide[];
  currentSlideIndex: number;
  currentCanvasSize: Size;
  selectedNodeId: string | null;
  setCurrentSlideIndex: (index: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  addSlide: (template?: Template) => void;
  removeSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  updateSlideBackground: (id: string, color: string, backgroundImage?: string) => void;
  updateAllSlidesBackground: (color: string) => void;
  updateAllSlidesBackgroundImage: (backgroundImage: string) => void;
  addNode: (slideId: string, node: Omit<Node, 'id'>) => void;
  updateNode: (slideId: string, node: Node) => void;
  removeNode: (slideId: string, nodeId: string) => void;
  reorderSlides: (sourceIndex: number, destinationIndex: number) => void;
  toggleCanvasSize: () => void;
  applyNodeToAllSlides: (node: Omit<Node, 'id'>) => void;
  applyNodeToOtherSlides: (nodeId: string) => void;
  applyTextStylingToAllSlides: (nodeId: string) => void;
  copyNodeToAllSlides: (nodeId: string) => void;
  getAvailableTemplates: () => Template[];
  clearState: () => void;
}

const KonvaCarouselContext = createContext<KonvaCarouselContextType | undefined>(undefined);

interface KonvaCarouselProviderProps {
  children: React.ReactNode;
  initialSlides?: Slide[];
}

// Helper function to create an empty slide
const createEmptySlide = (backgroundColor = '#ffffff'): Slide => ({
  id: uuidv4(),
  backgroundColor,
  nodes: []
});

export const KonvaCarouselProvider: React.FC<KonvaCarouselProviderProps> = ({ 
  children, 
  initialSlides = [] 
}) => {
  // Load state from localStorage on component mount
  const loadInitialState = (): {
    slides: Slide[],
    canvasSize: Size,
    currentIndex: number
  } => {
    try {
      const savedState = localStorage.getItem(CAROUSEL_STORAGE_KEY);
      
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return {
          slides: parsedState.slides || [createEmptySlide()],
          canvasSize: parsedState.canvasSize || CANVAS_SIZES.LINKEDIN_PORTRAIT,
          currentIndex: parsedState.currentIndex || 0
        };
      }
    } catch (error) {
      console.error('Failed to load carousel state from localStorage:', error);
    }
    
    // Default state if nothing is saved
    return {
      slides: initialSlides.length > 0 ? [...initialSlides] : [createEmptySlide()],
      canvasSize: CANVAS_SIZES.LINKEDIN_PORTRAIT,
      currentIndex: 0
    };
  };

  // Get initial state
  const initialState = loadInitialState();
  
  // State
  const [slides, setSlides] = useState<Slide[]>(initialState.slides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialState.currentIndex);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [currentCanvasSize, setCurrentCanvasSize] = useState<Size>(initialState.canvasSize);
  
  // Save to localStorage whenever slides or canvas size changes
  useEffect(() => {
    try {
      localStorage.setItem(CAROUSEL_STORAGE_KEY, JSON.stringify({
        slides,
        canvasSize: currentCanvasSize,
        currentIndex: currentSlideIndex
      }));
    } catch (error) {
      console.error('Failed to save carousel state to localStorage:', error);
    }
  }, [slides, currentCanvasSize, currentSlideIndex]);

  // Toggle between square and portrait canvas sizes
  const toggleCanvasSize = useCallback(() => {
    setCurrentCanvasSize(prev => 
      prev.height === CANVAS_SIZES.LINKEDIN_PORTRAIT.height 
        ? CANVAS_SIZES.LINKEDIN_SQUARE 
        : CANVAS_SIZES.LINKEDIN_PORTRAIT
    );
  }, []);

  // Add a new slide
  const addSlide = useCallback((template?: Template) => {
    if (template) {
      // Create new slide from template
      const newSlide: Slide = {
        id: uuidv4(),
        backgroundColor: template.backgroundColor,
        nodes: template.nodes.map(node => ({
          ...node,
          id: uuidv4(),
          draggable: true
        })) as Node[]
      };
      setSlides(prev => [...prev, newSlide]);
    } else {
      // Create empty slide
      setSlides(prev => [...prev, createEmptySlide()]);
    }
    // Set focus to the new slide
    setCurrentSlideIndex(slides.length);
  }, [slides.length]);

  // Remove a slide by ID
  const removeSlide = useCallback((id: string) => {
    const index = slides.findIndex(slide => slide.id === id);
    if (index === -1) return;
    
    const newSlides = slides.filter(slide => slide.id !== id);
    
    // Handle edge cases when removing slides
    if (newSlides.length === 0) {
      setSlides([createEmptySlide()]);
      setCurrentSlideIndex(0);
    } else {
      setSlides(newSlides);
      if (currentSlideIndex >= index && currentSlideIndex > 0) {
        setCurrentSlideIndex(prev => prev - 1);
      }
    }
  }, [slides, currentSlideIndex]);

  // Duplicate a slide by ID
  const duplicateSlide = useCallback((id: string) => {
    const slideIndex = slides.findIndex(slide => slide.id === id);
    if (slideIndex === -1) return;
    
    const slideToDuplicate = slides[slideIndex];
    const duplicatedSlide: Slide = {
      id: uuidv4(),
      backgroundColor: slideToDuplicate.backgroundColor,
      nodes: slideToDuplicate.nodes.map(node => ({
        ...node,
        id: uuidv4()
      }))
    };
    
    const newSlides = [...slides];
    newSlides.splice(slideIndex + 1, 0, duplicatedSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(slideIndex + 1);
  }, [slides]);

  // Update slide background color
  const updateSlideBackground = useCallback((id: string, color: string, backgroundImage?: string) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === id ? { 
          ...slide, 
          backgroundColor: color,
          backgroundImage: backgroundImage
        } : slide
      )
    );
  }, []);

  // Update all slides background color
  const updateAllSlidesBackground = useCallback((color: string) => {
    setSlides(prev => 
      prev.map(slide => ({ ...slide, backgroundColor: color }))
    );
  }, []);

  // Update all slides background image (keeping their background colors)
  const updateAllSlidesBackgroundImage = useCallback((backgroundImage: string) => {
    console.log('Applying background image to all slides:', backgroundImage.substring(0, 50) + '...');
    
    // Create a proper CSS background property
    const backgroundCss = `
      background-image: url(${backgroundImage});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `;
    
    setSlides(prev => 
      prev.map(slide => ({ 
        ...slide, 
        backgroundImage: backgroundCss
      }))
    );
  }, []);

  // Add a node to a slide
  const addNode = useCallback((slideId: string, node: Omit<Node, 'id'>) => {
    const newNode = {
      ...node,
      id: uuidv4(),
      draggable: true
    } as Node;
    
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { ...slide, nodes: [...slide.nodes, newNode] } 
          : slide
      )
    );
    
    // Select the new node
    setSelectedNodeId(newNode.id);
  }, []);

  // Update a node in a slide
  const updateNode = useCallback((slideId: string, updatedNode: Node) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { 
              ...slide, 
              nodes: slide.nodes.map(node => 
                node.id === updatedNode.id ? updatedNode : node
              ) 
            } 
          : slide
      )
    );
  }, []);

  // Remove a node from a slide
  const removeNode = useCallback((slideId: string, nodeId: string) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === slideId 
          ? { 
              ...slide, 
              nodes: slide.nodes.filter(node => node.id !== nodeId) 
            } 
          : slide
      )
    );
    
    // Clear selection if the removed node was selected
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId]);

  // Reorder slides (for drag and drop)
  const reorderSlides = useCallback((sourceIndex: number, destinationIndex: number) => {
    const reorderedSlides = [...slides];
    const [removed] = reorderedSlides.splice(sourceIndex, 1);
    reorderedSlides.splice(destinationIndex, 0, removed);
    
    setSlides(reorderedSlides);
    
    // Adjust current slide index if needed
    if (currentSlideIndex === sourceIndex) {
      setCurrentSlideIndex(destinationIndex);
    } else if (
      currentSlideIndex > sourceIndex && 
      currentSlideIndex <= destinationIndex
    ) {
      setCurrentSlideIndex(prev => prev - 1);
    } else if (
      currentSlideIndex < sourceIndex && 
      currentSlideIndex >= destinationIndex
    ) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [slides, currentSlideIndex]);

  // Apply a node to all slides (this keeps the same position, content, etc. for all)
  const applyNodeToAllSlides = useCallback((node: Omit<Node, 'id'>) => {
    setSlides(prev => 
      prev.map(slide => {
        const newNode = { 
          ...node, 
          id: uuidv4(),
          draggable: true
        } as Node;
        
        return { 
          ...slide, 
          nodes: [...slide.nodes, newNode] 
        };
      })
    );
  }, []);

  // Apply a specific node from current slide to all other slides
  const applyNodeToOtherSlides = useCallback((nodeId: string) => {
    if (!slides[currentSlideIndex]) return;
    
    const currentSlide = slides[currentSlideIndex];
    const nodeToCopy = currentSlide.nodes.find(node => node.id === nodeId);
    
    if (!nodeToCopy) return;
    
    setSlides(prev => 
      prev.map((slide, index) => {
        // Skip the current slide
        if (index === currentSlideIndex) return slide;
        
        // For text nodes, we only want to apply styling properties, not copy the content
        if (nodeToCopy.type === 'text') {
          const textNode = nodeToCopy as TextNode;
          
          // Extract just the styling properties we want to apply
          const stylesToApply = {
            fontSize: textNode.fontSize,
            fontFamily: textNode.fontFamily,
            fill: textNode.fill,
            align: textNode.align,
            fontStyle: textNode.fontStyle,
            backgroundColor: textNode.backgroundColor
          };
          
          // Update all existing text nodes with these styles
          const updatedNodes = slide.nodes.map(node => {
            if (node.type === 'text') {
              return {
                ...node,
                ...stylesToApply
              };
            }
            return node;
          });
          
          return {
            ...slide,
            nodes: updatedNodes
          };
        } 
        // For image nodes, create a copy as before
        else if (nodeToCopy.type === 'image') {
          // Check if this slide already has a similar image node
          const hasSimilarNode = slide.nodes.some(existingNode => {
            if (nodeToCopy.type === 'image' && existingNode.type === 'image') {
              return existingNode.src === (nodeToCopy as ImageNode).src;
            }
            return false;
          });
          
          // If a similar node exists, don't add a duplicate
          if (hasSimilarNode) return slide;
          
          // Create a new image node with a new ID but same properties
          const newNode = {
            ...nodeToCopy,
            id: uuidv4(),
          };
          
          return {
            ...slide,
            nodes: [...slide.nodes, newNode]
          };
        }
        
        return slide;
      })
    );
  }, [slides, currentSlideIndex]);

  // Copy a node with its exact position and content to all other slides
  const copyNodeToAllSlides = useCallback((nodeId: string) => {
    if (!slides[currentSlideIndex]) return;
    
    const currentSlide = slides[currentSlideIndex];
    const nodeToCopy = currentSlide.nodes.find(node => node.id === nodeId);
    
    if (!nodeToCopy) return;
    
    setSlides(prev => 
      prev.map((slide, index) => {
        // Skip the current slide
        if (index === currentSlideIndex) return slide;
        
        // Create a new node with a new ID but keeping all other properties intact
        const newNode = {
          ...nodeToCopy,
          id: uuidv4(),
        };
        
        return {
          ...slide,
          nodes: [...slide.nodes, newNode]
        };
      })
    );
  }, [slides, currentSlideIndex]);

  // Apply text styling from one node to all text nodes on all slides
  const applyTextStylingToAllSlides = useCallback((nodeId: string) => {
    if (!slides[currentSlideIndex]) return;
    
    const currentSlide = slides[currentSlideIndex];
    const sourceNode = currentSlide.nodes.find(node => node.id === nodeId);
    
    // Only proceed if it's a text node
    if (!sourceNode || sourceNode.type !== 'text') return;
    
    const textNode = sourceNode as TextNode;
    
    // Extract styling properties (not content or position)
    const stylesToApply = {
      fontSize: textNode.fontSize,
      fontFamily: textNode.fontFamily,
      fill: textNode.fill,
      align: textNode.align,
      fontStyle: textNode.fontStyle,
      backgroundColor: textNode.backgroundColor
    };
    
    setSlides(prev => 
      prev.map(slide => {
        // Update all text nodes in all slides with the styling properties
        const updatedNodes = slide.nodes.map(node => {
          if (node.type === 'text') {
            // Apply styling but preserve content, position, size, rotation, etc.
            return {
              ...node,
              ...stylesToApply
            };
          }
          return node;
        });
        
        return {
          ...slide,
          nodes: updatedNodes
        };
      })
    );
  }, [slides, currentSlideIndex]);

  // Get available templates
  const getAvailableTemplates = useCallback(() => {
    // Convert templates from data file to Konva-compatible format
    const konvaTemplates: Template[] = templates.map(template => {
      // Convert text elements to Konva text nodes
      const textNodes = template.textElements.map((text, index) => ({
        type: 'text' as const,
        text: text.text,
        position: { x: text.position.x, y: text.position.y },
        fontSize: text.fontSize,
        fontFamily: text.fontFamily,
        fill: text.color,
        align: text.textAlign,
        fontStyle: text.fontWeight === '700' ? 'bold' : 
                  text.isItalic ? 'italic' : 'normal',
        width: text.width,
        draggable: true,
        zIndex: index + 10 // Start with higher z-index for text
      }));

      // Convert image elements to Konva image nodes
      const imageNodes = template.imageElements.map((image, index) => ({
        type: 'image' as const,
        src: image.src,
        position: { x: image.position.x, y: image.position.y },
        size: { width: image.size.width, height: image.size.height },
        draggable: true,
        zIndex: index
      }));

      return {
        id: template.id,
        name: template.name,
        thumbnail: template.thumbnail,
        backgroundColor: template.backgroundColor,
        nodes: [...textNodes, ...imageNodes]
      };
    });

    return konvaTemplates;
  }, []);

  // Make context available globally for exports
  useEffect(() => {
    window.konvaCarouselContext = {
      slides,
      currentSlideIndex
    };
    
    return () => {
      delete window.konvaCarouselContext;
    };
  }, [slides, currentSlideIndex]);

  // Context value
  const contextValue: KonvaCarouselContextType = {
    slides,
    currentSlideIndex,
    currentCanvasSize,
    selectedNodeId,
    setCurrentSlideIndex,
    setSelectedNodeId,
    addSlide,
    removeSlide,
    duplicateSlide,
    updateSlideBackground,
    updateAllSlidesBackground,
    updateAllSlidesBackgroundImage,
    addNode,
    updateNode,
    removeNode,
    reorderSlides,
    toggleCanvasSize,
    applyNodeToAllSlides,
    applyNodeToOtherSlides,
    applyTextStylingToAllSlides,
    copyNodeToAllSlides,
    getAvailableTemplates,
    clearState: () => {
      localStorage.removeItem(CAROUSEL_STORAGE_KEY);
      setSlides([createEmptySlide()]);
      setCurrentSlideIndex(0);
      setSelectedNodeId(null);
      setCurrentCanvasSize(CANVAS_SIZES.LINKEDIN_PORTRAIT);
    }
  };

  return (
    <KonvaCarouselContext.Provider value={contextValue}>
      {children}
    </KonvaCarouselContext.Provider>
  );
};

// Custom hook to use KonvaCarousel context
export const useKonvaCarousel = () => {
  const context = useContext(KonvaCarouselContext);
  if (context === undefined) {
    throw new Error('useKonvaCarousel must be used within a KonvaCarouselProvider');
  }
  return context;
}; 