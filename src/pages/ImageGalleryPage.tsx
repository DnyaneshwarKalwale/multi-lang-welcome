import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Search, 
  Loader2, 
  Download, 
  UploadCloud,
  Grid3X3,
  Grid2X2,
  Copy,
  Check,
  ChevronsRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import axios from 'axios';
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';

// Interface for gallery image
interface GalleryImage {
  id: string;
  userId: string;
  url: string;
  secure_url: string;
  public_id: string;
  prompt?: string;
  title?: string;
  tags?: string[];
  createdAt: string;
  type: 'ai-generated' | 'uploaded';
  width: number;
  height: number;
}

const ImageGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gridSize, setGridSize] = useState<'small' | 'large'>('small');
  const [activeTab, setActiveTab] = useState<'all' | 'ai-generated' | 'uploaded'>('all');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Sample images - will be replaced with API data in production
  const sampleImages: GalleryImage[] = [
    {
      id: '1',
      userId: '123',
      url: 'https://res.cloudinary.com/dexlsqpbv/image/upload/v1611234567/linkedin_generated/sample1.jpg',
      secure_url: 'https://res.cloudinary.com/dexlsqpbv/image/upload/v1611234567/linkedin_generated/sample1.jpg',
      public_id: 'linkedin_generated/sample1',
      prompt: 'Professional woman presenting in a modern conference room with a digital display',
      title: 'Business Presentation',
      tags: ['presentation', 'business', 'professional'],
      createdAt: '2023-05-10T15:30:00Z',
      type: 'ai-generated',
      width: 1024,
      height: 1024
    },
    {
      id: '2',
      userId: '123',
      url: 'https://res.cloudinary.com/dexlsqpbv/image/upload/v1611234568/linkedin_generated/sample2.jpg',
      secure_url: 'https://res.cloudinary.com/dexlsqpbv/image/upload/v1611234568/linkedin_generated/sample2.jpg',
      public_id: 'linkedin_generated/sample2',
      title: 'Team Collaboration',
      tags: ['team', 'collaboration', 'meeting'],
      createdAt: '2023-05-15T10:20:00Z',
      type: 'uploaded',
      width: 1200,
      height: 800
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    // In production, this would fetch from API
    const fetchImages = async () => {
      setIsLoading(true);
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For the sample, we'll use the sample data
      // In production, this would be:
      // const response = await axios.get(`${import.meta.env.VITE_API_URL.replace(/\/api$/, '')}/api/cloudinary/gallery?userId=${user?.id}`);
      // setImages(response.data.data);
      
      setImages(sampleImages);
      setIsLoading(false);
    };
    
    fetchImages();
  }, []);

  // Filter images based on search and active tab
  const filteredImages = images.filter(image => {
    const matchesSearch = searchQuery === '' || 
      (image.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       image.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       image.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesTab = activeTab === 'all' || image.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Process each file
      for (const file of acceptedFiles) {
        // Upload to Cloudinary directly
        const uploadResult = await uploadToCloudinary(file);
        
        // In production, save the reference to your backend
        // const saveResponse = await axios.post(`${import.meta.env.VITE_API_URL.replace(/\/api$/, '')}/api/cloudinary/gallery`, {
        //   userId: user?.id,
        //   public_id: uploadResult.publicId,
        //   url: uploadResult.url,
        //   secure_url: uploadResult.url,
        //   type: 'uploaded',
        //   width: uploadResult.width,
        //   height: uploadResult.height
        // });
        
        // For demo purposes, add to local state
        const newImage: GalleryImage = {
          id: Date.now().toString(),
          userId: user?.id || 'guest',
          url: uploadResult.url,
          secure_url: uploadResult.url,
          public_id: uploadResult.publicId,
          title: file.name.split('.')[0],
          tags: ['uploaded'],
          createdAt: new Date().toISOString(),
          type: 'uploaded',
          width: uploadResult.width || 800,
          height: uploadResult.height || 600
        };
        
        setImages(prev => [newImage, ...prev]);
      }
      
      toast.success(`${acceptedFiles.length} image${acceptedFiles.length > 1 ? 's' : ''} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [user?.id]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  // Handle image selection
  const toggleImageSelection = (id: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedImages(newSelected);
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedImages(new Set());
  };

  // Delete selected images
  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedImages.size} image${selectedImages.size > 1 ? 's' : ''}?`);
    if (!confirmed) return;
    
    setIsLoading(true);
    
    try {
      // In production, delete from backend/Cloudinary
      // await Promise.all(
      //   Array.from(selectedImages).map(id => 
      //     axios.delete(`${import.meta.env.VITE_API_URL.replace(/\/api$/, '')}/api/cloudinary/gallery/${id}`)
      //   )
      // );
      
      // For demo, just remove from local state
      setImages(images.filter(image => !selectedImages.has(image.id)));
      setSelectedImages(new Set());
      
      toast.success(`${selectedImages.size} image${selectedImages.size > 1 ? 's' : ''} deleted`);
    } catch (error) {
      console.error('Error deleting images:', error);
      toast.error('Failed to delete images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use image in post
  const useInPost = (image: GalleryImage) => {
    navigate('/dashboard/post', { 
      state: { image: image.secure_url } 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Gallery</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your LinkedIn post images
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Your Images</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `${filteredImages.length} images available`}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search images..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
              
              {viewMode === 'grid' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGridSize(gridSize === 'small' ? 'large' : 'small')}
                  className="h-8"
                >
                  {gridSize === 'small' ? 'Larger' : 'Smaller'}
                </Button>
              )}
            </div>
          </CardHeader>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <CardContent className="pt-0">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Images</TabsTrigger>
                <TabsTrigger value="ai-generated">AI Generated</TabsTrigger>
                <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
              </TabsList>
              
              {/* Upload dropzone */}
              <div 
                {...getRootProps()} 
                className={`mb-6 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <input {...getInputProps()} />
                {isUploading ? (
                  <div className="py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm">Uploading images...</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm mb-1">
                      {isDragActive ? 'Drop the images here' : 'Drag & drop images here, or click to select files'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: JPG, PNG, GIF, WEBP (up to 5MB)
                    </p>
                  </>
                )}
              </div>
              
              {/* Selection actions */}
              {selectedImages.size > 0 && (
                <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-between">
                  <span className="text-sm">
                    {selectedImages.size} image{selectedImages.size > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={clearSelection}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="destructive" onClick={deleteSelectedImages}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
              
              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No images found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                      {searchQuery ? 'Try a different search term or clear your search.' : 'Upload images or generate some with AI to get started.'}
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Images
                    </Button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className={`grid gap-4 ${gridSize === 'small' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
                    {filteredImages.map((image) => (
                      <div
                        key={image.id}
                        className={`relative group rounded-lg overflow-hidden border ${
                          selectedImages.has(image.id) ? 'ring-2 ring-primary border-primary' : ''
                        }`}
                      >
                        <div className="aspect-square relative">
                          <img
                            src={image.secure_url}
                            alt={image.title || 'Gallery image'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                className="rounded-full h-8 w-8 p-0"
                                onClick={() => useInPost(image)}
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                className="rounded-full h-8 w-8 p-0"
                                onClick={() => toggleImageSelection(image.id)}
                              >
                                {selectedImages.has(image.id) 
                                  ? <Check className="h-4 w-4" /> 
                                  : <Plus className="h-4 w-4" />
                                }
                              </Button>
                            </div>
                          </div>
                        </div>
                        {gridSize === 'large' && (
                          <div className="p-2">
                            <h4 className="font-medium text-sm truncate">{image.title || 'Untitled'}</h4>
                            <p className="text-xs text-gray-500">{new Date(image.createdAt).toLocaleDateString()}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-sm">
                                {image.type === 'ai-generated' ? 'AI' : 'Uploaded'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredImages.map((image) => (
                      <div
                        key={image.id}
                        className={`flex items-center p-2 rounded-lg border ${
                          selectedImages.has(image.id) ? 'bg-primary/5 border-primary' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden mr-4">
                          <img
                            src={image.secure_url}
                            alt={image.title || 'Gallery image'}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-sm">{image.title || 'Untitled'}</h4>
                          <p className="text-xs text-gray-500">
                            {new Date(image.createdAt).toLocaleDateString()} · 
                            {image.type === 'ai-generated' ? ' AI Generated' : ' Uploaded'}
                          </p>
                          {image.tags && image.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {image.tags.map((tag, i) => (
                                <span key={i} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => useInPost(image)}>
                            Use
                          </Button>
                          <Button 
                            variant={selectedImages.has(image.id) ? 'secondary' : 'outline'} 
                            size="sm"
                            onClick={() => toggleImageSelection(image.id)}
                          >
                            {selectedImages.has(image.id) ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="ai-generated" className="mt-0">
                {/* Same structure as "all" tab but filtered for AI images */}
                {/* Content similar to above, filtered for AI-generated images */}
              </TabsContent>
              
              <TabsContent value="uploaded" className="mt-0">
                {/* Same structure as "all" tab but filtered for uploaded images */}
                {/* Content similar to above, filtered for uploaded images */}
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
              {!isLoading && (
                <>
                  Showing {filteredImages.length} of {images.length} images
                </>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/ai-writer')}>
              Generate More Images
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ImageGalleryPage; 