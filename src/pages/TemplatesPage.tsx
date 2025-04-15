import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  Check, 
  Star, 
  Clock, 
  ChevronRight, 
  EyeIcon 
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Template category type
type TemplateCategory = 
  | 'all'
  | 'listicle' 
  | 'how-to' 
  | 'case-study' 
  | 'industry-insights' 
  | 'educational' 
  | 'promotional';

// Template interface
interface CarouselTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  slideCount: number;
  imageUrl: string;
  tags: string[];
  isPremium: boolean;
  isNew?: boolean;
}

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');
  const [sortBy, setSortBy] = useState('popular');
  
  // Sample templates data
  const templates: CarouselTemplate[] = [
    {
      id: 'template-1',
      name: 'Industry Insights',
      description: 'Share valuable insights and trends in your industry with data visualization',
      category: 'industry-insights',
      slideCount: 8,
      imageUrl: '/carousel-templates/industry-insights.png',
      tags: ['professional', 'data', 'trends'],
      isPremium: false,
      isNew: true
    },
    {
      id: 'template-2',
      name: 'How-To Guide',
      description: 'Step-by-step instructions with clear visuals and actionable tips',
      category: 'how-to',
      slideCount: 10,
      imageUrl: '/carousel-templates/how-to-guide.png',
      tags: ['instructional', 'guide', 'tutorial'],
      isPremium: false
    },
    {
      id: 'template-3',
      name: 'Case Study',
      description: 'Present a business challenge, solution, and results with compelling storytelling',
      category: 'case-study',
      slideCount: 7,
      imageUrl: '/carousel-templates/case-study.png',
      tags: ['business', 'results', 'storytelling'],
      isPremium: true
    },
    {
      id: 'template-4',
      name: 'List Post',
      description: 'Present key points in a numbered list format with supporting visuals',
      category: 'listicle',
      slideCount: 6,
      imageUrl: '/carousel-templates/list-post.png',
      tags: ['list', 'points', 'concise'],
      isPremium: false
    },
    {
      id: 'template-5',
      name: 'Product Showcase',
      description: 'Highlight product features and benefits in a visually appealing format',
      category: 'promotional',
      slideCount: 8,
      imageUrl: '/carousel-templates/product-showcase.png',
      tags: ['product', 'promotional', 'features'],
      isPremium: true,
      isNew: true
    },
    {
      id: 'template-6',
      name: 'Data Story',
      description: 'Transform complex data into a compelling visual narrative',
      category: 'educational',
      slideCount: 9,
      imageUrl: '/carousel-templates/data-story.png',
      tags: ['data', 'visualization', 'story'],
      isPremium: true
    },
    {
      id: 'template-7',
      name: 'Team Spotlight',
      description: 'Showcase your team members and their accomplishments',
      category: 'promotional',
      slideCount: 5,
      imageUrl: '/carousel-templates/team-spotlight.png',
      tags: ['team', 'culture', 'people'],
      isPremium: false
    },
    {
      id: 'template-8',
      name: 'Event Recap',
      description: 'Share highlights and key takeaways from industry events or webinars',
      category: 'industry-insights',
      slideCount: 7,
      imageUrl: '/carousel-templates/event-recap.png',
      tags: ['event', 'recap', 'highlights'],
      isPremium: false
    }
  ];
  
  // Filter templates by search query and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'newest') {
      return (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1);
    } else if (sortBy === 'a-z') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'slide-count') {
      return b.slideCount - a.slideCount;
    } 
    // Default: 'popular'
    return (a.isPremium ? -1 : 1) - (b.isPremium ? -1 : 1);
  });
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    navigate(`/dashboard/request-carousel?template=${templateId}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">LinkedIn Carousel Templates</h1>
        <p className="text-black">
          Choose from our collection of professionally designed templates to create high-impact LinkedIn carousels
        </p>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search templates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="slide-count">Slide Count</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>
      
      {/* Category tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeCategory} 
        onValueChange={(value) => setActiveCategory(value as TemplateCategory)}
        className="mb-8"
      >
        <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start max-w-full">
          <TabsTrigger value="all" className="flex-shrink-0">All Templates</TabsTrigger>
          <TabsTrigger value="listicle" className="flex-shrink-0">List Posts</TabsTrigger>
          <TabsTrigger value="how-to" className="flex-shrink-0">How-To Guides</TabsTrigger>
          <TabsTrigger value="case-study" className="flex-shrink-0">Case Studies</TabsTrigger>
          <TabsTrigger value="industry-insights" className="flex-shrink-0">Industry Insights</TabsTrigger>
          <TabsTrigger value="educational" className="flex-shrink-0">Educational</TabsTrigger>
          <TabsTrigger value="promotional" className="flex-shrink-0">Promotional</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Templates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {sortedTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative overflow-hidden h-40 bg-slate-100">
              {/* Image placeholder - in a real app, use actual template images */}
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                <LayoutGrid className="h-10 w-10 text-blue-300" />
              </div>
              
              {/* Template badges */}
              <div className="absolute top-2 left-2 flex gap-2">
                {template.isPremium && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    <Star className="h-3 w-3 mr-1 text-amber-500" />
                    Premium
                  </Badge>
                )}
                {template.isNew && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                    <Clock className="h-3 w-3 mr-1 text-emerald-500" />
                    New
                  </Badge>
                )}
              </div>
              
              {/* Preview button */}
              <Button 
                size="sm" 
                variant="secondary" 
                className="absolute bottom-2 right-2 bg-white/70 hover:bg-white"
              >
                <EyeIcon className="h-3 w-3 mr-1" />
                Preview
              </Button>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2">{template.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pb-4 pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs px-1 py-0 h-5">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center text-xs text-black">
                <LayoutGrid className="h-3 w-3 mr-1" />
                {template.slideCount} slides
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 mt-auto">
              <Button 
                className="w-full gap-1" 
                onClick={() => handleTemplateSelect(template.id)}
              >
                Use Template
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Empty state if no templates match the filters */}
      {sortedTemplates.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-black mb-4">No templates match your current filters.</p>
          <Button onClick={() => {
            setSearchQuery('');
            setActiveCategory('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage; 