import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Send } from "lucide-react";
import { motion } from "framer-motion";

interface Author {
  name: string;
  avatar: string;
}

interface Stats {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

interface DashboardPostCardProps {
  title: string;
  content: string;
  author: Author;
  status: "draft" | "scheduled" | "published";
  date: string;
  stats?: Stats;
  imageSrc?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onPublish?: () => void;
}

export default function DashboardPostCard({
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
    <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="p-4 flex flex-row justify-between items-start">
        <div className="flex items-center gap-3">
          <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full" />
          <div>
            <CardTitle className="text-md font-medium">{title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{date}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                status === "published" ? "bg-green-900/40 text-green-400" :
                status === "scheduled" ? "bg-blue-900/40 text-blue-400" :
                "bg-gray-800 text-gray-400"
              }`}>
                {status}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal size={16} />
        </Button>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-300 line-clamp-3 mb-3">
          {content}
        </p>
        
        {imageSrc && (
          <div className="mb-3 rounded-md overflow-hidden">
            <img src={imageSrc} alt={title} className="w-full h-32 object-cover" />
          </div>
        )}
        
        {stats && (
          <div className="flex items-center gap-3 mb-3">
            {stats.views !== undefined && (
              <div className="text-xs text-gray-400">
                <span className="font-medium text-gray-300">{stats.views}</span> views
              </div>
            )}
            {stats.likes !== undefined && (
              <div className="text-xs text-gray-400">
                <span className="font-medium text-gray-300">{stats.likes}</span> likes
              </div>
            )}
            {stats.comments !== undefined && (
              <div className="text-xs text-gray-400">
                <span className="font-medium text-gray-300">{stats.comments}</span> comments
              </div>
            )}
            {stats.shares !== undefined && (
              <div className="text-xs text-gray-400">
                <span className="font-medium text-gray-300">{stats.shares}</span> shares
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={onEdit}>
              <Edit size={14} />
              Edit
            </Button>
          )}
          {status === "draft" && onPublish && (
            <Button variant="gradient" size="sm" className="h-8 gap-1" onClick={onPublish}>
              <Send size={14} />
              Publish
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" className="h-8 gap-1 ml-auto text-red-400 hover:text-red-300" onClick={onDelete}>
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 