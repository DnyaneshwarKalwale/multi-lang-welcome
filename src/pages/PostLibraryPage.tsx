import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
  Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PostLibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('drafts');
  
  // Sample data for demonstration
  const drafts = [
    {
      id: '1',
      title: 'The Future of AI in Content Marketing',
      excerpt: 'How AI is transforming content marketing strategies and what professionals should know about...',
      date: 'April 10, 2023',
      isCarousel: false,
    },
    {
      id: '2',
      title: '5 LinkedIn Growth Strategies',
      excerpt: 'Proven strategies to grow your LinkedIn presence and engagement in 2023...',
      date: 'April 8, 2023',
      isCarousel: true,
      slideCount: 5,
    }
  ];
  
  const scheduled = [
    {
      id: '3',
      title: 'Announcing Our New Product Launch',
      excerpt: 'Excited to share our latest innovation that will transform how you create content...',
      scheduledDate: 'Apr 15, 2023 • 10:30 AM',
      isCarousel: false,
    },
    {
      id: '4',
      title: 'LinkedIn Engagement Masterclass',
      excerpt: 'Join me for a deep dive into LinkedIn engagement strategies that actually work...',
      scheduledDate: 'Apr 18, 2023 • 2:00 PM',
      isCarousel: false,
    }
  ];
  
  const published = [
    {
      id: '5',
      title: 'How We Increased Conversions by 300%',
      excerpt: 'A case study on our recent campaign that shattered all expectations...',
      publishedDate: 'Apr 5, 2023',
      stats: {
        impressions: 5420,
        likes: 187,
        comments: 43,
        shares: 21
      },
      isCarousel: false,
    },
    {
      id: '6',
      title: 'The Ultimate LinkedIn Profile Checklist',
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
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-black">Post Library</h1>
        
        <Button 
          onClick={() => window.location.href = '/create-post'}
          className="bg-primary text-white"
        >
          Create New Post
        </Button>
      </div>
      
      <Tabs defaultValue="drafts" className="w-full" onValueChange={setActiveTab}>
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
          <div className="grid grid-cols-1 gap-4">
            {drafts.map(draft => (
              <Card key={draft.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{draft.title}</h3>
                        <p className="text-neutral-medium text-sm mb-3">{draft.excerpt}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <PencilLine size={14} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <Copy size={14} /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-500">
                            <Trash2 size={14} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-xs text-neutral-medium gap-2">
                        <Clock size={14} />
                        <span>Last edited: {draft.date}</span>
                      </div>
                      {draft.isCarousel && (
                        <div className="text-xs bg-primary-50 text-primary px-2 py-1 rounded">
                          Carousel ({draft.slideCount} slides)
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col shrink-0 bg-neutral-lightest border-t md:border-t-0 md:border-l border-border">
                    <Button variant="ghost" className="flex-1 rounded-none border-r md:border-r-0 md:border-b text-xs py-3 px-4">Schedule</Button>
                    <Button variant="ghost" className="flex-1 rounded-none text-xs py-3 px-4">Publish</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <div className="grid grid-cols-1 gap-4">
            {scheduled.map(post => (
              <Card key={post.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                        <p className="text-neutral-medium text-sm mb-3">{post.excerpt}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <PencilLine size={14} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <Clock size={14} /> Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-500">
                            <Trash2 size={14} /> Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center text-xs bg-accent-50 text-accent-dark px-2 py-1 rounded w-fit gap-2 mt-4">
                      <Calendar size={14} />
                      <span>Scheduled for: {post.scheduledDate}</span>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col shrink-0 bg-neutral-lightest border-t md:border-t-0 md:border-l border-border">
                    <Button variant="ghost" className="flex-1 rounded-none border-r md:border-r-0 md:border-b text-xs py-3 px-4">Edit Schedule</Button>
                    <Button variant="ghost" className="flex-1 rounded-none text-xs py-3 px-4">Publish Now</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="published">
          <div className="grid grid-cols-1 gap-4">
            {published.map(post => (
              <Card key={post.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                        <p className="text-neutral-medium text-sm mb-3">{post.excerpt}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <Copy size={14} /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <Share2 size={14} /> Share Analytics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
                      <div className="flex items-center text-xs text-neutral-medium gap-2">
                        <CheckCircle2 size={14} />
                        <span>Published: {post.publishedDate}</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="text-xs text-neutral-medium">Views: {post.stats.impressions}</div>
                        <div className="text-xs text-neutral-medium">Likes: {post.stats.likes}</div>
                        <div className="text-xs text-neutral-medium">Comments: {post.stats.comments}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col shrink-0 bg-neutral-lightest border-t md:border-t-0 md:border-l border-border">
                    <Button variant="ghost" className="flex-1 rounded-none border-r md:border-r-0 md:border-b text-xs py-3 px-4">View Post</Button>
                    <Button variant="ghost" className="flex-1 rounded-none text-xs py-3 px-4">Analytics</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostLibraryPage; 