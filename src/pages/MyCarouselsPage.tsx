import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronRight, LayoutGrid, Sparkles, Calendar, 
  Edit3, Eye, Clock, PlusCircle, Download,
  Share2, MoreHorizontal, Trash2, Search,
  FileText, ChevronLeft, ChevronDown, AlertCircle,
  Inbox, CheckCircle, FileImage, File, FileUp
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CarouselPreview } from '@/components/CarouselPreview';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Server base URL for static files (remove /api from API_URL)
const SERVER_BASE_URL = API_URL.endsWith('/api') 
  ? API_URL.substring(0, API_URL.length - 4) 
  : API_URL;

// Carousel status type definition
type CarouselStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

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

// Add interface for carousel requests
interface CarouselRequest {
  _id: string;
  id: string;
  title: string;
  description?: string;
  videoId?: string;
  videoTitle?: string;
  youtubeUrl?: string;
  content?: string;
  carouselType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  resendCount?: number;
  isModified?: boolean;
  originalContent?: {
    title?: string;
    description?: string;
    carouselType?: string;
    content?: string;
    videoId?: string;
    videoTitle?: string;
    youtubeUrl?: string;
    files?: {
      url: string;
      filename?: string;
      originalName?: string;
      mimetype?: string;
      size?: number;
    }[];
  };
  files: {
    url: string;
    filename?: string;
    originalName?: string;
    mimetype?: string;
    size?: number;
  }[];
  completedFiles?: {
    url: string;
    filename?: string;
    originalName?: string;
    mimetype?: string;
    size?: number;
  }[];
}

const MyCarouselsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [carousels, setCarousels] = useState<UserCarousel[]>([]);
  const [carouselRequests, setCarouselRequests] = useState<CarouselRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCarousel, setSelectedCarousel] = useState<UserCarousel | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CarouselRequest | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedRequest, setEditedRequest] = useState<{
    title?: string;
    description?: string;
    carouselType?: string;
    content?: string;
    videoId?: string;
    videoTitle?: string;
    youtubeUrl?: string;
    filesToDelete?: string[];
    newFiles?: File[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{url: string; type: string; name: string} | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  
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

  // Fetch user's carousel requests from backend
  const fetchCarouselRequests = useCallback(async () => {
    if (!token) return;
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/carousels/user/requests`, config);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setCarouselRequests(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setCarouselRequests(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setCarouselRequests([]);
      }
    } catch (err) {
      console.error('Error fetching carousel requests:', err);
      toast.error('Failed to fetch carousel requests');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      // Fetch both carousels and requests
      fetchCarousels();
      fetchCarouselRequests();
    }
  }, [token, fetchCarousels, fetchCarouselRequests]);
  
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
  
  // Function to force download a file
  const forceDownload = async (url: string | undefined, filename: string) => {
    if (!url) {
      toast.error('Invalid file URL');
      return;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
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
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  // Function to download all files from a completed request
  const downloadCompletedFiles = async (request: CarouselRequest) => {
    const completedFiles = request.completedFiles || [];
    
    if (completedFiles.length === 0) {
      toast.error('No completed files available to download');
      return;
    }
    
    toast.info(`Preparing ${completedFiles.length} files for download...`);
    
    // For a single file
    if (completedFiles.length === 1) {
      const file = completedFiles[0];
      if (!file || !file.url) {
        toast.error('Invalid file');
        return;
      }
      await forceDownload(
        getProperFileUrl(file.url),
        file.originalName || getFileNameFromUrl(file.url)
      );
      return;
    }
    
    // For multiple files
    let downloadCount = 0;
    
    const downloadNext = async (index: number) => {
      if (index >= completedFiles.length) {
        toast.success(`All ${completedFiles.length} files downloaded successfully`);
        return;
      }
      
      const file = completedFiles[index];
      if (!file || !file.url) {
        console.error(`Invalid file at index ${index}`);
        setTimeout(() => downloadNext(index + 1), 500);
        return;
      }

      await forceDownload(
        getProperFileUrl(file.url),
        file.originalName || getFileNameFromUrl(file.url)
      );
      
      downloadCount++;
      toast.info(`Downloading file ${downloadCount} of ${completedFiles.length}`);
      
      // Add small delay between downloads
      setTimeout(() => downloadNext(index + 1), 1500);
    };
    
    await downloadNext(0);
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
    // Return the Badge component directly without nesting inside a paragraph
    switch (status) {
      case 'completed':
        return <Badge className="bg-white text-green-600 border border-green-300 hover:bg-green-50">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-white text-yellow-600 border border-yellow-300 hover:bg-yellow-50">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-white text-blue-600 border border-blue-300 hover:bg-blue-50">In Progress</Badge>;
      case 'rejected':
        return <Badge className="bg-white text-red-600 border border-red-300 hover:bg-red-50">Rejected</Badge>;
      default:
        return <Badge className="bg-white text-gray-600 border border-gray-300">Unknown</Badge>;
    }
  };

  // Helper to determine if a file is an image
  const isImageFile = (url: string | undefined) => {
    if (!url) return false;
    
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || 
           url.includes('/image/upload/') ||
           url.includes('cloudinary') && url.includes('/image/');
  };

  // Helper to get file name from URL
  const getFileNameFromUrl = (url: string | undefined) => {
    if (!url) return 'file';
    
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const nameWithoutParams = lastPart.split('?')[0];
    
    // If it's a Cloudinary URL, clean up the ID
    if (url.includes('cloudinary') || url.includes('res.cloudinary.com')) {
      const cloudinaryParts = nameWithoutParams.split('.');
      if (cloudinaryParts.length > 1) {
        return cloudinaryParts[0].substring(0, 15) + '.' + cloudinaryParts[cloudinaryParts.length - 1];
      }
    }
    
    return nameWithoutParams || 'file';
  };

  // Helper function to get the proper URL for a file
  const getProperFileUrl = (url: string | undefined) => {
    if (!url) return '';
    
    // If URL is already absolute, return it
    if (url.startsWith('http')) {
      return url;
    }
    
    // The base URL for API endpoints
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // For uploads, we need to access them at the server root level, not through /api
    const uploadsBaseUrl = baseUrl.endsWith('/api') 
      ? baseUrl.substring(0, baseUrl.length - 4) 
      : baseUrl;
    
    // For files stored on the server with relative paths
    if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
      // Make sure we don't have double slashes in the URL
      if (url.startsWith('/')) {
        return `${uploadsBaseUrl}${url}`;
      } else {
        return `${uploadsBaseUrl}/${url}`;
      }
    }
    
    // For files stored in the uploads directory with files- prefix
    if (url.includes('files-')) {
      // Ensure we're using the proper path format
      const fileName = url.split('/').pop();
      return `${uploadsBaseUrl}/uploads/${fileName}`;
    }
    
    // For other relative URLs (API endpoints) - keep the /api suffix
    return `${baseUrl}/${url.startsWith('/') ? url.substring(1) : url}`;
  };

  // Filter requests based on the active tab
  const filteredRequests = carouselRequests.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  }).filter(request => {
    if (!searchQuery.trim()) return true;
    return request.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (request.description || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Add function to open edit mode for resending a request
  const openEditMode = (request: CarouselRequest, startEditing: boolean = false) => {
    setSelectedRequest(request);
    setEditedRequest({
      title: request.title,
      description: request.description,
      carouselType: request.carouselType,
      content: request.content,
      videoId: request.videoId,
      videoTitle: request.videoTitle,
      youtubeUrl: request.youtubeUrl,
      filesToDelete: []
    });
    setIsEditing(startEditing);
  }

  // Enhanced resendRejectedRequest function with better error handling and loading state
  const resendRejectedRequest = async (requestId: string, editedData?: any) => {
    try {
      // Prevent multiple submissions
      if (isSubmitting) return;
      setIsSubmitting(true);

      // Find the request in our local state
      const request = carouselRequests.find(r => (r._id === requestId || r.id === requestId));
      
      // Check if the request has already been resent - frontend validation
      if (request && request.resendCount && request.resendCount >= 1) {
        toast.error('This request has already been resent once and cannot be resent again');
        setIsSubmitting(false);
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      
      // Create a FormData object to handle files
      const formData = new FormData();
      
      // Add edited data to form data
      if (editedData) {
        if (editedData.title) formData.append('title', editedData.title);
        if (editedData.description) formData.append('description', editedData.description);
        if (editedData.carouselType) formData.append('carouselType', editedData.carouselType);
        if (editedData.content) formData.append('content', editedData.content);
        if (editedData.videoId) formData.append('videoId', editedData.videoId);
        if (editedData.videoTitle) formData.append('videoTitle', editedData.videoTitle);
        if (editedData.youtubeUrl) formData.append('youtubeUrl', editedData.youtubeUrl);
        
        // Add files to delete as a stringified JSON array
        if (editedData.filesToDelete && editedData.filesToDelete.length > 0) {
          formData.append('filesToDelete', JSON.stringify(editedData.filesToDelete));
        }
        
        // Add new files - handle as a regular form upload
        if (editedData.newFiles && editedData.newFiles.length > 0) {
          // Cast to explicitly typed array of Files
          const fileArray: File[] = editedData.newFiles as File[];
          fileArray.forEach(file => {
            // Ensure it's a valid File object
            if (file instanceof File) {
              formData.append('files', file);
            }
          });
        }
      } else {
        // Simple resend without changes
        formData.append('resend', 'true');
      }
      
      // Add resendCount to the request payload
      const resendResponse = await axios.post(
        `${API_URL}/carousels/requests/${requestId}/resend`, 
        formData,
        config
      );
      
      if (resendResponse.data && resendResponse.data.success) {
        toast.success('Request resubmitted successfully');
        
        // Close edit mode if active
        setIsEditing(false);
        
        // Update the local state to reflect the changes
        setCarouselRequests(prevRequests => 
          prevRequests.map(req => 
            (req._id === requestId || req.id === requestId) 
              ? { 
                  ...req, 
                  status: 'pending', 
                  resendCount: 1, // Explicitly set to 1 to match the backend behavior
                  updatedAt: new Date().toISOString(),
                  // Only update the fields that were included in editedData
                  ...(editedData?.title ? { title: editedData.title } : {}),
                  ...(editedData?.description ? { description: editedData.description } : {}),
                  ...(editedData?.carouselType ? { carouselType: editedData.carouselType } : {}),
                  ...(editedData?.content ? { content: editedData.content } : {}),
                  ...(editedData?.videoId ? { videoId: editedData.videoId } : {}),
                  ...(editedData?.videoTitle ? { videoTitle: editedData.videoTitle } : {}),
                  ...(editedData?.youtubeUrl ? { youtubeUrl: editedData.youtubeUrl } : {})
                } 
              : req
          )
        );
        
        // Refresh data after resubmission
        fetchCarouselRequests();
        
        // Close the dialog
        setSelectedRequest(null);
      } else {
        toast.error(resendResponse.data?.message || 'Failed to resubmit request');
      }
    } catch (err) {
      console.error('Error resubmitting request:', err);
      
      // Handle the specific error for already resent requests
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to resubmit request. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to delete a carousel request
  const deleteCarouselRequest = async (requestId: string) => {
    if (!token) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Confirm with the user before deleting
      if (!window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
        return;
      }
      
      // Delete the request from the backend
      await axios.delete(`${API_URL}/carousels/requests/${requestId}`, config);
      
      // Update the state to remove the deleted request
      setCarouselRequests(carouselRequests.filter(request => request.id !== requestId && request._id !== requestId));
      
      // Close any open dialogs that might be showing the deleted request
      setSelectedRequest(null);
      
      toast.success('Carousel request deleted successfully');
    } catch (err: any) {
      console.error('Error deleting carousel request:', err);
      toast.error(err.response?.data?.message || 'Failed to delete carousel request');
    }
  };

  // Function to view file in preview dialog
  const viewFile = (file: { url?: string; originalName?: string } | null) => {
    if (!file || !file.url) {
      toast.error('Invalid file');
      return;
    }

    const fileUrl = getProperFileUrl(file.url);
    const fileName = file.originalName || getFileNameFromUrl(file.url);
    const fileType = isImageFile(file.url) ? 'image' : 'document';
    setSelectedFile({ url: fileUrl, type: fileType, name: fileName });
    setShowFilePreview(true);
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
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
      {!loading && !error && filteredCarousels.length === 0 && filteredRequests.length === 0 && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-8 text-center mb-8">
          <FileText className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No carousels found</h3>
          <p className="text-black mb-6">
            {searchQuery 
              ? `No carousels match your search for "${searchQuery}"`
              : activeTab === 'pending' 
                ? "You don't have any pending carousel requests"
                : activeTab === 'rejected'
                ? "You don't have any rejected carousel requests"
                : activeTab === 'completed'
                ? "You don't have any completed carousels yet"
                : "You don't have any carousels yet"
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
                        {carousel.status === 'completed' && carousel.views && (
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
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
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
      
      {/* Pending Carousel Requests Section */}
      {!loading && filteredRequests.filter(r => r.status === 'pending' || r.status === 'in_progress').length > 0 && (
        <div className="mt-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">Pending Carousel Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests
              .filter(request => request.status === 'pending' || request.status === 'in_progress')
              .map((request) => (
                <Card 
                  key={request._id || request.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <StatusBadge status={request.status} />
                    </div>
                    <CardDescription className="line-clamp-2">
                      {request.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    {/* Show preview of files the user uploaded */}
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Your Uploaded Files:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(request.files || []).slice(0, 4).map((file, index) => (
                          <div 
                            key={index}
                            className="border rounded p-2 flex items-center"
                          >
                            {isImageFile(file.url) ? (
                              <FileImage className="h-4 w-4 mr-2 text-blue-500" />
                            ) : (
                              <FileText className="h-4 w-4 mr-2 text-orange-500" />
                            )}
                            <span className="text-xs truncate">
                              {file.originalName || getFileNameFromUrl(file.url)}
                            </span>
                          </div>
                        ))}
                        
                        {(request.files || []).length > 4 && (
                          <div className="border rounded p-2 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              +{(request.files || []).length - 4} more
                            </span>
                          </div>
                        )}
                        
                        {(request.files || []).length === 0 && (
                          <div className="col-span-2 border rounded p-2 text-center">
                            <span className="text-xs text-gray-500">No files available</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Show request type */}
                    {request.carouselType && (
                      <div className="mt-4">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          {request.carouselType} carousel
                        </span>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {request.resendCount && request.resendCount >= 1 ? formatDate(request.updatedAt) : formatDate(request.createdAt)}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2 justify-end">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => openEditMode(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteCarouselRequest(request.id || request._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      )}
      
      {/* Completed Carousel Requests Section */}
      {!loading && filteredRequests.filter(r => r.status === 'completed').length > 0 && (
        <div className="mt-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">Completed Carousels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests
              .filter(request => request.status === 'completed')
              .map((request) => (
                <Card 
                  key={request._id || request.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <StatusBadge status={request.status} />
                    </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      {/* Only show files delivered by admin */}
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-2">Delivered Files:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {(request.completedFiles || []).map((file, index) => (
                            <div 
                              key={index}
                              className="border rounded p-3 flex flex-col h-[120px]"
                            >
                              <div className="flex items-center mb-2">
                                {file && file.url && isImageFile(file.url) ? (
                                  <FileImage className="h-4 w-4 mr-2 text-blue-500" />
                                ) : (
                                  <FileText className="h-4 w-4 mr-2 text-orange-500" />
                                )}
                                <span className="text-sm truncate font-medium">
                                  {file?.originalName || getFileNameFromUrl(file?.url)}
                                </span>
                              </div>
                              
                              {/* Show image preview for image files */}
                              {file && file.url && isImageFile(file.url) && (
                                <div className="flex-1 bg-gray-100 rounded p-1 flex items-center justify-center overflow-hidden">
                                  <img 
                                    src={getProperFileUrl(file.url)} 
                                    alt={file.originalName || "Preview"} 
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                              )}
                              
                              {/* Show document icon for non-image files */}
                              {file && file.url && !isImageFile(file.url) && (
                                <div className="flex-1 flex items-center justify-center">
                                  <FileText className="h-12 w-12 text-gray-300" />
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {(request.completedFiles || []).length > 4 && (
                            <div className="border rounded p-2 flex items-center justify-center bg-green-50 border-green-100 h-[120px]">
                              <span className="text-xs text-green-700">
                              +{(request.completedFiles || []).length - 4} more
                            </span>
                          </div>
                        )}
                        
                        {(request.completedFiles || []).length === 0 && (
                            <div className="col-span-2 border rounded p-2 text-center h-[120px] flex items-center justify-center">
                              <span className="text-xs text-gray-500">No delivered files available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <div className="w-full flex items-center justify-between">
                      <div className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(request.updatedAt)}
                      </div>
                      
                        <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => openEditMode(request)}
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-green-600 hover:text-green-800 hover:bg-green-50"
                          onClick={() => downloadCompletedFiles(request)}
                            title="Download All"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </div>
      )}
      
      {/* Rejected Carousel Requests Section */}
      {!loading && filteredRequests.filter(r => r.status === 'rejected').length > 0 && (
        <div className="mt-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">Rejected Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests
              .filter(request => request.status === 'rejected')
              .map((request) => (
                <Card 
                  key={request._id || request.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow border-2 border-red-100"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {request.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    {/* Show preview of files the user uploaded */}
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Your Uploaded Files:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(request.files || []).slice(0, 4).map((file, index) => (
                          <div 
                            key={index}
                            className="border rounded p-2 flex items-center"
                          >
                            {isImageFile(file.url) ? (
                              <FileImage className="h-4 w-4 mr-2 text-blue-500" />
                            ) : (
                              <FileText className="h-4 w-4 mr-2 text-orange-500" />
                            )}
                            <span className="text-xs truncate">
                              {file.originalName || getFileNameFromUrl(file.url)}
                            </span>
                          </div>
                        ))}
                        
                        {(request.files || []).length > 4 && (
                          <div className="border rounded p-2 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              +{(request.files || []).length - 4} more
                            </span>
                          </div>
                        )}
                        
                        {(request.files || []).length === 0 && (
                          <div className="col-span-2 border rounded p-2 text-center">
                            <span className="text-xs text-gray-500">No files available</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Admin notes if available */}
                    {request.adminNotes && (
                      <div className="mt-4 text-sm bg-red-50 p-2 rounded">
                        <p className="font-medium text-red-700">Reason for rejection:</p>
                        <p className="text-gray-700">{request.adminNotes}</p>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(request.updatedAt)}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => openEditMode(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteCarouselRequest(request.id || request._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {request.status === 'rejected' && (
                      <Button 
                        size="sm"
                          variant="outline"
                          className={`${request.resendCount && request.resendCount >= 1 ? 
                            'text-gray-500 border-gray-300 cursor-not-allowed' : 
                            'text-orange-600 border-orange-300 hover:bg-orange-50 hover:text-orange-700'}`}
                          onClick={() => {
                            if (request.resendCount && request.resendCount >= 1) {
                              toast.error('This request has already been resent once and cannot be edited or resent again');
                              return;
                            }
                            setSelectedRequest(request);
                            setIsEditing(true);
                          }}
                          disabled={request.resendCount && request.resendCount >= 1}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                      </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      )}
      
      {/* Carousel Preview Dialog */}
      <Dialog open={!!selectedCarousel} onOpenChange={(open) => !open && setSelectedCarousel(null)}>
        <DialogContent className="max-w-2xl w-[90vw]" aria-labelledby="carousel-dialog-title" aria-describedby="carousel-dialog-description">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-base" id="carousel-dialog-title">
              <span>{selectedCarousel?.title}</span>
              <div>
                <StatusBadge status={selectedCarousel?.status || 'pending'} />
              </div>
            </DialogTitle>
            <DialogDescription className="text-sm" id="carousel-dialog-description">
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
      
      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => {
        if (!open) {
          setSelectedRequest(null);
          setIsEditing(false);
          setEditedRequest({});
          setSelectedFile(null);
          setShowFilePreview(false);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  {isEditing ? (
                    <Input 
                      value={editedRequest.title || selectedRequest.title} 
                      onChange={(e) => setEditedRequest({...editedRequest, title: e.target.value})}
                      className="font-bold text-lg"
                    />
                  ) : (
                    <span>{selectedRequest.title}</span>
                  )}
                  <StatusBadge status={selectedRequest.status} />
                </DialogTitle>
                <DialogDescription>
                  Requested on {formatDate(selectedRequest.createdAt)}
                  {selectedRequest.updatedAt && selectedRequest.updatedAt !== selectedRequest.createdAt && 
                    ` • Last updated on ${formatDate(selectedRequest.updatedAt)}`}
                  {selectedRequest.resendCount && selectedRequest.resendCount > 0 && 
                    ` • Resent ${selectedRequest.resendCount} time${selectedRequest.resendCount > 1 ? 's' : ''}`}
                </DialogDescription>
              </DialogHeader>
              
              {/* Show completed files section if available */}
              {selectedRequest.status === 'completed' && selectedRequest.completedFiles && selectedRequest.completedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Completed Files</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedRequest.completedFiles.map((file, index) => (
                      <div key={index} className="border rounded p-4 flex flex-col">
                        <div className="flex items-center mb-3">
                          {file && file.url && isImageFile(file.url) ? (
                            <FileImage className="h-5 w-5 mr-2 text-blue-500" />
                          ) : (
                            <FileText className="h-5 w-5 mr-2 text-orange-500" />
                          )}
                          <span className="text-sm font-medium truncate">
                            {file?.originalName || getFileNameFromUrl(file?.url)}
                          </span>
                        </div>

                        {/* Show preview for image files */}
                        {file && file.url && isImageFile(file.url) && (
                          <div className="mb-3 bg-gray-100 rounded p-1">
                            <img 
                              src={getProperFileUrl(file.url)} 
                              alt={file.originalName || "Preview"} 
                              className="max-h-40 mx-auto object-contain"
                            />
                          </div>
                        )}

                        <div className="flex justify-end mt-auto gap-2">
                          <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => viewFile(file)}
                            className="h-8 w-8 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            title="View File"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {file && file.url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => forceDownload(getProperFileUrl(file.url), file.originalName || getFileNameFromUrl(file.url))}
                              className="h-8 w-8 rounded-full text-green-600 hover:text-green-800 hover:bg-green-50"
                              title="Download File"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rest of the dialog content */}
              <div className="grid gap-4 py-4">
                {/* Request Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  {isEditing ? (
                    <Textarea 
                      value={editedRequest.description || selectedRequest.description || ''}
                      onChange={(e) => setEditedRequest({...editedRequest, description: e.target.value})}
                      className="min-h-[120px]"
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {selectedRequest.description || "No description provided"}
                    </p>
                  )}
                </div>

                {/* Video Content (if available) */}
                {(selectedRequest.videoId || isEditing) && (
                  <div>
                    <h3 className="font-semibold mb-2">YouTube Video {isEditing && <span className="text-xs text-gray-500">(Optional)</span>}</h3>
                    {isEditing ? (
                      <div className="space-y-3 bg-gray-50 p-3 rounded-md">
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="videoTitle">Video Title</label>
                          <Input 
                            id="videoTitle"
                            value={editedRequest.videoTitle || selectedRequest.videoTitle || ''}
                            onChange={(e) => setEditedRequest({...editedRequest, videoTitle: e.target.value})}
                            placeholder="Enter video title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="videoId">YouTube Video ID</label>
                          <Input 
                            id="videoId"
                            value={editedRequest.videoId || selectedRequest.videoId || ''}
                            onChange={(e) => setEditedRequest({...editedRequest, videoId: e.target.value})}
                            placeholder="e.g. dQw4w9WgXcQ"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="youtubeUrl">YouTube URL</label>
                          <Input 
                            id="youtubeUrl"
                            value={editedRequest.youtubeUrl || selectedRequest.youtubeUrl || ''}
                            onChange={(e) => setEditedRequest({...editedRequest, youtubeUrl: e.target.value})}
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                        {(editedRequest.videoId || selectedRequest.videoId) && (
                          <div className="mt-2">
                            <p className="text-xs text-blue-600 mb-2">Preview:</p>
                            <div className="aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md">
                              <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${editedRequest.videoId || selectedRequest.videoId}`}
                                title={editedRequest.videoTitle || selectedRequest.videoTitle || "YouTube Video"}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-medium">{selectedRequest.videoTitle || "Untitled Video"}</p>
                        {selectedRequest.youtubeUrl && (
                          <div className="mt-2 flex flex-col">
                            <div className="aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md">
                              <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${selectedRequest.videoId}`}
                                title={selectedRequest.videoTitle || "YouTube Video"}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                            <a 
                              href={selectedRequest.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 mt-2 text-sm flex items-center self-start"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Open in YouTube
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Carousel Content (if available) */}
                {(selectedRequest.content || isEditing) && (
                <div>
                    <h3 className="font-semibold mb-2">Generated Content {isEditing && <span className="text-xs text-gray-500">(Optional)</span>}</h3>
                    {isEditing ? (
                      <Textarea 
                        value={editedRequest.content || selectedRequest.content || ''}
                        onChange={(e) => setEditedRequest({...editedRequest, content: e.target.value})}
                        placeholder="Enter carousel content here..."
                        className="min-h-[200px] font-mono text-sm"
                      />
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-md whitespace-pre-wrap text-sm max-h-[200px] overflow-y-auto border border-gray-200">
                        {selectedRequest.content}
                      </div>
                    )}
                    {!isEditing && selectedRequest.content && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedRequest.content || '');
                          toast.success("Content copied to clipboard");
                        }}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Content
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Request Type */}
                <div>
                  <h3 className="font-semibold mb-2">Carousel Type</h3>
                  {isEditing ? (
                    <Select 
                      value={editedRequest.carouselType || selectedRequest.carouselType} 
                      onValueChange={(value) => setEditedRequest({...editedRequest, carouselType: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select carousel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-700">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {selectedRequest.carouselType}
                      </Badge>
                    </p>
                  )}
                </div>
                
                {/* Files Section */}
                {(selectedRequest.status === 'pending' || selectedRequest.status === 'in_progress' || selectedRequest.status === 'rejected') && (
                  <div>
                    <h3 className="font-semibold mb-2">Files You Submitted</h3>
                    {selectedRequest.files && selectedRequest.files.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedRequest.files.map((file, index) => (
                          <div key={index} className="border rounded p-3 flex flex-col">
                            <div className="flex items-center mb-2">
                          {isImageFile(file.url) ? (
                                <FileImage className="h-4 w-4 mr-2 text-blue-500" />
                              ) : (
                                <FileText className="h-4 w-4 mr-2 text-orange-500" />
                              )}
                              <span className="text-sm truncate font-medium">
                                {file.originalName || getFileNameFromUrl(file.url)}
                              </span>
                            </div>
                            
                            {/* Show image preview for image files */}
                            {isImageFile(file.url) && (
                              <div className="mb-2 bg-gray-100 rounded p-1">
                                <img 
                                  src={getProperFileUrl(file.url)} 
                                  alt={file.originalName || "Preview"} 
                                  className="max-h-32 mx-auto object-contain"
                                />
                              </div>
                            )}
                            
                            <div className="flex justify-end mt-auto gap-2">
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => viewFile(file)}
                                className="h-8 w-8 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                title="View File"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                            </div>
                          ) : (
                      <p className="text-gray-500 italic">No files were submitted with this request</p>
                    )}
                            </div>
                          )}
                          
                {/* Add new files section in edit mode */}
                {isEditing && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Add New Files</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                      <input
                        type="file"
                        id="new-files"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setEditedRequest({
                              ...editedRequest,
                              newFiles: Array.from(e.target.files)
                            });
                          }
                        }}
                      />
                      
                      {editedRequest.newFiles && editedRequest.newFiles.length > 0 ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">{editedRequest.newFiles.length} files selected</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => document.getElementById('new-files')?.click()}
                            >
                              Change Files
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {Array.from(editedRequest.newFiles).map((file, index) => (
                              <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                                {file.type.startsWith('image/') ? (
                                  <FileImage className="h-4 w-4 mr-2 text-blue-500" />
                                ) : (
                                  <FileText className="h-4 w-4 mr-2 text-orange-500" />
                                )}
                                <div className="flex-1 truncate">
                                  <p className="text-sm truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {file.type || 'Unknown type'} • {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                                <Button 
                              variant="ghost"
                                  size="sm"
                              onClick={() => {
                                    const updatedFiles = editedRequest.newFiles?.filter((_, i) => i !== index);
                                    setEditedRequest({...editedRequest, newFiles: updatedFiles});
                                  }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                            </Button>
                          </div>
                            ))}
                        </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-500 mb-1">
                            Drag and drop files, or
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => document.getElementById('new-files')?.click()}
                            className="mt-2"
                          >
                            Select Files
                          </Button>
                      </div>
                    )}
                  </div>
                </div>
                )}
              </div>
              
              <DialogFooter className="gap-2 flex flex-wrap justify-end">
                {selectedRequest.status === 'rejected' && !isEditing && (
                  <>
                <Button
                      className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit & Resend
                    </Button>
                    <Button
                      className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      variant="outline"
                      onClick={() => resendRejectedRequest(selectedRequest._id || selectedRequest.id)}
                      disabled={selectedRequest.resendCount && selectedRequest.resendCount >= 1 || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-1">◔</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileUp className="h-4 w-4 mr-1" />
                          Resend
                        </>
                      )}
                    </Button>
                  </>
                )}
                
                {isEditing && (
                  <>
                    <Button
                      className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                      variant="outline"
                      onClick={() => resendRejectedRequest(selectedRequest._id || selectedRequest.id, editedRequest)}
                    >
                      <FileUp className="h-4 w-4 mr-1" />
                      Save & Resend
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedRequest({});
                      }}
                    >
                      Cancel Edits
                    </Button>
                  </>
                )}
                
                {selectedRequest.status === 'completed' && selectedRequest.completedFiles && selectedRequest.completedFiles.length > 0 && (
                  <Button 
                    className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                    variant="outline"
                    onClick={() => {
                      downloadCompletedFiles(selectedRequest);
                      setSelectedRequest(null);
                    }}
                >
                  <Download className="h-4 w-4 mr-1" />
                    Download All
                  </Button>
                )}
                
                <Button variant="outline" onClick={() => {
                  setSelectedRequest(null);
                  setIsEditing(false);
                  setEditedRequest({});
                }}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog open={showFilePreview} onOpenChange={setShowFilePreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] w-[90vw]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{selectedFile?.name}</span>
              {selectedFile?.url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedFile?.url) {
                      forceDownload(selectedFile.url, selectedFile.name || 'file');
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-[60vh] bg-gray-50 rounded-lg overflow-hidden">
            {selectedFile?.url && (
              selectedFile.type === 'image' ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name || 'Image preview'}
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={selectedFile.url}
                  title={selectedFile.name || 'Document preview'}
                  className="w-full h-full border-0"
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCarouselsPage; 