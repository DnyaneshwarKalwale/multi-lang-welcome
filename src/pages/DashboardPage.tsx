
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mic, Upload, Calendar, BarChart3, Linkedin, 
  Edit3, Eye, Clock, PlusCircle, Zap, Sparkles,
  Maximize2, MessageSquare, ThumbsUp, Share2,
  LogOut, User, Settings, ChevronDown, Users, Bell
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
import { useLanguage } from '@/contexts/LanguageContext';
import axios from "axios";
import { toast } from "sonner";

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

const DashboardPageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();
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
      } else {
        console.error('Failed to fetch LinkedIn profile:', profileRes.reason);
      }
      
      // Handle posts response
      if (postsRes.status === 'fulfilled') {
        setRecentPosts(postsRes.value.data.data);
      } else {
        console.error('Failed to fetch posts:', postsRes.reason);
      }
      
      // Handle analytics response
      if (analyticsRes.status === 'fulfilled') {
        setAnalyticsData(analyticsRes.value.data.data);
      } else {
        console.error('Failed to fetch analytics:', analyticsRes.reason);
      }
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
      toast.error('Failed to fetch LinkedIn data');
    } finally {
      // Clear loading states
      setLoading({
        profile: false,
        posts: false,
        analytics: false
      });
    }
  };

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
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
        <Tabs defaultValue="create" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="create" onClick={() => setActiveTab("create")} className="data-[state=active]:bg-primary-50">
              <PlusCircle className="h-4 w-4 mr-2" />
              {t('create')}
            </TabsTrigger>
            <TabsTrigger value="schedule" onClick={() => setActiveTab("schedule")} className="data-[state=active]:bg-primary-50">
              <Calendar className="h-4 w-4 mr-2" />
              {t('schedule')}
            </TabsTrigger>
            <TabsTrigger value="analytics" onClick={() => setActiveTab("analytics")} className="data-[state=active]:bg-primary-50">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('analytics')}
            </TabsTrigger>
            <TabsTrigger value="posts" onClick={() => setActiveTab("posts")} className="data-[state=active]:bg-gray-50">
              <Linkedin className="h-4 w-4 mr-2" />
              {t('myPosts')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-amber-500" />
                      {t('createNewPost')}
                    </CardTitle>
                    <CardDescription>
                      Create engaging LinkedIn content to boost your professional presence
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Edit3 className="h-4 w-4 text-purple-500" />
                        Text Post
                      </Button>
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Upload className="h-4 w-4 text-blue-500" />
                        Document
                      </Button>
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Mic className="h-4 w-4 text-red-500" />
                        Audio to Text
                      </Button>
                    </div>

                    <Textarea 
                      placeholder="What would you like to share with your network?"
                      className="min-h-[150px] text-base resize-none"
                    />

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 py-1 border-blue-200 bg-blue-50 text-blue-700">
                          <Linkedin className="h-3 w-3" />
                          LinkedIn
                        </Badge>
                        <span>3000 characters</span>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                          <Calendar className="h-3 w-3" />
                          {t('schedule')}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                          <Maximize2 className="h-3 w-3" />
                          Carousel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      {t('generateWithAI')}
                    </Button>
                    <Button size="sm" className="px-4">Post to LinkedIn</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-blue-500" />
                      {t('preview')}
                    </CardTitle>
                    <CardDescription>
                      How your post will look on LinkedIn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar>
                          <AvatarImage src={user?.profilePicture} />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm">{getUserFullName()}</span>
                            <span className="text-gray-500 text-sm">• 1st</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">Product Marketing Manager • SaaS Technology</p>
                          <p className="text-sm mt-1">
                            Just launched our AI LinkedIn Assistant! Generate posts, schedule content, and analyze performance - all in one platform. Try it today and see how it can elevate your LinkedIn presence. #LinkedInTips #ContentCreation #ProfessionalGrowth
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6 ml-12 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>42</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>8</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3.5 w-3.5" />
                          <span>5</span>
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
                      Your scheduled LinkedIn content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {scheduledPosts.map((post) => (
                          <div key={post.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                            <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-teal-600 font-medium">
                                {post.scheduledTime}
                              </span>
                              {post.isCarousel && (
                                <Badge variant="outline" className="h-5 px-2 text-xs">
                                  Carousel ({post.slideCount})
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="ghost" size="sm" className="w-full">{t('viewCalendar')}</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                      AI Suggestions
                    </CardTitle>
                    <CardDescription>
                      Trending topics for professional content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {["#CareerDevelopment", "Remote Work Best Practices", "Industry Insights", "Leadership Tips", "Professional Growth"].map((topic, i) => (
                      <div key={i} className="flex items-center border rounded-lg p-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
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
                  Manage your LinkedIn content schedule
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
                    Total views on your LinkedIn content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px] mt-2 relative">
                    <div className="absolute inset-0 flex items-end">
                      {analyticsData?.impressions.data.map((value, index) => (
                        <div 
                          key={index} 
                          className="flex-1 mx-0.5"
                          style={{ height: `${(value / Math.max(...analyticsData.impressions.data)) * 100}%` }}
                        >
                          <div 
                            className="w-full h-full rounded-t-sm bg-gradient-to-t from-blue-500/40 to-cyan-400/40"
                            style={{ opacity: 0.5 + ((index + 1) / analyticsData.impressions.data.length) * 0.5 }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
                    {analyticsData?.impressions.labels.map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t flex justify-between items-center">
                    <p className="text-xs text-gray-500">{analyticsData?.impressions.timeframe}</p>
                    <div className="flex items-center text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        ↑ {analyticsData?.impressions.increase}%
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
                      {analyticsData?.engagement.data.map((value, index) => (
                        <div 
                          key={index} 
                          className="flex-1 mx-0.5"
                          style={{ height: `${(value / Math.max(...analyticsData.engagement.data)) * 100}%` }}
                        >
                          <div 
                            className="w-full h-full rounded-t-sm bg-gradient-to-t from-violet-500/40 to-purple-400/40"
                            style={{ opacity: 0.5 + ((index + 1) / analyticsData.engagement.data.length) * 0.5 }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
                    {analyticsData?.engagement.labels.map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t flex justify-between items-center">
                    <p className="text-xs text-gray-500">{analyticsData?.engagement.timeframe}</p>
                    <div className="flex items-center text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        ↑ {analyticsData?.engagement.increase}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Connections Growth</CardTitle>
                  <CardDescription>
                    New connections and followers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px] mt-2 relative">
                    <div className="absolute inset-0 flex items-end">
                      {analyticsData?.followers.data.map((value, index) => (
                        <div 
                          key={index}
                          className="flex-1 mx-0.5"
                          style={{ height: `${(value / Math.max(...analyticsData.followers.data)) * 100}%` }}
                        >
                          <div 
                            className="w-full h-full rounded-t-sm bg-gradient-to-t from-teal-500/40 to-emerald-400/40"
                            style={{ opacity: 0.5 + ((index + 1) / analyticsData.followers.data.length) * 0.5 }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
                    {analyticsData?.followers.labels.map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t flex justify-between items-center">
                    <p className="text-xs text-gray-500">{analyticsData?.followers.timeframe}</p>
                    <div className="flex items-center text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        ↑ {analyticsData?.followers.increase}%
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
                              <span className="text-gray-500 text-sm">• 1st</span>
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
                              <span>{post.public_metrics.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="h-4 w-4" />
                              <span>{post.public_metrics.shares}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.public_metrics.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.public_metrics.impressions}</span>
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

const DashboardPage: React.FC = () => {
  try {
    const { user } = useAuth();
    const { t } = useLanguage();
    
    return <DashboardPageContent />;
  } catch (error) {
    console.error("Error rendering DashboardPage:", error);
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
};

export default DashboardPage;
