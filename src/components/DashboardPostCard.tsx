import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Send, Eye, Clock, Calendar } from "lucide-react";
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
    <Card className="border-2 border-black bg-white shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
      <CardHeader className="p-4 flex flex-row justify-between items-start bg-white border-b-2 border-black">
        <div className="flex items-center gap-3">
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-10 h-10 rounded-full border-2 border-black" 
          />
          <div>
            <CardTitle className="text-md font-bold text-black">{title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-black font-medium flex items-center">
                {status === "published" ? (
                  <><Eye className="w-3 h-3 mr-1 text-black" /> Published</>
                ) : status === "scheduled" ? (
                  <><Calendar className="w-3 h-3 mr-1 text-black" /> Scheduled</>
                ) : (
                  <><Clock className="w-3 h-3 mr-1 text-black" /> Draft</>
                )}
              </span>
              <span className="text-sm text-black font-medium">• {date}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-gray-100">
          <MoreHorizontal size={16} />
        </Button>
      </CardHeader>
      
      <CardContent className="p-5 pt-4 bg-white">
        <p className="text-base text-black font-medium leading-relaxed mb-4">
          {content}
        </p>
        
        {imageSrc && (
          <div className="mb-4 rounded-md overflow-hidden border-2 border-black">
            <img src={imageSrc} alt={title} className="w-full h-40 object-cover" />
          </div>
        )}
        
        {stats && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-white border-2 border-black rounded-lg">
            {stats.views !== undefined && (
              <div className="text-sm text-black font-semibold">
                {stats.views} views
              </div>
            )}
            {stats.likes !== undefined && (
              <div className="text-sm text-black font-semibold">
                {stats.likes} likes
              </div>
            )}
            {stats.comments !== undefined && (
              <div className="text-sm text-black font-semibold">
                {stats.comments} comments
              </div>
            )}
            {stats.shares !== undefined && (
              <div className="text-sm text-black font-semibold">
                {stats.shares} shares
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" className="h-9 gap-1 border-2 border-black text-black font-medium hover:bg-gray-100" onClick={onEdit}>
              <Edit size={14} className="text-black" />
              Edit
            </Button>
          )}
          {status === "draft" && onPublish && (
            <Button variant="default" size="sm" className="h-9 gap-1 bg-black hover:bg-gray-900 text-white font-medium" onClick={onPublish}>
              <Send size={14} />
              Publish
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" className="h-9 gap-1 ml-auto text-black border border-black hover:bg-gray-100 font-medium" onClick={onDelete}>
              <Trash2 size={14} className="text-black" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 