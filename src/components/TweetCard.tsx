import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Tweet, Thread, MediaItem } from '@/utils/twitterTypes';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Heart, 
  RefreshCw, 
  Share, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare,
  Copy,
  Eye,
  Image as ImageIcon,
  Play,
  FileText,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import MediaDisplay from './MediaDisplay';

// Media Display Component
interface MediaDisplayProps {
  media: MediaItem[];
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ media }) => {
  if (!media || media.length === 0) return null;

  // For multiple images, use a grid layout
  if (media.length > 1) {
    return (
      <div className={`grid gap-2 mt-4 rounded-xl overflow-hidden ${
        media.length === 2 ? 'grid-cols-2' : 
        media.length === 3 ? 'grid-cols-2' : 
        'grid-cols-2'
      }`}>
        {media.map((item, index) => (
          <div 
            key={item.media_key || index} 
            className={`${
              media.length === 3 && index === 0 ? 'row-span-2' : 
              media.length === 4 && index < 2 ? 'col-span-1' : 
              ''
            } overflow-hidden relative`}
          >
            <SingleMedia media={item} />
          </div>
        ))}
      </div>
    );
  }

  // For a single media item
  return (
    <div className="mt-4 rounded-xl overflow-hidden relative">
      <SingleMedia media={media[0]} />
    </div>
  );
};

// Single Media Component
interface SingleMediaProps {
  media: MediaItem;
}

