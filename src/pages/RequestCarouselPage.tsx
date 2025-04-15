import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, ChevronRight, Upload, CheckCircle,
  Lightbulb, AlertCircle, Info, Calendar, Youtube,
  FileText, Image, Link, PlusCircle, Eye, Pencil,
  Play, Clock, Video, Check, PlayCircle, Download,
  ExternalLink, Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { CarouselPreview } from "@/components/CarouselPreview";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "../components/ui/use-toast";

// Form schema for carousel request
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  youtubeUrl: z.string().optional(),
});

type CarouselRequestForm = z.infer<typeof formSchema>;

// YouTube video interface
interface YouTubeVideo {
  id: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  date: string;
}

// Sample YouTube videos
const youtubeVideos: YouTubeVideo[] = [
  {
    id: "vid1",
    title: "10 Productivity Tips to Transform Your Daily Work Routine",
    channelName: "ProductivityMasters",
    thumbnailUrl: "https://picsum.photos/seed/prod1/640/360",
    duration: "12:45",
    views: "345K",
    date: "2 weeks ago"
  },
  {
    id: "vid2",
    title: "Why AI is Changing Everything in 2023",
    channelName: "Tech Insights",
    thumbnailUrl: "https://picsum.photos/seed/ai1/640/360",
    duration: "18:32",
    views: "1.2M",
    date: "3 weeks ago"
  },
  {
    id: "vid3",
    title: "The Future of Remote Work: Trends to Watch",
    channelName: "Future of Work",
    thumbnailUrl: "https://picsum.photos/seed/remote1/640/360",
    duration: "22:17",
    views: "567K",
    date: "1 month ago"
  },
  {
    id: "vid4",
    title: "Building a Personal Brand That Stands Out",
    channelName: "Marketing Mastery",
    thumbnailUrl: "https://picsum.photos/seed/brand1/640/360",
    duration: "15:09",
    views: "289K",
    date: "2 months ago"
  },
  {
    id: "vid5",
    title: "Sustainable Business Practices for the Modern Company",
    channelName: "Green Business",
    thumbnailUrl: "https://picsum.photos/seed/sustain1/640/360",
    duration: "25:40",
    views: "178K",
    date: "3 weeks ago"
  },
  {
    id: "vid6",
    title: "Digital Marketing Strategies That Actually Work",
    channelName: "Digital Marketers",
    thumbnailUrl: "https://picsum.photos/seed/market1/640/360",
    duration: "28:15",
    views: "412K",
    date: "1 week ago"
  }
];

