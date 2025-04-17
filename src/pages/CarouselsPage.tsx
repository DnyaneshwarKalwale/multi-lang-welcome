import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Download, Eye, Clock, Filter, PlusCircle,
  Check, AlertCircle, FileDown, Calendar, ChevronDown, 
  Search, SlidersHorizontal, Youtube, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';
import axios from 'axios';
import api from '@/services/api';

interface CarouselRequest {
  id: string;
  title: string;
  status: 'ready' | 'in_progress' | 'delivered';
  thumbnailUrl?: string;
  requestDate: Date;
  deliveryDate?: Date;
  slideCount: number;
  downloadUrl?: string;
  videoId?: string;
  videoUrl?: string;
  source?: 'youtube';
}

const CarouselsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [carouselRequests, setCarouselRequests] = useState<CarouselRequest[]>([]);

  // Safe date formatter function to use throughout the component
  const safeFormatDate = (date: any, formatString: string = 'MMM d, yyyy'): string => {
    try {
      if (!date) return 'Unknown date';
      
      // If it's already a Date object
      if (date instanceof Date) {
        return isNaN(date.getTime()) ? 'Unknown date' : format(date, formatString);
      }
      
      // Try parsing as string
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? 'Unknown date' : format(parsedDate, formatString);
      }
      
      // If it's a number (timestamp)
      if (typeof date === 'number' && !isNaN(date)) {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? 'Unknown date' : format(parsedDate, formatString);
      }
      
      return 'Unknown date';
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Unknown date';
    }
  };

  useEffect(() => {
    // Load saved videos from localStorage
    const loadSavedVideos = () => {
      setIsLoading(true);
      try {
        // Get videos from localStorage
        const savedVideosString = localStorage.getItem('savedYoutubeVideos');
        
        if (savedVideosString) {
          try {
            const savedVideos = JSON.parse(savedVideosString);
            
            // Convert to CarouselRequest format with extra safety
            const carousels = savedVideos.map((video: any) => {
              try {
                // Create a valid date object or fallback to current date
                const safeDate = (dateInput: any) => {
                  if (!dateInput) return new Date();
                  
                  try {
                    // If it's already a Date object
                    if (dateInput instanceof Date) {
                      return isNaN(dateInput.getTime()) ? new Date() : dateInput;
                    }
                    
                    // Try parsing as string
                    if (typeof dateInput === 'string') {
                      const parsedDate = new Date(dateInput);
                      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
                    }
                    
                    // If it's a number (timestamp)
                    if (typeof dateInput === 'number' && !isNaN(dateInput)) {
                      const parsedDate = new Date(dateInput);
                      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
                    }
                    
                    return new Date();
                  } catch (e) {
                    console.error("Error parsing date:", e);
                    return new Date();
                  }
                };
                
                // Get safe videoId
                const videoId = video.videoId || video.id || '';
                
                return {
                  id: video.id || videoId || Math.random().toString(36).substring(2, 9),
                  title: video.title || 'YouTube Video',
                  status: 'ready',
                  thumbnailUrl: video.thumbnailUrl || 
                    (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined),
                  requestDate: safeDate(video.requestDate),
                  deliveryDate: safeDate(video.deliveryDate),
                  slideCount: video.slideCount || 5,
                  videoId: videoId,
                  videoUrl: video.videoUrl || (videoId ? `https://youtube.com/watch?v=${videoId}` : undefined),
                  source: 'youtube'
                };
              } catch (itemError) {
                console.error("Error processing video item:", itemError);
                // Return a safe default item if individual parsing fails
                return {
                  id: Math.random().toString(36).substring(2, 9),
                  title: 'YouTube Video',
                  status: 'ready',
                  requestDate: new Date(),
                  deliveryDate: new Date(),
                  slideCount: 5,
                  source: 'youtube'
                };
              }
            });
            
            setCarouselRequests(carousels);
          } catch (parseError) {
            console.error('Error parsing saved videos:', parseError);
            setCarouselRequests([]);
          }
        } else {
          // No saved videos found, show empty state
          setCarouselRequests([]);
        }
      } catch (error) {
        console.error('Error loading saved videos:', error);
        toast.error('Failed to load your saved videos');
        setCarouselRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedVideos();
  }, []);

  const handleDownload = (carousel: CarouselRequest) => {
    if (carousel.downloadUrl) {
      window.open(carousel.downloadUrl, '_blank');
      toast.success('Carousel download started');
    }
  };

  const handleWatchVideo = (carousel: CarouselRequest) => {
    if (carousel.videoUrl) {
      window.open(carousel.videoUrl, '_blank');
      toast.success('Opening YouTube video');
    } else if (carousel.videoId) {
      window.open(`https://youtube.com/watch?v=${carousel.videoId}`, '_blank');
      toast.success('Opening YouTube video');
    }
  };

  const filteredCarousels = carouselRequests.filter(carousel => {
    const matchesSearch = carousel.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || carousel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCarousels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCarousels = filteredCarousels.slice(startIndex, endIndex);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Carousel Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your requested LinkedIn carousel designs
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/dashboard/request-carousel')}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Request New Carousel
        </Button>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search carousels..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select 
          value={statusFilter || 'all'} 
          onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="All statuses" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 ml-auto hidden sm:flex">
              <SlidersHorizontal className="h-4 w-4" />
              Sort by
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Newest first</DropdownMenuItem>
            <DropdownMenuItem>Oldest first</DropdownMenuItem>
            <DropdownMenuItem>Alphabetical (A-Z)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Carousels</p>
                <p className="text-2xl font-bold mt-1">{carouselRequests.length}</p>
              </div>
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ready to Use</p>
                <p className="text-2xl font-bold mt-1">
                  {carouselRequests.filter(c => c.status === 'ready' || c.status === 'delivered').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold mt-1">
                  {carouselRequests.filter(c => c.status === 'in_progress').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Carousels list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p>Loading your carousel videos...</p>
          </div>
        </div>
      ) : currentCarousels.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentCarousels.map(carousel => (
              <Card key={carousel.id} className="overflow-hidden">
                <div className="h-48 bg-gray-100 dark:bg-gray-800 relative">
                  {carousel.thumbnailUrl ? (
                    <img 
                      src={carousel.thumbnailUrl} 
                      alt={carousel.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LayoutGrid className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  
                  <Badge 
                    className={`absolute top-3 right-3 ${
                      carousel.status === 'delivered' || carousel.status === 'ready'
                        ? 'bg-green-500' 
                        : 'bg-blue-500'
                    }`}
                  >
                    {carousel.status === 'delivered' || carousel.status === 'ready' ? 'Ready' : 'In Progress'}
                  </Badge>
                  
                  {carousel.source === 'youtube' && (
                    <Badge className="absolute top-3 left-3 bg-red-500 flex items-center gap-1">
                      <Youtube className="h-3 w-3" />
                      YouTube
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1">{carousel.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Added: {safeFormatDate(carousel.requestDate)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <LayoutGrid className="h-4 w-4" />
                      <span>{carousel.slideCount} slides</span>
                    </div>
                    
                    {carousel.deliveryDate && (
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{safeFormatDate(carousel.deliveryDate)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div className="flex justify-between w-full">
                    {carousel.source === 'youtube' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleWatchVideo(carousel)}
                      >
                        <Youtube className="h-4 w-4" />
                        Watch Video
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    )}
                    
                    <Button 
                      variant="default" 
                      size="sm"
                      className="gap-1"
                      onClick={() => navigate('/dashboard/create-post', { 
                        state: { 
                          title: carousel.title,
                          activeTab: 'carousel',
                          youtubeVideoId: carousel.videoId
                        }
                      })}
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create Post
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="h-8 w-8 text-gray-400" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">No carousels found</h3>
          
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {searchQuery || statusFilter 
              ? "No carousels match your current filters. Try adjusting your search criteria."
              : "You don't have any carousels yet. Please visit the Request Carousel page to browse and select videos for your carousels."}
          </p>
          
          <Button
            onClick={() => navigate('/dashboard/request-carousel')}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Request New Carousel
          </Button>
        </div>
      )}
      
      <div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium mb-1">Carousel Credits</h3>
            <p>
              You have 2 carousel requests remaining this month. Your credits will reset on {safeFormatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1))}.
            </p>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => toast.info('This feature is coming soon!')}>
            <PlusCircle className="h-3 w-3 mr-1" />
            Get More Credits
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarouselsPage;