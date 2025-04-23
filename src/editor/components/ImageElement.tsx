import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useCarousel } from '../contexts/CarouselContext';
import { ImageElement as ImageElementType } from '../types';
import { Maximize2, Move, Trash, ImageOff, Circle, Square, MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface ImageElementProps {
  image: ImageElementType;
  slideId: string;
  isPrinting?: boolean; // Add prop to indicate if we're generating a PDF
}

// Helper function to get image source from various possible structures
const getImageSource = (image: any): string => {
  if (image.src) return image.src;
  if (image.imageUrl) return image.imageUrl;
  if (image.url) return image.url;
  return '';
};

const ImageElement: React.FC<ImageElementProps> = ({ 
  image, 
  slideId, 
  isPrinting = false 
}) => {
  const { updateImageElement, selectedElementId, setSelectedElementId, removeImageElement } = useCarousel();
  const [resizing, setResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isCircle, setIsCircle] = useState(image.isCircle || false);
  const draggableRef = React.useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const isSelected = selectedElementId === image.id;
  const isBackground = image.type === 'background';
  const isOverlay = image.type !== 'background';
  
  // Effect to hide controls when another element is selected
  useEffect(() => {
    if (!isSelected) {
      setIsInteracting(false);
    }
  }, [isSelected]);
  
  // When clicked outside of any image, hide controls
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        draggableRef.current && 
        !draggableRef.current.contains(event.target as Node) && 
        isSelected
      ) {
        setIsInteracting(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelected]);
  
  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    if (isBackground) return;
    
    updateImageElement(slideId, {
      ...image,
      position: { x: data.x, y: data.y }
    });
  };
  
  const handleResize = (_e: any, { size }: { size: { width: number; height: number } }) => {
    updateImageElement(slideId, {
      ...image,
      size: { width: size.width, height: size.height }
    });
  };
  
  const handleSelect = () => {
    if (isOverlay) {
      setSelectedElementId(image.id);
    } else if (isBackground) {
      // Allow selecting background images too
      setSelectedElementId(image.id);
      setIsInteracting(true);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeImageElement(slideId, image.id);
  };

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBackground) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    setResizing(true);
    setStartSize({ width: image.size.width, height: image.size.height });
    setStartPos({ x: e.clientX, y: e.clientY });
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', stopResize);
  };
  
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    // Maintain aspect ratio (optional - can be removed if free resize is desired)
    const aspectRatio = startSize.width / startSize.height;
    const newWidth = Math.max(50, startSize.width + deltaX);
    const newHeight = Math.max(50, startSize.width + deltaX / aspectRatio);
    
    updateImageElement(slideId, {
      ...image,
      size: { 
        width: newWidth, 
        height: newHeight 
      }
    });
  };
  
  const stopResize = () => {
    setResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', stopResize);
  };

  // Function to handle proportional resizing
  const handleProportionalResize = (newWidth: number) => {
    const aspectRatio = image.size.width / image.size.height;
    const newHeight = newWidth / aspectRatio;
    
    updateImageElement(slideId, {
      ...image,
      size: { 
        width: newWidth, 
        height: newHeight 
      }
    });
  };

  // Resize by specific percentages
  const quickResize = (percentage: number) => {
    if (isBackground) return;
    
    const newWidth = image.size.width * (percentage / 100);
    const newHeight = image.size.height * (percentage / 100);
    
    updateImageElement(slideId, {
      ...image,
      size: { 
        width: newWidth, 
        height: newHeight 
      }
    });
  };

  const toggleShape = () => {
    updateImageElement(slideId, {
      ...image,
      isCircle: !isCircle
    });
    setIsCircle(!isCircle);
  };

  const handleSizeChange = (change: number) => {
    if (isBackground) return;
    
    const newWidth = Math.max(20, image.size.width + change);
    const aspectRatio = image.size.width / image.size.height;
    const newHeight = newWidth / aspectRatio;
    
    updateImageElement(slideId, {
      ...image,
      size: { 
        width: newWidth, 
        height: newHeight 
      }
    });
  };

  if (image.type === 'background') {
    return (
      <div 
        className={`
          absolute inset-0 background-image
          ${isSelected && isInteracting && !isPrinting ? 'ring-2 ring-primary ring-opacity-50' : ''}
        `}
        onClick={handleSelect}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 0, // Place below other elements
          overflow: 'hidden'
        }}
      >
        <img 
          src={getImageSource(image)} 
          alt={image.alt || "Background"} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Always cover the background area
            objectPosition: 'center'
          }}
        />
        
        {/* Controls shown when selected - hide when printing */}
        {isSelected && isInteracting && !isPrinting && (
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-md shadow-sm z-10 flex gap-1 controls">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 button" 
              onClick={handleRemove}
            >
              <ImageOff className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // For overlay images
  return (
    <Draggable
      position={{ x: image.position.x, y: image.position.y }}
      onStop={handleDragStop}
      disabled={isPrinting}
      bounds="parent"
    >
      <div 
        className={`absolute ${isSelected && !isPrinting ? 'ring-2 ring-primary' : ''}`}
        onClick={handleSelect}
        style={{
          transform: 'translate(-50%, -50%)',
          cursor: isPrinting ? 'default' : 'move'
        }}
        data-image-type="overlay"
      >
        <ResizableBox
          width={image.size.width}
          height={image.size.height}
          onResize={handleResize}
          draggableOpts={{ disabled: true }}
          minConstraints={[50, 50]}
          maxConstraints={[1000, 1000]}
          resizeHandles={isPrinting ? [] : ['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
      >
        <img 
            src={getImageSource(image)}
            alt={image.alt || 'Overlay'}
          style={{
            width: '100%',
            height: '100%',
              objectFit: 'contain'
          }}
        />
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default ImageElement;
