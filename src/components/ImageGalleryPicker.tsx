import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Folder, Upload, Image as ImageIcon, Loader2, Check, X } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { getGalleryImages, CloudinaryImage } from '@/utils/cloudinaryDirectUpload';

interface ImageGalleryPickerProps {
  onSelectImage: (image: CloudinaryImage) => void;
  triggerButton?: React.ReactNode;
  defaultOpen?: boolean;
}

const ImageGalleryPicker: React.FC<ImageGalleryPickerProps> = ({
  onSelectImage,
  triggerButton,
  defaultOpen = false
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<CloudinaryImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<CloudinaryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('gallery');
  
  // Load images when dialog opens
  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open]);
  
  // Filter images when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredImages(images);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = images.filter(image => 
        (image.title && image.title.toLowerCase().includes(query)) || 
        (image.tags && image.tags.some(tag => tag.toLowerCase().includes(query)))
      );
      setFilteredImages(filtered);
    }
  }, [searchQuery, images]);
  
  // Load images from gallery
  const loadImages = () => {
    setIsLoading(true);
    try {
      const galleryImages = getGalleryImages();
      setImages(galleryImages);
      setFilteredImages(galleryImages);
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle image selection
  const handleSelectImage = (image: CloudinaryImage) => {
    setSelectedImage(image);
  };
  
  // Handle image upload complete
  const handleUploadComplete = (image: CloudinaryImage) => {
    // Add to local images list
    setImages(prevImages => [image, ...prevImages]);
    setFilteredImages(prevImages => [image, ...prevImages]);
    
    // Auto-select the uploaded image
    setSelectedImage(image);
    
    // Switch to gallery tab
    setActiveTab('gallery');
  };
  
  // Confirm selection
  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Select Image
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Image Gallery</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="gallery" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[300px] mb-4">
            <TabsTrigger value="gallery" className="gap-2">
              <Folder className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search images..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
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
                <Button onClick={() => setActiveTab('upload')}>
                  Upload Image
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${
                        selectedImage?.id === image.id ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <div className="aspect-square relative bg-gray-50 dark:bg-gray-900">
                        <img
                          src={image.secure_url}
                          alt={image.title || 'Gallery image'}
                          className="absolute inset-0 m-auto max-w-full max-h-full object-contain"
                          style={{ padding: '4px' }}
                        />
                        {selectedImage?.id === image.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-white rounded-full p-1">
                              <Check className="h-5 w-5" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-1 text-xs truncate text-center">
                        {image.title || 'Untitled'}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="py-4">
              <ImageUploader 
                onUploadComplete={handleUploadComplete}
                folder="linkedin_gallery"
                tags={['linkedin', 'selected']}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedImage}
          >
            Select Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryPicker; 