import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Loader2
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { SliderVariant } from '@/types/LinkedInPost';
import { CarouselPreview } from '@/components/CarouselPreview';
import ImageGalleryPicker from '@/components/ImageGalleryPicker';
import ImageUploader from '@/components/ImageUploader';
import { CloudinaryImage } from '@/utils/cloudinaryDirectUpload';
import { saveImageToGallery } from '@/utils/cloudinaryDirectUpload';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usePersistentState, useAppState } from '@/contexts/StateContext';
import { linkedInApi } from '@/utils/linkedinApi';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from 'axios';

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
}

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
  const [slides, setSlides] = usePersistentState<{id: string, content: string}[]>('createPost.slides', [
    { id: '1', content: 'Slide 1: Introduction to your topic' },
    { id: '2', content: 'Slide 2: Key point or insight #1' },
    { id: '3', content: 'Slide 3: Key point or insight #2' },
  ]);
  
  const [hashtags, setHashtags] = usePersistentState<string[]>('createPost.hashtags', [
    'LinkedInTips', 'ContentCreation', 'ProfessionalDevelopment'
  ]);
  
  const [newHashtag, setNewHashtag] = useState('');
  const [aiGeneratedImage, setAiGeneratedImage] = usePersistentState<string | null>('createPost.aiGeneratedImage', null);
  const [postImage, setPostImage] = usePersistentState<CloudinaryImage | null>('createPost.postImage', null);
  
  const [isPollActive, setIsPollActive] = usePersistentState('createPost.isPollActive', false);
  const [pollOptions, setPollOptions] = usePersistentState<string[]>('createPost.pollOptions', ['', '']);
  const [pollDuration, setPollDuration] = usePersistentState('createPost.pollDuration', 1); // days
  
  // LinkedIn posting states
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingPlatform, setPublishingPlatform] = useState<'linkedin' | 'twitter' | 'facebook'>('linkedin');
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
      
      // Open schedule dialog if requested
      if (locationState.openScheduleDialog) {
        setTimeout(() => {
          setShowScheduleDialog(true);
        }, 500);
      }
    }
  }, [locationState, setContent, setHashtags, setAiGeneratedImage, setActiveTab]);
  
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
      
      let response;
      
      // Handle different post types
      if (isPollActive && pollOptions.filter(opt => opt.trim()).length >= 2) {
        // Publish as poll
        const filteredOptions = pollOptions.filter(opt => opt.trim());
        response = await linkedInApi.createPollPost(content, filteredOptions, pollDuration);
        toast.success('Poll published to LinkedIn successfully!');
      } else if (postImage) {
        // TODO: Convert Cloudinary URL to File object for upload to LinkedIn
        // For now, we'll just post as text
        toast.warning('Image posts are currently being implemented. Publishing as text post instead.');
        response = await linkedInApi.createTextPost(content, visibility);
        toast.success('Post published to LinkedIn successfully!');
      } else {
        // Simple text post
        response = await linkedInApi.createTextPost(content, visibility);
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
      
    } catch (error) {
      console.error('Error publishing to LinkedIn:', error);
      toast.error('Failed to publish to LinkedIn. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Function to save post as draft
  const saveAsDraft = async () => {
    try {
      setIsSavingDraft(true);
      
      // Validate content
      if (!content.trim()) {
        toast.error('Please add some content to your draft');
        setIsSavingDraft(false);
        return;
      }
      
      // Create draft object with all post data
      const draftPost = {
        title: content.split('\n')[0].substring(0, 50) || 'Untitled Draft',
        content: content,
        hashtags: hashtags,
        postImage: postImage,
        isPollActive: isPollActive,
        pollOptions: pollOptions,
        pollDuration: pollDuration,
        slides: slides,
        visibility: visibility,
        status: 'draft' as const,
        provider: 'linkedin',
        userId: user?.id || 'guest'
      };
      
      let savedDraft;
      
      try {
        // Try to save to backend first
        savedDraft = await linkedInApi.saveDraft(draftPost);
        toast.success('Post saved as draft to your account');
      } catch (backendError) {
        console.error('Backend save failed, using localStorage:', backendError);
        
        // Fallback to localStorage if backend fails
        const localDraftPost = {
          ...draftPost,
          id: `draft_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const existingDrafts = JSON.parse(localStorage.getItem('post_drafts') || '[]');
        existingDrafts.unshift(localDraftPost);
        localStorage.setItem('post_drafts', JSON.stringify(existingDrafts));
        
        savedDraft = localDraftPost;
        toast.success('Post saved as draft (offline mode)');
      }
      
      // Navigate to post library with draft tab active
      setTimeout(() => {
        navigate('/dashboard/posts', {
          state: { 
            activeTab: 'drafts',
            newDraft: true,
            draftId: savedDraft.id
          }
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft. Please try again.');
    } finally {
      setIsSavingDraft(false);
    }
  };
  
  // Function to schedule a post for later
  const schedulePost = async () => {
    try {
      setIsPublishing(true);
      
      // Validate content
      if (!content.trim()) {
        toast.error('Please add some content to your post');
        setIsPublishing(false);
        return;
      }
      
      // Prepare scheduled date
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      const scheduledDateTime = new Date(scheduledDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);
      
      // Validate scheduled time is in future
      if (scheduledDateTime <= new Date()) {
        toast.error('Please select a future date and time');
        setIsPublishing(false);
        return;
      }
      
      // Create scheduled post object
      const scheduledPostData = {
        title: content.split('\n')[0].substring(0, 50) || 'Scheduled Post',
        content: content,
        hashtags: hashtags,
        postImage: postImage,
        isPollActive: isPollActive,
        pollOptions: pollOptions,
        pollDuration: pollDuration,
        slides: slides,
        visibility: visibility,
        status: 'scheduled' as const,
        provider: 'linkedin',
        userId: user?.id || 'guest'
      };
      
      let savedScheduledPost;
      
      try {
        // Try to save to backend first
        savedScheduledPost = await linkedInApi.schedulePost(scheduledPostData, scheduledDateTime);
        toast.success(`Post scheduled for ${scheduledDateTime.toLocaleString()}`);
      } catch (backendError) {
        console.error('Backend scheduling failed, using localStorage:', backendError);
        
        // Fallback to localStorage if backend fails
        const localScheduledPost = {
          ...scheduledPostData,
          id: `scheduled_${Date.now()}`,
          scheduledTime: scheduledDateTime.toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const existingScheduledPosts = JSON.parse(localStorage.getItem('scheduled_posts') || '[]');
        existingScheduledPosts.unshift(localScheduledPost);
        localStorage.setItem('scheduled_posts', JSON.stringify(existingScheduledPosts));
        
        savedScheduledPost = localScheduledPost;
        toast.success(`Post scheduled for ${scheduledDateTime.toLocaleString()} (offline mode)`);
      }
      
      setShowScheduleDialog(false);
      
      // Redirect to the post library after a short delay
      setTimeout(() => {
        // Clear the form data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('state:createPost.')) {
            localStorage.removeItem(key);
          }
        });
        
        navigate('/dashboard/posts', {
          state: { 
            activeTab: 'scheduled',
            scheduled: true,
            scheduledTime: scheduledDateTime.toISOString(),
            scheduledPostId: savedScheduledPost.id
          }
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error('Failed to schedule post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };
  
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
          
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Clock size={16} />
                Schedule
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                        setScheduledDate(newDate);
                      }}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Time</label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
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
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
                <Button onClick={schedulePost} disabled={isPublishing}>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className={showSidebar ? "md:col-span-2" : "md:col-span-3"}>
          <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text Post</TabsTrigger>
              <TabsTrigger value="carousel">Carousel</TabsTrigger>
              <TabsTrigger value="document">Document</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create Text Post</CardTitle>
                  <CardDescription>
                    Write a professional text post for your LinkedIn audience
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
                            <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center" style={{ minHeight: '300px' }}>
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
                  <CardTitle>Carousel Content</CardTitle>
                  <CardDescription>
                    Create multi-slide carousel posts for higher engagement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template selection section */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Choose a Template</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {carouselTemplates.map(template => (
                        <div
                          key={template.id}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            selectedTemplate === template.id 
                              ? 'border-primary/50 bg-primary/5' 
                              : 'border-border hover:border-primary/30'
                          }`}
                          onClick={() => applyTemplate(template.id)}
                        >
                          <div className="font-medium mb-1">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.description}</div>
                          <div className="text-xs mt-1 text-muted-foreground">{template.slideCount} slides</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Show AI Generated Image if available */}
                  {aiGeneratedImage && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">AI Generated Image</label>
                      <div className="relative rounded-md overflow-hidden mb-2 border border-gray-200 dark:border-gray-700">
                        <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center" style={{ minHeight: '300px' }}>
                          <img 
                            src={aiGeneratedImage} 
                            alt="AI Generated"
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
                          onClick={() => setAiGeneratedImage(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Rest of carousel editor */}
                  <div className="space-y-4">
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
                              <CardContent className="py-2">
                                <Textarea
                                  placeholder="Slide content here..."
                                  className="min-h-[100px]"
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
                                <div className="flex items-center gap-2 mt-3">
                                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                                    <ImageIcon size={14} />
                                    Add Image
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
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
                  <div className="border-2 border-dashed rounded-lg p-10 text-center bg-neutral-lightest">
                    <FileText size={48} className="mx-auto mb-4 text-neutral-medium" />
                    <h3 className="text-lg font-medium mb-2">Upload Document</h3>
                    <p className="text-sm text-neutral-medium mb-4">
                      Drag and drop a file here, or click to browse
                    </p>
                    <Button>Select File</Button>
                  </div>
                  
                  <div className="mt-6">
                    <label className="text-sm font-medium">Add a description</label>
                    <Textarea
                      placeholder="Add a description for your document..."
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Live Preview Section */}
          <Card className="mt-6 border-primary/30">
            <CardHeader className="pb-2 bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>Your post updates in real-time as you type</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xl mx-auto preview-section bg-white dark:bg-gray-900 shadow-sm">
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
                    <h4 className="font-semibold text-[15px]">{user ? `${user.firstName} ${user.lastName}` : 'User Name'}</h4>
                    <p className="text-xs text-neutral-medium">
                      {user?.role || 'LinkedIn User'} {user?.role ? ' · ' : ''} 
                      <span className="text-blue-600">Follow</span>
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-medium mt-0.5">
                      <span>Now</span>
                      <span>•</span>
                      <Globe className="h-3 w-3" />
                      <span className="ml-auto text-[11px] text-neutral-medium">
                        <span className="text-blue-600">500+ connections</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {activeTab === 'text' && (
                  <div className="mb-4 transition-all duration-200">
                    <p className="text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line mb-3 transition-all duration-200">
                      {content || "Your post content will appear here"}
                    </p>
                    
                    {/* Display post image in preview if selected */}
                    {(postImage || aiGeneratedImage) && (
                      <div className="mb-3 rounded-lg overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-800">
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
                      <div className="mb-3 border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm font-medium mb-2">Poll ({pollDuration} day{pollDuration > 1 ? 's' : ''})</p>
                        <div className="space-y-2">
                          {pollOptions.filter(opt => opt.trim()).map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border border-primary flex-shrink-0"></div>
                              <span className="text-sm">{option || `Option ${index + 1}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {hashtags.map(tag => (
                        <span key={tag} className="text-blue-600 dark:text-blue-500 text-[13px] hover:underline cursor-pointer">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'carousel' && (
                  <div className="mb-4">
                    <CarouselPreview slides={slides} variant={sliderType} />
                  </div>
                )}
                
                {activeTab === 'document' && (
                  <div className="bg-neutral-lightest border rounded-lg p-6 mb-4 text-center">
                    <FileText size={40} className="mx-auto mb-2 text-neutral-medium" />
                    <p className="text-sm text-neutral-medium">Document Preview</p>
                  </div>
                )}
                
                {/* LinkedIn engagement stats */}
                <div className="flex items-center gap-1 text-neutral-medium text-xs mb-1 pt-2">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">👍</div>
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">❤️</div>
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white">👏</div>
                  </div>
                  <span className="ml-1 hover:text-blue-600 hover:underline cursor-pointer">You and 24 others</span>
                  <span className="mx-1">•</span>
                  <span className="hover:text-blue-600 hover:underline cursor-pointer">8 comments</span>
                </div>
                
                <div className="flex items-center justify-between text-neutral-medium text-sm pt-3 border-t">
                  <div className="flex w-full justify-between">
                    <button className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors py-1 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 group flex-1">
                      <ThumbsUp size={18} className="group-hover:animate-pulse" />
                      <span className="text-xs font-medium">Like</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:text-green-600 transition-colors py-1 px-3 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 flex-1">
                      <MessageSquare size={18} />
                      <span className="text-xs font-medium">Comment</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:text-orange-600 transition-colors py-1 px-3 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 flex-1">
                      <Share2 size={18} />
                      <span className="text-xs font-medium">Repost</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 hover:text-purple-600 transition-colors py-1 px-3 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 flex-1">
                      <Forward size={18} />
                      <span className="text-xs font-medium">Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar / AI Tools Panel */}
        {showSidebar && (
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tools & Templates</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSidebar}
                    className="hidden md:flex"
                  >
                    <PanelLeftClose size={16} />
                  </Button>
                </div>
                <CardDescription>
                  Enhance your content with these tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Sparkles size={16} className="text-amber-500" />
                        AI Assistance
                      </h3>
                      <div className="space-y-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full justify-start text-sm"
                          onClick={() => navigate('/dashboard/ai-writer')}
                        >
                          <Wand2 className="h-3.5 w-3.5 mr-2" />
                          Go to AI Writer
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Generate a professional post
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Improve writing style
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Create catchy hook
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Suggest hashtags
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Users size={16} className="text-primary" />
                        Audience Targeting
                      </h3>
                      <Select defaultValue="professionals">
                        <SelectTrigger>
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professionals">General Professionals</SelectItem>
                          <SelectItem value="recruiters">Recruiters & HR</SelectItem>
                          <SelectItem value="tech">Tech Industry</SelectItem>
                          <SelectItem value="marketing">Marketing Professionals</SelectItem>
                          <SelectItem value="executives">Executives & Leaders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <BarChart size={16} className="text-accent" />
                        Engagement Tips
                      </h3>
                      <div className="bg-accent-50 rounded-lg p-3 text-sm">
                        <ul className="list-disc list-inside space-y-1">
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
                      <h3 className="text-sm font-medium mb-2">Carousel Templates</h3>
                      <ScrollArea className="h-[330px]">
                        <div className="space-y-2 pr-4">
                          {carouselTemplates.map(template => (
                            <div 
                              key={template.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                selectedTemplate === template.id 
                                  ? 'bg-primary-50 border-primary' 
                                  : 'hover:bg-neutral-lightest'
                              }`}
                              onClick={() => applyTemplate(template.id)}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{template.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {template.slideCount} slides
                                </Badge>
                              </div>
                              <p className="text-xs text-neutral-medium">{template.description}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Sparkles size={16} className="text-amber-500" />
                        AI Carousel Helper
                      </h3>
                      <div className="space-y-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full justify-start text-sm"
                          onClick={() => navigate('/dashboard/ai-writer')}
                        >
                          <Wand2 className="h-3.5 w-3.5 mr-2" />
                          Go to AI Writer
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Generate carousel content
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Improve slide formatting
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Optimize for readability
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'document' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Document Tips</h3>
                      <div className="bg-primary-50 rounded-lg p-3 text-sm">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Use PDFs for best compatibility</li>
                          <li>Ensure document is under 100MB</li>
                          <li>Use landscape orientation for presentations</li>
                          <li>Add your branding and contact info</li>
                        </ul>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Post Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Add description</label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">First page as thumbnail</label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Show document pages</label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Scheduling Card */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle>Schedule Post</CardTitle>
                <CardDescription>
                  Choose when to publish your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Input type="time" className="mt-1" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <BarChart size={16} className="text-primary" />
                      Best Time To Post
                    </h3>
                    <div className="bg-primary-50 rounded-lg p-3 text-sm">
                      <p>Based on your audience, the best times to post are:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>Tuesday 9-11 AM</li>
                        <li>Wednesday 1-3 PM</li>
                        <li>Thursday 8-10 AM</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {isPollActive && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
          <h3 className="text-sm font-medium mb-3">Poll Options</h3>
          <div className="space-y-3">
            {pollOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
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
                className="w-full"
              >
                Add Option
              </Button>
            )}
            
            <div className="mt-3">
              <label className="block text-sm mb-1">Poll Duration</label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
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