import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mic, Upload, Calendar, BarChart3, Twitter, 
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
import { useLanguage } from '@/contexts/LanguageContext';
import axios from "axios";
import { toast } from "sonner";

// Interface for Twitter profile data
interface TwitterProfile {
  id: string;
  username: string;
  name: string;
  profileImage: string;
  bio: string;
  location: string;
  url: string;
  joinedDate: string;
  following: number;
  followers: number;
  verified: boolean;
}

// Interface for Twitter tweet data
interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count: number;
  };
}

// Interface for Twitter analytics data
interface TwitterAnalytics {
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
    bestPerformingTweet: {
      text: string;
      impressions: number;
      engagement: number;
    };
  };
}

const DashboardPageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const { user, logout, token } = useAuth();
  
  // State for Twitter data
  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const [recentTweets, setRecentTweets] = useState<Tweet[]>([]);
  const [analyticsData, setAnalyticsData] = useState<TwitterAnalytics | null>(null);
  const [loading, setLoading] = useState({
    profile: false,
    tweets: false,
    analytics: false
  });

  // Default fallback data
  const fallbackScheduledTweets = [
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

  const [scheduledTweets, setScheduledTweets] = useState(fallbackScheduledTweets);

  // Load Twitter data from extension if available
  useEffect(() => {
    // Check if extension API is available
    if (window.dekcionExtension && window.dekcionExtension.getTwitterData) {
      console.log('Dekcion extension detected, attempting to load Twitter data');
      
      window.dekcionExtension.getTwitterData()
        .then((twitterData: any) => {
          console.log('Twitter data loaded from extension:', twitterData);
          
          // Update state with Twitter data from extension
          if (twitterData.profile) {
            setTwitterProfile(twitterData.profile);
          }
          
          if (twitterData.tweets) {
            setRecentTweets(twitterData.tweets);
          }
          
          if (twitterData.analytics) {
            setAnalyticsData(twitterData.analytics);
          }
        })
        .catch((error: Error) => {
          console.error('Failed to load Twitter data from extension:', error);
          // Will fall back to API fetch
        });
    }
    
    // Listen for Twitter data updates from extension
    document.addEventListener('dekcionTwitterDataUpdate', (e: any) => {
      console.log('Received Twitter data update from extension:', e.detail);
      
      // Update state with new Twitter data
      const twitterData = e.detail;
      
      if (twitterData.profile) {
        setTwitterProfile(twitterData.profile);
      }
      
      if (twitterData.tweets) {
        setRecentTweets(twitterData.tweets);
      }
      
      if (twitterData.analytics) {
        setAnalyticsData(twitterData.analytics);
      }
    });
    
    return () => {
      // Clean up event listener
      document.removeEventListener('dekcionTwitterDataUpdate', () => {});
    };
  }, []);

  // Fetch Twitter data when component mounts and when user is authenticated
  useEffect(() => {
    if (user?.twitterId && token) {
      fetchTwitterData();
    }
  }, [user, token]);

  // Function to fetch Twitter data from our API
  const fetchTwitterData = async () => {
    // Set loading states
    setLoading({
      profile: true,
      tweets: true,
      analytics: true
    });
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    try {
      // Fetch Twitter profile
      const profilePromise = axios.get(`${apiBaseUrl}/twitter/profile`, { headers });
      
      // Fetch recent tweets
      const tweetsPromise = axios.get(`${apiBaseUrl}/twitter/tweets`, { headers });
      
      // Fetch analytics data
      const analyticsPromise = axios.get(`${apiBaseUrl}/twitter/analytics`, { headers });
      
      // Execute all requests in parallel
      const [profileRes, tweetsRes, analyticsRes] = await Promise.allSettled([
        profilePromise, 
        tweetsPromise, 
        analyticsPromise
      ]);
      
      // Handle profile response
      if (profileRes.status === 'fulfilled') {
        setTwitterProfile(profileRes.value.data.data);
      } else {
        console.error('Failed to fetch Twitter profile:', profileRes.reason);
      }
      
      // Handle tweets response
      if (tweetsRes.status === 'fulfilled') {
        setRecentTweets(tweetsRes.value.data.data);
      } else {
        console.error('Failed to fetch tweets:', tweetsRes.reason);
      }
      
      // Handle analytics response
      if (analyticsRes.status === 'fulfilled') {
        setAnalyticsData(analyticsRes.value.data.data);
      } else {
        console.error('Failed to fetch analytics:', analyticsRes.reason);
      }
    } catch (error) {
      console.error('Error fetching Twitter data:', error);
      toast.error('Failed to fetch Twitter data');
    } finally {
      // Clear loading states
      setLoading({
        profile: false,
        tweets: false,
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
            <TabsTrigger value="create" onClick={() => setActiveTab("create")} className="data-[state=active]:bg-primary-50 dark:data-[state=active]:bg-primary-900/20">
              <PlusCircle className="h-4 w-4 mr-2" />
              {t('create')}
            </TabsTrigger>
            <TabsTrigger value="schedule" onClick={() => setActiveTab("schedule")} className="data-[state=active]:bg-primary-50 dark:data-[state=active]:bg-primary-900/20">
              <Calendar className="h-4 w-4 mr-2" />
              {t('schedule')}
            </TabsTrigger>
            <TabsTrigger value="analytics" onClick={() => setActiveTab("analytics")} className="data-[state=active]:bg-primary-50 dark:data-[state=active]:bg-primary-900/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('analytics')}
            </TabsTrigger>
            <TabsTrigger value="tweets" onClick={() => setActiveTab("tweets")} className="data-[state=active]:bg-gray-50 dark:data-[state=active]:bg-gray-800">
              <Twitter className="h-4 w-4 mr-2" />
              {t('myTweets')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-amber-500" />
                      {t('createNewTweet')}
                    </CardTitle>
                    <CardDescription>
                      {t('recordVoice')}, {t('writeText')}, {t('uploadMedia')} 
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Mic className="h-4 w-4 text-red-500" />
                        {t('recordVoice')}
                      </Button>
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Upload className="h-4 w-4 text-blue-500" />
                        {t('uploadMedia')}
                      </Button>
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Edit3 className="h-4 w-4 text-purple-500" />
                        {t('writeText')}
                      </Button>
                    </div>

                    <Textarea 
                      placeholder={t('whatsHappening')}
                      className="min-h-[150px] text-base resize-none"
                    />

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 py-1 border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400">
                          <Twitter className="h-3 w-3" />
                          Twitter
                        </Badge>
                        <span>280 {t('characters')}</span>
                      </div>
                          <div className="flex gap-3">
                        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                          <Calendar className="h-3 w-3" />
                          {t('schedule')}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                          <Maximize2 className="h-3 w-3" />
                          Thread
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      {t('generateWithAI')}
                    </Button>
                    <Button size="sm" className="px-4">{t('postTweet')}</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-blue-500" />
                      {t('preview')}
                    </CardTitle>
                    <CardDescription>
                      {t('previewDescription')}
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
                            <span className="text-gray-500 text-sm">@{getUserFullName().toLowerCase().replace(/\s/g, '')}</span>
                          </div>
                          <p className="text-sm mt-1">
                            Just launched our AI Twitter Assistant! Generate tweets, schedule content, and analyze performance - all in one place. Try it today and see the difference. #TwitterAI #ContentCreation
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6 ml-12 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>12</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3.5 w-3.5" />
                          <span>24</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>78</span>
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
                      {t('upcomingTweets')}
                    </CardTitle>
                    <CardDescription>
                      {t('scheduledPublication')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {scheduledTweets.map((tweet) => (
                          <div key={tweet.id} className="border dark:border-gray-800 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <p className="text-sm line-clamp-2 mb-2">{tweet.content}</p>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-teal-600 dark:text-teal-400 font-medium">
                                {tweet.scheduledTime}
                              </span>
                              {tweet.isThread && (
                                <Badge variant="outline" className="h-5 px-2 text-xs">
                                  Thread ({tweet.threadCount})
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
                      {t('aiSuggestions')}
                    </CardTitle>
                    <CardDescription>
                      {t('trendingTopics')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {["#TechTrends2023", "Content Marketing Tips", "Social Media Strategy", "Twitter Algorithm Updates", "Remote Work Tools"].map((topic, i) => (
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
                <CardTitle>{t('contentCalendar')}</CardTitle>
                <CardDescription>
                  {t('manageSchedule')}
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
                  <CardTitle className="text-lg">{t('impressions')}</CardTitle>
                  <CardDescription>
                    {t('totalViews')}
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
                            className="w-full h-full rounded-t-sm bg-gradient-to-t from-blue-500/40 to-cyan-400/40 dark:from-blue-500/60 dark:to-cyan-400/60"
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
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        ↑ {analyticsData?.impressions.increase}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('engagementRate')}</CardTitle>
                  <CardDescription>
                    {t('interactions')}
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
                            className="w-full h-full rounded-t-sm bg-gradient-to-t from-violet-500/40 to-purple-400/40 dark:from-violet-500/60 dark:to-purple-400/60"
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
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        ↑ {analyticsData?.engagement.increase}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('followersGrowth')}</CardTitle>
                  <CardDescription>
                    {t('newFollowers')}
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
                            className="w-full h-full rounded-t-sm bg-gradient-to-t from-teal-500/40 to-emerald-400/40 dark:from-teal-500/60 dark:to-emerald-400/60"
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
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        ↑ {analyticsData?.followers.increase}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tweets">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {recentTweets.map((tweet) => (
                  <Card key={tweet.id}>
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
                              <span className="text-gray-500 text-sm">@{getUserFullName().toLowerCase().replace(/\s/g, '')}</span>
                              <span className="text-gray-500 text-sm">·</span>
                              <span className="text-gray-500 text-sm">{tweet.created_at}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm mb-4">{tweet.text}</p>
                          <div className="flex gap-6 text-gray-500 text-sm">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{tweet.public_metrics.reply_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="h-4 w-4" />
                              <span>{tweet.public_metrics.retweet_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{tweet.public_metrics.like_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{tweet.public_metrics.impression_count}</span>
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
    const { theme } = useTheme();
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
