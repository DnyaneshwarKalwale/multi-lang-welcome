import React, { useRef } from 'react';
import { useKonvaCarousel, Slide } from '../contexts/KonvaCarouselContext';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import { useImage } from 'react-konva-utils';
import { ChevronUp, ChevronDown, Plus, Copy, Trash } from 'lucide-react';

// Thumbnail preview of a slide
const SlideThumbnail: React.FC<{
  slide: Slide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}> = ({ slide, index, isSelected, onClick }) => {
  // Constants for thumbnail
  const THUMBNAIL_WIDTH = 120;
  const THUMBNAIL_HEIGHT = 150;
  const THUMBNAIL_SCALE = 0.1; // Scale for rendering elements
  
  // Force re-render when slide content changes
  const slideVersion = React.useMemo(() => {
    // Create a unique "version" string based on slide content
    const nodesFingerprint = slide.nodes.map(node => {
      if (node.type === 'text') {
        // Include text content in the fingerprint
        return `${node.id}-${node.text}-${node.position.x}-${node.position.y}`;
      }
      return node.id;
    }).join('|');
    
    return `${slide.id}-${nodesFingerprint}`;
  }, [slide]);

  // Render a thumbnail of the slide
  return (
    <div 
      className={`relative p-1 rounded-md cursor-pointer transition-all ${
        isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
      key={slideVersion} // Force re-render when content changes
    >
      <div className="bg-white border rounded overflow-hidden" style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}>
        <Stage width={THUMBNAIL_WIDTH} height={THUMBNAIL_HEIGHT}>
          <Layer>
            {/* Background */}
            <Rect
              x={0}
              y={0}
              width={THUMBNAIL_WIDTH}
              height={THUMBNAIL_HEIGHT}
              fill={slide.backgroundColor}
            />
            
            {/* Simplified preview of elements */}
            {slide.nodes.map(node => {
              if (node.type === 'text') {
                return (
                  <Text
                    key={node.id}
                    x={node.position.x * THUMBNAIL_SCALE}
                    y={node.position.y * THUMBNAIL_SCALE}
                    text={node.text.length > 15 ? node.text.substring(0, 15) + '...' : node.text}
                    fontSize={node.fontSize * THUMBNAIL_SCALE}
                    fill={node.fill}
                    perfectDrawEnabled={false}
                  />
                );
              } else if (node.type === 'image') {
                // Render image placeholder in thumbnail
                return (
                  <Rect
                    key={node.id}
                    x={node.position.x * THUMBNAIL_SCALE}
                    y={node.position.y * THUMBNAIL_SCALE}
                    width={(node.size?.width || 100) * THUMBNAIL_SCALE}
                    height={(node.size?.height || 100) * THUMBNAIL_SCALE}
                    fill="#ccc"
                    perfectDrawEnabled={false}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
      
      {/* Slide number indicator */}
      <div className="absolute top-2 left-2 bg-white/70 px-1.5 py-0.5 rounded text-xs">
        {index + 1}
      </div>
    </div>
  );
};

// Slide action buttons
const SlideActions: React.FC<{
  slideId: string;
  index: number;
  totalSlides: number;
}> = ({ slideId, index, totalSlides }) => {
  const { duplicateSlide, removeSlide, reorderSlides } = useKonvaCarousel();
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateSlide(slideId);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (totalSlides > 1) {
      removeSlide(slideId);
    }
  };
  
  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      reorderSlides(index, index - 1);
    }
  };
  
  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < totalSlides - 1) {
      reorderSlides(index, index + 1);
    }
  };
  
  return (
    <div className="absolute right-1 top-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        className="p-1 bg-white rounded shadow-sm hover:bg-gray-100 text-gray-700"
        onClick={handleMoveUp}
        disabled={index === 0}
      >
        <ChevronUp className="w-3 h-3" />
      </button>
      <button 
        className="p-1 bg-white rounded shadow-sm hover:bg-gray-100 text-gray-700"
        onClick={handleMoveDown}
        disabled={index === totalSlides - 1}
      >
        <ChevronDown className="w-3 h-3" />
      </button>
      <button 
        className="p-1 bg-white rounded shadow-sm hover:bg-gray-100 text-gray-700"
        onClick={handleDuplicate}
      >
        <Copy className="w-3 h-3" />
      </button>
      <button 
        className="p-1 bg-white rounded shadow-sm hover:bg-red-100 text-red-600"
        onClick={handleDelete}
        disabled={totalSlides <= 1}
      >
        <Trash className="w-3 h-3" />
      </button>
    </div>
  );
};

// Main SlideNavigator component
const KonvaSlideNavigator: React.FC = () => {
  const { slides, currentSlideIndex, setCurrentSlideIndex, addSlide } = useKonvaCarousel();
  
  return (
    <div className="w-[150px] bg-white border-r flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="font-medium text-sm">Slides</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-3 hide-scrollbar">
        {slides.map((slide, index) => (
          <div key={slide.id} className="group relative">
            <SlideThumbnail
              slide={slide}
              index={index}
              isSelected={index === currentSlideIndex}
              onClick={() => setCurrentSlideIndex(index)}
            />
            <SlideActions
              slideId={slide.id}
              index={index}
              totalSlides={slides.length}
            />
          </div>
        ))}
      </div>
      
      <div className="p-2 border-t">
        <button 
          className="w-full py-2 px-3 flex items-center justify-center gap-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
          onClick={() => addSlide()}
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </button>
      </div>
    </div>
  );
};

export default KonvaSlideNavigator; 