import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Send, Eye, Clock } from "lucide-react";
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
    <Card className="border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-blue-900 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
      <CardHeader className="p-4 flex flex-row justify-between items-start bg-blue-50 dark:bg-blue-800">
        <div className="flex items-center gap-3">
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-10 h-10 rounded-full border-2 border-blue-300 dark:border-blue-500" 
          />
          <div>
            <CardTitle className="text-md font-bold text-blue-800 dark:text-white">{title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-blue-700 dark:text-blue-200 font-medium flex items-center">
                {status === "published" ? (
                  <><Eye className="w-3 h-3 mr-1" /> Published</>
                ) : status === "scheduled" ? (
                  <><Clock className="w-3 h-3 mr-1" /> Scheduled</>
                ) : (
                  <><Clock className="w-3 h-3 mr-1" /> Draft</>
                )}
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-300 font-medium">• {date}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-700">
          <MoreHorizontal size={16} />
        </Button>
      </CardHeader>
      
      <CardContent className="p-5 pt-4">
        <p className="text-base text-gray-800 dark:text-white font-medium leading-relaxed mb-4">
          {content}
        </p>
        
        {imageSrc && (
          <div className="mb-4 rounded-md overflow-hidden border border-blue-100 dark:border-blue-700">
            <img src={imageSrc} alt={title} className="w-full h-40 object-cover" />
          </div>
        )}
        
        {stats && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-blue-50 dark:bg-blue-800/50 rounded-lg">
            {stats.views !== undefined && (
              <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                {stats.views} views
              </div>
            )}
            {stats.likes !== undefined && (
              <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                {stats.likes} likes
              </div>
            )}
            {stats.comments !== undefined && (
              <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                {stats.comments} comments
              </div>
            )}
            {stats.shares !== undefined && (
              <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                {stats.shares} shares
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" className="h-9 gap-1 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium" onClick={onEdit}>
              <Edit size={14} />
              Edit
            </Button>
          )}
          {status === "draft" && onPublish && (
            <Button variant="default" size="sm" className="h-9 gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium" onClick={onPublish}>
              <Send size={14} />
              Publish
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" className="h-9 gap-1 ml-auto text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium" onClick={onDelete}>
              <Trash2 size={14} />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 