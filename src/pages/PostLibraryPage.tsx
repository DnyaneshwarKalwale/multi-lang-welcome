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
  BarChart4
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

// Define interfaces for post types
interface BasePost {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  createdAt?: string;
  updatedAt?: string;
  slides?: {id: string, content: string}[];
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

const PostLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as any;
  
  const [activeTab, setActiveTab] = useState(locationState?.activeTab || 'drafts');
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
  
  // Load drafts and scheduled posts from API or localStorage
  useEffect(() => {
    const loadUserContent = async () => {
      try {
        // Try to load from API first
        try {
          const apiData = await linkedInApi.getDraftsAndScheduled();
          
          // Process data into our expected format
          const apiDrafts = apiData.filter((item: any) => item.status === 'draft');
          const apiScheduled = apiData.filter((item: any) => item.status === 'scheduled');
          
          // Set state with API data
          setDrafts(apiDrafts.map((item: any) => {
            const post = item.postData;
            return {
              id: item._id,
              title: post.title || 'Untitled',
              content: post.content,
              updatedAt: item.updatedAt,
              slides: post.slides,
              postData: post,
              postImage: post.postImage,
              hashtags: post.hashtags,
              isPollActive: post.isPollActive,
              pollOptions: post.pollOptions
            };
          }));
          
          setScheduled(apiScheduled.map((item: any) => {
            const post = item.postData;
            return {
              id: item._id,
              title: post.title || 'Untitled',
              content: post.content,
              scheduledTime: item.scheduledTime,
              slides: post.slides,
              postData: post,
              postImage: post.postImage,
              hashtags: post.hashtags,
              isPollActive: post.isPollActive,
              pollOptions: post.pollOptions
            };
          }));
          
        } catch (apiError) {
          console.error('API load failed, using localStorage:', apiError);
          
          // Fallback to localStorage if API fails
          const savedDrafts = JSON.parse(localStorage.getItem('post_drafts') || '[]');
          setDrafts(savedDrafts);
          
          const savedScheduled = JSON.parse(localStorage.getItem('scheduled_posts') || '[]');
          setScheduled(savedScheduled.length > 0 ? savedScheduled : scheduled);
        }
      } catch (error) {
        console.error('Error loading user content:', error);
        toast.error('Failed to load your content');
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
  const deleteDraft = (draftId: string) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      setIsDeleting(true);
      const updatedDrafts = drafts.filter(d => d.id !== draftId);
      localStorage.setItem('post_drafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
      toast.success('Draft deleted successfully');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
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
      
      // Prepare content with hashtags
      let postContent = draft.content || '';
      if (draft.hashtags && draft.hashtags.length > 0) {
        postContent += '\n\n' + draft.hashtags.map(tag => `#${tag}`).join(' ');
      }
      
      // Publish to LinkedIn
      const response = await linkedInApi.createTextPost(postContent, draft.visibility || 'PUBLIC');
      
      // Remove from drafts
      const updatedDrafts = drafts.filter(d => d.id !== draftId);
      localStorage.setItem('post_drafts', JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
      
      // Add to published (in a real app, would save to backend)
      const publishedPost: PublishedPost = {
        id: response?.id || `published_${Date.now()}`,
        title: draft.title || 'Published Post',
        excerpt: draft.content?.substring(0, 100) + '...',
        publishedDate: new Date().toLocaleDateString(),
        stats: {
          impressions: 0,
          likes: 0,
          comments: 0,
          shares: 0
        },
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
      
    } catch (error) {
      console.error('Error publishing draft:', error);
      toast.error('Failed to publish draft');
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Schedule a draft
  const scheduleDraft = (draftId: string) => {
    // Find the draft
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;
    
    // Set up the form data in localStorage
    Object.entries(draft).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'status') {
        localStorage.setItem(`state:createPost.${key}`, JSON.stringify(value));
      }
    });
    
    // Navigate to the create post page with schedule dialog open
    navigate('/dashboard/post', { state: { openScheduleDialog: true } });
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
  const deleteScheduledPost = (postId: string) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled post?')) return;
    
    try {
      setIsDeleting(true);
      const updatedScheduled = scheduled.filter(p => p.id !== postId);
      localStorage.setItem('scheduled_posts', JSON.stringify(updatedScheduled));
      setScheduled(updatedScheduled);
      toast.success('Scheduled post cancelled');
    } catch (error) {
      console.error('Error cancelling scheduled post:', error);
      toast.error('Failed to cancel scheduled post');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Publish a scheduled post immediately
  const publishScheduledPost = async (postId: string) => {
    // Find the scheduled post
    const post = scheduled.find(p => p.id === postId);
    if (!post) return;
    
    if (!window.confirm('Are you sure you want to publish this post to LinkedIn now?')) return;
    
    try {
      setIsPublishing(true);
      
      // Prepare content with hashtags
      let postContent = post.content || '';
      if (post.hashtags && post.hashtags.length > 0) {
        postContent += '\n\n' + post.hashtags.map(tag => `#${tag}`).join(' ');
      }
      
      // Publish to LinkedIn
      const response = await linkedInApi.createTextPost(postContent, post.visibility || 'PUBLIC');
      
      // Remove from scheduled
      const updatedScheduled = scheduled.filter(p => p.id !== postId);
      localStorage.setItem('scheduled_posts', JSON.stringify(updatedScheduled));
      setScheduled(updatedScheduled);
      
      // Add to published (in a real app, would save to backend)
      const publishedPost: PublishedPost = {
        id: response?.id || `published_${Date.now()}`,
        title: post.title || 'Published Post',
        excerpt: post.content?.substring(0, 100) + '...',
        publishedDate: new Date().toLocaleDateString(),
        stats: {
          impressions: 0,
          likes: 0,
          comments: 0,
          shares: 0
        },
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
      
    } catch (error) {
      console.error('Error publishing scheduled post:', error);
      toast.error('Failed to publish post');
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Render a unified post card for all types
  const renderPostCard = (post: BasePost, type: 'draft' | 'scheduled' | 'published') => {
    return (
      <Card key={post.id} className="overflow-hidden max-w-sm h-[450px] flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
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
                      <Copy size={14} /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                      <Share2 size={14} /> Share Analytics
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="line-clamp-2 text-sm h-10">
            {post.content || post.excerpt || "No content"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3 flex-grow overflow-auto">
          {/* Post Image (if available) */}
          {post.postImage && (
            <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-[180px]">
                <img 
                  src={post.postImage.secure_url} 
                  alt="Post image"
                  className="max-w-full h-full object-contain"
                  style={{ padding: '8px' }}
                />
              </div>
            </div>
          )}
          
          {/* Hashtags (if available) */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs">
                  #{tag}
                </Badge>
              ))}
              {post.hashtags.length > 3 && (
                <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                  +{post.hashtags.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          {/* Poll (if available) */}
          {post.isPollActive && post.pollOptions && post.pollOptions.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <BarChart4 size={12} />
                <span className="text-xs font-medium">Poll</span>
              </div>
              <div className="space-y-1">
                {post.pollOptions.slice(0, 2).map((option, index) => (
                  <div key={index} className="text-xs p-1.5 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 truncate">
                    {option}
                  </div>
                ))}
                {post.pollOptions.length > 2 && (
                  <div className="text-xs text-center text-gray-500">
                    +{post.pollOptions.length - 2} more options
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Status information */}
          <div className="flex items-center gap-2 text-xs text-neutral-medium">
            {type === 'draft' && (
              <>
                <Clock size={12} />
                <span>Last edited: {new Date(post.updatedAt).toLocaleDateString()}</span>
              </>
            )}
            {type === 'scheduled' && (
              <>
                <Calendar size={12} />
                <span className="text-accent-dark">
                  Scheduled for: {
                    post.scheduledTime
                      ? new Date(post.scheduledTime).toLocaleString()
                      : (post as ScheduledPost).scheduledDate
                  }
                </span>
              </>
            )}
            {type === 'published' && (
              <>
                <CheckCircle2 size={12} />
                <span>Published: {(post as PublishedPost).publishedDate}</span>
              </>
            )}
          </div>
          
          {/* Carousel indicator (if applicable) */}
          {post.isCarousel && (
            <Badge variant="outline" className="text-xs">
              Carousel ({post.slideCount} slides)
            </Badge>
          )}
          
          {/* Stats for published posts */}
          {type === 'published' && (post as PublishedPost).stats && (
            <div className="flex text-xs gap-2 justify-between">
              <span>Views: {(post as PublishedPost).stats?.impressions}</span>
              <span>Likes: {(post as PublishedPost).stats?.likes}</span>
              <span>Comments: {(post as PublishedPost).stats?.comments}</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-1 pt-2 border-t mt-auto">
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
                {isPublishing ? 'Publishing...' : 'Publish'}
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
                {isPublishing ? 'Publishing...' : 'Publish Now'}
              </Button>
            </>
          )}
          {type === 'published' && (
            <>
              <Button variant="outline" className="flex-1 h-9 text-xs">
                View Post
              </Button>
              <Button variant="outline" className="flex-1 h-9 text-xs">
                Analytics
              </Button>
              <Button variant="outline" className="flex-1 h-9 text-xs">
                <Copy size={12} className="mr-1" /> Duplicate
              </Button>
            </>
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
          {drafts.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="py-8">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No drafts yet</h3>
                <p className="text-neutral-medium text-sm mb-4">Save your work as drafts to continue later</p>
                <Button onClick={() => navigate('/dashboard/post')}>
                  Create a Post
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((draft) => renderPostCard(draft, 'draft'))}
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
              {scheduled.map((post) => renderPostCard(post, 'scheduled'))}
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
              {published.map((post) => renderPostCard(post, 'published'))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostLibraryPage; 