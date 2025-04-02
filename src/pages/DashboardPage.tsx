import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mic, Upload, Calendar, BarChart3, Twitter, 
  Edit3, Eye, Clock, PlusCircle, Zap, Sparkles,
  Maximize2, MessageSquare, ThumbsUp, Share2
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

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { theme } = useTheme();

  // Sample tweets data
  const scheduledTweets = [
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

  // Sample analytics data
  const analyticsData = {
    impressions: {
      data: [1200, 1800, 2200, 1900, 2500, 2800, 3100],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 23,
      timeframe: "Last 7 days"
    },
    engagement: {
      data: [5.2, 6.8, 4.9, 7.2, 8.1, 7.5, 9.3],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 15,
      timeframe: "Last 7 days"
    },
    followers: {
      data: [120, 125, 128, 132, 138, 142, 150],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      increase: 8,
      timeframe: "Last 7 days"
    }
  };

  // Sample recent tweets
  const recentTweets = [
    {
      id: 101,
      content: "Just launched our AI Twitter Assistant! Generate tweets, schedule content, and analyze performance - all in one place.",
      date: "1h ago",
      stats: {
        likes: 45,
        retweets: 12,
        replies: 8,
        impressions: 1250
      }
    },
    {
      id: 102,
      content: "How we built our Twitter management platform in 30 days with React, Tailwind, and AI. A thread on our journey and lessons learned.",
      date: "5h ago",
      stats: {
        likes: 89,
        retweets: 24,
        replies: 15,
        impressions: 3200
      }
    }
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Twitter Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your content and analyze performance</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button size="sm" variant="gradient" className="gap-2">
            <Twitter className="h-4 w-4" />
            <span>Connect Twitter</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="create" className="mb-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="create" onClick={() => setActiveTab("create")} className="data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/20">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create
          </TabsTrigger>
          <TabsTrigger value="schedule" onClick={() => setActiveTab("schedule")} className="data-[state=active]:bg-violet-50 dark:data-[state=active]:bg-violet-900/20">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="analytics" onClick={() => setActiveTab("analytics")} className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="tweets" onClick={() => setActiveTab("tweets")} className="data-[state=active]:bg-gray-50 dark:data-[state=active]:bg-gray-800">
            <Twitter className="h-4 w-4 mr-2" />
            My Tweets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-500" />
                    Create New Tweet
                  </CardTitle>
                  <CardDescription>
                    Record, write, or upload content to generate tweets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button variant="outline" className="gap-2 rounded-full">
                      <Mic className="h-4 w-4 text-red-500" />
                      Record Voice
                    </Button>
                    <Button variant="outline" className="gap-2 rounded-full">
                      <Upload className="h-4 w-4 text-blue-500" />
                      Upload Media
                    </Button>
                    <Button variant="outline" className="gap-2 rounded-full">
                      <Edit3 className="h-4 w-4 text-purple-500" />
                      Write Text
                    </Button>
                  </div>

                  <Textarea 
                    placeholder="What's happening?" 
                    className="min-h-[150px] text-base resize-none"
                  />

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1 py-1 border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400">
                        <Twitter className="h-3 w-3" />
                        Twitter
                      </Badge>
                      <span>280 characters</span>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                        <Calendar className="h-3 w-3" />
                        Schedule
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
                    Generate with AI
                  </Button>
                  <Button size="sm" className="px-4">Post Tweet</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-blue-500" />
                    Preview
                  </CardTitle>
                  <CardDescription>
                    See how your tweet will appear
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border dark:border-gray-800 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>DP</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm">David Porter</span>
                          <span className="text-gray-500 text-sm">@davidporter</span>
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
                    Upcoming Tweets
                  </CardTitle>
                  <CardDescription>
                    Scheduled for publication
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
                  <Button variant="ghost" size="sm" className="w-full">View Calendar</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                    AI Suggestions
                  </CardTitle>
                  <CardDescription>
                    Trending topics to write about
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
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>
                Manage and schedule your upcoming tweets
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
                <CardTitle className="text-lg">Impressions</CardTitle>
                <CardDescription>
                  Total views of your tweets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[180px] mt-2 relative">
                  <div className="absolute inset-0 flex items-end">
                    {analyticsData.impressions.data.map((value, index) => (
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
                  {analyticsData.impressions.labels.map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                  <p className="text-xs text-gray-500">{analyticsData.impressions.timeframe}</p>
                  <div className="flex items-center text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      ↑ {analyticsData.impressions.increase}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Engagement Rate</CardTitle>
                <CardDescription>
                  Interactions with your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[180px] mt-2 relative">
                  <div className="absolute inset-0 flex items-end">
                    {analyticsData.engagement.data.map((value, index) => (
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
                  {analyticsData.engagement.labels.map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                  <p className="text-xs text-gray-500">{analyticsData.engagement.timeframe}</p>
                  <div className="flex items-center text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      ↑ {analyticsData.engagement.increase}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Followers Growth</CardTitle>
                <CardDescription>
                  New followers over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[180px] mt-2 relative">
                  <div className="absolute inset-0 flex items-end">
                    {analyticsData.followers.data.map((value, index) => (
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
                  {analyticsData.followers.labels.map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                  <p className="text-xs text-gray-500">{analyticsData.followers.timeframe}</p>
                  <div className="flex items-center text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      ↑ {analyticsData.followers.increase}%
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
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>DP</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">David Porter</span>
                            <span className="text-gray-500 text-sm">@davidporter</span>
                            <span className="text-gray-500 text-sm">·</span>
                            <span className="text-gray-500 text-sm">{tweet.date}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm mb-4">{tweet.content}</p>
                        <div className="flex gap-6 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{tweet.stats.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            <span>{tweet.stats.retweets}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{tweet.stats.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{tweet.stats.impressions}</span>
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
  );
};

export default DashboardPage;