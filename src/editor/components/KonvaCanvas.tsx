import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Image, Transformer } from 'react-konva';
import { useKonvaCarousel, TextNode, ImageNode, CANVAS_SIZES } from '../contexts/KonvaCarouselContext';
import { useImage } from 'react-konva-utils';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { FontManager } from '../utils/FontManager';

// Define the NodeComponentProps interface
interface NodeComponentProps<T> {
  node: T;
  isSelected: boolean;
  onSelect: (node: T) => void;
  onChange: (newAttrs: Partial<T>) => void;
}

// Component for rendering a text node
const TextNodeComponent: React.FC<NodeComponentProps<TextNode>> = ({ node, isSelected, onSelect, onChange }) => {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  
  // Add fontLoaded state to track when custom fonts are loaded
  const [fontLoaded, setFontLoaded] = useState(true);
  
  // Check if the font is custom and needs to be loaded
  useEffect(() => {
    if (!node.fontFamily) return;
    
    const fontManager = FontManager.getInstance();
    const customFont = fontManager.getFontByFamily(node.fontFamily);
    
    if (customFont && !customFont.loaded) {
      setFontLoaded(false);
      fontManager.loadFontIntoDocument(customFont)
        .then(() => {
          setFontLoaded(true);
          // Force Konva to update the text with the new font
          if (textRef.current) {
            textRef.current.cache();
            textRef.current.getLayer()?.batchDraw();
          }
        })
        .catch(error => console.error('Failed to load font:', error));
    }
  }, [node.fontFamily]);

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      position: {
        x: e.target.x(),
        y: e.target.y()
      }
    });
  };

  const handleTransformEnd = () => {
    if (textRef.current) {
      const node = textRef.current;
      
      onChange({
        position: {
          x: node.x(),
          y: node.y()
        },
        width: Math.max(node.width() * node.scaleX(), 10),
        height: Math.max(node.height() * node.scaleY(), 10)
      });

      // Reset scale after updating width and height
      node.scaleX(1);
      node.scaleY(1);
    }
  };

  return (
    <>
      <Text
        ref={textRef}
        x={node.position.x}
        y={node.position.y}
        text={node.text}
        fontSize={node.fontSize}
        fontFamily={node.fontFamily}
        fill={node.fill}
        width={node.width}
        height={node.height}
        align={node.align}
        fontStyle={node.fontStyle}
        draggable
        onDragEnd={handleDragEnd}
        onClick={() => onSelect(node)}
        onTap={() => onSelect(node)}
        onTransformEnd={handleTransformEnd}
        opacity={fontLoaded ? 1 : 0.5} // Show text as semi-transparent while font is loading
        // Add background color support
        fillPriority="color"
        backgroundColor={node.backgroundColor}
        padding={node.backgroundColor ? 5 : 0} // Add padding when background color is present
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit size to prevent crash from too small values
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={['middle-left', 'middle-right', 'top-center', 'bottom-center']}
        />
      )}
    </>
  );
};

