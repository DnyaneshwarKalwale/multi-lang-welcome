import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mic, Upload, Calendar, BarChart3, Twitter, 
  Edit3, Eye, Clock, PlusCircle, Zap, Sparkles,
  Maximize2, MessageSquare, ThumbsUp, Share2,
  LogOut, User, Settings, ChevronDown
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { SekcionIconRounded, SekcionLogotype } from "@/components/ScripeIcon";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showFullContent, setShowFullContent] = useState<boolean>(false);
  
  const { user, logout } = useAuth();

  // Sample tweets data
  const scheduledTweets = [
    {
      id: 1,
      content: "Just released our latest feature: AI-powered tweet suggestions! Create better content in half the time. #AI #Twitter",
      scheduledTime: "Today, 3:30 PM",
      isThread: false,
    },
    {
      id: 2,
      content: "5 ways to improve your Twitter engagement:\n\n1. Post consistently\n2. Use relevant hashtags\n3. Engage with your audience\n4. Share valuable content\n5. Analyze your performance",
      scheduledTime: "Tomorrow, 10:00 AM",
      isThread: true,
      threadCount: 5,
    },
    {
      id: 3,
      content: "How our team increased Twitter engagement by 300% in just 30 days. The results might surprise you!",
      scheduledTime: "Apr 5, 1:15 PM",
      isThread: false,
    }
  ];

  // Sample analytics data
  const analyticsData = {
    impressions: {
      data: [1200, 1800, 2200, 1900, 2500, 2800, 3100],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 23,
      timeframe: "Last 7 days"
    },
    engagement: {
      data: [5.2, 6.8, 4.9, 7.2, 8.1, 7.5, 9.3],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 15,
      timeframe: "Last 7 days"
    },
    followers: {
      data: [120, 125, 128, 132, 138, 142, 150],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 8,
      timeframe: "Last 7 days"
    }
  };

  // Sample recent tweets
  const recentTweets = [
    {
      id: 101,
      content: "Just launched our AI Twitter Assistant! Generate tweets, schedule content, and analyze performance - all in one place.",
      date: "1h ago",
      stats: {
        likes: 45,
        retweets: 12,
        replies: 8,
        impressions: 1250
      }
    },
    {
      id: 102,
      content: "How we built our Twitter management platform in 30 days with React, Tailwind, and AI. A thread on our journey and lessons learned.",
      date: "5h ago",
      stats: {
        likes: 89,
        retweets: 24,
        replies: 15,
        impressions: 3200
      }
    }
  ];

  const handleLogout = () => {
    logout();
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return 'U';
    
    // Use firstName and lastName from the existing User interface
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    
    // Fallback to email
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'U';
  };

  // Get user's full name
  const getUserFullName = () => {
    if (!user) return 'User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Custom Navbar for Dashboard */}
      <div className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex">
            <a href="/" className="flex items-center justify-center">
              <img
                src="/logo-sekcion.png"
                alt="Sekcion Logo"
                className="h-8 w-auto"
              />
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex">
              Connect Twitter
            </Button>
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user?.profilePicture} alt={getUserFullName()} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{getUserFullName()}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="md:hidden">Connect Twitter</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="container relative">
          <div className="mx-auto max-w-5xl">
            <div className="mt-8 flex flex-col">
              <div className="flex flex-col gap-6">
                <div className="rounded-lg border bg-card p-6 shadow">
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <h3 className="text-2xl font-semibold">Twitter Activity Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        Recent tweets, engagements, and analytics from your Twitter accounts.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user?.profilePicture} alt={getUserFullName()} />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{getUserFullName()}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">
                            Just published our latest blog post on AI advancements! Check it out #AI #Technology
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>2h ago</span>
                          <span>•</span>
                          <span>12 likes</span>
                          <span>•</span>
                          <span>3 retweets</span>
                        </div>
                      </div>
                      <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user?.profilePicture} alt={getUserFullName()} />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{getUserFullName()}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">
                            Excited to announce our new product launch next week! Stay tuned for more details. #ProductLaunch
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>5h ago</span>
                          <span>•</span>
                          <span>24 likes</span>
                          <span>•</span>
                          <span>8 retweets</span>
                        </div>
                      </div>
                      <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user?.profilePicture} alt={getUserFullName()} />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{getUserFullName()}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm">
                            We're hiring! Join our team of talented developers and designers. DM for details.
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>1d ago</span>
                          <span>•</span>
                          <span>37 likes</span>
                          <span>•</span>
                          <span>15 retweets</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border bg-card p-6 shadow">
                    <h3 className="text-xl font-semibold">Scheduled Tweets</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your upcoming tweets and post schedule.
                    </p>
                    <div className="mt-4">
                      <div className="rounded-lg border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">
                              New feature announcement for our app...
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Tomorrow, 9:00 AM
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-lg border bg-card p-3 mt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">
                              Weekly industry news roundup #Technology
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Friday, 3:00 PM
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-6 shadow">
                    <h3 className="text-xl font-semibold">Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      View your Twitter engagement metrics.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Profile Views</span>
                        <span className="font-medium">1,245</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Followers</span>
                        <span className="font-medium">+83</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Engagement Rate</span>
                        <span className="font-medium">4.7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Impressions</span>
                        <span className="font-medium">12.4K</span>
                      </div>
                    </div>
                    <Button className="mt-4 w-full" variant="outline">
                      View Full Analytics
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow">
                  <h3 className="text-xl font-semibold">Content Ideas</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-generated content suggestions based on your audience.
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border bg-card p-3">
                      <p className="text-sm font-medium">Industry Trends</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        "Share your thoughts on the latest AI developments in content creation. What excites you the most?"
                      </p>
                      <div className="mt-2 flex justify-end gap-2">
                        <Button size="sm" variant="outline">Save</Button>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <p className="text-sm font-medium">Engagement Question</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        "What's one productivity tool you couldn't live without? We're currently loving @tool for managing our social media!"
                      </p>
                      <div className="mt-2 flex justify-end gap-2">
                        <Button size="sm" variant="outline">Save</Button>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </div>
                    <div className={`rounded-lg border bg-card p-3 ${!showFullContent && "hidden"}`}>
                      <p className="text-sm font-medium">Product Highlight</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        "Did you know our latest feature can help you save 5+ hours per week on content scheduling? Here's how it works..."
                      </p>
                      <div className="mt-2 flex justify-end gap-2">
                        <Button size="sm" variant="outline">Save</Button>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </div>
                  </div>
                  {!showFullContent && (
                    <Button
                      onClick={() => setShowFullContent(true)}
                      variant="outline"
                      className="mt-4 w-full"
                    >
                      Load More Ideas
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;