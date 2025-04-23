import React, { useEffect, useState } from 'react';
import { useCarousel } from '../../contexts/CarouselContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEFAULT_TEXT_ELEMENT } from '../../data/templates';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { TextAlign, FontWeight, FontFamily } from '../../types';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Heading1, Heading2, ListOrdered, Quote, Bold, Italic, X, Highlighter, MinusCircle, PlusCircle, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getSlideDimensions, DEFAULT_FORMAT } from '../../constants';
import WebFont from 'webfontloader';

interface TextTemplateType {
  name: string;
  icon: React.ReactNode;
  fontSize: number;
  fontWeight: FontWeight;
  placeholder: string;
}

const textTemplates: TextTemplateType[] = [
  { 
    name: 'Heading 1', 
    icon: <Heading1 className="h-4 w-4" />, 
    fontSize: 80, 
    fontWeight: '700' as FontWeight,
    placeholder: 'Add a heading' 
  },
  { 
    name: 'Heading 2', 
    icon: <Heading2 className="h-4 w-4" />, 
    fontSize: 70, 
    fontWeight: '600' as FontWeight,
    placeholder: 'Add a subheading' 
  },
  { 
    name: 'Body', 
    icon: <Type className="h-4 w-4" />, 
    fontSize: 50, 
    fontWeight: '400' as FontWeight,
    placeholder: 'Add body text' 
  },
  { 
    name: 'Caption', 
    icon: <Type className="h-4 w-4" />, 
    fontSize: 32, 
    fontWeight: '400' as FontWeight,
    placeholder: 'Add a caption' 
  },
  { 
    name: 'List', 
    icon: <ListOrdered className="h-4 w-4" />, 
    fontSize: 50, 
    fontWeight: '400' as FontWeight,
    placeholder: '• List item 1\n• List item 2\n• List item 3' 
  },
  { 
    name: 'Quote', 
    icon: <Quote className="h-4 w-4" />, 
    fontSize: 60, 
    fontWeight: '500' as FontWeight,
    placeholder: '"Add an inspiring quote"' 
  }
];

// Add font families configuration
const fontFamilies = [
  { value: 'inter', label: 'Inter', category: 'sans-serif' },
  { value: 'poppins', label: 'Poppins', category: 'sans-serif' },
  { value: 'montserrat', label: 'Montserrat', category: 'sans-serif' },
  { value: 'playfair', label: 'Playfair Display', category: 'serif' },
  { value: 'roboto', label: 'Roboto', category: 'sans-serif' },
  { value: 'lato', label: 'Lato', category: 'sans-serif' },
  { value: 'open-sans', label: 'Open Sans', category: 'sans-serif' },
  { value: 'raleway', label: 'Raleway', category: 'sans-serif' },
  { value: 'oswald', label: 'Oswald', category: 'sans-serif' },
  { value: 'merriweather', label: 'Merriweather', category: 'serif' },
  { value: 'agrandir', label: 'Agrandir', category: 'sans-serif' },
  { value: 'nunito', label: 'Nunito', category: 'sans-serif' },
  { value: 'quicksand', label: 'Quicksand', category: 'sans-serif' },
  { value: 'source-serif-pro', label: 'Source Serif Pro', category: 'serif' },
  { value: 'dm-sans', label: 'DM Sans', category: 'sans-serif' },
  { value: 'josefin-sans', label: 'Josefin Sans', category: 'sans-serif' },
  { value: 'crimson-pro', label: 'Crimson Pro', category: 'serif' },
  { value: 'work-sans', label: 'Work Sans', category: 'sans-serif' },
  { value: 'manrope', label: 'Manrope', category: 'sans-serif' },
  { value: 'space-grotesk', label: 'Space Grotesk', category: 'sans-serif' }
];

interface CustomFont {
  name: string;
  url: string;
}

