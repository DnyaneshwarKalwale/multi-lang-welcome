import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, PlusCircle, LayoutGrid, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';

// Template categories
type TemplateCategory = 'all' | 'business' | 'personal' | 'educational' | 'trending';

// Template interface
interface CarouselTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory[];
  slideCount: number;
  previewImages: string[];
  popularity: number;
  isPremium: boolean;
  isNew: boolean;
}

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<CarouselTemplate | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');
  
  // Predefined carousel templates with more details
  const templates: CarouselTemplate[] = [
    {
      id: 'template-1',
      name: 'Industry Insights',
      description: 'Share valuable insights and trends in your industry with data visualization and professional analysis',
      category: ['business', 'trending'],
      slideCount: 8,
      previewImages: [
        '/carousel-templates/industry-insights-1.png',
        '/carousel-templates/industry-insights-2.png',
        '/carousel-templates/industry-insights-3.png'
      ],
      popularity: 1250,
      isPremium: false,
      isNew: false
    },
    {
      id: 'template-2',
      name: 'How-To Guide',
      description: 'Step-by-step instructions with clear visuals and actionable tips to guide your audience',
      category: ['educational', 'trending'],
      slideCount: 10,
      previewImages: [
        '/carousel-templates/how-to-guide-1.png',
        '/carousel-templates/how-to-guide-2.png',
        '/carousel-templates/how-to-guide-3.png'
      ],
      popularity: 1850,
      isPremium: false,
      isNew: true
    },
    {
      id: 'template-3',
      name: 'Case Study',
      description: 'Present a business challenge, solution, and results with compelling storytelling',
      category: ['business'],
      slideCount: 7,
      previewImages: [
        '/carousel-templates/case-study-1.png',
        '/carousel-templates/case-study-2.png',
        '/carousel-templates/case-study-3.png'
      ],
      popularity: 950,
      isPremium: false,
      isNew: false
    },
    {
      id: 'template-4',
      name: 'List Post',
      description: 'Present key points in a numbered list format with supporting visuals',
      category: ['personal', 'trending'],
      slideCount: 6,
      previewImages: [
        '/carousel-templates/list-post-1.png',
        '/carousel-templates/list-post-2.png',
        '/carousel-templates/list-post-3.png'
      ],
      popularity: 2200,
      isPremium: false,
      isNew: false
    },
    {
      id: 'template-5',
      name: 'Product Showcase',
      description: 'Highlight your product features and benefits with elegant visuals',
      category: ['business'],
      slideCount: 8,
      previewImages: [
        '/carousel-templates/product-showcase-1.png',
        '/carousel-templates/product-showcase-2.png',
        '/carousel-templates/product-showcase-3.png'
      ],
      popularity: 1420,
      isPremium: true,
      isNew: false
    },
    {
      id: 'template-6',
      name: 'Expert Tips',
      description: 'Share professional advice and insights in a visually engaging format',
      category: ['personal', 'educational'],
      slideCount: 5,
      previewImages: [
        '/carousel-templates/expert-tips-1.png',
        '/carousel-templates/expert-tips-2.png',
        '/carousel-templates/expert-tips-3.png'
      ],
      popularity: 980,
      isPremium: false,
      isNew: true
    }
  ];
  
  // Filter templates by category
  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category.includes(activeCategory));
  
  // Function to use selected template
  const useTemplate = (template: CarouselTemplate) => {
    navigate(`/create-carousel?templateId=${template.id}`);
    toast({
      title: "Template selected",
      description: `You've selected the ${template.name} template`,
    });
  };
  
  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Carousel Templates</h1>
          <p className="text-gray-600">
            Choose from our collection of professionally designed carousel templates
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={() => navigate('/create-carousel')}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Carousel
          </Button>
        </div>
      </div>
      
      {/* Category Tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeCategory}
        onValueChange={(value) => setActiveCategory(value as TemplateCategory)}
        className="mb-6"
      >
        <TabsList className="mb-2">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="educational">Educational</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
        <p className="text-sm text-gray-500">
          Showing {filteredTemplates.length} templates in {activeCategory === 'all' ? 'all categories' : `the ${activeCategory} category`}
        </p>
      </Tabs>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full flex flex-col overflow-hidden border hover:border-blue-500 hover:shadow-md transition-all duration-200">
              <div 
                className="aspect-video bg-white border-b relative cursor-pointer"
                onClick={() => {
                  setSelectedTemplate(template);
                  setCurrentSlide(0);
                }}
              >
                {/* Template preview image */}
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                  <LayoutGrid className="h-16 w-16 text-blue-200" />
                </div>
                
                {/* Template badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {template.isNew && (
                    <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                  )}
                  {template.isPremium && (
                    <Badge className="bg-amber-500 hover:bg-amber-600">Premium</Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="py-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{template.name}</h3>
                  <div className="flex items-center text-sm">
                    <LayoutGrid className="h-3.5 w-3.5 mr-1 text-blue-500" />
                    <span>{template.slideCount} slides</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Heart className="h-3 w-3 mr-1 text-red-400" />
                  <span>{template.popularity.toLocaleString()} uses</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 pb-4">
                <Button 
                  className="w-full"
                  onClick={() => useTemplate(template)}
                >
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Template Preview Dialog */}
      <Dialog open={selectedTemplate !== null} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl w-[90vw]">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedTemplate.name}</span>
                  <div className="flex gap-2">
                    {selectedTemplate.isNew && (
                      <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                    )}
                    {selectedTemplate.isPremium && (
                      <Badge className="bg-amber-500 hover:bg-amber-600">Premium</Badge>
                    )}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  {selectedTemplate.description}
                </DialogDescription>
              </DialogHeader>
              
              {/* Template Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <LayoutGrid className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">Slide Count</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedTemplate.slideCount} professionally designed slides
                  </p>
                </div>
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-red-400" />
                    <h3 className="font-medium">Popularity</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Used by {selectedTemplate.popularity.toLocaleString()} professionals
                  </p>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => {
                  useTemplate(selectedTemplate);
                  setSelectedTemplate(null);
                }}
              >
                Use This Template
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesPage; 