// Component for rendering an image node
const ImageNodeComponent: React.FC<{
  node: ImageNode;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<ImageNode>) => void;
}> = ({ node, isSelected, onSelect, onChange }) => {
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [image] = useImage(node.src, 'anonymous');

  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      position: {
        x: e.target.x(),
        y: e.target.y()
      }
    });
  };

  const handleTransformEnd = () => {
    if (imageRef.current) {
      const node = imageRef.current;
      onChange({
        position: {
          x: node.x(),
          y: node.y()
        },
        size: {
          width: Math.max(node.width() * node.scaleX(), 10),
          height: Math.max(node.height() * node.scaleY(), 10)
        },
        rotation: node.rotation()
      });

      // Reset scale after updating width and height
      node.scaleX(1);
      node.scaleY(1);
    }
  };

  return (
    <>
      <Image
        ref={imageRef}
        x={node.position.x}
        y={node.position.y}
        width={node.size.width}
        height={node.size.height}
        image={image}
        rotation={node.rotation}
        opacity={node.opacity !== undefined ? node.opacity : 1}
        draggable={node.draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        perfectDrawEnabled={false}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit size to prevent crash from too small values
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Render background based on backgroundColor and backgroundImage
const SlideBackground: React.FC<{
  backgroundColor: string;
  backgroundImage?: string;
  width: number;
  height: number;
}> = ({ backgroundColor, backgroundImage, width, height }) => {
  // If there's no background image, just render a colored rectangle
  if (!backgroundImage) {
    return (
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={backgroundColor}
        perfectDrawEnabled={false}
      />
    );
  }
  
  // Extract image URL from backgroundImage CSS
  const imageUrlMatch = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
  const imageUrl = imageUrlMatch ? imageUrlMatch[1] : '';
  
  // Load the image
  const [image] = useImage(imageUrl, 'anonymous');
  
  return (
    <>
      {/* Base color background */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={backgroundColor}
        perfectDrawEnabled={false}
      />
      
      {/* Image background */}
      {image && (
        <Image
          x={0}
          y={0}
          width={width}
          height={height}
          image={image}
          perfectDrawEnabled={false}
          opacity={1}
        />
      )}
    </>
  );
};

// Main canvas component
const KonvaCanvas: React.FC = () => {
  const {
    slides,
    currentSlideIndex,
    selectedNodeId,
    setSelectedNodeId,
    updateNode,
    currentCanvasSize
  } = useKonvaCarousel();
  
  const stageRef = useRef<Konva.Stage>(null);
  const [stageScale, setStageScale] = useState(CANVAS_SIZES.SCALE_FACTOR);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const currentSlide = slides[currentSlideIndex];
  
  useEffect(() => {
    // Handle export events
    const handleExportStart = () => setIsPrinting(true);
    const handleExportEnd = () => setIsPrinting(false);

    window.addEventListener('carousel-export-start', handleExportStart);
    window.addEventListener('carousel-export-end', handleExportEnd);
    
    return () => {
      window.removeEventListener('carousel-export-start', handleExportStart);
      window.removeEventListener('carousel-export-end', handleExportEnd);
    };
  }, []);
  
  // Reset selection when changing slides
  useEffect(() => {
    setSelectedNodeId(null);
  }, [currentSlideIndex, setSelectedNodeId]);
  
  // Handle clicks on empty areas
  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    // Check if clicked on stage background
    if (e.target === e.currentTarget) {
      setSelectedNodeId(null);
    }
  };
  
  // Handle node selection
  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };
  
  // Handle node updates
  const handleNodeChange = (nodeId: string, newAttrs: any) => {
    if (!currentSlide) return;
    
    const node = currentSlide.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    updateNode(currentSlide.id, {
      ...node,
      ...newAttrs
    });
  };
  
  // Export slide as PNG
  const exportSlideToPng = () => {
    if (!stageRef.current) return;
    
    // Temporarily set to full size for export
    stageRef.current.scale({ x: 1, y: 1 });
    
    // Create the image
    const dataURL = stageRef.current.toDataURL({ 
      pixelRatio: 2, 
      mimeType: 'image/png' 
    });
    
    // Reset scale
    stageRef.current.scale({ x: stageScale, y: stageScale });
    
    // Create a download link
    const link = document.createElement('a');
    link.download = `slide-${currentSlideIndex + 1}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Return empty state if no slides
  if (!currentSlide) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-slate-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-lg font-medium text-gray-500">No slides available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 overflow-auto hide-scrollbar">
      <div 
        className="relative bg-white rounded-md shadow-md"
        style={{
          width: currentCanvasSize.width * stageScale,
          height: currentCanvasSize.height * stageScale
        }}
        id={`slide-${currentSlide.id}`}
      >
        <Stage 
          ref={stageRef}
          width={currentCanvasSize.width}
          height={currentCanvasSize.height}
          scale={{ x: stageScale, y: stageScale }}
          onClick={handleStageClick}
        >
          <Layer>
            {/* Background */}
            <SlideBackground
              backgroundColor={currentSlide.backgroundColor}
              backgroundImage={currentSlide.backgroundImage}
              width={currentCanvasSize.width}
              height={currentCanvasSize.height}
            />
            
            {/* Render all nodes, sorted by z-index */}
            {currentSlide.nodes
              .slice()
              .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
              .map(node => {
                const isSelected = node.id === selectedNodeId;
                
                if (node.type === 'text') {
                  return (
                    <TextNodeComponent
                      key={node.id}
                      node={node as TextNode}
                      isSelected={isSelected}
                      onSelect={() => handleSelectNode(node.id)}
                      onChange={(newAttrs) => handleNodeChange(node.id, newAttrs)}
                    />
                  );
                } else if (node.type === 'image') {
                  return (
                    <ImageNodeComponent
                      key={node.id}
                      node={node as ImageNode}
                      isSelected={isSelected}
                      onSelect={() => handleSelectNode(node.id)}
                      onChange={(newAttrs) => handleNodeChange(node.id, newAttrs)}
                    />
                  );
                }
                return null;
              })}
          </Layer>
        </Stage>
        
        {/* Watermark (only visible in editor, not in exports) */}
        {!isPrinting && (
          <div className="absolute bottom-2 left-2 bg-white rounded-md p-1 shadow-sm scale-[0.35] origin-bottom-left">
            <img 
              src="/BrandOut.svg" 
              alt="BrandOut" 
              className="h-6 w-auto"
            />
          </div>
        )}
      </div>
      
      {/* Export button */}
      {!isPrinting && (
        <div className="mt-4">
          <button
            onClick={exportSlideToPng}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Export as PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default KonvaCanvas; 