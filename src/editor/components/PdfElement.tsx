import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useCarousel } from '../contexts/CarouselContext';
import { PdfElement as PdfElementType } from '../types';
import { Maximize2, Move, Trash, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfElementProps {
  pdf: PdfElementType;
  slideId: string;
  isPrinting?: boolean;
}

const PdfElement: React.FC<PdfElementProps> = ({ 
  pdf, 
  slideId, 
  isPrinting = false 
}) => {
  const { updatePdfElement, selectedElementId, setSelectedElementId, removePdfElement } = useCarousel();
  const [resizing, setResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const draggableRef = useRef<HTMLDivElement>(null);
  
  const isSelected = selectedElementId === pdf.id;
  
  // Effect to hide controls when another element is selected
  useEffect(() => {
    if (!isSelected) {
      setIsInteracting(false);
    }
  }, [isSelected]);
  
  // When clicked outside of any element, hide controls
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
    updatePdfElement(slideId, {
      ...pdf,
      position: { x: data.x, y: data.y }
    });
  };
  
  const handleSelect = () => {
    setSelectedElementId(pdf.id);
    setIsInteracting(true);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removePdfElement(slideId, pdf.id);
  };

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    setResizing(true);
    setStartSize({ width: pdf.size.width, height: pdf.size.height });
    setStartPos({ x: e.clientX, y: e.clientY });
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', stopResize);
  };
  
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    // Maintain aspect ratio
    const aspectRatio = startSize.width / startSize.height;
    const newWidth = Math.max(200, startSize.width + deltaX);
    const newHeight = Math.max(200, newWidth / aspectRatio);
    
    updatePdfElement(slideId, {
      ...pdf,
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

  const handlePageChange = (change: number) => {
    const newPage = Math.max(1, Math.min(pdf.currentPage + change, pdf.totalPages));
    if (newPage !== pdf.currentPage) {
      updatePdfElement(slideId, {
        ...pdf,
        currentPage: newPage
      });
    }
  };

  return (
    <Draggable
      position={{ x: pdf.position.x, y: pdf.position.y }}
      onStop={handleDragStop}
      bounds="parent"
      nodeRef={draggableRef}
    >
      <div 
        ref={draggableRef}
        className={`
          absolute
          draggable-element pdf-element
          ${isSelected && isInteracting && !isPrinting ? 'ring-2 ring-primary ring-opacity-70' : ''}
          shadow-md
          z-15
        `}
        onClick={handleSelect}
        style={{
          width: `${pdf.size.width}px`,
          height: `${pdf.size.height}px`,
          transform: 'translate(-50%, -50%)',
          cursor: 'move',
          borderRadius: '4px',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* PDF viewer */}
        <iframe 
          src={`${pdf.src}#page=${pdf.currentPage}`}
          title="PDF Document"
          className="w-full h-full"
          style={{
            border: 'none',
            backgroundColor: '#fff'
          }}
        />
        
        {/* Controls shown when selected */}
        {isSelected && isInteracting && !isPrinting && (
          <>
            {/* Center drag indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-primary bg-opacity-80 text-white p-1 rounded-full">
                <Move className="h-4 w-4" />
              </div>
            </div>
            
            {/* Resize handle */}
            <div 
              className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-tl-md cursor-nwse-resize flex items-center justify-center resize-handle"
              onMouseDown={startResize}
            >
              <Maximize2 className="h-3 w-3 text-white" />
            </div>
            
            {/* Remove button */}
            <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm p-1 rounded-bl-md shadow-sm controls">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 button" 
                onClick={handleRemove}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Page controls at the bottom */}
            {pdf.totalPages > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-1 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 text-gray-700" 
                  onClick={() => handlePageChange(-1)}
                  disabled={pdf.currentPage <= 1}
                >
                  ‹
                </Button>
                
                <span className="text-xs font-medium">
                  {pdf.currentPage} / {pdf.totalPages}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 text-gray-700" 
                  onClick={() => handlePageChange(1)}
                  disabled={pdf.currentPage >= pdf.totalPages}
                >
                  ›
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Draggable>
  );
};

export default PdfElement; 