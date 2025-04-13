import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Calendar,
  FileText,
  Layers,
  Download,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronDown,
  Clock,
  ArrowUpRight,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<LinkedInAnalytics | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [usingSampleData, setUsingSampleData] = useState(false);
  
  // Fetch LinkedIn analytics data
  useEffect(() => {
    if (user?.id && token) {
      fetchLinkedInData();
    }
  }, [user, token]);
  
  // Function to fetch LinkedIn data from our API
  const fetchLinkedInData = async () => {
    setLoading(true);
    setError(null);
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    try {
      // Fetch analytics data
      const analyticsResponse = await axios.get(`${apiBaseUrl}/linkedin/analytics`, { headers });
      
      // Fetch recent posts for top posts section
      const postsResponse = await axios.get(`${apiBaseUrl}/linkedin/posts`, { headers });
      
      // Set analytics data
      setAnalyticsData(analyticsResponse.data.data);
      
      // Check if using sample data and show notification
      if (analyticsResponse.data.usingRealData === false) {
        console.warn('Using sample LinkedIn analytics data:', analyticsResponse.data.error);
        setUsingSampleData(true);
        
        let errorMessage = 'Using sample LinkedIn analytics data';
        let errorDescription = analyticsResponse.data.errorDetails || 'LinkedIn API limitations prevent loading real analytics.';
        
        // Customize message based on error type
        if (analyticsResponse.data.errorType === 'token_expired') {
          errorMessage = 'LinkedIn access token expired';
          errorDescription = 'Please reconnect your LinkedIn account to refresh your access.';
        } else if (analyticsResponse.data.errorType === 'permission_denied') {
          errorMessage = 'LinkedIn permission denied';
          errorDescription = 'Analytics features require additional permissions. Try reconnecting.';
        }
        
        toast.warning(errorMessage, {
          description: errorDescription,
          duration: 5000
        });
      } else if (analyticsResponse.data.usingRealData === true) {
        setUsingSampleData(false);
        toast.success('Successfully loaded LinkedIn analytics', {
          description: 'Displaying your real LinkedIn data.',
          duration: 3000
        });
      }
      
      // Set posts data
      setRecentPosts(postsResponse.data.data);
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching LinkedIn data:', err);
      setError(err.response?.data?.message || 'Failed to load LinkedIn analytics');
      setLoading(false);
      
      toast.error('Failed to load LinkedIn analytics', {
        description: err.response?.data?.message || 'Please try again later',
        duration: 5000
      });
    }
  };
  
  // Format to display numbers
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchLinkedInData();
  };
  
  // Convert recentPosts to topPosts format
  const topPosts = recentPosts.slice(0, 3).map(post => ({
    id: post.id,
    title: post.text.length > 60 ? post.text.substring(0, 60) + '...' : post.text,
    date: new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    impressions: post.public_metrics.impressions,
    engagement: post.public_metrics.likes + post.public_metrics.comments + post.public_metrics.shares,
    engagementRate: Math.round(((post.public_metrics.likes + post.public_metrics.comments + post.public_metrics.shares) / post.public_metrics.impressions) * 1000) / 10,
    likes: post.public_metrics.likes,
    comments: post.public_metrics.comments,
    shares: post.public_metrics.shares
  }));
  
  // If no data has been loaded yet, show fallback overview data
  const overviewData = analyticsData ? {
    totalImpressions: analyticsData.summary.totalImpressions,
    impressionGrowth: analyticsData.impressions.increase,
    totalEngagement: analyticsData.summary.averageEngagement * analyticsData.summary.totalImpressions / 100,
    engagementGrowth: analyticsData.engagement.increase,
    totalFollowers: analyticsData.followers.data[analyticsData.followers.data.length - 1],
    followerGrowth: analyticsData.followers.increase,
    engagementRate: analyticsData.summary.averageEngagement,
    impressionsPerPost: Math.round(analyticsData.summary.totalImpressions / Math.max(recentPosts.length, 1)),
    bestDayToPost: 'Wednesday',
    bestTimeToPost: '10-11 AM'
  } : {
    totalImpressions: 42340,
    impressionGrowth: 17.8,
    totalEngagement: 3720,
    engagementGrowth: 24.3,
    totalFollowers: 2845,
    followerGrowth: 8.4,
    engagementRate: 8.78,
    impressionsPerPost: 3528,
    bestDayToPost: 'Wednesday',
    bestTimeToPost: '10-11 AM'
  };
  
  const impressionsChart = analyticsData ? {
    data: analyticsData.impressions.data,
    labels: analyticsData.impressions.labels
  } : {
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 6000) + 2000),
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`)
  };
  
  const engagementChart = analyticsData ? {
    data: analyticsData.engagement.data,
    labels: analyticsData.engagement.labels
  } : {
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 700) + 100),
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`)
  };
  
  const followersChart = analyticsData ? {
    data: analyticsData.followers.data,
    labels: analyticsData.followers.labels
  } : {
    data: Array.from({ length: 30 }, (_, i) => 2500 + Math.floor(Math.random() * 50) + i * 10),
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`)
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-black">LinkedIn Analytics</h1>
        
        <div className="flex items-center gap-3">
          <Select 
            value={timeRange} 
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw size={16} className="mr-1" />
            )}
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-neutral-medium">Loading LinkedIn analytics...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Sample data notice */}
      {usingSampleData && !loading && !error && (
        <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
          <div className="flex flex-col w-full">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-600 mt-0.5" />
              <AlertDescription className="text-amber-600">
                Displaying sample LinkedIn analytics data. Your LinkedIn access token may have expired.
              </AlertDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 ml-6 self-start text-xs border-amber-200 text-amber-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-300"
              onClick={() => {
                // Get the backend URL from environment variable or fallback to Render deployed URL
                const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
                const baseUrl = baseApiUrl.replace('/api', '');
                
                // Store current URL in localStorage to redirect back after LinkedIn connection
                localStorage.setItem('redirectAfterAuth', '/analytics');
                
                // Redirect to LinkedIn OAuth endpoint
                window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
              }}
            >
              Reconnect LinkedIn
            </Button>
          </div>
        </Alert>
      )}
      
      {/* Main content - only show when not loading and no errors */}
      {!loading && !error && (
        <>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-medium">Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{formatNumber(overviewData.totalImpressions)}</div>
              <div className="flex items-center text-xs text-accent">
                <ArrowUpRight size={14} className="mr-1" />
                {overviewData.impressionGrowth}%
              </div>
            </div>
            
            <div className="mt-4 h-10 relative">
              {/* Simple sparkline visualization */}
              <div className="absolute inset-0 flex items-end">
                {impressionsChart.data.slice(-10).map((value, index) => (
                  <div 
                    key={index} 
                    className="flex-1 mx-0.5"
                    style={{ height: `${(value / Math.max(...impressionsChart.data.slice(-10))) * 100}%` }}
                  >
                    <div 
                      className="w-full h-full rounded-t-sm bg-gradient-to-t from-primary-500/40 to-primary-light/40"
                      style={{ opacity: 0.5 + ((index + 1) / 10) * 0.5 }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-medium">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{formatNumber(Math.round(overviewData.totalEngagement))}</div>
              <div className="flex items-center text-xs text-accent">
                <ArrowUpRight size={14} className="mr-1" />
                {overviewData.engagementGrowth}%
              </div>
            </div>
            
            <div className="mt-4 h-10 relative">
              <div className="absolute inset-0 flex items-end">
                {engagementChart.data.slice(-10).map((value, index) => (
                  <div 
                    key={index} 
                    className="flex-1 mx-0.5"
                    style={{ height: `${(value / Math.max(...engagementChart.data.slice(-10))) * 100}%` }}
                  >
                    <div 
                      className="w-full h-full rounded-t-sm bg-gradient-to-t from-secondary-500/40 to-secondary-light/40"
                      style={{ opacity: 0.5 + ((index + 1) / 10) * 0.5 }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-medium">Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{formatNumber(overviewData.totalFollowers)}</div>
              <div className="flex items-center text-xs text-accent">
                <ArrowUpRight size={14} className="mr-1" />
                {overviewData.followerGrowth}%
              </div>
            </div>
            
            <div className="mt-4 h-10 relative">
              <div className="absolute inset-0 flex items-end">
                {followersChart.data.slice(-10).map((value, index) => (
                  <div 
                    key={index} 
                    className="flex-1 mx-0.5"
                    style={{ height: `${(value / Math.max(...followersChart.data.slice(-10))) * 100}%` }}
                  >
                    <div 
                      className="w-full h-full rounded-t-sm bg-gradient-to-t from-accent-500/40 to-accent-light/40"
                      style={{ opacity: 0.5 + ((index + 1) / 10) * 0.5 }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{overviewData.engagementRate}%</div>
              <div className="flex items-center text-xs text-neutral-medium">
                Avg per post
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-neutral-medium">
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-primary mb-1">{overviewData.impressionsPerPost}</div>
                <div>Impressions/Post</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-primary mb-1">{overviewData.bestDayToPost}</div>
                <div>Best Day</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold text-primary mb-1">{overviewData.bestTimeToPost}</div>
                <div>Best Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for detailed analytics */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="mb-8">
          <TabsTrigger value="overview" className="flex gap-2 items-center">
            <Layers size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex gap-2 items-center">
            <FileText size={16} />
            Posts
          </TabsTrigger>
          <TabsTrigger value="followers" className="flex gap-2 items-center">
            <Users size={16} />
            Followers
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Impressions Over Time</CardTitle>
                <CardDescription>
                  Total number of times your content has been viewed
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-neutral-lightest/50">
                {/* Placeholder for actual chart */}
                <div className="text-neutral-medium">
                  Impressions Chart
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
                <CardDescription>
                  Distribution of interactions with your content
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-neutral-lightest/50">
                {/* Placeholder for actual chart */}
                <div className="text-neutral-medium">
                  Engagement Chart
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>
                Posts with the highest engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                    {topPosts.length === 0 ? (
                      <div className="text-center py-8 text-neutral-medium">
                        No posts data available
                      </div>
                    ) : (
                      topPosts.map((post, index) => (
                  <div key={post.id} className={`flex flex-col md:flex-row gap-4 ${index !== topPosts.length - 1 ? 'pb-6 border-b' : ''}`}>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{post.title}</h3>
                      <div className="flex items-center text-xs text-neutral-medium gap-2 mb-3">
                        <Clock size={14} />
                        <span>{post.date}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-1 text-neutral-medium">
                            <Eye size={14} />
                            Impressions
                          </div>
                                <div className="font-semibold mt-1">{formatNumber(post.impressions)}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-neutral-medium">
                            <TrendingUp size={14} />
                            Engagement
                          </div>
                                <div className="font-semibold mt-1">{formatNumber(post.engagement)}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-neutral-medium">
                            <BarChart2 size={14} />
                            Rate
                          </div>
                          <div className="font-semibold mt-1">{post.engagementRate}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2">
                      <div className="flex items-center gap-1 text-neutral-medium text-sm">
                        <ThumbsUp size={14} />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-medium text-sm">
                        <MessageCircle size={14} />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-medium text-sm">
                        <Share2 size={14} />
                        <span>{post.shares}</span>
                      </div>
                    </div>
                  </div>
                      ))
                    )}
              </div>
            </CardContent>
                {topPosts.length > 0 && (
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                View All Posts
                <ChevronDown size={14} />
              </Button>
            </CardFooter>
                )}
          </Card>
        </TabsContent>
        
        <TabsContent value="followers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
                <CardDescription>
                  New followers over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-neutral-lightest/50">
                {/* Placeholder for actual chart */}
                <div className="text-neutral-medium">
                  Follower Growth Chart
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Follower Demographics</CardTitle>
                <CardDescription>
                  Breakdown of your audience
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-neutral-lightest/50">
                {/* Placeholder for actual chart */}
                <div className="text-neutral-medium">
                  Demographics Chart
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage; 