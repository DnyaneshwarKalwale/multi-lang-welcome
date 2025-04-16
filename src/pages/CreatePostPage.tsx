import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ImageIcon, 
  MessageSquare, 
  Clock, 
  Calendar, 
  ChevronDown, 
  PlusCircle, 
  FileText, 
  PanelLeftClose, 
  PanelLeftOpen,
  Sparkles,
  BarChart,
  ThumbsUp,
  Share2,
  Forward,
  ArrowRightFromLine,
  Hash,
  Wand2,
  Users,
  MessageCircle,
  Folder,
  BarChart4,
  X,
  Globe,
  Linkedin,
  Eye,
  Check,
  Loader2,
  AlertCircle,
  ArrowUpCircle,
  BarChart2,
  BookTemplate,
  Brain,
  Clipboard,
  Copy,
  Edit,
  Layers,
  Megaphone,
  Plus,
  RefreshCw,
  Save,
  Target,
  Trash,
  Trash2,
  Upload,
  UserRound,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { SliderVariant } from '@/types/LinkedInPost';
import ImageGalleryPicker from '@/components/ImageGalleryPicker';
import ImageUploader from '@/components/ImageUploader';
import { CloudinaryImage, saveImageToGallery } from '@/utils/cloudinaryDirectUpload';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usePersistentState, useAppState } from '@/contexts/StateContext';
import { linkedInApi } from '@/utils/linkedinApi';
import { tokenManager } from '@/services/api';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from 'axios';

// Extend CloudinaryImage interface to include properties used in the component
interface ExtendedCloudinaryImage extends CloudinaryImage {
  secure_url: string;
  original_filename?: string;
}

const carouselTemplates = [
  {
    id: '1',
    name: '5 Industry Tips',
    description: 'Share 5 valuable tips related to your industry',
    slideCount: 5,
    category: 'listicle' as const
  },
  {
    id: '2',
    name: 'How-To Guide',
    description: 'Step-by-step instructions on accomplishing a task',
    slideCount: 4,
    category: 'how-to' as const
  },
  {
    id: '3',
    name: 'Industry Insights',
    description: 'Share valuable data and insights about your industry',
    slideCount: 3,
    category: 'industry-insights' as const
  },
  {
    id: '4',
    name: 'Case Study',
    description: 'Present a success story with results',
    slideCount: 4,
    category: 'case-study' as const
  },
  {
    id: '5',
    name: 'Before & After',
    description: 'Show the transformation process',
    slideCount: 2,
    category: 'educational' as const
  }
];

const sliderOptions: SliderVariant[] = [
  'basic',
  'pagination',
  'gallery',
  'looped',
  'autoplay',
  'responsive',
  'grid',
  'coverflow',
  'fade',
  'vertical',
  'thumbs',
  'parallax'
];

// Define an interface for the location state
interface LocationState {
  content?: string;
  hashtags?: string[];
  image?: string;
  openScheduleDialog?: boolean;
  scheduledDate?: string;
  scheduleTime?: string;
}

