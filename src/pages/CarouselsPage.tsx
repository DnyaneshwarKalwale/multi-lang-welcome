import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Download, Eye, Clock, Filter, PlusCircle,
  Check, AlertCircle, FileDown, Calendar, ChevronDown, 
  Search, SlidersHorizontal, Loader
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

// Carousel interface
interface Carousel {
  _id: string;
  videoId: string;
  title: string;
  status: 'in_progress' | 'delivered';
  thumbnailUrl?: string;
  requestDate: string;
  deliveryDate?: string;
  slideCount: number;
  downloadUrl?: string;
  transcript: string;
  generatedContent?: string;
  preferences: {
    format: string;
    tone: string;
  };
  createdAt: string;
  updatedAt: string;
}

const CarouselsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch carousels from the API
  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        setIsLoading(true);
        const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/youtube/carousels`;
        
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data && response.data.success) {
          setCarousels(response.data.data);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch carousels');
        }
      } catch (error) {
        console.error('Error fetching carousels:', error);
        toast.error('Failed to load your carousels. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCarousels();
  }, []);

  // Download handler
  const handleDownload = (carousel: Carousel) => {
    if (carousel.downloadUrl) {
      // In a real app, trigger actual download
      window.open(carousel.downloadUrl, '_blank');
      toast.success('Carousel download started');
    } else {
      toast.error('Download link not available yet');
    }
  };

  // Preview handler
  const handlePreview = (carousel: Carousel) => {
    // Navigate to a preview page with the carousel data
    navigate(`/dashboard/carousels/${carousel._id}`);
  };

  // Filter carousels based on search query and status filter
  const filteredCarousels = carousels.filter(carousel => {
    const matchesSearch = carousel.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || carousel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-500 dark:text-gray-400">Loading your carousels...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold mt-1">{carousels.length}</p>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Delivered</p>
                <p className="text-2xl font-bold mt-1">
                  {carousels.filter(c => c.status === 'delivered').length}
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
                  {carousels.filter(c => c.status === 'in_progress').length}
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
      {filteredCarousels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCarousels.map(carousel => (
            <Card key={carousel._id} className="overflow-hidden">
              <div className="h-48 bg-gray-100 dark:bg-gray-800 relative">
                {carousel.thumbnailUrl ? (
                  <img 
                    src={carousel.thumbnailUrl} 
                    alt={carousel.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <LayoutGrid className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                      <div className="mt-2 px-2">
                        <p className="text-xs text-center text-gray-500">
                          YouTube: {carousel.videoId}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Badge 
                  className={`absolute top-3 right-3 ${
                    carousel.status === 'delivered' 
                      ? 'bg-green-500' 
                      : 'bg-blue-500'
                  }`}
                >
                  {carousel.status === 'delivered' ? 'Delivered' : 'In Progress'}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{carousel.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Requested: {format(new Date(carousel.createdAt), 'MMM d, yyyy')}
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
                      <span>{format(new Date(carousel.deliveryDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
                {carousel.status === 'delivered' ? (
                  <div className="flex justify-between w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handlePreview(carousel)}
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    
                    <Button 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleDownload(carousel)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="w-full text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Expected delivery by {format(new Date(new Date(carousel.createdAt).getTime() + 24 * 60 * 60 * 1000), 'MMM d, h:mm a')}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No carousels found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter 
              ? "No carousels match your current filters. Try adjusting your search criteria."
              : "You haven't requested any carousels yet. Create your first carousel request to get started."}
          </p>
          <Button 
            onClick={() => navigate('/dashboard/scraper')}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Carousel from YouTube
          </Button>
        </div>
      )}
      
      {/* Subscription info */}
      <div className="mt-10 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-lg p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800/50 flex items-center justify-center flex-shrink-0">
          <FileDown className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Carousel Credits</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            You have unlimited carousel requests during the beta period. Enjoy creating content!
          </p>
          <Button variant="link" className="h-auto p-0 text-primary" onClick={() => navigate('/dashboard/billing')}>
            View Plan Details →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarouselsPage; 