import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  LayoutGrid,
  Search,
  Plus,
  Filter,
  CheckCircle,
  ChevronRight,
  Tag,
  Clock,
  Eye,
  BookOpen,
  SlidersHorizontal
} from 'lucide-react';
import { SliderVariant } from '@/types/LinkedInPost';

// Template interfaces
interface CarouselTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  slideCount: number;
  previewImage?: string;
  popularity: 'high' | 'medium' | 'low';
  new?: boolean;
}

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Simulated carousel templates
  const templates: CarouselTemplate[] = [
    {
      id: 'template-1',
      name: 'Industry Insights',
      description: 'Share valuable insights and trends in your industry with data visualization',
      category: 'industry-insights',
      slideCount: 8,
      previewImage: '/carousel-templates/industry-insights.png',
      popularity: 'high',
      new: true
    },
    {
      id: 'template-2',
      name: 'How-To Guide',
      description: 'Step-by-step instructions with clear visuals and actionable tips',
      category: 'how-to',
      slideCount: 10,
      previewImage: '/carousel-templates/how-to-guide.png',
      popularity: 'high'
    },
    {
      id: 'template-3',
      name: 'Case Study',
      description: 'Present a business challenge, solution, and results with compelling storytelling',
      category: 'case-study',
      slideCount: 7,
      previewImage: '/carousel-templates/case-study.png',
      popularity: 'medium'
    },
    {
      id: 'template-4',
      name: 'List Post',
      description: 'Present key points in a numbered list format with supporting visuals',
      category: 'listicle',
      slideCount: 6,
      previewImage: '/carousel-templates/list-post.png',
      popularity: 'high'
    },
    {
      id: 'template-5',
      name: 'Product Launch',
      description: 'Announce your new product with engaging visuals and key features',
      category: 'promotional',
      slideCount: 8,
      previewImage: '/carousel-templates/product-launch.png',
      popularity: 'medium',
      new: true
    },
    {
      id: 'template-6',
      name: 'Market Trends',
      description: 'Highlight key market trends with data visualizations and insights',
      category: 'industry-insights',
      slideCount: 7,
      previewImage: '/carousel-templates/market-trends.png',
      popularity: 'low'
    },
    {
      id: 'template-7',
      name: 'FAQ Series',
      description: 'Answer common questions in your industry with clear explanations',
      category: 'educational',
      slideCount: 9,
      previewImage: '/carousel-templates/faq.png',
      popularity: 'medium'
    },
    {
      id: 'template-8',
      name: 'Portfolio Showcase',
      description: 'Showcase your work with beautiful visuals and key achievements',
      category: 'promotional',
      slideCount: 6,
      previewImage: '/carousel-templates/portfolio.png',
      popularity: 'low'
    }
  ];
  
  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Select a template and go to create carousel page
  const handleSelectTemplate = (templateId: string) => {
    navigate(`/dashboard/create-carousel?template=${templateId}`);
  };
  
  // Template preview display
  const TemplateCard = ({ template }: { template: CarouselTemplate }) => (
    <Card className="overflow-hidden border hover:border-blue-400 hover:shadow-md transition-all">
      <div className="aspect-video bg-gray-100 flex items-center justify-center border-b relative">
        {template.previewImage ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <LayoutGrid className="w-12 h-12 text-blue-400" />
          </div>
        ) : (
          <LayoutGrid className="w-12 h-12 text-blue-400" />
        )}
        
        {template.new && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
            NEW
          </div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <LayoutGrid className="h-3 w-3 mr-1" />
          {template.slideCount} slides
        </div>
        
        <Button 
          size="sm" 
          onClick={() => handleSelectTemplate(template.id)}
          className="text-xs h-8"
        >
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Carousel Templates</h1>
          <p className="text-black text-sm">
            Choose from our professionally designed templates to create your LinkedIn carousel
          </p>
        </div>
        
        <Button onClick={() => navigate('/dashboard/create-carousel')} className="gap-2">
          <Plus className="h-4 w-4" />
          Custom Template
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          <Button variant="outline" size="sm" className="gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            Sort
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Category tabs */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="how-to">How-To</TabsTrigger>
          <TabsTrigger value="listicle">Listicles</TabsTrigger>
          <TabsTrigger value="case-study">Case Studies</TabsTrigger>
          <TabsTrigger value="industry-insights">Industry Insights</TabsTrigger>
          <TabsTrigger value="promotional">Promotional</TabsTrigger>
          <TabsTrigger value="educational">Educational</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Templates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-black text-sm mb-4">
            We couldn't find any templates matching your search criteria.
          </p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage; 