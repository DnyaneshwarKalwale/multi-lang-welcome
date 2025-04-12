import React, { useState } from 'react';
import { Thread } from '@/utils/types';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, MessageSquare, Repeat, Heart, BarChart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TweetThreadProps {
  thread: Thread;
  isSelected?: boolean;
  onSelect?: (thread: Thread, selected: boolean) => void;
}

export const TweetThread: React.FC<TweetThreadProps> = ({
  thread,
  isSelected = false,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(thread, !isSelected);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Get first and last tweet of thread
  const firstTweet = thread.tweets[0];
  const lastTweet = thread.tweets[thread.tweets.length - 1];
  
  // Format metrics
  const totalLikes = thread.tweets.reduce((sum, tweet) => sum + tweet.public_metrics.like_count, 0);
  const totalRetweets = thread.tweets.reduce((sum, tweet) => sum + tweet.public_metrics.retweet_count, 0);
  const totalReplies = thread.tweets.reduce((sum, tweet) => sum + tweet.public_metrics.reply_count, 0);
  
  const formatCount = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };
  
  // Format date
  const formattedDate = formatDistanceToNow(new Date(thread.created_at), { addSuffix: true });
  
  // Get thread stats
  const tweetCount = thread.tweets.length;
  
  // Find first tweet with media
  const firstMediaTweet = thread.tweets.find(tweet => tweet.media && tweet.media.length > 0);
  const featuredMedia = firstMediaTweet?.media?.[0];

  return (
    <div 
      className={cn(
        "border rounded-xl bg-white overflow-hidden hover:bg-gray-50 transition-colors",
        isSelected && "ring-2 ring-primary",
        onSelect && "cursor-pointer"
      )}
      onClick={onSelect ? handleSelect : undefined}
    >
      <div className="p-4">
        <div className="flex gap-3">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img 
              src={thread.author.profile_image_url || "https://via.placeholder.com/48"} 
              alt={thread.author.name} 
              className="w-12 h-12 rounded-full object-cover border"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900 truncate">{thread.author.name}</span>
                  {isSelected && (
                    <span className="text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-sm">@{thread.author.username}</div>
              </div>
              <div className="text-gray-500 text-sm whitespace-nowrap ml-2">{formattedDate}</div>
            </div>
            
            {/* Thread Badge */}
            <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium inline-flex items-center mb-2">
              <svg className="h-3 w-3 mr-1" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
              </svg>
              Thread • {tweetCount} {tweetCount === 1 ? 'tweet' : 'tweets'}
            </div>
            
            {/* First Tweet Text */}
            <div className="mb-3 text-gray-800 line-clamp-3">{firstTweet.text}</div>
            
            {/* Preview Image */}
            {featuredMedia && (
              <div className="mb-3 overflow-hidden rounded-xl aspect-video max-h-48">
                {featuredMedia.type === 'photo' ? (
                  <img 
                    src={featuredMedia.url} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative h-full w-full bg-black">
                    <img 
                      src={featuredMedia.preview_image_url || featuredMedia.url} 
                      alt="" 
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5V19L19 12L8 5Z" fill="white" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Show More/Less */}
            <button 
              className="flex items-center justify-center mt-1 mb-2 text-sm text-primary hover:text-primary/80 w-full py-1.5 border border-gray-200 rounded-lg"
              onClick={handleToggle}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show thread
                </>
              )}
            </button>
            
            {/* Metrics */}
            <div className="flex items-center justify-between pt-1 text-gray-500">
              <div className="flex items-center space-x-1 text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>{formatCount(totalReplies)}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Repeat className="h-4 w-4" />
                <span>{formatCount(totalRetweets)}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Heart className="h-4 w-4" />
                <span>{formatCount(totalLikes)}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <BarChart className="h-4 w-4" />
                <span>{tweetCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded Thread */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="border-l-2 border-gray-300 ml-6 pl-8 space-y-6">
            {thread.tweets.slice(1).map((tweet, index) => (
              <div key={tweet.id} className="relative pt-2">
                {/* Thread connector dot */}
                <div className="absolute -left-[10px] top-0 w-4 h-4 rounded-full bg-gray-300" />
                
                {/* Tweet content */}
                <div className="text-gray-800 whitespace-pre-line">{tweet.text}</div>
                
                {/* Tweet media */}
                {tweet.media && tweet.media.length > 0 && (
                  <div className="mt-2 overflow-hidden rounded-lg">
                    {tweet.media[0].type === 'photo' ? (
                      <img 
                        src={tweet.media[0].url} 
                        alt="" 
                        className="w-full max-h-64 object-cover"
                      />
                    ) : (
                      <div className="relative aspect-video bg-black">
                        <img 
                          src={tweet.media[0].preview_image_url || tweet.media[0].url} 
                          alt="" 
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 5V19L19 12L8 5Z" fill="white" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tweet date */}
                <div className="mt-1.5 text-xs text-gray-500">
                  {formatDistanceToNow(new Date(tweet.created_at), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TweetThread; 