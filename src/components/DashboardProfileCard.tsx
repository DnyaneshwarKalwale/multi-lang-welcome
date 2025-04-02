import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface User {
  name: string;
  avatar: string;
  role: string;
}

interface Stats {
  posts: number;
  followers: number;
  views: number;
}

interface DashboardProfileCardProps {
  user: User;
  stats: Stats;
}

export default function DashboardProfileCard({
  user,
  stats
}: DashboardProfileCardProps) {
  return (
    <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader className="pt-4 pb-2 px-4 flex flex-row items-center gap-3 border-b border-gray-800">
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover" 
        />
        <div className="flex-1">
          <h3 className="font-medium text-white">{user.name}</h3>
          <p className="text-xs text-gray-400">{user.role}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
          <Edit2 size={14} />
        </Button>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-lg font-bold text-indigo-400">{stats.posts}</p>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-indigo-400">{stats.followers}</p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-indigo-400">{stats.views}</p>
            <p className="text-xs text-gray-400">Views</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 