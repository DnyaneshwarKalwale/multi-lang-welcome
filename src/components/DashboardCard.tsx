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
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover-lift transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-700" 
            />
            <div>
              <div className="font-medium text-sm">{author.name}</div>
              <div className="flex items-center text-xs text-gray-500">
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
                className="h-8 w-8 rounded-full text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-all duration-200"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-800 transition-all duration-200"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{content}</p>
        
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
          <div className="flex items-center justify-between mb-4 py-2 border-t border-gray-800">
            {stats.views !== undefined && (
              <div className="flex items-center text-xs text-gray-500 hover:text-indigo-400 transition-colors duration-200">
                <Eye className="w-4 h-4 mr-1" />
                <span>{stats.views}</span>
              </div>
            )}
            {stats.likes !== undefined && (
              <div className="flex items-center text-xs text-gray-500 hover:text-indigo-400 transition-colors duration-200">
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>{stats.likes}</span>
              </div>
            )}
            {stats.comments !== undefined && (
              <div className="flex items-center text-xs text-gray-500 hover:text-indigo-400 transition-colors duration-200">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{stats.comments}</span>
              </div>
            )}
            {stats.shares !== undefined && (
              <div className="flex items-center text-xs text-gray-500 hover:text-indigo-400 transition-colors duration-200">
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
    </motion.div>
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
  const max = Math.max(...data);
  
  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover-lift transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gradient-blue">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
          <BarChart className="w-4 h-4 text-indigo-400" />
        </div>
      </div>
      
      <div className="h-32 mb-4 relative">
        <div className="absolute inset-0 flex items-end justify-between">
          {data.map((value, index) => (
            <div 
              key={index} 
              className="relative group flex flex-col items-center"
              style={{ width: `${100 / data.length}%` }}
            >
              <div 
                className="absolute bottom-full mb-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded"
                style={{ transform: 'translateX(-50%)' }}
              >
                {value}
              </div>
              <div 
                className="w-5/6 bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t transition-all duration-300 group-hover:from-indigo-500 group-hover:to-indigo-400"
                style={{ height: `${max > 0 ? (value / max) * 100 : 0}%` }}
              ></div>
              <div className="text-xs text-gray-500 mt-1.5 text-center">{labels[index]}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{timeframe}</div>
        <div className={`flex items-center text-sm font-medium ${increase >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {increase >= 0 ? '↑' : '↓'} {Math.abs(increase)}%
        </div>
      </div>
    </motion.div>
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
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover-lift transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600 shine"></div>
      <div className="p-5 -mt-12">
        <div className="flex flex-col items-center mb-6">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-20 h-20 rounded-full border-4 border-gray-900 object-cover shadow-lg" 
          />
          <h3 className="mt-3 font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.role}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-gray-800/60 p-2 rounded-lg text-center hover-lift transition-all duration-300">
            <div className="text-xl font-bold text-indigo-400">{stats.posts}</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div className="bg-gray-800/60 p-2 rounded-lg text-center hover-lift transition-all duration-300">
            <div className="text-xl font-bold text-indigo-400">{stats.followers}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="bg-gray-800/60 p-2 rounded-lg text-center hover-lift transition-all duration-300">
            <div className="text-xl font-bold text-indigo-400">{stats.views}</div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
        </div>
        
        <Button 
          variant="transparent"
          className="w-full border border-gray-800 flex items-center justify-center gap-1.5 hover:border-indigo-500 transition-all duration-200"
        >
          <Users className="w-4 h-4" />
          <span>View Twitter profile</span>
        </Button>
      </div>
    </motion.div>
  );
} 