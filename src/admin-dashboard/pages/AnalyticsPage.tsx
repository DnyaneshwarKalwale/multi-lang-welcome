import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart3,
  Users,
  FileText,
  Video,
  Languages,
  MessageSquare,
  Calendar,
  Clock,
  Loader2,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Percent,
  Copy,
  CreditCard,
  Layers,
  Check,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface AnalyticsData {
  youtube: {
    totalVideos: number;
    videosWithTranscripts: number;
    transcriptPercentage: number;
    languageDistribution: { name: string; value: number }[];
    videosByDate: { date: string; count: number }[];
    topChannels: { channel: string; count: number }[];
  };
  content: {
    total: number;
    byType: { type: string; count: number }[];
    generationTrend: { date: string; count: number }[];
    sourceDistribution: { source: string; count: number }[];
  };
  users: {
    total: number;
    active: number;
    newToday: number;
    engagement: { metric: string; value: number | string }[];
    videosByUser: { user: string; count: number }[];
    contentByUser: { user: string; count: number }[];
  };
  subscriptions: {
    totalRevenue: number;
    monthlyRevenue: number;
    planDistribution: { plan: string; count: number; revenue: number }[];
    revenueByDate: { date: string; amount: number }[];
    trialConversionRate: number;
  };
  carousel: {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    requestsByDate: { date: string; count: number }[];
  };
}

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    youtube: {
      totalVideos: 0,
      videosWithTranscripts: 0,
      transcriptPercentage: 0,
      languageDistribution: [],
      videosByDate: [],
      topChannels: [],
    },
    content: {
      total: 0,
      byType: [],
      generationTrend: [],
      sourceDistribution: [],
    },
    users: {
      total: 0,
      active: 0,
      newToday: 0,
      engagement: [],
      videosByUser: [],
      contentByUser: [],
    },
    subscriptions: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      planDistribution: [],
      revenueByDate: [],
      trialConversionRate: 0,
    },
    carousel: {
      totalRequests: 0,
      pendingRequests: 0,
      completedRequests: 0,
      requestsByDate: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("youtube");
  const [timeRange, setTimeRange] = useState("30days");
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Check if token exists
        const token = localStorage.getItem("admin-token");
        if (!token) {
          console.error("No admin token found. Please log in again.");
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please log in again to continue.",
          });
          setLoading(false);
          return;
        }
        
        console.log("Using API URL:", import.meta.env.VITE_API_URL || "https://api.brandout.ai/api");
        
        // Log request details for debugging
        console.log("Making dashboard request with timeRange:", timeRange);
        console.log("Using token:", token.substring(0, 10) + "...");
        
        // Get dashboard analytics from the API
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://api.brandout.ai/api"}/admin/dashboard?timeRange=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Get user limits (for subscription analysis)
        const userLimitsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://api.brandout.ai/api"}/user-limits/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Get all content
        const contentResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://api.brandout.ai/api"}/admin/content`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Get carousel requests
        const carouselRequestsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://api.brandout.ai/api"}/carousel-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Get saved videos with additional metrics
        const savedVideosResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://api.brandout.ai/api"}/admin/saved-videos/metrics`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Get subscription metrics
        const subscriptionMetricsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://api.brandout.ai/api"}/admin/subscriptions/metrics`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Extract data from responses
        const dashboardData = response.data?.data || {};
        const userLimitsData = userLimitsResponse.data?.data || [];
        const contentData = contentResponse.data?.data || [];
        const carouselRequests = carouselRequestsResponse.data?.data || [];
        const savedVideosMetrics = savedVideosResponse.data?.data || { languageDistribution: [], channelDistribution: [] };
        const subscriptionMetrics = subscriptionMetricsResponse.data?.data || { 
          revenueByDate: [], 
          planDistribution: [] 
        };
        
        console.log("Fetched real-time dashboard data:", dashboardData);
        
        // Process data for analytics display
          setAnalytics({
            youtube: {
            totalVideos: dashboardData.youtube?.totalSavedVideos || 0,
            videosWithTranscripts: dashboardData.youtube?.videosWithTranscripts || 0,
            transcriptPercentage: dashboardData.youtube?.transcriptPercentage || 0,
            languageDistribution: savedVideosMetrics.languageDistribution || [],
            videosByDate: savedVideosMetrics.videosByDate || [],
            topChannels: savedVideosMetrics.channelDistribution || [],
            },
            content: {
            total: dashboardData.content?.total || 0,
            byType: dashboardData.content?.byType || [],
            generationTrend: dashboardData.content?.generationTrend || [],
            sourceDistribution: dashboardData.content?.sourceDistribution || [],
            },
            users: {
            total: dashboardData.users?.total || 0,
            active: dashboardData.users?.active || 0,
            newToday: dashboardData.users?.newToday || 0,
            engagement: [
              { 
                metric: "Avg. Videos Saved", 
                value: dashboardData.users?.avgVideosSaved || "0" 
              },
              { 
                metric: "Avg. Content Generated", 
                value: dashboardData.users?.avgContentGenerated || "0" 
              },
              { 
                metric: "Retention Rate", 
                value: dashboardData.users?.retentionRate || "0%" 
              },
              { 
                metric: "Daily Active Users", 
                value: dashboardData.users?.active || 0 
              },
            ],
            videosByUser: dashboardData.users?.topVideoUsers || [],
            contentByUser: dashboardData.users?.topContentUsers || [],
          },
          subscriptions: {
            totalRevenue: subscriptionMetrics.totalRevenue || 0,
            monthlyRevenue: subscriptionMetrics.monthlyRevenue || 0,
            planDistribution: subscriptionMetrics.planDistribution || [],
            revenueByDate: subscriptionMetrics.revenueByDate || [],
            trialConversionRate: subscriptionMetrics.trialConversionRate || 0,
          },
          carousel: {
            totalRequests: dashboardData.carousel?.totalRequests || carouselRequests.length || 0,
            pendingRequests: dashboardData.carousel?.pendingRequests || 
              carouselRequests.filter(req => req.status === 'pending').length || 0,
            completedRequests: dashboardData.carousel?.completedRequests || 
              carouselRequests.filter(req => req.status === 'completed').length || 0,
            requestsByDate: dashboardData.carousel?.requestsByDate || [],
            },
          });
          
          setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Server error response:", error.response.status, error.response.data);
          
          if (error.response.status === 401) {
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "Your session has expired. Please log in again.",
            });
            // Clear the invalid token
            localStorage.removeItem("admin-token");
            // Redirect to login page after a delay
            setTimeout(() => {
              window.location.href = '/admin/login';
            }, 2000);
          } else if (error.response.status === 500) {
            toast({
              variant: "destructive",
              title: "Server Error",
              description: `The server encountered an error: ${error.response.data?.message || 'Internal server error'}. Please check the backend logs.`,
            });
            
            // Remove fallback data usage
            console.log("Error fetching analytics due to server error");
            setLoading(false);
          } else {
        toast({
          variant: "destructive",
          title: "Error",
              description: `Failed to load analytics data: ${error.response.data?.message || 'Server error'}`,
        });
            
            // Remove fallback data usage
        setLoading(false);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Unable to connect to the API server. Please check that your backend is running properly.",
          });
          
          // Remove fallback data usage
          setLoading(false);
        } else {
          // Something happened in setting up the request
          console.error("Request setup error:", error.message);
          toast({
            variant: "destructive",
            title: "Request Error",
            description: `Error making analytics request: ${error.message}`,
          });
          
          // Remove fallback data usage
          setLoading(false);
        }
      }
    };
    
    fetchAnalytics();
  }, [timeRange, toast]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading analytics data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          {/* <h1 className="text-3xl font-bold text-black dark:text-white">Analytics</h1> */}
          <p className="text-gray-500 dark:text-gray-400">
            Insights and statistics about your platform's usage
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant={timeRange === "7days" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7days")}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === "30days" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30days")}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === "90days" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90days")}
          >
            90 Days
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="youtube">
            <Video className="h-4 w-4 mr-2" />
            YouTube Videos
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Generated Content
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Engagement
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <CreditCard className="h-4 w-4 mr-2" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="carousel">
            <Layers className="h-4 w-4 mr-2" />
            Carousel Requests
          </TabsTrigger>
        </TabsList>
        
        {/* YouTube Videos Tab */}
        <TabsContent value="youtube" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Videos</p>
                    <h3 className="text-2xl font-bold mt-1">{analytics.youtube.totalVideos}</h3>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                    <Video className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">With Transcripts</p>
                    <h3 className="text-2xl font-bold mt-1">{analytics.youtube.videosWithTranscripts}</h3>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <Languages className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transcript Coverage</p>
                    <h3 className="text-2xl font-bold mt-1">{analytics.youtube.transcriptPercentage}%</h3>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <Percent className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Video Trend</p>
                    <div className="flex items-center mt-1">
                      <h3 className="text-2xl font-bold">+{analytics.youtube.videosByDate.slice(-3).reduce((sum, item) => sum + item.count, 0)}</h3>
                      <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Videos Saved Over Time</CardTitle>
                <CardDescription>Trend of video saving activity</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.youtube.videosByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Videos Saved"
                      stroke="#ff4d4f"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Channels</CardTitle>
                <CardDescription>Most popular YouTube channels</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.youtube.topChannels}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="channel" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Videos" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Transcript Languages</CardTitle>
              <CardDescription>Distribution of transcript languages</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.youtube.languageDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analytics.youtube.languageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col justify-center space-y-4">
                  {analytics.youtube.languageDistribution.map((lang, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <p className="text-sm font-medium">{lang.name}</p>
                        </div>
                        <p className="text-sm font-medium">{lang.value} videos</p>
                      </div>
                      <Progress
                        value={(lang.value / analytics.youtube.languageDistribution.reduce((sum, l) => sum + l.value, 0)) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Generated Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Content</p>
                    <h3 className="text-2xl font-bold mt-1">{analytics.content.total}</h3>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Carousels</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {analytics.content.byType.find(t => t.type === "Carousel")?.count || 0}
                    </h3>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <Copy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Posts</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {(analytics.content.byType.find(t => t.type === "Short Post")?.count || 0) +
                       (analytics.content.byType.find(t => t.type === "Long Post")?.count || 0)}
                    </h3>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Generation Trend</CardTitle>
                <CardDescription>Content generated over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.content.generationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Generated Content"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Type Distribution</CardTitle>
                <CardDescription>Breakdown by content type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.content.byType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.content.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Source Analysis</CardTitle>
              <CardDescription>Where generated content originates from</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.content.sourceDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Content Items" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* User Engagement Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.users.engagement.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.metric}</p>
                    <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                    <div className="flex items-center text-sm mt-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Platform average
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Users by Videos Saved</CardTitle>
                <CardDescription>Users with the most saved videos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.users.videosByUser.slice(0, 5).map((user, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                        <span className="font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.user}</p>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Videos saved</span>
                            <span>{user.count}</span>
                          </div>
                          <Progress value={(user.count / analytics.users.videosByUser[0].count) * 100} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Users by Content Generation</CardTitle>
                <CardDescription>Users generating the most content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.users.contentByUser.slice(0, 5).map((user, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                        <span className="font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.user}</p>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Content items</span>
                            <span>{user.count}</span>
                          </div>
                          <Progress value={(user.count / analytics.users.contentByUser[0].count) * 100} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Platform Activity</CardTitle>
              <CardDescription>Overall user engagement metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { 
                      name: "Active Users", 
                      videos: analytics.users.active || 0, 
                      content: analytics.content.total || 0 
                    },
                    { 
                      name: "New Users", 
                      videos: analytics.users.newToday || 0, 
                      content: analytics.content.generationTrend.slice(-1)[0]?.count || 0 
                    }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="videos" name="Saved Videos" fill="#0088FE" />
                  <Bar dataKey="content" name="Generated Content" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">${analytics.subscriptions.totalRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">${analytics.subscriptions.monthlyRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Subscriptions</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {analytics.subscriptions.planDistribution
                        .filter(plan => plan.plan !== 'Expired')
                        .reduce((sum, plan) => sum + plan.count, 0)}
                    </h3>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trial Conversion Rate</p>
                    <h3 className="text-2xl font-bold mt-1">{analytics.subscriptions.trialConversionRate.toFixed(1)}%</h3>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                    <Percent className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly subscription revenue trends</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.subscriptions.revenueByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      name="Revenue"
                      stroke="#10b981"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>Distribution of active subscription plans</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.subscriptions.planDistribution}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="plan" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}`, 'Subscribers']} />
                    <Legend />
                    <Bar dataKey="count" name="Subscribers" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Plan</CardTitle>
              <CardDescription>Revenue generated by each subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {analytics.subscriptions.planDistribution.map((plan, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <p className="text-sm font-medium">{plan.plan}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm font-medium">{plan.count} users</p>
                        <p className="text-sm font-bold">${plan.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                    <Progress
                      value={(plan.revenue / Math.max(1, analytics.subscriptions.totalRevenue)) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Carousel Requests Tab */}
        <TabsContent value="carousel" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Requests</p>
                    <h3 className="text-2xl font-bold mt-1">{analytics.carousel.totalRequests}</h3>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
                    <h3 className="text-2xl font-bold mt-1">{analytics.carousel.pendingRequests}</h3>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Requests</p>
                    <h3 className="text-2xl font-bold mt-1">{analytics.carousel.completedRequests}</h3>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Carousel Requests Over Time</CardTitle>
              <CardDescription>Number of carousel requests by date</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.carousel.requestsByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Requests" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage; 