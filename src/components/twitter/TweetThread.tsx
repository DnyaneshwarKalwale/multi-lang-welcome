import React, { useState, useEffect } from 'react';
import { Tweet, Thread } from '@/utils/twitterTypes';
import { Checkbox } from '@/components/ui/checkbox';
import MediaDisplay from './MediaDisplay';
import { MessageSquare, Heart, RefreshCw, Share, ChevronDown, ChevronUp, CheckSquare, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TweetThreadProps {
  thread: Thread;
  selectedTweets: Set<string>;
  onSelectToggle: (tweet: Tweet) => void;
  onSelectThread: (thread: Thread, select: boolean) => void;
}

const TweetThread: React.FC<TweetThreadProps> = ({ 
  thread, 
  selectedTweets = new Set(), 
  onSelectToggle = () => {}, 
  onSelectThread = () => {}
}) => {
  const [expanded, setExpanded] = useState(true);
  const [visibleTweets, setVisibleTweets] = useState<Tweet[]>(thread.tweets);
  const [expandedTweets, setExpandedTweets] = useState<Set<string>>(new Set());
  const [loadingTweets, setLoadingTweets] = useState<Set<string>>(new Set());
  const [fullTweets, setFullTweets] = useState<Map<string, Tweet>>(new Map());
  
  // Ensure thread has tweets array
  if (!thread || !thread.tweets || thread.tweets.length === 0) {
    console.error("Thread is empty or missing tweets array");
    return null;
  }
  
  // Log thread info for debugging
  // ... existing code ...
  
  // Preload full content for long tweets when component mounts
  useEffect(() => {
    // Skip preloading for saved tweets
    if (thread.tweets.some(tweet => tweet.savedAt)) {
      return; // Exit early if any tweet in thread is saved
    }
    
    thread.tweets.forEach(tweet => {
      // If the tweet already has full_text that's significantly longer than the display text, use it
      if (tweet.full_text && tweet.full_text.length > tweet.text.length + 20) {
        setFullTweets(prev => new Map(prev).set(tweet.id, tweet));
            
        // Automatically expand preloaded tweets in threads for better readability
        if (!expandedTweets.has(tweet.id)) {
          setExpandedTweets(prev => new Set(prev).add(tweet.id));
        }
      }
    });
  }, [thread.tweets]);
  
  // Always show all tweets in a thread
  const hasMoreTweets = false; // No need to expand further

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInHours * 60);
        return `${diffInMinutes}m`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d`;
      }
    } catch (error) {
      return dateStr;
    }
  };

  // Check if all tweets in the thread are selected
  const allTweetsSelected = thread.tweets.every(tweet => selectedTweets.has(tweet.id));
  const someTweetsSelected = thread.tweets.some(tweet => selectedTweets.has(tweet.id));

  const handleSelectThread = () => {
    onSelectThread(thread, !allTweetsSelected);
  };
  
  // Get the first tweet's author info for display
  const firstTweet = thread.tweets[0];
  const authorInfo = thread.author || firstTweet.author;

  // Helper function to detect if text is likely truncated
  const detectTruncatedText = (text: string): boolean => {
    if (!text) return false;
    
    // Obvious truncation indicators
    if (text.endsWith('…') || text.endsWith('...')) return true;
    if (text.includes('… https://') || text.includes('... https://')) return true;
    
    // Check for non-Latin scripts (like Hindi, Arabic, Chinese, etc.)
    const hasNonLatinScript = /[\u0900-\u097F\u0600-\u06FF\u0590-\u05FF\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/.test(text);
    
    // For non-Latin scripts, use a lower threshold as they can express more in fewer characters
    const thresholdLength = hasNonLatinScript ? 180 : 240;
    
    // If the text is close to Twitter's limit, it might be truncated
    if (text.length >= thresholdLength) return true;
    
    return false;
  };

  // Check if a tweet text is truncated
  const isTruncated = (tweet: Tweet) => {
    const text = tweet.full_text || tweet.text || '';
    // Use our helper function for better detection across all languages
    return detectTruncatedText(text) || tweet.is_long === true;
  };
  
  // Handle showing more/less content for a specific tweet
  const handleShowMoreClick = async (tweetId: string) => {
    const tweet = thread.tweets.find(t => t.id === tweetId);
    if (!tweet) {
      console.error(`Tweet with ID ${tweetId} not found in thread`);
      return;
    }
    
    // Toggle expanded state for this tweet
    const newExpandedTweets = new Set(expandedTweets);
    
    if (expandedTweets.has(tweetId)) {
      // Collapse the tweet
      newExpandedTweets.delete(tweetId);
      setExpandedTweets(newExpandedTweets);
      return;
    } 
    
    // Expand the tweet - mark as expanded right away for UI responsiveness
    newExpandedTweets.add(tweetId);
    setExpandedTweets(newExpandedTweets);
    
    // Check if we already have full content to display
    const existingFullTweet = fullTweets.get(tweetId);
    const currentText = tweet.full_text || tweet.text || '';
    
    // If we already have a full version with significantly more content, use it
    if (existingFullTweet && existingFullTweet.full_text && existingFullTweet.full_text.length > currentText.length + 20) {
      console.log(`Using existing full tweet content for ${tweetId}`);
      return;
    }
    
    // If the tweet already has full_text that's longer than display text, use it
    if (tweet.full_text && tweet.full_text.length > (tweet.text?.length || 0) + 10) {
      console.log(`Using tweet's full_text property for ${tweetId}`);
      setFullTweets(prev => new Map(prev).set(tweetId, {
        ...tweet,
        full_text: tweet.full_text
      }));
        return;
    }
    
    // For saved tweets, show whatever content we have without trying to fetch more
    if (tweet.savedAt) {
      console.log(`Showing saved tweet content for ${tweetId}`);
      // Just show what we have - the expansion state change will update the display
      return;
    }
    
    console.log(`Tweet ${tweetId} expanded - showing available content`);
    // The tweet is now marked as expanded, so getDisplayText will show full available content
  };
  
  // Get the displayed text for a tweet
  const getDisplayText = (tweet: Tweet) => {
    // Check if we have a full version of this tweet
    const fullVersion = fullTweets.get(tweet.id);
    
    // Determine the best text to use
    let textToUse = '';
    
    // Priority order for getting the best text content
    if (fullVersion?.full_text) {
      // First choice: Use the full text from fetched details if available
      textToUse = fullVersion.full_text;
    } else if (tweet.full_text) {
      // Second choice: Use the full_text property if available
      textToUse = tweet.full_text;
    } else {
      // Last resort: Use the regular text
      textToUse = tweet.text;
    }
    
    // Clean up the text - but preserve important URLs
    let fullText = textToUse;
    
    // Only remove t.co URLs that are at the end and are NOT short domain URLs
    // Short domain URLs like bit.ly are important content and should be preserved
    fullText = fullText.replace(/\s*(https:\/\/t\.co\/\w{10,})\s*$/g, '');
    
    // Keep short URLs which are likely bit.ly, tinyurl, etc.
    // Don't remove trailing ellipsis if there's a short URL
    if (!/https?:\/\/(?:bit\.ly|tinyurl|goo\.gl|t\.co)\/\w+/.test(fullText)) {
      // Only then remove trailing ellipsis markers
      fullText = fullText.replace(/(\s*[…\.]{3,})$/g, '');
    }
    
    // If tweet is expanded, show full text
    if (expandedTweets.has(tweet.id)) {
      return fullText;
    }
    
    // If tweet is truncated and not expanded, show truncated version
    if (isTruncated(tweet) || fullText.length > 240) {
      // Create a cleaner truncation that doesn't cut words or URLs
      const truncatedLength = Math.min(220, fullText.length / 2);
      let truncatedText = fullText.substring(0, truncatedLength);
      
      // Check if we're cutting in the middle of a URL
      const urlRegex = /https?:\/\/[^\s]+/g;
      const urls = fullText.match(urlRegex) || [];
      
      // If there are URLs, make sure we don't cut them
      for (const url of urls) {
        const urlIndex = fullText.indexOf(url);
        // If URL would be cut in the middle, include the full URL or exclude it entirely
        if (urlIndex < truncatedLength && urlIndex + url.length > truncatedLength) {
          if (urlIndex + url.length < truncatedLength + 30) {
            // If including the full URL doesn't add too much length, include it
            truncatedText = fullText.substring(0, urlIndex + url.length);
          } else {
            // Otherwise cut before the URL
            truncatedText = fullText.substring(0, urlIndex);
          }
        }
      }
      
      // Try to end at a word boundary
      const lastSpaceIndex = truncatedText.lastIndexOf(' ');
      if (lastSpaceIndex > truncatedLength * 0.8) { // Only adjust if we're not cutting off too much
        truncatedText = truncatedText.substring(0, lastSpaceIndex);
      }
      
      return truncatedText + '...';
    }
    
    // Otherwise show regular text
    return fullText;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Thread Header - Compact */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
            <AvatarImage 
              src={authorInfo?.profile_image_url} 
              alt={authorInfo?.name || 'Thread author'} 
              className="object-cover"
            />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs font-medium">
              {authorInfo?.name?.charAt(0) || 'T'}
            </AvatarFallback>
          </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 text-sm">
                <h3 className="font-bold text-gray-900 truncate">
                  {authorInfo?.name || 'Thread Author'}
                </h3>
                <span className="text-gray-500">@{authorInfo?.username || 'user'}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">{formatDate(firstTweet.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  <span className="font-semibold">{thread.tweets.length}</span>
                  <span>tweets</span>
                </div>
            </div>
          </div>
        </div>
        
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={allTweetsSelected}
              onCheckedChange={() => handleSelectThread()}
              className="h-4 w-4"
            />
          <button 
            onClick={handleSelectThread}
              className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
          >
              <CheckSquare className="h-3 w-3" />
          </button>
          </div>
        </div>
      </div>
      
      {/* Thread Tweets - Compact Layout */}
      <div className="relative">
        {visibleTweets.map((tweet, index) => (
          <div key={tweet.id} className="relative">
            {/* Connecting line */}
            {index < visibleTweets.length - 1 && (
              <div className="absolute left-7 top-12 w-0.5 h-[calc(100%-48px)] bg-gray-300 z-0"></div>
            )}
            
            {/* Tweet Content */}
            <div className="relative z-10 px-4 py-3 hover:bg-gray-50/30 transition-colors">
              <div className="flex space-x-3">
                {/* Compact Avatar with Badge */}
                <div className="flex-shrink-0 relative">
                  <Avatar className="h-8 w-8 ring-1 ring-white relative z-10">
                    <AvatarImage 
                      src={tweet.author?.profile_image_url} 
                      alt={tweet.author?.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-xs font-medium">
                      {tweet.author?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Compact thread number */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center z-20 border border-white">
              {index + 1}
                  </div>
                </div>
                
                {/* Tweet Content - Compact */}
                <div className="flex-1 min-w-0">
                  {/* Compact Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1 min-w-0 text-sm">
                      <span className="font-semibold text-gray-900 truncate">
                        {tweet.author?.name}
                      </span>
                      <span className="text-gray-500 text-xs">@{tweet.author?.username}</span>
                      <span className="text-gray-400 text-xs">·</span>
                      <span className="text-gray-500 text-xs">{formatDate(tweet.created_at)}</span>
            </div>
            
                    <div className="flex items-center space-x-1 flex-shrink-0">
              <Checkbox 
                checked={selectedTweets.has(tweet.id)}
                onCheckedChange={() => onSelectToggle(tweet)}
                        className="h-3 w-3"
              />
                    </div>
            </div>
            
                  {/* Tweet Text - Compact */}
                  <div className="mb-2">
                    <div className="text-gray-900 text-sm leading-5 whitespace-pre-wrap break-words">
              {loadingTweets.has(tweet.id) ? (
                        <div className="flex items-center text-gray-500 text-xs">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
                          Loading...
                        </div>
              ) : (
                <>
                  {getDisplayText(tweet)}
                  
                          {/* Compact Show more button */}
                  {(isTruncated(tweet) || (tweet.full_text || tweet.text || '').length > 240 || fullTweets.has(tweet.id)) && (
                    <button 
                      onClick={() => handleShowMoreClick(tweet.id)}
                              className="mt-1 text-blue-500 hover:text-blue-600 text-xs font-normal inline-flex items-center space-x-1 transition-colors"
                      disabled={loadingTweets.has(tweet.id)}
                    >
                      {loadingTweets.has(tweet.id) ? (
                                <>
                                  <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-blue-500"></div>
                                  <span>Loading...</span>
                                </>
                      ) : (
                                <>
                                  <span>{expandedTweets.has(tweet.id) ? 'Show less' : 'Show more'}</span>
                                  {expandedTweets.has(tweet.id) ? (
                                    <ChevronUp className="h-3 w-3" />
                        ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                </>
                      )}
                    </button>
                  )}
                </>
              )}
                    </div>
            </div>
            
                  {/* Media - Compact */}
            {tweet.media && tweet.media.length > 0 && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-gray-200">
                <MediaDisplay media={tweet.media} />
              </div>
            )}
            
                  {/* Compact Actions */}
                  <div className="flex items-center justify-between max-w-xs">
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 px-2 py-1 rounded-full transition-colors group text-xs">
                      <MessageSquare className="h-3 w-3 group-hover:text-blue-500" />
                      <span className="group-hover:text-blue-500">{tweet.reply_count || 0}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-green-500 hover:bg-green-50 px-2 py-1 rounded-full transition-colors group text-xs">
                      <RefreshCw className="h-3 w-3 group-hover:text-green-500" />
                      <span className="group-hover:text-green-500">{tweet.retweet_count || 0}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-full transition-colors group text-xs">
                      <Heart className="h-3 w-3 group-hover:text-red-500" />
                      <span className="group-hover:text-red-500">{tweet.favorite_count || 0}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 px-2 py-1 rounded-full transition-colors group text-xs">
                      <Share className="h-3 w-3 group-hover:text-blue-500" />
                      <span className="group-hover:text-blue-500">{tweet.quote_count || 0}</span>
                    </button>
              </div>
              </div>
              </div>
            </div>
            
            {/* No divider needed - connecting line handles visual separation */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TweetThread; 