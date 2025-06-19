import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  BarChart3, 
  Users, 
  Folder, 
  FileText, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2,
  Video,
  Languages,
  MessageSquare 
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
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  newUsersToday: number;
  newContentToday: number;
  totalSavedVideos: number;
  videosWithTranscripts: number;
  newSavedVideosToday: number;
  transcriptPercentage: number;
  totalGeneratedContent: number;
  newGeneratedContentToday: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalContent: 0,
    newUsersToday: 0,
    newContentToday: 0,
    totalSavedVideos: 0,
    videosWithTranscripts: 0,
    newSavedVideosToday: 0,
    transcriptPercentage: 0,
    totalGeneratedContent: 0,
    newGeneratedContentToday: 0
  });
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [contentDistribution, setContentDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://api.brandout.ai/api"}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`
            }
          }
        );
        
        console.log("Dashboard data:", response.data);
        
        if (response.data && response.data.data) {
          const { users, content, youtube, generatedContent } = response.data.data;
          
          setStats({
            totalUsers: users.total || 0,
            activeUsers: users.active || 0,
            totalContent: content.total || 0,
            newUsersToday: users.newToday || 0,
            newContentToday: content.newToday || 0,
            totalSavedVideos: youtube?.totalSavedVideos || 0,
            videosWithTranscripts: youtube?.videosWithTranscripts || 0,
            newSavedVideosToday: youtube?.newToday || 0,
            transcriptPercentage: youtube?.transcriptPercentage || 0,
            totalGeneratedContent: generatedContent?.total || 0,
            newGeneratedContentToday: generatedContent?.newToday || 0
          });
          
          // Generate user growth data if not provided
          // In a real app, this would come from the API
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const currentMonth = new Date().getMonth();
          
          const growthData = months.map((month, i) => ({
            name: month,
            users: i <= currentMonth ? Math.floor(users.total * (i + 1) / (currentMonth + 1)) : null
          })).filter(item => item.users !== null);
          
          setUserGrowthData(growthData);
          
          // Generate content distribution data with YouTube videos and generated content
          const distribution = [
            { name: 'Carousels', value: content.totalCarousels || Math.floor(content.total * 0.3) },
            { name: 'Posts', value: content.totalPosts || Math.floor(content.total * 0.3) },
            { name: 'YouTube Videos', value: youtube?.totalSavedVideos || Math.floor(content.total * 0.2) },
            { name: 'Generated Content', value: generatedContent?.total || Math.floor(content.total * 0.2) }
          ];
          
          setContentDistribution(distribution);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  // Format date for the header
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          {/* <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard Overview</h1> */}
          <p className="text-gray-500 dark:text-gray-400">{formatDate()}</p>
        </div>
        <Tabs defaultValue="monthly" className="mt-4 md:mt-0" onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
                <div className="flex items-center text-sm mt-2">
                  <span className="flex items-center text-gray-600 dark:text-gray-400">
                    <span>Registered users</span>
                  </span>
                </div>
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
                <h3 className="text-2xl font-bold mt-1">{stats.activeUsers}</h3>
                <div className="flex items-center text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Last 30 days
                  </span>
                </div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Content</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalContent}</h3>
                <div className="flex items-center text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Posts & Carousels
                  </span>
                </div>
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">YouTube Videos</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalSavedVideos}</h3>
                <div className="flex items-center text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Saved videos
                  </span>
                </div>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <Video className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Second row - additional stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Video Transcripts</CardTitle>
            <CardDescription>YouTube videos with transcripts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Transcript coverage</p>
                  <p className="text-sm font-medium">{stats.transcriptPercentage}%</p>
                </div>
                <Progress value={stats.transcriptPercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">With Transcript</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.videosWithTranscripts}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">New Today</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.newSavedVideosToday}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>AI-generated from transcripts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Generated</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalGeneratedContent}</h3>
                </div>
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">New Today</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{stats.newGeneratedContentToday}</span>
                  {stats.newGeneratedContentToday > 0 && (
                    <ArrowUpRight className="h-4 w-4 ml-1 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Activity Today</CardTitle>
            <CardDescription>Content created in the last 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">New Users</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.newUsersToday}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">New Content</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.newContentToday}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">New Videos</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.newSavedVideosToday}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">New Generated</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.newGeneratedContentToday}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Registered users over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Content Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Types of content in the system</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {contentDistribution.map((entry, index) => (
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
    </div>
  );
};

export default Dashboard; 