const TextPanel = () => {
  const { 
    slides, 
    currentSlideIndex, 
    addTextElement,
    updateTextElement,
    removeTextElement,
    selectedElementId
  } = useCarousel();

  const currentSlide = slides[currentSlideIndex];
  
  // Get dimensions based on format
  const dimensions = getSlideDimensions(DEFAULT_FORMAT);
  const { width: slideWidth, height: slideHeight } = dimensions;
  
  const selectedTextElement = currentSlide?.textElements.find(
    el => el.id === selectedElementId
  );

  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);

  // Load fonts when component mounts
  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          'Inter:300,400,500,600,700',
          'Poppins:300,400,500,600,700',
          'Montserrat:300,400,500,600,700',
          'Playfair Display:400,500,600,700',
          'Roboto:300,400,500,600,700',
          'Lato:300,400,500,600,700',
          'Open Sans:300,400,500,600,700',
          'Raleway:300,400,500,600,700',
          'Oswald:400,500,600,700',
          'Merriweather:300,400,500,600,700',
          'Nunito:300,400,500,600,700',
          'Quicksand:300,400,500,600,700',
          'Source Serif Pro:300,400,500,600,700',
          'DM Sans:400,500,700',
          'Josefin Sans:300,400,500,600,700',
          'Crimson Pro:300,400,500,600,700',
          'Work Sans:300,400,500,600,700',
          'Manrope:300,400,500,600,700',
          'Space Grotesk:300,400,500,600,700'
        ]
      }
    });
  }, []);

  const handleAddTextType = (template: TextTemplateType) => {
    if (!currentSlide) return;
    
    // Calculate center position
    const centerX = slideWidth / 2;
    const centerY = slideHeight / 2;
    
    addTextElement(currentSlide.id, {
      ...DEFAULT_TEXT_ELEMENT,
      text: template.placeholder,
      fontSize: template.fontSize,
      fontWeight: template.fontWeight as FontWeight,
      fontFamily: 'inter' as FontFamily,
      position: { x: centerX, y: centerY },
      textAlign: 'center'
    });
    
    toast({
      title: `${template.name} added`,
      description: `You can now edit the ${template.name.toLowerCase()} text`,
    });
  };

  const handleRemoveText = () => {
    if (!currentSlide || !selectedTextElement) return;
    removeTextElement(currentSlide.id, selectedTextElement.id);
    
    toast({
      title: "Text removed",
      description: "Text element has been deleted",
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentSlide || !selectedTextElement) return;
    updateTextElement(currentSlide.id, {
      ...selectedTextElement,
      text: e.target.value
    });
  };

  const handlePropertyChange = (property: string, value: string | number | boolean) => {
    if (!currentSlide || !selectedTextElement) return;
    updateTextElement(currentSlide.id, {
      ...selectedTextElement,
      [property]: value
    });
  };

  const handleAddText = () => {
    if (!currentSlide) return;

    const centerX = slideWidth / 2;
    const centerY = slideHeight / 2;

    addTextElement(currentSlide.id, {
      text: 'Double click to edit',
      position: { x: centerX, y: centerY },
      fontSize: 24,
      fontFamily: 'inter' as FontFamily,
      fontWeight: '400' as FontWeight,
      color: '#000000',
      textAlign: 'center'
    });
  };

  const handleAlignChange = (elementId: string, align: 'left' | 'center' | 'right') => {
    if (!currentSlide) return;

    const element = currentSlide.textElements.find(el => el.id === elementId);
    if (!element) return;

    updateTextElement(currentSlide.id, {
      ...element,
      textAlign: align
    });
  };

  const handleCustomFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if it's a valid font file
    if (!file.name.match(/\.(woff2?|ttf|otf)$/i)) {
      toast({
        title: "Invalid font file",
        description: "Please upload a .woff, .woff2, .ttf, or .otf font file",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a URL for the font file
      const fontUrl = URL.createObjectURL(file);
      
      // Create a font face to load the custom font
      const fontName = file.name.replace(/\.[^/.]+$/, "");
      const fontFace = new FontFace(fontName, `url(${fontUrl})`);
      
      // Load the font
      await fontFace.load();
      
      // Add the font to the document
      document.fonts.add(fontFace);
      
      // Add to custom fonts list
      setCustomFonts(prev => [...prev, { name: fontName, url: fontUrl }]);
      
      toast({
        title: "Font added successfully",
        description: `${fontName} is now available in the font selector`,
      });
    } catch (error) {
      toast({
        title: "Error loading font",
        description: "Failed to load the custom font. Please try another file.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
      <h2 className="font-medium text-lg">Text Elements</h2>
        <Button onClick={handleAddText} size="sm">
          Add Text
        </Button>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Text</TabsTrigger>
          <TabsTrigger value="edit" disabled={!selectedTextElement}>Edit Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-2">
            {textTemplates.map((template) => (
      <Button 
                key={template.name}
                variant="outline" 
                className="h-auto py-2 flex flex-col items-center justify-center"
                onClick={() => handleAddTextType(template)}
      >
                <div className="mb-1">{template.icon}</div>
                <span className="text-xs">{template.name}</span>
      </Button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Select a text template to add to your slide
          </div>
        </TabsContent>
        
        <TabsContent value="edit" className="space-y-4 mt-2">
      {selectedTextElement ? (
            <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text Content</Label>
                <Textarea
              id="text"
              value={selectedTextElement.text}
              onChange={handleTextChange}
                  rows={4}
                  className="resize-none w-full"
                  placeholder="Enter text content..."
            />
          </div>
          
              {/* Quick Format Options */}
              <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/20 rounded-lg">
                {/* Text Style */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={selectedTextElement.fontWeight === '700' ? 'default' : 'outline'}
                    className="h-8 w-8 p-0"
                    onClick={() => handlePropertyChange('fontWeight', selectedTextElement.fontWeight === '700' ? ('400' as FontWeight) : ('700' as FontWeight))}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={selectedTextElement.isItalic ? 'default' : 'outline'}
                    className="h-8 w-8 p-0"
                    onClick={() => handlePropertyChange('isItalic', !selectedTextElement.isItalic)}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </div>

                {/* Font Size */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePropertyChange('fontSize', Math.max(8, selectedTextElement.fontSize - 2))}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-12 text-center">{selectedTextElement.fontSize}px</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePropertyChange('fontSize', Math.min(200, selectedTextElement.fontSize + 2))}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-1">
                  <Input
                    type="color"
                    className="w-8 h-8 p-0"
                    value={selectedTextElement.color}
                    onChange={(e) => handlePropertyChange('color', e.target.value)}
                    title="Text Color"
                  />
                  <div className="relative">
                    <Input
                      type="color"
                      className="w-8 h-8 p-0"
                      value={selectedTextElement.backgroundColor || '#ffffff'}
                      onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                      title="Background Color"
                    />
                    <Highlighter className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                  {selectedTextElement.backgroundColor && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handlePropertyChange('backgroundColor', '')}
                      title="Remove Background"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={selectedTextElement.textAlign === 'left' ? 'default' : 'outline'}
                    className="h-8 w-8 p-0"
                    onClick={() => handlePropertyChange('textAlign', 'left')}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={selectedTextElement.textAlign === 'center' ? 'default' : 'outline'}
                    className="h-8 w-8 p-0"
                    onClick={() => handlePropertyChange('textAlign', 'center')}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={selectedTextElement.textAlign === 'right' ? 'default' : 'outline'}
                    className="h-8 w-8 p-0"
                    onClick={() => handlePropertyChange('textAlign', 'right')}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="text-sm font-medium">Advanced Options</h3>
                
                <div className="space-y-3">
          <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <div className="relative">
                        <input
                          type="file"
                          id="fontUpload"
                          className="hidden"
                          accept=".woff,.woff2,.ttf,.otf"
                          onChange={handleCustomFontUpload}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('fontUpload')?.click()}
                          className="h-8 px-2 text-xs"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Font
                        </Button>
                      </div>
                    </div>
            <Select 
              value={selectedTextElement.fontFamily}
              onValueChange={(value) => handlePropertyChange('fontFamily', value)}
            >
                      <SelectTrigger id="fontFamily" className="w-full">
                <SelectValue placeholder="Select Font" />
              </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {customFonts.length > 0 && (
                          <>
                            <div className="px-2 py-1.5 text-sm font-semibold">Custom Fonts</div>
                            <div className="grid gap-1">
                              {customFonts.map((font) => (
                                <SelectItem 
                                  key={font.name} 
                                  value={font.name}
                                  className="flex items-center"
                                >
                                  <span style={{ fontFamily: font.name }}>
                                    {font.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </div>
                            <div className="px-2 py-1.5 text-sm font-semibold">System Fonts</div>
                          </>
                        )}
                        <div className="grid gap-1">
                          {fontFamilies.map((font) => (
                            <SelectItem 
                              key={font.value} 
                              value={font.value}
                              className="flex items-center"
                            >
                              <span style={{ fontFamily: `${font.value}, ${font.category}` }}>
                                {font.label}
                              </span>
                            </SelectItem>
                          ))}
                        </div>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
                    <Label htmlFor="fontWeight">Weight</Label>
            <Select 
              value={selectedTextElement.fontWeight}
              onValueChange={(value) => handlePropertyChange('fontWeight', value)}
            >
                      <SelectTrigger id="fontWeight" className="w-full">
                <SelectValue placeholder="Select Weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light</SelectItem>
                <SelectItem value="400">Regular</SelectItem>
                <SelectItem value="500">Medium</SelectItem>
                <SelectItem value="600">SemiBold</SelectItem>
                <SelectItem value="700">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
            </div>
          </div>
          
                <Button
                variant="destructive"
                  size="sm"
                onClick={handleRemoveText}
                className="w-full mt-6"
                >
                Remove Text
                </Button>
        </div>
      ) : (
        <div className="text-sm text-gray-500 mt-4">
          {currentSlide ? 
            "Select a text element to edit its properties" : 
            "Create a slide to add text elements"}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {currentSlide?.textElements.map((element) => (
        <div 
          key={element.id} 
          className={cn(
            "p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer",
            selectedElementId === element.id && "border-blue-500 bg-blue-50 hover:bg-blue-50"
          )}
          onClick={() => handlePropertyChange('selectedElementId', element.id)}
        >
          <div className="flex items-center justify-between mb-2">
            <span 
              className="font-medium truncate max-w-[180px] text-sm"
              style={{ 
                fontFamily: `${element.fontFamily}, ${fontFamilies.find(f => f.value === element.fontFamily)?.category || 'sans-serif'}`
              }}
              title={element.text}
            >
              {element.text || "Empty text"}
            </span>
            <span className="text-xs text-gray-500">{element.fontSize}px</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{element.fontFamily}</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{element.fontWeight}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-6 w-6 p-0", element.textAlign === 'left' && "bg-gray-100")}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAlignChange(element.id, 'left');
                }}
              >
                <AlignLeft className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-6 w-6 p-0", element.textAlign === 'center' && "bg-gray-100")}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAlignChange(element.id, 'center');
                }}
              >
                <AlignCenter className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-6 w-6 p-0", element.textAlign === 'right' && "bg-gray-100")}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAlignChange(element.id, 'right');
                }}
              >
                <AlignRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {!currentSlide?.textElements.length && (
        <div className="text-center py-6 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed">
          <Type className="h-5 w-5 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No text elements yet</p>
          <p className="text-xs text-gray-400">Click "Add Text" to get started</p>
        </div>
      )}
    </div>
  );
};

export default TextPanel;

