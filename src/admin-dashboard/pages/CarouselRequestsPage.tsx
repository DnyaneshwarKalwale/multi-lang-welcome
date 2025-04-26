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
import { Loader2, FileText, Image, FileUp, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { API_URL } from '../../services/api';

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
      
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const apiUrl = `${baseUrl}/carousels/requests/${requestId}/status`;
      
      console.log('Updating request status at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
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
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update request status',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in_progress':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
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
  const getFileName = (file: CarouselFile) => {
    if (file.originalName) {
      return file.originalName;
    }
    
    // Try to extract filename from URL
    const url = file.url || '';
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
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };

  const filteredRequests = activeTab === 'all' 
    ? requests 
    : requests.filter(req => req.status === activeTab);

  // Helper function to get user information regardless of structure
  const getUserInfo = (request: CarouselRequest): UserInfo => {
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
    
    // If the URL is a relative path (local storage), prefix with API URL
    if (url.startsWith('uploads/') || url.startsWith('/uploads/')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      return `${baseUrl}/${url.startsWith('/') ? url.substring(1) : url}`;
    }
    
    return url;
  };

  // Enhanced file preview component
  const FilePreview = ({ file }: { file: CarouselFile }) => {
    const [showPreview, setShowPreview] = useState(false);
    const isImage = isImageFile(file);
    const isPDF = isPdfFile(file);
    const fileUrl = getFileUrl(file);

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

    return (
      <div className="flex flex-col p-3 border rounded bg-gray-50">
        <div className="flex items-center mb-2">
          {getFileIcon(file)}
          <div className="ml-2 flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{getFileName(file)}</p>
            <p className="text-xs text-gray-500">
              {file.mimetype || getFileTypeFromUrl(file.url)} • {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Size unknown'}
            </p>
          </div>
        </div>

        {/* Preview modal */}
        {showPreview && isImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
            <div className="bg-white p-2 rounded-lg max-w-3xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg">{getFileName(file)}</h3>
                <button onClick={() => setShowPreview(false)} className="p-1 hover:bg-gray-200 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <img 
                src={getOptimizedUrl(fileUrl)} 
                alt={getFileName(file)} 
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 mt-2">
          {isViewableFile(file) && (
            <button
              onClick={() => isImage ? setShowPreview(true) : window.open(fileUrl, '_blank')}
              className="text-blue-500 hover:text-blue-700 text-sm flex-1 flex items-center justify-center p-1 border border-blue-500 rounded"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {isImage ? 'Preview' : 'View'}
            </button>
          )}
          <a
            href={fileUrl}
            download={getFileName(file)}
            className="text-green-500 hover:text-green-700 text-sm flex-1 flex items-center justify-center p-1 border border-green-500 rounded"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
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
      
      // Create form data
      const formData = new FormData();
      completionFiles.forEach((file) => {
        formData.append('files', file);
      });
      
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
      
      // Add admin notes if available
      if (completionNote) {
        formData.append('adminNotes', completionNote);
      }
      
      // Set API URL using the _id directly
      const url = `${API_URL}/carousels/requests/${requestId}/complete`;
      
      console.log('Sending request to:', url);
      
      // Make the API call
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          // Don't set Content-Type with FormData - it will be set automatically with the boundary
        },
        body: formData,
      });
      
      // Debug response
      console.log('Response status:', response.status);
      
      // Check response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete carousel request');
      }
      
      // Process successful response
      const data = await response.json();
      
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
      await fetchRequests();
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
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Carousel Requests</CardTitle>
          <CardDescription>Manage carousel requests from users</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>{getUserInfo(request).name}</TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell className="capitalize">{request.carouselType}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{request.files.length} files</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="mr-2"
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
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRequest.title}</DialogTitle>
                <DialogDescription>
                  Submitted by {getUserInfo(selectedRequest).name} on {formatDate(selectedRequest.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Request Details</h3>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">User Information</h4>
                    <p><span className="font-medium">Name:</span> {getUserInfo(selectedRequest).name}</p>
                    <p><span className="font-medium">Email:</span> {getUserInfo(selectedRequest).email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Carousel Type</h4>
                    <p className="capitalize">{selectedRequest.carouselType}</p>
                    <p className="mt-2"><span className="font-medium">Requested on:</span> {formatDate(selectedRequest.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Description</h4>
                  <p className="bg-gray-50 p-3 rounded">{selectedRequest.description || "No description provided"}</p>
                </div>
                
                {selectedRequest.videoId && (
                  <div>
                    <h4 className="font-semibold mb-1">Selected YouTube Video</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p><span className="font-medium">Title:</span> {selectedRequest.videoTitle}</p>
                      <p><span className="font-medium">YouTube ID:</span> {selectedRequest.videoId}</p>
                      {selectedRequest.youtubeUrl && (
                        <div className="mt-2">
                          <a 
                            href={selectedRequest.youtubeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 flex items-center"
                          >
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                            Open YouTube Video
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedRequest.content && (
                  <div>
                    <h4 className="font-semibold mb-1">AI Generated Content</h4>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap border border-gray-200">
                      {selectedRequest.content}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedRequest.content || '');
                          toast({
                            title: "Copied",
                            description: "Content copied to clipboard",
                            duration: 2000
                          });
                        }}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Content
                      </Button>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Uploaded Files</h4>
                  {selectedRequest.files.length === 0 ? (
                    <p>No files uploaded</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedRequest.files.map((file, index) => (
                        <FilePreview key={index} file={file} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                  {selectedRequest.status !== 'in_progress' && (
                    <Button 
                      onClick={() => updateRequestStatus(selectedRequest.id, 'in_progress')}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Mark In Progress
                    </Button>
                  )}
                  
                  {selectedRequest.status !== 'completed' && (
                    <Button 
                      onClick={() => setUploadModalOpen(true)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Complete & Send
                    </Button>
                  )}
                  
                  {selectedRequest.status !== 'rejected' && (
                    <Button 
                      onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Reject
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
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Upload Completed Carousel</DialogTitle>
            <DialogDescription>
              Upload the completed carousel files to send back to the user. 
              These will appear in the user's "My Carousels" section.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
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
                          <Image className="h-4 w-4 mr-2" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2" />
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
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setUploadModalOpen(false)} disabled={uploadingCarousel}>
              Cancel
            </Button>
            <Button 
              onClick={submitCompletedCarousel} 
              className="bg-green-500 hover:bg-green-600 text-white" 
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