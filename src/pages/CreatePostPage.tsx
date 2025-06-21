import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { usePostCount } from '@/components/CollapsibleSidebar';

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
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const { user } = useAuth();
  const { clearState } = useAppState();
  const { updatePostCounts } = usePostCount();
  
  // Change from usePersistentState to useState for content
  const [content, setContent] = useState('');

  // Clear all state when component unmounts or on navigation
  useEffect(() => {
    return () => {
      // Clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('state:createPost.') || 
            key === 'editingDraftId' || 
            key === 'editingScheduledId') {
          localStorage.removeItem(key);
        }
      });
      
      // Clear sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('createPost.')) {
          sessionStorage.removeItem(key);
        }
      });
    };
  }, []);

  // Add beforeunload event listener to clear state on page refresh/close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('state:createPost.') || 
            key === 'editingDraftId' || 
            key === 'editingScheduledId') {
          localStorage.removeItem(key);
        }
      });
      
      // Clear sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('createPost.')) {
          sessionStorage.removeItem(key);
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('text');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');
  const [postImage, setPostImage] = useState<ExtendedCloudinaryImage | null>(null);
  
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
  const [selectedTemplate, setSelectedTemplate] = usePersistentState<string | null>('createPost.selectedTemplate', null);
  const [sliderType, setSliderType] = usePersistentState<SliderVariant>('createPost.sliderType', 'basic');
  const [slides, setSlides] = usePersistentState<{id: string, content: string, imageUrl?: string, cloudinaryImage?: ExtendedCloudinaryImage}[]>('createPost.slides', [
    { id: '1', content: 'Slide 1: Introduction to your topic' },
    { id: '2', content: 'Slide 2: Key point or insight #1' },
    { id: '3', content: 'Slide 3: Key point or insight #2' },
  ]);
  
  const [aiGeneratedImage, setAiGeneratedImage] = usePersistentState<string | null>('createPost.aiGeneratedImage', null);
  
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
  
  // Scheduling states
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(() => {
    // Use current date as default
    const now = new Date();
    return now;
  });
  const [scheduleTime, setScheduleTime] = useState(() => {
    // Set current time as default
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
  
  // Create a ref to track if we've already shown the dialog for this location state
  const dialogShownRef = React.useRef(false);
  
  // Effect for processing location state
  useEffect(() => {
    if (locationState && !dialogShownRef.current) {
      // Mark that we've processed this location state
      dialogShownRef.current = true;
      
      if (locationState.content) {
        setContent(locationState.content);
      }
      
      if (locationState.hashtags) {
        setHashtags(locationState.hashtags);
      }
      
      if (locationState.image) {
        setAiGeneratedImage(locationState.image);
        setActiveTab('text');
      }
      
      if (locationState.scheduledDate) {
        try {
          // Convert string date to Date object
          const parsedDate = new Date(locationState.scheduledDate);
          if (!isNaN(parsedDate.getTime())) {
            setScheduledDate(parsedDate);
            console.log('Set scheduled date from location state:', parsedDate);
          }
        } catch (err) {
          console.error('Error parsing scheduled date from location state:', err);
        }
      }
      
      if (locationState.scheduleTime) {
        setScheduleTime(locationState.scheduleTime);
        console.log('Set schedule time from location state:', locationState.scheduleTime);
      }
    }
  }, [locationState, setContent, setHashtags, setAiGeneratedImage, setActiveTab]);
  
  // Separate effect to handle opening the schedule dialog
  useEffect(() => {
    if (locationState?.openScheduleDialog) {
      console.log('Opening schedule dialog from location state');
      // Don't automatically open the dialog, let user create content first
      setShowScheduleDialog(false);
    }
  }, [locationState?.openScheduleDialog]);
  
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
    toast.success('✓ Image selected', { duration: 2000 });
  };

  // Handle direct image upload complete
  const handleUploadComplete = async (image: CloudinaryImage) => {
    try {
      // Save the image to gallery first
      await saveImageToGallery(image);
      
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
      toast.success('✓ Image uploaded and added to gallery', { duration: 2000 });
    } catch (error) {
      console.error('Error saving image to gallery:', error);
              toast.error('Failed to save image to gallery', { duration: 2000 });
    }
  };
  
  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
      showSaveIndicator();
    } else {
      toast.error('Maximum 4 options allowed', { duration: 2000 });
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
      showSaveIndicator();
    } else {
      toast.error('Poll requires at least 2 options', { duration: 2000 });
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
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
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
        toast.error('Please add some content', { duration: 2000 });
        setIsPublishing(false);
        return;
      }
      
      // Check for LinkedIn authentication
      const token = localStorage.getItem('linkedin-login-token');
      
      if (!token) {
        toast.error('Please connect your LinkedIn account', { duration: 2000 });
        setIsPublishing(false);
        
        // Show a reconnect option
        if (window.confirm('Would you like to connect your LinkedIn account now?')) {
          handleReconnectLinkedIn();
        }
        return;
      }
      
      let response;
      let linkedInPostId = null;
      
      // Handle different post types
      if (isPollActive && pollOptions.filter(opt => opt.trim()).length >= 2) {
        // Publish as poll
        const filteredOptions = pollOptions.filter(opt => opt.trim());
        response = await linkedInApi.createPollPost(content, filteredOptions, pollDuration);
        if (response?.data?.id) {
          linkedInPostId = response.data.id;
        }
                  toast.success('✓ Poll published to LinkedIn', { duration: 2000 });
      } else if (activeTab === 'carousel' && slides.length > 0) {
        // Handle carousel post - with slides from state
        console.log('Publishing LinkedIn carousel post with slides:', slides);
        
        try {
          toast.info('Preparing carousel...', { duration: 2000 });
          
          // Check if all slides have images
          const allSlidesHaveImages = slides.every(slide => slide.cloudinaryImage?.secure_url);
          
          if (!allSlidesHaveImages) {
            // Process as document if not all slides have images
            toast.warning('Some slides missing images, publishing as text', { duration: 2000 });
            
            // Create a combined document from slides
            const slideContent = slides.map(slide => slide.content).join('\n\n');
            const fullContent = `${content}\n\n${slideContent}`;
            
            response = await linkedInApi.createTextPost(fullContent);
            if (response?.data?.id) {
              linkedInPostId = response.data.id;
            }
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
                transformedSlides
              );
              
              if (response?.data?.id) {
                linkedInPostId = response.data.id;
              }
              
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
                'Carousel slide 1'
              );
              
              if (response?.data?.id) {
                linkedInPostId = response.data.id;
              }
              
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
            
            response = await linkedInApi.createTextPost(fullContent);
            if (response?.data?.id) {
              linkedInPostId = response.data.id;
            }
            toast.success('Carousel content published as text successfully!');
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
            postImage.original_filename || 'Shared image'
          );
          
          if (response?.data?.id) {
            linkedInPostId = response.data.id;
          }
          
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
            
            response = await linkedInApi.createTextPost(postWithImage);
            if (response?.data?.id) {
              linkedInPostId = response.data.id;
            }
            console.log('LinkedIn text post fallback response:', response);
            toast.success('Post published to LinkedIn as text with image link.');
          } catch (textError) {
            console.error('Even text fallback failed:', textError);
            throw textError; // Re-throw to be caught by outer catch
          }
        }
      } else {
        // Simple text post
        console.log('Publishing LinkedIn text post');
        response = await linkedInApi.createTextPost(content);
        if (response?.data?.id) {
          linkedInPostId = response.data.id;
        }
        console.log('LinkedIn text post response:', response);
        toast.success('Post published to LinkedIn successfully!');
      }
      
      // First, save the post to the database to ensure it appears in the published section
      if (response) {
        try {
          // Helper function to check if it's a valid carousel post
          const isValidCarousel = () => {
            return activeTab === 'carousel' && 
                   slides.length > 0 && 
                   slides.some(slide => slide.content?.trim().length > 0 && slide.cloudinaryImage?.secure_url);
          };
          
          // Create a published post in the database
          const dbPostData = {
            title: 'Published Post',
            content: content,
            hashtags: hashtags,
            mediaType: postImage ? 'image' : isValidCarousel() ? 'carousel' : 'none',
            postImage: postImage,
            slides: slides,
            isPollActive: isPollActive,
            pollOptions: pollOptions.filter(Boolean),
            status: 'published',
            publishedTime: new Date().toISOString(),
            platformPostId: linkedInPostId // Add the LinkedIn post ID
          };
          
          // Save to the database
          const dbResponse = await linkedInApi.createDBPost(dbPostData);
          console.log('Published post saved to database:', dbResponse);
          
          // Clear all createPost related state
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('state:createPost.')) {
              localStorage.removeItem(key);
            }
          });
              
              // Update post counts in sidebar
              updatePostCounts();
              
              // Navigate to post library
          navigate('/dashboard/posts', { 
            state: { 
              newPost: true, 
              activeTab: 'published',
              platformPostId: linkedInPostId // Pass the LinkedIn post ID to the library
            }
          });
        } catch (dbError) {
          console.error('Error saving published post to database:', dbError);
          // Continue anyway, as the post was published to LinkedIn
          
          // Still navigate to post library
        navigate('/dashboard/posts', {
          state: { 
            newPost: true,
              activeTab: 'published',
              platformPostId: linkedInPostId // Pass the LinkedIn post ID even if DB save failed
          }
        });
        }
      }
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
      // Validate content
      if (!content.trim() && !postImage && !slides.length && !isPollActive) {
        toast.error('Please add some content before saving as draft');
        return;
      }

      setIsSavingDraft(true);
      
      // Check if we're editing an existing draft
      const editingDraftId = localStorage.getItem('editingDraftId');
      
      // Create draft data
      const draftData = {
        id: editingDraftId || `draft_${Date.now()}`,
        title: 'Draft Post',
        content: content,
        excerpt: content.substring(0, 100) + '...',
        createdAt: editingDraftId ? localStorage.getItem(`state:createPost.createdAt`) || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slides: slides.length > 0 ? slides : [],
        postImage: postImage,
        isPollActive: isPollActive,
        pollOptions: pollOptions.filter(Boolean),
        hashtags: hashtags,
        provider: 'linkedin',
        status: 'draft',
        date: new Date().toLocaleDateString()
      };
      
      try {
        if (editingDraftId) {
          // If editing an existing draft, update it in the backend
          if (!editingDraftId.startsWith('draft_')) {
            await linkedInApi.updateDBPost(editingDraftId, {
              ...draftData,
              id: editingDraftId
            });
          }
          // Update in localStorage
          localStorage.setItem(editingDraftId, JSON.stringify(draftData));
        } else {
          // Create new draft
          const response = await linkedInApi.createDBPost({
            ...draftData,
            status: 'draft'
          });
          
          if (response?.success && response?.data?._id) {
            // If backend save successful, use the backend ID
            draftData.id = response.data._id;
          }
          // Save to localStorage
          localStorage.setItem(draftData.id, JSON.stringify(draftData));
      }
      
      // Clear the editing state
      localStorage.removeItem('editingDraftId');
        
        // Clear all createPost related state
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('state:createPost.')) {
            localStorage.removeItem(key);
          }
        });
      
      // Success message
        toast.success(editingDraftId ? "Draft updated successfully" : "Draft saved successfully");
      
      // Navigate to the post library
      navigate('/dashboard/posts', {
        state: { 
            newDraft: !editingDraftId,
            updatedDraft: editingDraftId,
          activeTab: 'drafts'
        }
      });
      
      // Update post counts in sidebar
      updatePostCounts();
      } catch (error) {
        console.error('Error saving draft:', error);
        // Still save to localStorage as fallback
        localStorage.setItem(draftData.id, JSON.stringify(draftData));
        toast.warning('Draft saved locally only. Some features may be limited.');
      }
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
      // Validate content
      if (!content.trim() && !postImage && !slides.length && !isPollActive) {
        toast.error('Please add some content before scheduling');
        return;
      }

      setIsPublishing(true);
      toast.info('Preparing to schedule your post...');
      
      // Validate required fields
      if (!scheduledDate || !scheduleTime) {
        toast.error('Please select both date and time for scheduling');
        return;
      }
      
      // Create a Date object from the scheduled date and time
      const scheduledDateTime = new Date(scheduledDate);
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes, 0, 0);
      
      // Check if the scheduled time is in the past
      if (scheduledDateTime <= new Date()) {
        toast.error('Please select a future date and time');
        return;
      }
      
      // Check if we're editing an existing scheduled post
      const editingScheduledId = localStorage.getItem('editingScheduledId');
      
      // Prepare post data
      const postData = {
        id: editingScheduledId || `scheduled_${Date.now()}`,
        title: 'Scheduled Post',
        content: content,
        hashtags: hashtags,
        platform: 'linkedin',
        status: 'scheduled',
        scheduledTime: scheduledDateTime.toISOString(),
        mediaType: postImage ? 'image' : activeTab === 'carousel' ? 'carousel' : 'none',
        postImage: postImage,
        slides: slides,
        isPollActive: isPollActive,
        pollOptions: pollOptions.filter(Boolean),
        createdAt: editingScheduledId ? localStorage.getItem(`state:createPost.createdAt`) || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        let response;
        if (editingScheduledId) {
          // If editing an existing scheduled post, update it
          if (!editingScheduledId.startsWith('scheduled_')) {
            response = await linkedInApi.updateDBPost(editingScheduledId, {
              ...postData,
              id: editingScheduledId
            });
          }
          // Update in localStorage
          localStorage.setItem(editingScheduledId, JSON.stringify(postData));
        } else {
          // Create new scheduled post
          response = await linkedInApi.createDBPost({
        ...postData,
        status: 'scheduled'
      });
      
          if (response?.success && response?.data?._id) {
            // If backend save successful, use the backend ID
            postData.id = response.data._id;
          }
          // Save to localStorage
          localStorage.setItem(postData.id, JSON.stringify(postData));
        }
        
        // Clear the editor state
        localStorage.removeItem('editingScheduledId');
        
        // Clear form data from localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('state:createPost.')) {
            localStorage.removeItem(key);
          }
        });
        
        // Success message
        toast.success(editingScheduledId ? 'Post schedule updated successfully!' : 'Post scheduled successfully!');
        
        // Navigate to the post library scheduled tab
        navigate('/dashboard/posts', { 
          state: { 
            scheduled: !editingScheduledId,
            updatedScheduled: editingScheduledId,
            activeTab: 'scheduled' 
          }
        });
            
            // Update post counts in sidebar
            updatePostCounts();
      } catch (error) {
        console.error('Error scheduling post:', error);
        // Save to localStorage as fallback
        localStorage.setItem(postData.id, JSON.stringify(postData));
        toast.warning('Post scheduled locally only. Some features may be limited.');
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
      const testPostContent = 'This is a test post from BrandOut. ' + new Date().toISOString();
      const response = await linkedInApi.createTextPost(testPostContent);
      
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
      
      // Clean up edit IDs if the user navigates away without saving
    return () => {
      if (!isEditing) {
        localStorage.removeItem('editingDraftId');
        localStorage.removeItem('editingScheduledId');
      }
    };
  }, [content, slides]);
  
  // Add a new function to handle scheduling
  const handleScheduleClick = () => {
    if (!content.trim() && activeTab === 'text') {
      toast.error('Please add some content before scheduling');
      return;
    }
    if (slides.length === 0 && activeTab === 'carousel') {
      toast.error('Please add at least one slide before scheduling');
      return;
    }
    setShowScheduleDialog(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-black">Create LinkedIn Content</h1>
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
        
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-xs sm:text-sm"
            onClick={saveAsDraft}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden xs:inline">Saving...</span>
              </>
            ) : (
              <>
                <FileText size={16} />
                <span className="hidden xs:inline">Save Draft</span>
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 text-xs sm:text-sm" 
            onClick={handleScheduleClick}
          >
            <Clock size={16} className="mr-1" />
            <span className="hidden xs:inline">Schedule</span>
          </Button>
          
          <Button 
            size="sm" 
            className="bg-primary text-white gap-2 text-xs sm:text-sm"
            onClick={publishToLinkedIn}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden xs:inline">Publishing...</span>
              </>
            ) : (
              <>
                <Linkedin size={16} />
                <span className="hidden xs:inline">Publish to LinkedIn</span>
              </>
            )}
          </Button>
          
          {/* Schedule Dialog */}
          <Dialog 
            open={showScheduleDialog} 
            onOpenChange={(open) => {
              setShowScheduleDialog(open);
              if (!open) {
                console.log('Dialog closed via onOpenChange');
                handleDialogClose();
              }
            }}
          >
            <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw] overflow-y-auto" onPointerDownOutside={handleDialogClose}>
              <DialogHeader>
                <DialogTitle>Schedule LinkedIn Post</DialogTitle>
                <DialogDescription>
                  Choose when you want this post to be published to LinkedIn
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date</label>
                    <Input
                      type="date"
                      value={scheduledDate.toISOString().split('T')[0]}
                      onChange={(e) => {
                      if (e.target.value) {
                        const newDate = new Date(e.target.value);
                        // Preserve the time
                        const currentHours = scheduledDate.getHours();
                        const currentMinutes = scheduledDate.getMinutes();
                        newDate.setHours(currentHours, currentMinutes, 0, 0);
                        
                        // Only set if it's a valid date and not in the past
                        if (!isNaN(newDate.getTime())) {
                          const now = new Date();
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                          const selectedDay = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
                          
                          if (selectedDay >= today) {
                        setScheduledDate(newDate);
                            console.log('Date changed to:', newDate);
                          } else {
                            toast.error('Please select today or a future date');
                          }
                        }
                      }
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
                      
                      // Validate that the date+time combination is not in the past
                      const now = new Date();
                      if (newDate <= now) {
                        // If selected time is in the past but the date is today,
                        // we can suggest a time in the future
                        if (newDate.getDate() === now.getDate() && 
                            newDate.getMonth() === now.getMonth() && 
                            newDate.getFullYear() === now.getFullYear()) {
                          // Set time to be now + 15 minutes
                          const suggestedDate = new Date();
                          suggestedDate.setMinutes(suggestedDate.getMinutes() + 15);
                          const suggestedHours = String(suggestedDate.getHours()).padStart(2, '0');
                          const suggestedMinutes = String(suggestedDate.getMinutes()).padStart(2, '0');
                          const suggestedTime = `${suggestedHours}:${suggestedMinutes}`;
                          
                          toast.error(`Time must be in the future. Setting to ${suggestedTime}`);
                          setScheduleTime(suggestedTime);
                          newDate.setHours(suggestedDate.getHours(), suggestedDate.getMinutes(), 0, 0);
                        }
                      }
                      
                      setScheduledDate(newDate);
                      console.log('Time changed to:', e.target.value, 'Updated date:', newDate);
                    }}
                    />
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-1">Post Summary</h4>
                <div className="border rounded p-3 bg-white text-sm">
                    <p className="line-clamp-3">{content || "No content yet"}</p>
                    {postImage && <p className="text-green-600 mt-1">Image: {postImage.secure_url.split('/').pop()}</p>}
                    {isPollActive && <p className="text-blue-600 mt-1">Poll with {pollOptions.filter(o => o.trim()).length} options</p>}
                  <p className="text-blue-600 mt-1">Scheduled for: {scheduledDate.toLocaleDateString()} at {scheduleTime}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
                <Button 
                  onClick={schedulePost} 
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
          
          <Button 
            size="sm" 
            className="bg-primary text-white gap-2 text-xs sm:text-sm"
            onClick={publishToLinkedIn}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden xs:inline">Publishing...</span>
              </>
            ) : (
              <>
                <Linkedin size={16} />
                <span className="hidden xs:inline">Publish to LinkedIn</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Main layout with editor on left and preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Post Editor */}
        <div className="-mt-3">
          <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="-mb-3">
            </TabsList>
            
            <TabsContent value="text" className="-mt-6">
              <Card className="border-t-0">
                <CardHeader className="px-4 py-2 sm:px-6 sm:py-2">
                  <CardTitle className="text-lg sm:text-xl">Create LinkedIn Post</CardTitle>
                  <CardDescription className="text-sm">
                    Write your post content to share with your network
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Share your insights, knowledge, or ask a question..."
                      className="min-h-[200px] resize-y"
                      value={content}
                      onChange={(e) => {
                        const newContent = e.target.value;
                        setContent(newContent);
                        
                        // Auto-detect hashtags
                        const hashtagRegex = /#[^\s#]+/g;
                        const matches = newContent.match(hashtagRegex);
                        
                        if (matches) {
                          const newHashtags = matches.map(tag => tag.slice(1)); // Remove # prefix
                          // Add only new hashtags that don't exist
                          newHashtags.forEach(tag => {
                            if (!hashtags.includes(tag)) {
                              setHashtags([...hashtags, tag]);
                            }
                          });
                        }
                        
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
                        >
                          #{tag}
                          <button 
                            className="ml-1 text-xs hover:text-red-500"
                            onClick={() => removeHashtag(tag)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      
                      <div className="flex items-center gap-1">
                        <Input
                          placeholder="Add hashtag"
                          className="w-32 h-8"
                          value={newHashtag}
                          onChange={(e) => {
                            // Remove # if user types it
                            setNewHashtag(e.target.value.replace('#', ''));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              // Split by spaces and # to handle multiple hashtags
                              const tags = newHashtag.split(/[\s#]+/).filter(Boolean);
                              tags.forEach(tag => {
                                if (!hashtags.includes(tag)) {
                                  setHashtags([...hashtags, tag]);
                                }
                              });
                              setNewHashtag('');
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => {
                            // Split by spaces and # to handle multiple hashtags
                            const tags = newHashtag.split(/[\s#]+/).filter(Boolean);
                            tags.forEach(tag => {
                              if (!hashtags.includes(tag)) {
                                setHashtags([...hashtags, tag]);
                              }
                            });
                            setNewHashtag('');
                          }}
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
                          <div className="flex flex-col sm:flex-row gap-2">
                            <ImageGalleryPicker
                              onSelectImage={handleImageSelected}
                              triggerButton={
                                <Button variant="outline" className="w-full sm:w-auto gap-2">
                                  <ImageIcon className="h-4 w-4" />
                                  Select from Gallery
                                </Button>
                              }
                            />
                            <Button 
                              variant="outline"
                              className="w-full sm:w-auto gap-2"
                              onClick={() => navigate('/dashboard/images')}
                            >
                              <Folder className="h-4 w-4" />
                              Manage Images
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
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
                  <CardTitle className="text-black text-lg">Live Preview</CardTitle>
                  <CardDescription className="text-gray-800">Your post updates in real-time as you type</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-2 py-3 sm:px-4 sm:py-4 overflow-hidden">
              <div className="rounded-lg border border-gray-200 p-3 sm:p-4 max-w-xl mx-auto preview-section bg-white shadow-md overflow-hidden">
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
                
                  <div className="mb-4 transition-all duration-200">
                    <p className="text-[14px] leading-relaxed text-black whitespace-pre-line mb-3 transition-all duration-200 break-words">
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
                            maxHeight: '300px',
                            display: 'block',
                            margin: '0 auto'
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {hashtags.map(tag => (
                        <span key={tag} className="text-blue-600 text-[13px] hover:underline cursor-pointer break-all">{`#${tag}`}</span>
                      ))}
                    </div>
                  </div>
                
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
                    <button className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors py-1 px-1 sm:px-3 rounded-md hover:bg-blue-50 flex-1">
                      <ThumbsUp size={16} className="sm:h-[18px] sm:w-[18px]" />
                      <span className="text-[10px] sm:text-xs font-medium">Like</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:text-green-600 transition-colors py-1 px-1 sm:px-3 rounded-md hover:bg-green-50 flex-1">
                      <MessageCircle size={16} className="sm:h-[18px] sm:w-[18px]" />
                      <span className="text-[10px] sm:text-xs font-medium">Comment</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:text-amber-600 transition-colors py-1 px-1 sm:px-3 rounded-md hover:bg-amber-50 flex-1">
                      <Share2 size={16} className="sm:h-[18px] sm:w-[18px]" />
                      <span className="text-[10px] sm:text-xs font-medium">Share</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:text-purple-600 transition-colors py-1 px-1 sm:px-3 rounded-md hover:bg-purple-50 flex-1">
                      <Forward size={16} className="sm:h-[18px] sm:w-[18px]" />
                      <span className="text-[10px] sm:text-xs font-medium">Send</span>
                  </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
        </div>
        
      {/* Tools Section Below */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full justify-start text-sm bg-white text-black truncate opacity-50 cursor-not-allowed"
                    disabled
                        >
                          <Wand2 className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                    <span className="truncate">AI Writer (Coming Soon)</span>
                        </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full justify-start text-sm bg-white text-black truncate opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <span className="truncate">Generate Post (Coming Soon)</span>
                        </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full justify-start text-sm bg-white text-black truncate opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <span className="truncate">Improve Writing (Coming Soon)</span>
                        </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full justify-start text-sm bg-white text-black truncate opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <span className="truncate">Create Hook (Coming Soon)</span>
                        </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full justify-start text-sm bg-white text-black truncate opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <span className="truncate">Suggest Hashtags (Coming Soon)</span>
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