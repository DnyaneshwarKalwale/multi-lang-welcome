import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Mic, Upload, Calendar, BarChart3, Linkedin, 
  Edit3, Eye, Clock, PlusCircle, Zap, Sparkles,
  Maximize2, MessageSquare, ThumbsUp, Share2,
  LogOut, User, Settings, ChevronDown, Users, Bell,
  Newspaper, BookOpen, LucideIcon, Lightbulb, FileText,
  Home, BookMarked, TrendingUp, UserCircle, ChevronRight,
  Layers, LayoutGrid, ArrowUp, CreditCard, Building,
  MoreHorizontal, MessageCircle
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
import { LovableLogo } from "@/components/LovableLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CarouselPreview } from "@/components/CarouselPreview";
import axios from "axios";
import { toast } from "sonner";
import { useTheme } from '@/contexts/ThemeContext';

// Interface for LinkedIn profile data
interface LinkedInProfile {
  id: string;
  username: string;
  name: string;
  profileImage: string;
  bio: string;
  location: string;
  url: string;
  joinedDate: string;
  connections: number;
  followers: number;
  verified: boolean;
}

// Interface for LinkedIn post data
interface Post {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    shares: number;
    comments: number;
    likes: number;
    impressions: number;
  };
}

// Interface for LinkedIn analytics data
interface LinkedInAnalytics {
  impressions: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  engagement: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  followers: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  summary: {
    totalImpressions: number;
    averageEngagement: number;
    followerGrowth: number;
    bestPerformingPost: {
      text: string;
      impressions: number;
      engagement: number;
    };
  };
}

