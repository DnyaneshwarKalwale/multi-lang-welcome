import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Mic, Upload, Calendar, 
  Edit3, Eye, Clock, PlusCircle, Zap, Sparkles,
  Maximize2, MessageSquare, ThumbsUp, Share2,
  LogOut, User, Settings, ChevronDown, Users, Bell,
  Newspaper, BookOpen, LucideIcon, Lightbulb, FileText,
  Home, BookMarked, TrendingUp, UserCircle, ChevronRight,
  Layers, LayoutGrid, ArrowUp, CreditCard, Building, Loader2,
  AlertCircle, Linkedin, CheckCircle, Youtube, BarChart3,
  Target, Activity, Flame, Star, Award, Briefcase, Plus
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
import ScheduledPostsCalendar from "@/components/ScheduledPostsCalendar";
import axios from "axios";
import { toast } from "sonner";
import { useTheme } from '@/contexts/ThemeContext';
import { CloudinaryImage } from '@/utils/cloudinaryDirectUpload';

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
}

interface DashboardData {
  totalPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  aiGeneratedContent: number;
  savedAiPosts: number;
  videoTranscripts: number;
  carouselRequests: number;
  pendingCarousels: number;
  completedCarousels: number;
  carouselContent: number;
  lastMonthStats: {
    totalPosts: number;
    aiGeneratedContent: number;
    carouselRequests: number;
  };
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, logout, token } = useAuth();
  
  // State for LinkedIn data
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [loading, setLoading] = useState({
    profile: false,
  });
  
  // Track shown toasts
  const [shownToasts, setShownToasts] = useState<string[]>([]);
  
  // Track if the user is connected via LinkedIn
  const [isLinkedInConnected, setIsLinkedInConnected] = useState<boolean>(
    user?.authMethod === 'linkedin' || !!user?.linkedinId || !!user?.linkedinConnected
  );
  
  // Generate a LinkedIn username based on user's name
  const [linkedInUsername, setLinkedInUsername] = useState<string>('');

  // For displaying scheduled posts (empty since scheduled post functionality is removed)
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);

  // Weekly AI tip
  const [weeklyTip, setWeeklyTip] = useState({
    title: "Boost Your Engagement This Week",
    content: "When sharing achievements, focus on the lessons learned rather than the accolade itself. This approach creates more value for your audience and increases engagement."
  });

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalPosts: 0,
    draftPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    aiGeneratedContent: 0,
    savedAiPosts: 0,
    videoTranscripts: 0,
    carouselRequests: 0,
    pendingCarousels: 0,
    completedCarousels: 0,
    carouselContent: 0,
    lastMonthStats: {
      totalPosts: 0,
      aiGeneratedContent: 0,
      carouselRequests: 0
    }
  });

  // Load LinkedIn profile data from extension if available
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
    });
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    try {
      // Try to fetch basic LinkedIn profile first (doesn't rely on LinkedIn API tokens)
      console.log('Fetching basic LinkedIn profile data');
      const basicProfilePromise = axios.get(`${apiBaseUrl}/linkedin/basic-profile`, { headers });
      
      // Execute request
      const basicProfileRes = await basicProfilePromise;
      
      // Check if basic profile fetch was successful
      if (basicProfileRes.data) {
        console.log('Basic LinkedIn profile data fetched successfully');
        setLinkedInProfile(basicProfileRes.data.data);
        setLoading({ profile: false });
      }
    } catch (error) {
      console.error('Basic profile fetch failed, trying regular profile endpoint');
      
      try {
        // If basic profile failed, try the standard profile endpoint (with LinkedIn API)
        const profileRes = await axios.get(`${apiBaseUrl}/linkedin/profile`, { headers });
        console.log('Standard LinkedIn profile fetch result:', profileRes.data);
        setLinkedInProfile(profileRes.data.data);
        setLoading({ profile: false });
        
        // Show toast if using sample data
        if (profileRes.data.usingRealData === false) {
          console.warn('Using sample LinkedIn profile data:', profileRes.data.error);
          
          let errorMessage = 'Some LinkedIn data could not be fetched.';
          let errorDescription = profileRes.data.errorDetails || 'Try reconnecting your LinkedIn account.';
          
          // Only show token expiry messages, not permission errors which can be confusing
          if (profileRes.data.errorType === 'token_expired') {
          toast.warning(errorMessage, {
            description: errorDescription,
            duration: 5000
          });
          
          // Mark toast as shown
          setShownToasts(prev => [...prev, 'profile-warning']);
          }
        } else if (profileRes.data.usingRealData === true) {
          console.log('Using real LinkedIn profile data');
          toast.success('Successfully connected to LinkedIn', {
            description: 'Your profile data has been loaded.',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('All LinkedIn profile fetch methods failed:', error);
        setLoading({ profile: false });
        
        // Don't show error toasts for permission issues as they're expected now
        if (!error.response || error.response.status !== 403) {
          toast.error('Failed to load LinkedIn profile', {
            description: error.response?.data?.message || error.message || 'Unknown error',
              duration: 5000
            });
        }
      }
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch posts data
      const postsResponse = await axios.get(`${apiBaseUrl}/posts`, { headers });
      const posts = postsResponse.data.data || [];

      // Fetch carousel requests
      const carouselRequestsResponse = await axios.get(`${apiBaseUrl}/carousels/user/requests`, { headers });
      const carouselRequests = carouselRequestsResponse.data.data || [];
      
      // Fetch carousels data
      const carouselsResponse = await axios.get(`${apiBaseUrl}/carousels`, { headers });
      const carousels = carouselsResponse.data.data || [];
      
      // Get saved videos from localStorage
      const savedVideos = JSON.parse(localStorage.getItem('savedYoutubeVideos') || '[]');

      // Calculate AI content statistics
      const savedAiPosts = posts.filter(post => {
        const content = post.content?.toLowerCase() || '';
        const title = post.title?.toLowerCase() || '';
        return content.includes('ai') || content.includes('artificial intelligence') || 
               title.includes('ai') || title.includes('artificial intelligence') ||
               post.isAI === true || post.aiGenerated === true;
      }).length;

      const videoTranscripts = savedVideos.filter(video => 
        video.transcript && video.transcript.length > 0
      ).length;

      const totalAiContent = savedAiPosts + videoTranscripts;

      // Calculate carousel request statistics
      const pendingRequests = carouselRequests.filter(request => 
        request.status === 'pending' || request.status === 'in_progress'
      ).length;
      
      const completedRequests = carouselRequests.filter(request => 
        request.status === 'completed'
      ).length;

      // Calculate carousel content statistics
      const carouselContent = savedVideos.filter(video => 
        video.source === 'youtube' && video.status === 'ready'
      ).length;

      // Get last month's date
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // Update dashboard data
      setDashboardData({
        totalPosts: posts.length,
        draftPosts: posts.filter(post => post.status === 'draft').length,
        scheduledPosts: posts.filter(post => post.status === 'scheduled').length,
        publishedPosts: posts.filter(post => post.status === 'published').length,
        aiGeneratedContent: totalAiContent,
        savedAiPosts: savedAiPosts,
        videoTranscripts: videoTranscripts,
        carouselRequests: carouselRequests.length,
        pendingCarousels: pendingRequests,
        completedCarousels: completedRequests,
        carouselContent: carouselContent,
        lastMonthStats: {
          totalPosts: posts.filter(post => new Date(post.createdAt) >= lastMonth).length,
          aiGeneratedContent: posts.filter(post => {
            const content = post.content?.toLowerCase() || '';
            const title = post.title?.toLowerCase() || '';
            return new Date(post.createdAt) >= lastMonth && 
                   (content.includes('ai') || content.includes('artificial intelligence') || 
                    title.includes('ai') || title.includes('artificial intelligence') ||
                    post.isAI === true || post.aiGenerated === true);
          }).length + savedVideos.filter(video => 
            new Date(video.savedAt || video.createdAt) >= lastMonth && 
            video.transcript && video.transcript.length > 0
          ).length,
          carouselRequests: carouselRequests.filter(request => 
            new Date(request.createdAt) >= lastMonth
          ).length
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data', {
        description: error.response?.data?.message || 'Please try again later',
        duration: 5000
      });
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Calculate percentage changes
  const calculatePercentageChange = (current: number, lastMonth: number) => {
    if (lastMonth === 0) return 0;
    return Math.round(((current - lastMonth) / lastMonth) * 100);
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
    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
  };

  // Get current time greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {getTimeGreeting()}, {user?.firstName || 'there'}! 👋
            </h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
      </div>
      
          {/* Profile Section */}
          <Card className="border-primary/20 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  {user?.authMethod === 'linkedin' && linkedInProfile?.profileImage ? (
                    <AvatarImage src={linkedInProfile.profileImage} alt={linkedInProfile.name || user?.firstName} />
                  ) : user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={getUserFullName()} />
                  ) : (
                    <AvatarFallback className="bg-primary text-white">{getUserInitials()}</AvatarFallback>
                  )}
                </Avatar>
              <div>
                  <h3 className="font-semibold text-gray-900">
                    {user?.authMethod === 'linkedin' && linkedInProfile?.name ? 
                      linkedInProfile.name : 
                      getUserFullName()}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    {user?.authMethod === 'linkedin' ? (
                      <><Linkedin className="h-3 w-3 text-primary" /> LinkedIn</>
                    ) : (
                      <><User className="h-3 w-3 text-primary" /> Member</>
                    )}
                  </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Total Posts */}
          <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-blue-700">Total Posts</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">{dashboardData.totalPosts}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUp className="h-3 w-3 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">
                      All your content
                    </span>
                  </div>
              </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
          {/* AI Generated Content */}
          <Card className="border-primary/20 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-purple-700">AI Content</p>
                  <h3 className="text-2xl font-bold text-purple-900 mt-1">{dashboardData.aiGeneratedContent}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span className="text-sm text-amber-600 font-medium">
                      Posts & Videos
                    </span>
              </div>
            </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carousel Requests */}
          <Card className="border-primary/20 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Carousels</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">{dashboardData.carouselRequests}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <LayoutGrid className="h-3 w-3 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      {dashboardData.completedCarousels} completed
                    </span>
              </div>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <LayoutGrid className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

          {/* Scheduled Posts */}
          <Card className="border-primary/20 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Scheduled</p>
                  <h3 className="text-2xl font-bold text-orange-900 mt-1">{dashboardData.scheduledPosts}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-3 w-3 text-orange-600" />
                    <span className="text-sm text-orange-600 font-medium">
                      {dashboardData.draftPosts} drafts
                    </span>
              </div>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Calendar and Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Calendar */}
            <ScheduledPostsCalendar />
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-md transition-all duration-300 cursor-pointer group" 
                    onClick={() => navigate('/dashboard/post')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <PlusCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Create Post</h3>
                  <p className="text-sm text-gray-600">Write a new LinkedIn post</p>
            </CardContent>
          </Card>
          
              <Card className="border-primary/20 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate('/dashboard/request-carousel')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <LayoutGrid className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">AI Carousel</h3>
                  <p className="text-sm text-gray-600">Generate carousel posts</p>
            </CardContent>
          </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-teal-50 to-teal-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate('/dashboard/scraper')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Scrape Content</h3>
                  <p className="text-sm text-gray-600">Extract content from URLs</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Right Column - Stats and Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            
            {/* Post Status Breakdown */}
            <Card className="border-primary/20 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Post Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dashboardData.draftPosts}</div>
                    <div className="text-sm text-blue-700">Drafts</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{dashboardData.publishedPosts}</div>
                    <div className="text-sm text-green-700">Published</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Scheduled Posts</span>
                    <Badge variant="secondary">{dashboardData.scheduledPosts}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">AI Generated</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">{dashboardData.savedAiPosts}</Badge>
                    </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Video Transcripts</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">{dashboardData.videoTranscripts}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          
            {/* AI Tip of the Week */}
            <Card className="border-primary/20 bg-gradient-to-br from-amber-50 to-amber-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <span className="text-amber-900">Weekly AI Tip</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
                <h4 className="font-semibold text-amber-900 mb-2">{weeklyTip.title}</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {weeklyTip.content}
                </p>
                <div className="mt-3 pt-3 border-t border-amber-200">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Star className="h-4 w-4 mr-1" />
                    Get More Tips
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Carousel Status */}
            <Card className="border-primary/20 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Carousel Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{dashboardData.pendingCarousels}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Completed</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{dashboardData.completedCarousels}</span>
                </div>
                <div className="pt-2">
                <Button
                  variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => navigate('/dashboard/request-carousel')}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Request New Carousel
                </Button>
              </div>
            </CardContent>
          </Card>
          
            {/* LinkedIn Connection - Show if not connected */}
            {(!isLinkedInConnected && !loading.profile) && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/15">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Linkedin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">
                    Connect LinkedIn Account
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Link your LinkedIn profile to unlock advanced analytics and scheduling features.
                  </p>
                  <Button
                    onClick={handleConnectLinkedIn}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    Connect Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="border-primary/20 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Created new post</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <LayoutGrid className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Carousel completed</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Post scheduled</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                            </div>
                  </div>
              </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
