import React, { useState, useEffect } from 'react';
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
  ChevronRight
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
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
  };
  
  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

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
    localStorage.setItem('redirectAfterAuth', '/dashboard/library');
    
    // Redirect to LinkedIn OAuth endpoint
    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
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
          date: new Date(post.createdAt).toLocaleDateString()
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
          scheduledDate: new Date(post.scheduledTime).toLocaleDateString()
        })) || [];

        const publishedPosts: PublishedPost[] = publishedData?.data?.map((post: any) => ({
          id: post._id,
          title: post.title || 'Published Post',
          content: post.content,
          excerpt: post.content?.substring(0, 100) + '...',
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          publishedDate: new Date(post.publishedTime || post.updatedAt).toLocaleDateString(),
          slides: post.slides || [],
          postImage: post.postImage,
          isPollActive: post.isPollActive,
          pollOptions: post.pollOptions,
          hashtags: post.hashtags,
          visibility: post.visibility,
          provider: post.platform,
          status: 'published',
          isCarousel: post.slides && post.slides.length > 0,
          slideCount: post.slides?.length || 0
        })) || [];

        // Update state with API data
        setDrafts(draftPosts);
        setScheduled(scheduledPosts);
        setPublished(publishedPosts);
        
        // If no data from API, fallback to localStorage as a backup
        if (draftPosts.length === 0 && scheduledPosts.length === 0 && publishedPosts.length === 0) {
          console.log("No posts found in backend, checking localStorage...");
          
          // Scan localStorage for saved drafts and scheduled posts
          const localDrafts: DraftPost[] = [];
          const localScheduledPosts: ScheduledPost[] = [];
          
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('draft_')) {
              try {
                const draftData = JSON.parse(localStorage.getItem(key) || '{}');
                if (draftData.id) {
                  localDrafts.push(draftData);
                }
              } catch (e) {
                console.error('Error parsing draft:', e);
              }
            } else if (key?.startsWith('scheduled_')) {
              try {
                const scheduledData = JSON.parse(localStorage.getItem(key) || '{}');
                if (scheduledData.id) {
                  localScheduledPosts.push(scheduledData);
                }
              } catch (e) {
                console.error('Error parsing scheduled post:', e);
              }
            }
          }
          
          // Only use localStorage data if there's no API data
          if (localDrafts.length > 0) setDrafts(localDrafts);
          if (localScheduledPosts.length > 0) setScheduled(localScheduledPosts);
        }
        
      } catch (apiError: any) {
        console.error('Error loading content:', apiError);
        toast.error('Failed to load your content');
      }
    } catch (error) {
      console.error('Error in loadUserContent:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Edit a draft
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
    
    // Navigate to the create post page
    navigate('/dashboard/post');
  };
  
  // Delete a draft
  const deleteDraft = async (draftId: string) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      setIsDeleting(true);
      
      // Delete from backend API
      await linkedInApi.deleteDBPost(draftId);
      
      // Update state
      const updatedDrafts = drafts.filter(d => d.id !== draftId);
      setDrafts(updatedDrafts);
      
      toast.success('Draft deleted successfully');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Schedule a draft
  const scheduleDraft = async (draftId: string) => {
    // Find the draft
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    // Set up the form data in localStorage for the create post page
    Object.entries(draft).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'status') {
        localStorage.setItem(`state:createPost.${key}`, JSON.stringify(value));
      }
    });
    
    try {
      // Remove from drafts via backend API
      await linkedInApi.deleteDraft(draftId);
      
      // Update local state after successful API call
      const updatedDrafts = drafts.filter(d => d.id !== draftId);
      setDrafts(updatedDrafts);
    
      // Navigate to the create post page with schedule dialog open
      navigate('/dashboard/post', { state: { openScheduleDialog: true, fromDraft: true, draftId } });
    } catch (error) {
      console.error('Error removing draft from backend:', error);
      toast.error('Failed to process draft. Please try again later.');
    }
  };
  
  // Edit a scheduled post
  const editScheduledPost = (postId: string) => {
    // Find the scheduled post
    const post = scheduled.find(p => p.id === postId);
    if (!post) return;
    
    // Set up the form data in localStorage
    Object.entries(post).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'status' && key !== 'scheduledTime') {
        localStorage.setItem(`state:createPost.${key}`, JSON.stringify(value));
      }
    });
    
    // Navigate to the create post page with schedule dialog open
    navigate('/dashboard/post', { state: { openScheduleDialog: true } });
  };
  
  // Delete a scheduled post
  const deleteScheduledPost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled post?')) return;
    
    try {
      setIsDeleting(true);
      
      // Delete from backend API
      await linkedInApi.deleteDBPost(postId);
      
      // Update state
      const updatedScheduled = scheduled.filter(p => p.id !== postId);
      setScheduled(updatedScheduled);
      
      toast.success('Scheduled post cancelled');
    } catch (error) {
      console.error('Error cancelling scheduled post:', error);
      toast.error('Failed to cancel scheduled post');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Publish a draft directly
  const publishDraft = async (draftId: string) => {
    // Find the draft
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    if (!window.confirm('Are you sure you want to publish this draft to LinkedIn?')) return;
    
    try {
      setIsPublishing(true);
      
      // Check for LinkedIn authentication directly from localStorage
      const linkedInToken = localStorage.getItem('linkedin-login-token');
      
      if (!linkedInToken) {
        toast.error(`LinkedIn authentication required. Please login with LinkedIn to post content.`);
        setIsPublishing(false);
        setLinkedInAuthError(true);
        return;
      }
      
      // For localStorage-based drafts, first migrate to database
      if (draftId.startsWith('draft_')) {
        toast.info('Migrating draft to database before publishing...');
        try {
          // Create a database post first
          const postData = {
            title: draft.title || 'Draft Post',
            content: draft.content,
            hashtags: draft.hashtags,
            mediaType: draft.postImage ? 'image' : draft.slides && draft.slides.length > 0 ? 'carousel' : 'none',
            postImage: draft.postImage,
            slides: draft.slides,
            isPollActive: draft.isPollActive,
            pollOptions: draft.pollOptions,
            status: 'draft',
            visibility: draft.visibility || 'PUBLIC'
          };
          
          const createResponse = await linkedInApi.createDBPost(postData);
          
          if (createResponse && createResponse.data) {
            // Use the new database ID
            const dbDraftId = createResponse.data._id;
            
            // Publish using the backend API
            await linkedInApi.publishDBPost(dbDraftId);
            
            // Remove original localStorage draft
            localStorage.removeItem(draftId);
            
            // Update state
            const updatedDrafts = drafts.filter(d => d.id !== draftId);
            setDrafts(updatedDrafts);
            
            // Create a published post object for the UI
            const publishedPost: PublishedPost = {
              id: `published_${Date.now()}`,
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
              pollOptions: draft.pollOptions
            };
            
            setPublished([publishedPost, ...published]);
            toast.success('Post published to LinkedIn successfully');
            setActiveTab('published');
          } else {
            throw new Error('Failed to create database post before publishing');
          }
        } catch (migrationError) {
          console.error('Error migrating draft before publishing:', migrationError);
          throw migrationError;
        }
      } else {
        // For database-backed posts, publish directly
        const response = await linkedInApi.publishDBPost(draftId);
        
        // Remove from drafts in local state
        const updatedDrafts = drafts.filter(d => d.id !== draftId);
        setDrafts(updatedDrafts);
        
        // Create a published post object for the UI based on the API response
        const publishedPost: PublishedPost = {
          id: response?.data?._id || draftId,
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
          pollOptions: draft.pollOptions
        };
        
        setPublished([publishedPost, ...published]);
        toast.success('Post published to LinkedIn successfully');
        setActiveTab('published');
      }
    } catch (error: any) {
      console.error('Error publishing draft:', error);
      
      // Check for token expiration message from our API handler
      if (error.message && error.message.includes('authentication expired')) {
        setLinkedInAuthError(true);
        toast.error('Your LinkedIn authentication has expired. Please reconnect your account.');
        
        // Show reconnect dialog
        if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
          handleConnectLinkedIn();
        }
        return;
      }
      
      // Check if it's a LinkedIn auth error
      if (error?.response?.status === 401 || 
          (error?.response?.status === 500 && 
           error?.response?.data?.details?.includes('token has expired'))) {
        setLinkedInAuthError(true);
        toast.error('LinkedIn authentication failed. Please reconnect your account.');
        
        // Show reconnect dialog
        if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
          handleConnectLinkedIn();
        }
      } else {
        toast.error('Failed to publish draft: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Similar update for publishScheduledPost function
  const publishScheduledPost = async (postId: string) => {
    // Find the scheduled post
    const post = scheduled.find(p => p.id === postId);
    if (!post) return;
    
    if (!window.confirm('Are you sure you want to publish this post to LinkedIn now?')) return;
    
    try {
      setIsPublishing(true);
      
      // Check for LinkedIn authentication directly from localStorage
      const linkedInToken = localStorage.getItem('linkedin-login-token');
      
      if (!linkedInToken) {
        toast.error(`LinkedIn authentication required. Please login with LinkedIn to post content.`);
        setIsPublishing(false);
        setLinkedInAuthError(true);
        return;
      }
      
      // For localStorage-based scheduled posts, first migrate to database
      if (postId.startsWith('scheduled_')) {
        toast.info('Migrating scheduled post to database before publishing...');
        try {
          // Create a database post first
          const postData = {
            title: post.title || 'Scheduled Post',
            content: post.content,
            hashtags: post.hashtags,
            mediaType: post.postImage ? 'image' : post.slides && post.slides.length > 0 ? 'carousel' : 'none',
            postImage: post.postImage,
            slides: post.slides,
            isPollActive: post.isPollActive,
            pollOptions: post.pollOptions,
            status: 'scheduled',
            visibility: post.visibility || 'PUBLIC',
            scheduledTime: post.scheduledTime
          };
          
          const createResponse = await linkedInApi.createDBPost(postData);
          
          if (createResponse && createResponse.data) {
            // Use the new database ID
            const dbPostId = createResponse.data._id;
            
            // Publish using the backend API
            await linkedInApi.publishDBPost(dbPostId);
            
            // Remove original localStorage scheduled post
            localStorage.removeItem(postId);
            
            // Update state
            const updatedScheduled = scheduled.filter(p => p.id !== postId);
            setScheduled(updatedScheduled);
            
            // Create a published post object for the UI
            const publishedPost: PublishedPost = {
              id: `published_${Date.now()}`,
              title: post.title || 'Published Post',
              content: post.content,
              excerpt: post.content?.substring(0, 100) + '...',
              publishedDate: new Date().toLocaleDateString(),
              isCarousel: post.slides && post.slides.length > 0,
              slideCount: post.slides?.length || 0,
              status: 'published',
              postImage: post.postImage,
              hashtags: post.hashtags,
              isPollActive: post.isPollActive,
              pollOptions: post.pollOptions
            };
            
            setPublished([publishedPost, ...published]);
            toast.success('Post published to LinkedIn successfully');
            setActiveTab('published');
          } else {
            throw new Error('Failed to create database post before publishing');
          }
        } catch (migrationError) {
          console.error('Error migrating scheduled post before publishing:', migrationError);
          throw migrationError;
        }
      } else {
        // For database-backed posts, publish directly
        const response = await linkedInApi.publishDBPost(postId);
        
        // Remove from scheduled in local state
        const updatedScheduled = scheduled.filter(p => p.id !== postId);
        setScheduled(updatedScheduled);
        
        // Create a published post object for the UI based on the API response
        const publishedPost: PublishedPost = {
          id: response?.data?._id || postId,
          title: post.title || 'Published Post',
          content: post.content,
          excerpt: post.content?.substring(0, 100) + '...',
          publishedDate: new Date().toLocaleDateString(),
          isCarousel: post.slides && post.slides.length > 0,
          slideCount: post.slides?.length || 0,
          status: 'published',
          postImage: post.postImage,
          hashtags: post.hashtags,
          isPollActive: post.isPollActive,
          pollOptions: post.pollOptions
        };
        
        setPublished([publishedPost, ...published]);
        toast.success('Post published to LinkedIn successfully');
        setActiveTab('published');
      }
    } catch (error: any) {
      console.error('Error publishing scheduled post:', error);
      
      // Check for token expiration message from our API handler
      if (error.message && error.message.includes('authentication expired')) {
        setLinkedInAuthError(true);
        toast.error('Your LinkedIn authentication has expired. Please reconnect your account.');
        
        // Show reconnect dialog
        if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
          handleConnectLinkedIn();
        }
        return;
      }
      
      // Check if it's a LinkedIn auth error
      if (error?.response?.status === 401 || 
          (error?.response?.status === 500 && 
           error?.response?.data?.details?.includes('token has expired'))) {
        setLinkedInAuthError(true);
        toast.error('LinkedIn authentication failed. Please reconnect your account.');
        
        // Show reconnect dialog
        if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
          handleConnectLinkedIn();
        }
      } else {
        toast.error('Failed to publish post: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Render a unified post card for all types
  const renderPostCard = (post: BasePost, type: 'draft' | 'scheduled' | 'published') => {
    return (
      <Card key={post.id} className="overflow-hidden h-full min-h-[500px] flex flex-col border dark:border-gray-700">
        {/* User Info Header */}
        <div className="flex items-center p-4 border-b dark:border-gray-700">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={user?.profilePicture || '/placeholder-avatar.png'} alt={`${user?.firstName} ${user?.lastName}` || 'User'} />
            <AvatarFallback>{user?.firstName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : 'User'}</h3>
            <p className="text-xs text-muted-foreground">
              {type === 'published' ? 'Posted' : type === 'scheduled' ? 'Scheduled' : 'Draft'} · {
                type === 'scheduled' && (post as ScheduledPost).scheduledTime ? 
                  new Date((post as ScheduledPost).scheduledTime).toLocaleString() : 
                  new Date(post.updatedAt).toLocaleDateString()
              }
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {type === 'draft' && (
                <>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={() => editDraft(post.id)}>
                    <PencilLine size={14} /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-500" onClick={() => deleteDraft(post.id)}>
                    <Trash2 size={14} /> Delete
                  </DropdownMenuItem>
                </>
              )}
              {type === 'scheduled' && (
                <>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={() => editScheduledPost(post.id)}>
                    <PencilLine size={14} /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <Clock size={14} /> Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-500" onClick={() => deleteScheduledPost(post.id)}>
                    <Trash2 size={14} /> Cancel
                  </DropdownMenuItem>
                </>
              )}
              {type === 'published' && (
                <>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <ExternalLink size={14} /> View on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <Copy size={14} /> Duplicate
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardContent className="p-4 flex-grow overflow-auto space-y-4">
          {/* Post Content */}
          <div className="text-sm whitespace-pre-wrap">
            {post.content || post.excerpt || "No content"}
          </div>
          
          {/* Single Post Image (if available and not a carousel) */}
          {post.postImage && !post.isCarousel && (
            <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">
              <img 
                src={post.postImage.secure_url} 
                alt="Post image"
                className="w-full object-contain max-h-[280px]"
              />
            </div>
          )}
          
          {/* Carousel Images (if available) */}
          {post.isCarousel && post.slides && post.slides.length > 0 && (
            <CarouselCard slides={post.slides} />
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
            <div className="flex gap-1 p-2 w-full">
              {type === 'draft' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => editDraft(post.id)} 
                    className="flex-1 h-9 text-xs"
                  >
                    <PencilLine size={12} className="mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => scheduleDraft(post.id)} 
                    className="flex-1 h-9 text-xs"
                  >
                    <Calendar size={12} className="mr-1" /> Schedule
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => publishDraft(post.id)} 
                    className="flex-1 h-9 text-xs"
                    disabled={isPublishing}
                  >
                    {isPublishing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send size={12} className="mr-1" />}
                    Publish
                  </Button>
                </>
              )}
              {type === 'scheduled' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => editScheduledPost(post.id)} 
                    className="flex-1 h-9 text-xs"
                  >
                    <PencilLine size={12} className="mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => publishScheduledPost(post.id)} 
                    className="flex-1 h-9 text-xs"
                    disabled={isPublishing}
                  >
                    {isPublishing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send size={12} className="mr-1" />}
                    Publish Now
                  </Button>
                </>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  // Initialize data on component mount
  useEffect(() => {
    loadUserContent();
    
    // Handle location state for newly created draft/scheduled post
    if (locationState?.newDraft) {
      setActiveTab('drafts');
      toast.success('Draft saved successfully');
    } else if (locationState?.scheduled) {
      setActiveTab('scheduled');
      toast.success('Post scheduled successfully');
    } else if (locationState?.newPost) {
      setActiveTab('published');
      toast.success('Post published successfully');
    }
  }, [locationState]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-black">Post Library</h1>
        
        <div className="flex gap-2">
          {(drafts.some(d => d.id.startsWith('draft_')) || 
           scheduled.some(s => s.id.startsWith('scheduled_'))) && (
            <Button 
              variant="outline"
              onClick={migrateLocalPosts}
              disabled={isMigrating}
              className="flex items-center gap-1"
            >
              {isMigrating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <File className="h-4 w-4" />
              )}
              Migrate Local Posts
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/dashboard/post')}
            className="bg-primary text-white"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {published.map((post) => (
                <div key={post.id} className="h-full">
                  {renderPostCard(post, 'published')}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostLibraryPage; 