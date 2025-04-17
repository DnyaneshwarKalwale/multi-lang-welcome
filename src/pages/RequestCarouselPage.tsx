import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Info, Upload, Search, LayoutGrid, ChevronLeft, ChevronRight, Youtube } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";

// Define the form schema for validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  youtubeUrl: z.string().optional(),
});

// Interface for YouTube video
interface YouTubeVideo {
  id: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  views: string;
  date: string;
  duration: string;
}

// Interface for saved carousel videos
interface SavedCarouselVideo {
  id: string;
  title: string;
  status: 'ready' | 'in_progress' | 'delivered';
  thumbnailUrl?: string;
  requestDate: Date;
  deliveryDate?: Date;
  slideCount: number;
  downloadUrl?: string;
  videoId?: string;
  videoUrl?: string;
  source?: 'youtube';
}

// Sample YouTube videos
const youtubeVideos: YouTubeVideo[] = [
  {
    id: "6EEW-9NDM5k",
    title: "The Ultimate Guide to LinkedIn Content Strategy",
    channelName: "LinkedIn Marketing Solutions",
    thumbnailUrl: "https://img.youtube.com/vi/6EEW-9NDM5k/mqdefault.jpg",
    views: "1.2M",
    date: "2 weeks ago",
    duration: "12:45"
  },
  {
    id: "mTz0GXj8NN0",
    title: "How to Grow Your Personal Brand on LinkedIn",
    channelName: "GaryVee",
    thumbnailUrl: "https://img.youtube.com/vi/mTz0GXj8NN0/mqdefault.jpg",
    views: "856K",
    date: "1 month ago",
    duration: "18:23"
  },
  {
    id: "dW7WjA-heYw",
    title: "LinkedIn Content That Gets 10x Engagement",
    channelName: "Social Media Examiner",
    thumbnailUrl: "https://img.youtube.com/vi/dW7WjA-heYw/mqdefault.jpg",
    views: "543K",
    date: "3 weeks ago",
    duration: "15:19"
  },
  {
    id: "vN4jQKk-MZI",
    title: "B2B Marketing Strategies for LinkedIn",
    channelName: "B2B Marketing Insights",
    thumbnailUrl: "https://img.youtube.com/vi/vN4jQKk-MZI/mqdefault.jpg",
    views: "328K",
    date: "2 months ago",
    duration: "22:37"
  },
  {
    id: "pQFo8JWgHEU",
    title: "Creating Video Content for Professional Audiences",
    channelName: "Video Creators",
    thumbnailUrl: "https://img.youtube.com/vi/pQFo8JWgHEU/mqdefault.jpg",
    views: "421K",
    date: "5 weeks ago",
    duration: "14:52"
  },
  {
    id: "lD3FfI7zNc4",
    title: "LinkedIn Ads: Complete 2023 Tutorial",
    channelName: "Digital Marketing Pro",
    thumbnailUrl: "https://img.youtube.com/vi/lD3FfI7zNc4/mqdefault.jpg",
    views: "612K",
    date: "3 months ago",
    duration: "26:14"
  },
  {
    id: "X9YmkKbTgmk",
    title: "How to Write LinkedIn Posts That Convert",
    channelName: "Content Masters",
    thumbnailUrl: "https://img.youtube.com/vi/X9YmkKbTgmk/mqdefault.jpg",
    views: "287K",
    date: "4 weeks ago",
    duration: "19:08"
  },
  {
    id: "aW7lJMroT2c",
    title: "LinkedIn Algorithm: What Works in 2023",
    channelName: "Social Media Today",
    thumbnailUrl: "https://img.youtube.com/vi/aW7lJMroT2c/mqdefault.jpg",
    views: "732K",
    date: "1 week ago",
    duration: "16:47"
  }
];

