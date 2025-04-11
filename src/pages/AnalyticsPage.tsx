import React, { useState } from 'react';
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
  ArrowUpRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  
  // Sample analytics data for demonstration
  const overviewData = {
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
  
  const topPosts = [
    {
      id: '1',
      title: 'How We Increased Conversions by 300%',
      date: 'Apr 5, 2023',
      impressions: 8420,
      engagement: 743,
      engagementRate: 8.8,
      likes: 312,
      comments: 87,
      shares: 42
    },
    {
      id: '2',
      title: 'The Ultimate LinkedIn Profile Checklist',
      date: 'Mar 28, 2023',
      impressions: 7834,
      engagement: 952,
      engagementRate: 12.2,
      likes: 421,
      comments: 156,
      shares: 94
    },
    {
      id: '3',
      title: '5 Content Creation Tools Every Marketer Needs',
      date: 'Apr 12, 2023',
      impressions: 6342,
      engagement: 518,
      engagementRate: 8.2,
      likes: 231,
      comments: 64,
      shares: 38
    }
  ];
  
  // Generate chart data values for demonstration
  const generateChartData = (min: number, max: number, length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1) + min));
  };
  
  // Generate mock chart data
  const impressionsChart = {
    data: generateChartData(2000, 8000, 30),
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`)
  };
  
  const engagementChart = {
    data: generateChartData(100, 800, 30),
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`)
  };
  
  const followersChart = {
    data: generateChartData(2500, 2850, 30),
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
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-medium">Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{overviewData.totalImpressions.toLocaleString()}</div>
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
              <div className="text-2xl font-bold">{overviewData.totalEngagement.toLocaleString()}</div>
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
              <div className="text-2xl font-bold">{overviewData.totalFollowers.toLocaleString()}</div>
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
                {topPosts.map((post, index) => (
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
                          <div className="font-semibold mt-1">{post.impressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-neutral-medium">
                            <TrendingUp size={14} />
                            Engagement
                          </div>
                          <div className="font-semibold mt-1">{post.engagement.toLocaleString()}</div>
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
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                View All Posts
                <ChevronDown size={14} />
              </Button>
            </CardFooter>
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
    </div>
  );
};

export default AnalyticsPage; 