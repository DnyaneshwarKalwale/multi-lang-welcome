import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, Sparkles, LayoutGrid, Calendar, PlusCircle, Zap,
  User, Linkedin, TrendingUp
} from "lucide-react";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ScheduledPostsCalendar from "@/components/ScheduledPostsCalendar";
import axios from "axios";
import { toast } from "sonner";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const { t } = useLanguage();
  const { user, token } = useAuth();
  
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
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
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
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
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
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Store current URL in localStorage to redirect back after LinkedIn connection
    localStorage.setItem('redirectAfterAuth', '/dashboard');
    
    // Redirect to LinkedIn OAuth endpoint
    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
  };

  // Sample data for charts based on real data
  const monthlyPostData = [
    { month: 'JAN', posts: Math.max(dashboardData.totalPosts - 8, 0) },
    { month: 'FEB', posts: Math.max(dashboardData.totalPosts - 5, 0) },
    { month: 'MAR', posts: Math.max(dashboardData.totalPosts - 3, 0) },
    { month: 'APR', posts: Math.max(dashboardData.totalPosts - 1, 0) },
    { month: 'MAY', posts: dashboardData.totalPosts },
    { month: 'JUN', posts: dashboardData.totalPosts + dashboardData.scheduledPosts }
  ];

  const aiContentData = [
    { month: 'JAN', ai: Math.max(dashboardData.aiGeneratedContent - 4, 0) },
    { month: 'FEB', ai: Math.max(dashboardData.aiGeneratedContent - 2, 0) },
    { month: 'MAR', ai: Math.max(dashboardData.aiGeneratedContent - 1, 0) },
    { month: 'APR', ai: dashboardData.aiGeneratedContent },
    { month: 'MAY', ai: dashboardData.aiGeneratedContent + 1 },
    { month: 'JUN', ai: dashboardData.aiGeneratedContent + 2 }
  ];

  const carouselProgressData = [
    { name: 'Completed', value: dashboardData.completedCarousels, color: '#10b981' },
    { name: 'Pending', value: dashboardData.pendingCarousels, color: '#3b82f6' },
    { name: 'In Progress', value: Math.max(dashboardData.carouselRequests - dashboardData.completedCarousels - dashboardData.pendingCarousels, 0), color: '#6b7280' }
  ];

  // Get current time greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Clean Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {getTimeGreeting()}, {user?.firstName || 'there'}! 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {user?.authMethod === 'linkedin' && linkedInProfile?.profileImage ? (
                <AvatarImage src={linkedInProfile.profileImage} alt={linkedInProfile.name || user?.firstName} />
              ) : user?.profilePicture ? (
                <AvatarImage src={user.profilePicture} alt={getUserFullName()} />
              ) : (
                <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">{getUserInitials()}</AvatarFallback>
              )}
            </Avatar>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{getUserFullName()}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {user?.authMethod === 'linkedin' ? (
                  <><Linkedin className="h-3 w-3 text-blue-600" /> Connected</>
                ) : (
                  <><User className="h-3 w-3" /> Member</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.totalPosts}</p>
                  <p className="text-sm text-gray-600">Total Posts</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.aiGeneratedContent}</p>
                  <p className="text-sm text-gray-600">AI Content</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.carouselRequests}</p>
                  <p className="text-sm text-gray-600">Carousels</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <LayoutGrid className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.scheduledPosts}</p>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Growth Chart */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Content Growth</CardTitle>
                    <p className="text-sm text-gray-500">Monthly posts trend</p>
                  </div>
                  <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +{Math.max(dashboardData.totalPosts - 5, 0)}% growth
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={monthlyPostData}>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="posts" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fill="url(#gradient)" 
                    />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* AI & Carousel Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    AI Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Generated Posts</span>
                      <span className="font-semibold text-green-600">{dashboardData.savedAiPosts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Video Transcripts</span>
                      <span className="font-semibold text-blue-600">{dashboardData.videoTranscripts}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                        style={{ width: `${Math.min((dashboardData.aiGeneratedContent / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-blue-600" />
                    Carousels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-semibold text-green-600">{dashboardData.completedCarousels}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">In Progress</span>
                      <span className="font-semibold text-blue-600">{dashboardData.pendingCarousels}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                        style={{ 
                          width: `${dashboardData.carouselRequests > 0 ? (dashboardData.completedCarousels / dashboardData.carouselRequests) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  LinkedIn Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    {user?.authMethod === 'linkedin' && linkedInProfile?.profileImage ? (
                      <AvatarImage src={linkedInProfile.profileImage} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">{getUserInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user?.authMethod === 'linkedin' && linkedInProfile?.name ? 
                        linkedInProfile.name : 
                        getUserFullName()}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {linkedInProfile?.location || 'Content Creator'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{linkedInProfile?.connections || 0}</p>
                    <p className="text-xs text-gray-600">Connections</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{linkedInProfile?.followers || 0}</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => navigate('/dashboard/post')}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PlusCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Create Post</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 border-green-200 hover:bg-green-50 hover:border-green-300"
                  onClick={() => navigate('/dashboard/request-carousel')}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <LayoutGrid className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">AI Carousel</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => navigate('/dashboard/scraper')}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Smart Extract</span>
                </Button>
              </CardContent>
            </Card>
            
            {/* Calendar */}
            <div className="lg:hidden">
              <ScheduledPostsCalendar />
            </div>
          </div>
        </div>

        {/* Calendar for larger screens */}
        <div className="hidden lg:block">
          <ScheduledPostsCalendar />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
