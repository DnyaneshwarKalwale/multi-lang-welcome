import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, LayoutGrid, Sparkles, Zap, Heart,
  CheckCircle, Download, PlusCircle, X, ExternalLink,
  Edit3, Share2, Copy, MessageSquare, ChevronLeft, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { SliderVariant } from '@/types/LinkedInPost';
import { CarouselPreview } from '@/components/CarouselPreview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Template categories
type TemplateCategory = 'all' | 'trending' | 'business' | 'personal' | 'educational';

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

const CarouselTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<CarouselTemplate | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');
  const [sliderVariant, setSliderVariant] = useState<SliderVariant>('basic');
  
  // Available slider variants
  const sliderOptions: SliderVariant[] = [
    'basic',
    'pagination',
    'gallery',
    'looped',
    'autoplay',
    'responsive',
    'grid',
    'coverflow',
    'fade',
    'vertical',
    'thumbs',
    'parallax'
  ];
  
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
    },
    {
      id: 'template-7',
      name: 'Data Visualization',
      description: 'Present complex data in a clear, visually appealing way with charts and graphs',
      category: ['business', 'educational'],
      slideCount: 8,
      previewImages: [
        '/carousel-templates/data-viz-1.png',
        '/carousel-templates/data-viz-2.png',
        '/carousel-templates/data-viz-3.png'
      ],
      popularity: 1670,
      isPremium: true,
      isNew: false
    },
    {
      id: 'template-8',
      name: 'Career Advice',
      description: 'Share professional growth tips and career development strategies',
      category: ['personal', 'educational'],
      slideCount: 7,
      previewImages: [
        '/carousel-templates/career-advice-1.png',
        '/carousel-templates/career-advice-2.png',
        '/carousel-templates/career-advice-3.png'
      ],
      popularity: 1530,
      isPremium: false,
      isNew: false
    },
    {
      id: 'template-9',
      name: 'Industry Trends',
      description: 'Highlight emerging trends and developments in your industry',
      category: ['business', 'trending'],
      slideCount: 9,
      previewImages: [
        '/carousel-templates/industry-trends-1.png',
        '/carousel-templates/industry-trends-2.png',
        '/carousel-templates/industry-trends-3.png'
      ],
      popularity: 2050,
      isPremium: false,
      isNew: true
    },
    {
      id: 'template-10',
      name: 'Team Showcase',
      description: 'Introduce your team members and showcase their expertise',
      category: ['business', 'personal'],
      slideCount: 6,
      previewImages: [
        '/carousel-templates/team-showcase-1.png',
        '/carousel-templates/team-showcase-2.png',
        '/carousel-templates/team-showcase-3.png'
      ],
      popularity: 890,
      isPremium: false,
      isNew: false
    }
  ];
  
  // Filter templates by category
  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category.includes(activeCategory));
  
  // Function to use selected template
  const useTemplate = (template: CarouselTemplate) => {
    navigate(`/dashboard/request-carousel?templateId=${template.id}`);
    toast.success(`Selected template: ${template.name}`);
  };
  
  // Function to create new post with template
  const createPost = (template: CarouselTemplate) => {
    navigate(`/dashboard/post?templateId=${template.id}&type=carousel`);
    toast.success(`Creating new post with ${template.name} template`);
  };
  
  // Function to handle next slide in preview
  const nextSlide = () => {
    if (selectedTemplate) {
      setCurrentSlide((prev) => 
        prev === selectedTemplate.previewImages.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  // Function to handle previous slide in preview
  const prevSlide = () => {
    if (selectedTemplate) {
      setCurrentSlide((prev) => 
        prev === 0 ? selectedTemplate.previewImages.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Carousel Templates</h1>
          <p className="text-black">
            Choose from our collection of professionally designed carousel templates
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/dashboard/request-carousel')}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Request Carousel
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard/post?type=carousel')}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="mb-6">
        <Tabs 
          value={activeCategory} 
          onValueChange={(value) => setActiveCategory(value as TemplateCategory)}
          className="w-full"
        >
          <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="educational">Educational</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full flex flex-col overflow-hidden border-2 hover:border-primary hover:shadow-md transition-all duration-200">
              <div 
                className="aspect-video bg-white border-b relative cursor-pointer"
                onClick={() => {
                  setSelectedTemplate(template);
                  setCurrentSlide(0);
                }}
              >
                {/* Placeholder for template preview */}
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
                
                {/* Preview button */}
                <div className="absolute bottom-3 right-3">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-white text-black border border-blue-200 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      setCurrentSlide(0);
                    }}
                  >
                    Preview
                  </Button>
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
                <p className="text-sm text-black mb-3 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center text-xs text-black">
                  <Heart className="h-3 w-3 mr-1 text-red-400" />
                  <span>{template.popularity.toLocaleString()} uses</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 pb-4 flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => useTemplate(template)}
                >
                  Use Template
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-blue-200"
                  onClick={() => createPost(template)}
                  title="Create Post"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Template Preview Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedTemplate?.name}</span>
              <div className="flex gap-2">
                {selectedTemplate?.isNew && (
                  <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                )}
                {selectedTemplate?.isPremium && (
                  <Badge className="bg-amber-500 hover:bg-amber-600">Premium</Badge>
                )}
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          {/* Slider Type Selection */}
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm">Preview Style:</div>
            <Select value={sliderVariant} onValueChange={(value) => setSliderVariant(value as SliderVariant)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {sliderOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Carousel Preview */}
          <div className="relative overflow-hidden rounded-xl my-4">
            {selectedTemplate && (
              <CarouselPreview
                slides={selectedTemplate.previewImages.map((slide, index) => ({
                  id: `slide-${index}`,
                  content: `Slide ${index + 1}: ${selectedTemplate.name}`
                }))}
                variant={sliderVariant}
              />
            )}
            
            {sliderVariant !== 'basic' && (
              <div className="text-xs text-center mt-2 text-muted-foreground bg-muted/30 rounded-md p-1">
                <span className="font-medium capitalize">{sliderVariant}</span> slider style applied
              </div>
            )}
          </div>
          
          {/* Template details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium">Slide Count</h3>
              </div>
              <p className="text-sm text-black">
                {selectedTemplate?.slideCount} professionally designed slides
              </p>
            </div>
            <div className="bg-white border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-400" />
                <h3 className="font-medium">Popularity</h3>
              </div>
              <p className="text-sm text-black">
                Used by {selectedTemplate?.popularity.toLocaleString()} professionals
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm flex items-start gap-2">
              <span className="text-blue-500 mt-0.5"><MessageSquare size={16} /></span>
              <span>
                <strong>Tip:</strong> Select different slider styles above to preview how your carousel will appear with various animations and layouts. These styles can be applied when creating a post.
              </span>
            </p>
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            <div className="hidden sm:flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1"
                onClick={() => {
                  toast.success("Template details copied to clipboard");
                }}
              >
                <Copy className="h-3.5 w-3.5" />
                Share
              </Button>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline"
                className="flex-1 sm:flex-auto"
                onClick={() => {
                  if (selectedTemplate) {
                    createPost(selectedTemplate);
                  }
                }}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Create Post
              </Button>
              <Button 
                className="flex-1 sm:flex-auto"
                onClick={() => {
                  if (selectedTemplate) {
                    useTemplate(selectedTemplate);
                  }
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarouselTemplatesPage; 