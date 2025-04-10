
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Calendar, 
  Download, 
  Share2,
  TrendingUp, 
  Users, 
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data
const engagementData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      name: "Engagement",
      data: [124, 231, 192, 342, 291, 164, 285],
      color: "#0077B5"
    }
  ]
};

const impressionsData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      name: "Impressions",
      data: [1240, 2310, 1920, 3420, 2910, 1640, 2850],
      color: "#00A0DC"
    }
  ]
};

const followerData = {
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  datasets: [
    {
      name: "Followers",
      data: [120, 145, 175, 235, 280, 310, 345],
      color: "#0A8542"
    }
  ]
};

const postData = [
  {
    id: 1,
    excerpt: "Just launched a new feature for our marketing analytics platform. Check it out!",
    date: "Oct 15",
    impressions: 4320,
    engagements: 287,
    engagement_rate: "6.6%",
    clicks: 154
  },
  {
    id: 2,
    excerpt: "Excited to share my thoughts on the future of AI in content marketing. #AIMarketing #ContentStrategy",
    date: "Oct 12",
    impressions: 5680,
    engagements: 421,
    engagement_rate: "7.4%",
    clicks: 212
  },
  {
    id: 3,
    excerpt: "5 tips for growing your professional network on LinkedIn that actually work:",
    date: "Oct 8",
    impressions: 8960,
    engagements: 715,
    engagement_rate: "8.0%",
    clicks: 347
  },
  {
    id: 4,
    excerpt: "What's the one skill you think every marketer should master in 2025? Comment below!",
    date: "Oct 5",
    impressions: 3240,
    engagements: 378,
    engagement_rate: "11.7%",
    clicks: 97
  }
];

