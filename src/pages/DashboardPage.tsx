
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mic, Upload, Calendar, BarChart3, 
  Edit3, Eye, Clock, PlusCircle, Zap, Sparkles,
  MessageSquare, ThumbsUp, Share2,
  User, Settings, ChevronDown, Users, Bell
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Linkedin } from "lucide-react";

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Default fallback data for scheduled posts
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      content: "Just released our latest feature: AI-powered LinkedIn post suggestions! Create better content in half the time. #AI #LinkedInMarketing",
      scheduledTime: "Today, 3:30 PM",
      isThread: false,
    },
    {
      id: 2,
      content: "5 ways to improve your LinkedIn engagement:\n\n1. Post consistently\n2. Use relevant hashtags\n3. Engage with your audience\n4. Share valuable content\n5. Analyze your performance",
      scheduledTime: "Tomorrow, 10:00 AM",
      isThread: true,
      threadCount: 5,
    },
    {
      id: 3,
      content: "How our team increased LinkedIn engagement by 300% in just 30 days. The results might surprise you!",
      scheduledTime: "Apr 5, 1:15 PM",
      isThread: false,
    }
  ]);

  // Sample analytics data
  const analyticsData = {
    impressions: {
      data: [1200, 1500, 1800, 2200, 2700, 3100, 3500],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 24,
      timeframe: "Last 7 days"
    },
    engagement: {
      data: [52, 67, 89, 103, 127, 145, 162],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 31,
      timeframe: "Last 7 days"
    },
    followers: {
      data: [10, 15, 22, 28, 35, 42, 50],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 18,
      timeframe: "Last 7 days"
    }
  };

  // Sample recent posts
  const recentPosts = [
    {
      id: "post-1",
      text: "Excited to share that our company has been recognized as a leader in the industry! Thank you to our amazing team and customers for your continued support.",
      created_at: "2 days ago",
      metrics: {
        reply_count: 24,
        repost_count: 38,
        like_count: 187,
        impression_count: 3452
      }
    },
    {
      id: "post-2",
      text: "I've been using AI to streamline our content creation process, and the results have been incredible. Productivity up by 40% and engagement has never been higher!",
      created_at: "5 days ago",
      metrics: {
        reply_count: 18,
        repost_count: 22,
        like_count: 135,
        impression_count: 2812
      }
    }
  ];

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  const getUserFullName = () => {
    if (!user) return 'User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email?.split('@')[0] || 'User';
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.info("You have been logged out");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl font-bold text-linkedin-blue dark:text-linkedin-blue mr-2">
                LinkedPulse
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" className="px-3 text-gray-700 dark:text-gray-300 hover:text-linkedin-blue">
                Dashboard
              </Button>
              <Button variant="ghost" className="px-3 text-gray-700 dark:text-gray-300 hover:text-linkedin-blue">
                Content
              </Button>
              <Button variant="ghost" className="px-3 text-gray-700 dark:text-gray-300 hover:text-linkedin-blue">
                Analytics
              </Button>
              <Button variant="ghost" className="px-3 text-gray-700 dark:text-gray-300 hover:text-linkedin-blue">
                Schedule
              </Button>
            </nav>

            {/* Right Side - User Menu, Notifications, Theme Toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggle variant="minimal" />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profilePicture} alt={getUserFullName()} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{getUserFullName()}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Welcome back, {user?.firstName}</h1>
                <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your LinkedIn presence today.</p>
              </div>
              <Button className="mt-4 sm:mt-0 bg-linkedin-blue hover:bg-linkedin-darkBlue text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Post Impressions", value: "34.5K", change: "+12%", icon: Eye },
                { label: "Engagement Rate", value: "5.7%", change: "+2.3%", icon: ThumbsUp },
                { label: "Profile Views", value: "1,248", change: "+34%", icon: User },
                { label: "New Connections", value: "85", change: "+17%", icon: Users }
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm bg-white dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">{stat.change} from last period</p>
                      </div>
                      <div className="p-2 bg-linkedin-blue/10 rounded-lg">
                        <stat.icon className="h-5 w-5 text-linkedin-blue" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          <Tabs defaultValue="create" className="mb-8">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="create" onClick={() => setActiveTab("create")} className="data-[state=active]:bg-linkedin-blue/10 dark:data-[state=active]:bg-linkedin-blue/20 data-[state=active]:text-linkedin-blue">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create
              </TabsTrigger>
              <TabsTrigger value="schedule" onClick={() => setActiveTab("schedule")} className="data-[state=active]:bg-linkedin-blue/10 dark:data-[state=active]:bg-linkedin-blue/20 data-[state=active]:text-linkedin-blue">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="analytics" onClick={() => setActiveTab("analytics")} className="data-[state=active]:bg-linkedin-blue/10 dark:data-[state=active]:bg-linkedin-blue/20 data-[state=active]:text-linkedin-blue">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="posts" onClick={() => setActiveTab("posts")} className="data-[state=active]:bg-linkedin-blue/10 dark:data-[state=active]:bg-linkedin-blue/20 data-[state=active]:text-linkedin-blue">
                <Linkedin className="h-4 w-4 mr-2" />
                My Posts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-amber-500" />
                        Create New LinkedIn Post
                      </CardTitle>
                      <CardDescription>
                        Record voice, write text, or upload media for your LinkedIn post
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Button variant="outline" className="gap-2 rounded-full">
                          <Mic className="h-4 w-4 text-red-500" />
                          Record Voice
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-full">
                          <Upload className="h-4 w-4 text-blue-500" />
                          Upload Media
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-full">
                          <Edit3 className="h-4 w-4 text-purple-500" />
                          Write Text
                        </Button>
                      </div>

                      <Textarea 
                        placeholder="What do you want to share with your network?"
                        className="min-h-[150px] text-base resize-none"
                      />

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1 py-1 border-linkedin-blue bg-linkedin-blue/10 dark:border-linkedin-blue dark:bg-linkedin-blue/20 text-linkedin-blue">
                            <Linkedin className="h-3 w-3" />
                            LinkedIn
                          </Badge>
                          <span>3000 characters</span>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                            <Calendar className="h-3 w-3" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Generate with AI
                      </Button>
                      <Button size="sm" className="px-4 bg-linkedin-blue hover:bg-linkedin-darkBlue">Post to LinkedIn</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Eye className="h-5 w-5 mr-2 text-blue-500" />
                        Preview
                      </CardTitle>
                      <CardDescription>
                        Preview how your post will look on LinkedIn
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border dark:border-gray-800 rounded-xl p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-sm">{getUserFullName()}</span>
                              <span className="text-gray-500 text-sm">• 2nd</span>
                            </div>
                            <p className="text-sm mt-1">
                              Just launched our AI LinkedIn Content Assistant! Generate engaging posts, schedule content, and analyze performance - all in one place. Try it today and see how it transforms your LinkedIn strategy. #LinkedInMarketing #ContentCreation
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-6 ml-12 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>14</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-3.5 w-3.5" />
                            <span>24</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>86</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-violet-500" />
                        Upcoming Posts
                      </CardTitle>
                      <CardDescription>
                        Posts scheduled for publication
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                          {scheduledPosts.map((post) => (
                            <div key={post.id} className="border dark:border-gray-800 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-linkedin-blue dark:text-linkedin-blue font-medium">
                                  {post.scheduledTime}
                                </span>
                                {post.isThread && (
                                  <Badge variant="outline" className="h-5 px-2 text-xs">
                                    Thread ({post.threadCount})
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button variant="ghost" size="sm" className="w-full">View Calendar</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                        AI Suggestions
                      </CardTitle>
                      <CardDescription>
                        Trending topics to boost your LinkedIn engagement
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                      {["#LinkedInStrategy", "Career Development", "Leadership Skills", "Industry Insights", "Professional Growth"].map((topic, i) => (
                        <div key={i} className="flex items-center border dark:border-gray-800 rounded-lg p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                          <span className="text-sm">{topic}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Content Calendar</CardTitle>
                  <CardDescription>
                    Manage your scheduled LinkedIn posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] flex items-center justify-center border border-dashed rounded-lg">
                    <p className="text-gray-500">Calendar and scheduling interface would be implemented here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Impressions</CardTitle>
                    <CardDescription>
                      Total views of your LinkedIn content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[180px] mt-2 relative">
                      <div className="absolute inset-0 flex items-end">
                        {analyticsData.impressions.data.map((value, index) => (
                          <div 
                            key={index} 
                            className="flex-1 mx-0.5"
                            style={{ height: `${(value / Math.max(...analyticsData.impressions.data)) * 100}%` }}
                          >
                            <div 
                              className="w-full h-full rounded-t-sm bg-gradient-to-t from-linkedin-blue/40 to-linkedin-lightBlue/40 dark:from-linkedin-blue/60 dark:to-linkedin-lightBlue/60"
                              style={{ opacity: 0.5 + ((index + 1) / analyticsData.impressions.data.length) * 0.5 }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
                      {analyticsData.impressions.labels.map((label, index) => (
                        <span key={index}>{label}</span>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <p className="text-xs text-gray-500">{analyticsData.impressions.timeframe}</p>
                      <div className="flex items-center text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          ↑ {analyticsData.impressions.increase}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Engagement Rate</CardTitle>
                    <CardDescription>
                      Interactions with your LinkedIn content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[180px] mt-2 relative">
                      <div className="absolute inset-0 flex items-end">
                        {analyticsData.engagement.data.map((value, index) => (
                          <div 
                            key={index} 
                            className="flex-1 mx-0.5"
                            style={{ height: `${(value / Math.max(...analyticsData.engagement.data)) * 100}%` }}
                          >
                            <div 
                              className="w-full h-full rounded-t-sm bg-gradient-to-t from-violet-500/40 to-purple-400/40 dark:from-violet-500/60 dark:to-purple-400/60"
                              style={{ opacity: 0.5 + ((index + 1) / analyticsData.engagement.data.length) * 0.5 }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
                      {analyticsData.engagement.labels.map((label, index) => (
                        <span key={index}>{label}</span>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <p className="text-xs text-gray-500">{analyticsData.engagement.timeframe}</p>
                      <div className="flex items-center text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          ↑ {analyticsData.engagement.increase}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Network Growth</CardTitle>
                    <CardDescription>
                      New connections and followers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[180px] mt-2 relative">
                      <div className="absolute inset-0 flex items-end">
                        {analyticsData.followers.data.map((value, index) => (
                          <div 
                            key={index}
                            className="flex-1 mx-0.5"
                            style={{ height: `${(value / Math.max(...analyticsData.followers.data)) * 100}%` }}
                          >
                            <div 
                              className="w-full h-full rounded-t-sm bg-gradient-to-t from-linkedin-blue/40 to-linkedin-lightBlue/40 dark:from-linkedin-blue/60 dark:to-linkedin-lightBlue/60"
                              style={{ opacity: 0.5 + ((index + 1) / analyticsData.followers.data.length) * 0.5 }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
                      {analyticsData.followers.labels.map((label, index) => (
                        <span key={index}>{label}</span>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <p className="text-xs text-gray-500">{analyticsData.followers.timeframe}</p>
                      <div className="flex items-center text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          ↑ {analyticsData.followers.increase}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="posts">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {recentPosts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{getUserFullName()}</span>
                                <span className="text-gray-500 text-sm">• 2nd</span>
                                <span className="text-gray-500 text-sm">•</span>
                                <span className="text-gray-500 text-sm">{post.created_at}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm mb-4">{post.text}</p>
                            <div className="flex gap-6 text-gray-500 text-sm">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.metrics.reply_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="h-4 w-4" />
                                <span>{post.metrics.repost_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{post.metrics.like_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.metrics.impression_count}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
