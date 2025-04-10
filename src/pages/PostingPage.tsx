
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  FileText, 
  Image, 
  Mic, 
  Send, 
  Clock, 
  Sparkles, 
  BarChart3, 
  PlusCircle, 
  Linkedin, 
  ChevronDown,
  MessageSquare,
  ThumbsUp,
  Share2,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Lightbulb,
  Hash
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";

const PostingPage: React.FC = () => {
  const [postContent, setPostContent] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [selectedFormat, setSelectedFormat] = useState<"left" | "center" | "justify">("left");
  
  // Scheduled posts data
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      content: "Just released our latest feature: AI-powered LinkedIn post suggestions! Create better content in half the time. #AI #LinkedInMarketing",
      scheduledTime: "Today, 3:30 PM",
      isThread: false,
    },
    {
      id: 2,
      content: "5 ways to improve your LinkedIn engagement:\n\n1. Post consistently\n2. Use relevant hashtags\n3. Engage with your audience\n4. Share valuable content\n5. Analyze your performance",
      scheduledTime: "Tomorrow, 10:00 AM",
      isThread: true,
      threadCount: 5,
    },
    {
      id: 3,
      content: "How our team increased LinkedIn engagement by 300% in just 30 days. The results might surprise you!",
      scheduledTime: "Apr 5, 1:15 PM",
      isThread: false,
    }
  ]);

  // Inspiration prompts
  const inspirationPrompts = [
    "Share a recent achievement or milestone",
    "Ask your network a thought-provoking question",
    "Share an industry insight or trend",
    "Post a tip related to your expertise",
    "Share a case study or success story",
    "Highlight a team member or colleague",
    "Share a behind-the-scenes look at your work",
    "Discuss an industry challenge and potential solutions"
  ];
  
  // Analytics data
  const analyticsData = {
    bestTimes: [
      { day: "Monday", time: "9:00 AM", engagement: "High" },
      { day: "Wednesday", time: "12:30 PM", engagement: "High" },
      { day: "Thursday", time: "5:00 PM", engagement: "Medium" }
    ],
    topHashtags: [
      "#LinkedInTips",
      "#ContentCreation",
      "#DigitalMarketing",
      "#ProfessionalGrowth",
      "#NetworkingTips"
    ]
  };

  const handlePostSubmit = () => {
    if (!postContent.trim()) {
      toast.error("Please add some content to your post");
      return;
    }
    
    toast.success("Post created successfully!");
    setPostContent("");
  };

  const handleSchedulePost = () => {
    if (!postContent.trim()) {
      toast.error("Please add some content to your post");
      return;
    }
    
    toast.success("Post scheduled successfully!");
    
    // In a real app, you would add the post to the scheduled posts list
    const newPost = {
      id: scheduledPosts.length + 1,
      content: postContent,
      scheduledTime: "Tomorrow, 9:00 AM", // Default time, in a real app you'd use a datetime picker
      isThread: false
    };
    
    setScheduledPosts([...scheduledPosts, newPost]);
    setPostContent("");
  };

  const handleUsePrompt = (prompt: string) => {
    setPostContent(prompt);
    toast.info("Prompt added to editor");
  };

  const handleGenerateWithAI = () => {
    toast.loading("Generating content with AI...");
    
    // In a real app, you would call an AI service here
    setTimeout(() => {
      toast.dismiss();
      setPostContent("I'm excited to share our latest case study on how we helped a client increase their LinkedIn engagement by 300% in just 30 days using our data-driven content strategy. The key takeaways include consistency in posting, audience targeting, and content variety.\n\nWhat strategies have worked best for your LinkedIn presence? Share in the comments below!\n\n#LinkedInStrategy #ContentMarketing #DigitalMarketing");
      toast.success("AI content generated!");
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Content Creation</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and schedule your LinkedIn content
            </p>
          </div>
          
          <Button 
            className="gap-2 bg-linkedin-blue hover:bg-linkedin-darkBlue text-white"
            onClick={handlePostSubmit}
          >
            <PlusCircle className="h-4 w-4" />
            Create New Post
          </Button>
        </div>
        
        <Tabs defaultValue="write" className="space-y-8" onValueChange={(val) => setActiveTab(val)}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
            <TabsTrigger value="write" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Write & Preview
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="inspiration" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              <Lightbulb className="h-4 w-4 mr-2" />
              Inspiration
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Post Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                      Create New LinkedIn Post
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Mic className="h-4 w-4 text-red-500" />
                        Record Voice
                      </Button>
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Image className="h-4 w-4 text-blue-500" />
                        Upload Media
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2 rounded-full">
                            <AlignLeft className="h-4 w-4 text-purple-500" />
                            Format Text
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Text Alignment</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className={selectedFormat === "left" ? "bg-gray-100 dark:bg-gray-800" : ""} 
                            onClick={() => setSelectedFormat("left")}
                          >
                            <AlignLeft className="h-4 w-4 mr-2" /> Left Align
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={selectedFormat === "center" ? "bg-gray-100 dark:bg-gray-800" : ""} 
                            onClick={() => setSelectedFormat("center")}
                          >
                            <AlignCenter className="h-4 w-4 mr-2" /> Center Align
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={selectedFormat === "justify" ? "bg-gray-100 dark:bg-gray-800" : ""} 
                            onClick={() => setSelectedFormat("justify")}
                          >
                            <AlignRight className="h-4 w-4 mr-2" /> Justify
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="outline" className="gap-2 rounded-full">
                        <Hash className="h-4 w-4 text-green-500" />
                        Add Hashtags
                      </Button>
                    </div>

                    <Textarea 
                      placeholder="What do you want to share with your network?"
                      className={`min-h-[150px] text-base resize-none ${
                        selectedFormat === "center" ? "text-center" : 
                        selectedFormat === "justify" ? "text-justify" : "text-left"
                      }`}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 py-1 border-linkedin-blue bg-linkedin-blue/10 dark:border-linkedin-blue dark:bg-linkedin-blue/20 text-linkedin-blue">
                          <Linkedin className="h-3 w-3" />
                          LinkedIn
                        </Badge>
                        <span>{3000 - postContent.length} characters</span>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={handleSchedulePost}>
                          <Calendar className="h-3 w-3" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="ghost" size="sm" className="gap-2" onClick={handleGenerateWithAI}>
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Generate with AI
                    </Button>
                    <Button 
                      size="sm" 
                      className="px-4 bg-linkedin-blue hover:bg-linkedin-darkBlue"
                      onClick={handlePostSubmit}
                    >
                      Post to LinkedIn
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-blue-500" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border dark:border-gray-800 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-linkedin-blue flex items-center justify-center text-white font-semibold">
                          U
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm">LinkedIn User</span>
                            <span className="text-gray-500 text-sm">• 2nd</span>
                          </div>
                          <p className={`text-sm mt-1 ${
                            selectedFormat === "center" ? "text-center" : 
                            selectedFormat === "justify" ? "text-justify" : "text-left"
                          }`}>
                            {postContent || "Your post preview will appear here..."}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6 ml-12 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3.5 w-3.5" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>0</span>
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
                      Upcoming Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {scheduledPosts.map((post) => (
                          <div key={post.id} className="border dark:border-gray-800 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-linkedin-blue dark:text-linkedin-blue font-medium">
                                {post.scheduledTime}
                              </span>
                              {post.isThread && (
                                <Badge variant="outline" className="h-5 px-2 text-xs">
                                  Thread ({post.threadCount})
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
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {["#LinkedInStrategy", "Career Development", "Leadership Skills", "Industry Insights", "Professional Growth"].map((topic, i) => (
                      <div 
                        key={i} 
                        className="flex items-center border dark:border-gray-800 rounded-lg p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                        onClick={() => handleUsePrompt(`Let's discuss ${topic} today. I've found that...`)}
                      >
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Content Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {Array.from({ length: 35 }).map((_, index) => {
                    const dayNumber = (index % 30) + 1;
                    const isCurrentMonth = index < 30;
                    const hasPost = [3, 12, 18, 24].includes(dayNumber) && isCurrentMonth;
                    const isToday = dayNumber === 15 && isCurrentMonth;
                    
                    return (
                      <div 
                        key={index} 
                        className={`
                          border rounded-md p-1 min-h-[80px] text-sm
                          ${isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50 text-gray-400"}
                          ${isToday ? "border-linkedin-blue" : ""}
                        `}
                      >
                        <div className="flex justify-between">
                          <span className={isToday ? "text-linkedin-blue font-bold" : ""}>{dayNumber}</span>
                          {hasPost && <div className="w-2 h-2 rounded-full bg-linkedin-blue" />}
                        </div>
                        
                        {/* Sample post indicator */}
                        {hasPost && (
                          <div className="mt-2 bg-linkedin-blue/10 text-linkedin-blue p-1 rounded text-xs">
                            Post
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Schedule a Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Post Content</label>
                    <Textarea 
                      placeholder="What do you want to share?"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time</label>
                      <Input type="time" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <Button variant="outline" className="gap-2">
                      <Image className="h-4 w-4" />
                      Add Media
                    </Button>
                    <Button className="bg-linkedin-blue hover:bg-linkedin-darkBlue">
                      Schedule Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inspiration">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspirationPrompts.map((prompt, index) => (
                <Card key={index} className="hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Lightbulb className="h-8 w-8 text-amber-500" />
                    </div>
                    <p className="text-lg font-medium mb-4">{prompt}</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleUsePrompt(prompt)}
                    >
                      Use This Prompt
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="bg-gradient-to-br from-linkedin-blue/5 to-linkedin-blue/20 dark:from-linkedin-blue/10 dark:to-linkedin-blue/30 border-dashed border-2 border-linkedin-blue/30">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-8 w-8 text-linkedin-blue mb-4" />
                  <p className="text-lg font-medium mb-2">Generate Custom Prompt</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Use AI to create a personalized content idea</p>
                  <Button 
                    variant="outline" 
                    className="border-linkedin-blue text-linkedin-blue hover:bg-linkedin-blue hover:text-white"
                    onClick={handleGenerateWithAI}
                  >
                    Generate with AI
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Best Posting Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.bestTimes.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-8 rounded-full ${
                            item.engagement === "High" 
                              ? "bg-green-500" 
                              : item.engagement === "Medium" 
                              ? "bg-yellow-500" 
                              : "bg-gray-300"
                          }`} />
                          <div>
                            <p className="font-medium">{item.day}</p>
                            <p className="text-sm text-gray-500">{item.time}</p>
                          </div>
                        </div>
                        <Badge className={
                          item.engagement === "High" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : item.engagement === "Medium" 
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }>
                          {item.engagement}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Performing Hashtags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analyticsData.topHashtags.map((hashtag, index) => (
                      <Badge key={index} className="bg-linkedin-blue/10 text-linkedin-blue hover:bg-linkedin-blue/20 cursor-pointer px-3 py-1.5">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-3 py-1">
                    <p className="text-sm font-medium">Post on Tuesday mornings</p>
                    <p className="text-xs text-gray-500">Higher engagement observed</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-3 py-1">
                    <p className="text-sm font-medium">Use more list-based content</p>
                    <p className="text-xs text-gray-500">Performs 32% better than other formats</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-3 py-1">
                    <p className="text-sm font-medium">Include 3-5 hashtags</p>
                    <p className="text-xs text-gray-500">Optimal for reach and relevance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default PostingPage;
