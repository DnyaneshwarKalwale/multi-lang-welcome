import React, { useState, useEffect, useMemo } from 'react';
import { Tweet } from '@/utils/twitterTypes';
import { MessageSquare, Heart, RefreshCw, Share, ChevronDown, ChevronUp, Loader2, MoreHorizontal } from 'lucide-react';
import MediaDisplay from './MediaDisplay';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface TweetCardProps {
  tweet: Tweet;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
  const [isLoadingFullTweet, setIsLoadingFullTweet] = useState(false);
  const [fullTweet, setFullTweet] = useState<Tweet | null>(null);
  const [showMore, setShowMore] = useState(false);

  // Preload logic for long tweets - simplified without API calls
  useEffect(() => {
    // Skip if we're still loading or if we already have content
    if (isLoadingFullTweet || fullTweet) {
      return;
    }

    // Skip automatic preloading for saved tweets (they already have full content)
    if (tweet.savedAt) {
      return;
    }

    // If the tweet already has full_text that's significantly longer than the display text, use it
    if (tweet.full_text && tweet.full_text.length > tweet.text.length + 20) {
      setFullTweet({
        ...tweet,
        full_text: tweet.full_text
      });
      return;
    }

    // No need for API calls - just use existing data
  }, [tweet, isLoadingFullTweet, fullTweet]);

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
  const isTruncated = useMemo(() => {
    const text = fullTweet?.full_text || tweet.full_text || tweet.text || '';
    return detectTruncatedText(text) || tweet.is_long === true;
  }, [tweet, fullTweet]);
  
  // Handle showing more/less content
  const handleShowMoreClick = async () => {
    // Toggle expanded state
    if (showMore) {
      setShowMore(false);
      return;
    }

    setShowMore(true);
    
    // Check if we already have full content to display
    const currentText = tweet.full_text || tweet.text || '';
    
    // If the tweet already has full_text that's longer than display text, use it
    if (tweet.full_text && tweet.full_text.length > (tweet.text?.length || 0) + 10) {
      console.log(`Using tweet's full_text property for ${tweet.id}`);
      setFullTweet({
        ...tweet,
        full_text: tweet.full_text
      });
      return;
    }
    
    // For saved tweets, show whatever content we have
    if (tweet.savedAt) {
      console.log(`Showing saved tweet content for ${tweet.id}`);
      return;
    }
    
    // Just show the available content
    console.log(`Tweet ${tweet.id} expanded - showing available content`);
  };

  // Get the displayed text for a tweet
  const getDisplayText = (tweet: Tweet) => {
    // Check if we have a full version of this tweet
    const fullVersion = fullTweet;
    
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
    if (showMore) {
      return fullText;
    }
    
    // If tweet is truncated and not expanded, show truncated version
    if (isTruncated || fullText.length > 240) {
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden w-full">
      <div className="px-3 py-3 h-full flex flex-col">
        <div className="flex space-x-3 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={tweet.author?.profile_image_url} 
                alt={tweet.author?.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
                {tweet.author?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Tweet Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Tweet Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1 min-w-0 text-sm">
                <span className="font-bold text-gray-900 truncate">
                  {tweet.author?.name}
                </span>
                <span className="text-gray-500 text-xs">@{tweet.author?.username}</span>
                <span className="text-gray-400 text-xs">·</span>
                <span className="text-gray-500 text-xs">{formatDate(tweet.created_at)}</span>
                {tweet.savedAt && (
                  <>
                    <span className="text-gray-400 text-xs">·</span>
                    <span className="text-green-600 text-xs bg-green-50 px-1.5 py-0.5 rounded-full font-medium">
                      Saved
                    </span>
                  </>
                )}
              </div>
              

      </div>
      
            {/* Tweet Text */}
            <div className="mb-3 flex-1">
              <div className="text-gray-900 text-sm leading-5 whitespace-pre-wrap break-words">
        {isLoadingFullTweet ? (
                  <div className="flex items-center text-gray-500 text-xs">
                    <Loader2 className="animate-spin h-3 w-3 mr-2" />
                    Loading...
          </div>
        ) : (
          <>
                    {getDisplayText(tweet)}
              
                    {/* Show more/less button */}
                    {(isTruncated || tweet.text.length > 240) && (
                <button
                  onClick={handleShowMoreClick}
                        className="mt-2 text-blue-500 hover:text-blue-600 text-xs font-normal inline-flex items-center space-x-1 transition-colors"
                  disabled={isLoadingFullTweet}
                >
                  {isLoadingFullTweet ? (
                          <>
                            <Loader2 className="animate-spin h-3 w-3" />
                            <span>Loading...</span>
                          </>
                  ) : (
                    <>
                            <span>{showMore ? 'Show less' : 'Show more'}</span>
                            {showMore ? (
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
      
            {/* Media */}
      {tweet.media && tweet.media.length > 0 && (
              <div className="mb-3 rounded-xl overflow-hidden border border-gray-200">
          <MediaDisplay media={tweet.media} />
        </div>
      )}
      
            {/* Tweet Actions */}
            <div className="flex items-center justify-between max-w-xs mt-auto">
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
    </div>
  );
};

export default TweetCard; 