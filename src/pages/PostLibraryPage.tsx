import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  File,
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock,
  MoreHorizontal,
  PencilLine,
  Copy,
  Trash2,
  Share2,
  Image as ImageIcon,
  BarChart4,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  BarChart2,
  AlertCircle,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { linkedInApi } from '@/utils/linkedinApi';
import { CloudinaryImage } from '@/utils/cloudinaryDirectUpload';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { tokenManager } from '@/services/api';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define interfaces for post types
interface BasePost {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  createdAt?: string;
  updatedAt?: string;
  slides?: {id: string, content: string, imageUrl?: string, cloudinaryImage?: any}[];
  postImage?: CloudinaryImage;
  isPollActive?: boolean;
  pollOptions?: string[];
  pollDuration?: number;
  hashtags?: string[];
  visibility?: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN';
  provider?: string;
  userId?: string;
  isCarousel?: boolean;
  slideCount?: number;
  status?: 'draft' | 'scheduled' | 'published';
  mediaType?: string;
  platformPostId?: string;
}

interface DraftPost extends BasePost {
  date?: string; // for UI display
}

interface ScheduledPost extends BasePost {
  scheduledTime?: string;
  scheduledDate?: string; // for UI display
}

interface PublishedPost extends BasePost {
  publishedDate?: string;
}

// Create a separate component for carousel slides
const CarouselCard: React.FC<{ 
  slides: {id: string, content: string, imageUrl?: string, cloudinaryImage?: any}[]
}> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const nextSlide = () => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // If no slides or empty array, render nothing or a placeholder
  if (!slides || slides.length === 0) {
    return <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-white min-h-[280px] flex items-center justify-center">
      <p className="text-gray-400">No slides available</p>
    </div>;
  }

  return (
    <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">
      <div className="relative min-h-[280px] w-full">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Slide Image */}
            {slide.cloudinaryImage && (
              <img 
                src={slide.cloudinaryImage.secure_url} 
                alt={`Slide ${index + 1}`}
                className="w-full object-contain max-h-[240px]"
              />
            )}
            
            {/* Slide Content */}
            <div className="p-3 bg-white text-sm">
              {slide.content}
            </div>
          </div>
        ))}
        
        {/* Carousel Navigation Buttons */}
        {slides.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/70 flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/70 flex items-center justify-center"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      
      {/* Carousel indicator */}
      <div className="flex gap-1 justify-center my-2">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full ${i === currentSlide ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-300'}`}
            onClick={() => setCurrentSlide(i)}
          ></div>
        ))}
      </div>
    </div>
  );
};

const PostLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as any;
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(locationState?.activeTab || 'drafts');
  const [isLoading, setIsLoading] = useState(true);
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledPost[]>([]);
  const [published, setPublished] = useState<PublishedPost[]>([]);
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [linkedInAuthError, setLinkedInAuthError] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  
  // State for scheduling dialog
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDraftForScheduling, setSelectedDraftForScheduling] = useState<DraftPost | null>(null);
  const [scheduledDate, setScheduledDate] = useState(() => {
    // Use current date as default, ensuring it's at the start of the day in the local timezone
    const now = new Date();
    // Reset time to midnight to avoid timezone issues
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [scheduleTime, setScheduleTime] = useState(() => {
    // Set current time as default, plus 15 minutes
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
  const [visibility, setVisibility] = useState<'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN'>('PUBLIC');
  const [isScheduling, setIsScheduling] = useState(false);
  
  // Effect to switch to the correct tab when navigating from another page
  useEffect(() => {
    if (locationState) {
      // When redirected from create post page
      if (locationState.activeTab) {
        setActiveTab(locationState.activeTab);
      } else if (locationState.newPost) {
        // When a new post was created, switch to published tab
        setActiveTab('published');
      } else if (locationState.scheduled) {
        // When a post was scheduled
        setActiveTab('scheduled');
      } else if (locationState.newDraft) {
        // When a new draft was created
        setActiveTab('drafts');
      }
    }
  }, [locationState]);
  
  // Effect to load data when component mounts or when activeTab changes due to navigation
  useEffect(() => {
    loadUserContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Add an effect to reload data when the active tab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
    loadUserContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
  
  // Function to migrate posts from localStorage to database
  const migrateLocalPosts = async () => {
    try {
      setIsMigrating(true);
      toast.info('Migrating posts to the database...');
      
      const result = await linkedInApi.migrateLocalPostsToDatabase();
      
      if (result.success) {
        toast.success(`Successfully migrated ${result.migratedCount} posts to the database`);
        // Reload posts from the server
        await loadUserContent();
      } else {
        toast.error('Failed to migrate some posts. Please try again later.');
      }
    } catch (error) {
      console.error('Error migrating posts:', error);
      toast.error('Failed to migrate posts. Please try again later.');
    } finally {
      setIsMigrating(false);
    }
  };
  
  // Function to handle LinkedIn reconnection
  const handleConnectLinkedIn = () => {
    // Get the backend URL from environment variable or fallback to Render deployed URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Store current URL in localStorage to redirect back after LinkedIn connection
    localStorage.setItem('redirectAfterAuth', '/dashboard/posts');
    
    // Redirect to LinkedIn OAuth endpoint
    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
  };
  
  // Separate function to determine if a post is actually a carousel post
  const isCarouselPost = (post: BasePost): boolean => {
    return post.slides !== undefined && 
           Array.isArray(post.slides) && 
           post.slides.length > 0 && 
           post.slides.some(slide => slide.cloudinaryImage?.secure_url || slide.imageUrl);
  };
  
  // Load user content from API
  const loadUserContent = async () => {
    try {
      setIsLoading(true);
      
      // Check for LinkedIn authentication directly from localStorage
      const linkedInToken = localStorage.getItem('linkedin-login-token');
      
      if (!linkedInToken) {
        setLinkedInAuthError(true);
        toast.error('LinkedIn authentication required to load your content');
        return;
      }
      
      try {
        // First attempt to load content from the backend API
        const draftData = await linkedInApi.getDBPosts('draft');
        const scheduledData = await linkedInApi.getDBPosts('scheduled');
        const publishedData = await linkedInApi.getDBPosts('published');

        console.log('Published data from API:', publishedData);

        // Convert backend data to the format expected by the UI
        const draftPosts: DraftPost[] = draftData?.data?.map((post: any) => ({
          id: post._id,
          title: post.title || 'Draft Post',
          content: post.content,
          excerpt: post.content?.substring(0, 100) + '...',
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          slides: post.slides || [],
          postImage: post.postImage,
          isPollActive: post.isPollActive,
          pollOptions: post.pollOptions,
          hashtags: post.hashtags,
          visibility: post.visibility,
          provider: post.platform,
          status: 'draft',
          date: new Date(post.createdAt).toLocaleDateString(),
          platformPostId: post.platformPostId
        })) || [];

        const scheduledPosts: ScheduledPost[] = scheduledData?.data?.map((post: any) => ({
          id: post._id,
          title: post.title || 'Scheduled Post',
          content: post.content,
          excerpt: post.content?.substring(0, 100) + '...',
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          scheduledTime: post.scheduledTime,
          slides: post.slides || [],
          postImage: post.postImage,
          isPollActive: post.isPollActive,
          pollOptions: post.pollOptions,
          hashtags: post.hashtags,
          visibility: post.visibility,
          provider: post.platform,
          status: 'scheduled',
          scheduledDate: new Date(post.scheduledTime).toLocaleDateString(),
          platformPostId: post.platformPostId
        })) || [];

        // Ensure all properties from the API response are correctly mapped
        const publishedPosts: PublishedPost[] = publishedData?.data?.map((post: any) => {
          // Determine if this is actually a carousel post by checking slides
          const hasValidSlides = post.slides && 
                                 Array.isArray(post.slides) && 
                                 post.slides.length > 0 && 
                                 post.slides.some(slide => slide.cloudinaryImage?.secure_url || slide.imageUrl);
                                 
          // Determine the media type
          let mediaType = 'none';
          if (hasValidSlides) {
            mediaType = 'carousel';
          } else if (post.postImage && post.postImage.secure_url) {
            mediaType = 'image';
          }
          
          console.log(`Post ${post._id} media type: ${mediaType}, hasValidSlides: ${hasValidSlides}`);
          
          return {
            id: post._id,
            title: post.title || 'Published Post',
            content: post.content,
            excerpt: post.content?.substring(0, 100) + '...',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            publishedDate: post.publishedTime 
              ? new Date(post.publishedTime).toLocaleDateString() 
              : new Date(post.updatedAt).toLocaleDateString(),
            slides: post.slides || [],
            postImage: post.postImage,
            isPollActive: post.isPollActive,
            pollOptions: post.pollOptions,
            hashtags: post.hashtags,
            visibility: post.visibility,
            provider: post.platform,
            status: 'published',
            isCarousel: hasValidSlides,
            slideCount: post.slides?.length || 0,
            mediaType: mediaType,
            platformPostId: post.platformPostId
          };
        }) || [];

        console.log('Processed published posts:', publishedPosts);

        // Update state with API data
        setDrafts(draftPosts);
        setScheduled(scheduledPosts);
        setPublished(publishedPosts);
        
        // Create a map of existing draft IDs for efficient lookup
        const existingDraftIds = new Set(draftPosts.map(draft => draft.id));
        // Also track content hashes to identify duplicates with different IDs
        const contentHashes = new Map<string, boolean>();
        draftPosts.forEach(draft => {
          // Create a simple hash of content to identify similar drafts
          const contentHash = draft.content ? `${draft.content.substring(0, 50)}` : '';
          if (contentHash) contentHashes.set(contentHash, true);
        });
        
        // Create a map of existing scheduled post IDs
        const existingScheduledIds = new Set(scheduledPosts.map(post => post.id));
        const scheduledContentHashes = new Map<string, boolean>();
        scheduledPosts.forEach(post => {
          const contentHash = post.content ? `${post.content.substring(0, 50)}` : '';
          if (contentHash) scheduledContentHashes.set(contentHash, true);
        });
        
        // Always check localStorage for any local drafts or scheduled posts
        console.log("Checking localStorage for any additional posts...");
        
        // Scan localStorage for saved drafts and scheduled posts
        const localDrafts: DraftPost[] = [];
        const localScheduledPosts: ScheduledPost[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('draft_')) {
            try {
              const draftData = JSON.parse(localStorage.getItem(key) || '{}');
              if (draftData.id) {
                // Check if this draft is already in our API data (avoid duplicates)
                if (!existingDraftIds.has(draftData.id)) {
                  // Also check for content duplicates
                  const contentHash = draftData.content ? `${draftData.content.substring(0, 50)}` : '';
                  if (!contentHash || !contentHashes.has(contentHash)) {
                localDrafts.push(draftData);
                    // Add this content hash to our tracking map
                    if (contentHash) contentHashes.set(contentHash, true);
                  } else {
                    console.log('Skipping duplicate draft based on content:', draftData.id);
                    // Clean up duplicate from localStorage
                    localStorage.removeItem(key);
                  }
                } else {
                  console.log('Skipping duplicate draft with ID:', draftData.id);
                  // Clean up duplicate from localStorage
                  localStorage.removeItem(key);
                }
              }
            } catch (e) {
              console.error('Error parsing draft:', e);
            }
          } else if (key?.startsWith('scheduled_')) {
            try {
              const scheduledData = JSON.parse(localStorage.getItem(key) || '{}');
              if (scheduledData.id) {
                // Check if this scheduled post is already in our API data
                if (!existingScheduledIds.has(scheduledData.id)) {
                  // Also check for content duplicates
                  const contentHash = scheduledData.content ? `${scheduledData.content.substring(0, 50)}` : '';
                  if (!contentHash || !scheduledContentHashes.has(contentHash)) {
                    localScheduledPosts.push(scheduledData);
                    // Add this content hash to our tracking map
                    if (contentHash) scheduledContentHashes.set(contentHash, true);
                  } else {
                    console.log('Skipping duplicate scheduled post based on content:', scheduledData.id);
                    // Clean up duplicate from localStorage
                    localStorage.removeItem(key);
                  }
                } else {
                  console.log('Skipping duplicate scheduled post with ID:', scheduledData.id);
                  // Clean up duplicate from localStorage
                  localStorage.removeItem(key);
                }
              }
            } catch (e) {
              console.error('Error parsing scheduled post:', e);
            }
          }
        }
        
        // Merge local data with API data
        if (localDrafts.length > 0) setDrafts(prev => [...prev, ...localDrafts]);
        if (localScheduledPosts.length > 0) setScheduled(prev => [...prev, ...localScheduledPosts]);
        
      } catch (apiError: any) {
        console.error('Error loading content:', apiError);
        toast.error('Failed to load your content');
        
        // Fallback to localStorage if API fails
        fallbackToLocalStorage();
      }
    } catch (error) {
      console.error('Error in loadUserContent:', error);
      toast.error('Failed to load content');
      
      // Also fallback to localStorage in case of general error
      fallbackToLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to fallback to localStorage if API fails
  const fallbackToLocalStorage = () => {
    console.log("Falling back to localStorage for posts...");
    
    // Scan localStorage for saved drafts, scheduled posts, and published posts
    const localDrafts: DraftPost[] = [];
    const localScheduledPosts: ScheduledPost[] = [];
    
    // Create maps to track content hashes for deduplication
    const contentHashesMap = new Map<string, boolean>();
    const scheduledContentHashesMap = new Map<string, boolean>();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('draft_')) {
        try {
          const draftData = JSON.parse(localStorage.getItem(key) || '{}');
          if (draftData.id) {
            // Create a simple content hash for deduplication
            const contentHash = draftData.content ? `${draftData.content.substring(0, 50)}` : '';
            if (!contentHash || !contentHashesMap.has(contentHash)) {
              localDrafts.push(draftData);
              if (contentHash) contentHashesMap.set(contentHash, true);
            } else {
              console.log('Skipping duplicate draft in localStorage:', draftData.id);
              // Clean up duplicate
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          console.error('Error parsing draft:', e);
        }
      } else if (key?.startsWith('scheduled_')) {
        try {
          const scheduledData = JSON.parse(localStorage.getItem(key) || '{}');
          if (scheduledData.id) {
            // Create a simple content hash for deduplication
            const contentHash = scheduledData.content ? `${scheduledData.content.substring(0, 50)}` : '';
            if (!contentHash || !scheduledContentHashesMap.has(contentHash)) {
              localScheduledPosts.push(scheduledData);
              if (contentHash) scheduledContentHashesMap.set(contentHash, true);
            } else {
              console.log('Skipping duplicate scheduled post in localStorage:', scheduledData.id);
              // Clean up duplicate
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          console.error('Error parsing scheduled post:', e);
        }
      }
    }
    
    // Update state with localStorage data
    if (localDrafts.length > 0) setDrafts(localDrafts);
    if (localScheduledPosts.length > 0) setScheduled(localScheduledPosts);
  };
  
  // Edit a draft - delete old draft when navigating to edit
  const editDraft = (draftId: string) => {
    // Find the draft
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    // Set up the form data in localStorage
    Object.entries(draft).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'status') {
        localStorage.setItem(`state:createPost.${key}`, JSON.stringify(value));
      }
    });
    
    // Store the original draft ID so we can delete it when saving the edited version
    localStorage.setItem('editingDraftId', draftId);
    
    // Navigate to the create post page
    navigate('/dashboard/post');
  };
  
  // Delete a draft
  const deleteDraft = async (draftId: string) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      setIsDeleting(true);
      
      // Immediately update UI by removing from state
      const updatedDrafts = drafts.filter(d => d.id !== draftId);
      setDrafts(updatedDrafts);
      
      // Check if it's a local draft
      if (draftId.startsWith('draft_')) {
        // Remove from localStorage
        localStorage.removeItem(draftId);
      toast.success('Draft deleted successfully');
      } else {
        // Delete from backend API
        await linkedInApi.deleteDBPost(draftId);
        toast.success('Draft deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
      
      // Restore draft to the state if API call failed
      const draft = drafts.find(d => d.id === draftId);
      if (draft) {
        setDrafts(prevDrafts => [...prevDrafts, draft]);
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Schedule a draft
  const scheduleDraft = async (draftId: string) => {
    // Find the draft
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    // Open the scheduling dialog with this draft
    openScheduleDialog(draft);
  };
  
  // Edit a scheduled post - delete old scheduled post when navigating to edit
  const editScheduledPost = async (postId: string) => {
    // Find the scheduled post
    const post = scheduled.find(p => p.id === postId);
    if (!post) return;
    
    // Immediately update UI - remove from scheduled
    const updatedScheduled = scheduled.filter(p => p.id !== postId);
    setScheduled(updatedScheduled);
    
    // Clean up any existing localStorage values to prevent issues
    localStorage.removeItem('state:createPost.postImage');
    localStorage.removeItem('state:createPost.slides');
    localStorage.removeItem('state:createPost.scheduledDate');
    localStorage.removeItem('state:createPost.scheduleTime');
    
    // Set up the form data in localStorage
    Object.entries(post).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'status' && key !== 'scheduledTime') {
        // Make sure we don't store null/undefined values
        if (value !== null && value !== undefined) {
        localStorage.setItem(`state:createPost.${key}`, JSON.stringify(value));
        } else {
          // Remove the key if it exists to avoid parsing errors
          localStorage.removeItem(`state:createPost.${key}`);
        }
      }
    });
    
    // For the scheduledTime, we need to handle it specially
    if (post.scheduledTime) {
      const scheduledDate = new Date(post.scheduledTime);
      // Format hours and minutes as HH:MM
      const hours = scheduledDate.getHours().toString().padStart(2, '0');
      const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
      localStorage.setItem('state:createPost.scheduleTime', JSON.stringify(`${hours}:${minutes}`));
      
      // Also store the actual date
      localStorage.setItem('state:createPost.scheduledDate', JSON.stringify(scheduledDate.toISOString()));
    }
    
    try {
      // If it's a local scheduled post, remove from localStorage 
      if (postId.startsWith('scheduled_')) {
        localStorage.removeItem(postId);
      } else {
        // Remove from backend API
        await linkedInApi.deleteDBPost(postId);
      }
      
      // Store the original scheduled post ID
      localStorage.setItem('editingScheduledId', postId);
      
      // Navigate to create post page with schedule dialog open
    navigate('/dashboard/post', { state: { openScheduleDialog: true } });
    } catch (error) {
      console.error('Error removing scheduled post:', error);
      toast.error('Failed to edit scheduled post. Please try again later.');
      
      // Restore scheduled post to state if there was an error
      if (post) {
        setScheduled(prevScheduled => [...prevScheduled, post]);
      }
    }
  };
  
  // Delete a scheduled post
  const deleteScheduledPost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled post?')) return;
    
    try {
      setIsDeleting(true);
      
      // Immediately update UI - remove from scheduled
      const updatedScheduled = scheduled.filter(p => p.id !== postId);
      setScheduled(updatedScheduled);
      
      // Check if it's a local scheduled post
      if (postId.startsWith('scheduled_')) {
        // Remove from localStorage
        localStorage.removeItem(postId);
      toast.success('Scheduled post cancelled');
      } else {
        // Delete from backend API
        await linkedInApi.deleteDBPost(postId);
        toast.success('Scheduled post cancelled');
      }
    } catch (error) {
      console.error('Error cancelling scheduled post:', error);
      toast.error('Failed to cancel scheduled post');
      
      // Restore scheduled post to state if API call failed
      const post = scheduled.find(p => p.id === postId);
      if (post) {
        setScheduled(prevScheduled => [...prevScheduled, post]);
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Publish a draft directly
  const publishDraft = async (draftId: string) => {
    if (!window.confirm('Are you sure you want to publish this draft to LinkedIn now?')) return;
    
    try {
      setIsPublishing(true);
      
    // Find the draft
    const draft = drafts.find(d => d.id === draftId);
      
      if (!draft) {
        throw new Error('Draft not found');
      }
      
      // Immediately remove from drafts in UI
      const updatedDrafts = drafts.filter(d => d.id !== draftId);
      setDrafts(updatedDrafts);
      
      // Create a temporary published post to show immediately
      const tempPublishedPost: PublishedPost = {
        id: `temp_${draftId}`,
        title: draft.title || 'Publishing...',
        content: draft.content,
        excerpt: draft.content?.substring(0, 100) + '...',
        publishedDate: new Date().toLocaleDateString(),
        isCarousel: draft.slides && draft.slides.length > 0,
        slideCount: draft.slides?.length || 0,
        status: 'published',
        postImage: draft.postImage,
        hashtags: draft.hashtags,
        isPollActive: draft.isPollActive,
        pollOptions: draft.pollOptions,
        platformPostId: draft.platformPostId
      };
      
      // Add the temp published post to the state
      setPublished(prevPublished => [tempPublishedPost, ...prevPublished]);
      
      // Switch to published tab immediately
      setActiveTab('published');
      
      // First, check if we need to migrate this post
      const isLocalPost = draftId.startsWith('draft_');
      
      // First migrate local posts to the database before publishing
      if (isLocalPost) {
        try {
          console.log('Migrating local draft before publishing');
          // Use the single post migration function
          const migrationResult = await linkedInApi.migrateSinglePostToDatabase(draft);
          
          if (migrationResult.success && migrationResult.migratedPost) {
            // Get the database ID of the migrated post
            const dbPostId = migrationResult.migratedPost.dbId;
            
            if (!dbPostId) {
              throw new Error('Failed to get database ID for migrated post');
            }
            
            console.log('Local post migrated successfully, publishing with DB ID:', dbPostId);
            
            // Now publish the migrated post
            const publishResponse = await linkedInApi.publishDBPost(dbPostId);
            
            if (publishResponse.success) {
              // Remove from localStorage
              localStorage.removeItem(draftId);
              
              // Remove the temporary post
              const updatedPublished = published.filter(p => p.id !== `temp_${draftId}`);
              
              // Create a real published post object for the UI
      const publishedPost: PublishedPost = {
                id: publishResponse.data._id,
        title: draft.title || 'Published Post',
                content: draft.content,
        excerpt: draft.content?.substring(0, 100) + '...',
        publishedDate: new Date().toLocaleDateString(),
        isCarousel: draft.slides && draft.slides.length > 0,
        slideCount: draft.slides?.length || 0,
        status: 'published',
        postImage: draft.postImage,
        hashtags: draft.hashtags,
        isPollActive: draft.isPollActive,
        pollOptions: draft.pollOptions,
        platformPostId: draft.platformPostId
      };
      
              // Update the published posts state
              setPublished([publishedPost, ...updatedPublished]);
      toast.success('Post published to LinkedIn successfully');
              
              // Reload user content to ensure all data is updated
              await loadUserContent();
            } else {
              throw new Error('Failed to publish post after migration');
            }
          } else {
            throw new Error('Failed to migrate post');
          }
        } catch (migrationError) {
          console.error('Error publishing draft after migration:', migrationError);
          toast.error('Failed to publish post: ' + (migrationError.message || 'Unknown error'));
          
          // Restore the draft to the state
          setDrafts(prevDrafts => [draft, ...prevDrafts]);
          
          // Remove the temporary published post
          setPublished(prevPublished => prevPublished.filter(p => p.id !== `temp_${draftId}`));
        }
      } else {
        // For database-backed posts, publish directly
        try {
          const response = await linkedInApi.publishDBPost(draftId);
          
          console.log('Published post response:', response);
          
          if (response.success && response.data) {
            // Remove the temporary post
            const updatedPublished = published.filter(p => p.id !== `temp_${draftId}`);
            
            // Create a published post object for the UI based on the API response
            const publishedPost: PublishedPost = {
              id: response.data._id || draftId,
              title: response.data.title || draft.title || 'Published Post',
              content: response.data.content || draft.content,
              excerpt: (response.data.content || draft.content)?.substring(0, 100) + '...',
              publishedDate: response.data.publishedTime 
                ? new Date(response.data.publishedTime).toLocaleDateString() 
                : new Date().toLocaleDateString(),
              isCarousel: draft.slides && draft.slides.length > 0,
              slideCount: draft.slides?.length || 0,
              status: 'published',
              postImage: response.data.postImage || draft.postImage,
              hashtags: response.data.hashtags || draft.hashtags,
              isPollActive: response.data.isPollActive || draft.isPollActive,
              pollOptions: response.data.pollOptions || draft.pollOptions,
              platformPostId: draft.platformPostId
            };
            
            // Update the published posts state
            setPublished([publishedPost, ...updatedPublished]);
            toast.success('Post published to LinkedIn successfully');
            
            // Reload user content to make sure all data is up to date
            await loadUserContent();
            
            // Force reload after a short delay to ensure backend state is reflected
            setTimeout(() => {
              loadUserContent();
            }, 1000);
          } else {
            throw new Error('Invalid response from server when publishing post');
          }
        } catch (error) {
          console.error('Error publishing draft:', error);
          toast.error('Failed to publish post: ' + (error.message || 'Unknown error'));
          
          // Restore the draft to the state
          setDrafts(prevDrafts => [draft, ...prevDrafts]);
          
          // Remove the temporary published post
          setPublished(prevPublished => prevPublished.filter(p => p.id !== `temp_${draftId}`));
        }
      }
    } catch (error) {
      console.error('Error publishing draft:', error);
      toast.error('Failed to publish post: ' + (error.message || 'Unknown error'));
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Publish a scheduled post immediately
  const publishScheduledPost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to publish this scheduled post to LinkedIn now?')) return;
    
    try {
      setIsPublishing(true);
      
      // Find the scheduled post
      const scheduledPost = scheduled.find(p => p.id === postId);
      
      if (!scheduledPost) {
        throw new Error('Scheduled post not found');
      }
      
      // Immediately remove from scheduled in UI
      const updatedScheduled = scheduled.filter(p => p.id !== postId);
      setScheduled(updatedScheduled);
      
      // Create a temporary published post to show immediately
      const tempPublishedPost: PublishedPost = {
        id: `temp_${postId}`,
        title: scheduledPost.title || 'Publishing...',
        content: scheduledPost.content,
        excerpt: scheduledPost.content?.substring(0, 100) + '...',
        publishedDate: new Date().toLocaleDateString(),
        isCarousel: scheduledPost.slides && scheduledPost.slides.length > 0,
        slideCount: scheduledPost.slides?.length || 0,
        status: 'published',
        postImage: scheduledPost.postImage,
        hashtags: scheduledPost.hashtags,
        isPollActive: scheduledPost.isPollActive,
        pollOptions: scheduledPost.pollOptions,
        platformPostId: scheduledPost.platformPostId
      };
      
      // Add the temp published post to the state
      setPublished(prevPublished => [tempPublishedPost, ...prevPublished]);
      
      // Switch to published tab immediately
      setActiveTab('published');
      
      // First, check if we need to migrate this post
      const isLocalPost = postId.startsWith('scheduled_');
      
      // First migrate local posts to the database before publishing
      if (isLocalPost) {
        try {
          console.log('Migrating local scheduled post before publishing');
          // Use the single post migration function
          const migrationResult = await linkedInApi.migrateSinglePostToDatabase(scheduledPost);
          
          if (migrationResult.success && migrationResult.migratedPost) {
            // Get the database ID of the migrated post
            const dbPostId = migrationResult.migratedPost.dbId;
            
            if (!dbPostId) {
              throw new Error('Failed to get database ID for migrated post');
            }
            
            console.log('Local post migrated successfully, publishing with DB ID:', dbPostId);
            
            // Now publish the migrated post
            const publishResponse = await linkedInApi.publishDBPost(dbPostId);
            
            if (publishResponse.success) {
              // Remove from localStorage
              localStorage.removeItem(postId);
              
              // Remove the temporary post
              const updatedPublished = published.filter(p => p.id !== `temp_${postId}`);
              
              // Create a real published post object for the UI
              const publishedPost: PublishedPost = {
                id: publishResponse.data._id,
                title: scheduledPost.title || 'Published Post',
                content: scheduledPost.content,
                excerpt: scheduledPost.content?.substring(0, 100) + '...',
                publishedDate: new Date().toLocaleDateString(),
                isCarousel: scheduledPost.slides && scheduledPost.slides.length > 0,
                slideCount: scheduledPost.slides?.length || 0,
                status: 'published',
                postImage: scheduledPost.postImage,
                hashtags: scheduledPost.hashtags,
                isPollActive: scheduledPost.isPollActive,
                pollOptions: scheduledPost.pollOptions,
                platformPostId: scheduledPost.platformPostId
              };
              
              // Update the published posts state
              setPublished([publishedPost, ...updatedPublished]);
              toast.success('Post published to LinkedIn successfully');
              
              // Reload user content to ensure all data is updated
              await loadUserContent();
              
              // Force reload after a short delay to ensure backend state is reflected
              setTimeout(() => {
                loadUserContent();
              }, 1000);
            } else {
              throw new Error('Failed to publish post after migration');
            }
          } else {
            throw new Error('Failed to migrate post');
          }
        } catch (migrationError) {
          console.error('Error publishing scheduled post after migration:', migrationError);
          toast.error('Failed to publish post: ' + (migrationError.message || 'Unknown error'));
          
          // Restore the scheduled post to the state
          setScheduled(prevScheduled => [scheduledPost, ...prevScheduled]);
          
          // Remove the temporary published post
          setPublished(prevPublished => prevPublished.filter(p => p.id !== `temp_${postId}`));
        }
      } else {
        // For database-backed posts, publish directly
        try {
          const response = await linkedInApi.publishDBPost(postId);
          
          console.log('Published scheduled post response:', response);
          
          if (response.success && response.data) {
            // Remove the temporary post
            const updatedPublished = published.filter(p => p.id !== `temp_${postId}`);
            
            // Create a published post object for the UI based on the API response
            const publishedPost: PublishedPost = {
              id: response.data._id || postId,
              title: response.data.title || scheduledPost.title || 'Published Post',
              content: response.data.content || scheduledPost.content,
              excerpt: (response.data.content || scheduledPost.content)?.substring(0, 100) + '...',
              publishedDate: response.data.publishedTime 
                ? new Date(response.data.publishedTime).toLocaleDateString() 
                : new Date().toLocaleDateString(),
              isCarousel: scheduledPost.slides && scheduledPost.slides.length > 0,
              slideCount: scheduledPost.slides?.length || 0,
              status: 'published',
              postImage: response.data.postImage || scheduledPost.postImage,
              hashtags: response.data.hashtags || scheduledPost.hashtags,
              isPollActive: response.data.isPollActive || scheduledPost.isPollActive,
              pollOptions: response.data.pollOptions || scheduledPost.pollOptions,
              platformPostId: scheduledPost.platformPostId
            };
            
            // Update the published posts state
            setPublished([publishedPost, ...updatedPublished]);
            toast.success('Scheduled post published to LinkedIn successfully');
            
            // Reload user content to make sure all data is up to date
            await loadUserContent();
            
            // Force reload after a short delay to ensure backend state is reflected
            setTimeout(() => {
              loadUserContent();
            }, 1000);
          } else {
            throw new Error('Invalid response from server when publishing post');
          }
        } catch (error) {
          console.error('Error publishing scheduled post:', error);
          toast.error('Failed to publish post: ' + (error.message || 'Unknown error'));
          
          // Restore the scheduled post to the state
          setScheduled(prevScheduled => [scheduledPost, ...prevScheduled]);
          
          // Remove the temporary published post
          setPublished(prevPublished => prevPublished.filter(p => p.id !== `temp_${postId}`));
        }
      }
    } catch (error) {
      console.error('Error publishing scheduled post:', error);
      toast.error('Failed to publish post: ' + (error.message || 'Unknown error'));
    } finally {
      setIsPublishing(false);
    }
  };
  
  const editPublishedPost = async (post: BasePost) => {
    if (!post || !post.id) {
      toast.error('Cannot edit post. Post data is missing.');
      return;
    }
    
    const confirmed = window.confirm('Are you sure you want to edit this published post? Changes will also be reflected on LinkedIn.');
    if (!confirmed) return;
    
    try {
      setIsLoading(true);
      // Get the latest post data from LinkedIn to ensure we're working with the most up-to-date version
      const response = await linkedInApi.getPostById(post.id);
      if (!response || !response.data) {
        toast.error('Failed to retrieve the latest post data');
        setIsLoading(false);
        return;
      }
      
      // Store the post data in localStorage for editing
      const formData = {
        ...response.data,
        id: post.id,
        isEditing: true,
        originalPost: post
      };
      
      localStorage.setItem('linkedinPostFormData', JSON.stringify(formData));
      
      // Navigate to the post creation page with editing state
      navigate('/create-post', { 
        state: { 
          fromEdit: true, 
          postId: post.id, 
          platform: 'linkedin',
          isPublished: true 
        } 
      });
    } catch (error) {
      console.error('Error preparing post for edit:', error);
      toast.error('Failed to prepare post for editing');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePublishedPost = async (post: BasePost) => {
    if (!post || !post.id) {
      toast.error('Cannot delete post. Post data is missing.');
      return;
    }
    
    const confirmed = window.confirm('Are you sure you want to delete this published post? It will also be removed from LinkedIn.');
    if (!confirmed) return;
    
    try {
      setIsDeleting(true);
      
      // Optimistically update UI
      setPublished(prev => prev.filter(p => p.id !== post.id));
      
      // Delete from LinkedIn and local library
      await linkedInApi.deleteDBPost(post.id, post.platformPostId);
      
      toast.success('Post deleted successfully from LinkedIn and local library');
    } catch (error) {
      console.error('Error deleting published post:', error);
      toast.error('Failed to delete post');
      
      // Restore post to state if API call failed
      setPublished(prev => {
        if (!prev.some(p => p.id === post.id)) {
          return [...prev, post];
        }
        return prev;
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Render a unified post card for all types
  const renderPostCard = useCallback((post: BasePost, type: 'draft' | 'scheduled' | 'published') => {
    // Determine the actual media type
    let actualMediaType = 'none';
    if (isCarouselPost(post)) {
      actualMediaType = 'carousel';
    } else if (post.postImage && post.postImage.secure_url) {
      actualMediaType = 'image';
    } else if (post.mediaType) {
      actualMediaType = post.mediaType;
    }
    
    console.log(`Rendering ${type} post ${post.id} with media type: ${actualMediaType}`);
    
    const dropdownItems = () => {
      if (type === 'draft') {
        // ... existing draft dropdown items ...
      } else if (type === 'scheduled') {
        // ... existing scheduled dropdown items ...
      } else if (type === 'published') {
        return [
          {
            id: 'view',
            label: 'View on LinkedIn',
            icon: <ExternalLink size={14} />,
            onClick: () => {
              // Open in LinkedIn if platformPostId exists
              if (post.platformPostId) {
                window.open(`https://www.linkedin.com/feed/update/${post.platformPostId}`, '_blank');
              } else {
                toast.info('LinkedIn post link not available');
              }
            }
          },
          {
            id: 'edit',
            label: 'Edit Post',
            icon: <Edit size={14} />,
            onClick: () => editPublishedPost(post)
          },
          {
            id: 'delete',
            label: 'Delete Post',
            icon: <Trash size={14} />,
            className: 'text-red-500 hover:text-red-700',
            onClick: () => deletePublishedPost(post)
          }
        ];
      }
      return [];
    };

    return (
      <Card key={post.id} className="overflow-hidden h-full min-h-[500px] flex flex-col border dark:border-gray-700">
        {/* User Info Header */}
        <div className="flex items-center p-3 sm:p-4 border-b dark:border-gray-700">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
            <AvatarImage src={user?.profilePicture || '/placeholder-avatar.png'} alt={`${user?.firstName} ${user?.lastName}` || 'User'} />
            <AvatarFallback>{user?.firstName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : 'User'}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {type === 'published' ? 'Posted' : type === 'scheduled' ? 'Scheduled' : 'Draft'} · {
                type === 'scheduled' && (post as ScheduledPost).scheduledTime ? 
                  new Date((post as ScheduledPost).scheduledTime).toLocaleString() : 
                  new Date(post.updatedAt).toLocaleDateString()
              }
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 ml-1">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {dropdownItems().map((item) => (
                <DropdownMenuItem key={item.id} className={item.className} onClick={item.onClick}>
                  {item.icon}
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardContent className="p-3 sm:p-4 flex-grow overflow-auto space-y-4">
          {/* Post Content */}
          <div className="text-sm whitespace-pre-wrap">
            {post.content || post.excerpt || "No content"}
          </div>
          
          {/* Single Post Image (if available and not a carousel) */}
          {post.postImage && actualMediaType === 'image' && (
            <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">
              <img 
                src={post.postImage.secure_url} 
                alt="Post image"
                className="w-full object-contain max-h-[200px] sm:max-h-[280px]"
              />
            </div>
          )}
          
          {/* Carousel Images (if available) */}
          {actualMediaType === 'carousel' && post.slides && post.slides.length > 0 && (
            <CarouselCard slides={post.slides || []} />
          )}
          
          {/* Hashtags (if available) */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map(tag => (
                <Badge key={tag} variant="secondary" className="rounded-sm text-xs font-medium text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Poll (if available) */}
          {post.isPollActive && post.pollOptions && post.pollOptions.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <BarChart4 size={14} />
                <span className="text-sm font-medium">Poll</span>
              </div>
              <div className="space-y-2">
                {post.pollOptions.map((option, index) => (
                  <div key={index} className="text-sm p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex justify-between items-center">
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Interaction Footer */}
        <CardFooter className="p-0 border-t dark:border-gray-700 mt-auto">
          {type === 'published' ? (
            // For published posts, show basic actions
            <div className="w-full">
              <div className="flex items-center justify-between p-1">
                <Button variant="ghost" size="sm" className="flex-1 rounded-md gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-xs">View on LinkedIn</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 rounded-md gap-1">
                  <Copy className="h-4 w-4" />
                  <span className="text-xs">Duplicate</span>
                </Button>
              </div>
            </div>
          ) : (
            // For drafts and scheduled posts, show action buttons
            <div className="w-full">
              {type === 'draft' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-2">
                  <Button 
                    variant="outline" 
                    onClick={() => editDraft(post.id)} 
                    className="h-9 text-xs"
                  >
                    <PencilLine size={12} className="mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => scheduleDraft(post.id)} 
                    className="h-9 text-xs"
                  >
                    <Calendar size={12} className="mr-1" /> Schedule
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => publishDraft(post.id)} 
                    className="h-9 text-xs"
                    disabled={isPublishing}
                  >
                    {isPublishing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send size={12} className="mr-1" />}
                    Publish
                  </Button>
                </div>
              )}
              {type === 'scheduled' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
                  <Button 
                    variant="outline" 
                    onClick={() => editScheduledPost(post.id)} 
                    className="h-9 text-xs"
                  >
                    <PencilLine size={12} className="mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => publishScheduledPost(post.id)} 
                    className="h-9 text-xs"
                    disabled={isPublishing}
                  >
                    {isPublishing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send size={12} className="mr-1" />}
                    Publish Now
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    );
  }, [isPublishing, isDeleting, user, drafts, scheduled, published, editDraft, scheduleDraft, publishDraft, editScheduledPost, publishScheduledPost]);
  
  // Function to open the schedule dialog
  const openScheduleDialog = (draft: DraftPost) => {
    setSelectedDraftForScheduling(draft);
    setShowScheduleDialog(true);
    
    // Set visibility from draft if available
    if (draft.visibility) {
      setVisibility(draft.visibility as 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN');
    }
  };
  
  // Function to schedule a post directly from the library
  const schedulePostDirectly = async () => {
    if (!selectedDraftForScheduling) {
      toast.error('No draft selected for scheduling');
      return;
    }
    
    try {
      setIsScheduling(true);
      
      // Make a fresh date object to avoid timezone issues
      const scheduledDateTime = new Date(scheduledDate);
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes, 0, 0);
      
      // Check if the scheduled time is in the past
      if (scheduledDateTime <= new Date()) {
        toast.error('Please select a future date and time');
        return;
      }
      
      // Prepare post data for scheduling
      const postData = {
        title: selectedDraftForScheduling.title || 'Scheduled Post',
        content: selectedDraftForScheduling.content || '',
        hashtags: selectedDraftForScheduling.hashtags || [],
        visibility: visibility,
        platform: 'linkedin',
        status: 'scheduled',
        scheduledTime: scheduledDateTime.toISOString(),
        mediaType: selectedDraftForScheduling.postImage ? 'image' : 
                  (selectedDraftForScheduling.slides && selectedDraftForScheduling.slides.length > 0) ? 'carousel' : 'none',
        postImage: selectedDraftForScheduling.postImage,
        slides: selectedDraftForScheduling.slides || [],
        isPollActive: selectedDraftForScheduling.isPollActive || false,
        pollOptions: selectedDraftForScheduling.pollOptions || []
      };
      
      // First, remove the draft
      if (selectedDraftForScheduling.id.startsWith('draft_')) {
        // If it's a local draft, remove from localStorage
        localStorage.removeItem(selectedDraftForScheduling.id);
      } else {
        // If it's a database draft, delete it from the database
        await linkedInApi.deleteDBPost(selectedDraftForScheduling.id);
      }
      
      // Create scheduled post in database
      const response = await linkedInApi.createDBPost({
        ...postData,
        status: 'scheduled'
      });
      
      if (response && response.success) {
        // Remove from drafts in state
        setDrafts(prevDrafts => prevDrafts.filter(d => d.id !== selectedDraftForScheduling.id));
        
        toast.success('Post scheduled successfully!');
        setShowScheduleDialog(false);
        
        // Reload user content to show the scheduled post
        await loadUserContent();
        
        // Switch to scheduled tab
        setActiveTab('scheduled');
        
        // Force reload after a short delay to ensure backend state is reflected
        setTimeout(() => {
          loadUserContent();
        }, 1000);
      } else {
        throw new Error('Failed to schedule post');
      }
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error('Failed to schedule post: ' + (error.message || 'Unknown error'));
    } finally {
      setIsScheduling(false);
    }
  };
  
  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-black">Post Library</h1>
        
        <div className="flex gap-2">
          {(drafts.some(d => d.id.startsWith('draft_')) || 
           scheduled.some(s => s.id.startsWith('scheduled_'))) && (
            <Button 
              variant="outline"
              onClick={migrateLocalPosts}
              disabled={isMigrating}
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              {isMigrating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <File className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Migrate Local Posts</span>
              <span className="inline sm:hidden">Migrate</span>
            </Button>
          )}
        
        <Button 
          onClick={() => navigate('/dashboard/post')}
          className="bg-primary text-white text-xs sm:text-sm"
        >
          Create New Post
        </Button>
        </div>
      </div>
      
      {linkedInAuthError && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-800 mb-1">LinkedIn Authentication Required</h3>
                <p className="text-sm text-amber-700 mb-3">
                  Your LinkedIn connection has expired or is missing required permissions. 
                  Please reconnect your account to publish posts.
                </p>
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 text-white" 
                  onClick={handleConnectLinkedIn}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  Reconnect LinkedIn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="drafts" className="flex gap-2 items-center">
            <FileText size={16} />
            Drafts
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex gap-2 items-center">
            <Calendar size={16} />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="published" className="flex gap-2 items-center">
            <CheckCircle2 size={16} />
            Published
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="drafts">
          {isLoading ? (
            <Card className="p-6">
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </Card>
          ) : drafts.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="py-8">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No drafts yet</h3>
                <p className="text-neutral-medium text-sm mb-4">Start creating content for LinkedIn</p>
                  <Button onClick={() => navigate('/dashboard/post')}>
                    Create a Post
                  </Button>
                </div>
              </Card>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
              {drafts.map((draft) => (
                <div key={draft.id} className="h-full">
                  {renderPostCard(draft, 'draft')}
                </div>
              ))}
            </div>
            )}
        </TabsContent>
        
        <TabsContent value="scheduled">
            {scheduled.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="py-8">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No scheduled posts</h3>
                  <p className="text-neutral-medium text-sm mb-4">Schedule posts to be published automatically</p>
                  <Button onClick={() => navigate('/dashboard/post')}>
                    Create a Post
                  </Button>
                </div>
              </Card>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
              {scheduled.map((post) => (
                <div key={post.id} className="h-full">
                  {renderPostCard(post, 'scheduled')}
                </div>
              ))}
            </div>
            )}
        </TabsContent>
        
        <TabsContent value="published">
          {published.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="py-8">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No published posts</h3>
                <p className="text-neutral-medium text-sm mb-4">Your published posts will appear here</p>
                <Button onClick={() => navigate('/dashboard/post')}>
                  Create a Post
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
              {published.map((post) => (
                <div key={post.id} className="h-full">
                  {renderPostCard(post, 'published')}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Scheduling Dialog */}
      {showScheduleDialog && selectedDraftForScheduling && (
        <Dialog 
          open={showScheduleDialog} 
          onOpenChange={(open) => {
            if (!open) setShowScheduleDialog(false);
          }}
        >
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule LinkedIn Post</DialogTitle>
              <DialogDescription>
                Choose when you want this post to be published to LinkedIn
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    // Format date with correct timezone handling
                    value={(() => {
                      // Create a date with timezone offset applied
                      const date = new Date(scheduledDate);
                      // Format as YYYY-MM-DD
                      return date.toISOString().split('T')[0];
                    })()}
                    onChange={(e) => {
                      if (e.target.value) {
                        try {
                          // Handle the date directly from the input value to avoid timezone issues
                          const dateParts = e.target.value.split('-').map(Number);
                          const newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                          
                          // Preserve the time but on the new date
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
                              console.log('Set date to:', newDate.toISOString(), 'from input:', e.target.value);
                            } else {
                              toast.error('Please select today or a future date');
                            }
                          }
                        } catch (err) {
                          console.error('Error parsing date:', err);
                          toast.error('Invalid date format');
                        }
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
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
                    }}
                    className="w-full"
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
                <div className="border rounded p-3 bg-white text-sm overflow-hidden">
                  <div className="max-h-24 overflow-y-auto mb-2">
                    <p className="text-sm whitespace-pre-wrap break-words line-clamp-3">
                      {selectedDraftForScheduling.content || "No content yet"}
                    </p>
                  </div>
                  
                  {selectedDraftForScheduling.postImage && (
                    <div className="flex items-center text-green-600 mt-1 text-xs">
                      <span className="font-medium mr-1">Image:</span>
                      <span className="truncate max-w-[200px] inline-block overflow-hidden">
                        {selectedDraftForScheduling.postImage.secure_url.split('/').pop()}
                      </span>
                    </div>
                  )}
                  
                  {selectedDraftForScheduling.isPollActive && selectedDraftForScheduling.pollOptions && (
                    <p className="text-blue-600 mt-1 text-xs">
                      <span className="font-medium">Poll:</span> {selectedDraftForScheduling.pollOptions.filter(o => o?.trim()).length} options
                    </p>
                  )}
                  
                  <div className="text-blue-600 mt-1 text-xs font-medium flex items-center">
                    <Calendar className="h-3 w-3 mr-1 inline" />
                    <span className="truncate">
                      Scheduled for: {scheduledDate.toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })} at {scheduleTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
              <Button 
                onClick={schedulePostDirectly} 
                disabled={isScheduling}
              >
                {isScheduling ? (
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
    </div>
  );
};

export default PostLibraryPage; 