// Interface for a workspace
interface Workspace {
  id: string;
  name: string;
  type: 'personal' | 'team';
  owner: string;
  memberCount?: number;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, logout, token } = useAuth();
  
  // State for LinkedIn data
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [analyticsData, setAnalyticsData] = useState<LinkedInAnalytics | null>(null);
  const [loading, setLoading] = useState({
    profile: false,
    posts: false,
    analytics: false
  });
  
  // State for workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '1',
      name: 'Personal Workspace',
      type: 'personal',
      owner: user?.email || '',
      createdAt: '2023-10-15'
    },
    {
      id: '2',
      name: 'Marketing Team',
      type: 'team',
      owner: 'marketing@example.com',
      memberCount: 5,
      createdAt: '2023-11-22'
    }
  ]);
  
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0]);

  // Default fallback data
  const fallbackScheduledPosts = [
    {
      id: 1,
      content: "Just released our latest feature: AI-powered content suggestions! Create better LinkedIn content in half the time. #AI #ContentCreation",
      scheduledTime: "Today, 3:30 PM",
      isCarousel: false,
    },
    {
      id: 2,
      content: "5 ways to improve your LinkedIn engagement:\n\n1. Post consistently\n2. Use relevant hashtags\n3. Engage with your network\n4. Share valuable content\n5. Analyze your performance",
      scheduledTime: "Tomorrow, 10:00 AM",
      isCarousel: true,
      slideCount: 5,
    },
    {
      id: 3,
      content: "How our team increased LinkedIn engagement by 300% in just 30 days. The results might surprise you!",
      scheduledTime: "Apr 5, 1:15 PM",
      isCarousel: false,
    }
  ];
  
  const [scheduledPosts, setScheduledPosts] = useState(fallbackScheduledPosts);

  // Weekly AI tip
  const [weeklyTip, setWeeklyTip] = useState({
    title: "Boost Your Engagement This Week",
    content: "When sharing achievements, focus on the lessons learned rather than the accolade itself. This approach creates more value for your audience and increases engagement."
  });

  // Load LinkedIn data from extension if available
  useEffect(() => {
    // Check if extension API is available
    if (window.linkedBoostExtension && window.linkedBoostExtension.getLinkedInData) {
      console.log('LinkedBoost extension detected, attempting to load LinkedIn data');
      
      window.linkedBoostExtension.getLinkedInData()
        .then((linkedInData: any) => {
          console.log('LinkedIn data loaded from extension:', linkedInData);
          
          // Update state with LinkedIn data from extension
          if (linkedInData.profile) {
            setLinkedInProfile(linkedInData.profile);
          }
          
          if (linkedInData.posts) {
            setRecentPosts(linkedInData.posts);
          }
          
          if (linkedInData.analytics) {
            setAnalyticsData(linkedInData.analytics);
          }
        })
        .catch((error: Error) => {
          console.error('Failed to load LinkedIn data from extension:', error);
          // Will fall back to API fetch
        });
    }
    
    // Listen for LinkedIn data updates from extension
    document.addEventListener('linkedBoostDataUpdate', (e: any) => {
      console.log('Received LinkedIn data update from extension:', e.detail);
      
      // Update state with new LinkedIn data
      const linkedInData = e.detail;
      
      if (linkedInData.profile) {
        setLinkedInProfile(linkedInData.profile);
      }
      
      if (linkedInData.posts) {
        setRecentPosts(linkedInData.posts);
      }
      
      if (linkedInData.analytics) {
        setAnalyticsData(linkedInData.analytics);
      }
    });
    
    return () => {
      // Clean up event listener
      document.removeEventListener('linkedBoostDataUpdate', () => {});
    };
  }, []);

  // Fetch LinkedIn data when component mounts and when user is authenticated
  useEffect(() => {
    if (user?.id && token) {
      fetchLinkedInData();
    }
  }, [user, token]);

  // Function to fetch LinkedIn data from our API
  const fetchLinkedInData = async () => {
    // Set loading states
    setLoading({
      profile: true,
      posts: true,
      analytics: true
    });
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    try {
      // Fetch LinkedIn profile
      const profilePromise = axios.get(`${apiBaseUrl}/linkedin/profile`, { headers });
      
      // Fetch recent posts
      const postsPromise = axios.get(`${apiBaseUrl}/linkedin/posts`, { headers });
      
      // Fetch analytics data
      const analyticsPromise = axios.get(`${apiBaseUrl}/linkedin/analytics`, { headers });
      
      // Execute all requests in parallel
      const [profileRes, postsRes, analyticsRes] = await Promise.allSettled([
        profilePromise, 
        postsPromise, 
        analyticsPromise
      ]);
      
      // Handle profile response
      if (profileRes.status === 'fulfilled') {
        setLinkedInProfile(profileRes.value.data.data);
        setLoading(prev => ({ ...prev, profile: false }));
      } else {
        console.error('Failed to fetch LinkedIn profile:', profileRes.reason);
        setLoading(prev => ({ ...prev, profile: false }));
      }
      
      // Handle posts response
      if (postsRes.status === 'fulfilled') {
        setRecentPosts(postsRes.value.data.data);
        setLoading(prev => ({ ...prev, posts: false }));
      } else {
        console.error('Failed to fetch posts:', postsRes.reason);
        setLoading(prev => ({ ...prev, posts: false }));
      }
      
      // Handle analytics response
      if (analyticsRes.status === 'fulfilled') {
        setAnalyticsData(analyticsRes.value.data.data);
        setLoading(prev => ({ ...prev, analytics: false }));
      } else {
        console.error('Failed to fetch analytics:', analyticsRes.reason);
        setLoading(prev => ({ ...prev, analytics: false }));
      }
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
      setLoading({
        profile: false,
        posts: false,
        analytics: false
      });
      
      // Show error toast
      toast.error('Failed to load LinkedIn data');
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserFullName = () => {
    if (!user) return 'User';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim();
  };

  return (
    <div className="max-w-full">
      {/* Workspace Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {getUserFullName()}!
          </p>
                    </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 h-9">
                {currentWorkspace.type === 'personal' ? (
                  <User className="h-4 w-4 text-purple-500" />
                ) : (
                  <Users className="h-4 w-4 text-green-500" />
                )}
                <span className="max-w-[120px] truncate">{currentWorkspace.name}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              {workspaces.map(workspace => (
                <DropdownMenuItem 
                  key={workspace.id}
                  onClick={() => setCurrentWorkspace(workspace)}
                  className={`flex items-center gap-2 ${
                    currentWorkspace.id === workspace.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                >
                  {workspace.type === 'personal' ? (
                    <User className="h-4 w-4 text-purple-500" />
                  ) : (
                    <Users className="h-4 w-4 text-green-500" />
                  )}
                  <span className="truncate">{workspace.name}</span>
                  {workspace.type === 'team' && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      {workspace.memberCount} members
                                </Badge>
                              )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-primary">
                <PlusCircle className="h-4 w-4" />
                <span>Create New Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{recentPosts.length || 12}</h3>
              </div>
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 sm:mt-4 text-green-500 text-xs sm:text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>16%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Engagement</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{analyticsData?.summary?.averageEngagement || '4.8%'}</h3>
              </div>
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 sm:mt-4 text-green-500 text-xs sm:text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>3.2%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Follower Growth</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">+{analyticsData?.summary?.followerGrowth || '47'}</h3>
              </div>
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 sm:mt-4 text-green-500 text-xs sm:text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>8.7%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left column - LinkedIn Profile & Create Post */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* LinkedIn Profile Card */}
          <Card>
            <CardHeader className="pb-0 pt-4 px-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-purple-600" />
                LinkedIn Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 sm:pt-4 px-4">
              {linkedInProfile ? (
                <div>
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary/10">
                      <AvatarImage src={linkedInProfile.profileImage} alt={linkedInProfile.name} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{linkedInProfile.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{linkedInProfile.bio || 'LinkedIn Profile'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2 sm:mt-3 text-center">
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
                      <p className="text-lg sm:text-xl font-bold">{linkedInProfile.connections.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connections</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded-lg">
                      <p className="text-lg sm:text-xl font-bold">{linkedInProfile.followers.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Followers</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 sm:py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-3 sm:mb-4">
                    <Linkedin className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-2">Connect LinkedIn Account</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                    Link your LinkedIn profile to enable powerful content creation features
                  </p>
            <Button
              variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:text-primary hover:border-primary"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    Connect LinkedIn
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3 pt-4 px-4">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4">
              <Button 
                className="w-full justify-start bg-primary/90 hover:bg-primary text-sm h-9 sm:h-10"
                onClick={() => navigate('/dashboard/post')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Post
            </Button>
            
            <Button
              variant="outline"
                className="w-full justify-start text-sm h-9 sm:h-10"
                onClick={() => navigate('/dashboard/request-carousel')}
            >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Request Carousel
            </Button>
            
            <Button
              variant="outline"
                className="w-full justify-start text-sm h-9 sm:h-10"
                onClick={() => navigate('/dashboard/scraper')}
            >
                <FileText className="h-4 w-4 mr-2" />
                Scrape Content
            </Button>
            </CardContent>
          </Card>
          
          {/* Weekly AI Tip */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200">
            <CardHeader className="pb-1 sm:pb-2 pt-4 px-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <span>Weekly AI Tip</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <h4 className="font-medium mb-2 text-sm sm:text-base">{weeklyTip.title}</h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {weeklyTip.content}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Middle & Right columns - Scheduled Posts & Recent Activity */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Scheduled Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3 pt-4 px-4">
              <div>
                <CardTitle className="text-base sm:text-lg">Upcoming Posts</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your scheduled content for publishing</CardDescription>
              </div>
                <Button
                variant="ghost" 
                  size="sm"
                className="text-purple-600 text-xs sm:text-sm"
                onClick={() => navigate('/dashboard/posts')}
              >
                View All
                </Button>
            </CardHeader>
            <CardContent className="px-4">
              <div className="space-y-3 sm:space-y-4">
                {scheduledPosts.slice(0, 3).map((post, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                      {post.isCarousel ? (
                        <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      ) : (
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <p className="text-xs sm:text-sm font-medium">{post.isCarousel ? 'Carousel' : 'Text Post'}</p>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-3 w-3 text-purple-600" />
                          {post.scheduledTime}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-2 break-words">
                        {post.content}
                      </p>
                  </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3 pt-4 px-4">
              <div>
                <CardTitle className="text-base sm:text-lg">Recent LinkedIn Activity</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your recent posts and engagement</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-600 text-xs sm:text-sm"
                onClick={() => navigate('/dashboard/analytics')}
              >
                View Analytics
              </Button>
            </CardHeader>
            <CardContent className="px-4 pb-1">
              {recentPosts && recentPosts.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentPosts.slice(0, 3).map((post, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-gray-200">
                          <AvatarImage src={linkedInProfile?.profileImage || ''} alt={linkedInProfile?.name || 'User'} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-medium text-sm">{linkedInProfile?.name || getUserFullName()}</p>
                              <p className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs sm:text-sm line-clamp-2">{post.text}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 pt-1 pb-3 px-2 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{post.public_metrics.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{post.public_metrics.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3.5 w-3.5" />
                          <span>{post.public_metrics.shares}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{post.public_metrics.impressions}</span>
                        </div>
                      </div>
                      
                      {index < recentPosts.slice(0, 3).length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-3">
                    <Linkedin className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">No Recent Activity</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">
                    Connect your LinkedIn account to see your recent posts and engagement metrics
                  </p>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    Connect LinkedIn
                  </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
