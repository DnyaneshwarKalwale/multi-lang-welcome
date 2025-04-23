
import React from 'react';
import { templates } from '../../data/templates';
import { useCarousel } from '../../contexts/CarouselContext';
import { Button } from '@/components/ui/button';

const TemplatesPanel = () => {
  const { addSlide } = useCarousel();

  return (
    <div className="space-y-4">
      <h2 className="font-medium text-lg">Templates</h2>
      
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <div 
            key={template.id}
            className="border rounded-md overflow-hidden cursor-pointer hover:border-brand-blue transition-colors"
            onClick={() => addSlide(template)}
          >
            <div 
              className="template-preview"
              style={{ 
                backgroundColor: template.backgroundColor,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px'
              }}
            >
              {template.textElements.slice(0, 1).map((text, idx) => (
                <div 
                  key={idx}
                  style={{
                    fontFamily: text.fontFamily,
                    fontSize: `${Math.min(text.fontSize / 5, 24)}px`,
                    fontWeight: text.fontWeight,
                    color: text.color,
                    textAlign: text.align as any
                  }}
                >
                  {text.text}
                </div>
              ))}
            </div>
            <div className="p-2 bg-white">
              <p className="text-xs text-center truncate">{template.name}</p>
            </div>
          </div>
        ))}
      </div>

      <Button 
        className="w-full mt-4" 
        variant="outline"
        onClick={() => addSlide()}
      >
        Blank Slide
      </Button>
    </div>
  );
};

export default TemplatesPanel;
