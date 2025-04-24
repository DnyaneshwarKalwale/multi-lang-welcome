import React, { useState, useEffect } from 'react';
import { useKonvaCarousel, TextNode } from '../contexts/KonvaCarouselContext';
import { HexColorPicker } from 'react-colorful';
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Type, 
  Trash,
  Upload,
  Square,
  Copy,
  CopyCheck,
  PaintBucket,
  RefreshCw
} from 'lucide-react';
import FontManager from '../utils/FontManager';
import { toast } from '@/components/ui/use-toast';

// Interface for font option in dropdown
interface FontOption {
  name: string;
  value: string;
  isCustom?: boolean;
}

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96];

// System fonts
const SYSTEM_FONTS: FontOption[] = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Oswald', value: 'Oswald' },
  { name: 'Merriweather', value: 'Merriweather' },
];

const KonvaTextToolbar: React.FC = () => {
  const { 
    slides, 
    currentSlideIndex, 
    selectedNodeId, 
    updateNode,
    removeNode,
    applyNodeToOtherSlides,
    applyTextStylingToAllSlides,
    copyNodeToAllSlides
  } = useKonvaCarousel();
  
  const [fontUploadState, setFontUploadState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [fontError, setFontError] = useState('');
  const [customFontName, setCustomFontName] = useState('');
  const [showFontUpload, setShowFontUpload] = useState(false);
  const [availableFonts, setAvailableFonts] = useState<FontOption[]>(SYSTEM_FONTS);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);

  // Get current slide and selected node
  const currentSlide = slides[currentSlideIndex];
  const selectedNode = currentSlide?.nodes.find(node => node.id === selectedNodeId);
  
  // Initialize font manager and load custom fonts
  useEffect(() => {
    const fontManager = FontManager.getInstance();
    
    // Load initial custom fonts
    updateCustomFontsList();
    
    // Function to handle font loaded events
    const handleFontLoaded = () => {
      updateCustomFontsList();
    };
    
    // Subscribe to font loaded events
    fontManager.addFontLoadedListener(handleFontLoaded);
    
    // Cleanup listener on component unmount
    return () => {
      fontManager.removeFontLoadedListener(handleFontLoaded);
    };
  }, []);

  // Update the list of available fonts including custom fonts
  const updateCustomFontsList = () => {
    const fontManager = FontManager.getInstance();
    const customFonts = fontManager.getAllFonts()
      .map(font => ({
        name: `${font.name || font.family} (Custom)`,
        value: font.fontFamily || font.family,
        isCustom: true
      }));
    
    setAvailableFonts([...SYSTEM_FONTS, ...customFonts]);
  };
  
  // Handle font upload
  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the extension is valid
    const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      setFontError('Invalid font file format. Supported formats: .ttf, .otf, .woff, .woff2');
      setFontUploadState('error');
      return;
    }
    
    setFontUploadState('loading');
    setFontError('');
    
    try {
      const fontManager = FontManager.getInstance();
      // Use filename as font name if no custom name is provided
      const useFontName = customFontName.trim() || file.name.split('.')[0];
      const newFont = await fontManager.addFont(file, useFontName);
      
      setFontUploadState('idle');
      setCustomFontName('');
      setShowFontUpload(false);
      
      // Auto-apply the new font to the selected text
      if (textNode) {
        updateTextNode({ fontFamily: newFont.fontFamily });
      }

      toast({
        title: "Font uploaded successfully",
        description: "The font has been added and is now available for use",
      });
    } catch (error) {
      setFontError((error as Error).message);
      setFontUploadState('error');
    }
  };
  
  // Refresh fonts from API
  const handleRefreshFonts = async () => {
    try {
      const fontManager = FontManager.getInstance();
      await fontManager.refreshFonts();
      updateCustomFontsList();
      
      toast({
        title: "Fonts refreshed",
        description: "The font list has been updated with the latest available fonts",
      });
    } catch (error) {
      console.error('Error refreshing fonts:', error);
      toast({
        title: "Error refreshing fonts",
        description: "There was a problem updating the font list. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Check if selected node is a text node
  if (!selectedNode || selectedNode.type !== 'text') {
    return null;
  }
  
  const textNode = selectedNode as TextNode;
  
  // Update text node properties
  const updateTextNode = (updates: Partial<TextNode>) => {
    if (!currentSlide) return;
    
    updateNode(currentSlide.id, {
      ...textNode,
      ...updates
    });
  };
  
  // Toggle bold style
  const toggleBold = () => {
    const currentStyle = textNode.fontStyle || 'normal';
    const isBold = currentStyle.includes('bold');
    
    let newStyle: string;
    if (isBold) {
      newStyle = currentStyle.replace('bold', '').trim();
      if (newStyle === '') newStyle = 'normal';
    } else {
      newStyle = currentStyle === 'normal' ? 'bold' : `bold ${currentStyle}`;
    }
    
    updateTextNode({ fontStyle: newStyle });
  };
  
  // Toggle italic style
  const toggleItalic = () => {
    const currentStyle = textNode.fontStyle || 'normal';
    const isItalic = currentStyle.includes('italic');
    
    let newStyle: string;
    if (isItalic) {
      newStyle = currentStyle.replace('italic', '').trim();
      if (newStyle === '') newStyle = 'normal';
    } else {
      newStyle = currentStyle === 'normal' ? 'italic' : `${currentStyle} italic`;
    }
    
    updateTextNode({ fontStyle: newStyle });
  };
  
  // Set text alignment
  const setAlignment = (align: 'left' | 'center' | 'right') => {
    updateTextNode({ align });
  };
  
  // Delete the selected text node
  const handleDeleteText = () => {
    if (!currentSlide || !selectedNodeId) return;
    removeNode(currentSlide.id, selectedNodeId);
  };
  
  // Toggle font upload form visibility
  const toggleFontUpload = () => {
    setShowFontUpload(!showFontUpload);
    setFontUploadState('idle');
    setFontError('');
  };
  
  // Check if text has specific styles
  const isBold = textNode.fontStyle?.includes('bold') || false;
  const isItalic = textNode.fontStyle?.includes('italic') || false;
  
  // Apply the selected text styling to all text nodes on all slides
  const handleApplyStylesToAllSlides = () => {
    if (!currentSlide || !selectedNodeId) return;
    
    applyTextStylingToAllSlides(selectedNodeId);
    
    toast({
      title: "Styles applied to all slides",
      description: "The text styling has been applied to all text elements on all slides",
    });
  };
  
  // Apply the selected text to all other slides
  const handleApplyToAllSlides = () => {
    if (!currentSlide || !selectedNodeId) return;
    
    applyNodeToOtherSlides(selectedNodeId);
    
    toast({
      title: "Applied to all slides",
      description: "This text styling has been applied to all text elements on other slides",
    });
  };

  // Copy the selected text with its exact position to all other slides
  const handleCopyToAllSlides = () => {
    if (!currentSlide || !selectedNodeId) return;
    
    copyNodeToAllSlides(selectedNodeId);
    
    toast({
      title: "Copied to all slides",
      description: "This text element has been copied to the same position on all other slides",
    });
  };
  
  return (
    <div className="p-4 bg-white border rounded-md shadow-md h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Type className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium">Text Properties</h3>
      </div>
      
      {/* Make this div scrollable */}
      <div className="overflow-y-auto flex-1 pr-2 hide-scrollbar editor-panel">
        {/* Font Family */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Font Family
            </label>
            <div className="flex gap-2">
              <button 
                onClick={handleRefreshFonts} 
                className="text-xs text-gray-600 hover:text-gray-800 p-1 rounded"
                title="Refresh fonts from server"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
              <button 
                onClick={toggleFontUpload}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showFontUpload ? 'Cancel' : '+ Add Custom Font'}
              </button>
            </div>
          </div>
          
          {/* Custom Font Upload Form */}
          {showFontUpload && (
            <div className="mb-3 p-3 bg-gray-50 rounded-md border">
              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Font Name (optional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  value={customFontName}
                  onChange={(e) => setCustomFontName(e.target.value)}
                  placeholder="Will use file name if empty"
                />
              </div>
              
              <label className="flex items-center justify-center gap-1 w-full py-2 px-3 border border-dashed border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer">
                <Upload className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">Select font file (.ttf, .otf, .woff, .woff2)</span>
                <input 
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  className="hidden"
                  onChange={handleFontUpload}
                  disabled={fontUploadState === 'loading'}
                />
              </label>
              
              {fontUploadState === 'loading' && (
                <div className="flex items-center mt-1">
                  <div className="animate-spin h-3 w-3 mr-2 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <p className="text-xs text-blue-500">Uploading font...</p>
                </div>
              )}
              {fontUploadState === 'error' && (
                <div className="mt-1 p-1 bg-red-50 rounded-sm border border-red-200">
                  <p className="text-xs text-red-500">{fontError}</p>
                </div>
              )}
            </div>
          )}
          
          <select
            className="w-full border rounded-md px-3 py-1.5"
            value={textNode.fontFamily}
            onChange={(e) => updateTextNode({ fontFamily: e.target.value })}
          >
            <optgroup label="System Fonts">
              {SYSTEM_FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </optgroup>
            
            {/* Custom Fonts Group */}
            {availableFonts.some(f => f.isCustom) && (
              <optgroup label="Custom Fonts">
                {availableFonts.filter(f => f.isCustom).map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
        
        {/* Font Size */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <select
            className="w-full border rounded-md px-3 py-1.5"
            value={textNode.fontSize}
            onChange={(e) => updateTextNode({ fontSize: Number(e.target.value) })}
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
        
        {/* Text Formatting */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Formatting
          </label>
          <div className="flex gap-1">
            <button
              className={`p-2 rounded-md ${
                isBold ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={toggleBold}
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              className={`p-2 rounded-md ${
                isItalic ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={toggleItalic}
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              className={`p-2 rounded-md ${
                textNode.align === 'left' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setAlignment('left')}
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              className={`p-2 rounded-md ${
                textNode.align === 'center' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setAlignment('center')}
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              className={`p-2 rounded-md ${
                textNode.align === 'right' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setAlignment('right')}
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Text Color */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Color
          </label>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-6 h-6 border rounded-md cursor-pointer" 
              style={{ backgroundColor: textNode.fill }}
            />
            <input
              type="text"
              className="border rounded-md px-2 py-1 w-24"
              value={textNode.fill}
              onChange={(e) => updateTextNode({ fill: e.target.value })}
            />
          </div>
          <HexColorPicker
            color={textNode.fill}
            onChange={(color) => updateTextNode({ fill: color })}
            className="w-full max-w-[200px]"
          />
        </div>
        
        {/* Background Color */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <button 
              onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showBackgroundColorPicker ? 'Hide Picker' : 'Show Picker'}
            </button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-6 h-6 border rounded-md cursor-pointer flex items-center justify-center" 
              style={{ backgroundColor: textNode.backgroundColor || 'transparent' }}
            >
              {!textNode.backgroundColor && <Square className="h-4 w-4 text-gray-300" />}
            </div>
            <input
              type="text"
              className="border rounded-md px-2 py-1 w-24"
              value={textNode.backgroundColor || ''}
              onChange={(e) => updateTextNode({ 
                backgroundColor: e.target.value === '' ? undefined : e.target.value 
              })}
              placeholder="transparent"
            />
            <button 
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
              onClick={() => updateTextNode({ backgroundColor: undefined })}
            >
              Clear
            </button>
          </div>
          {showBackgroundColorPicker && (
            <HexColorPicker
              color={textNode.backgroundColor || '#ffffff'}
              onChange={(color) => updateTextNode({ backgroundColor: color })}
              className="w-full max-w-[200px]"
            />
          )}
        </div>
        
        {/* Text Content */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            className="w-full border rounded-md px-3 py-2 min-h-[80px]"
            value={textNode.text}
            onChange={(e) => updateTextNode({ text: e.target.value })}
          />
        </div>
      </div>
      
      {/* Keep action buttons always visible at the bottom */}
      <div className="mt-4 border-t pt-4 flex-shrink-0">
        <button
          className="w-full flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors mb-2"
          onClick={handleApplyToAllSlides}
        >
          <CopyCheck className="h-4 w-4" />
          <span>Apply Styling to Other Slides</span>
        </button>
        
        <button
          className="w-full flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors mb-2"
          onClick={handleApplyStylesToAllSlides}
        >
          <PaintBucket className="h-4 w-4" />
          <span>Apply Styling to All Text Elements</span>
        </button>

        <button
          className="w-full flex items-center justify-center gap-2 p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors mb-2"
          onClick={handleCopyToAllSlides}
        >
          <Copy className="h-4 w-4" />
          <span>Copy Text to All Slides (Same Position)</span>
        </button>
        
        <button
          className="w-full flex items-center justify-center gap-2 p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
          onClick={handleDeleteText}
        >
          <Trash className="h-4 w-4" />
          <span>Delete Text</span>
        </button>
      </div>
    </div>
  );
};

export default KonvaTextToolbar; 