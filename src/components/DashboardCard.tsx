import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Share2, ThumbsUp, MessageSquare, 
  Eye, Calendar, Clock, Edit, Users, Trash2
} from "lucide-react";

interface DashboardPostCardProps {
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  status: "draft" | "scheduled" | "published";
  date: string;
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  imageSrc?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onPublish?: () => void;
}

export function DashboardPostCard({
  title,
  content,
  author,
  status,
  date,
  stats,
  imageSrc,
  onEdit,
  onDelete,
  onPublish
}: DashboardPostCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-10 h-10 rounded-full mr-3 object-cover ring-2 ring-teal-400/30 dark:ring-teal-400/50" 
          />
          <div>
            <div className="font-medium text-sm text-gray-900 dark:text-white">{author.name}</div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              {status === "published" ? (
                <Eye className="w-3 h-3 mr-1" />
              ) : status === "scheduled" ? (
                <Calendar className="w-3 h-3 mr-1" />
              ) : (
                <Clock className="w-3 h-3 mr-1" />
              )}
              <span>
                {status === "published" 
                  ? `Published ${date}` 
                  : status === "scheduled" 
                  ? `Scheduled for ${date}` 
                  : `Last edited ${date}`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{content}</p>
      
      {imageSrc && (
        <div className="mb-4 rounded-lg overflow-hidden image-hover-zoom">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-48 object-cover transition-transform duration-500" 
          />
        </div>
      )}
      
      {stats && (
        <div className="flex items-center justify-between mb-4 py-2 border-t border-gray-100 dark:border-gray-800">
          {stats.views !== undefined && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200">
              <Eye className="w-4 h-4 mr-1" />
              <span>{stats.views}</span>
            </div>
          )}
          {stats.likes !== undefined && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200">
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span>{stats.likes}</span>
            </div>
          )}
          {stats.comments !== undefined && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{stats.comments}</span>
            </div>
          )}
          {stats.shares !== undefined && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200">
              <Share2 className="w-4 h-4 mr-1" />
              <span>{stats.shares}</span>
            </div>
          )}
        </div>
      )}
      
      {status === "draft" && onPublish && (
        <Button 
          variant="gradient"
          className="w-full group transition-all duration-300"
          onClick={onPublish}
        >
          <span>Publish now</span>
        </Button>
      )}
    </div>
  );
}

interface DashboardAnalyticsCardProps {
  title: string;
  data: number[];
  labels: string[];
  increase: number;
  timeframe: string;
}

export function DashboardAnalyticsCard({
  title,
  data,
  labels,
  increase,
  timeframe
}: DashboardAnalyticsCardProps) {
  // Convert the data to a format suitable for the line chart
  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: '#0EA5E9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h3>
        <div className="flex items-center text-sm">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${increase > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
            {increase > 0 ? '↑' : '↓'} {Math.abs(increase)}%
          </span>
        </div>
      </div>
      
      <div className="h-32 relative">
        {/* Chart component would go here */}
        <div className="absolute inset-0 flex items-end">
          {data.map((value, index) => (
            <div 
              key={index} 
              className="flex-1 mx-0.5"
              style={{ height: `${(value / Math.max(...data)) * 100}%` }}
            >
              <div 
                className="w-full h-full rounded-t-sm bg-gradient-to-t from-cyan-500/40 to-teal-400/40 dark:from-cyan-500/60 dark:to-teal-400/60"
                style={{ opacity: 0.5 + ((index + 1) / data.length) * 0.5 }}
              ></div>
            </div>
          ))}
        </div>
        
        {/* Line chart overlay */}
        <div className="absolute inset-0 flex items-end">
          <svg width="100%" height="100%" viewBox={`0 0 ${data.length * 20} 100`} preserveAspectRatio="none">
            <path
              d={`M0,${100 - (data[0] / Math.max(...data)) * 100} ${data.map((value, index) => `L${index * 20 + 10},${100 - (value / Math.max(...data)) * 100}`).join(' ')}`}
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 px-1 text-xs text-gray-500 dark:text-gray-400">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">{timeframe}</p>
      </div>
    </div>
  );
}

interface DashboardProfileCardProps {
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  stats: {
    posts: number;
    followers: number;
    views: number;
  };
}

export function DashboardProfileCard({ user, stats }: DashboardProfileCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center mb-5">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-10 h-10 rounded-full object-cover mr-3 ring-2 ring-teal-400/30 dark:ring-teal-400/50"
        />
        <div>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.posts}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.followers.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.views.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">Profile completion</p>
        <p className="text-xs font-medium text-teal-600 dark:text-teal-400">85%</p>
      </div>
      
      <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full" style={{ width: '85%' }}></div>
      </div>
    </div>
  );
} 