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
  totalPosts: number;
  impressions: number;
  verified: boolean;
  summary: string;
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
  const { user, token, fetchUser, isAuthReady } = useAuth(); // Add isAuthReady
  
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
  
  // Add state for showing LinkedIn prompt
  const [showLinkedInPrompt, setShowLinkedInPrompt] = useState<boolean>(
    user?.authMethod === 'google' && !user?.linkedinConnected
  );
  
  // Generate a LinkedIn username based on user's name
  const [linkedInUsername, setLinkedInUsername] = useState<string>('');

  // Weekly AI tip
  const [weeklyTip] = useState({
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

  // Cache key for dashboard data
  const DASHBOARD_CACHE_KEY = `dashboard_data_${user?.id || 'guest'}`;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Effect to handle initial auth check and LinkedIn status
  useEffect(() => {
    if (!user && !token) {
      navigate('/');
    }
    
    // Initialize LinkedIn connection status from localStorage or user data
    const storedLinkedInStatus = localStorage.getItem('linkedinConnected');
    const userLinkedInStatus = user?.linkedinConnected;
    
    console.log('Dashboard - Initial LinkedIn status check:', {
      storedLinkedInStatus,
      userLinkedInStatus,
      userAuthMethod: user?.authMethod,
      userId: user?.id
    });
    
    if (storedLinkedInStatus === 'true' || userLinkedInStatus) {
      console.log('Dashboard - Setting LinkedIn as connected on initial check');
      setIsLinkedInConnected(true);
      setShowLinkedInPrompt(false);
    }
  }, [user, token, navigate]);

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

  // Add effect to check LinkedIn connection status on mount and URL params
  useEffect(() => {
    const checkLinkedInConnection = async () => {
      // Check URL parameters for successful LinkedIn connection
      const urlParams = new URLSearchParams(window.location.search);
      const linkedInConnectedParam = urlParams.get('linkedin_connected') || urlParams.get('linkedin');
      
      if (linkedInConnectedParam === 'true' || linkedInConnectedParam === 'connected') {
        // Clear the URL parameter
        window.history.replaceState({}, '', window.location.pathname);
        
        try {
          console.log('Dashboard - LinkedIn connection detected from URL params');
          
          // Force refresh user data from backend to get updated LinkedIn status
          const updatedUser = await fetchUser(true);
          
          if (updatedUser) {
            console.log('Dashboard - Updated user data:', { 
              linkedinConnected: updatedUser.linkedinConnected,
              authMethod: updatedUser.authMethod 
            });
            
            // Update local states based on server data
            if (updatedUser.linkedinConnected) {
              setIsLinkedInConnected(true);
              setShowLinkedInPrompt(false);
              localStorage.setItem('linkedinConnected', 'true');
              
              // Show success toast
              toast.success('LinkedIn connected successfully!');
              
              // Refresh LinkedIn data to get the updated profile
              fetchLinkedInData();
            }
          }
        } catch (error) {
          console.error('Error updating user data:', error);
          toast.error('Failed to update LinkedIn connection status');
        }
      }
      
      // Also check localStorage for persisted LinkedIn connection status
      const storedLinkedInStatus = localStorage.getItem('linkedinConnected');
      console.log('Dashboard - Checking stored LinkedIn status:', {
        storedLinkedInStatus,
        userLinkedInConnected: user?.linkedinConnected,
        userAuthMethod: user?.authMethod,
        isLinkedInConnected
      });
      
      if (storedLinkedInStatus === 'true' || user?.linkedinConnected) {
        console.log('Dashboard - Setting LinkedIn as connected from localStorage or user data');
        setIsLinkedInConnected(true);
        setShowLinkedInPrompt(false);
      }
    };

    checkLinkedInConnection();
  }, [user, navigate, fetchUser]);

  // Update the existing fetchLinkedInData function to handle connection status
  const fetchLinkedInData = async () => {
    setLoading({ profile: true });
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
    const token = localStorage.getItem('google-login-token') || localStorage.getItem('linkedin-login-token');
    
    if (!token) {
      setLoading({ profile: false });
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      // First check user's LinkedIn connection status
      const userResponse = await axios.get(`${apiBaseUrl}/auth/me`, { headers });
      const userData = userResponse.data?.data;

      if (userData?.linkedinConnected) {
        setIsLinkedInConnected(true);
        setShowLinkedInPrompt(false);
      }

      // Then try to fetch LinkedIn profile data
      const basicProfileRes = await axios.get(`${apiBaseUrl}/linkedin/basic-profile`, { headers });
      if (basicProfileRes.data?.data) {
        setLinkedInProfile(basicProfileRes.data.data);
        setIsLinkedInConnected(true);
        setShowLinkedInPrompt(false);
      }
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
      // Only show error for LinkedIn users or if explicitly connected
      if (user?.authMethod === 'linkedin' || user?.linkedinConnected) {
        toast.error('Failed to load LinkedIn profile');
      }
      // For Google users who haven't connected LinkedIn yet, show the prompt
      if (user?.authMethod === 'google' && !user?.linkedinConnected) {
        setShowLinkedInPrompt(true);
      }
    } finally {
      setLoading({ profile: false });
    }
  };

  // Fetch dashboard data with caching
  const fetchDashboardData = async () => {
    try {
      // Check cache first
      const cachedData = localStorage.getItem(DASHBOARD_CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setDashboardData(data);
          return;
        }
      }

      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch all data in parallel, including generated content
      const [postsResponse, carouselRequestsResponse, carouselsResponse, generatedContentResponse] = await Promise.all([
        axios.get(`${apiBaseUrl}/posts`, { headers }),
        axios.get(`${apiBaseUrl}/carousels/user/requests`, { headers }),
        axios.get(`${apiBaseUrl}/carousels`, { headers }),
        axios.get(`${apiBaseUrl}/carousel-contents?userId=${user?.id || 'anonymous'}`, { headers }).catch(() => ({ data: { data: [] } }))
      ]);

      const posts = postsResponse.data.data || [];
      const carouselRequests = carouselRequestsResponse.data.data || [];
      const carousels = carouselsResponse.data.data || [];
      const generatedContents = generatedContentResponse.data.data || [];
      
      // Get saved videos from localStorage
      const savedVideos = JSON.parse(localStorage.getItem('savedYoutubeVideos') || '[]');

      // Calculate AI generated content properly
      // Count actual generated content from CarouselContent model
      const aiGeneratedContent = generatedContents.length;
      
      // Count posts that are explicitly marked as AI generated
      const savedAiPosts = posts.filter(post => {
        return post.isAI === true || post.aiGenerated === true || post.generatedFromAI === true;
      }).length;

      const videoTranscripts = savedVideos.filter(video => 
        video.transcript && video.transcript.length > 0
      ).length;

      // Total AI content includes generated content + AI posts (not transcripts, as they're just source material)
      const totalAiContent = aiGeneratedContent + savedAiPosts;

      const pendingRequests = carouselRequests.filter(request => 
        request.status === 'pending' || request.status === 'in_progress'
      ).length;
      
      const completedRequests = carouselRequests.filter(request => 
        request.status === 'completed'
      ).length;

      const newDashboardData = {
        totalPosts: posts.length,
        draftPosts: posts.filter(post => post.status === 'draft').length,
        scheduledPosts: posts.filter(post => post.status === 'scheduled').length,
        publishedPosts: posts.filter(post => post.status === 'published').length,
        aiGeneratedContent: totalAiContent,
        savedAiPosts: aiGeneratedContent, // Show generated content count instead of AI keyword search
        videoTranscripts,
        carouselRequests: carouselRequests.length,
        pendingCarousels: pendingRequests,
        completedCarousels: completedRequests,
        carouselContent: carousels.length,
        lastMonthStats: {
          totalPosts: posts.filter(post => {
            const postDate = new Date(post.createdAt);
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return postDate >= lastMonth;
          }).length,
          aiGeneratedContent: totalAiContent,
          carouselRequests: carouselRequests.filter(req => {
            const reqDate = new Date(req.createdAt);
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return reqDate >= lastMonth;
          }).length
        }
      };

      // Update state and cache
      setDashboardData(newDashboardData);
      localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify({
        data: newDashboardData,
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch data on mount and when dependencies change - UPDATED TO USE isAuthReady
  useEffect(() => {
    if (isAuthReady && token && user?.id) {
      // Clear cache to ensure fresh data after the fix
      localStorage.removeItem(DASHBOARD_CACHE_KEY);
      fetchDashboardData();
    }
  }, [isAuthReady, token, user?.id]); // Add isAuthReady and user?.id as dependencies

  // Fetch LinkedIn data when user LinkedIn connection status changes - UPDATED TO USE isAuthReady
  useEffect(() => {
    if (isAuthReady && user?.linkedinConnected && token) {
      fetchLinkedInData();
    }
  }, [isAuthReady, user?.linkedinConnected, token]); // Add isAuthReady as dependency

  // Update LinkedIn connection state when user data changes
  useEffect(() => {
    if (user) {
      const isConnected = user.authMethod === 'linkedin' || user.linkedinConnected || !!user.linkedinId;
      setIsLinkedInConnected(isConnected);
      
      // Hide the prompt if user is connected
      if (isConnected) {
        setShowLinkedInPrompt(false);
      } else if (user.authMethod === 'google') {
        setShowLinkedInPrompt(true);
      }
    }
  }, [user]);

  // Calculate percentage changes
  const calculatePercentageChange = (current: number, lastMonth: number) => {
    if (lastMonth === 0) return 0;
    return Math.round(((current - lastMonth) / lastMonth) * 100);
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    
    // Prioritize LinkedIn profile data if available and connected
    if (user.linkedinConnected && linkedInProfile?.name) {
      const nameParts = linkedInProfile.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    
    // Fall back to user data
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserFullName = () => {
    if (!user) return 'User';
    
    // Prioritize LinkedIn profile data if available and connected
    if (user.linkedinConnected && linkedInProfile?.name) {
      return linkedInProfile.name;
    }
    
    // Fall back to user data
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim();
  };

  const getUserProfilePicture = () => {
    // Prioritize LinkedIn profile picture if connected and available
    if (user?.linkedinConnected && linkedInProfile?.profileImage) {
      return linkedInProfile.profileImage;
    }
    
    // Fall back to user's stored profile picture
    return user?.profilePicture;
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

  const handleLinkedInConnect = () => {
    // Get the backend URL from environment variable or fallback to production URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
    
    // Store current URL in localStorage to redirect back after LinkedIn connection
    localStorage.setItem('redirectAfterAuth', '/dashboard');
    
    // Store that this is a LinkedIn connection attempt from a Google user
    localStorage.setItem('linkedin-login-type', 'google_connect');
    
    // Redirect to LinkedIn OAuth endpoint with connection type
    window.location.href = `${baseApiUrl}/auth/linkedin-direct?type=google_connect&googleUserId=${user?.id}`;
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
              {getTimeGreeting()}, {user?.linkedinConnected && linkedInProfile?.name ? linkedInProfile.name.split(' ')[0] : user?.firstName || 'there'}! 👋
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
                  {getUserProfilePicture() ? (
                    <AvatarImage src={getUserProfilePicture()} alt={getUserFullName()} />
                  ) : (
                <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">{getUserInitials()}</AvatarFallback>
                  )}
                </Avatar>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{getUserFullName()}</p>
              {(!user?.linkedinConnected && !isLinkedInConnected && localStorage.getItem('linkedinConnected') !== 'true' && user?.authMethod !== 'linkedin') ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                  onClick={handleLinkedInConnect}
                >
                  <Linkedin className="h-3 w-3 mr-1" />
                  Connect LinkedIn
                </Button>
              ) : (
                <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                    {(user?.authMethod === 'linkedin' || user?.linkedinConnected || isLinkedInConnected || localStorage.getItem('linkedinConnected') === 'true') ? (
                  <><Linkedin className="h-3 w-3 text-blue-600" /> Connected</>
                    ) : (
                    <><User className="h-3 w-3" /> Google User</>
                    )}
                  </p>
              )}
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
                  <AreaChart data={monthlyPostData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                      padding={{ left: 10, right: 10 }}
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
                    Generated Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Generated Content</span>
                      <span className="font-semibold text-green-600">{dashboardData.savedAiPosts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Video Transcripts</span>
                      <span className="font-semibold text-blue-600">{dashboardData.videoTranscripts}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                        style={{ width: `${Math.min((dashboardData.aiGeneratedContent / 100) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {dashboardData.aiGeneratedContent} total AI content pieces
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
                {(!user?.linkedinConnected && !isLinkedInConnected && localStorage.getItem('linkedinConnected') !== 'true' && user?.authMethod !== 'linkedin') ? (
                  <div className="text-center py-6">
                    <Linkedin className="h-12 w-12 text-blue-600/20 mx-auto mb-3" />
                    <h3 className="text-sm font-medium mb-2">Connect Your LinkedIn Account</h3>
                    <p className="text-xs text-gray-500 mb-4">Link your LinkedIn profile to publish content directly</p>
                    <Button 
                      onClick={handleLinkedInConnect}
                      className="gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      Connect LinkedIn
                    </Button>
                  </div>
                ) : (user?.linkedinConnected || user?.authMethod === 'linkedin' || isLinkedInConnected || localStorage.getItem('linkedinConnected') === 'true') ? (
                  <>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    {getUserProfilePicture() ? (
                      <AvatarImage src={getUserProfilePicture()} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">{getUserInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {getUserFullName()}
                    </p>
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-3 w-3 text-blue-600" />
                      <p className="text-xs text-green-600 font-medium">Connected</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{linkedInProfile?.connections || '0+'}</p>
                    <p className="text-xs text-gray-600">Connections</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{linkedInProfile?.followers || '0+'}</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{linkedInProfile?.totalPosts || '0'}</p>
                    <p className="text-xs text-gray-600">Posts</p>
                  </div>
                </div>

                {linkedInProfile?.impressions > 0 && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-gray-700">{linkedInProfile.impressions.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Total Impressions</p>
                  </div>
                )}

                {linkedInProfile?.bio && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="line-clamp-2">{linkedInProfile.bio}</p>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Joined {linkedInProfile?.joinedDate || 'Recently'}</span>
                  <a 
                    href={linkedInProfile?.url || `https://linkedin.com/in/${linkedInProfile?.username || ''}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Linkedin className="h-12 w-12 text-blue-600/20 mx-auto mb-3" />
                    <h3 className="text-sm font-medium mb-2">Connect Your LinkedIn Account</h3>
                    <p className="text-xs text-gray-500 mb-4">Link your LinkedIn profile to publish content directly</p>
                    <Button 
                      onClick={handleLinkedInConnect}
                      className="gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      Connect LinkedIn
                    </Button>
                  </div>
                )}
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
