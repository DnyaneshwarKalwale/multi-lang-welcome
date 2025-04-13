import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadToCloudinaryDirect, CloudinaryImage } from '@/utils/cloudinaryDirectUpload';

interface ImageUploaderProps {
  onUploadComplete?: (image: CloudinaryImage) => void;
  maxSize?: number; // in bytes
  className?: string;
  folder?: string;
  tags?: string[];
  showPreview?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = '',
  folder = 'linkedin_uploads',
  tags = [],
  showPreview = true
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Generate preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Clean up previous preview if exists
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, []);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxSize,
    multiple: false
  });

  // Clear selected file
  const handleClearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
  };

  // Upload the file
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsUploading(true);

    try {
      const uploadResult = await uploadToCloudinaryDirect(selectedFile, {
        folder,
        tags,
        type: 'uploaded'
      });

      toast.success('Image uploaded successfully');
      
      // Clear the form
      handleClearFile();
      
      // Call callback if provided
      if (onUploadComplete) {
        onUploadComplete(uploadResult);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'
          } hover:border-primary cursor-pointer`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm mb-1">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
          </p>
          <p className="text-xs text-gray-500">
            Supports: JPG, PNG, GIF, WEBP (up to {Math.round(maxSize / (1024 * 1024))}MB)
          </p>
        </div>
      ) : (
        <>
          {showPreview && preview && (
            <div className="relative mb-4">
              <img
                src={preview}
                alt="Preview"
                className="max-h-[300px] w-auto mx-auto rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleClearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="flex-1 text-sm truncate">
              {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearFile}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUpload}
              disabled={isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageUploader; 