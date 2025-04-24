import React, { useState } from 'react';
import { useKonvaCarousel, ImageNode } from '../contexts/KonvaCarouselContext';
import { Upload, Image as ImageIcon, RotateCw, MoveUp, MoveDown, Trash, Maximize, Layers, CopyCheck, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const KonvaImageToolbar: React.FC = () => {
  const { 
    slides, 
    currentSlideIndex, 
    selectedNodeId, 
    updateNode,
    removeNode,
    updateSlideBackground,
    updateAllSlidesBackgroundImage,
    applyNodeToOtherSlides,
    copyNodeToAllSlides
  } = useKonvaCarousel();
  
  const [imageUploadState, setImageUploadState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [opacity, setOpacity] = useState(1);
  
  // Get current slide and selected node
  const currentSlide = slides[currentSlideIndex];
  const selectedNode = currentSlide?.nodes.find(node => node.id === selectedNodeId);
  
  // Check if selected node is an image node
  if (!selectedNode || selectedNode.type !== 'image') {
    return null;
  }
  
  const imageNode = selectedNode as ImageNode;

  // Init opacity from node
  React.useEffect(() => {
    if (imageNode.opacity !== undefined) {
      setOpacity(imageNode.opacity);
    } else {
      setOpacity(1);
    }
  }, [imageNode.id, imageNode.opacity]);
  
  // Update image node properties
  const updateImageNode = (updates: Partial<ImageNode>) => {
    if (!currentSlide) return;
    
    updateNode(currentSlide.id, {
      ...imageNode,
      ...updates
    });
  };
  
  // Handle image replacement via file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageUploadState('loading');
    setErrorMessage('');
    
    // Check file size
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setImageUploadState('error');
      setErrorMessage('Image is too large. Maximum size is 10MB.');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setImageUploadState('error');
      setErrorMessage('Selected file is not an image.');
      return;
    }
    
    // Create a FileReader to read the image
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        // Update the image source
        updateImageNode({
          src: event.target.result as string
        });
        setImageUploadState('idle');
      }
    };
    
    reader.onerror = () => {
      setImageUploadState('error');
      setErrorMessage('Failed to load the image.');
    };
    
    reader.readAsDataURL(file);
  };
  
  // Rotate the image
  const rotateImage = () => {
    const currentRotation = imageNode.rotation || 0;
    updateImageNode({
      rotation: (currentRotation + 90) % 360
    });
  };
  
  // Bring image forward (increase z-index)
  const bringForward = () => {
    updateImageNode({
      zIndex: (imageNode.zIndex || 0) + 1
    });
  };
  
  // Send image backward (decrease z-index)
  const sendBackward = () => {
    updateImageNode({
      zIndex: Math.max((imageNode.zIndex || 0) - 1, 0)
    });
  };
  
  // Delete the selected image node
  const handleDeleteImage = () => {
    if (!currentSlide || !selectedNodeId) return;
    removeNode(currentSlide.id, selectedNodeId);
  };
  
  // Set image as background
  const setAsBackground = () => {
    if (!currentSlide || !imageNode.src) return;
    
    // Create a CSS background image property with the image source
    const backgroundImage = `url(${imageNode.src})`;
    const backgroundCss = `
      background-image: ${backgroundImage};
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `;
    
    // Update slide background to include the image
    updateSlideBackground(currentSlide.id, currentSlide.backgroundColor, backgroundCss);
    
    // After setting as background, optionally remove the original image node
    const confirmRemove = window.confirm('Do you want to remove the original image?');
    if (confirmRemove) {
      removeNode(currentSlide.id, selectedNodeId);
    }
  };

  // Set image as background for all slides
  const setAsBackgroundForAllSlides = () => {
    if (!currentSlide || !imageNode.src) return;
    
    // Apply the image as background to all slides
    updateAllSlidesBackgroundImage(imageNode.src);
    
    toast({
      title: "Applied to all slides",
      description: "This image has been set as the background for all slides",
    });
    
    // After setting as background, optionally remove the original image node
    const confirmRemove = window.confirm('Do you want to remove the original image?');
    if (confirmRemove) {
      removeNode(currentSlide.id, selectedNodeId);
    }
  };

  // Set image as overlay with transparency
  const setAsOverlay = () => {
    // Update the opacity of the image
    updateImageNode({ 
      opacity: opacity,
      zIndex: 100 // Set to a high z-index to ensure it's on top
    });
  };

  // Handle opacity change
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacity(newOpacity);
    updateImageNode({ opacity: newOpacity });
  };
  
  // Apply the selected image to all other slides (useful for logos)
  const handleApplyToAllSlides = () => {
    if (!currentSlide || !selectedNodeId) return;
    
    applyNodeToOtherSlides(selectedNodeId);
    
    toast({
      title: "Applied to all slides",
      description: "This image has been applied to all other slides with the same position and styling",
    });
  };

  // Copy the selected image with its exact position to all other slides
  const handleCopyToAllSlides = () => {
    if (!currentSlide || !selectedNodeId) return;
    
    copyNodeToAllSlides(selectedNodeId);
    
    toast({
      title: "Copied to all slides",
      description: "This image has been copied to the same position on all other slides",
    });
  };
  
  return (
    <div className="p-4 bg-white border rounded-md shadow-md h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium">Image Properties</h3>
      </div>
      
      {/* Make this div scrollable */}
      <div className="overflow-y-auto flex-1 pr-2 hide-scrollbar editor-panel">
        {/* Image Preview */}
        <div className="mb-4">
          <div className="aspect-video w-full bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            <img 
              src={imageNode.src} 
              alt="Selected image" 
              className="max-h-full max-w-full object-contain"
              style={{ opacity: opacity }}
            />
          </div>
        </div>
        
        {/* Image Opacity Control */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opacity: {Math.round(opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={handleOpacityChange}
            className="w-full"
          />
        </div>
        
        {/* Image Upload */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Replace Image
          </label>
          <label className="flex items-center justify-center gap-2 w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Choose a file...</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={imageUploadState === 'loading'}
            />
          </label>
          
          {imageUploadState === 'loading' && (
            <p className="text-sm text-blue-500 mt-1">Uploading image...</p>
          )}
          {imageUploadState === 'error' && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
        
        {/* Image Controls */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={rotateImage}
          >
            <RotateCw className="h-4 w-4" />
            <span className="text-sm">Rotate</span>
          </button>
          <button
            className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={bringForward}
          >
            <MoveUp className="h-4 w-4" />
            <span className="text-sm">Bring Forward</span>
          </button>
          <button
            className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={sendBackward}
          >
            <MoveDown className="h-4 w-4" />
            <span className="text-sm">Send Backward</span>
          </button>
          <button
            className="flex items-center justify-center gap-1 py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md transition-colors"
            onClick={setAsBackground}
          >
            <Maximize className="h-4 w-4" />
            <span className="text-sm">Set as Background</span>
          </button>
        </div>

        {/* Background for all slides button */}
        <div className="mb-4">
          <button
            className="flex items-center justify-center gap-1 w-full py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md transition-colors"
            onClick={setAsBackgroundForAllSlides}
          >
            <Copy className="h-4 w-4" />
            <span className="text-sm">Set as Background for All Slides</span>
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Applies this image as the background for all slides
          </p>
        </div>

        {/* Overlay Control */}
        <div className="mb-4">
          <button
            className="flex items-center justify-center gap-1 w-full py-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-md transition-colors"
            onClick={setAsOverlay}
          >
            <Layers className="h-4 w-4" />
            <span className="text-sm">Apply as Overlay</span>
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Sets image as an overlay with the selected opacity
          </p>
        </div>
        
        {/* Size Information */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Width</label>
            <div className="border rounded-md px-2 py-1 bg-gray-50 text-sm">
              {Math.round(imageNode.size.width)}px
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Height</label>
            <div className="border rounded-md px-2 py-1 bg-gray-50 text-sm">
              {Math.round(imageNode.size.height)}px
            </div>
          </div>
        </div>
      </div>
      
      {/* Keep action buttons always visible at the bottom */}
      <div className="mt-4 border-t pt-4 flex-shrink-0">
        <button
          className="w-full flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors mb-2"
          onClick={handleApplyToAllSlides}
        >
          <CopyCheck className="h-4 w-4" />
          <span>Apply to All Slides</span>
        </button>

        <button
          className="w-full flex items-center justify-center gap-2 p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors mb-2"
          onClick={handleCopyToAllSlides}
        >
          <Copy className="h-4 w-4" />
          <span>Copy to All Slides (Same Position)</span>
        </button>
        
        <button
          className="w-full flex items-center justify-center gap-2 p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
          onClick={handleDeleteImage}
        >
          <Trash className="h-4 w-4" />
          <span>Delete Image</span>
        </button>
      </div>
    </div>
  );
};

export default KonvaImageToolbar; 