import React from 'react';
import { Button } from '@/components/ui/button';
import { useKonvaCarousel } from '../../contexts/KonvaCarouselContext';

const TemplatesPanel = () => {
  const { addSlide, getAvailableTemplates } = useKonvaCarousel();
  const templates = getAvailableTemplates();
  
  const handleTemplateClick = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      addSlide(template);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Templates</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map(template => (
          <div 
            key={template.id}
            className="cursor-pointer border rounded-md overflow-hidden hover:shadow-md transition-shadow"
            onClick={() => handleTemplateClick(template.id)}
          >
            <div className="aspect-[4/5] relative bg-gray-100">
              {template.thumbnail ? (
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: template.backgroundColor }}
                >
                  <span className="text-xs text-gray-500">No preview</span>
                </div>
              )}
            </div>
            <div className="p-2 text-xs truncate">{template.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPanel;
