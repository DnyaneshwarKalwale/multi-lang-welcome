import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Linkedin, Globe, Youtube, Copy, 
  Lightbulb, MessageSquare, Save, Loader2,
  FileText, ArrowRight, PlusCircle, Twitter,
  ThumbsUp, ExternalLink, Code
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { fetchUserTweets, Tweet, Thread, TwitterResult } from '@/utils/twitterApi';

// Scraper result interface
interface ScraperResult {
  content: string;
  keyPoints: string[];
  tone: string;
  suggestedHook: string;
  estimatedReadTime: number;
  wordCount: number;
}

const ScraperPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('linkedin');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);
  const [twitterResult, setTwitterResult] = useState<TwitterResult | null>(null);
  const [selectedTweets, setSelectedTweets] = useState<Set<string>>(new Set());
  const [selectedThreads, setSelectedThreads] = useState<Set<string>>(new Set());
  const [twitterFilter, setTwitterFilter] = useState<'all' | 'tweets' | 'threads'>('all');
  
  // Example result data for demonstration
  const exampleResult: ScraperResult = {
    content: "In today's digital landscape, content creation has become a cornerstone of successful marketing strategies. However, many businesses struggle with consistency and quality. Our recent study of 500 marketing professionals revealed that companies using AI-assisted content generation saw a 37% increase in engagement and a 22% reduction in content production time. The key findings suggest that human-AI collaboration produces the best results, with AI handling research and initial drafts while humans refine messaging and add authentic perspectives. This approach not only improves efficiency but also enhances content relevance across different platforms.",
    keyPoints: [
      "Companies using AI for content creation saw 37% higher engagement",
      "Human-AI collaboration produces better results than either alone",
      "Content production time reduced by 22% when using AI assistance",
      "Quality and consistency improved across multiple platforms"
    ],
    tone: "Professional, informative, data-driven",
    suggestedHook: "Our recent study of 500 marketing professionals revealed a surprising insight about AI-assisted content creation that could transform your engagement metrics...",
    estimatedReadTime: 2,
    wordCount: 120
  };

  // Process URL from input
  const handleScrape = async () => {
    if (!inputUrl) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (activeTab === 'twitter') {
        await handleTwitterScrape();
      } else {
        // Handle other platforms (existing code)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResult(exampleResult);
        toast.success('Content scraped successfully!');
      }
    } catch (error) {
      console.error(`Error scraping content from ${activeTab}:`, error);
      toast.error(`Failed to scrape content from ${activeTab}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Twitter specific scraping logic
  const handleTwitterScrape = async () => {
    // Extract username from Twitter URL or direct input
    let username = inputUrl;
    
    // If it's a URL, extract the username
    if (inputUrl.includes('twitter.com/') || inputUrl.includes('x.com/')) {
      const urlParts = inputUrl.split('/');
      username = urlParts[urlParts.length - 1];
      
      // Clean up any query parameters
      username = username.split('?')[0];
    }
    
    // Remove @ symbol if present
    if (username.startsWith('@')) {
      username = username.substring(1);
    }
    
    if (!username) {
      toast.error('Please enter a valid Twitter username');
      return;
    }
    
    // Fetch tweets directly using our utility
    const result = await fetchUserTweets(username);
    setTwitterResult(result);
    
    // Show success message
    const totalTweets = result.tweets.length + result.threads.reduce(
      (total, thread) => total + thread.tweets.length, 0
    );
    toast.success(`Successfully retrieved ${totalTweets} tweets from @${username}`);
  };

  // Copy content to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Save to inspiration vault
  const handleSaveToInspiration = () => {
    // In a real app, make API call to save to inspiration vault
    toast.success('Saved to Inspiration Vault!');
  };

  // Create post from scraped content
  const handleCreatePost = () => {
    // In a real app, you would store the scraped content and redirect
    navigate('/dashboard/post');
  };

  // Toggle tweet selection
  const handleToggleTweetSelection = (tweetId: string) => {
    const newSelection = new Set(selectedTweets);
    
    if (newSelection.has(tweetId)) {
      newSelection.delete(tweetId);
    } else {
      newSelection.add(tweetId);
    }
    
    setSelectedTweets(newSelection);
  };

  // Toggle thread selection
  const handleToggleThreadSelection = (threadId: string) => {
    const newSelection = new Set(selectedThreads);
    
    if (newSelection.has(threadId)) {
      newSelection.delete(threadId);
    } else {
      newSelection.add(threadId);
    }
    
    setSelectedThreads(newSelection);
  };

  // Save selected tweets
  const handleSaveSelectedTweets = () => {
    if (selectedTweets.size === 0 && selectedThreads.size === 0) {
      toast.error('Please select at least one tweet or thread to save');
      return;
    }
    
    // Calculate the total number of selected items
    const selectedTweetsCount = selectedTweets.size;
    const selectedThreadTweets = twitterResult?.threads
      .filter(thread => selectedThreads.has(thread.id))
      .reduce((count, thread) => count + thread.tweets.length, 0) || 0;
    
    const totalSelected = selectedTweetsCount + selectedThreadTweets;
    
    toast.success(`Saved ${totalSelected} tweets to your inspiration collection!`);
    setSelectedTweets(new Set());
    setSelectedThreads(new Set());
  };

  // Reset selection when tab changes
  useEffect(() => {
    setInputUrl('');
    setResult(null);
    setTwitterResult(null);
    setSelectedTweets(new Set());
    setSelectedThreads(new Set());
  }, [activeTab]);

  // Get filtered Twitter content based on current filter
  const getFilteredTwitterContent = () => {
    if (!twitterResult) return { tweets: [], threads: [] };
    
    if (twitterFilter === 'all') {
      return { tweets: twitterResult.tweets, threads: twitterResult.threads };
    } else if (twitterFilter === 'tweets') {
      return { tweets: twitterResult.tweets, threads: [] };
    } else {
      return { tweets: [], threads: twitterResult.threads };
    }
  };

  // Render a tweet card
  const renderTweetCard = (tweet: Tweet) => (
    <Card key={tweet.id} className={`overflow-hidden ${selectedTweets.has(tweet.id) ? 'border-primary' : ''}`}>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img 
              src={tweet.author.profile_image_url} 
              alt={tweet.author.name}
              className="w-8 h-8 rounded-full" 
            />
            <div>
              <CardTitle className="text-base">{tweet.author.name}</CardTitle>
              <CardDescription className="text-xs">@{tweet.author.username}</CardDescription>
            </div>
          </div>
          <CardDescription className="text-xs">
            {new Date(tweet.created_at).toLocaleDateString()}
          </CardDescription>
        </div>
        <div>
          <Button
            variant={selectedTweets.has(tweet.id) ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleToggleTweetSelection(tweet.id)}
            className="h-8 w-8 p-0"
          >
            {selectedTweets.has(tweet.id) ? (
              <div className="h-5 w-5 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                ✓
              </div>
            ) : (
              <div className="h-5 w-5 rounded-sm border border-input"></div>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="whitespace-pre-line text-sm">
          {tweet.full_text || tweet.text}
        </p>
        
        {tweet.media && tweet.media.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {tweet.media.map((media, index) => (
              media.type === 'photo' && (
                <div key={media.media_key || index} className="rounded overflow-hidden">
                  <img 
                    src={media.url} 
                    alt="Tweet media" 
                    className="w-full h-auto"
                  />
                </div>
              )
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t flex justify-between bg-gray-50">
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {tweet.public_metrics.reply_count}
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            {tweet.public_metrics.retweet_count}
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            {tweet.public_metrics.like_count}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => handleCopy(tweet.full_text || tweet.text)}>
          <Copy className="h-3 w-3 mr-1" />
          Copy
        </Button>
      </CardFooter>
    </Card>
  );

  // Render a thread card
  const renderThreadCard = (thread: Thread) => (
    <Card key={thread.id} className={`overflow-hidden ${selectedThreads.has(thread.id) ? 'border-primary' : ''}`}>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img 
              src={thread.author.profile_image_url} 
              alt={thread.author.name}
              className="w-8 h-8 rounded-full" 
            />
            <div>
              <CardTitle className="text-base">{thread.author.name}</CardTitle>
              <CardDescription className="text-xs">@{thread.author.username}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CardDescription className="text-xs">
              {new Date(thread.created_at).toLocaleDateString()}
            </CardDescription>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Thread • {thread.tweets.length} tweets
            </span>
          </div>
        </div>
        <div>
          <Button
            variant={selectedThreads.has(thread.id) ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleToggleThreadSelection(thread.id)}
            className="h-8 w-8 p-0"
          >
            {selectedThreads.has(thread.id) ? (
              <div className="h-5 w-5 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                ✓
              </div>
            ) : (
              <div className="h-5 w-5 rounded-sm border border-input"></div>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-4">
          {thread.tweets.slice(0, 2).map((tweet, index) => (
            <div key={tweet.id} className="relative">
              {index > 0 && (
                <div className="absolute top-0 left-4 h-4 w-0.5 bg-gray-200" style={{ top: '-16px' }}></div>
              )}
              <div className={`flex gap-3 ${index < thread.tweets.length - 1 ? 'pb-4' : ''}`}>
                <div className="relative">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={tweet.author.profile_image_url} 
                      alt={tweet.author.name}
                      className="w-full h-full" 
                    />
                  </div>
                  {index < thread.tweets.length - 1 && (
                    <div className="absolute top-8 left-4 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="whitespace-pre-line text-sm">
                    {tweet.full_text || tweet.text}
                  </p>
                  
                  {tweet.media && tweet.media.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {tweet.media.map((media, idx) => (
                        media.type === 'photo' && (
                          <div key={media.media_key || idx} className="rounded overflow-hidden">
                            <img 
                              src={media.url} 
                              alt="Tweet media" 
                              className="w-full h-auto"
                            />
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {thread.tweets.length > 2 && (
            <div className="pt-2 text-center">
              <Button variant="outline" size="sm" className="w-full">
                Show {thread.tweets.length - 2} more tweets
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t flex justify-between bg-gray-50">
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {thread.tweets.reduce((sum, t) => sum + t.public_metrics.reply_count, 0)}
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            {thread.tweets.reduce((sum, t) => sum + t.public_metrics.retweet_count, 0)}
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            {thread.tweets.reduce((sum, t) => sum + t.public_metrics.like_count, 0)}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleCopy(thread.tweets.map(t => t.full_text || t.text).join('\n\n'))}
        >
          <Copy className="h-3 w-3 mr-1" />
          Copy Thread
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Content Scraper</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Extract valuable content from LinkedIn profiles, websites, Twitter, and YouTube videos
        </p>
      </div>
      
      <Tabs defaultValue="linkedin" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Website</span>
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            <span>Twitter</span>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            <span>YouTube</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={
                  activeTab === 'linkedin' 
                    ? 'Enter LinkedIn profile or post URL' 
                    : activeTab === 'website'
                      ? 'Enter website URL'
                      : activeTab === 'twitter'
                        ? 'Enter Twitter username or profile URL'
                        : 'Enter YouTube video URL'
                }
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleScrape} 
              disabled={isLoading || !inputUrl} 
              className="gap-2 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Scrape
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {activeTab === 'linkedin' 
              ? 'Example: https://www.linkedin.com/in/username or https://www.linkedin.com/posts/...' 
              : activeTab === 'website'
                ? 'Example: https://www.example.com/blog/article'
                : activeTab === 'twitter'
                  ? 'Example: @username or https://twitter.com/username'
                  : 'Example: https://www.youtube.com/watch?v=videoId'
            }
          </p>
        </div>
        
        {/* Twitter Results Section */}
        {activeTab === 'twitter' && twitterResult && (
          <div className="space-y-6">
            {/* Twitter profile summary */}
            {twitterResult.profile && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-4">
                  <img 
                    src={twitterResult.profile.profile_image_url} 
                    alt={twitterResult.profile.name}
                    className="w-16 h-16 rounded-full border-2 border-white shadow-md" 
                  />
                  <div>
                    <h3 className="font-bold text-lg">{twitterResult.profile.name}</h3>
                    <p className="text-blue-700">@{twitterResult.profile.username}</p>
                    <div className="flex gap-4 mt-1 text-sm">
                      <span className="text-gray-600">
                        <strong>{twitterResult.profile.followers_count.toLocaleString()}</strong> Followers
                      </span>
                      <span className="text-gray-600">
                        <strong>{twitterResult.profile.following_count.toLocaleString()}</strong> Following
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => window.open(`https://twitter.com/${twitterResult.profile?.username}`, '_blank')}>
                      <ExternalLink className="h-3 w-3" />
                      View Profile
                    </Button>
                  </div>
                </div>
                {twitterResult.profile.description && (
                  <p className="mt-3 text-gray-700">{twitterResult.profile.description}</p>
                )}
              </div>
            )}
            
            {/* Filters and controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <div className="flex rounded-md overflow-hidden border">
                  <button 
                    className={`px-3 py-1 text-sm ${twitterFilter === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'bg-white text-gray-600'}`}
                    onClick={() => setTwitterFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm border-l ${twitterFilter === 'tweets' ? 'bg-blue-50 text-blue-700 font-medium' : 'bg-white text-gray-600'}`}
                    onClick={() => setTwitterFilter('tweets')}
                  >
                    Tweets ({twitterResult.tweets.length})
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm border-l ${twitterFilter === 'threads' ? 'bg-blue-50 text-blue-700 font-medium' : 'bg-white text-gray-600'}`}
                    onClick={() => setTwitterFilter('threads')}
                  >
                    Threads ({twitterResult.threads.length})
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const { tweets, threads } = getFilteredTwitterContent();
                    const allTweetIds = tweets.map(t => t.id);
                    const allThreadIds = threads.map(t => t.id);
                    
                    setSelectedTweets(new Set(allTweetIds));
                    setSelectedThreads(new Set(allThreadIds));
                  }}
                  disabled={isLoading}
                >
                  Select All
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedTweets(new Set());
                    setSelectedThreads(new Set());
                  }}
                  disabled={isLoading || (selectedTweets.size === 0 && selectedThreads.size === 0)}
                >
                  Clear
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveSelectedTweets}
                  disabled={isLoading || (selectedTweets.size === 0 && selectedThreads.size === 0)}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3" />
                      Save Selected
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Display filtered content */}
            <div className="space-y-4">
              {getFilteredTwitterContent().threads.map(thread => renderThreadCard(thread))}
              {getFilteredTwitterContent().tweets.map(tweet => renderTweetCard(tweet))}
              
              {getFilteredTwitterContent().threads.length === 0 && 
               getFilteredTwitterContent().tweets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No {twitterFilter === 'all' ? 'content' : twitterFilter} found
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Results section for other platforms */}
        {activeTab !== 'twitter' && result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Extracted content */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Content</CardTitle>
                  <CardDescription>
                    Content extracted from {activeTab === 'linkedin' 
                      ? 'LinkedIn' 
                      : activeTab === 'website' 
                        ? 'website' 
                        : 'YouTube video'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4 bg-white dark:bg-gray-900">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {result.content}
                    </p>
                  </div>
                  
                  <Accordion type="single" collapsible className="mb-4">
                    <AccordionItem value="key-points">
                      <AccordionTrigger className="text-base font-medium">
                        Key Points
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          {result.keyPoints.map((point, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Detected Tone
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        {result.tone}
                      </div>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Details
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span>Word count:</span>
                          <span>{result.wordCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Read time:</span>
                          <span>{result.estimatedReadTime} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => handleCopy(result.content)}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Content
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleSaveToInspiration}
                  >
                    <Save className="h-4 w-4" />
                    Save to Vault
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right column - AI suggestions */}
            <div>
              {/* Suggested Hook */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Suggested Hook
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    {result.suggestedHook}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-1"
                    onClick={() => handleCopy(result.suggestedHook)}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Hook
                  </Button>
                </CardContent>
              </Card>
              
              {/* Actions */}
              <Card className="bg-primary-50 dark:bg-primary-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Generate LinkedIn Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Use the extracted content to create an engaging LinkedIn post with AI assistance.
                  </p>
                  
                  <Button 
                    className="w-full gap-2 mb-3"
                    onClick={handleCreatePost}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Post
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => navigate('/dashboard/ai')}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Expand with AI Writer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Instructions when no result */}
        {!result && !isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
                  {activeTab === 'linkedin' ? (
                    <Linkedin className="h-8 w-8 text-primary" />
                  ) : activeTab === 'website' ? (
                    <Globe className="h-8 w-8 text-primary" />
                  ) : activeTab === 'twitter' ? (
                    <Twitter className="h-8 w-8 text-primary" />
                  ) : (
                    <Youtube className="h-8 w-8 text-primary" />
                  )}
                </div>
                
                <h3 className="text-lg font-medium mb-2">
                  {activeTab === 'linkedin' 
                    ? 'Extract Content from LinkedIn' 
                    : activeTab === 'website'
                      ? 'Extract Content from Websites'
                      : activeTab === 'twitter'
                        ? 'Extract Content from Twitter'
                        : 'Extract Content from YouTube Videos'
                  }
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {activeTab === 'linkedin' 
                    ? 'Paste a LinkedIn profile URL or post link to extract professional insights, experience, and content for your posts.' 
                    : activeTab === 'website'
                      ? 'Paste any article or blog URL to extract key points, analyze tone, and suggest hooks for your LinkedIn content.'
                      : activeTab === 'twitter'
                        ? 'Paste a Twitter username or profile URL to extract tweets and insights for your LinkedIn content.'
                        : 'Paste a YouTube video URL to extract transcripts, key points, and insights to share on LinkedIn.'
                  }
                </p>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                    <span>Enter the URL in the input field above</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <span>Click "Scrape" to extract content</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <span>Review and use the extracted content for your LinkedIn posts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </Tabs>
    </div>
  );
};

export default ScraperPage; 