const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState("7d");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const togglePostExpansion = (id: number) => {
    if (expandedPost === id) {
      setExpandedPost(null);
    } else {
      setExpandedPost(id);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your LinkedIn performance and engagement
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select defaultValue={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="posts" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              Posts
            </TabsTrigger>
            <TabsTrigger value="audience" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              Audience
            </TabsTrigger>
            <TabsTrigger value="competitors" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              Competitors
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-linkedin-blue" />
                    Impressions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">16,340</span>
                    <span className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      24%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs. previous period</p>
                  
                  <div className="h-36 mt-4">
                    {/* Simple chart visualization */}
                    <div className="h-full flex items-end gap-1">
                      {impressionsData.datasets[0].data.map((value, index) => (
                        <motion.div
                          key={index}
                          className="flex-1 bg-linkedin-blue/20 dark:bg-linkedin-blue/30 rounded-t"
                          style={{ height: `${(value / Math.max(...impressionsData.datasets[0].data)) * 100}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / Math.max(...impressionsData.datasets[0].data)) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      {impressionsData.labels.map((label, index) => (
                        <span key={index}>{label}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-linkedin-lightBlue" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">1,629</span>
                    <span className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      18%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs. previous period</p>
                  
                  <div className="h-36 mt-4">
                    {/* Simple chart visualization */}
                    <div className="h-full flex items-end gap-1">
                      {engagementData.datasets[0].data.map((value, index) => (
                        <motion.div
                          key={index}
                          className="flex-1 bg-linkedin-lightBlue/20 dark:bg-linkedin-lightBlue/30 rounded-t"
                          style={{ height: `${(value / Math.max(...engagementData.datasets[0].data)) * 100}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / Math.max(...engagementData.datasets[0].data)) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      {engagementData.labels.map((label, index) => (
                        <span key={index}>{label}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-linkedin-green" />
                    Followers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">345</span>
                    <span className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      11%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs. previous period</p>
                  
                  <div className="h-36 mt-4">
                    {/* Simple chart visualization */}
                    <div className="h-full flex items-end gap-1">
                      {followerData.datasets[0].data.map((value, index) => (
                        <motion.div
                          key={index}
                          className="flex-1 bg-linkedin-green/20 dark:bg-linkedin-green/30 rounded-t"
                          style={{ height: `${(value / Math.max(...followerData.datasets[0].data)) * 100}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / Math.max(...followerData.datasets[0].data)) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      {followerData.labels.map((label, index) => (
                        <span key={index}>{label}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Analytics Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Best Performing Post</p>
                    <p className="font-medium mt-1 line-clamp-2 text-sm">5 tips for growing your professional network on LinkedIn that actually work</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span className="flex items-center mr-3">
                        <Eye className="h-3 w-3 mr-1" /> 8,960
                      </span>
                      <span className="flex items-center">
                        <Share2 className="h-3 w-3 mr-1" /> 715
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Optimal Posting Time</p>
                    <p className="font-medium mt-1">Tuesday, 9:00 AM</p>
                    <p className="text-xs text-gray-500 mt-2">Based on your audience engagement patterns</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Engagement Rate</p>
                    <p className="font-medium mt-1">8.2%</p>
                    <p className="text-xs text-gray-500 mt-2">Industry average: 3.1%</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Content Recommendation</p>
                    <p className="font-medium mt-1">List-based posts</p>
                    <p className="text-xs text-gray-500 mt-2">Perform 46% better than other formats</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Post Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-800 p-3 text-sm font-medium text-gray-500 dark:text-gray-300">
                    <div className="col-span-5">Post</div>
                    <div className="col-span-2 text-center">Impressions</div>
                    <div className="col-span-2 text-center">Engagements</div>
                    <div className="col-span-2 text-center">Engagement Rate</div>
                    <div className="col-span-1 text-center">Details</div>
                  </div>
                  
                  <div className="divide-y">
                    {postData.map((post) => (
                      <React.Fragment key={post.id}>
                        <div 
                          className="grid grid-cols-12 p-3 text-sm hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer"
                          onClick={() => togglePostExpansion(post.id)}
                        >
                          <div className="col-span-5">
                            <div className="line-clamp-2">{post.excerpt}</div>
                            <div className="text-xs text-gray-500 mt-1">{post.date}</div>
                          </div>
                          <div className="col-span-2 text-center flex items-center justify-center">
                            {post.impressions.toLocaleString()}
                          </div>
                          <div className="col-span-2 text-center flex items-center justify-center">
                            {post.engagements.toLocaleString()}
                          </div>
                          <div className="col-span-2 text-center flex items-center justify-center">
                            {post.engagement_rate}
                          </div>
                          <div className="col-span-1 text-center flex items-center justify-center">
                            {expandedPost === post.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        
                        {expandedPost === post.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-50 dark:bg-gray-800/50 p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                          >
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Engagement Breakdown</h4>
                              <div className="flex justify-between items-center text-xs">
                                <span>Likes</span>
                                <span>{Math.round(post.engagements * 0.65)}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span>Comments</span>
                                <span>{Math.round(post.engagements * 0.15)}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span>Shares</span>
                                <span>{Math.round(post.engagements * 0.1)}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span>Saves</span>
                                <span>{Math.round(post.engagements * 0.1)}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Demographics</h4>
                              <div className="flex justify-between items-center text-xs">
                                <span>Industry: Tech</span>
                                <span>45%</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span>Industry: Marketing</span>
                                <span>32%</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span>Job Level: Manager+</span>
                                <span>67%</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Link Performance</h4>
                              <div className="flex justify-between items-center text-xs">
                                <span>Clicks</span>
                                <span>{post.clicks}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span>CTR</span>
                                <span>{((post.clicks / post.impressions) * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Industries</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Technology</span>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-linkedin-blue h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '42%' }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Marketing & Advertising</span>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-linkedin-blue h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '28%' }}
                            transition={{ duration: 1, delay: 0.1 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Financial Services</span>
                          <span className="text-sm font-medium">16%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-linkedin-blue h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '16%' }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Others</span>
                          <span className="text-sm font-medium">14%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-linkedin-blue h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '14%' }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Job Function</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Marketing</span>
                          <span className="text-sm font-medium">38%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-linkedin-lightBlue h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '38%' }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Engineering</span>
                          <span className="text-sm font-medium">27%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-linkedin-lightBlue h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '27%' }}
                            transition={{ duration: 1, delay: 0.1 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Sales</span>
                          <span className="text-sm font-medium">19%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-linkedin-lightBlue h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '19%' }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Others</span>
                          <span className="text-sm font-medium">16%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-linkedin-lightBlue h-2 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: '16%' }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Follower Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {/* Simple area chart visualization */}
                    <div className="h-full flex flex-col">
                      <div className="flex-1 flex items-end">
                        {followerData.datasets[0].data.map((value, index) => (
                          <div key={index} className="flex-1 flex flex-col justify-end h-full">
                            <motion.div
                              className="w-full bg-linkedin-blue/20 dark:bg-linkedin-blue/30 relative group"
                              style={{ height: `${(value / Math.max(...followerData.datasets[0].data)) * 100}%` }}
                              initial={{ height: 0 }}
                              animate={{ height: `${(value / Math.max(...followerData.datasets[0].data)) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            >
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                {value} followers
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        {followerData.labels.map((label, index) => (
                          <span key={index}>{label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">New Followers (30 days)</p>
                      <p className="text-xl font-bold mt-1">+65</p>
                      <div className="text-xs text-green-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        22% increase
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Average Daily Growth</p>
                      <p className="text-xl font-bold mt-1">2.17</p>
                      <p className="text-xs text-gray-500 mt-1">followers/day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="competitors">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-12">
                  Competitor analytics coming soon. <br />
                  Connect your LinkedIn account to enable this feature.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