// Function to generate dummy transcript based on video ID
const generateDummyTranscript = (videoId: string): string[] => {
  switch (videoId) {
    case "vid1":
      return [
        "Welcome to our video on productivity tips that can transform your daily work routine.",
        "The first tip is to use time-blocking for focused work sessions.",
        "Second, minimize distractions by turning off notifications during deep work.",
        "Third, implement the two-minute rule: if a task takes less than two minutes, do it immediately.",
        "Fourth, use the Pomodoro technique with 25-minute work sessions followed by 5-minute breaks.",
        "Fifth, prepare your to-do list the night before so you can start working immediately.",
        "Sixth, batch similar tasks together to reduce context switching.",
        "Seventh, take regular breaks to maintain high energy levels throughout the day.",
        "Eighth, use keyboard shortcuts to save time on repetitive tasks.",
        "Ninth, automate recurring tasks whenever possible using tools and scripts.",
        "Finally, end each day with a review of what you accomplished and what needs attention tomorrow."
      ];
    case "vid2":
      return [
        "AI is revolutionizing every industry in unprecedented ways.",
        "Deep learning models are now capable of generating human-quality content in seconds.",
        "Natural language processing has advanced to understand context and nuance in human communication.",
        "Computer vision systems can now identify objects and patterns better than humans in many scenarios.",
        "AI automation is changing workforce dynamics across manufacturing, service, and knowledge work.",
        "Ethical considerations around AI use are becoming increasingly important for businesses.",
        "Personalization powered by AI is transforming marketing and customer experience.",
        "Healthcare diagnostics and treatment planning are being enhanced by AI systems.",
        "Financial services use AI for fraud detection and automated trading strategies.",
        "The democratization of AI tools means smaller businesses can now leverage this technology."
      ];
    case "vid3":
      return [
        "Remote work has evolved from a temporary solution to a permanent strategic advantage.",
        "Companies are now building their culture and processes around distributed teams.",
        "Asynchronous communication is becoming the preferred method for global teams.",
        "Work-life integration rather than work-life balance is the new paradigm.",
        "Digital nomadism is on the rise as remote workers choose lifestyle flexibility.",
        "Co-working spaces are evolving to meet the needs of remote workers seeking community.",
        "Organizations are implementing hybrid models with flexible in-office requirements.",
        "Remote work technology is focusing on recreating spontaneous collaboration.",
        "International hiring is accelerating as geography becomes less restrictive.",
        "Mental health support is becoming essential for remote team management."
      ];
    case "vid4":
      return [
        "Building a personal brand requires consistency across all your platforms and communications.",
        "Start by identifying your unique value proposition - what makes you different from others.",
        "Choose 1-3 core topics that you'll become known for and focus your content there.",
        "Develop a distinctive visual identity including colors, fonts, and imagery styles.",
        "Create valuable content regularly that addresses your audience's most pressing problems.",
        "Engage authentically with your community by responding to comments and questions.",
        "Collaborate with complementary brands and individuals to expand your reach.",
        "Share your personal journey, including setbacks, to build genuine connections.",
        "Measure your brand growth with metrics like engagement rate and audience growth.",
        "Adjust your strategy based on feedback and changing market conditions."
      ];
    case "vid5":
      return [
        "Sustainable business is no longer optional but essential for long-term success.",
        "Start with an environmental audit to understand your company's current impact.",
        "Implement energy efficiency measures to reduce consumption and costs.",
        "Develop sustainable sourcing policies for all materials and services.",
        "Create a circular economy model for your products to minimize waste.",
        "Engage employees in sustainability initiatives to build internal commitment.",
        "Communicate your sustainability story transparently to build consumer trust.",
        "Measure and report on sustainability metrics to track progress.",
        "Collaborate with industry partners on larger sustainability challenges.",
        "Integrate sustainability into your core business strategy rather than treating it as separate."
      ];
    case "vid6":
      return [
        "Today's digital marketing requires an integrated approach across multiple channels.",
        "Start with customer research to understand where your audience spends their time online.",
        "Content marketing remains the foundation of effective digital strategy.",
        "SEO techniques have evolved to focus on user intent rather than keyword density.",
        "Social media success comes from community building, not just promotional content.",
        "Email marketing delivers the highest ROI when personalized and segmented properly.",
        "Paid advertising works best when targeting specific stages of the customer journey.",
        "Video content consistently outperforms other formats for engagement and conversion.",
        "Data analysis should drive continuous optimization of your marketing efforts.",
        "Marketing automation allows for personalization at scale across customer touchpoints."
      ];
    default:
      return [
        "Transcript content will appear here after processing the video.",
        "Each bullet point will represent key concepts from the video.",
        "These concepts will be used to create your carousel slides.",
        "Our AI system extracts the most relevant and engaging points.",
        "The final carousel will be professionally designed and ready to share."
      ];
  }
};

const RequestCarouselPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [generatedTranscript, setGeneratedTranscript] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      youtubeUrl: "",
    },
  });

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
    }
  };

  // Handle video selection
  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    form.setValue("youtubeUrl", `https://youtube.com/watch?v=${video.id}`);
    
    // Generate dummy transcript
    const transcript = generateDummyTranscript(video.id);
    setGeneratedTranscript(transcript);
    setShowTranscript(true);
    
    toast({
      title: "Video selected",
      description: "Content from this video will be used for your carousel.",
    });
  };

  // Filter videos based on search query
  const filteredVideos = searchQuery 
    ? youtubeVideos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channelName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : youtubeVideos;

  // Form submit handler
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Carousel request submitted",
        description: "We'll notify you when your carousel is ready.",
      });
    }, 1500);
  };

  // Success view
  if (isSuccess) {
    return (
      <div className="container max-w-5xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg mx-auto py-12"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Request Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            We've received your carousel request and will start working on it right away. You'll receive an email notification when it's ready.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/dashboard/my-carousels")}
              className="w-full"
            >
              View My Carousels
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/dashboard/templates")}
              className="w-full"
            >
              Browse Templates
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Request a Carousel</h1>
        <p className="text-muted-foreground mt-1">
          Provide content from a YouTube video and we'll create a professional carousel for you
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Carousel Details</CardTitle>
                <CardDescription>
                  Provide information about the carousel you'd like us to create
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carousel Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title for your carousel" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be the title of your published carousel
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Content Source</h3>
                  </div>
                  
                  <Tabs defaultValue="youtube" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="youtube">YouTube</TabsTrigger>
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="youtube" className="space-y-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="youtubeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Search YouTube Videos</FormLabel>
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Search by title or channel"
                                  className="pl-8"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                              </div>
                              <FormDescription>
                                Select a video to automatically extract content
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {filteredVideos.map((video) => (
                            <div 
                              key={video.id}
                              className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md relative ${
                                selectedVideo?.id === video.id ? "ring-2 ring-blue-500" : ""
                              }`}
                              onClick={() => handleVideoSelect(video)}
                            >
                              <div className="relative">
                                <img
                                  src={video.thumbnailUrl}
                                  alt={video.title}
                                  className="w-full aspect-video object-cover"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                  {video.duration}
                                </div>
                                {selectedVideo?.id === video.id && (
                                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                    <div className="bg-blue-500 text-white p-2 rounded-full">
                                      <Check className="h-5 w-5" />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{video.channelName}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                  <span>{video.views} views</span>
                                  <span>•</span>
                                  <span>{video.date}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {showTranscript && selectedVideo && (
                          <div className="mt-4 border rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-3">Generated Transcript</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              This transcript will be used to create your carousel slides:
                            </p>
                            <ScrollArea className="h-48 rounded-md border p-4">
                              <ol className="list-decimal pl-5 space-y-2">
                                {generatedTranscript.map((line, index) => (
                                  <li key={index} className="text-sm">
                                    {line}
                                  </li>
                                ))}
                              </ol>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                      
                      {form.watch("youtubeUrl") && (
                        <div className="rounded-lg bg-blue-50 p-4 flex items-start gap-3 border border-blue-100">
                          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-blue-700">Content scraping in progress</h4>
                            <p className="text-sm text-blue-600 mt-1">
                              We're analyzing your video to extract high-quality content for your carousel. This makes your request more accurate.
                            </p>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="upload" className="space-y-4">
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <Label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="font-medium text-lg">
                            {selectedFile ? selectedFile.name : "Drag & drop or click to upload"}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            PDF, PowerPoint, or image files
                          </p>
                          {!selectedFile && (
                            <Button
                              variant="outline"
                              type="button"
                              className="mt-4"
                              onClick={() => document.getElementById("file-upload")?.click()}
                            >
                              Browse Files
                            </Button>
                          )}
                        </Label>
                        {selectedFile && (
                          <div className="mt-4 flex items-center gap-2 justify-center">
                            <Badge variant="outline" className="text-xs py-1 px-2">
                              {selectedFile.type.split("/")[1].toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs py-1 px-2">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              className="text-xs h-7"
                              onClick={() => setSelectedFile(null)}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Carousel Request"}
            </Button>
          </form>
        </Form>

        <Card>
          <CardHeader>
            <CardTitle>Preview & Information</CardTitle>
            <CardDescription>
              See how your carousel might look
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              {selectedVideo ? (
                <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-lg">
                  <div className="relative">
                    <img 
                      src={selectedVideo.thumbnailUrl} 
                      alt={selectedVideo.title}
                      className="w-full aspect-video object-cover border-b-2 border-black"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 rounded-full p-3">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{selectedVideo.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedVideo.channelName}</p>
                    
                    <div className="flex justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          1
                        </div>
                        <div className="h-1 w-6 bg-black rounded-full"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          2
                        </div>
                        <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          3
                        </div>
                        <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          4
                        </div>
                        <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          5
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-lg">
                  {/* Generic carousel preview */}
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-r from-blue-50 to-white border-b-2 border-black flex items-center justify-center">
                      <div className="text-center p-4 flex flex-col items-center">
                        <Video className="h-12 w-12 text-blue-200 mb-2" />
                        <h3 className="text-lg font-medium text-black">Select a YouTube video</h3>
                        <p className="text-sm text-gray-500 mt-2">Preview will appear here</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        1
                      </div>
                      <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        2
                      </div>
                      <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        3
                      </div>
                      <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        4
                      </div>
                      <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        5
                      </div>
                    </div>
                  </div>
                </div>
              )}
          
              <div className="mt-6 space-y-4">
                <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Carousel Best Practices
                  </h3>
                  <ul className="text-sm text-black space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      Keep your content concise and focused on one main topic
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      Use 5-10 slides for optimal engagement
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      Include a clear call-to-action in your final slide
                    </li>
                  </ul>
                </div>
            
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4" />
                    Carousel Delivery
                  </h3>
                  <p className="text-sm text-black">
                    Your carousel will be ready within 24 hours. You'll receive an email notification when it's ready to view and publish.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestCarouselPage; 