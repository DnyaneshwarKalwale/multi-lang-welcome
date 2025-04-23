import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronRight, LayoutGrid, Sparkles, Calendar, 
  Edit3, Eye, Clock, PlusCircle, Download,
  Share2, MoreHorizontal, Trash2, Search,
  FileText, ChevronLeft, ChevronDown, AlertCircle
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
import { CarouselPreview } from '@/components/CarouselPreview';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Carousel status type
type CarouselStatus = 'draft' | 'scheduled' | 'published';

// User carousel interface
interface UserCarousel {
  _id: string;
  title: string;
  description: string;
  slideCount: number;
  status: CarouselStatus;
  createdAt: string;
  publishDate?: string;
  views?: number;
  likes?: number;
  comments?: number;
  thumbnailUrl: string;
  slides: {
    content: string;
    imageUrl: string;
    order: number;
  }[];
}

const MyCarouselsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [carousels, setCarousels] = useState<UserCarousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCarousel, setSelectedCarousel] = useState<UserCarousel | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch user's carousels from backend
  const fetchCarousels = useCallback(async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/carousels`, config);
      setCarousels(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching carousels:', err);
      setError('Failed to fetch carousels. Please try again later.');
      toast.error('Failed to fetch carousels');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCarousels();
    }
  }, [token, fetchCarousels]);
  
  // When user arrives from the editor
  useEffect(() => {
    // Handle navigation from editor with state
    if (location.state?.fromEditor) {
      // Display success message
      toast.success("Carousel saved successfully!");
      
      // Fetch the latest carousels data
      if (token) {
        fetchCarousels().then(() => {
          // After fetching, if there's a specific carouselId, select it
          if (location.state?.carouselId) {
            // Use the fresh carousels data
            const targetCarousel = carousels.find(c => c._id === location.state.carouselId);
            if (targetCarousel) {
              setSelectedCarousel(targetCarousel);
            }
          }
        });
      }
      
      // Clear the state to prevent multiple refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, token, fetchCarousels, carousels]);
  
  // Filter carousels based on active tab and search query
  const filteredCarousels = carousels
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
    navigate(`/dashboard/post?carouselId=${carousel._id}&type=carousel`);
    toast.success(`Creating new post with "${carousel.title}" carousel`);
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Function to download carousel as PDF
  const downloadCarouselPdf = async (carouselId: string, title: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob' as 'blob',
      };
      
      toast.info('Preparing PDF for download...');
      
      const response = await axios.get(
        `${API_URL}/carousels/${carouselId}/download`, 
        config
      );
      
      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
      
      // Append to the body
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  // Function to delete a carousel
  const deleteCarouselHandler = async (carouselId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(`${API_URL}/carousels/${carouselId}`, config);
      
      // Update state to remove the deleted carousel
      setCarousels(prevCarousels => 
        prevCarousels.filter(carousel => carousel._id !== carouselId)
      );
      
      // Close preview dialog if the deleted carousel was selected
      if (selectedCarousel && selectedCarousel._id === carouselId) {
        setSelectedCarousel(null);
      }
      
      toast.success('Carousel deleted successfully');
    } catch (error) {
      console.error('Error deleting carousel:', error);
      toast.error('Failed to delete carousel');
    }
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
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center mb-8">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2 text-red-600">Something went wrong</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      )}
      
      {/* No results message */}
      {!loading && !error && filteredCarousels.length === 0 && (
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
      {!loading && !error && filteredCarousels.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCarousels.map((carousel) => (
          <motion.div
              key={carousel._id}
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
                    {carousel.thumbnailUrl ? (
                      <img 
                        src={carousel.thumbnailUrl} 
                        alt={carousel.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                  <div className="text-center p-4">
                    <h3 className="text-lg font-bold text-black mb-1">{carousel.title}</h3>
                    <p className="text-xs text-black">{carousel.slideCount} slides</p>
                  </div>
                    )}
                </div>
                
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <StatusBadge status={carousel.status} />
                </div>
                
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    className="p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCarousel(carousel);
                      setCurrentSlide(0);
                    }}
                  >
                    <Eye size={14} />
                  </button>
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
                          {formatDate(carousel.createdAt)}
                      </span>
                        {carousel.status === 'published' && carousel.views && (
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
                        onClick={() => navigate(`/dashboard/post?carouselId=${carousel._id}&type=carousel`)}
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Create Post</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/carousel/${carousel._id}`);
                          toast.success("Carousel link copied to clipboard");
                        }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                        onClick={() => downloadCarouselPdf(carousel._id, carousel.title)}
                    >
                      <Download className="h-4 w-4" />
                        <span>Download PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-red-500 focus:text-red-500"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${carousel.title}"?`)) {
                            deleteCarouselHandler(carousel._id);
                          }
                        }}
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
      )}
      
      {/* Carousel Preview Dialog */}
      <Dialog open={!!selectedCarousel} onOpenChange={(open) => !open && setSelectedCarousel(null)}>
        <DialogContent className="max-w-2xl w-[90vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-base">
              <span>{selectedCarousel?.title}</span>
              <div>
                <StatusBadge status={selectedCarousel?.status || 'draft'} />
              </div>
            </DialogTitle>
            <DialogDescription className="text-sm">
              {selectedCarousel?.description}
            </DialogDescription>
          </DialogHeader>
          
          {/* LinkedIn Carousel Preview (smaller format) */}
          <div className="relative my-3">
            {selectedCarousel && (
              <CarouselPreview 
                slides={selectedCarousel.slides.map((slide, index) => ({
                  id: `slide-${index}`,
                  content: slide.content || '',
                  imageUrl: slide.imageUrl
                }))}
                variant="basic"
              />
            )}
          </div>
          
          {/* Carousel details - smaller and more compact */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="bg-white border rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3 text-blue-500" />
                <h3 className="font-medium text-xs">Created</h3>
              </div>
              <p className="text-xs text-black font-medium">
                {selectedCarousel && formatDate(selectedCarousel.createdAt)}
              </p>
            </div>
            
            {selectedCarousel?.publishDate && (
              <div className="bg-white border rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Eye className="h-3 w-3 text-green-500" />
                  <h3 className="font-medium text-xs">Published</h3>
                </div>
                <p className="text-xs text-black font-medium">
                  {formatDate(selectedCarousel.publishDate)}
                </p>
        </div>
      )}
      
            <div className="bg-white border rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <LayoutGrid className="h-3 w-3 text-blue-500" />
                <h3 className="font-medium text-xs">Slides</h3>
              </div>
              <p className="text-xs text-black font-medium">
                {selectedCarousel?.slideCount} slides
              </p>
            </div>
            
            {selectedCarousel?.views && (
              <div className="bg-white border rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Eye className="h-3 w-3 text-blue-500" />
                  <h3 className="font-medium text-xs">Views</h3>
        </div>
                <p className="text-xs text-black font-medium">
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
                className="gap-1 text-xs h-7"
                onClick={() => {
                  if (selectedCarousel) {
                    navigator.clipboard.writeText(`${window.location.origin}/carousel/${selectedCarousel._id}`);
                    toast.success("Carousel link copied to clipboard");
                  }
                }}
              >
                <Share2 className="h-3 w-3" />
                Share
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1 text-xs h-7"
                onClick={() => {
                  if (selectedCarousel) {
                    downloadCarouselPdf(selectedCarousel._id, selectedCarousel.title);
                  }
                }}
              >
                <Download className="h-3 w-3" />
                Download PDF
          </Button>
        </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                className="flex-1 sm:flex-auto text-xs h-7"
                onClick={() => {
                  if (selectedCarousel) {
                    createPost(selectedCarousel);
                  }
                }}
              >
                <Edit3 className="h-3 w-3 mr-1" />
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