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
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/Spinner';

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

const generateDummyPosts = (): Post[] => {
  const dummyPosts: Post[] = [];
  const topics = [
    "5 Ways to Boost Your LinkedIn Engagement",
    "Why Remote Work is Here to Stay",
    "The Future of AI in Marketing",
    "Top 10 Skills for 2023",
    "How Our Team Increased Productivity by 35%",
    "What I Learned from 10 Years in Tech",
    "Breaking Down Our Latest Product Launch"
  ];
  
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 3)); // posts from different days
    
    dummyPosts.push({
      id: `post-${i}`,
      text: topics[i % topics.length],
      created_at: date.toISOString(),
      public_metrics: {
        shares: Math.floor(Math.random() * 50) + 5,
        comments: Math.floor(Math.random() * 30) + 10,
        likes: Math.floor(Math.random() * 200) + 50,
        impressions: Math.floor(Math.random() * 3000) + 1000
      }
    });
  }
  
  return dummyPosts;
};

const generateDummyAnalytics = (): LinkedInAnalytics => {
  // Generate 30 days of data
  const days = 30;
  const impressionsData = Array.from({ length: days }, () => Math.floor(Math.random() * 6000) + 2000);
  const engagementData = Array.from({ length: days }, () => Math.floor(Math.random() * 700) + 100);
  const followersData = Array.from({ length: days }, (_, i) => 2500 + Math.floor(Math.random() * 50) + i * 10);
  
  // Generate labels (dates)
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  
  return {
    impressions: {
      data: impressionsData,
      labels,
      increase: 17.8,
      timeframe: '30 days'
    },
    engagement: {
      data: engagementData,
      labels,
      increase: 24.3,
      timeframe: '30 days'
    },
    followers: {
      data: followersData,
      labels,
      increase: 8.4,
      timeframe: '30 days'
    },
    summary: {
      totalImpressions: impressionsData.reduce((a, b) => a + b, 0),
      averageEngagement: 8.78,
      followerGrowth: 8.4,
      bestPerformingPost: {
        text: "5 Ways to Boost Your LinkedIn Engagement",
        impressions: 7823,
        engagement: 12.4
      }
    }
  };
};

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<LinkedInAnalytics | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  
  // Load fake data on mount
  useEffect(() => {
    const loadFakeData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Set fake data
      setRecentPosts(generateDummyPosts());
      setAnalyticsData(generateDummyAnalytics());
      
      setLoading(false);
      
      toast.success('Analytics data loaded successfully');
    };
    
    loadFakeData();
  }, []);
  
  // Format to display numbers
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      setRecentPosts(generateDummyPosts());
      setAnalyticsData(generateDummyAnalytics());
      setLoading(false);
      
      toast.success('Analytics data refreshed');
    }, 1000);
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
  
  // Overview data
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
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-neutral-dark">Loading analytics data...</p>
      </div>
    );
  }
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Impressions Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Eye size={14} className="mr-1" />
              Impressions
            </CardDescription>
            <CardTitle className="text-2xl">{formatNumber(overviewData.totalImpressions)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <div className="flex items-center text-green-600 mr-2">
                <ArrowUpRight size={14} className="mr-0.5" />
                {overviewData.impressionGrowth}%
              </div>
              <span className="text-neutral-medium">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Engagement Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <TrendingUp size={14} className="mr-1" />
              Engagement
            </CardDescription>
            <CardTitle className="text-2xl">{formatNumber(Math.round(overviewData.totalEngagement))}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <div className="flex items-center text-green-600 mr-2">
                <ArrowUpRight size={14} className="mr-0.5" />
                {overviewData.engagementGrowth}%
              </div>
              <span className="text-neutral-medium">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Followers Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Users size={14} className="mr-1" />
              Followers
            </CardDescription>
            <CardTitle className="text-2xl">{formatNumber(overviewData.totalFollowers)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <div className="flex items-center text-green-600 mr-2">
                <ArrowUpRight size={14} className="mr-0.5" />
                {overviewData.followerGrowth}%
              </div>
              <span className="text-neutral-medium">growth</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Engagement Rate Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <BarChart2 size={14} className="mr-1" />
              Engagement Rate
            </CardDescription>
            <CardTitle className="text-2xl">{overviewData.engagementRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm">
              <div className="flex items-center text-green-600 mr-2">
                <ArrowUpRight size={14} className="mr-0.5" />
                2.1%
              </div>
              <span className="text-neutral-medium">vs industry average</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Performance Overview</CardTitle>
              <Tabs defaultValue="impressions" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="impressions">Impressions</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="followers">Followers</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-gray-50 rounded-lg flex items-center justify-center">
              {/* This would be a chart component in a real app */}
              <div className="text-center p-6">
                <BarChart2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-neutral-medium">
                  Chart visualization would appear here
                </p>
                <p className="text-xs text-neutral-medium mt-2">
                  This is a demo with simulated data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Based on engagement rate</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={post.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{post.title}</h3>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      {post.engagementRate}%
                    </span>
                  </div>
                  
                  <div className="text-xs text-neutral-medium mb-3">
                    <Calendar className="inline-block h-3 w-3 mr-1" />
                    {post.date}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded p-2">
                      <div className="flex items-center justify-center text-neutral-medium mb-1">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span className="text-xs">Likes</span>
                      </div>
                      <p className="font-medium">{post.likes}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-2">
                      <div className="flex items-center justify-center text-neutral-medium mb-1">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        <span className="text-xs">Comments</span>
                      </div>
                      <p className="font-medium">{post.comments}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-2">
                      <div className="flex items-center justify-center text-neutral-medium mb-1">
                        <Share2 className="h-3 w-3 mr-1" />
                        <span className="text-xs">Shares</span>
                      </div>
                      <p className="font-medium">{post.shares}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="outline" size="sm" className="w-full">
              View All Posts
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Best Posting Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Best Time to Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Best Day</p>
                    <p className="text-sm text-neutral-medium">{overviewData.bestDayToPost}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">+32%</p>
                  <p className="text-xs text-neutral-medium">higher engagement</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Best Time</p>
                    <p className="text-sm text-neutral-medium">{overviewData.bestTimeToPost}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">+27%</p>
                  <p className="text-xs text-neutral-medium">higher engagement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Audience Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audience Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center">
                <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-neutral-medium">
                  Audience demographic chart
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-medium">Technology</span>
                <span className="font-medium">31%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-medium">Marketing</span>
                <span className="font-medium">24%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-medium">Finance</span>
                <span className="font-medium">18%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-medium">Others</span>
                <span className="font-medium">27%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Content Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="font-medium">AI in Marketing</h3>
                </div>
                <p className="text-sm text-neutral-medium">
                  Content about AI in marketing is getting 42% more engagement
                </p>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Carousel Posts</h3>
                </div>
                <p className="text-sm text-neutral-medium">
                  Carousels receive 3x more engagement than single image posts
                </p>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="font-medium">How-to Content</h3>
                </div>
                <p className="text-sm text-neutral-medium">
                  Tutorial content gets 27% more saves and shares
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage; 