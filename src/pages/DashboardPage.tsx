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
  Layers, LayoutGrid, ArrowUp, CreditCard, Building, Loader2
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
import { BrandOutIcon } from "@/components/BrandOutIcon";
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

  // Function to handle LinkedIn connection
  const handleConnectLinkedIn = () => {
    // Get the backend URL from environment variable or fallback to Render deployed URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Store current URL in localStorage to redirect back after LinkedIn connection
    localStorage.setItem('redirectAfterAuth', '/dashboard');
    
    // Redirect to LinkedIn OAuth endpoint
    window.location.href = `${baseUrl}/api/auth/linkedin`;
  };

  return (
    <div className="w-full h-full">
      {/* Welcome message and workspace switch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.firstName || 'there'}!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            You're in <span className="font-medium">{currentWorkspace.name}</span> • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
                    </div>

        <div className="mt-4 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Building className="h-4 w-4" />
                Workspaces
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {workspaces.map(workspace => (
                <DropdownMenuItem 
                  key={workspace.id}
                  className={`flex items-center gap-2 ${workspace.id === currentWorkspace.id ? 'bg-primary/10' : ''}`}
                  onClick={() => setCurrentWorkspace(workspace)}
                >
                  {workspace.type === 'personal' ? (
                    <User className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Users className="h-4 w-4 text-green-500" />
                  )}
                  <span>{workspace.name}</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
                <h3 className="text-2xl font-bold mt-1">{recentPosts.length || 12}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-green-500 text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>16%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Engagement</p>
                <h3 className="text-2xl font-bold mt-1">{analyticsData?.summary?.averageEngagement || '4.8%'}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-green-500 text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>3.2%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Follower Growth</p>
                <h3 className="text-2xl font-bold mt-1">+{analyticsData?.summary?.followerGrowth || '47'}</h3>
              </div>
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-green-500 text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>8.7%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - LinkedIn Profile & Create Post */}
        <div className="lg:col-span-1 space-y-6">
          {/* LinkedIn Profile Card */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-primary" />
                LinkedIn Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {linkedInProfile ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      <AvatarImage src={linkedInProfile.profileImage} alt={linkedInProfile.name} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{linkedInProfile.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{linkedInProfile.bio || 'LinkedIn Profile'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3 text-center">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="text-xl font-bold">{linkedInProfile.connections.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connections</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="text-xl font-bold">{linkedInProfile.followers.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Followers</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <Linkedin className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-2">Connect LinkedIn Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Link your LinkedIn profile to enable powerful content creation features
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-600 group"
                    onClick={handleConnectLinkedIn}
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                    Connect LinkedIn
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start bg-primary/90 hover:bg-primary"
                onClick={() => navigate('/dashboard/post')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Post
            </Button>
            
            <Button
              variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/dashboard/request-carousel')}
            >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Request Carousel
            </Button>
            
            <Button
              variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/dashboard/scraper')}
            >
                <FileText className="h-4 w-4 mr-2" />
                Scrape Content
            </Button>
            </CardContent>
          </Card>
          
          {/* Weekly AI Tip */}
          <Card className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <span>Weekly AI Tip</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-2">{weeklyTip.title}</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {weeklyTip.content}
              </p>
            </CardContent>
          </Card>

          {/* LinkedIn Connection Section - Show if no LinkedIn account is connected */}
          {!linkedInProfile && !loading.profile && (
            <Card className="overflow-hidden border-blue-100 dark:border-blue-900">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 p-6">
                  <div className="flex-1 mb-4 md:mb-0 md:mr-6">
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      Connect Your LinkedIn Account
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Link your LinkedIn profile to view analytics, schedule posts, and boost your engagement with our AI-powered tools.
                    </p>
                    <Button 
                      onClick={handleConnectLinkedIn}
                      variant="default" 
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Linkedin className="w-5 h-5 mr-2" />
                      Connect LinkedIn
                    </Button>
                  </div>
                  <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Linkedin className="w-24 h-24 md:w-32 md:h-32 text-blue-500/20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* LinkedIn Analytics Section - Show only if LinkedIn account is connected */}
          {linkedInProfile && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>LinkedIn Analytics</CardTitle>
                  <CardDescription>Your LinkedIn performance snapshot</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary"
                  onClick={() => navigate('/dashboard/analytics')}
                >
                  View Full Analytics
                </Button>
              </CardHeader>
              <CardContent>
                {/* Show when loading */}
                {loading.analytics && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                    <p className="text-sm text-gray-500">Loading LinkedIn analytics...</p>
                  </div>
                )}
                
                {/* Show when analytics are loaded */}
                {!loading.analytics && analyticsData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Total Impressions</div>
                        <div className="text-2xl font-bold">{analyticsData.summary.totalImpressions.toLocaleString()}</div>
                        <div className="text-xs text-green-600 mt-1">
                          <span className="flex items-center">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {analyticsData.impressions.increase}% from last period
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Avg. Engagement</div>
                        <div className="text-2xl font-bold">{analyticsData.summary.averageEngagement}%</div>
                        <div className="text-xs text-green-600 mt-1">
                          <span className="flex items-center">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {analyticsData.engagement.increase}% from last period
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Follower Growth</div>
                        <div className="text-2xl font-bold">+{analyticsData.summary.followerGrowth}</div>
                        <div className="text-xs text-green-600 mt-1">
                          <span className="flex items-center">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {analyticsData.followers.increase}% from last period
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Best Performing Post</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-sm mb-2">{analyticsData.summary.bestPerformingPost.text}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="flex items-center mr-3">
                            <Eye className="h-3 w-3 mr-1" />
                            {analyticsData.summary.bestPerformingPost.impressions.toLocaleString()} impressions
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {analyticsData.summary.bestPerformingPost.engagement}% engagement
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Middle & Right columns - Scheduled Posts & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scheduled Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Upcoming Posts</CardTitle>
                <CardDescription>Your scheduled content for publishing</CardDescription>
              </div>
                <Button
                variant="ghost" 
                  size="sm"
                className="text-primary"
                onClick={() => navigate('/dashboard/posts')}
              >
                View All
                </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.slice(0, 3).map((post, index) => (
                  <div key={index} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                      {post.isCarousel ? (
                        <Layers className="w-5 h-5 text-primary" />
                      ) : (
                        <FileText className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{post.isCarousel ? 'Carousel' : 'Text Post'}</p>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.scheduledTime}
                        </div>
                      </div>
                      <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
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
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Recent LinkedIn Activity</CardTitle>
                <CardDescription>Your recent posts and engagement</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={() => navigate('/dashboard/analytics')}
              >
                View Analytics
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentPosts.length > 0 ? (
                  recentPosts.slice(0, 2).map((post, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={linkedInProfile?.profileImage || ''} alt={linkedInProfile?.name || ''} />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{linkedInProfile?.name || getUserFullName()}</span>
                            <span className="text-xs text-gray-500">• {new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                          
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{post.text.substring(0, 150)}...</p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-gray-500">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-xs">{post.public_metrics.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-xs">{post.public_metrics.comments}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Share2 className="w-4 h-4" />
                              <span className="text-xs">{post.public_metrics.shares}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No recent posts</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 gap-2"
                      onClick={() => navigate('/dashboard/post')}
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create Your First Post
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-gray-800 flex justify-center py-3">
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/dashboard/posts')}>
                See All Posts
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
