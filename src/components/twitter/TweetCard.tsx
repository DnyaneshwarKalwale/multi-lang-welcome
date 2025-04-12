import React from 'react';
import { Tweet } from '@/utils/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Repeat, Heart, BarChart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TweetCardProps {
  tweet: Tweet;
  isSelected?: boolean;
  onSelect?: (tweet: Tweet) => void;
  showActions?: boolean;
}

export const TweetCard: React.FC<TweetCardProps> = ({
  tweet,
  isSelected = false,
  onSelect,
  showActions = true,
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(tweet);
    }
  };

  const formattedDate = formatDistanceToNow(new Date(tweet.created_at), { addSuffix: true });
  
  const formatCount = (count: number): string => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  return (
    <div 
      className={cn(
        "border rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors",
        isSelected && "ring-2 ring-primary",
        onSelect && "cursor-pointer"
      )}
      onClick={onSelect ? handleSelect : undefined}
    >
      <div className="flex gap-3">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img 
            src={tweet.author.profile_image_url || "https://via.placeholder.com/48"} 
            alt={tweet.author.name} 
            className="w-12 h-12 rounded-full object-cover border"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-bold text-gray-900 truncate">{tweet.author.name}</span>
                {isSelected && (
                  <span className="text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
              <div className="text-gray-500 text-sm">@{tweet.author.username}</div>
            </div>
            <div className="text-gray-500 text-sm whitespace-nowrap ml-2">{formattedDate}</div>
          </div>
          
          {/* Tweet Text */}
          <div className="mb-3 text-gray-800 whitespace-pre-line break-words">{tweet.text}</div>
          
          {/* Media */}
          {tweet.media && tweet.media.length > 0 && (
            <div className={cn(
              "mb-3 overflow-hidden rounded-xl border bg-gray-50",
              tweet.media.length > 1 ? "grid grid-cols-2 gap-0.5" : ""
            )}>
              {tweet.media.slice(0, 4).map((media, index) => (
                <div 
                  key={`${tweet.id}-media-${index}`} 
                  className={cn(
                    "overflow-hidden",
                    media.height > media.width * 1.3 ? "max-h-80" : "max-h-64"
                  )}
                >
                  {media.type === 'photo' ? (
                    <img 
                      src={media.url} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative h-full w-full bg-black">
                      <img 
                        src={media.preview_image_url || media.url} 
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
              ))}
            </div>
          )}
          
          {/* Metrics */}
          {showActions && (
            <div className="flex items-center justify-between pt-1 text-gray-500">
              <div className="flex items-center space-x-1 text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>{formatCount(tweet.public_metrics.reply_count)}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Repeat className="h-4 w-4" />
                <span>{formatCount(tweet.public_metrics.retweet_count)}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Heart className="h-4 w-4" />
                <span>{formatCount(tweet.public_metrics.like_count)}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <BarChart className="h-4 w-4" />
                <span>{formatCount(tweet.public_metrics.quote_count)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard; 