// Function to generate dummy transcript based on video ID
const generateDummyTranscript = (videoId: string): string[] => {
  switch (videoId) {
    case "6EEW-9NDM5k":
      return [
        "LinkedIn's algorithm favors content that generates meaningful engagement.",
        "Create content that educates, inspires, or solves specific problems.",
        "Consistency is key - develop a sustainable posting cadence.",
        "Utilize LinkedIn's native content formats for maximum reach.",
        "Text-only posts often outperform those with external links.",
        "Analytics should guide your content strategy refinements.",
        "Personal stories and experiences create authentic connections.",
        "Industry insights and thought leadership position you as an expert."
      ];
    case "mTz0GXj8NN0":
      return [
        "Your personal brand is how people perceive you when you're not in the room.",
        "Authenticity trumps perfection when building your brand on LinkedIn.",
        "Define your unique value proposition and ensure it's reflected in all content.",
        "Engagement with others' content boosts your own visibility.",
        "Strategic use of hashtags can expand your content reach significantly.",
        "Your profile should tell a compelling story, not just list achievements.",
        "Consistency in visual elements strengthens brand recognition.",
        "Building a network of advocates amplifies your brand message."
      ];
    case "dW7WjA-heYw":
      return [
        "Content that generates conversations receives preferential algorithm treatment.",
        "Ask thought-provoking questions that encourage meaningful responses.",
        "Timing your posts to match your audience's active hours boosts engagement.",
        "Share contrarian perspectives to stand out from industry echo chambers.",
        "Break complex ideas into digestible, easily-shareable content pieces.",
        "Document your professional journey rather than curating a perfect image.",
        "Create content frameworks that can be repurposed across different topics.",
        "Analyze high-performing content to identify patterns and replicate success."
      ];
    case "vN4jQKk-MZI":
      return [
        "B2B marketing on LinkedIn requires targeting decision-makers directly.",
        "Educational content establishes credibility with B2B audiences.",
        "Case studies and success stories provide powerful social proof.",
        "Employee advocacy programs amplify your B2B content reach.",
        "Account-based marketing strategies work effectively on LinkedIn.",
        "Thought leadership content should address industry challenges and trends.",
        "LinkedIn Live and Events provide opportunities for deeper engagement.",
        "Analytics should focus on quality leads rather than vanity metrics."
      ];
    case "pQFo8JWgHEU":
      return [
        "Professional video content must deliver value in the first 3-5 seconds.",
        "Captions are essential as most LinkedIn videos are watched without sound.",
        "Vertical video formats are increasingly effective on LinkedIn.",
        "Authentic, less-polished videos often outperform high-production content.",
        "Educational video series build anticipation and regular engagement.",
        "Behind-the-scenes content humanizes your brand and builds connection.",
        "LinkedIn Live generates 7x more engagement than standard video content.",
        "Repurpose long-form videos into multiple short-form content pieces."
      ];
    case "lD3FfI7zNc4":
      return [
        "LinkedIn ads offer unparalleled B2B targeting capabilities.",
        "Sponsored content achieves the highest engagement among ad formats.",
        "Lead gen forms can reduce friction in the conversion process.",
        "Audience segmentation improves campaign performance significantly.",
        "Video ads under 15 seconds see the highest completion rates.",
        "Retargeting website visitors on LinkedIn delivers strong ROI.",
        "A/B testing ad creative is essential for optimizing performance.",
        "Campaign objectives should align with specific funnel stages."
      ];
    case "X9YmkKbTgmk":
      return [
        "Compelling hooks in the first line are crucial for LinkedIn post success.",
        "Breaking text into short paragraphs improves readability and engagement.",
        "Posts that share personal insights generate more authentic connections.",
        "Call-to-actions should feel natural, not forced or overly promotional.",
        "Storytelling frameworks create emotional resonance with readers.",
        "Data-backed claims establish credibility and encourage sharing.",
        "Using the 'broetry' format increases the odds of algorithm visibility.",
        "Testing different content styles reveals what resonates with your audience."
      ];
    case "aW7lJMroT2c":
      return [
        "LinkedIn's algorithm prioritizes relevant content over recency.",
        "Initial engagement velocity determines a post's broader distribution.",
        "Comments hold more algorithmic weight than reactions or shares.",
        "Native document posts receive preferential reach over external links.",
        "Creator mode enables additional tools for increased visibility.",
        "Algorithm changes now favor expertise-based content over viral tactics.",
        "Hashtag effectiveness depends on specificity and audience alignment.",
        "The 'golden hour' after posting determines long-term content performance."
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 4;
  
  // Saved videos state
  const [savedVideos, setSavedVideos] = useState<SavedCarouselVideo[]>([]);
  const [isLoadingSavedVideos, setIsLoadingSavedVideos] = useState(false);
  const [filterValue, setFilterValue] = useState("all");
  const itemsPerPage = 4;
  const [savedVideosPage, setSavedVideosPage] = useState(1);

  // Load saved videos from localStorage
  useEffect(() => {
    const loadSavedVideos = () => {
      setIsLoadingSavedVideos(true);
      try {
        // Get videos from localStorage
        const savedVideosString = localStorage.getItem('savedYoutubeVideos');
        
        if (savedVideosString) {
          try {
            const loadedVideos = JSON.parse(savedVideosString);
            
            // Convert to SavedCarouselVideo format
            const carousels = loadedVideos.map((video: any) => {
              // Create a valid date object or fallback to current date
              const safeDate = (dateStr: string | undefined) => {
                if (!dateStr) return new Date();
                try {
                  const date = new Date(dateStr);
                  // Check if date is valid
                  return isNaN(date.getTime()) ? new Date() : date;
                } catch (e) {
                  return new Date();
                }
              };
              
              return {
                id: video.id || video.videoId || Math.random().toString(36).substring(2, 9),
                title: video.title || 'YouTube Video',
                status: 'ready',
                thumbnailUrl: video.thumbnailUrl || 
                  (video.videoId ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg` : undefined),
                requestDate: safeDate(video.requestDate),
                deliveryDate: safeDate(video.deliveryDate),
                slideCount: video.slideCount || 5,
                videoId: video.videoId,
                videoUrl: video.videoUrl || (video.videoId ? `https://youtube.com/watch?v=${video.videoId}` : undefined),
                source: 'youtube'
              };
            });
            
            setSavedVideos(carousels);
          } catch (parseError) {
            console.error('Error parsing saved videos:', parseError);
            setSavedVideos([]);
          }
        } else {
          setSavedVideos([]);
        }
      } catch (error) {
        console.error('Error loading saved videos:', error);
        toast({
          title: "Error",
          description: "Failed to load your saved videos",
          variant: "destructive"
        });
        setSavedVideos([]);
      } finally {
        setIsLoadingSavedVideos(false);
      }
    };
    
    loadSavedVideos();
  }, [toast]);

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

  // Handle next slide
  const nextSlide = () => {
    if (generatedTranscript.length > 0) {
      setCurrentSlide((prev) => (prev === generatedTranscript.length - 1 ? 0 : prev + 1));
    }
  };

  // Handle previous slide
  const prevSlide = () => {
    if (generatedTranscript.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? generatedTranscript.length - 1 : prev - 1));
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
    setCurrentSlide(0);
    
    toast({
      title: "Video selected",
      description: "Content from this video will be used for your carousel.",
    });
  };

  // Watch video handler
  const handleWatchVideo = (video: SavedCarouselVideo) => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
      toast({
        title: "Opening video",
        description: "Opening YouTube video in a new tab",
      });
    } else if (video.videoId) {
      window.open(`https://youtube.com/watch?v=${video.videoId}`, '_blank');
      toast({
        title: "Opening video",
        description: "Opening YouTube video in a new tab",
      });
    }
  };

  // Filter videos based on search query
  const filteredVideos = searchQuery 
    ? youtubeVideos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channelName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : youtubeVideos;
  
  // Calculate pagination for YouTube videos
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  
  // Calculate pagination for saved videos
  const filteredSavedVideos = savedVideos.filter(video => {
    if (filterValue === "all") return true;
    return video.status === filterValue;
  });
  
  const totalSavedPages = Math.ceil(filteredSavedVideos.length / itemsPerPage);
  const startIndex = (savedVideosPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSavedVideos = filteredSavedVideos.slice(startIndex, endIndex);
  
  // Handle page change
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Handle next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle saved videos pagination
  const goToNextSavedPage = () => {
    if (savedVideosPage < totalSavedPages) {
      setSavedVideosPage(savedVideosPage + 1);
    }
  };
  
  const goToPrevSavedPage = () => {
    if (savedVideosPage > 1) {
      setSavedVideosPage(savedVideosPage - 1);
    }
  };

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
      
      {/* Saved Videos Section */}
      {savedVideos.length > 0 && (
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold">Your Saved Videos</h2>
            
            <div className="flex gap-3">
              <select
                className="px-3 py-2 rounded-md border border-gray-200 text-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="ready">Ready</option>
                <option value="in_progress">In Progress</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
          
          {isLoadingSavedVideos ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p>Loading your carousel videos...</p>
              </div>
            </div>
          ) : currentSavedVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {currentSavedVideos.map(video => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="h-48 bg-gray-100 dark:bg-gray-800 relative">
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <LayoutGrid className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                        </div>
                      )}
                      
                      <Badge 
                        className={`absolute top-3 right-3 ${
                          video.status === 'delivered' || video.status === 'ready'
                            ? 'bg-green-500' 
                            : 'bg-blue-500'
                        }`}
                      >
                        {video.status === 'delivered' || video.status === 'ready' ? 'Ready' : 'In Progress'}
                      </Badge>
                      
                      {video.source === 'youtube' && (
                        <Badge className="absolute top-3 left-3 bg-red-500 flex items-center gap-1">
                          <Youtube className="h-3 w-3" />
                          YouTube
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        Added: {(() => {
                          try {
                            return format(video.requestDate, 'MMM d, yyyy');
                          } catch (e) {
                            return 'Unknown date';
                          }
                        })()}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <LayoutGrid className="h-4 w-4" />
                          <span>{video.slideCount} slides</span>
                        </div>
                        
                        {video.deliveryDate && (
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <span>{(() => {
                              try {
                                return format(video.deliveryDate, 'MMM d, yyyy');
                              } catch (e) {
                                return 'Unknown date';
                              }
                            })()}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
                      <div className="flex justify-between w-full">
                        {video.source === 'youtube' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleWatchVideo(video)}
                          >
                            <Youtube className="h-4 w-4" />
                            Watch Video
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="gap-1">
                            <Info className="h-4 w-4" />
                            Preview
                          </Button>
                        )}
                        
                        <Button 
                          variant="default" 
                          size="sm"
                          className="gap-1"
                          onClick={() => navigate('/dashboard/create-post', { 
                            state: { 
                              title: video.title,
                              activeTab: 'carousel',
                              youtubeVideoId: video.videoId
                            }
                          })}
                        >
                          <LayoutGrid className="h-4 w-4" />
                          Create Post
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Pagination controls for saved videos */}
              {totalSavedPages > 1 && (
                <div className="flex justify-center mt-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToPrevSavedPage} 
                      disabled={savedVideosPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="text-sm">
                      Page {savedVideosPage} of {totalSavedPages}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToNextSavedPage} 
                      disabled={savedVideosPage === totalSavedPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No saved videos found. Browse the YouTube videos below to create carousels.
              </p>
            </div>
          )}
        </div>
      )}
      
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
                          {currentVideos.map((video) => (
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
                        
                        {/* Pagination Controls */}
                        {filteredVideos.length > videosPerPage && (
                          <Pagination className="mt-4">
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={prevPage} 
                                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>
                              
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                  <PaginationLink 
                                    isActive={page === currentPage}
                                    onClick={() => goToPage(page)}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={nextPage}
                                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        )}
                        
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
            
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Carousel Request"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex gap-1 items-center" 
                onClick={() => navigate("/dashboard/templates")}
              >
                <LayoutGrid className="h-4 w-4" />
                Browse Templates
              </Button>
          </div>
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
            {selectedVideo && generatedTranscript.length > 0 ? (
              <div className="bg-white border rounded-lg overflow-hidden shadow-md">
                {/* LinkedIn-style header */}
                <div className="p-3 border-b">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="font-semibold text-blue-600">YT</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Your LinkedIn Profile</h4>
                      <p className="text-xs text-gray-500">Content Creator • Just now</p>
                    </div>
                  </div>
                </div>
                
                {/* Post content */}
                <div className="p-3">
                  <p className="text-sm mb-3">{selectedVideo.title}</p>
                </div>
                
                {/* Carousel slide with 1:1 aspect ratio */}
                <div className="relative">
                  <div className="aspect-square w-full relative">
                    <div className="absolute inset-0 flex flex-col">
                      {/* Slide content with LinkedIn styling */}
                      <div className="flex-1 flex flex-col justify-center p-6 bg-gradient-to-br from-blue-50 to-white">
                        <div className="absolute top-3 right-3 bg-white/80 text-xs px-2 py-1 rounded-full text-gray-700 font-medium">
                          {currentSlide + 1}/{generatedTranscript.length}
                        </div>
                        
                        <div className="mx-auto max-w-[90%] text-center">
                          <p className="text-lg font-semibold leading-tight">{generatedTranscript[currentSlide]}</p>
                        </div>
                        
                        {/* LinkedIn logo overlay */}
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded flex items-center">
                            <span className="font-bold">in</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Navigation buttons */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between">
                        <Button 
                          onClick={prevSlide} 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-full bg-white/90 hover:bg-white border shadow-sm text-gray-700"
                        >
                          <ChevronLeft className="h-5 w-5" />
                          <span className="sr-only">Previous slide</span>
                        </Button>
                        <Button 
                          onClick={nextSlide} 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-full bg-white/90 hover:bg-white border shadow-sm text-gray-700"
                        >
                          <ChevronRight className="h-5 w-5" />
                          <span className="sr-only">Next slide</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Slide indicators */}
                <div className="flex justify-center p-3 gap-1 border-t">
                  {generatedTranscript.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-1.5 rounded-full cursor-pointer transition-all ${
                        index === currentSlide ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
                
                {/* LinkedIn-style engagement actions */}
                <div className="border-t">
                  <div className="flex items-center justify-around p-1">
                    <Button variant="ghost" className="flex-1 h-10 rounded-md gap-1 text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                      Like
                    </Button>
                    <Button variant="ghost" className="flex-1 h-10 rounded-md gap-1 text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      Comment
                    </Button>
                    <Button variant="ghost" className="flex-1 h-10 rounded-md gap-1 text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      Repost
                    </Button>
                    <Button variant="ghost" className="flex-1 h-10 rounded-md gap-1 text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select a YouTube video</h3>
                <p className="text-sm text-muted-foreground">
                  A preview of your carousel will appear here after selecting a video and generating content.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Best Practices for Effective Carousels</h3>
                <ul className="text-sm space-y-2 pl-5 list-disc text-muted-foreground">
                  <li>Keep each slide focused on a single key point</li>
                  <li>Use 5-8 slides for optimal engagement</li>
                  <li>Include a clear call to action on the final slide</li>
                  <li>Maintain consistent visual style across all slides</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Delivery Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  Your carousel will be ready within 24 hours. You'll receive an email notification when it's complete and ready for review.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestCarouselPage; 