import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useCarousel } from '../contexts/CarouselContext';
import { TextElement as TextElementType } from '../types';
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Highlighter,
  Type,
  MinusCircle,
  PlusCircle,
  Palette,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TextElementProps {
  text: TextElementType;
  slideId: string;
  isPrinting?: boolean;
}

const TextElement: React.FC<TextElementProps> = ({ text, slideId, isPrinting = false }) => {
  const { updateTextElement, selectedElementId, setSelectedElementId } = useCarousel();
  const [isEditing, setIsEditing] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  const isSelected = selectedElementId === text.id;

  useEffect(() => {
    console.log("TextElement rendered:", {
      id: text.id,
      content: text.text?.substring(0, 20) + (text.text?.length > 20 ? '...' : ''),
      position: text.position,
      size: { width: text.width, height: text.height }
    });
  }, [text]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current && 
        !editorRef.current.contains(event.target as Node) &&
        textRef.current &&
        !textRef.current.contains(event.target as Node)
      ) {
        setShowFormatting(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    updateTextElement(slideId, {
      ...text,
      position: { x: data.x, y: data.y }
    });
  };
  
  const handleSelect = () => {
    setSelectedElementId(text.id);
    setShowFormatting(true);
  };

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    updateTextElement(slideId, {
      ...text,
      text: content
    });
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (!selection || !textRef.current) return;

    const range = selection.getRangeAt(0);
    setSelection({
      start: range.startOffset,
      end: range.endOffset
    });
  };

  const applyFormatting = (format: string, value: any) => {
    if (!textRef.current) return;

    const content = text.text;
    const before = content.substring(0, selection.start);
    const selected = content.substring(selection.start, selection.end);
    const after = content.substring(selection.end);

    let formattedText = content;
    switch (format) {
      case 'bold':
        formattedText = `${before}**${selected}**${after}`;
        break;
      case 'italic':
        formattedText = `${before}_${selected}_${after}`;
        break;
      default:
        updateTextElement(slideId, {
          ...text,
          [format]: value
        });
        return;
    }

    updateTextElement(slideId, {
      ...text,
      text: formattedText
    });
  };

  return (
    <>
    <Draggable
      position={text.position}
      onStop={handleDragStop}
      bounds="parent"
      defaultPosition={text.position}
    >
      <div 
        ref={textRef}
        data-text-element
        className={cn(
          "absolute cursor-move select-none group text-element",
          isSelected && !isPrinting && "ring-2 ring-primary ring-offset-2",
          isPrinting && "!cursor-default"
        )}
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          transform: `translate(${text.position.x}px, ${text.position.y}px)`,
          fontFamily: `${text.fontFamily}, ${text.fontFamily === 'playfair' ? 'serif' : 'sans-serif'}`,
          fontSize: `${text.fontSize}px`,
          fontWeight: text.fontWeight,
          color: text.color,
          backgroundColor: text.backgroundColor || 'transparent',
          fontStyle: text.isItalic ? 'italic' : 'normal',
          textAlign: text.textAlign,
          width: text.width ? `${text.width}px` : 'auto',
          height: text.height ? `${text.height}px` : 'auto',
          maxWidth: text.width ? `${text.width}px` : '800px', 
          padding: '10px',
          boxSizing: 'border-box',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          lineHeight: '1.4',
          zIndex: text.zIndex || 1,
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: text.textAlign === 'center' ? 'center' : 
                         text.textAlign === 'right' ? 'flex-end' : 'flex-start'
        }}
        onClick={handleSelect}
        onDoubleClick={() => setIsEditing(true)}
        contentEditable={isEditing}
        onBlur={() => setIsEditing(false)}
        onInput={handleTextChange}
        onSelect={handleSelectionChange}
        suppressContentEditableWarning
      >
        {text.text}
      </div>
    </Draggable>

      {showFormatting && !isPrinting && (
        <div
          ref={editorRef}
          className="fixed bg-white rounded-lg shadow-lg border p-4 space-y-4 z-[9999] min-w-[300px] max-w-[400px]"
          style={{
            top: `${text.position.y - 10}px`,
            left: `${text.position.x}px`,
            transform: 'translate(-50%, -100%)',
            maxHeight: '80vh',
            overflowY: 'auto',
            overscrollBehavior: 'contain'
          }}
        >
          {/* Quick Format Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/20 rounded-lg sticky top-0 bg-white z-10">
            <div className="flex items-center gap-1">
              <Button
                variant={text.fontWeight === '700' ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormatting('fontWeight', text.fontWeight === '700' ? '400' : '700')}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={text.isItalic ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormatting('isItalic', !text.isItalic)}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormatting('fontSize', Math.max(8, text.fontSize - 2))}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="text-sm w-12 text-center">{text.fontSize}px</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormatting('fontSize', Math.min(200, text.fontSize + 2))}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-1">
              <div className="relative">
                <Input
                  type="color"
                  className="w-8 h-8 p-0"
                  value={text.color}
                  onChange={(e) => applyFormatting('color', e.target.value)}
                  title="Text Color"
                />
                <Palette className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
              <div className="relative">
                <Input
                  type="color"
                  className="w-8 h-8 p-0"
                  value={text.backgroundColor || '#ffffff'}
                  onChange={(e) => applyFormatting('backgroundColor', e.target.value)}
                  title="Background Color"
                />
                <Highlighter className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-1">
              <Button
                variant={text.textAlign === 'left' ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormatting('textAlign', 'left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={text.textAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormatting('textAlign', 'center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={text.textAlign === 'right' ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => applyFormatting('textAlign', 'right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Font Controls */}
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={text.fontFamily}
              onValueChange={(value) => applyFormatting('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Font Family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="poppins">Poppins</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
                <SelectItem value="playfair">Playfair</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={text.fontWeight}
              onValueChange={(value) => applyFormatting('fontWeight', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Weight" />
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

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => setShowFormatting(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default TextElement;
