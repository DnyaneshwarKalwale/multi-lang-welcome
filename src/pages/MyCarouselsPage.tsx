import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, LayoutGrid, Sparkles, Calendar, 
  Edit3, Eye, Clock, PlusCircle, Download,
  Share2, MoreHorizontal, Trash2, Search,
  FileText
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Carousel status type
type CarouselStatus = 'draft' | 'scheduled' | 'published';

// User carousel interface
interface UserCarousel {
  id: string;
  title: string;
  description: string;
  slideCount: number;
  status: CarouselStatus;
  created: string;
  published?: string;
  views?: number;
  likes?: number;
  comments?: number;
  thumbnailUrl: string;
  slides: string[];
}

const MyCarouselsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCarousel, setSelectedCarousel] = useState<UserCarousel | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample user carousels
  const userCarousels: UserCarousel[] = [
    {
      id: 'carousel-1',
      title: '5 Ways to Boost Team Productivity',
      description: 'Essential strategies for improving team efficiency and collaboration',
      slideCount: 8,
      status: 'published',
      created: '2023-10-15',
      published: '2023-10-18',
      views: 1250,
      likes: 87,
      comments: 23,
      thumbnailUrl: '/carousel-samples/productivity-cover.png',
      slides: [
        '/carousel-samples/productivity-1.png',
        '/carousel-samples/productivity-2.png',
        '/carousel-samples/productivity-3.png',
      ]
    },
    {
      id: 'carousel-2',
      title: 'The Future of Remote Work',
      description: 'Trends and predictions for the evolving remote work landscape',
      slideCount: 6,
      status: 'scheduled',
      created: '2023-10-22',
      published: '2023-11-02',
      thumbnailUrl: '/carousel-samples/remote-work-cover.png',
      slides: [
        '/carousel-samples/remote-work-1.png',
        '/carousel-samples/remote-work-2.png',
        '/carousel-samples/remote-work-3.png',
      ]
    },
    {
      id: 'carousel-3',
      title: 'Top Marketing Strategies for 2024',
      description: 'Effective marketing approaches to implement in the coming year',
      slideCount: 10,
      status: 'draft',
      created: '2023-10-25',
      thumbnailUrl: '/carousel-samples/marketing-cover.png',
      slides: [
        '/carousel-samples/marketing-1.png',
        '/carousel-samples/marketing-2.png',
        '/carousel-samples/marketing-3.png',
      ]
    },
    {
      id: 'carousel-4',
      title: 'Data Visualization Best Practices',
      description: 'How to present data clearly and effectively in your presentations',
      slideCount: 7,
      status: 'published',
      created: '2023-09-18',
      published: '2023-09-20',
      views: 980,
      likes: 62,
      comments: 15,
      thumbnailUrl: '/carousel-samples/data-viz-cover.png',
      slides: [
        '/carousel-samples/data-viz-1.png',
        '/carousel-samples/data-viz-2.png',
        '/carousel-samples/data-viz-3.png',
      ]
    },
    {
      id: 'carousel-5',
      title: 'Building a Personal Brand on LinkedIn',
      description: 'Steps to create and grow your professional online presence',
      slideCount: 9,
      status: 'published',
      created: '2023-08-30',
      published: '2023-09-02',
      views: 1520,
      likes: 124,
      comments: 36,
      thumbnailUrl: '/carousel-samples/personal-brand-cover.png',
      slides: [
        '/carousel-samples/personal-brand-1.png',
        '/carousel-samples/personal-brand-2.png',
        '/carousel-samples/personal-brand-3.png',
      ]
    }
  ];
  
  // Filter carousels based on active tab and search query
  const filteredCarousels = userCarousels
    .filter(carousel => {
      if (activeTab === 'all') return true;
      return carousel.status === activeTab;
    })
    .filter(carousel => {
      if (!searchQuery.trim()) return true;
      return carousel.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             carousel.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  
  // Function to handle next slide in preview
  const nextSlide = () => {
    if (selectedCarousel) {
      setCurrentSlide((prev) => 
        prev === selectedCarousel.slides.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  // Function to handle previous slide in preview
  const prevSlide = () => {
    if (selectedCarousel) {
      setCurrentSlide((prev) => 
        prev === 0 ? selectedCarousel.slides.length - 1 : prev - 1
      );
    }
  };
  
  // Function to create new post with carousel
  const createPost = (carousel: UserCarousel) => {
    navigate(`/dashboard/post?carouselId=${carousel.id}&type=carousel`);
    toast.success(`Creating new post with "${carousel.title}" carousel`);
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Status Badge component
  const StatusBadge = ({ status }: { status: CarouselStatus }) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Draft</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Carousels</h1>
          <p className="text-black">
            Manage and create LinkedIn carousel posts
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
            onClick={() => navigate('/dashboard/templates')}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Browse Templates
          </Button>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search carousels..." 
            className="pl-10 border-2 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full grid grid-cols-4 sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* No results message */}
      {filteredCarousels.length === 0 && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-8 text-center mb-8">
          <FileText className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No carousels found</h3>
          <p className="text-black mb-6">
            {searchQuery 
              ? `No carousels match your search for "${searchQuery}"`
              : `You don't have any ${activeTab !== 'all' ? activeTab : ''} carousels yet`
            }
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              onClick={() => navigate('/dashboard/request-carousel')}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Request New Carousel
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard/templates')}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Browse Templates
            </Button>
          </div>
        </div>
      )}
      
      {/* Carousels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCarousels.map((carousel) => (
          <motion.div
            key={carousel.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full flex flex-col overflow-hidden border-2 hover:border-primary hover:shadow-md transition-all duration-200">
              <div 
                className="aspect-video bg-white border-b relative cursor-pointer"
                onClick={() => {
                  setSelectedCarousel(carousel);
                  setCurrentSlide(0);
                }}
              >
                {/* Carousel thumbnail / preview */}
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                  <div className="text-center p-4">
                    <h3 className="text-lg font-bold text-black mb-1">{carousel.title}</h3>
                    <p className="text-xs text-black">{carousel.slideCount} slides</p>
                  </div>
                </div>
                
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <StatusBadge status={carousel.status} />
                </div>
                
                {/* Action buttons */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-white text-black border border-blue-200 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCarousel(carousel);
                      setCurrentSlide(0);
                    }}
                  >
                    Preview
                  </Button>
                </div>
              </div>
              
              <CardContent className="py-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-black line-clamp-2 mb-1">
                      {carousel.description}
                    </p>
                    <div className="flex items-center text-xs text-black gap-3">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                        {formatDate(carousel.created)}
                      </span>
                      {carousel.status === 'published' && (
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1 text-green-500" />
                          {carousel.views} views
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 pb-4 flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => createPost(carousel)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-blue-200"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                      onClick={() => {
                        setSelectedCarousel(carousel);
                        setCurrentSlide(0);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                      onClick={() => navigate(`/dashboard/post?carouselId=${carousel.id}&type=carousel`)}
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Create Post</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                      onClick={() => toast.success("Carousel shared to clipboard")}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                      onClick={() => toast.success("Carousel downloaded")}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-red-500 focus:text-red-500"
                      onClick={() => toast.success(`Carousel "${carousel.title}" deleted`)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Carousel Preview Dialog */}
      <Dialog open={!!selectedCarousel} onOpenChange={(open) => !open && setSelectedCarousel(null)}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedCarousel?.title}</span>
              <div>
                <StatusBadge status={selectedCarousel?.status || 'draft'} />
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedCarousel?.description}
            </DialogDescription>
          </DialogHeader>
          
          {/* Carousel Preview */}
          <div className="relative overflow-hidden border-2 border-black rounded-xl my-4">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
              {/* Preview slide content - in a real app, use actual images */}
              <div className="text-center p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-black">{selectedCarousel?.title}</h2>
                <p className="text-black mb-3">
                  {`Slide ${currentSlide + 1} of ${selectedCarousel?.slideCount || 0}`}
                </p>
                <div className="flex justify-center gap-2 mb-3">
                  {selectedCarousel && Array.from({ length: selectedCarousel.slideCount }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full ${i === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-black">
                  {selectedCarousel?.status === 'published' 
                    ? 'This carousel has been published to LinkedIn' 
                    : selectedCarousel?.status === 'scheduled'
                    ? 'This carousel is scheduled for publishing'
                    : 'This carousel is in draft mode'}
                </p>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
              onClick={prevSlide}
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Carousel details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-white border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-sm">Created</h3>
              </div>
              <p className="text-sm text-black font-medium">
                {selectedCarousel && formatDate(selectedCarousel.created)}
              </p>
            </div>
            
            {selectedCarousel?.published && (
              <div className="bg-white border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-green-500" />
                  <h3 className="font-medium text-sm">Published</h3>
                </div>
                <p className="text-sm text-black font-medium">
                  {formatDate(selectedCarousel.published)}
                </p>
              </div>
            )}
            
            <div className="bg-white border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <LayoutGrid className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-sm">Slides</h3>
              </div>
              <p className="text-sm text-black font-medium">
                {selectedCarousel?.slideCount} slides
              </p>
            </div>
            
            {selectedCarousel?.views && (
              <div className="bg-white border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <h3 className="font-medium text-sm">Views</h3>
                </div>
                <p className="text-sm text-black font-medium">
                  {selectedCarousel.views.toLocaleString()}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            <div className="hidden sm:flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1"
                onClick={() => {
                  toast.success("Carousel shared to clipboard");
                }}
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1"
                onClick={() => {
                  toast.success("Carousel downloaded");
                }}
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                className="flex-1 sm:flex-auto"
                onClick={() => {
                  if (selectedCarousel) {
                    createPost(selectedCarousel);
                  }
                }}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCarouselsPage; 