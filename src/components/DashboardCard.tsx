
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MoreHorizontal, ArrowUpRight, Eye, Heart, MessageCircle, Share2, Edit, Trash, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

export default function DashboardCard({
  title,
  icon,
  children,
  delay = 0,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card className="h-full border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-2 flex flex-row items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 dark:from-brand-purple/20 dark:to-brand-pink/20 rounded-full">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

// Analytics Card Component
interface DashboardAnalyticsCardProps {
  title: string;
  data: number[];
  labels: string[];
  increase: number;
  timeframe: string;
}

export function DashboardAnalyticsCard({ title, data, labels, increase, timeframe }: DashboardAnalyticsCardProps) {
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index]
  }));

  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover-lift h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <MoreHorizontal size={16} />
        </Button>
      </div>
      
      <div className="h-[120px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
            <YAxis hide={true} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                borderColor: '#374151',
                borderRadius: '0.5rem',
                fontSize: '0.75rem'
              }} 
              labelStyle={{ color: '#F9FAFB' }}
              itemStyle={{ color: '#F9FAFB' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#6366F1" 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#gradient-${title})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center mt-3">
        <div className="flex items-center text-emerald-400 mr-3">
          <ArrowUpRight size={16} className="mr-1" />
          <span className="text-sm font-medium">{increase}%</span>
        </div>
        <span className="text-xs text-gray-400">{timeframe}</span>
      </div>
    </motion.div>
  );
}

// Profile Card Component
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
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover-lift h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="flex items-center mb-4">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-indigo-500"
        />
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-xs text-gray-400">{user.role}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-gray-800/50">
          <div className="text-lg font-medium">{stats.posts}</div>
          <div className="text-xs text-gray-400">Posts</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-gray-800/50">
          <div className="text-lg font-medium">{stats.followers}</div>
          <div className="text-xs text-gray-400">Followers</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-gray-800/50">
          <div className="text-lg font-medium">{stats.views}</div>
          <div className="text-xs text-gray-400">Views</div>
        </div>
      </div>
      
      <Button variant="gradient" size="sm" className="w-full">View Profile</Button>
    </motion.div>
  );
}

// Post Card Component
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
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  imageSrc?: string;
  onEdit: () => void;
  onDelete: () => void;
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
  const statusColors = {
    draft: "bg-gray-500/20 text-gray-300",
    scheduled: "bg-amber-500/20 text-amber-300",
    published: "bg-emerald-500/20 text-emerald-300"
  };
  
  const statusLabel = {
    draft: "Draft",
    scheduled: "Scheduled",
    published: "Published"
  };

  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover-lift"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
    >
      {imageSrc && (
        <div className="h-40 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <Badge className={`${statusColors[status]} mb-2`}>
              {status === "draft" && <Clock size={12} className="mr-1" />}
              {statusLabel[status]}
            </Badge>
            <h3 className="font-medium text-lg mb-2">{title}</h3>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={onEdit}>
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400" onClick={onDelete}>
              <Trash size={16} />
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">{content}</p>
        
        {stats && (
          <div className="flex justify-between text-xs text-gray-400 py-3 border-t border-gray-800">
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              {stats.views}
            </div>
            <div className="flex items-center">
              <Heart size={14} className="mr-1" />
              {stats.likes}
            </div>
            <div className="flex items-center">
              <MessageCircle size={14} className="mr-1" />
              {stats.comments}
            </div>
            <div className="flex items-center">
              <Share2 size={14} className="mr-1" />
              {stats.shares}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="w-6 h-6 rounded-full mr-2" 
            />
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          
          {status === "draft" && onPublish && (
            <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 text-xs" onClick={onPublish}>
              Publish
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
