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
  // State to track editing mode
  const [isEditing, setIsEditing] = useState(false);
  
  // Text input ref for editing
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);
  
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
  
  // Handle double click to edit text
  const handleDblClick = () => {
    if (!textRef.current) return;
    
    // Enter editing mode
    setIsEditing(true);
    onSelect(node);
    
    // Create textarea overlay
    const textNode = textRef.current;
    const stage = textNode.getStage();
    if (!stage) return;
    
    // Get absolute position and dimensions
    const { x, y } = textNode.absolutePosition();
    const stageContainer = stage.container();
    
    // Create textarea and style it
    const textarea = document.createElement('textarea');
    stageContainer.appendChild(textarea);
    
    // Calculate scaled position based on stage scale
    const scale = stage.scaleX();
    const areaPosition = {
      x: x * scale,
      y: y * scale
    };
    
    textarea.value = node.text;
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${(node.width || textNode.width()) * scale}px`;
    textarea.style.height = `${(node.height || textNode.height()) * scale}px`;
    textarea.style.fontSize = `${node.fontSize * scale}px`;
    textarea.style.fontFamily = node.fontFamily || 'Arial';
    textarea.style.color = node.fill || '#000000';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = '1';
    textarea.style.textAlign = node.align || 'left';
    
    // Handle font weight and style
    if (node.fontStyle) {
      if (node.fontStyle.includes('bold')) {
        textarea.style.fontWeight = 'bold';
      }
      if (node.fontStyle.includes('italic')) {
        textarea.style.fontStyle = 'italic';
      }
    }
    
    // Apply background color if it exists
    if (node.backgroundColor) {
      textarea.style.background = node.backgroundColor;
      textarea.style.padding = '5px';
    }
    
    // Set text area properties
    textarea.focus();
    
    // Save reference to the textarea
    textInputRef.current = textarea;
    
    // Hide the text node while editing
    textNode.visible(false);
    stage.batchDraw();
    
    // Handle text area events
    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) {
        completeEditing();
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        completeEditing();
      }
      if (e.key === 'Escape') {
        completeEditing(true); // Cancel editing (revert to original text)
      }
    };
    
    // Complete the editing process
    const completeEditing = (cancel = false) => {
      if (!textInputRef.current) return;
      
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
      
      const newText = cancel ? node.text : textInputRef.current.value;
      
      // Remove the textarea
      if (textInputRef.current.parentNode) {
        textInputRef.current.parentNode.removeChild(textInputRef.current);
      }
      textInputRef.current = null;
      
      // Show text node again
      if (textRef.current) {
        textRef.current.visible(true);
        textRef.current.getStage()?.batchDraw();
      }
      
      // Exit editing mode
      setIsEditing(false);
      
      // Update the text if changed
      if (newText !== node.text) {
        onChange({ text: newText });
      }
    };
    
    // Add event listeners
    textarea.addEventListener('keydown', handleKeyDown);
    // Delay adding the click event listener to prevent immediate trigger
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    }, 10);
  };

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
        onDblClick={handleDblClick}
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
    
    // Create the image with improved quality settings
    const dataURL = stageRef.current.toDataURL({ 
      pixelRatio: 3, // Increased from 2 to 3 for higher quality
      mimeType: 'image/png',
      quality: 1,
      width: currentCanvasSize.width,
      height: currentCanvasSize.height
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
  
  // Export slide as PDF
  const exportSlideToPdf = () => {
    if (!stageRef.current) return;
    
    // Temporarily set to full size for export
    stageRef.current.scale({ x: 1, y: 1 });
    
    // Create high quality image
    const dataURL = stageRef.current.toDataURL({ 
      pixelRatio: 7.5, // Good balance between quality and file size
      mimeType: 'image/jpeg',
      quality: 2, // Optimized quality
      width: currentCanvasSize.width,
      height: currentCanvasSize.height
    });
    
    // Reset scale
    stageRef.current.scale({ x: stageScale, y: stageScale });
    
    // Import jsPDF dynamically to avoid slowdown
    import('jspdf').then(({ default: jsPDF }) => {
      // Create PDF with optimized settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [currentCanvasSize.width, currentCanvasSize.height],
        compress: true,
        precision: 16, // Good precision but not excessive
        putOnlyUsedFonts: true
      });
      
      // Add image with optimized settings
      pdf.addImage({
        imageData: dataURL,
        format: 'JPEG',
        x: 0,
        y: 0,
        width: currentCanvasSize.width, 
        height: currentCanvasSize.height,
        compression: 'MEDIUM',
        rotation: 0
      });
      
      // Set PDF metadata
      pdf.setProperties({
        title: 'LinkedIn Slide Export',
        creator: 'BrandOut',
        subject: 'LinkedIn Slide'
      });
      
      // Save the PDF
      pdf.save(`slide-${currentSlideIndex + 1}.pdf`);
    });
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
    </div>
  );
};

export default KonvaCanvas; 