// Inline carousel preview component
const InlineCarouselPreview: React.FC<{ slides: {id: string, content: string, imageUrl?: string, cloudinaryImage?: ExtendedCloudinaryImage}[], variant: SliderVariant }> = ({ slides, variant }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(variant === 'autoplay');
  
  useEffect(() => {
    let timer: number | null = null;
    if (isAutoplay) {
      timer = window.setInterval(() => {
        nextSlide();
      }, 3000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoplay, currentSlide]);
  
  const nextSlide = () => {
    setCurrentSlide(prev => prev === slides.length - 1 ? 0 : prev + 1);
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1);
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  const getContainerClass = () => {
    let baseClass = "relative rounded-lg overflow-hidden";
    switch (variant) {
      case 'grid': return `${baseClass} grid grid-cols-2 gap-1`;
      case 'coverflow': return `${baseClass} perspective-1000`;
      case 'fade': return `${baseClass} fade-transition`;
      case 'vertical': return `${baseClass} flex flex-col gap-1`;
      default: return baseClass;
    }
  };
  
  const getSlideVariants = () => {
    switch (variant) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'coverflow':
        return {
          hidden: { rotateY: 45, scale: 0.8, opacity: 0.5, z: -200 },
          visible: { rotateY: 0, scale: 1, opacity: 1, z: 0 },
          exit: { rotateY: -45, scale: 0.8, opacity: 0.5, z: -200 }
        };
      case 'vertical':
        return {
          hidden: { y: 50, opacity: 0 },
          visible: { y: 0, opacity: 1 },
          exit: { y: -50, opacity: 0 }
        };
      default:
        return {
          hidden: { x: 300, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 }
        };
    }
  };
  
  const getTransitionSettings = () => {
    if (variant === 'coverflow') {
      return { type: "spring", stiffness: 300, damping: 30 };
    }
    return { duration: 0.5, ease: "easeInOut" };
  };
  
  return (
    <div className="carousel-container mb-3">
      <div className={getContainerClass()}>
        {variant !== 'grid' && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={getSlideVariants()}
                transition={getTransitionSettings()}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {slides[currentSlide]?.cloudinaryImage?.secure_url ? (
                  <div className="relative">
                    <img 
                      src={slides[currentSlide].cloudinaryImage?.secure_url} 
                      alt={`Slide ${currentSlide + 1}`}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="bg-gradient-to-t from-black/70 via-black/50 to-transparent absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-sm font-medium">{slides[currentSlide].content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center p-6">
                    <p className="text-sm text-center text-gray-800">{slides[currentSlide].content}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation controls */}
            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10">
              <button 
                className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow-sm"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
              <button 
                className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow-sm"
                onClick={nextSlide}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Pagination dots */}
            {variant === 'pagination' && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
                {slides.map((_, index) => (
                  <button 
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${index === currentSlide ? 'bg-primary' : 'bg-gray-300'}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        {variant === 'grid' && (
          <div className="grid grid-cols-2 gap-1">
            {slides.map((slide, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {slide.cloudinaryImage?.secure_url ? (
                  <div className="relative">
                    <img 
                      src={slide.cloudinaryImage.secure_url} 
                      alt={`Slide ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="bg-gradient-to-t from-black/70 via-black/50 to-transparent absolute bottom-0 left-0 right-0 p-2 text-white">
                      <p className="text-xs font-medium">{slide.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 aspect-square flex items-center justify-center p-3">
                    <p className="text-xs text-center text-gray-800">{slide.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Slide counter */}
      {variant !== 'grid' && (
        <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
          <span>{currentSlide + 1} / {slides.length}</span>
          {variant === 'autoplay' && (
            <button 
              className="text-xs flex items-center gap-1"
              onClick={() => setIsAutoplay(!isAutoplay)}
            >
              {isAutoplay ? (
                <>
                  <Pause className="w-3 h-3" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" /> Play
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const CreatePostPage: React.FC = () => {
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearState } = useAppState();
  
  // Add state for tracking save status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveStatusTimeoutRef = React.useRef<number | null>(null);
  
  // Add state for draft saving
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // Add CSS for preview pulse animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .preview-pulse {
        transition: all 0.3s ease;
        box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.3);
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4); }
        70% { box-shadow: 0 0 0 6px rgba(var(--primary-rgb), 0); }
        100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Use persistent state for all form fields
  const [content, setContent] = usePersistentState('createPost.content', '');
  const [showSidebar, setShowSidebar] = usePersistentState('createPost.showSidebar', true);
  const [activeTab, setActiveTab] = usePersistentState('createPost.activeTab', 'text');
  const [selectedTemplate, setSelectedTemplate] = usePersistentState<string | null>('createPost.selectedTemplate', null);
  const [sliderType, setSliderType] = usePersistentState<SliderVariant>('createPost.sliderType', 'basic');
  const [slides, setSlides] = usePersistentState<{id: string, content: string, imageUrl?: string, cloudinaryImage?: ExtendedCloudinaryImage}[]>('createPost.slides', [
    { id: '1', content: 'Slide 1: Introduction to your topic' },
    { id: '2', content: 'Slide 2: Key point or insight #1' },
    { id: '3', content: 'Slide 3: Key point or insight #2' },
  ]);
  
  const [hashtags, setHashtags] = usePersistentState<string[]>('createPost.hashtags', [
    'LinkedInTips', 'ContentCreation', 'ProfessionalDevelopment'
  ]);
  
  const [newHashtag, setNewHashtag] = useState('');
  const [aiGeneratedImage, setAiGeneratedImage] = usePersistentState<string | null>('createPost.aiGeneratedImage', null);
  const [postImage, setPostImage] = usePersistentState<ExtendedCloudinaryImage | null>('createPost.postImage', null);
  
  const [isPollActive, setIsPollActive] = usePersistentState('createPost.isPollActive', false);
  const [pollOptions, setPollOptions] = usePersistentState<string[]>('createPost.pollOptions', ['', '']);
  const [pollDuration, setPollDuration] = usePersistentState('createPost.pollDuration', 1); // days
  
  // Article states
  const [hasArticle, setHasArticle] = usePersistentState('createPost.hasArticle', false);
  const [articleUrl, setArticleUrl] = usePersistentState('createPost.articleUrl', '');
  const [articleTitle, setArticleTitle] = usePersistentState('createPost.articleTitle', '');
  const [articleDescription, setArticleDescription] = usePersistentState('createPost.articleDescription', '');
  
  // Document states
  const [documentFile, setDocumentFile] = usePersistentState<File | null>('createPost.documentFile', null);
  const [documentDescription, setDocumentDescription] = usePersistentState('createPost.documentDescription', '');
  
  // LinkedIn posting states
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingPlatform, setPublishingPlatform] = useState<'linkedin' | 'facebook'>('linkedin');
  const [visibility, setVisibility] = usePersistentState<'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN'>('createPost.visibility', 'PUBLIC');
  
  // Scheduling states
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
  });
  const [scheduleTime, setScheduleTime] = useState('09:00');
  
  // Initialize with data from location state (if available)
  useEffect(() => {
    if (locationState) {
      if (locationState.content) {
        setContent(locationState.content);
      }
      
      if (locationState.hashtags && locationState.hashtags.length > 0) {
        setHashtags(locationState.hashtags);
      }
      
      if (locationState.image) {
        setAiGeneratedImage(locationState.image);
        setActiveTab('carousel'); // Switch to carousel tab if image is provided
      }
      
      // Check for scheduledDate and scheduleTime in location state
      if (locationState.scheduledDate) {
        try {
          const date = new Date(locationState.scheduledDate);
          setScheduledDate(date);
          console.log('Set scheduled date from location state:', date);
        } catch (err) {
          console.error('Error parsing scheduled date from location state:', err);
        }
      }
      
      if (locationState.scheduleTime) {
        setScheduleTime(locationState.scheduleTime);
        console.log('Set schedule time from location state:', locationState.scheduleTime);
      }
      
      // Open schedule dialog if requested - but only once
      if (locationState.openScheduleDialog) {
        // Create a delay to ensure all state is properly initialized first
        console.log('Opening schedule dialog from location state');
        setTimeout(() => {
          // Check for any required state before opening
          if (postImage === null) {
            // Clear any existing postImage data in localStorage to prevent errors
            localStorage.removeItem('state:createPost.postImage');
          }
          
          // Now it's safe to open the dialog
          setShowScheduleDialog(true);
          console.log('Schedule dialog opened');
        }, 500); // Increased timeout to ensure state is fully loaded
      }
    }
  }, [locationState, setContent, setHashtags, setAiGeneratedImage, setActiveTab, postImage]);
  
  // Helper function to show save indicator
  const showSaveIndicator = () => {
    // Show saving indicator
    setSaveStatus('saving');
    
    // Clear any existing timeout
    if (saveStatusTimeoutRef.current) {
      window.clearTimeout(saveStatusTimeoutRef.current);
    }
    
    // Show saved indicator after a short delay
    setTimeout(() => {
      setSaveStatus('saved');
      
      // Reset status after 2 seconds
      saveStatusTimeoutRef.current = window.setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 500);
  };
  
  const addHashtag = () => {
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag]);
      setNewHashtag('');
      showSaveIndicator();
    }
  };
  
  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
    showSaveIndicator();
  };
  
  const addSlide = () => {
    const newId = (slides.length + 1).toString();
    setSlides([...slides, { id: newId, content: `Slide ${newId}: Add your content here` }]);
  };
  
  const updateSlide = (id: string, newContent: string) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, content: newContent } : slide
    ));
  };
  
  const removeSlide = (id: string) => {
    if (slides.length > 1) {
      setSlides(slides.filter(slide => slide.id !== id));
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  const applyTemplate = (templateId: string) => {
    const template = carouselTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      
      // Generate new slides based on template
      const newSlides = Array.from({ length: template.slideCount }, (_, i) => {
        const slideNumber = i + 1;
        let slideContent = '';
        
        if (template.category === 'listicle') {
          slideContent = slideNumber === 1 
            ? `${template.name}` 
            : `Tip #${slideNumber-1}: [Your tip here]`;
        } else if (template.category === 'how-to') {
          slideContent = slideNumber === 1 
            ? `How to [Accomplish Something]` 
            : `Step ${slideNumber-1}: [Step description]`;
        } else if (template.category === 'case-study') {
          if (slideNumber === 1) slideContent = 'Challenge: [Describe the problem]';
          else if (slideNumber === 2) slideContent = 'Solution: [What was implemented]';
          else if (slideNumber === 3) slideContent = 'Process: [How it was done]';
          else slideContent = 'Results: [Outcomes and benefits]';
        } else {
          slideContent = `Slide ${slideNumber}: [Add content here]`;
        }
        
        return { id: slideNumber.toString(), content: slideContent };
      });
      
      setSlides(newSlides);
    }
  };
  
  // Handle image selected from gallery
  const handleImageSelected = (image: CloudinaryImage) => {
    setPostImage(image);
    // If it's an AI-generated image, automatically switch to text tab
    if (image.type === 'ai-generated') {
      setActiveTab('text');
    }
    
    // Add visual feedback to preview
    setTimeout(() => {
      const previewEl = document.querySelector('.preview-section');
      if (previewEl) {
        previewEl.classList.add('preview-pulse');
        setTimeout(() => previewEl.classList.remove('preview-pulse'), 500);
      }
    }, 100);
    
    showSaveIndicator();
    toast.success('Image selected for your post');
  };

  // Handle direct image upload complete
  const handleUploadComplete = (image: CloudinaryImage) => {
    setPostImage(image);
    
    // Add visual feedback to preview
    setTimeout(() => {
      const previewEl = document.querySelector('.preview-section');
      if (previewEl) {
        previewEl.classList.add('preview-pulse');
        setTimeout(() => previewEl.classList.remove('preview-pulse'), 500);
      }
    }, 100);
    
    showSaveIndicator();
    toast.success('Image uploaded and added to your post');
  };
  
  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
      showSaveIndicator();
    } else {
      toast.error('Maximum 4 options allowed for LinkedIn polls');
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
      showSaveIndicator();
    } else {
      toast.error('Poll requires at least 2 options');
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
    showSaveIndicator();
  };
  
  // Function to handle LinkedIn reconnection
  const handleReconnectLinkedIn = () => {
    // Get the backend URL from environment variable or fallback to Render deployed URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Store current URL in localStorage to redirect back after LinkedIn connection
    localStorage.setItem('redirectAfterAuth', '/dashboard/post');
    
    // Redirect to LinkedIn OAuth endpoint
    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
  };
  
  // Function to publish post directly to LinkedIn
  const publishToLinkedIn = async () => {
    try {
      setIsPublishing(true);
      
      // Validate content
      if (!content.trim()) {
        toast.error('Please add some content to your post');
        setIsPublishing(false);
        return;
      }
      
      // Check for LinkedIn authentication
      const token = localStorage.getItem('linkedin-login-token');
      
      if (!token) {
        toast.error(`LinkedIn authentication required. Please login with LinkedIn to post content.`);
        setIsPublishing(false);
        
        // Show a reconnect option
        if (window.confirm('Would you like to connect your LinkedIn account now?')) {
          handleReconnectLinkedIn();
        }
        return;
      }
      
      let response;
      
      // Handle different post types
      if (isPollActive && pollOptions.filter(opt => opt.trim()).length >= 2) {
        // Publish as poll
        const filteredOptions = pollOptions.filter(opt => opt.trim());
        response = await linkedInApi.createPollPost(content, filteredOptions, pollDuration);
        toast.success('Poll published to LinkedIn successfully!');
      } else if (activeTab === 'carousel' && slides.length > 0) {
        // Handle carousel post - with slides from state
        console.log('Publishing LinkedIn carousel post with slides:', slides);
        
        try {
          toast.info('Preparing carousel for LinkedIn...');
          
          // Check if all slides have images
          const allSlidesHaveImages = slides.every(slide => slide.cloudinaryImage?.secure_url);
          
          if (!allSlidesHaveImages) {
            // Process as document if not all slides have images
            toast.warning('Some slides are missing images. Publishing as a document instead.');
            
            // Create a combined document from slides
            const slideContent = slides.map(slide => slide.content).join('\n\n');
            const fullContent = `${content}\n\n${slideContent}`;
            
            response = await linkedInApi.createTextPost(fullContent, visibility);
            toast.success('Carousel content published as text successfully!');
          } else {
            // Transform slides to the format expected by createCarouselPost
            const transformedSlides = slides.map(slide => ({
              content: slide.content,
              imageUrl: slide.cloudinaryImage?.secure_url,
              cloudinaryImage: slide.cloudinaryImage
            }));
            
            // Check if the method exists before calling it
            if (typeof linkedInApi.createCarouselPost === 'function') {
              // Use the new createCarouselPost method
              toast.info('Creating LinkedIn post with carousel content...');
              
              response = await linkedInApi.createCarouselPost(
                content,
                transformedSlides,
                visibility
              );
              
              toast.success('Carousel content published to LinkedIn! Due to LinkedIn API limitations, the post includes the first image with all slide text.');
              toast.info('To create true carousel posts with multiple images, you need to post directly through the LinkedIn app.');
            } else {
              // Fallback to using the first image if the method doesn't exist
              const firstImage = slides[0].cloudinaryImage;
              
              if (!firstImage?.secure_url) {
                toast.error('First slide image URL is missing');
                setIsPublishing(false);
                return;
              }
              
              // Add slide descriptions to content
              const slideDescriptions = slides.map(slide => slide.content).join('\n\n');
              const fullContent = `${content}\n\n${slideDescriptions}`;
              
              response = await linkedInApi.createCloudinaryImagePost(
                fullContent,
                firstImage.secure_url,
                firstImage.original_filename || 'carousel-image',
                'Carousel slide 1',
                visibility
              );
              
              toast.success('Carousel content published as a single post with the first image.');
              toast.info('LinkedIn API limitations prevent creating true carousel posts with multiple images.');
            }
            
            console.log('LinkedIn carousel post response:', response);
          }
        } catch (carouselError: any) {
          console.error('Error publishing LinkedIn carousel post:', carouselError);
          
          // Fallback to text post with carousel content
          try {
            const slideContent = slides.map(slide => slide.content).join('\n\n');
            const fullContent = `${content}\n\n${slideContent}`;
            
            response = await linkedInApi.createTextPost(fullContent, visibility);
            toast.success('Carousel content published as text successfully!');
          } catch (textError) {
            console.error('Even text fallback failed:', textError);
            throw textError; // Re-throw to be caught by outer catch
          }
        }
      } else if (activeTab === 'document' && documentFile) {
        // Handle document post
        console.log('Publishing LinkedIn post with document:', documentFile);
        
        try {
          toast.info('Uploading document to LinkedIn...');
          
          // If we have a document description, add it to the content
          let fullContent = content;
          if (documentDescription) {
            fullContent = `${content}\n\n${documentDescription}`;
          }
          
          // Use the createDocumentPost method if it exists
          if (typeof linkedInApi.createDocumentPost === 'function') {
            response = await linkedInApi.createDocumentPost(
              fullContent,
              documentFile,
              documentFile.name || 'document',
              visibility
            );
          } else {
            // Fallback to text post with document information
            fullContent = `${fullContent}\n\nDocument: ${documentFile.name}`;
            response = await linkedInApi.createTextPost(fullContent, visibility);
          }
          
          console.log('LinkedIn document post response:', response);
          toast.success('Document post published to LinkedIn successfully!');
        } catch (documentError: any) {
          console.error('Error publishing LinkedIn document post:', documentError);
          
          // Fallback to text post with document information
          try {
            const postWithDocument = `${content}\n\nDocument: ${documentFile.name}`;
            response = await linkedInApi.createTextPost(postWithDocument, visibility);
            toast.success('Document information published as text successfully!');
          } catch (textError) {
            console.error('Even text fallback failed:', textError);
            throw textError; // Re-throw to be caught by outer catch
          }
        }
      } else if (postImage) {
        // Handle image post using Cloudinary image
        console.log('Publishing LinkedIn post with image:', postImage);
        
        // Make sure we have all required image data
        if (!postImage.secure_url) {
          toast.error('Image URL is missing');
          setIsPublishing(false);
          return;
        }
        
        try {
          toast.info('Uploading image to LinkedIn...');
          
          response = await linkedInApi.createCloudinaryImagePost(
            content, 
            postImage.secure_url,
            postImage.original_filename || 'image',
            postImage.original_filename || 'Shared image',
            visibility
          );
          
          console.log('LinkedIn image post response:', response);
          toast.success('Image post published to LinkedIn successfully!');
        } catch (imageError: any) {
          console.error('Error publishing LinkedIn image post:', imageError);
          
          // Check if it's a token expiration issue
          if (imageError.message && imageError.message.includes('authentication expired')) {
            toast.error('Your LinkedIn authentication has expired. Please reconnect your account.');
            
            if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
              handleReconnectLinkedIn();
            }
            setIsPublishing(false);
            return;
          }
          
          // Check for other specific errors
          if (imageError.response && imageError.response.status === 422) {
            toast.error('LinkedIn was unable to process the image. Publishing as text post instead.');
          } else {
            toast.error('Failed to publish image. Publishing as text post instead.');
          }
          
          // Fallback to text post with image URL
          try {
            const imageUrl = postImage.secure_url;
            const imageTitle = postImage.original_filename || 'image';
            const postWithImage = `${content}\n\n${imageTitle}: ${imageUrl}`;
            
            response = await linkedInApi.createTextPost(postWithImage, visibility);
            console.log('LinkedIn text post fallback response:', response);
            toast.success('Post published to LinkedIn as text with image link.');
          } catch (textError) {
            console.error('Even text fallback failed:', textError);
            throw textError; // Re-throw to be caught by outer catch
          }
        }
      } else if (hasArticle && articleUrl) {
        // Handle article post
        console.log('Publishing LinkedIn post with article:', articleUrl);
        response = await linkedInApi.createArticlePost(
          content,
          articleUrl,
          articleTitle || '',
          articleDescription || '',
          visibility
        );
        console.log('LinkedIn article post response:', response);
        toast.success('Article post published to LinkedIn successfully!');
      } else {
        // Simple text post
        console.log('Publishing LinkedIn text post');
        response = await linkedInApi.createTextPost(content, visibility);
        console.log('LinkedIn text post response:', response);
        toast.success('Post published to LinkedIn successfully!');
      }
      
      // Clear the form after successful publishing
      setTimeout(() => {
        // Clear all createPost related state
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('state:createPost.')) {
            localStorage.removeItem(key);
          }
        });
        
        // Redirect to the post library
        navigate('/dashboard/posts', {
          state: { 
            newPost: true,
            postId: response?.id,
            platform: 'linkedin'
          }
        });
      }, 1500);
      
    } catch (error: any) {
      console.error('Error publishing to LinkedIn:', error);
      
      // Look for token expiration errors
      if (error.message && error.message.includes('authentication expired')) {
        toast.error('Your LinkedIn authentication has expired. Please reconnect your account.');
        
        // Show a reconnect option
        if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
          handleReconnectLinkedIn();
        }
        return;
      }
      
      // Provide more specific error messages
      if (error.response) {
        console.error('LinkedIn API error response:', error.response.data);
        
        // Parse common error types
        if (error.response.status === 401) {
          toast.error('Authentication failed. Your LinkedIn token may have expired.');
          // Show a reconnect option
          if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
            handleReconnectLinkedIn();
          }
        } else if (error.response.status === 403) {
          toast.error('Permission denied. You may not have proper LinkedIn permissions.');
        } else if (error.response.status === 404) {
          toast.error('API endpoint not found. The backend service might be unavailable.');
        } else if (error.response.status === 422) {
          toast.error('LinkedIn could not process your request. Please check your content and try again.');
        } else if (error.response.status >= 500) {
          toast.error('LinkedIn server error. Please try again later.');
        } else {
          toast.error(`LinkedIn error: ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // No response received
        toast.error('No response from server. Check your internet connection.');
      } else {
        // Error setting up the request
        toast.error('Failed to publish: ' + error.message);
      }
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Function to save post as draft
  const saveAsDraft = async () => {
    try {
      setIsSavingDraft(true);
      
      // Check if we're editing an existing draft
      const editingDraftId = localStorage.getItem('editingDraftId');
      
      // Create draft data
      const draftId = editingDraftId || `draft_${Date.now()}`;
      const draftData = {
        id: draftId,
        title: 'Draft Post',
        content: content,
        excerpt: content.substring(0, 100) + '...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slides: slides.length > 0 ? slides : [],
        postImage: postImage,
        isPollActive: isPollActive,
        pollOptions: pollOptions.filter(Boolean),
        hashtags: hashtags,
        visibility: visibility,
        provider: 'linkedin',
        status: 'draft',
        date: new Date().toLocaleDateString()
      };
      
      // Save directly to localStorage with the key matching the pattern expected by PostLibraryPage
      localStorage.setItem(draftId, JSON.stringify(draftData));
      
      // Also try to save to backend if possible
      try {
        // Save to backend API - this will only work if the API is connected
        await linkedInApi.createDBPost({
          title: 'Draft Post',
          content: content,
          hashtags: hashtags,
          mediaType: postImage ? 'image' : slides.length > 0 ? 'carousel' : 'none',
          postImage: postImage,
          slides: slides,
          isPollActive: isPollActive,
          pollOptions: pollOptions.filter(Boolean),
          status: 'draft',
          visibility: visibility
        });
      } catch (apiError) {
        // Silently ignore backend API errors since we've already saved to localStorage
        console.log('Note: Draft saved to localStorage only, API save failed:', apiError);
      }
      
      // Clear the editing state
      localStorage.removeItem('editingDraftId');
      
      // Success message
      toast.success('Post saved as draft', {
        description: 'You can find it in your Post Library'
      });
      
      // Navigate to the post library
      navigate('/dashboard/posts', {
        state: { 
          newDraft: true,
          activeTab: 'drafts'
        }
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setIsSavingDraft(false);
    }
  };
  
  // Function to schedule a post
  const schedulePost = async () => {
    try {
      setIsPublishing(true); // Using existing state variable for publishing status
      toast.info('Preparing to schedule your post...');
      
      // Validate required fields
      if (!scheduledDate || !scheduleTime) {
        toast.error('Please select both date and time for scheduling');
        return;
      }
      
      // Validate content based on active tab
      if (activeTab === 'text' && !content.trim()) {
        toast.error('Please add some content to your post');
        return;
      } else if (activeTab === 'carousel' && slides.length === 0) {
        toast.error('Please add at least one slide to your carousel');
        return;
      } else if (activeTab === 'document' && !documentFile) {
        toast.error('Please upload a document');
        return;
      }
      
      // Create a Date object from the scheduled date and time
      const scheduledDateTime = new Date(scheduledDate);
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes);
      
      // Check if the scheduled time is in the past
      if (scheduledDateTime <= new Date()) {
        toast.error('Please select a future date and time');
        return;
      }
      
      // Prepare post data - only include data relevant to the active tab
      const postData: {
        title: string;
        content: string;
        hashtags: string[];
        visibility: string;
        platform: string;
        status: string;
        scheduledTime: string;
        mediaType?: string;
        postImage?: any;
        slides?: any[];
        isPollActive?: boolean;
        pollOptions?: string[];
        pollDuration?: number;
        documentDescription?: string;
      } = {
        title: 'Scheduled Post',
        content: activeTab === 'text' ? content : '',
        hashtags: hashtags,
        visibility: visibility,
        platform: 'linkedin',
        status: 'scheduled',
        scheduledTime: scheduledDateTime.toISOString()
      };
      
      // Only include media data relevant to the selected tab
      if (activeTab === 'text') {
        // For text tab, include postImage if there is one
        if (postImage) {
          postData.postImage = postImage;
          postData.mediaType = 'image';
        } else {
          postData.mediaType = 'none';
        }
        // Explicitly set slides to empty array for text posts
        postData.slides = [];
      } else if (activeTab === 'carousel') {
        // For carousel tab, include the slides
        postData.slides = slides;
        postData.content = content; // Can still have content above carousel
        postData.mediaType = 'carousel';
      } else if (activeTab === 'document') {
        // For document tab
        postData.documentDescription = documentDescription;
        postData.mediaType = 'document';
      }
      
      // Add poll if active
      if (isPollActive) {
        postData.isPollActive = true;
        postData.pollOptions = pollOptions.filter(opt => opt.trim());
        postData.pollDuration = pollDuration;
      }
      
      // Submit to the backend API
      console.log('Scheduling post with data:', postData);
      
      // Check if we're editing an existing scheduled post
      const editingScheduledId = localStorage.getItem('editingScheduledId');
      
      // Use different endpoint depending on whether we're using the local/backend API
      const response = await linkedInApi.createDBPost({
        ...postData,
        status: 'scheduled'
      });
      
      console.log('Schedule response:', response);
      
      if (response && response.success) {
        toast.success('Post scheduled successfully!');
        
        // Clear the editor state
        localStorage.removeItem('editingScheduledId');
        // Clear form data from localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('state:createPost.')) {
            localStorage.removeItem(key);
          }
        });
        
        // Navigate to the post library scheduled tab
        navigate('/dashboard/library', { state: { scheduled: true, activeTab: 'scheduled' } });
      } else {
        toast.error('Failed to schedule post. Please try again.');
      }
    } catch (error: any) {
      console.error('Error scheduling post:', error);
      toast.error('Error scheduling post: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsPublishing(false);
      setShowScheduleDialog(false);
    }
  };
  
  // Test LinkedIn posting with a simple text post
  const testLinkedInPosting = async () => {
    try {
      setIsPublishing(true);
      console.log('Testing LinkedIn connection');
      
      // Check for LinkedIn authentication directly from localStorage
      const token = localStorage.getItem('linkedin-login-token');
      
      if (!token) {
        toast.error(`LinkedIn authentication required. Please login with LinkedIn first.`);
        console.error('LinkedIn token not found');
        setIsPublishing(false);
        
        // Show a reconnect option
        if (window.confirm('Would you like to connect your LinkedIn account now?')) {
          handleReconnectLinkedIn();
        }
        return;
      }
      
      toast.info('LinkedIn token found. Attempting to post...');
      
      // Directly try a test post without running the connection test first
      const testPostContent = 'This is a test post from Scripe. ' + new Date().toISOString();
      const response = await linkedInApi.createTextPost(testPostContent, 'PUBLIC');
      
      console.log('Test post successful:', response);
      toast.success('LinkedIn test post successful! Your account is connected properly.');
      
    } catch (error: any) {
      console.error('LinkedIn test post failed:', error);
      
      // Check for specific token expiration error
      if (error.message && error.message.includes('authentication expired')) {
        toast.error('Your LinkedIn authentication has expired. Please reconnect your account.');
        
        // Show a reconnect option
        if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
          handleReconnectLinkedIn();
        }
        return;
      }
      
      if (error.response) {
        console.error('API response:', error.response.data);
        
        // Check for common error types 
        if (error.response.status === 401) {
          toast.error('Authentication failed. Your LinkedIn token may have expired. Please login again.');
          
          // Show a reconnect option
          if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
            handleReconnectLinkedIn();
          }
        } else if (error.response.status === 403) {
          toast.error('Permission denied. You may not have proper LinkedIn permissions.');
        } else if (error.response.status === 404) {
          toast.error('API endpoint not found. The backend service might be unavailable.');
        } else if (error.response.status >= 500) {
          // Check for token expiration in 500 error
          if (error.response.data && 
              error.response.data.details && 
              error.response.data.details.includes('token has expired')) {
            toast.error('Your LinkedIn token has expired. Please reconnect your account.');
            
            // Show a reconnect option
            if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
              handleReconnectLinkedIn();
            }
          } else {
            toast.error('LinkedIn server error. Please try again later.');
          }
        } else {
          toast.error(`LinkedIn error: ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        toast.error('No response from server. Check your internet connection.');
      } else {
        toast.error('LinkedIn test failed: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Add a handler to close the dialog reliably
  const handleDialogClose = useCallback(() => {
    console.log('Explicitly closing dialog');
    setShowScheduleDialog(false);
  }, []);
  
  // Add a cleanup function to prevent duplicate posts when navigating back without saving
  useEffect(() => {
    // Check if we have a post to create or if we're editing an existing one
    const isEditing = !!localStorage.getItem('editingDraftId') || !!localStorage.getItem('editingScheduledId');
    
    // Function to handle beforeunload event
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content.trim() || slides.some(slide => slide.content.trim())) {
        // Show a confirmation dialog if there's unsaved content
        const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };
    
    // Add the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      // Remove the event listener
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Clean up edit IDs if the user navigates away without saving
      if (!isEditing) {
        localStorage.removeItem('editingDraftId');
        localStorage.removeItem('editingScheduledId');
      }
    };
  }, [content, slides]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-neutral-black">Create LinkedIn Content</h1>
          {saveStatus !== 'idle' && (
            <span className={`text-xs px-2 py-1 rounded-full transition-colors ${
              saveStatus === 'saving' 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your draft? This cannot be undone.")) {
                // Clear all createPost related state
                Object.keys(localStorage).forEach(key => {
                  if (key.startsWith('state:createPost.')) {
                    localStorage.removeItem(key);
                  }
                });
                window.location.reload();
              }
            }}
          >
            <X size={16} />
            Clear Draft
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={saveAsDraft}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FileText size={16} />
                Save as Draft
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200" 
            onClick={() => {
              // Only open the dialog if it's currently closed
              if (!showScheduleDialog) {
                console.log('Opening schedule dialog from button click');
                setShowScheduleDialog(true);
              }
            }}
          >
            <Clock size={16} className="mr-1" />
            Schedule Post
          </Button>
          
          {/* Schedule Dialog */}
          {showScheduleDialog && (
            <Dialog 
              open={true} 
              onOpenChange={(open) => {
                if (!open) handleDialogClose();
              }}
            >
              <DialogContent className="sm:max-w-md" onPointerDownOutside={handleDialogClose}>
                <DialogHeader>
                  <DialogTitle>Schedule LinkedIn Post</DialogTitle>
                  <DialogDescription>
                    Choose when you want this post to be published to LinkedIn
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Date</label>
                      <Input
                        type="date"
                        value={scheduledDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newDate = new Date(e.target.value);
                          // Preserve the time
                          const currentHours = scheduledDate.getHours();
                          const currentMinutes = scheduledDate.getMinutes();
                          newDate.setHours(currentHours, currentMinutes, 0, 0);
                          setScheduledDate(newDate);
                          console.log('Date changed to:', newDate);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Time</label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => {
                          setScheduleTime(e.target.value);
                          // Update the scheduledDate with this time
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const newDate = new Date(scheduledDate);
                          newDate.setHours(hours, minutes, 0, 0);
                          setScheduledDate(newDate);
                          console.log('Time changed to:', e.target.value, 'Updated date:', newDate);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Visibility</label>
                    <Select value={visibility} onValueChange={(value) => setVisibility(value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public - Anyone on LinkedIn</SelectItem>
                        <SelectItem value="CONNECTIONS">Connections only</SelectItem>
                        <SelectItem value="LOGGED_IN">LinkedIn users only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Post Summary</h4>
                    <div className="border rounded p-3 bg-gray-50 dark:bg-gray-900 text-sm">
                      <p className="line-clamp-3">{content || "No content yet"}</p>
                      {postImage && <p className="text-green-600 mt-1">Image: {postImage.secure_url.split('/').pop()}</p>}
                      {isPollActive && <p className="text-blue-600 mt-1">Poll with {pollOptions.filter(o => o.trim()).length} options</p>}
                      <p className="text-blue-600 mt-1">Scheduled for: {scheduledDate.toLocaleDateString()} at {scheduleTime}</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
                  <Button 
                    onClick={() => {
                      schedulePost();
                      handleDialogClose();
                    }} 
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Post
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
          <Button size="sm" className="bg-primary text-white gap-1">
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
            <ArrowRightFromLine size={16} />
            Publish Now
                  </>
                )}
          </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={publishToLinkedIn}
                disabled={isPublishing}
                className="gap-2 cursor-pointer"
              >
                <Linkedin size={16} className="text-blue-600" />
                Publish to LinkedIn
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => toast.info("Twitter integration coming soon!")}
                className="gap-2 cursor-pointer text-muted-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M14.258 10.152 23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246z"/></svg>
                Publish to X (Twitter)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => toast.info("Facebook integration coming soon!")}
                className="gap-2 cursor-pointer text-muted-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Publish to Facebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Main layout with editor on left and preview on right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Post Editor */}
        <div>
          <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text Post</TabsTrigger>
              <TabsTrigger value="carousel">Carousel</TabsTrigger>
              <TabsTrigger value="document">Document</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create LinkedIn Post</CardTitle>
                  <CardDescription>
                    Write your post content to share with your network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Share your insights, knowledge, or ask a question..."
                      className="min-h-[200px] resize-y"
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        // Add visual feedback to preview
                        const previewEl = document.querySelector('.preview-section');
                        if (previewEl) {
                          previewEl.classList.add('preview-pulse');
                          setTimeout(() => previewEl.classList.remove('preview-pulse'), 300);
                        }
                        showSaveIndicator();
                      }}
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hashtags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-neutral-light px-2 py-1 flex items-center gap-1"
                          onClick={() => removeHashtag(tag)}
                        >
                          #{tag}
                          <span className="text-xs ml-1">×</span>
                        </Badge>
                      ))}
                      
                      <div className="flex items-center gap-1">
                        <Input
                          placeholder="Add hashtag"
                          className="w-32 h-8"
                          value={newHashtag}
                          onChange={(e) => setNewHashtag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addHashtag();
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={addHashtag}
                        >
                          <PlusCircle size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-medium mb-2">Post Image</h3>
                        {postImage ? (
                          <div className="relative rounded-md overflow-hidden mb-2 border border-gray-200 dark:border-gray-700">
                            <div className="bg-white flex items-center justify-center" style={{ minHeight: '300px' }}>
                              <img 
                                src={postImage.secure_url} 
                                alt="Post image"
                                className="max-w-full max-h-[350px] object-contain"
                                style={{ 
                                  padding: '12px',
                                  display: 'block',
                                  margin: '0 auto'
                                }}
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setPostImage(null)}
                            >
                              Remove
                      </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <ImageGalleryPicker
                              onSelectImage={handleImageSelected}
                              triggerButton={
                                <Button variant="outline" className="gap-2">
                                  <ImageIcon className="h-4 w-4" />
                                  Select from Gallery
                                </Button>
                              }
                            />
                            <Button 
                              variant="outline"
                              className="gap-2"
                              onClick={() => navigate('/dashboard/images')}
                            >
                              <Folder className="h-4 w-4" />
                              Manage Images
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Button 
                        variant={isPollActive ? "default" : "outline"}
                        size="sm" 
                        className="gap-1"
                        onClick={() => setIsPollActive(!isPollActive)}
                      >
                        <BarChart4 size={14} />
                        {isPollActive ? 'Remove Poll' : 'Add Poll'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="carousel" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create Carousel Post</CardTitle>
                  <CardDescription>
                    Create professional slide decks to share on LinkedIn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Text input above carousel */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Post Text</label>
                    <Textarea
                      placeholder="Add text above your carousel slides..."
                      className="min-h-[80px] resize-none"
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        showSaveIndicator();
                      }}
                    />
                    <p className="text-xs text-muted-foreground">This text will appear above your carousel in the LinkedIn post</p>
                        </div>

                  <Separator />
                  
                  {/* Slider Type Selection */}
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium">Slider Type</label>
                      <Select 
                        value={sliderType} 
                        onValueChange={(value) => setSliderType(value as SliderVariant)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a slider type" />
                        </SelectTrigger>
                        <SelectContent>
                          {sliderOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)} Slider
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/dashboard/templates')}
                      className="gap-1 text-xs"
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                      Browse Templates
                    </Button>
                    </div>
                    
                    <Separator />
                    
                    {/* Slides editor */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium">Carousel Slides</h3>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={addSlide} 
                          className="gap-1"
                        >
                          <PlusCircle size={16} />
                          Add Slide
                        </Button>
                      </div>
                      
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {slides.map((slide, index) => (
                            <Card key={slide.id} className="relative">
                              <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">Slide {index + 1}</CardTitle>
                                  {slides.length > 1 && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => removeSlide(slide.id)}
                                    >
                                      <span className="sr-only">Remove slide</span>
                                      ×
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>
                            <CardContent className="py-2 space-y-4">
                              {/* Image upload section */}
                              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                                {slide.cloudinaryImage ? (
                                  <div className="relative">
                                    <img 
                                      src={slide.cloudinaryImage.secure_url} 
                                      alt="Slide" 
                                      className="mx-auto max-h-40 object-contain rounded-lg"
                                      style={{ backgroundColor: 'white' }}
                                    />
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full"
                                      onClick={() => {
                                        // Remove image from slide
                                        const updatedSlides = slides.map(s => 
                                          s.id === slide.id ? {...s, cloudinaryImage: undefined, imageUrl: undefined} : s
                                        );
                                        setSlides(updatedSlides);
                                        showSaveIndicator();
                                      }}
                                    >
                                      <X size={14} />
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 mb-3">Add an image to this slide</p>
                                    <div className="flex justify-center gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="gap-1"
                                        onClick={() => document.getElementById("file-upload-" + slide.id)?.click()}
                                      >
                                        <Upload size={14} />
                                        Upload
                                      </Button>
                                      <input
                                        id={"file-upload-" + slide.id}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            // Handle upload directly when file is selected
                                            const uploadToCloudinary = async () => {
                                              try {
                                                toast.info("Uploading image...");
                                                // Import dynamically to avoid circular deps
                                                const { uploadToCloudinaryDirect } = await import('@/utils/cloudinaryDirectUpload');
                                                const image = await uploadToCloudinaryDirect(file, {
                                                  folder: 'linkedin_uploads',
                                                  tags: ['carousel', 'slide'],
                                                  type: 'uploaded'
                                                });
                                                
                                                // Update slide with Cloudinary image
                                                const updatedSlides = slides.map(s => 
                                                  s.id === slide.id ? {
                                                    ...s, 
                                                    cloudinaryImage: image as ExtendedCloudinaryImage,
                                                    imageUrl: (image as ExtendedCloudinaryImage).secure_url
                                                  } : s
                                                );
                                                setSlides(updatedSlides);
                                                showSaveIndicator();
                                                toast.success('Image uploaded to slide');
                                              } catch (error) {
                                                console.error('Upload error:', error);
                                                toast.error('Failed to upload image');
                                              }
                                            };
                                            uploadToCloudinary();
                                          }
                                        }}
                                      />
                                      <ImageGalleryPicker
                                        onSelectImage={(image: CloudinaryImage) => {
                                          // Update slide with Cloudinary image from gallery
                                          const updatedSlides = slides.map(s => 
                                            s.id === slide.id ? {
                                              ...s, 
                                              cloudinaryImage: image as ExtendedCloudinaryImage,
                                              imageUrl: (image as ExtendedCloudinaryImage).secure_url
                                            } : s
                                          );
                                          setSlides(updatedSlides);
                                          showSaveIndicator();
                                          toast.success('Image added to slide');
                                        }}
                                        triggerButton={
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="gap-1"
                                          >
                                            <Folder size={14} />
                                            Gallery
                                          </Button>
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Text content */}
                                <Textarea
                                placeholder="Add text for this slide..."
                                className="min-h-[80px]"
                                  value={slide.content}
                                  onChange={(e) => {
                                    updateSlide(slide.id, e.target.value);
                                    // Add a small haptic-like visual feedback
                                    const previewEl = document.querySelector('.preview-section');
                                    if (previewEl) {
                                      previewEl.classList.add('preview-pulse');
                                      setTimeout(() => previewEl.classList.remove('preview-pulse'), 300);
                                    }
                                    showSaveIndicator();
                                  }}
                                />
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="document" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Document</CardTitle>
                  <CardDescription>
                    Share PDF documents, presentations, or other files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-10 text-center bg-neutral-lightest relative transition-all ${documentFile ? 'border-primary bg-primary/5' : 'border-neutral-light hover:border-primary/50'}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        const file = e.dataTransfer.files[0];
                        setDocumentFile(file);
                        showSaveIndicator();
                      }
                    }}
                  >
                    {documentFile ? (
                      <>
                        <FileText size={48} className="mx-auto mb-4 text-primary" />
                        <h3 className="text-lg font-medium mb-2 break-all">{documentFile.name}</h3>
                        <p className="text-sm text-neutral-medium mb-4">
                          {(documentFile.size / 1024 / 1024).toFixed(2)} MB · {documentFile.type}
                        </p>
                        <div className="flex justify-center gap-3">
                          <Button variant="outline" onClick={() => setDocumentFile(null)}>
                            Remove
                          </Button>
                          <Button onClick={() => {
                            const fileInput = document.getElementById('document-file-input');
                            if (fileInput) fileInput.click();
                          }}>
                            Replace
                          </Button>
                        </div>
                        <input 
                          type="file" 
                          id="document-file-input"
                          className="hidden"
                          accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setDocumentFile(e.target.files[0]);
                              showSaveIndicator();
                            }
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <FileText size={48} className="mx-auto mb-4 text-neutral-medium" />
                        <h3 className="text-lg font-medium mb-2">Upload Document</h3>
                        <p className="text-sm text-neutral-medium mb-4">
                          Drag and drop a file here, or click to browse
                        </p>
                        <Button onClick={() => {
                          const fileInput = document.getElementById('document-file-input');
                          if (fileInput) fileInput.click();
                        }}>
                          Select File
                        </Button>
                        <input 
                          type="file" 
                          id="document-file-input"
                          className="hidden"
                          accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setDocumentFile(e.target.files[0]);
                              showSaveIndicator();
                            }
                          }}
                        />
                      </>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <label className="text-sm font-medium">Add a description</label>
                    <Textarea
                      placeholder="Add a description for your document..."
                      className="mt-2 min-h-[120px]"
                      value={documentDescription}
                      onChange={(e) => {
                        setDocumentDescription(e.target.value);
                        showSaveIndicator();
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
          
        {/* Right Side - Live Preview */}
        <div>
          <Card className="border-primary/30 bg-white">
            <CardHeader className="pb-2 bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-black">Live Preview</CardTitle>
                  <CardDescription className="text-gray-800">Your post updates in real-time as you type</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 p-4 max-w-xl mx-auto preview-section bg-white shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-white font-bold ring-2 ring-white overflow-hidden">
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.firstName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.firstName?.charAt(0) || 'U'
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[15px] text-black">{user ? `${user.firstName} ${user.lastName}` : 'User Name'}</h4>
                    <p className="text-xs text-gray-800">
                      {user?.role || 'LinkedIn User'} {user?.role ? ' · ' : ''} 
                      <span className="text-blue-600">Follow</span>
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-800 mt-0.5">
                      <span>Now</span>
                      <span>•</span>
                      <Globe className="h-3 w-3" />
                      <span className="ml-auto text-[11px] text-gray-800">
                        <span className="text-blue-600">500+ connections</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {activeTab === 'text' && (
                  <div className="mb-4 transition-all duration-200">
                    <p className="text-[14px] leading-relaxed text-black whitespace-pre-line mb-3 transition-all duration-200">
                      {content || "Your post content will appear here"}
                    </p>
                    
                    {/* Display post image in preview if selected */}
                    {(postImage || aiGeneratedImage) && (
                      <div className="mb-3 rounded-lg overflow-hidden transition-all duration-300 border border-gray-100">
                        <img 
                          src={postImage ? postImage.secure_url : aiGeneratedImage!} 
                          alt="Post image"
                          className="w-full object-contain transition-all duration-200"
                          style={{ 
                            maxHeight: '350px',
                            display: 'block',
                            margin: '0 auto'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Display poll if active */}
                    {isPollActive && pollOptions.filter(opt => opt.trim()).length >= 2 && (
                      <div className="mb-3 border rounded-lg p-3 bg-white">
                        <p className="text-sm font-medium mb-2 text-black">Poll ({pollDuration} day{pollDuration > 1 ? 's' : ''})</p>
                        <div className="space-y-2">
                          {pollOptions.filter(opt => opt.trim()).map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border border-primary flex-shrink-0"></div>
                              <span className="text-sm text-black">{option || `Option ${index + 1}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {hashtags.map(tag => (
                        <span key={tag} className="text-blue-600 text-[13px] hover:underline cursor-pointer">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'carousel' && (
                  <div className="mb-4">
                    {/* Show the post text above the carousel like in a real LinkedIn post */}
                    {content && (
                      <p className="text-[14px] leading-relaxed text-black whitespace-pre-line mb-3 transition-all duration-200">
                        {content}
                      </p>
                    )}
                    
                    <InlineCarouselPreview slides={slides} variant={sliderType} />
                    
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {hashtags.map(tag => (
                        <span key={tag} className="text-blue-600 text-[13px] hover:underline cursor-pointer">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'document' && (
                  <div className="mb-4">
                    {content && (
                      <p className="text-[14px] leading-relaxed text-black whitespace-pre-line mb-3 transition-all duration-200">
                        {content}
                      </p>
                    )}
                    
                    <div className="bg-neutral-lightest border rounded-lg p-6 mb-3 text-center">
                      {documentFile ? (
                        <>
                          <FileText size={40} className="mx-auto mb-2 text-primary" />
                          <p className="text-sm font-medium text-black mb-1">{documentFile.name}</p>
                          <p className="text-xs text-neutral-medium">
                            {(documentFile.size / 1024 / 1024).toFixed(2)} MB · {documentFile.type}
                          </p>
                          {documentDescription && (
                            <p className="text-sm text-neutral-dark mt-3 text-left bg-white rounded p-2 border">
                              {documentDescription}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <FileText size={40} className="mx-auto mb-2 text-neutral-medium" />
                          <p className="text-sm text-neutral-medium">Document Preview</p>
                        </>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {hashtags.map(tag => (
                        <span key={tag} className="text-blue-600 text-[13px] hover:underline cursor-pointer">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* LinkedIn engagement stats */}
                <div className="flex items-center gap-1 text-neutral-medium text-xs mb-1 pt-2">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">👍</div>
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">❤️</div>
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white">👏</div>
                  </div>
                  <span className="text-xs">John Doe and 24 others</span> • <span className="text-xs">8 comments</span>
                </div>
                
                <div className="border-t border-gray-200 pt-1 mt-1">
                  <div className="flex items-center justify-between">
                    <button className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors py-1 px-3 rounded-md hover:bg-blue-50 flex-1">
                      <ThumbsUp size={18} />
                      <span className="text-xs font-medium">Like</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:text-green-600 transition-colors py-1 px-3 rounded-md hover:bg-green-50 flex-1">
                      <MessageCircle size={18} />
                      <span className="text-xs font-medium">Comment</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:text-amber-600 transition-colors py-1 px-3 rounded-md hover:bg-amber-50 flex-1">
                      <Share2 size={18} />
                      <span className="text-xs font-medium">Share</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:text-purple-600 transition-colors py-1 px-3 rounded-md hover:bg-purple-50 flex-1">
                      <Forward size={18} />
                      <span className="text-xs font-medium">Send</span>
                  </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
        </div>
        
      {/* Tools Section Below */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Tools */}
        <Card className="bg-white border-2">
              <CardHeader>
            <CardTitle className="text-black">AI Tools</CardTitle>
            <CardDescription className="text-gray-800">
              Enhance your content with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-black">
                        <Sparkles size={16} className="text-amber-500" />
                        AI Assistance
                      </h3>
                      <div className="space-y-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                    className="w-full justify-start text-sm bg-white text-black"
                          onClick={() => navigate('/dashboard/ai-writer')}
                        >
                          <Wand2 className="h-3.5 w-3.5 mr-2" />
                          Go to AI Writer
                        </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-sm bg-white text-black">
                          Generate a professional post
                        </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-sm bg-white text-black">
                          Improve writing style
                        </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-sm bg-white text-black">
                          Create catchy hook
                        </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-sm bg-white text-black">
                          Suggest hashtags
                        </Button>
                      </div>
                    </div>
                    </div>
          </CardContent>
        </Card>
        
        {/* Templates */}
        <Card className="bg-white border-2">
          <CardHeader>
            <CardTitle className="text-black">Templates & Tips</CardTitle>
            <CardDescription className="text-gray-800">
              Content templates and best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'text' && (
              <div className="space-y-4">                
                    <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-black">
                        <BarChart size={16} className="text-accent" />
                        Engagement Tips
                      </h3>
                  <div className="bg-white border-2 rounded-lg p-3 text-sm">
                    <ul className="list-disc list-inside space-y-1 text-black">
                          <li>Ask a question to encourage comments</li>
                          <li>Use 3-5 relevant hashtags</li>
                          <li>Keep paragraphs short and scannable</li>
                          <li>Include a clear call-to-action</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'carousel' && (
                  <div className="space-y-4">
                    <div>
                  <h3 className="text-sm font-medium mb-2 text-black">Carousel Templates</h3>
                  <ScrollArea className="h-[200px]">
                        <div className="space-y-2 pr-4">
                          {carouselTemplates.map(template => (
                            <div 
                              key={template.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                selectedTemplate === template.id 
                                  ? 'bg-primary-50 border-primary' 
                              : 'hover:bg-white border-2'
                              }`}
                              onClick={() => applyTemplate(template.id)}
                            >
                              <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-black">{template.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {template.slideCount} slides
                                </Badge>
                              </div>
                          <p className="text-xs text-black">{template.description}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}
                
                {activeTab === 'document' && (
                  <div className="space-y-4">
                    <div>
                  <h3 className="text-sm font-medium mb-2 text-black">Document Tips</h3>
                  <div className="bg-white border-2 rounded-lg p-3 text-sm">
                    <ul className="list-disc list-inside space-y-1 text-black">
                          <li>Use PDFs for best compatibility</li>
                          <li>Ensure document is under 100MB</li>
                          <li>Use landscape orientation for presentations</li>
                          <li>Add your branding and contact info</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
      </div>
      
      {isPollActive && (
        <div className="mt-4 p-4 bg-white border-2 rounded-md">
          <h3 className="text-sm font-medium mb-3 text-black">Poll Options</h3>
          <div className="space-y-3">
            {pollOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                    className="bg-white text-black"
                  />
                </div>
                {pollOptions.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePollOption(index)}
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
            ))}
            
            {pollOptions.length < 4 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPollOption}
                className="w-full bg-white text-black"
              >
                Add Option
              </Button>
            )}
            
            <div className="mt-3">
              <label className="block text-sm mb-1 text-black">Poll Duration</label>
              <select
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                value={pollDuration}
                onChange={(e) => setPollDuration(parseInt(e.target.value))}
              >
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>1 week</option>
                <option value={14}>2 weeks</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage; 