import React from 'react';
import { Calendar, ThumbsUp, MessageCircle, Share2, Eye, MoreHorizontal, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostMetrics {
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
}

interface UnifiedPostCardProps {
  id: string;
  content: string;
  date: string;
  author?: {
    name: string;
    avatar?: string;
  };
  metrics: PostMetrics;
  isCarousel?: boolean;
  slideCount?: number;
  isPublished?: boolean;
  isScheduled?: boolean;
  scheduledDate?: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  className?: string;
}

const UnifiedPostCard: React.FC<UnifiedPostCardProps> = ({
  id,
  content,
  date,
  author,
  metrics,
  isCarousel = false,
  slideCount = 0,
  isPublished = false,
  isScheduled = false,
  scheduledDate,
  onView,
  onEdit,
  onDelete,
  onPublish,
  className = '',
}) => {
  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  // Calculate engagement rate
  const engagementRate = 
    ((metrics.likes + metrics.comments + metrics.shares) / 
    Math.max(metrics.impressions, 1) * 100).toFixed(1);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Post status badges */}
            <div className="flex gap-2 mb-2">
              {isPublished && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">Published</Badge>
              )}
              {isScheduled && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Scheduled for {scheduledDate}
                </Badge>
              )}
              {isCarousel && (
                <Badge variant="outline">Carousel • {slideCount} slides</Badge>
              )}
            </div>
            
            {/* Post content */}
            <p className="line-clamp-3 text-base">
              {content}
            </p>
          </div>
          
          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Post
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(id)}
                  className="text-red-600"
                >
                  Delete Post
                </DropdownMenuItem>
              )}
              {onPublish && !isPublished && (
                <DropdownMenuItem onClick={() => onPublish(id)}>
                  Publish Now
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Date and author */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{date}</span>
          
          {author && (
            <>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                {author.avatar ? (
                  <img 
                    src={author.avatar} 
                    alt={author.name} 
                    className="h-4 w-4 rounded-full mr-1" 
                  />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-blue-100 mr-1" />
                )}
                <span>{author.name}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div>
            <div className="text-xs text-gray-500">Impressions</div>
            <div className="font-medium">{formatNumber(metrics.impressions)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Engagement</div>
            <div className="font-medium">
              {formatNumber(metrics.likes + metrics.comments + metrics.shares)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Engagement Rate</div>
            <div className="font-medium">{engagementRate}%</div>
          </div>
          <div>
            <div className="flex space-x-3">
              <div className="flex items-center">
                <ThumbsUp className="h-3 w-3 mr-1 text-gray-400" />
                <span className="text-sm">{metrics.likes}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1 text-gray-400" />
                <span className="text-sm">{metrics.comments}</span>
              </div>
              <div className="flex items-center">
                <Share2 className="h-3 w-3 mr-1 text-gray-400" />
                <span className="text-sm">{metrics.shares}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 pb-3 flex justify-between">
        {onView && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => onView(id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        )}
        
        {onEdit && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Post
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UnifiedPostCard; 