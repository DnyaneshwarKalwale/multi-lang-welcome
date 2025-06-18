import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Image, FileUp, Eye, Download } from 'lucide-react';
import { format } from 'date-fns';
import { API_URL } from '../../services/api';
import { uploadToCloudinaryDirect } from '@/utils/cloudinaryDirectUpload';

// Define types for carousel requests
interface CarouselFile {
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
}

interface CarouselRequest {
  id: string;
  _id?: string; // MongoDB may return this
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string; // Could be a string ID or populated object
  user?: { // Alternative field name
    _id: string;
    name: string;
    email: string;
  };
  userName?: string; // New field for user name
  userEmail?: string; // New field for user email
  title: string;
  description?: string;
  videoId?: string;
  videoTitle?: string;
  youtubeUrl?: string;
  content?: string;
  carouselType: string;
  files: CarouselFile[];
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  adminNotes?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  } | string;
  completedCarouselId?: string;
  createdAt: string;
  updatedAt: string;
  resendCount?: number;
  wasModified?: boolean;
  originalContent?: {
    content?: string;
    files?: CarouselFile[];
    title?: string;
    description?: string;
    carouselType?: string;
    videoId?: string;
    videoTitle?: string;
    youtubeUrl?: string;
  };
  completedFiles?: CarouselFile[];
}

// Define extended user interface to handle both formats
interface UserInfo {
  name: string;
  email: string;
  id: string;
}

interface UserWithName {
  _id: string;
  name: string;
  email: string;
}

interface UserWithFirstName {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
}

const CarouselRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<CarouselRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<CarouselRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [uploadingCarousel, setUploadingCarousel] = useState<boolean>(false);
  const [completionFiles, setCompletionFiles] = useState<File[]>([]);
  const [completionNote, setCompletionNote] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [viewOriginalContent, setViewOriginalContent] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      console.log('First request details:', JSON.stringify(requests[0], null, 2));
    }
  }, [requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem("admin-token");
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Add logging to debug token
      console.log('Using token (first 20 chars):', token.substring(0, 20) + '...');
      
      // Use the correct API endpoint that matches the backend route
      const requestsUrl = `${API_URL}/carousels/admin/requests`;
      
      console.log('Fetching carousel requests from:', requestsUrl);
      
      const response = await fetch(requestsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Debug response status
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Received carousel requests data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch carousel requests');
      }
      
      setRequests(data.data || []);
    } catch (error) {
      console.error('Error fetching carousel requests:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch carousel requests',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Use the correct API endpoint path and id field
      const apiUrl = `${API_URL}/carousels/requests/${requestId}/status`;
      
      console.log('Updating request status at:', apiUrl);
      console.log('Request ID:', requestId);
      console.log('Status:', status);
      
      // Using POST method to avoid CORS issues
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Received non-JSON response: ${await response.text()}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update request status');
      }
      
      // Refresh the carousel requests list
      await fetchRequests();
      
      toast({
        title: 'Success',
        description: `Request status updated to ${status}`,
        variant: 'default'
      });

      // Close the dialog if open
      setViewDialogOpen(false);
    } catch (error) {
      console.error('Error updating request status:', error);
      
      let errorMessage = 'Failed to update request status';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const viewRequest = (request: CarouselRequest) => {
    console.log('Viewing request details:', {
      _id: request._id,
      id: request.id,
      status: request.status
    });
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-white text-yellow-600 border border-yellow-300 hover:bg-yellow-50">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-white text-blue-600 border border-blue-300 hover:bg-blue-50">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-white text-green-600 border border-green-300 hover:bg-green-50">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-white text-red-600 border border-red-300 hover:bg-red-50">Rejected</Badge>;
      default:
        return <Badge className="bg-white text-gray-600 border border-gray-300">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300';
    }
  };

  const getFileIcon = (file: CarouselFile) => {
    // Get mimetype - handle cases where it might be missing
    const mimetype = file.mimetype || '';
    const url = file.url || '';
    
    // Check for image files - either by mimetype or by URL pattern
    if (mimetype.startsWith('image/') || url.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) {
      return <Image className="h-4 w-4" />;
    } 
    // Check for PDF files
    else if (mimetype.includes('pdf') || url.includes('pdf') || url.endsWith('.pdf')) {
      return <FileText className="h-4 w-4" />;
    } 
    // Default file icon
    else {
      return <FileUp className="h-4 w-4" />;
    }
  };

  // Helper function to get file name from URL if original name is missing
  const getFileNameFromUrl = (url: string = '') => {
    // Try to extract filename from URL
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    
    // Remove query params if any
    const nameWithoutParams = lastPart.split('?')[0];
    
    // If it's a Cloudinary URL, clean up the ID
    if (url.includes('cloudinary') || url.includes('res.cloudinary.com')) {
      // Try to get a readable name
      const cloudinaryParts = nameWithoutParams.split('.');
      if (cloudinaryParts.length > 1) {
        return cloudinaryParts[0].substring(0, 15) + '.' + cloudinaryParts[cloudinaryParts.length - 1];
      }
    }
    
    return nameWithoutParams || 'Unnamed file';
  };

  // Helper function to get file name, checking originalName first if available
  const getFileName = (file: CarouselFile) => {
    if (file.originalName) {
      return file.originalName;
    }
    return getFileNameFromUrl(file.url);
  };

  // Function to append auth token to URL if needed
  const getAuthenticatedUrl = (url: string) => {
    // For Cloudinary URLs that might need authentication
    if (url.includes('cloudinary.com') && 
        (url.includes('.pdf') || url.includes('/raw/'))) {
      const token = localStorage.getItem("admin-token") || '';
      // Add auth token as query parameter
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}auth_token=${encodeURIComponent(token)}`;
    }
    return url;
  };

  // Function to determine if file is viewable directly in browser
  const isViewableFile = (file: CarouselFile) => {
    const url = file.url || '';
    const mimetype = file.mimetype || '';
    
    // Images and PDFs can be viewed in browser
    return mimetype.startsWith('image/') || 
           mimetype.includes('pdf') || 
           url.includes('image') || 
           /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: format(date, 'MMM'),
      day: format(date, 'd'),
      year: format(date, 'yyyy')
    };
  };

  // Tabbed version for display in the main list
  const formatDateStacked = (dateString: string) => {
    const { month, day, year } = formatDate(dateString);
    return (
      <div className="flex flex-col">
        <span>{month}</span>
        <span>{day},</span>
        <span>{year}</span>
      </div>
    );
  };

  const filteredRequests = activeTab === 'all' 
    ? requests 
    : requests.filter(req => req.status === activeTab);

  // Helper function to get user information regardless of structure
  const getUserInfo = (request: CarouselRequest): UserInfo => {
    // First check for direct userName and userEmail fields (new format)
    if (request.userName || request.userEmail) {
      return {
        name: request.userName || 'Unknown user',
        email: request.userEmail || 'No email available',
        id: typeof request.userId === 'object' ? request.userId._id : (request.userId as string)
      };
    }
    
    // If userId is an object with name and email
    if (typeof request.userId === 'object' && request.userId) {
      // Check if it has name property (UserWithName interface)
      if ('name' in request.userId && request.userId.name) {
        return {
          name: request.userId.name,
          email: (request.userId as UserWithName).email || 'No email',
          id: (request.userId as UserWithName)._id
        };
      }
      // Some APIs might return firstName/lastName instead of name (UserWithFirstName interface)
      if ('firstName' in request.userId && request.userId.firstName) {
        const user = request.userId as UserWithFirstName;
        return {
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          email: user.email || 'No email',
          id: user._id
        };
      }
    }
    
    // If we have user object instead (alternative field)
    if (request.user && typeof request.user === 'object') {
      if ('name' in request.user && request.user.name) {
        return {
          name: request.user.name,
          email: (request.user as UserWithName).email || 'No email',
          id: (request.user as UserWithName)._id
        };
      }
      if ('firstName' in request.user && request.user.firstName) {
        const user = request.user as UserWithFirstName;
        return {
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          email: user.email || 'No email',
          id: user._id
        };
      }
    }
    
    // If we have a string userId
    if (typeof request.userId === 'string') {
      return {
        name: 'User',
        id: request.userId,
        email: 'ID: ' + request.userId.substring(0, 8) + '...'
      };
    }
    
    // Fallback
    return {
      name: 'Unknown user',
      email: 'No email available',
      id: 'unknown'
    };
  }

  const getFileUrl = (file: CarouselFile) => {
    const url = file.url || '';
    
    // If it's a Cloudinary URL, return it as is
    if (url.includes('cloudinary.com')) {
      return url;
    }
    
    // If it's a relative path (local storage), prefix with API URL
    if (url.startsWith('uploads/') || url.startsWith('/uploads/')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      return `${baseUrl}/${url.startsWith('/') ? url.substring(1) : url}`;
    }
    
    return url;
  };

  // Add function to get download URL
  const getDownloadUrl = (file: CarouselFile) => {
    const url = file.url || '';
    
    // For Cloudinary URLs, modify the URL to force download
    if (url.includes('cloudinary.com')) {
      // Add fl_attachment flag to force download
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
      }
    }
    
    return getFileUrl(file);
  };

  // Update the FilePreview component
  const FilePreview = ({ file }: { file: CarouselFile }) => {
    const [showPreview, setShowPreview] = useState(false);
    const isImage = isImageFile(file);
    const isPDF = isPdfFile(file);
    const fileUrl = getFileUrl(file);
    const downloadUrl = getDownloadUrl(file);

    // Enhanced cloudinary URL generation for optimized viewing
    const getOptimizedUrl = (url: string) => {
      // If it's a Cloudinary URL, we can optimize it
      if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) {
        // For images, apply auto-format and quality optimization
        if (isImage) {
          // Parse the cloudinary URL parts
          const parts = url.split('/upload/');
          if (parts.length === 2) {
            return `${parts[0]}/upload/c_scale,w_800,q_auto,f_auto/${parts[1]}`;
          }
        }
      }
      return url;
    };

    // Function to get thumbnail URL for preview
    const getThumbnailUrl = (url: string) => {
      if (url.includes('cloudinary.com')) {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
          return `${parts[0]}/upload/c_scale,w_200,q_auto,f_auto/${parts[1]}`;
        }
      }
      return url;
    };

    return (
      <div className="flex flex-col p-3 border rounded bg-gray-50 overflow-hidden">
        <div className="flex items-center mb-2">
          {getFileIcon(file)}
          <div className="ml-2 flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{getFileName(file)}</p>
            <p className="text-xs text-gray-500 truncate">
              {file.mimetype || getFileTypeFromUrl(file.url)} • {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Size unknown'}
            </p>
          </div>
        </div>

        {/* Show thumbnail for images */}
        {isImage && (
          <div className="mb-2 bg-white rounded p-1 cursor-pointer" onClick={() => setShowPreview(true)}>
            <img 
              src={getThumbnailUrl(fileUrl)} 
              alt={getFileName(file)} 
              className="max-h-32 mx-auto object-contain"
              loading="lazy"
            />
          </div>
        )}

        {/* Preview modal for images */}
        {showPreview && isImage && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
            onClick={() => setShowPreview(false)}
          >
            <div 
              className="bg-white p-2 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto shadow-lg" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg truncate">{getFileName(file)}</h3>
                <button 
                  onClick={() => setShowPreview(false)} 
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <img 
                src={getOptimizedUrl(fileUrl)} 
                alt={getFileName(file)} 
                className="max-w-full max-h-[70vh] object-contain mx-auto"
                loading="lazy"
              />
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 mt-2">
          {isViewableFile(file) && (
            <button
              onClick={() => {
                if (isImage) {
                  setShowPreview(true);
                } else {
                  window.open(fileUrl, '_blank');
                }
              }}
              className="text-blue-500 hover:text-blue-700 text-sm flex-1 flex items-center justify-center p-1 border border-blue-500 rounded truncate"
            >
              <Eye className="h-4 w-4 mr-1" />
              <span className="truncate">{isImage ? 'Preview' : 'View'}</span>
            </button>
          )}
          <a
            href={downloadUrl}
            download={getFileName(file)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-700 text-sm flex-1 flex items-center justify-center p-1 border border-green-500 rounded truncate"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="truncate">Download</span>
          </a>
        </div>
      </div>
    );
  };

  // Helper functions to check file types
  const isImageFile = (file: CarouselFile) => {
    const url = file.url || '';
    const mimetype = file.mimetype || '';
    
    return mimetype.startsWith('image/') || 
           url.includes('/image/upload/') || 
           /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isPdfFile = (file: CarouselFile) => {
    const url = file.url || '';
    const mimetype = file.mimetype || '';
    
    return mimetype.includes('pdf') || url.includes('pdf') || url.endsWith('.pdf');
  };

  const getFileTypeFromUrl = (url: string = '') => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return 'Image';
    if (/\.pdf$/i.test(url)) return 'PDF Document';
    if (/\.(doc|docx)$/i.test(url)) return 'Word Document';
    if (/\.(xls|xlsx)$/i.test(url)) return 'Excel Spreadsheet';
    if (/\.(ppt|pptx)$/i.test(url)) return 'Presentation';
    if (/\.txt$/i.test(url)) return 'Text File';
    
    // For Cloudinary URLs
    if (url.includes('cloudinary')) {
      if (url.includes('/image/')) return 'Image';
      if (url.includes('/raw/')) return 'Document';
      if (url.includes('/video/')) return 'Video';
    }
    
    return 'Unknown file type';
  };

  // Function to handle carousel file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setCompletionFiles(filesArray);
    }
  };

  // Get detailed error message from response
  const getErrorMessage = async (response: Response) => {
    try {
      const data = await response.json();
      return data.message || data.error || 'Unknown error occurred';
    } catch (err) {
      return `Server error (${response.status})`;
    }
  };

  // Function to submit completed carousel back to user
  const submitCompletedCarousel = async () => {
    try {
      setUploadingCarousel(true);
      
      // Validate that we have selected files
      if (!completionFiles.length) {
        toast({ 
          title: 'Error', 
          description: 'Please upload at least one file to complete the request', 
          variant: 'destructive'
        });
        setUploadingCarousel(false);
        return;
      }
      
      // Use _id instead of id field for MongoDB - this is critical
      const requestId = selectedRequest?._id;
      
      if (!requestId) {
        toast({ 
          title: 'Error', 
          description: 'Invalid request ID', 
          variant: 'destructive' 
        });
        setUploadingCarousel(false);
        return;
      }

      console.log('Completing request with ID:', requestId);
      
      // First upload files to Cloudinary through our backend endpoint
      const uploadPromises = completionFiles.map(file => {
        return new Promise<CarouselFile>((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file);
          
          const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
          const apiUrl = baseUrl.endsWith('/api') 
            ? `${baseUrl}/upload/upload`
            : `${baseUrl}/api/upload/upload`;
          
          console.log('Uploading file to:', apiUrl);
          
          // Get the token
          const token = localStorage.getItem("admin-token");
          if (!token) {
            reject(new Error('Authentication token not found'));
            return;
          }

          fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            body: formData,
            mode: 'cors',
            credentials: 'include'
          })
          .then(async response => {
            // Log response headers for debugging
            console.log('Response headers:', {
              'content-type': response.headers.get('content-type'),
              'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
              'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
            });

            const responseText = await response.text();
            console.log('Upload response:', responseText);
            
            if (!response.ok) {
              throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${responseText}`);
            }
            
            try {
              const data = JSON.parse(responseText);
              if (data.secure_url) {
                resolve({
                  url: data.secure_url,
                  filename: data.public_id,
                  originalName: file.name,
                  mimetype: file.type,
                  size: file.size
                });
              } else {
                reject(new Error('Failed to upload file to Cloudinary - missing secure_url'));
              }
            } catch (error) {
              reject(new Error(`Failed to parse upload response: ${error.message}`));
            }
          })
          .catch(error => {
            console.error('Error uploading file:', error);
            reject(error);
          });
        });
      });

      // Upload all files to Cloudinary
      const uploadedFiles = await Promise.all(uploadPromises);
      
      console.log('Successfully uploaded files:', uploadedFiles);
      
      // Now send the request to complete the carousel with Cloudinary URLs
      const url = `${API_URL}/carousels/requests/${requestId}/complete`;
      
      const requestBody = {
        files: uploadedFiles.map(file => ({
          url: file.url,
          filename: file.filename,
          originalName: file.originalName,
          mimetype: file.mimetype,
          size: file.size
        })),
        adminNotes: completionNote
      };
      
      console.log('Sending request to:', url);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      // Send the request with Cloudinary URLs
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("admin-token")}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      // Debug response
      console.log('Response status:', response.status);
      
      // Get full response text for debugging
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Check response
      if (!response.ok) {
        let errorMessage = 'Failed to complete carousel request';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      // Process successful response
      const data = JSON.parse(responseText);
      
      // Only update UI and show success message if the request was actually successful
      toast({
        title: 'Success',
        description: 'Carousel request completed successfully',
        variant: 'default',
      });
      
      // Reset form and fetch updated data
      setCompletionFiles([]);
      setCompletionNote('');
      setSelectedRequest(null);
      setUploadModalOpen(false);
      await fetchRequests(); // Refresh the list to show updated status
    } catch (error) {
      console.error('Error submitting completed carousel:', error);
      toast({
        title: 'Error',
        description: `Failed to complete carousel request: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setUploadingCarousel(false);
    }
  };

  return (
    <div className="container mx-auto py-4 px-3 sm:px-4 md:py-8">
      <Card>
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-lg sm:text-xl">Carousel Requests</CardTitle>
          <CardDescription>Manage carousel requests from users</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading requests...</span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No carousel requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <Table className="w-full min-w-[650px]">
                <TableHeader>
                  <TableRow>
                      <TableHead className="whitespace-nowrap">Title</TableHead>
                      <TableHead className="whitespace-nowrap">User</TableHead>
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">Type</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Files</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{request.title}</TableCell>
                        <TableCell className="whitespace-nowrap">{getUserInfo(request).name}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDateStacked(request.updatedAt || request.createdAt)}</TableCell>
                        <TableCell className="capitalize whitespace-nowrap">{request.carouselType}</TableCell>
                        <TableCell className="whitespace-nowrap">{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="whitespace-nowrap">{request.files.length} files</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => viewRequest(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={(open) => {
        if (!open) {
          // Reset states when closing
          setViewOriginalContent(false);
          setSelectedRequest(null);
        }
        setViewDialogOpen(open);
      }}>
        <DialogContent 
          className="w-[95vw] max-w-4xl max-h-[85vh] overflow-y-auto" 
          onInteractOutside={(e) => {
            // Prevent closing when interacting with file previews
            if ((e.target as HTMLElement).closest('.file-preview-modal')) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={() => {
            // Reset states when closing via escape key
            setViewOriginalContent(false);
            setSelectedRequest(null);
          }}
        >
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl break-words">{selectedRequest.title}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Submitted by {getUserInfo(selectedRequest).name} on {format(new Date(selectedRequest.createdAt), 'MMM d, yyyy')}
                  {selectedRequest.updatedAt && selectedRequest.updatedAt !== selectedRequest.createdAt && 
                    ` • Last updated on ${format(new Date(selectedRequest.updatedAt), 'MMM d, yyyy')}`}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="text-lg font-medium">Request Details</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedRequest.resendCount > 0 && (
                      <Badge className="bg-amber-100 text-amber-800">
                        Resent {selectedRequest.resendCount} time{selectedRequest.resendCount > 1 ? 's' : ''}
                      </Badge>
                    )}
                  {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                
                {/* Original Content Toggle */}
                {selectedRequest.wasModified && selectedRequest.originalContent && (
                  <div className="flex flex-col sm:flex-row sm:items-center p-2 bg-amber-50 rounded border border-amber-200">
                    <div className="flex-1 mb-2 sm:mb-0">
                      <p className="text-amber-800 text-sm break-words">This request was modified by the user before resending</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-amber-600 border-amber-300 w-full sm:w-auto mt-1 sm:mt-0"
                      onClick={() => setViewOriginalContent(!viewOriginalContent)}
                    >
                      {viewOriginalContent ? "View Current Version" : "View Original Version"}
                    </Button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">User Information</h4>
                    <p className="text-sm"><span className="font-medium">Name:</span> {getUserInfo(selectedRequest).name}</p>
                    <p className="text-sm break-all"><span className="font-medium">Email:</span> {getUserInfo(selectedRequest).email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Carousel Type</h4>
                    <p className="capitalize text-sm">{selectedRequest.carouselType}</p>
                    <p className="mt-2 text-sm"><span className="font-medium">Requested on:</span> {format(new Date(selectedRequest.createdAt), 'MMM d, yyyy')}</p>
                    {selectedRequest.updatedAt && selectedRequest.updatedAt !== selectedRequest.createdAt && (
                      <p className="mt-1 text-sm"><span className="font-medium">Last updated:</span> {format(new Date(selectedRequest.updatedAt), 'MMM d, yyyy')}</p>
                    )}
                    {selectedRequest.resendCount > 0 && (
                      <p className="mt-1 text-sm"><span className="font-medium">Resent:</span> {selectedRequest.resendCount} time{selectedRequest.resendCount > 1 ? 's' : ''}</p>
                    )}
                    {selectedRequest.wasModified && (
                      <p className="mt-1 text-amber-600 text-sm"><span className="font-medium">Note:</span> User modified this request before resending</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Additional Notes</h4>
                  <p className="bg-gray-50 p-3 rounded text-sm break-words">
                    {viewOriginalContent && selectedRequest.originalContent?.description
                      ? selectedRequest.originalContent.description 
                      : (selectedRequest.description || "No additional notes provided")}
                  </p>
                </div>
                
                {selectedRequest.videoId && (
                  <div className="overflow-hidden">
                    <h4 className="font-semibold mb-1">YouTube Video</h4>
                    <div className="bg-gray-50 p-3 rounded flex flex-col">
                      <div className="flex items-start sm:items-center">
                        <svg className="w-5 h-5 mr-2 text-red-600 flex-shrink-0 mt-1 sm:mt-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                        <div className="text-sm flex-1 min-w-0">
                          <p className="font-medium break-words">{viewOriginalContent && selectedRequest.originalContent?.videoTitle ? selectedRequest.originalContent.videoTitle : selectedRequest.videoTitle}</p>
                          <p className="text-xs text-gray-500 break-all">ID: {viewOriginalContent && selectedRequest.originalContent?.videoId ? selectedRequest.originalContent.videoId : selectedRequest.videoId}</p>
                        </div>
                      </div>
                      
                      <div className="aspect-video w-full max-w-md mx-auto mt-3 overflow-hidden rounded">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${selectedRequest.videoId}`}
                          title={selectedRequest.videoTitle || "YouTube Video"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                          loading="lazy"
                        ></iframe>
                      </div>
                      
                      <div className="mt-2 flex justify-end">
                          <a 
                            href={selectedRequest.youtubeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5z" />
                            </svg>
                          Open on YouTube
                          </a>
                        </div>
                    </div>
                  </div>
                )}
                
                {selectedRequest.content && (
                  <div>
                    <h4 className="font-semibold mb-1">AI Generated Content</h4>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-md max-h-[300px] overflow-y-auto whitespace-pre-wrap border border-gray-200 text-xs sm:text-sm break-words">
                      {viewOriginalContent && selectedRequest.originalContent?.content 
                        ? selectedRequest.originalContent.content 
                        : selectedRequest.content}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            viewOriginalContent && selectedRequest.originalContent?.content 
                              ? selectedRequest.originalContent.content 
                              : (selectedRequest.content || '')
                          );
                          toast({
                            title: "Copied",
                            description: "Content copied to clipboard",
                            duration: 2000
                          });
                        }}
                      >
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Content
                      </Button>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">User Uploaded Files</h4>
                  {selectedRequest.files.length === 0 ? (
                    <p className="text-sm">No files uploaded</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {viewOriginalContent && selectedRequest.originalContent?.files 
                        ? (selectedRequest.originalContent.files || []).map((file, index) => (
                        <FilePreview key={index} file={file} />
                          ))
                        : selectedRequest.files.map((file, index) => (
                            <FilePreview key={index} file={file} />
                          ))
                      }
                    </div>
                  )}
                </div>

                {/* Show admin completed files section when request is completed */}
                {selectedRequest.status === 'completed' && selectedRequest.completedFiles && selectedRequest.completedFiles.length > 0 && (
                  <div className="mt-6 border-t pt-6">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Files Delivered to User
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedRequest.completedFiles.map((file, index) => (
                        <div key={index} className="border rounded p-3 flex flex-col border-green-200 bg-green-50">
                          <div className="flex items-center mb-2">
                            {file.url && isImageFile({...file, url: file.url}) ? (
                              <Image className="h-4 w-4 mr-2 text-green-500" />
                            ) : (
                              <FileText className="h-4 w-4 mr-2 text-green-500" />
                            )}
                            <span className="text-sm truncate font-medium">
                              {file.originalName || getFileName(file)}
                            </span>
              </div>
              
                          {/* Show image preview for image files */}
                          {file.url && isImageFile({...file, url: file.url}) && (
                            <div className="mb-2 bg-white rounded p-1">
                              <img 
                                src={getFileUrl(file)} 
                                alt={file.originalName || "Preview"} 
                                className="max-h-32 mx-auto object-contain"
                              />
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2 mt-auto">
                            <a 
                              href={getFileUrl(file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <Eye className="h-3 w-3 mr-1" /> 
                              View
                            </a>
                            <a 
                              href={getFileUrl(file)}
                              download={file.originalName || getFileName(file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-green-600 hover:text-green-800 flex items-center"
                            >
                              <Download className="h-3 w-3 mr-1" /> 
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
                  {selectedRequest.status !== 'completed' && (
                    <Button 
                      variant="outline"
                      onClick={() => setUploadModalOpen(true)}
                      className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700 truncate"
                    >
                      <span className="truncate">Complete & Send</span>
                    </Button>
                  )}
                  
                  {selectedRequest.status !== 'completed' && selectedRequest.status !== 'rejected' && (
                    <Button 
                      variant="outline"
                      onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 truncate"
                    >
                      <span className="truncate">Reject</span>
                    </Button>
                  )}
                </div>
                
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Upload Completed Carousel Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={(open) => {
        if (!open) {
          // Reset states when closing
          setCompletionFiles([]);
          setCompletionNote('');
        }
        setUploadModalOpen(open);
      }}>
        <DialogContent 
          className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => {
            if (uploadingCarousel) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (uploadingCarousel) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Upload Completed Carousel</DialogTitle>
            <DialogDescription>
              Upload the completed carousel files to send back to the user. 
              These will appear in the user's "My Carousels" section.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              
              {completionFiles.length === 0 ? (
                <div className="text-center">
                  <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-1">
                    Drag and drop carousel files, or
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    Select Files
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Selected Files</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Files
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {completionFiles.map((file, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        {file.type.startsWith('image/') ? (
                          <Image className="h-4 w-4 mr-2 flex-shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{file.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {file.type || 'Unknown type'} • {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => {
                            setCompletionFiles(prev => prev.filter((_, i) => i !== index));
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
              )}
            </div>
            
            <div>
              <label htmlFor="completion-note" className="block text-sm font-medium mb-1">
                Note to User (Optional)
              </label>
              <textarea
                id="completion-note"
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
                placeholder="Add any notes or instructions for the user..."
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button variant="outline" onClick={() => setUploadModalOpen(false)} disabled={uploadingCarousel}>
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={submitCompletedCarousel} 
              className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
              disabled={completionFiles.length === 0 || uploadingCarousel}
            >
              {uploadingCarousel ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Complete & Send'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarouselRequestsPage; 