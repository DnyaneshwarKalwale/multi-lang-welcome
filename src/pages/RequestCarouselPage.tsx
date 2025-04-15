import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Info, Upload, Search, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

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

// Sample YouTube videos
const youtubeVideos: YouTubeVideo[] = [
  {
    id: "6EEW-9NDM5k",
    title: "The Ultimate Guide to LinkedIn Content Strategy",
    channelName: "LinkedIn Marketing Solutions",
    thumbnailUrl: "https://img.youtube.com/vi/6EEW-9NDM5k/maxresdefault.jpg",
    views: "1.2M",
    date: "2 weeks ago",
    duration: "12:45"
  },
  {
    id: "mTz0GXj8NN0",
    title: "How to Grow Your Personal Brand on LinkedIn",
    channelName: "GaryVee",
    thumbnailUrl: "https://img.youtube.com/vi/mTz0GXj8NN0/maxresdefault.jpg",
    views: "856K",
    date: "1 month ago",
    duration: "18:23"
  },
  {
    id: "dW7WjA-heYw",
    title: "LinkedIn Content That Gets 10x Engagement",
    channelName: "Social Media Examiner",
    thumbnailUrl: "https://img.youtube.com/vi/dW7WjA-heYw/maxresdefault.jpg",
    views: "543K",
    date: "3 weeks ago",
    duration: "15:19"
  },
  {
    id: "vN4jQKk-MZI",
    title: "B2B Marketing Strategies for LinkedIn",
    channelName: "B2B Marketing Insights",
    thumbnailUrl: "https://img.youtube.com/vi/vN4jQKk-MZI/maxresdefault.jpg",
    views: "328K",
    date: "2 months ago",
    duration: "22:37"
  },
  {
    id: "pQFo8JWgHEU",
    title: "Creating Video Content for Professional Audiences",
    channelName: "Video Creators",
    thumbnailUrl: "https://img.youtube.com/vi/pQFo8JWgHEU/maxresdefault.jpg",
    views: "421K",
    date: "5 weeks ago",
    duration: "14:52"
  },
  {
    id: "lD3FfI7zNc4",
    title: "LinkedIn Ads: Complete 2023 Tutorial",
    channelName: "Digital Marketing Pro",
    thumbnailUrl: "https://img.youtube.com/vi/lD3FfI7zNc4/maxresdefault.jpg",
    views: "612K",
    date: "3 months ago",
    duration: "26:14"
  },
  {
    id: "X9YmkKbTgmk",
    title: "How to Write LinkedIn Posts That Convert",
    channelName: "Content Masters",
    thumbnailUrl: "https://img.youtube.com/vi/X9YmkKbTgmk/maxresdefault.jpg",
    views: "287K",
    date: "4 weeks ago",
    duration: "19:08"
  },
  {
    id: "aW7lJMroT2c",
    title: "LinkedIn Algorithm: What Works in 2023",
    channelName: "Social Media Today",
    thumbnailUrl: "https://img.youtube.com/vi/aW7lJMroT2c/maxresdefault.jpg",
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
              <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-lg">
                {/* Show AI content from transcript instead of video */}
                <div className="border-b-2 border-black">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-white">
                    <h3 className="font-bold text-lg mb-2">{selectedVideo.title}</h3>
                    <p className="text-sm text-gray-700">AI-generated carousel from your video</p>
                  </div>
                </div>
                <div className="p-4">
                  {/* Show the current transcript point as the current slide */}
                  <div className="rounded-lg border border-gray-200 p-4 mb-3 bg-white shadow-sm min-h-[120px] relative">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-600">SLIDE {currentSlide + 1} OF {generatedTranscript.length}</span>
                    </div>
                    <p className="text-base font-medium">{generatedTranscript[currentSlide]}</p>
                    
                    {/* Navigation buttons */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-1">
                      <Button 
                        onClick={prevSlide} 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 rounded-full bg-gray-200/80 hover:bg-gray-300/80 text-gray-700"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous slide</span>
                      </Button>
                      <Button 
                        onClick={nextSlide} 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 rounded-full bg-gray-200/80 hover:bg-gray-300/80 text-gray-700"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next slide</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {generatedTranscript.map((_, index) => (
                        <React.Fragment key={index}>
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                              index === currentSlide ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => setCurrentSlide(index)}
                          >
                            {index + 1}
                          </div>
                          {index < generatedTranscript.length - 1 && (
                            <div className={`h-1 w-4 rounded-full ${
                              index === currentSlide || index + 1 === currentSlide ? 'bg-black' : 'bg-gray-300'
                            }`}></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
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