const SingleMedia: React.FC<SingleMediaProps> = ({ media }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  
  useEffect(() => {
    // Check if the image is already cached
    if (media.type === 'photo' && mediaRef.current) {
      const img = mediaRef.current as HTMLImageElement;
      if (img.complete) {
        setLoaded(true);
      }
    }
  }, [media.type]);

  const handleLoad = () => {
    setLoaded(true);
  };
  
  const handleError = () => {
    setError(true);
    console.error(`Failed to load media: ${media.url}`);
  };

  if (media.type === 'video' || media.type === 'animated_gif') {
    return (
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <Play className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={media.url}
          poster={media.preview_image_url}
          controls={media.type === 'video'}
          autoPlay={media.type === 'animated_gif'}
          loop={media.type === 'animated_gif'}
          muted={media.type === 'animated_gif'}
          playsInline
          className="w-full h-full object-cover"
          onLoadedData={handleLoad}
          onError={handleError}
        />
        
        {error && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <FileText className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-500 ml-2">Video unavailable</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
      <img
        ref={mediaRef as React.RefObject<HTMLImageElement>}
        src={media.url}
        alt={media.alt_text || "Tweet media"}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-500 ml-2">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

// Main Tweet Card Props
interface TweetCardProps {
  content: Tweet | Thread;
  isSelected: boolean;
  onSelectToggle: (item: Tweet | Thread) => void;
  selectedTweets?: Set<string>;
  onSelectTweet?: (tweet: Tweet) => void;
}

const TweetCard: React.FC<TweetCardProps> = ({ 
  content, 
  isSelected, 
  onSelectToggle, 
  selectedTweets = new Set(),
  onSelectTweet = () => {}
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [fullTweet, setFullTweet] = useState<Tweet | null>(null);
  const [isLoadingFullTweet, setIsLoadingFullTweet] = useState(false);

  // Check if content is a thread or individual tweet
  const isThread = 'tweets' in content;
  const tweet = isThread ? content.tweets[0] : content;
  const thread = isThread ? content : null;

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch (error) {
      return dateStr;
    }
  };

  const formatMetric = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const handleCopyTweet = (tweetToCopy: Tweet) => {
    const text = tweetToCopy.full_text || tweetToCopy.text || '';
    navigator.clipboard.writeText(text);
    toast.success('Tweet text copied to clipboard');
  };

  const handleCopyThread = () => {
    if (thread) {
      const threadText = thread.tweets
        .map((t, index) => `${index + 1}/${thread.tweets.length} ${t.full_text || t.text}`)
        .join('\n\n');
      navigator.clipboard.writeText(threadText);
      toast.success('Thread copied to clipboard');
    }
  };

  const getTweetText = (tweetItem: Tweet) => {
    const text = tweetItem.full_text || tweetItem.text || '';
    // Remove trailing URLs and ellipses for cleaner display
    return text
      .replace(/\s*https:\/\/t\.co\/\w+$/g, '')
      .replace(/(\s*[…\.]{3,})$/g, '');
  };

  const shouldShowMore = (text: string) => {
    return text.length > 280;
  };

  // Preload logic for long tweets - using staggered loading with backoff
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
  }, [tweet, isLoadingFullTweet]);

  // Handle click on "Show more" button
  const handleShowMoreClick = async () => {
    // If we already have the full tweet, just toggle expanded state
    if (fullTweet) {
      setShowFullContent(!showFullContent);
      return;
    }
    
    // For saved tweets, we don't need to fetch additional content
    if (tweet.savedAt) {
      setShowFullContent(true);
      return;
    }
    
    // If we have full_text available, use it
    if (tweet.full_text && tweet.full_text.length > tweet.text.length + 5) {
      setFullTweet({
        ...tweet,
        full_text: tweet.full_text
      });
      setShowFullContent(true);
      return;
    }

    // If no additional content is available, just show what we have
    setShowFullContent(true);
  };

  if (isThread && thread) {
    // Thread Card Layout
    const allSelected = thread.tweets.every(t => selectedTweets.has(t.id));
    const someSelected = thread.tweets.some(t => selectedTweets.has(t.id));

    return (
      <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
        <CardContent className="p-6">
          {/* Thread Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={tweet.author?.profile_image_url} 
                  alt={tweet.author?.name}
                />
                <AvatarFallback>
                  {tweet.author?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900">{tweet.author?.name}</div>
                <div className="text-sm text-gray-500">@{tweet.author?.username}</div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Thread • {thread.tweets.length} tweets
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectToggle(thread)}
                className={someSelected ? 'text-blue-600' : 'text-gray-500'}
              >
                <CheckSquare className="h-4 w-4 mr-1" />
                {allSelected ? 'Deselect' : 'Select All'}
              </Button>
              <Checkbox 
                checked={isSelected}
                onCheckedChange={() => onSelectToggle(thread)}
                className="h-5 w-5"
              />
            </div>
          </div>

          {/* Thread Content */}
          <div className="space-y-4">
            {/* Show first tweet prominently */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  1/{thread.tweets.length}
                </span>
                <Checkbox 
                  checked={selectedTweets.has(tweet.id)}
                  onCheckedChange={() => onSelectTweet(tweet)}
                  className="h-4 w-4"
                />
              </div>
              <p className="text-gray-900 mb-3 whitespace-pre-wrap">
                {getTweetText(tweet)}
              </p>
              {tweet.media && tweet.media.length > 0 && (
                <MediaDisplay media={tweet.media} />
              )}
            </div>

            {/* Thread continuation indicator */}
            {thread.tweets.length > 1 && (
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show {thread.tweets.length - 1} more tweets
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Expanded thread tweets */}
            {expanded && thread.tweets.slice(1).map((threadTweet, index) => (
              <div key={threadTweet.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {index + 2}/{thread.tweets.length}
                  </span>
                  <Checkbox 
                    checked={selectedTweets.has(threadTweet.id)}
                    onCheckedChange={() => onSelectTweet(threadTweet)}
                    className="h-4 w-4"
                  />
                </div>
                <p className="text-gray-900 mb-3 whitespace-pre-wrap">
                  {getTweetText(threadTweet)}
                </p>
                {threadTweet.media && threadTweet.media.length > 0 && (
                  <MediaDisplay media={threadTweet.media} />
                )}
              </div>
            ))}
          </div>

          {/* Thread Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {formatMetric(thread.tweets.reduce((sum, t) => sum + (t.public_metrics.reply_count || 0), 0))}
              </span>
              <span className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-1" />
                {formatMetric(thread.tweets.reduce((sum, t) => sum + (t.public_metrics.retweet_count || 0), 0))}
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {formatMetric(thread.tweets.reduce((sum, t) => sum + (t.public_metrics.like_count || 0), 0))}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{formatDate(tweet.created_at)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyThread}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Individual Tweet Card Layout
  const tweetText = getTweetText(tweet);
  const needsExpansion = shouldShowMore(tweetText);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
      <CardContent className="p-6">
        {/* Tweet Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={tweet.author?.profile_image_url} 
                alt={tweet.author?.name}
              />
              <AvatarFallback>
                {tweet.author?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900">{tweet.author?.name}</div>
              <div className="text-sm text-gray-500">@{tweet.author?.username}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">{formatDate(tweet.created_at)}</span>
            <Checkbox 
              checked={isSelected}
              onCheckedChange={() => onSelectToggle(tweet)}
              className="h-5 w-5"
            />
          </div>
        </div>

        {/* Tweet Content */}
        <div className="mb-4">
          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {needsExpansion && !showFullContent 
              ? tweetText.substring(0, 280) + '...'
              : tweetText
            }
          </p>
          
          {needsExpansion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowMoreClick}
              className="mt-2 text-blue-600 hover:text-blue-700 p-0 h-auto"
            >
              {showFullContent ? (
                <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
              ) : (
                <>Show more <ChevronDown className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          )}
        </div>

        {/* Media */}
        {tweet.media && tweet.media.length > 0 && (
          <div className="mb-4">
            <MediaDisplay media={tweet.media} />
          </div>
        )}

        {/* Tweet Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {formatMetric(tweet.public_metrics.reply_count || 0)}
            </span>
            <span className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-1" />
              {formatMetric(tweet.public_metrics.retweet_count || 0)}
            </span>
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {formatMetric(tweet.public_metrics.like_count || 0)}
            </span>
            <span className="flex items-center">
              <Share className="h-4 w-4 mr-1" />
              {formatMetric(tweet.public_metrics.quote_count || 0)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopyTweet(tweet)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetCard; 