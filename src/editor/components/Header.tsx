import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportSlideToPng, exportSlideAsPdf, exportCarouselAsPdf } from '../utils/export';
import { createCarousel } from '../utils/api';
import { useKonvaCarousel } from '../contexts/KonvaCarouselContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  ChevronDown, 
  FileImage, 
  FileText, 
  Linkedin,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Header = () => {
  const { slides, currentSlideIndex } = useKonvaCarousel();
  const currentSlide = slides[currentSlideIndex];
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const [carouselTitle, setCarouselTitle] = useState('My LinkedIn Carousel');
  const [carouselDescription, setCarouselDescription] = useState('A carousel created with BrandOut');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Check for pending carousel data saved during login redirect
  useEffect(() => {
    const pendingCarouselData = localStorage.getItem('pending_carousel_data');
    if (pendingCarouselData) {
      try {
        const parsedData = JSON.parse(pendingCarouselData);
        if (parsedData.title) {
          setCarouselTitle(parsedData.title);
        }
        if (parsedData.description) {
          setCarouselDescription(parsedData.description);
        }
      } catch (error) {
        console.error("Error parsing pending carousel data:", error);
      }
    }
  }, []);

  const handleGoBack = () => {
    navigate('/dashboard/request-carousel');
  };

  const handleSaveToBackend = async () => {
    if (slides.length === 0) {
      toast.error("Please create at least one slide before saving");
      return;
    }

    // Validate authentication
    if (!isAuthenticated || !token) {
      toast.error("Please log in to save your carousel");
      // Save current state to localStorage for later
      try {
        localStorage.setItem('pending_carousel_data', JSON.stringify({
          title: carouselTitle,
          description: carouselDescription,
          slides
        }));
        toast.info("Your carousel data has been temporarily saved");
      } catch (error) {
        console.error('Error saving carousel data to localStorage:', error);
      }
      
      // Use absolute path for navigation
      navigate('/', { state: { returnTo: '/editor' } });
      return;
    }

    // Check if token is valid
    const authMethod = localStorage.getItem('auth-method');
    // Use LinkedIn token for carousel API
    const linkedinToken = localStorage.getItem('linkedin-login-token');
    
    // If there's a specific token based on auth method, use that
    if (authMethod && linkedinToken) {
      // Store token directly for the carousel API to use
      localStorage.setItem('token', linkedinToken);
    }

    setIsSaving(true);
    try {
      const savedCarousel = await createCarousel(
        carouselTitle,
        carouselDescription,
        slides
      );
      
      // Clear any pending carousel data
      localStorage.removeItem('pending_carousel_data');
      
      toast.success("Your carousel has been saved to your account");
      
      // Navigate to the My Carousels page - use the full path
      window.location.href = '/dashboard/my-carousels';
    } catch (error) {
      console.error('Error saving carousel:', error);
      
      if (error.response && error.response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
      
        // Clear any invalid tokens
        localStorage.removeItem('token');
        
        // Save the carousel data for later
        localStorage.setItem('pending_carousel_data', JSON.stringify({
          title: carouselTitle,
          description: carouselDescription,
          slides
        }));
        
        toast.info("Your carousel data has been temporarily saved");
        navigate('/', { state: { returnTo: '/editor' } });
    } else {
        toast.error("There was a problem saving your carousel. Please try again.");
      }
    } finally {
      setIsSaving(false);
      setShowSaveDialog(false);
    }
  };

  const handleShareToLinkedIn = () => {
    // This would integrate with LinkedIn API in a real implementation
    toast.info("LinkedIn sharing feature is coming soon");
  };
  
  const handleDownloadAllSlides = async () => {
    try {
      toast.info("Creating PDF with all slides");
      
      // Call the PDF export function without parameters
      await exportCarouselAsPdf();
      
      toast.success(`Successfully exported ${slides.length} slides as PDF`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export slides as PDF");
    }
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={handleGoBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <img 
            src="/BrandOut.svg" 
            alt="BrandOut" 
            className="h-6 w-auto"
          />
          <span className="text-lg font-semibold text-primary">BrandOut</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {slides.length > 0 && currentSlide && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSaveDialog(true)} 
              className="gap-2"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShareToLinkedIn} className="gap-2">
              <Linkedin className="h-4 w-4" />
              Share to LinkedIn
            </Button>
            
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => exportSlideToPng(currentSlide.id)} className="gap-2 cursor-pointer">
                  <FileImage className="h-4 w-4" />
                  Current Slide as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportSlideAsPdf(currentSlide.id)} className="gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  Current Slide as PDF
              </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDownloadAllSlides} className="gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  All Slides as PDF
              </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Export as LinkedIn-ready images coming soon")} className="gap-2 cursor-pointer">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn-ready Images
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </>
        )}
        
        <Button variant="default" size="sm" className="bg-primary text-white hover:bg-primary/90">
          Publish
        </Button>
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Carousel</DialogTitle>
            <DialogDescription>
              Enter details for your carousel before saving it to your account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={carouselTitle}
                onChange={(e) => setCarouselTitle(e.target.value)}
                placeholder="Enter carousel title"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={carouselDescription}
                onChange={(e) => setCarouselDescription(e.target.value)}
                placeholder="Enter carousel description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSaveDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveToBackend}
              disabled={isSaving || !carouselTitle.trim()}
              className="gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Carousel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
