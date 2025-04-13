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
  ChevronsRight,
  PlusCircle,
  ChevronDown,
  List
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
  const sampleImages: GalleryImage[] = [];

  // Initialize with sample data
  useEffect(() => {
    // In production, this would fetch from API
    const fetchImages = async () => {
      setIsLoading(true);
      
      // Get images from local storage
      try {
        const storedImages = localStorage.getItem('cloudinary_gallery_images');
        if (storedImages) {
          const parsedImages = JSON.parse(storedImages) as CloudinaryImage[];
          const galleryImages = parsedImages.map(img => ({
            id: img.id || img.public_id,
            userId: user?.id || 'guest',
            url: img.url,
            secure_url: img.secure_url,
            public_id: img.public_id,
            prompt: img.title,
            title: img.title || 'Untitled',
            tags: img.tags || [],
            createdAt: img.created_at || new Date().toISOString(),
            type: img.type as 'ai-generated' | 'uploaded',
            width: img.width || 800,
            height: img.height || 600
          }));
          setImages(galleryImages);
        }
      } catch (error) {
        console.error('Error loading gallery images:', error);
        toast.error('Failed to load images');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchImages();
  }, [user?.id]);

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
        // const saveResponse = await axios.post(`${import.meta.env.VITE_API_URL}/cloudinary/gallery`, {
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
      //     axios.delete(`${import.meta.env.VITE_API_URL}/cloudinary/gallery/${id}`)
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

  // Delete single image
  const deleteImage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this image? This cannot be undone.")) {
      // Remove from state
      setImages(images.filter(img => img.id !== id));
      
      // Remove from selected images if it was selected
      if (selectedImages.has(id)) {
        const newSelection = new Set(selectedImages);
        newSelection.delete(id);
        setSelectedImages(newSelection);
      }
      
      // Remove from localStorage
      const storedImages = JSON.parse(localStorage.getItem('cloudinary_gallery_images') || '[]');
      const updatedImages = storedImages.filter((img: any) => img.id !== id);
      localStorage.setItem('cloudinary_gallery_images', JSON.stringify(updatedImages));
      
      toast({
        title: "Image deleted",
        description: "The image has been removed from your gallery.",
      });
    }
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
                  <div className={`grid gap-4 ${
                    gridSize === 'small' 
                      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  }`}>
                    {filteredImages.map(image => (
                      <div 
                        key={image.id} 
                        className={`group relative overflow-hidden border border-border hover:border-primary transition-colors ${
                          selectedImages.has(image.id) ? 'ring-2 ring-primary ring-offset-2' : ''
                        } rounded-md`}
                      >
                        <div 
                          className={`cursor-pointer ${
                            viewMode === 'grid' 
                              ? 'aspect-square'
                              : 'aspect-[16/9]'
                          } bg-gray-50 dark:bg-gray-900 flex items-center justify-center`}
                          onClick={() => toggleImageSelection(image.id)}
                        >
                          <img 
                            src={image.secure_url} 
                            alt={image.title || 'Gallery image'} 
                            className="max-w-full max-h-full object-contain"
                            style={{ padding: '12px' }}
                          />
                        </div>
                        
                        {/* Info bar */}
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">
                                {image.title || 'Untitled Image'}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {new Date(image.createdAt).toLocaleDateString()} · {image.type}
                              </p>
                            </div>
                            <div className="flex gap-1 mt-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => useInPost(image)}
                              >
                                <PlusCircle className="h-3.5 w-3.5" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => window.open(image.secure_url, '_blank')}
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>

                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteImage(image.id);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Tags */}
                          {image.tags && image.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {image.tags.slice(0, 2).map((tag, index) => (
                                <span 
                                  key={index}
                                  className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {image.tags.length > 2 && (
                                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                  +{image.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
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
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300"
                            onClick={() => deleteImage(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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