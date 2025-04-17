import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Download, Eye, Clock, Filter, PlusCircle,
  Check, AlertCircle, FileDown, Calendar, ChevronDown, 
  Search, SlidersHorizontal, Youtube, ChevronLeft, ChevronRight
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

interface CarouselRequest {
  id: string;
  title: string;
  status: 'in_progress' | 'delivered';
  thumbnailUrl?: string;
  requestDate: Date;
  deliveryDate?: Date;
  slideCount: number;
  downloadUrl?: string;
  videoId?: string;
  source?: 'youtube';
  videoUrl?: string;
  view_count?: number;
  duration?: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  view_count: number;
  upload_date: string;
}

const ITEMS_PER_PAGE = 4;

const CarouselsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [carouselRequests, setCarouselRequests] = useState<CarouselRequest[]>([]);

  useEffect(() => {
    // Load saved YouTube videos from localStorage
    const loadSavedVideos = () => {
      try {
        const savedVideosJson = localStorage.getItem('savedYoutubeVideos');
        if (savedVideosJson) {
          const savedVideos = JSON.parse(savedVideosJson) as YouTubeVideo[];
          
          // Convert to carousel request format
          const carousels = savedVideos.map(video => ({
            id: video.id,
            title: video.title,
            status: 'delivered' as const,
            thumbnailUrl: video.thumbnail,
            requestDate: new Date(video.upload_date || Date.now()),
            slideCount: 5,
            videoId: video.id,
            source: 'youtube' as const,
            videoUrl: video.url,
            view_count: video.view_count,
            duration: video.duration
          }));
          
          setCarouselRequests(carousels);
        }
      } catch (error) {
        console.error('Error loading saved videos:', error);
        toast.error('Failed to load your saved videos');
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
    if (carousel.videoId) {
      window.open(`https://youtube.com/watch?v=${carousel.videoId}`, '_blank');
    }
  };

  const filteredCarousels = carouselRequests.filter(carousel => {
    const matchesSearch = carousel.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || carousel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCarousels.length / ITEMS_PER_PAGE);
  const paginatedCarousels = filteredCarousels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">My YouTube Videos</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your saved YouTube videos for LinkedIn carousels
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/dashboard/scraper')}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Find More Videos
        </Button>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search videos..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
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
            <DropdownMenuItem>Views (High to Low)</DropdownMenuItem>
            <DropdownMenuItem>Alphabetical (A-Z)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Videos</p>
                <p className="text-2xl font-bold mt-1">{carouselRequests.length}</p>
              </div>
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <Youtube className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Page</p>
                <p className="text-2xl font-bold mt-1">
                  {currentPage} of {totalPages || 1}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Carousels list */}
      {paginatedCarousels.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {paginatedCarousels.map(carousel => (
              <Card key={carousel.id} className="overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-100 dark:bg-gray-800 relative">
                  {carousel.thumbnailUrl ? (
                    <img 
                      src={carousel.thumbnailUrl} 
                      alt={carousel.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Youtube className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  
                  {carousel.duration && (
                    <Badge className="absolute bottom-3 right-3 bg-black/70">
                      {carousel.duration}
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-2 flex-grow">
                  <CardTitle className="line-clamp-2 text-base">{carousel.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(carousel.requestDate), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Eye className="h-4 w-4" />
                      <span>{carousel.view_count?.toLocaleString() || '0'} views</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full gap-1"
                    onClick={() => handleWatchVideo(carousel)}
                  >
                    <Youtube className="h-4 w-4" />
                    Watch Video
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="text-sm font-medium mx-4">
                Page {currentPage} of {totalPages}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="p-8">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 rounded-full items-center justify-center bg-gray-100 dark:bg-gray-800 mb-4">
              <Youtube className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No videos found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              {searchQuery || statusFilter
                ? "No videos match your current filters. Try adjusting your search criteria."
                : "You haven't saved any YouTube videos yet. Use the scraper to find and save videos."}
            </p>
            <Button
              onClick={() => navigate('/dashboard/scraper')}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Find Videos to Save
            </Button>
          </div>
        </Card>
      )}
      
      {/* Help card */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-full">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">YouTube Video Library</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Save YouTube videos that you'd like to use for your LinkedIn content. Videos from channels will appear here for easy access.
              </p>
              <Button variant="link" size="sm" className="p-0 h-auto text-primary" onClick={() => navigate('/dashboard/scraper')}>
                Go to YouTube Scraper
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarouselsPage;