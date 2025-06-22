import React, { useState, useEffect } from 'react';
import { X, Folder, ArrowLeft, Twitter, Linkedin, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import TweetCard from '@/components/twitter/TweetCard';
import TweetThread from '@/components/twitter/TweetThread';
import { Tweet, Thread } from '@/utils/twitterTypes';
import { tokenManager } from '@/services/api';
import { groupThreads } from '@/utils/twitterApi';
import axios from 'axios';

// LinkedIn post content component (moved outside main component to prevent hook ordering issues)
const LinkedInPostContent: React.FC<{ content: string }> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = content.length > 300;
  const displayContent = shouldTruncate && !isExpanded ? content.slice(0, 300) + '...' : content;

  return (
    <div className="text-sm text-gray-700 leading-relaxed">
      <div className="whitespace-pre-wrap">{displayContent}</div>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

// LinkedIn carousel component (moved outside main component to prevent hook ordering issues)
const LinkedInCarousel: React.FC<{ post: any }> = ({ post }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!post.media || post.media.length <= 1) return null;

  return (
    <div className="relative">
      <div className="rounded-lg overflow-hidden bg-gray-100">
        <img 
          src={post.media[currentIndex]?.url} 
          alt={`Media ${currentIndex + 1}`} 
          className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
          style={{ height: 'auto', maxHeight: '400px' }}
          onClick={() => window.open(post.media[currentIndex]?.url, '_blank')}
        />
      </div>
      {post.media.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {post.media.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// LinkedIn document carousel component (moved outside main component to prevent hook ordering issues)
const LinkedInDocumentCarousel: React.FC<{ 
  document: any, 
  postId: string,
  onOpenPdf: (url: string, title: string) => void 
}> = ({ document: docData, postId, onOpenPdf }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!docData || !docData.coverPages || docData.coverPages.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-50">
      <div className="relative">
        <img 
          src={docData.coverPages[currentIndex]?.url || docData.coverPages[0]?.url} 
          alt={`${docData.title} - Page ${currentIndex + 1}`}
          className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => onOpenPdf(docData.url, docData.title)}
        />
        {docData.coverPages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {docData.coverPages.length}
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-medium text-sm truncate">{docData.title}</h4>
        <p className="text-xs text-gray-500 mt-1">
          {docData.fileType?.toUpperCase()} • {docData.totalPageCount} pages
        </p>
      </div>
    </div>
  );
};

interface PostSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySelection: (selectedContent: string) => void;
  selectedPostsCount: number;
}

const PostSelectionModal: React.FC<PostSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplySelection, 
  selectedPostsCount
}) => {
  const { toast } = useToast();
  
  // State for folder-based organization
  const [viewMode, setViewMode] = useState<'folders' | 'posts'>('folders');
  const [selectedUsers, setSelectedUsers] = useState<{
    twitter: Set<string>;
    linkedin: Set<string>;
  }>({
    twitter: new Set(),
    linkedin: new Set()
  });
  const [selectedPosts, setSelectedPosts] = useState<{
    twitter: Set<string>;
    linkedin: Set<string>;
  }>({
    twitter: new Set(),
    linkedin: new Set()
  });
  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin'>('twitter');
  
  // New state for scraping functionality
  const [inputUrl, setInputUrl] = useState('');
  const [isScrapingLinkedIn, setIsScrapingLinkedIn] = useState(false);
  const [isScrapingTwitter, setIsScrapingTwitter] = useState(false);
  const [lastSearchedLinkedInProfile, setLastSearchedLinkedInProfile] = useState<string>('');
  const [lastSearchedTwitterUser, setLastSearchedTwitterUser] = useState<string>('');
  
  // Saved posts data
  const [savedTwitterPosts, setSavedTwitterPosts] = useState<Tweet[]>([]);
  const [savedTwitterThreads, setSavedTwitterThreads] = useState<Thread[]>([]);
  const [savedLinkedInPosts, setSavedLinkedInPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved posts when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSavedPosts();
    }
  }, [isOpen]);

  const loadSavedPosts = async () => {
    setIsLoading(true);
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
    
    // Get token using tokenManager (same as save function)
    const authMethod = localStorage.getItem('auth-method');
    const token = authMethod ? tokenManager.getToken(authMethod) : null;
    
    if (!token) {
      console.warn('No auth token found');
      setIsLoading(false);
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    console.log('Loading saved posts with API URL:', apiBaseUrl);
    
    // Load saved Twitter posts
    try {
      const twitterApiUrl = apiBaseUrl.endsWith('/api') 
        ? `${apiBaseUrl}/twitter/saved`
        : `${apiBaseUrl}/api/twitter/saved`;
      const twitterResponse = await axios.get(twitterApiUrl, { headers });
      if (twitterResponse.data.success) {
        const rawTweets = twitterResponse.data.data || [];
        
        // Group tweets into threads and standalone tweets (same logic as scraper page)
        const groupedData = groupThreads(rawTweets);
        const standaloneTweets: Tweet[] = [];
        const threads: Thread[] = [];
        
        groupedData.forEach(item => {
          if ('tweets' in item) {
            // This is a thread
            threads.push(item);
          } else {
            // This is a standalone tweet
            standaloneTweets.push(item);
          }
        });
        
        setSavedTwitterPosts(standaloneTweets);
        setSavedTwitterThreads(threads);
        console.log('Loaded Twitter posts:', standaloneTweets.length, 'tweets and', threads.length, 'threads');
      } else {
        console.warn('Failed to load saved Twitter posts:', twitterResponse.data.message);
        setSavedTwitterPosts([]);
        setSavedTwitterThreads([]);
      }
    } catch (error) {
      console.error('Error loading saved Twitter posts:', error);
      if (error.response?.status === 401) {
        toast({
          description: 'Please log in to view saved posts',
          variant: "destructive",
        });
      }
      setSavedTwitterPosts([]);
      setSavedTwitterThreads([]);
    }
    
    // Load saved LinkedIn posts
    try {
      const linkedinApiUrl = apiBaseUrl.endsWith('/api') 
        ? `${apiBaseUrl}/linkedin/saved-posts`
        : `${apiBaseUrl}/api/linkedin/saved-posts`;
      const linkedinResponse = await axios.get(linkedinApiUrl, { headers });
      if (linkedinResponse.data.success) {
        setSavedLinkedInPosts(linkedinResponse.data.data || []);
        console.log('Loaded LinkedIn posts:', linkedinResponse.data.data?.length || 0);
      } else {
        console.warn('Failed to load saved LinkedIn posts:', linkedinResponse.data.message);
        setSavedLinkedInPosts([]);
      }
    } catch (error) {
      console.error('Error loading saved LinkedIn posts:', error);
      console.error('LinkedIn posts error response:', error.response?.data);
      if (error.response?.status === 401) {
        toast({
          description: 'Please log in to view saved posts',
          variant: "destructive",
        });
      }
      setSavedLinkedInPosts([]);
    }
    
    setIsLoading(false);
  };

  const handleDeleteTwitterPost = async (tweetId: string) => {
    // Implementation for deleting Twitter post
    console.log('Delete Twitter post:', tweetId);
  };

  const handleDeleteLinkedInPost = async (postId: string) => {
    // Implementation for deleting LinkedIn post
    console.log('Delete LinkedIn post:', postId);
  };

  const openPdfViewer = (documentUrl: string, documentTitle: string) => {
    window.open(documentUrl, '_blank');
  };

  if (!isOpen) return null;

  // Organize Twitter posts by user
  const organizeTwitterByUser = () => {
    const userMap = new Map<string, (Tweet | Thread)[]>();
    
    // Add standalone tweets
    savedTwitterPosts.forEach(tweet => {
      const username = tweet.author?.username || 'Unknown User';
      if (!userMap.has(username)) {
        userMap.set(username, []);
      }
      userMap.get(username)!.push(tweet);
    });

    // Add threads
    savedTwitterThreads.forEach(thread => {
      const username = thread.tweets[0]?.author?.username || thread.author?.username || 'Unknown User';
      if (!userMap.has(username)) {
        userMap.set(username, []);
      }
      userMap.get(username)!.push(thread);
    });

    return userMap;
  };

  // Organize LinkedIn posts by user
  const organizeLinkedInByUser = () => {
    const userMap = new Map<string, any[]>();
    
    savedLinkedInPosts.forEach(post => {
      const postData = post.postData || post;
      const authorName = postData.author || 'Unknown Author';
      if (!userMap.has(authorName)) {
        userMap.set(authorName, []);
      }
      userMap.get(authorName)!.push(post);
    });

    return userMap;
  };

  // Toggle user selection
  const toggleUserSelection = (platform: 'twitter' | 'linkedin', username: string) => {
    setSelectedUsers(prev => {
      const newSelection = { ...prev };
      const currentSet = new Set(newSelection[platform]);
      
      if (currentSet.has(username)) {
        currentSet.delete(username);
        // Also deselect all posts from this user
        deselectAllPostsFromUser(platform, username);
      } else {
        currentSet.add(username);
        // Auto-select all posts from this user
        selectAllPostsFromUser(platform, username);
      }
      
      newSelection[platform] = currentSet;
      return newSelection;
    });
  };

  const selectAllPostsFromUser = (platform: 'twitter' | 'linkedin', username: string) => {
    if (platform === 'twitter') {
      const userPosts = organizeTwitterByUser().get(username) || [];
      setSelectedPosts(prev => {
        const newSelected = new Set(prev.twitter);
        userPosts.forEach(post => {
          const postId = 'tweets' in post ? post.id : post.id;
          newSelected.add(postId);
        });
        return { ...prev, twitter: newSelected };
      });
    } else if (platform === 'linkedin') {
      const userPosts = organizeLinkedInByUser().get(username) || [];
      setSelectedPosts(prev => {
        const newSelected = new Set(prev.linkedin);
        userPosts.forEach(post => {
          const postData = post.postData || post;
          newSelected.add(postData.id);
        });
        return { ...prev, linkedin: newSelected };
      });
    }
  };

  const deselectAllPostsFromUser = (platform: 'twitter' | 'linkedin', username: string) => {
    if (platform === 'twitter') {
      const userPosts = organizeTwitterByUser().get(username) || [];
      setSelectedPosts(prev => {
        const newSelected = new Set(prev.twitter);
        userPosts.forEach(post => {
          const postId = 'tweets' in post ? post.id : post.id;
          newSelected.delete(postId);
        });
        return { ...prev, twitter: newSelected };
      });
    } else if (platform === 'linkedin') {
      const userPosts = organizeLinkedInByUser().get(username) || [];
      setSelectedPosts(prev => {
        const newSelected = new Set(prev.linkedin);
        userPosts.forEach(post => {
          const postData = post.postData || post;
          newSelected.delete(postData.id);
        });
        return { ...prev, linkedin: newSelected };
      });
    }
  };

  // Toggle individual post selection
  const togglePostSelection = (platform: 'twitter' | 'linkedin', postId: string) => {
    setSelectedPosts(prev => {
      const newSelection = { ...prev };
      const currentSet = new Set(newSelection[platform]);
      
      if (currentSet.has(postId)) {
        currentSet.delete(postId);
      } else {
        currentSet.add(postId);
      }
      
      newSelection[platform] = currentSet;
      return newSelection;
    });
  };

  // Get posts from selected users
  const getPostsFromSelectedUsers = () => {
    const twitterUsers = organizeTwitterByUser();
    const linkedinUsers = organizeLinkedInByUser();
    const filteredPosts = {
      twitter: [] as (Tweet | Thread)[],
      linkedin: [] as any[]
    };

    // Get Twitter posts from selected users
    selectedUsers.twitter.forEach(username => {
      const userPosts = twitterUsers.get(username) || [];
      filteredPosts.twitter.push(...userPosts);
    });

    // Get LinkedIn posts from selected users
    selectedUsers.linkedin.forEach(username => {
      const userPosts = linkedinUsers.get(username) || [];
      filteredPosts.linkedin.push(...userPosts);
    });

    return filteredPosts;
  };

  // Check if user has any selected posts
  const hasSelectedPostsFromUser = (platform: 'twitter' | 'linkedin', username: string) => {
    if (platform === 'twitter') {
      const userPosts = organizeTwitterByUser().get(username) || [];
      return userPosts.some(post => {
        const postId = 'tweets' in post ? post.id : post.id;
        return selectedPosts.twitter.has(postId);
      });
    } else {
      const userPosts = organizeLinkedInByUser().get(username) || [];
      return userPosts.some(post => {
        const postData = post.postData || post;
        return selectedPosts.linkedin.has(postData.id);
      });
    }
  };

  // Count selected posts from user
  const getSelectedPostsCountFromUser = (platform: 'twitter' | 'linkedin', username: string) => {
    if (platform === 'twitter') {
      const userPosts = organizeTwitterByUser().get(username) || [];
      return userPosts.filter(post => {
        const postId = 'tweets' in post ? post.id : post.id;
        return selectedPosts.twitter.has(postId);
      }).length;
    } else {
      const userPosts = organizeLinkedInByUser().get(username) || [];
      return userPosts.filter(post => {
        const postData = post.postData || post;
        return selectedPosts.linkedin.has(postData.id);
      }).length;
    }
  };

  // Proceed to post selection view
  const proceedToPostSelection = () => {
    if (selectedUsers.twitter.size === 0 && selectedUsers.linkedin.size === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to view their posts",
      });
      return;
    }
    setViewMode('posts');
  };

  // Go back to user selection
  const backToUserSelection = () => {
    setViewMode('folders');
  };

  const handleApplySelection = () => {
    const selectedContent: string[] = [];
    
    // Get selected Twitter content
    const allTwitterContent = getPostsFromSelectedUsers().twitter;
    allTwitterContent.forEach(item => {
      const itemId = 'tweets' in item ? item.id : item.id;
      if (selectedPosts.twitter.has(itemId)) {
        if ('tweets' in item) {
          // This is a thread
          const threadContent = item.tweets.map(tweet => tweet.text || tweet.full_text).join('\n\n');
          selectedContent.push(threadContent);
        } else {
          // This is a standalone tweet
          selectedContent.push(item.text || item.full_text || '');
        }
      }
    });
    
    // Get selected LinkedIn content
    const allLinkedInContent = getPostsFromSelectedUsers().linkedin;
    allLinkedInContent.forEach(post => {
      const postData = post.postData || post;
      const postId = postData.id;
      if (selectedPosts.linkedin.has(postId)) {
        selectedContent.push(postData.content || '');
      }
    });
    
    // Join all content with separators
    const finalContent = selectedContent.join('\n\n---\n\n');
    
    // Call the callback with the selected content
    onApplySelection(finalContent);
    
    // Close the modal
    onClose();
    
    toast({
      title: "Writing Style Applied",
      description: `${selectedContent.length} posts selected as writing style reference for AI content generation.`,
    });
  };

  // Handle LinkedIn profile scraping
  const handleLinkedInScrape = async () => {
    if (!inputUrl) {
      toast({
        title: "Error",
        description: "Please enter a LinkedIn username or profile URL",
        variant: "destructive"
      });
      return;
    }

    // Extract username from URL or use as is
    let username = inputUrl.trim();
    
    // Handle different URL formats
    if (username.includes('linkedin.com/in/')) {
      const match = username.match(/linkedin\.com\/in\/([^\/\?]+)/);
      username = match ? match[1] : username;
    } else if (username.includes('linkedin.com/company/')) {
      const match = username.match(/linkedin\.com\/company\/([^\/\?]+)/);
      username = match ? match[1] : username;
    }
    
    // Remove @ if present and any trailing slashes
    username = username.replace('@', '').replace(/\/+$/, '');

    setIsScrapingLinkedIn(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const token = localStorage.getItem('token');
      
      const headers: any = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const apiUrl = apiBaseUrl.endsWith('/api') 
        ? `${apiBaseUrl}/linkedin/scrape-profile`
        : `${apiBaseUrl}/api/linkedin/scrape-profile`;
        
      const response = await axios.post(apiUrl, {
        username: username
      }, { 
        headers,
        timeout: 90000
      });

      if (response.data.success) {
        // Auto-save all LinkedIn posts immediately after scraping
        const posts = response.data.posts || [];
        setSavedLinkedInPosts(prev => [...prev, ...posts]);
        
        toast({
          title: "Success",
          description: `Successfully scraped ${posts.length} posts from ${username}`,
        });
        
        // Clear input after successful scrape
        setInputUrl('');
      } else {
        toast({
          title: "Error",
          description: response.data.message || 'Failed to scrape LinkedIn profile',
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('LinkedIn scraping error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to scrape LinkedIn profile',
        variant: "destructive"
      });
    } finally {
      setIsScrapingLinkedIn(false);
    }
  };

  // Handle Twitter scraping
  const handleTwitterScrape = async () => {
    if (!inputUrl) {
      toast({
        title: "Error",
        description: "Please enter a Twitter username or profile URL",
        variant: "destructive"
      });
      return;
    }

    // Extract username from URL or use as is
    let username = inputUrl.trim();
    
    // Handle different URL formats
    if (username.includes('twitter.com/') || username.includes('x.com/')) {
      const urlParts = username.split('/');
      username = urlParts[urlParts.length - 1];
      username = username.split('?')[0]; // Remove query parameters
    }
    
    // Remove @ if present and any trailing slashes
    username = username.replace('@', '').replace(/\/+$/, '');
    
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter a valid Twitter username",
        variant: "destructive"
      });
      return;
    }
    
    setIsScrapingTwitter(true);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/twitter/user/${username}`
        : `${baseUrl}/api/twitter/user/${username}`;
      
      const response = await axios.get(apiUrl, {
        timeout: 300000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    
      if (response.data && response.data.success) {
        const tweets: Tweet[] = response.data.data;
        
        // Group tweets into threads
        const groupedData = groupThreads(tweets);
        const threads: Thread[] = [];
        const standaloneTweets: Tweet[] = [];
        
        groupedData.forEach(item => {
          if ('tweets' in item) {
            threads.push(item);
          } else {
            standaloneTweets.push(item);
          }
        });
        
        // Update state with new tweets
        setSavedTwitterPosts(prev => [...prev, ...standaloneTweets]);
        setSavedTwitterThreads(prev => [...prev, ...threads]);
        
        toast({
          title: "Success",
          description: `Successfully retrieved ${tweets.length} tweets from @${username}`,
        });
        
        // Clear input after successful scrape
        setInputUrl('');
      } else {
        toast({
          title: "Error",
          description: "Failed to retrieve tweets",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Twitter scraping error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to retrieve tweets',
        variant: "destructive"
      });
    } finally {
      setIsScrapingTwitter(false);
    }
  };

  // Add scraping UI to the header section
  const renderScrapingUI = () => (
    <div className="mb-6 border-b pb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder={
            activeTab === 'linkedin'
              ? "Enter LinkedIn username (e.g., johndoe or linkedin.com/in/johndoe)"
              : "Enter Twitter username (e.g., @username or twitter.com/username)"
          }
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isScrapingLinkedIn && !isScrapingTwitter) {
              e.preventDefault();
              activeTab === 'linkedin' ? handleLinkedInScrape() : handleTwitterScrape();
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={() => activeTab === 'linkedin' ? handleLinkedInScrape() : handleTwitterScrape()}
          disabled={isScrapingLinkedIn || isScrapingTwitter || !inputUrl}
          className="min-w-[120px]"
        >
          {(isScrapingLinkedIn || isScrapingTwitter) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              {activeTab === 'linkedin' ? 'Scrape Profile' : 'Get Tweets'}
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Folder className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {viewMode === 'folders' ? 'Saved Posts - By User' : 'Posts from Selected Users'}
                </h2>
                <p className="text-sm text-gray-500">
                  {viewMode === 'folders' 
                    ? `${savedTwitterPosts.length + savedTwitterThreads.reduce((sum, thread) => sum + thread.tweets.length, 0) + savedLinkedInPosts.length} total saved posts`
                    : `${selectedUsers.twitter.size + selectedUsers.linkedin.size} users selected`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {viewMode === 'posts' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={backToUserSelection}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Users
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="text-center py-16 text-gray-500">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Loading saved posts...</h3>
              <p>Please wait while we fetch your saved content.</p>
            </div>
          ) : (savedTwitterPosts.length === 0 && savedLinkedInPosts.length === 0 && savedTwitterThreads.length === 0) ? (
            <div className="text-center py-16 text-gray-500">
              <Folder className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No saved posts yet</h3>
              <p className="mb-6">Start by scraping some content below!</p>
              {renderScrapingUI()}
            </div>
          ) : viewMode === 'folders' ? (
            // User Folder View
            <div className="space-y-6">
              {/* Add scraping UI at the top */}
              {renderScrapingUI()}

              <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">How to Select Posts:</h4>
                <div className="space-y-2">
                  <p><strong>• Click the circle</strong> to select ALL posts from a user (entire folder)</p>
                  <p><strong>• Click the folder name</strong> to browse and select individual posts</p>
                  <p>Selected posts will be used as writing style reference for AI content generation.</p>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'twitter' | 'linkedin')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter Users ({organizeTwitterByUser().size})
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Users ({organizeLinkedInByUser().size})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="twitter">
                  {organizeTwitterByUser().size === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No saved Twitter posts</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from(organizeTwitterByUser().entries()).map(([username, posts]) => (
                        <Card 
                          key={username}
                          className={`transition-all hover:shadow-md ${
                            selectedUsers.twitter.has(username) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="flex-shrink-0 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleUserSelection('twitter', username);
                                }}
                              >
                                {selectedUsers.twitter.has(username) ? (
                                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <div className="h-3 w-3 text-white">✓</div>
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-blue-400"></div>
                                )}
                              </div>
                              <div 
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => {
                                  // Show posts for this user without selecting them
                                  setViewMode('posts');
                                  setActiveTab('twitter');
                                  setSelectedUsers(prev => ({
                                    twitter: new Set([username]),
                                    linkedin: new Set() // Clear LinkedIn selection when browsing Twitter
                                  }));
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Folder className="h-4 w-4 text-gray-500" />
                                  <p className="font-medium text-sm truncate">@{username}</p>
                                  {hasSelectedPostsFromUser('twitter', username) && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {posts.length} post{posts.length !== 1 ? 's' : ''}
                                  {hasSelectedPostsFromUser('twitter', username) && (
                                    <span className="text-blue-600 font-medium ml-2">
                                      • {getSelectedPostsCountFromUser('twitter', username)} selected
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="linkedin">
                  {organizeLinkedInByUser().size === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No saved LinkedIn posts</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from(organizeLinkedInByUser().entries()).map(([authorName, posts]) => (
                        <Card 
                          key={authorName}
                          className={`transition-all hover:shadow-md ${
                            selectedUsers.linkedin.has(authorName) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="flex-shrink-0 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleUserSelection('linkedin', authorName);
                                }}
                              >
                                {selectedUsers.linkedin.has(authorName) ? (
                                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <div className="h-3 w-3 text-white">✓</div>
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-blue-400"></div>
                                )}
                              </div>
                              <div 
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => {
                                  // Show posts for this user without selecting them
                                  setViewMode('posts');
                                  setActiveTab('linkedin');
                                  setSelectedUsers(prev => ({
                                    twitter: new Set(), // Clear Twitter selection when browsing LinkedIn
                                    linkedin: new Set([authorName])
                                  }));
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Folder className="h-4 w-4 text-gray-500" />
                                  <p className="font-medium text-sm truncate">{authorName}</p>
                                  {hasSelectedPostsFromUser('linkedin', authorName) && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {posts.length} post{posts.length !== 1 ? 's' : ''}
                                  {hasSelectedPostsFromUser('linkedin', authorName) && (
                                    <span className="text-blue-600 font-medium ml-2">
                                      • {getSelectedPostsCountFromUser('linkedin', authorName)} selected
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Post Selection View - showing posts from selected users
            <>
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => setViewMode('folders')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Folders
                </Button>
              </div>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'twitter' | 'linkedin')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter Posts ({getPostsFromSelectedUsers().twitter.length})
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Posts ({getPostsFromSelectedUsers().linkedin.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="twitter">
                  {getPostsFromSelectedUsers().twitter.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No posts from selected Twitter users</p>
                    </div>
                  ) : (
                    <div className="columns-1 md:columns-2 gap-6">
                      {(() => {
                        const allContent = getPostsFromSelectedUsers().twitter;
                        
                        // Sort by date (newest first)
                        allContent.sort((a, b) => {
                          const dateA = new Date('tweets' in a ? a.tweets[0]?.created_at || a.created_at : a.created_at || '');
                          const dateB = new Date('tweets' in b ? b.tweets[0]?.created_at || b.created_at : b.created_at || '');
                          return dateB.getTime() - dateA.getTime();
                        });
                        
                        return allContent.map((item, index) => {
                          const itemId = 'tweets' in item ? item.id : item.id;
                          const isSelected = selectedPosts.twitter.has(itemId);
                          
                          return (
                            <div 
                              key={'tweets' in item ? `filtered-thread-${item.id}` : `filtered-tweet-${item.id}`} 
                              className={`break-inside-avoid mb-6 w-full relative cursor-pointer transition-all ${
                                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => togglePostSelection('twitter', itemId)}
                            >
                              {'tweets' in item ? (
                                // This is a thread
                                <div className="relative">
                                  <TweetThread thread={item} />
                                  {isSelected && (
                                    <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                      <div className="h-4 w-4 text-white">✓</div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                // This is a standalone tweet
                                <div className="relative">
                                  <TweetCard tweet={item} />
                                  {isSelected && (
                                    <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                      <div className="h-4 w-4 text-white">✓</div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="linkedin">
                  {getPostsFromSelectedUsers().linkedin.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No posts from selected LinkedIn users</p>
                    </div>
                  ) : (
                    <div className="masonry-container columns-1 md:columns-2 xl:columns-3 gap-6">
                      {getPostsFromSelectedUsers().linkedin.map((post, index) => {
                        const postData = post.postData || post;
                        const postId = postData.id;
                        const isSelected = selectedPosts.linkedin.has(postId);
                        
                        return (
                          <Card 
                            key={`filtered-${postData.id}-${index}`} 
                            className={`linkedin-post-card bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 break-inside-avoid mb-6 relative cursor-pointer ${
                              isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}
                            onClick={() => togglePostSelection('linkedin', postId)}
                          >
                            {isSelected && (
                              <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                                <div className="h-4 w-4 text-white">✓</div>
                              </div>
                            )}
                            
                            <CardHeader className="p-4 pb-3">
                              <div className="flex items-start gap-3">
                                <img 
                                  src={postData.authorAvatar || 'https://via.placeholder.com/40'} 
                                  alt={postData.author}
                                  className="w-10 h-10 rounded-full object-cover" 
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900">{postData.author}</h4>
                                  <p className="text-xs text-gray-600 line-clamp-2">{postData.authorHeadline}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Saved • {new Date(postData.savedAt || post.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="p-4 pt-0">
                              <div className="space-y-4">
                                <div className="linkedin-post-content">
                                  <LinkedInPostContent content={postData.content || ''} />
                                </div>
                                
                                {postData.media && postData.media.length > 0 && (
                                  <div className="relative">
                                    {postData.media.length === 1 ? (
                                      <div className="rounded-lg overflow-hidden bg-gray-100">
                                        <img 
                                          src={postData.media[0].url} 
                                          alt="Post media" 
                                          className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                          style={{ height: 'auto', maxHeight: '400px' }}
                                          onClick={() => window.open(postData.media[0].url, '_blank')}
                                        />
                                      </div>
                                    ) : (
                                      <LinkedInCarousel post={postData} />
                                    )}
                                  </div>
                                )}
                                
                                {postData.documents && postData.documents.length > 0 && (
                                  <div className="space-y-3">
                                    {postData.documents.map((doc: any, docIndex: number) => (
                                      <LinkedInDocumentCarousel 
                                        key={docIndex} 
                                        document={doc} 
                                        postId={postData.id}
                                        onOpenPdf={openPdfViewer}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
        
        {/* Footer with Apply button */}
        {!isLoading && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedPosts.twitter.size + selectedPosts.linkedin.size > 0 ? (
                  <span>{selectedPosts.twitter.size + selectedPosts.linkedin.size} posts selected for writing style reference</span>
                ) : (
                  <span>Select posts to use as writing style reference for AI generation</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {selectedPosts.twitter.size + selectedPosts.linkedin.size > 0 && (
                  <Button 
                    onClick={handleApplySelection}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply {selectedPosts.twitter.size + selectedPosts.linkedin.size} Posts
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSelectionModal; 