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
  stats?: {
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
  };
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
  const [scheduled, setScheduled] = useState<ScheduledPost[]>([
    {
      id: '3',
      title: 'Announcing Our New Product Launch',
      content: 'Excited to share our latest innovation that will transform how you create content...',
      excerpt: 'Excited to share our latest innovation that will transform how you create content...',
      scheduledDate: 'Apr 15, 2023 • 10:30 AM',
      isCarousel: false,
      status: 'scheduled'
    },
    {
      id: '4',
      title: 'LinkedIn Engagement Masterclass',
      content: 'Join me for a deep dive into LinkedIn engagement strategies that actually work...',
      excerpt: 'Join me for a deep dive into LinkedIn engagement strategies that actually work...',
      scheduledDate: 'Apr 18, 2023 • 2:00 PM',
      isCarousel: false,
      status: 'scheduled'
    }
  ]);
  
  const [published, setPublished] = useState<PublishedPost[]>([
    {
      id: '5',
      title: 'How We Increased Conversions by 300%',
      content: 'A case study on our recent campaign that shattered all expectations...',
      excerpt: 'A case study on our recent campaign that shattered all expectations...',
      publishedDate: 'Apr 5, 2023',
      stats: {
        impressions: 5420,
        likes: 187,
        comments: 43,
        shares: 21
      },
      isCarousel: false,
      status: 'published'
    },
    {
      id: '6',
      title: 'The Ultimate LinkedIn Profile Checklist',
      content: 'Make sure your LinkedIn profile stands out with these essential elements...',
      excerpt: 'Make sure your LinkedIn profile stands out with these essential elements...',
      publishedDate: 'Mar 28, 2023',
      stats: {
        impressions: 7834,
        likes: 312,
        comments: 78,
        shares: 94
      },
      isCarousel: true,
      slideCount: 8,
      status: 'published'
    }
  ]);
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [linkedInAuthError, setLinkedInAuthError] = useState(false);
  
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
  
  // Load drafts and scheduled posts from API only
  useEffect(() => {
    const loadUserContent = async () => {
      try {
        setIsLoading(true);
        setLinkedInAuthError(false);
        
        // Load data from API
        const apiData = await linkedInApi.getDraftsAndScheduled();
        
        // Process data into our expected format
        const apiDrafts = apiData.filter((item: any) => item.status === 'draft');
        const apiScheduled = apiData.filter((item: any) => item.status === 'scheduled');
        
        // Set state with API data
        setDrafts(apiDrafts.map((item: any) => {
          // Add defensive null checks
          if (!item || !item.postData) {
            console.warn('Missing postData in draft item:', item);
            return {
              id: item?._id || `draft_${Date.now()}${Math.random()}`,
              title: 'Untitled Draft',
              content: '',
              updatedAt: new Date().toISOString(),
              slides: [],
              isCarousel: false,
              slideCount: 0,
              status: 'draft'
            };
          }
          
          const post = item.postData;
          return {
            id: item._id,
            title: post.title || 'Untitled',
            content: post.content || '',
            updatedAt: item.updatedAt || new Date().toISOString(),
            slides: post.slides || [],
            postData: post,
            postImage: post.postImage,
            hashtags: post.hashtags || [],
            isPollActive: !!post.isPollActive,
            pollOptions: post.pollOptions || [],
            isCarousel: post.slides && post.slides.length > 0,
            slideCount: post.slides?.length || 0
          };
        }));
        
        setScheduled(apiScheduled.map((item: any) => {
          // Add defensive null checks
          if (!item || !item.postData) {
            console.warn('Missing postData in scheduled item:', item);
            return {
              id: item?._id || `scheduled_${Date.now()}${Math.random()}`,
              title: 'Scheduled Post',
              content: '',
              scheduledTime: item?.scheduledTime || new Date().toISOString(),
              slides: [],
              isCarousel: false,
              slideCount: 0,
              status: 'scheduled'
            };
          }
          
          const post = item.postData;
          return {
            id: item._id,
            title: post.title || 'Untitled',
            content: post.content || '',
            scheduledTime: item.scheduledTime || new Date().toISOString(),
            slides: post.slides || [],
            postData: post,
            postImage: post.postImage,
            hashtags: post.hashtags || [],
            isPollActive: !!post.isPollActive,
            pollOptions: post.pollOptions || [],
            isCarousel: post.slides && post.slides.length > 0,
            slideCount: post.slides?.length || 0
          };
        }));
        
      } catch (error: any) {
        console.error('Error loading content from backend:', error);
        
        // Check if it's a LinkedIn auth error
        if (error?.response?.status === 401) {
          setLinkedInAuthError(true);
          toast.error('LinkedIn authentication failed. Please reconnect your account.');
        } else {
          toast.error('Failed to load your content from the backend. Please ensure your backend is running and try again.');
        }
        
        // Set empty states if we can't load from backend
        setDrafts([]);
        setScheduled([]);
        
      } finally {
        setIsLoading(false);
      }
    };
    
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
  
  // Edit draft post
  const editDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      navigate('/dashboard/create-post', { state: { draft } });
    }
  };

  // Delete draft
  const deleteDraft = async (draftId: string) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await linkedInApi.deleteDraft(draftId);
        toast.success('Draft deleted successfully');
        setDrafts(drafts.filter(d => d.id !== draftId));
      } catch (error) {
        console.error('Error deleting draft:', error);
        toast.error('Failed to delete draft. Please try again.');
      }
    }
  };

  // Schedule a draft for posting
  const scheduleDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      navigate('/dashboard/create-post', { state: { 
        draft, 
        action: 'schedule',
        initialScheduleDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }});
    }
  };

  // Edit scheduled post
  const editScheduledPost = (postId: string) => {
    const post = scheduled.find(p => p.id === postId);
    if (post) {
      navigate('/dashboard/create-post', { state: { 
        draft: post, 
        action: 'schedule',
        initialScheduleDate: new Date(post.scheduledTime)
      }});
    }
  };

  // Delete scheduled post
  const deleteScheduledPost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this scheduled post?')) {
      try {
        await linkedInApi.deleteScheduledPost(postId);
        toast.success('Scheduled post deleted successfully');
        setScheduled(scheduled.filter(p => p.id !== postId));
      } catch (error) {
        console.error('Error deleting scheduled post:', error);
        toast.error('Failed to delete scheduled post. Please try again.');
      }
    }
  };

  // Publish draft now
  const publishDraft = async (draftId: string) => {
    if (window.confirm('Are you sure you want to publish this draft now?')) {
      try {
        setIsPublishing(true);
        const draft = drafts.find(d => d.id === draftId);
        
        if (!draft) {
          toast.error('Draft not found');
          setIsPublishing(false);
          return;
        }
        
        // Publish to LinkedIn
        await linkedInApi.publishPostToLinkedIn(draft);
        
        // Save to published posts on backend
        const publishedPost = {
          ...draft,
          id: `published_${Date.now()}`,
          publishedAt: new Date().toISOString(),
          status: 'published' as 'published'
        };
        
        await linkedInApi.savePublishedPost(publishedPost);
        
        // Remove from drafts
        await linkedInApi.deleteDraft(draftId);
        setDrafts(drafts.filter(d => d.id !== draftId));
        
        // Add to published list if we're displaying it
        if (activeTab === "published") {
          setPublished([publishedPost, ...published]);
        }
        
        toast.success('Post published successfully on LinkedIn');
      } catch (error) {
        console.error('Error publishing draft:', error);
        toast.error('Failed to publish post. Please try again.');
      } finally {
        setIsPublishing(false);
      }
    }
  };

  // Publish scheduled post now
  const publishScheduledPost = async (postId: string) => {
    if (window.confirm('Are you sure you want to publish this scheduled post now?')) {
      try {
        setIsPublishing(true);
        const post = scheduled.find(p => p.id === postId);
        
        if (!post) {
          toast.error('Scheduled post not found');
          setIsPublishing(false);
          return;
        }
        
        // Publish to LinkedIn
        await linkedInApi.publishPostToLinkedIn(post);
        
        // Save to published posts on backend
        const publishedPost = {
          ...post,
          id: `published_${Date.now()}`,
          publishedAt: new Date().toISOString(),
          status: 'published' as 'published'
        };
        
        await linkedInApi.savePublishedPost(publishedPost);
        
        // Remove from scheduled
        await linkedInApi.deleteScheduledPost(postId);
        setScheduled(scheduled.filter(p => p.id !== postId));
        
        // Add to published list if we're displaying it
        if (activeTab === "published") {
          setPublished([publishedPost, ...published]);
        }
        
        toast.success('Post published successfully on LinkedIn');
      } catch (error) {
        console.error('Error publishing scheduled post:', error);
        toast.error('Failed to publish post. Please try again.');
      } finally {
        setIsPublishing(false);
      }
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
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <BarChart4 size={14} /> View Analytics
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
                    {type === 'published' && <span className="text-xs text-gray-500">{Math.floor(Math.random() * 50)}%</span>}
                  </div>
                ))}
                {type === 'published' && (
                  <div className="text-xs text-center text-gray-500 mt-1">
                    {Math.floor(Math.random() * 100) + 20} votes · {post.pollDuration || 7} days left
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Interaction Footer */}
        <CardFooter className="p-0 border-t dark:border-gray-700 mt-auto">
          {type === 'published' ? (
            // For published posts, show LinkedIn-like engagement metrics
            <div className="w-full">
              {/* Engagement stats */}
              <div className="px-4 py-2 text-xs text-gray-500 border-b dark:border-gray-700 flex items-center">
                <div className="flex items-center">
                  <ThumbsUp className="h-3 w-3 text-blue-500 mr-1" />
                  <span>{(post as PublishedPost).stats?.likes || Math.floor(Math.random() * 50)}</span>
                </div>
                <span className="mx-2">•</span>
                <div>{(post as PublishedPost).stats?.comments || Math.floor(Math.random() * 20)} comments</div>
                <span className="mx-2">•</span>
                <div>{(post as PublishedPost).stats?.shares || Math.floor(Math.random() * 10)} shares</div>
              </div>
              
              {/* Interaction buttons */}
              <div className="flex items-center justify-between p-1">
                <Button variant="ghost" size="sm" className="flex-1 rounded-md gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-xs">Like</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 rounded-md gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Comment</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 rounded-md gap-1">
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">Share</span>
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-black">Post Library</h1>
        
        <Button 
          onClick={() => navigate('/dashboard/post')}
          className="bg-primary text-white"
        >
          Create New Post
        </Button>
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