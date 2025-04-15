import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, ChevronRight, Upload, CheckCircle,
  Lightbulb, AlertCircle, Info, Calendar, Youtube,
  FileText, Image, Link, PlusCircle, Eye, Pencil,
  Play, Clock, Video
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

// Form schema for carousel request
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title can't exceed 100 characters"),
  youtubeUrl: z.string().url("Please enter a valid YouTube URL").optional(),
  videoId: z.string().min(1, "Please select a video").optional()
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

const RequestCarouselPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('youtube');
  const [success, setSuccess] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Sample YouTube videos
  const sampleVideos: YouTubeVideo[] = [
    {
      id: 'video-1',
      title: 'The Future of Remote Work - Trends and Predictions',
      channelName: 'Business Insights',
      thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      duration: '15:32',
      views: '245K',
      date: '2 weeks ago'
    },
    {
      id: 'video-2',
      title: '5 Ways to Boost Team Productivity in 2024',
      channelName: 'Leadership Academy',
      thumbnailUrl: 'https://i.ytimg.com/vi/Zi_XLOBDo_Y/mqdefault.jpg',
      duration: '8:45',
      views: '128K',
      date: '1 month ago'
    },
    {
      id: 'video-3',
      title: 'How to Build a Personal Brand on LinkedIn',
      channelName: 'Career Development',
      thumbnailUrl: 'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg',
      duration: '12:18',
      views: '89K',
      date: '3 weeks ago'
    },
    {
      id: 'video-4',
      title: 'Marketing Strategies That Actually Work in 2024',
      channelName: 'Marketing Mastery',
      thumbnailUrl: 'https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg',
      duration: '17:05',
      views: '175K',
      date: '5 days ago'
    }
  ];

  // Sample transcript sections
  const sampleTranscript = [
    "In today's video, we're going to explore five key strategies to boost team productivity in the modern workplace.",
    "First, establish clear goals and expectations. When team members understand what's expected of them, they can focus their efforts more effectively.",
    "Second, implement the right collaboration tools. Technology should enhance communication, not complicate it.",
    "Third, encourage regular breaks and prevent burnout. Studies show that short breaks throughout the day actually increase overall productivity.",
    "Fourth, streamline meetings to make them more efficient. Consider whether a meeting is necessary or if the information could be shared in another format.",
    "And finally, recognize and reward achievements. Acknowledging good work boosts morale and motivates continued performance."
  ];

  // Initialize form
  const form = useForm<CarouselRequestForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      youtubeUrl: '',
      videoId: ''
    }
  });

  // YouTube URL validation and scraping
  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('youtubeUrl', url);
    
    // Just basic URL validation for now
    if (url && url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      // Simulate scraping - in a real app, you'd call your backend API to scrape the content
      toast.info("Scraping content from YouTube...", {
        duration: 1500
      });
      
      // Set a sample video as selected after a short delay
      setTimeout(() => {
        setSelectedVideo(sampleVideos[1]);
        form.setValue('videoId', sampleVideos[1].id);
        setShowTranscript(true);
      }, 1500);
    }
  };

  // Video selection handler
  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    form.setValue('videoId', video.id);
    form.setValue('title', video.title); // Pre-fill the title with the video title
    setShowTranscript(true);
    
    toast.success(`Selected video: ${video.title}`);
  };

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        toast.success(`File "${file.name}" uploaded successfully`);
      } else {
        toast.error('Please upload a PDF or image file');
      }
    }
  };

  // Form submission handler
  const onSubmit = async (data: CarouselRequestForm) => {
    setIsSubmitting(true);
    
    try {
      // Add file info to the submission
      const submissionData = {
        ...data,
        hasAttachment: !!selectedFile,
        attachmentName: selectedFile?.name,
        contentSource: activeTab,
        selectedVideo: selectedVideo
      };
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form data submitted:', submissionData);
      
      // Show success state
      setSuccess(true);
      toast.success('Carousel request submitted successfully!');
      
      // Reset form after submission
      form.reset();
      setSelectedFile(null);
      setSelectedVideo(null);
      setShowTranscript(false);
      
      // After a delay, redirect to carousels page
      setTimeout(() => {
        navigate('/dashboard/my-carousels');
      }, 3000);
    } catch (error) {
      console.error('Error submitting carousel request:', error);
      toast.error('Failed to submit carousel request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view after submission
  if (success) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-green-500">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-3">Carousel Request Submitted!</h1>
          <p className="text-black mb-8 max-w-lg mx-auto">
            Our team will review your request and deliver your professional carousel within 24 hours.
            You'll receive a notification when it's ready.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigate('/dashboard/my-carousels')} className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              View My Carousels
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/home')}
            >
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create LinkedIn Carousel</h1>
        <p className="text-black">
          Upload content or paste a YouTube URL to create a professional carousel for your LinkedIn profile
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Content Source */}
        <div className="lg:w-1/2">
          <Card className="mb-6">
              <CardHeader>
              <CardTitle>Content Source</CardTitle>
                <CardDescription>
                Choose how you want to provide your content
                </CardDescription>
              </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carousel Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5 Ways to Boost Team Productivity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                  {/* Content Source Tabs */}
                  <Tabs 
                    defaultValue="youtube" 
                    className="w-full"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="youtube" className="flex items-center gap-2">
                        <Youtube className="h-4 w-4" />
                        YouTube
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload File
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* YouTube Content Tab */}
                    <TabsContent value="youtube" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                        name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                            <FormLabel>YouTube Video URL</FormLabel>
                      <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="https://www.youtube.com/watch?v=..." 
                          {...field} 
                                  onChange={handleYoutubeUrlChange}
                        />
                                <Youtube className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                      </FormControl>
                      <FormDescription>
                              We'll automatically extract content from the video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                      {/* Select from Recent Videos Section */}
                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-3">Or select from recent videos:</h3>
                        <div className="space-y-3">
                          {sampleVideos.map(video => (
                            <div 
                              key={video.id}
                              className={cn(
                                "border rounded-lg p-3 flex gap-3 cursor-pointer hover:border-primary transition-all duration-200",
                                selectedVideo?.id === video.id ? "border-primary-500 border-2 bg-primary-50" : "border-gray-200"
                              )}
                              onClick={() => handleVideoSelect(video)}
                            >
                              <div className="w-24 h-16 bg-gray-100 rounded-md relative flex-shrink-0">
                                <img 
                                  src={video.thumbnailUrl} 
                                  alt={video.title}
                                  className="w-full h-full object-cover rounded-md"
                                />
                                <div className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
                                  {video.duration}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">{video.channelName}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                  <span>{video.views} views</span>
                                  <span>•</span>
                                  <span>{video.date}</span>
                                </div>
                              </div>
                              {selectedVideo?.id === video.id && (
                                <div className="flex items-center ml-auto">
                                  <Badge className="bg-primary">Selected</Badge>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Show transcript section if a video is selected */}
                      {showTranscript && selectedVideo && (
                        <div className="mt-6 p-4 border rounded-lg bg-blue-50">
                          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            Video Transcript
                          </h3>
                          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {sampleTranscript.map((paragraph, index) => (
                              <p key={index} className="text-xs text-black">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                          <div className="mt-3 pt-2 border-t border-blue-100 flex items-center justify-between">
                            <span className="text-xs text-blue-600">
                              Our AI will generate carousel slides based on this content
                            </span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              className="text-xs"
                              onClick={() => setShowTranscript(false)}
                            >
                              Hide transcript
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    {/* File Upload Tab */}
                    <TabsContent value="upload" className="mt-4">
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-white">
                        <div className="flex flex-col items-center">
                          {!selectedFile ? (
                            <>
                              <Upload className="h-10 w-10 text-blue-400 mb-3" />
                              <h3 className="text-lg font-medium mb-2">Upload Content</h3>
                              <p className="text-sm text-black mb-4 max-w-md">
                                Drag and drop your PDF, PowerPoint, or image files here, or click to browse
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="mb-3">
                                {selectedFile.type.includes('image') ? (
                                  <Image className="h-10 w-10 text-blue-400" />
                                ) : (
                                  <FileText className="h-10 w-10 text-blue-400" />
                                )}
                              </div>
                              <h3 className="text-lg font-medium mb-1">{selectedFile.name}</h3>
                              <p className="text-sm text-black mb-4">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </>
                          )}
                          
                      <Input
                        id="file-upload"
                        type="file"
                            accept=".pdf,.ppt,.pptx,.doc,.docx,image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                            className="border-blue-300"
                      >
                        {selectedFile ? 'Change File' : 'Select File'}
                      </Button>
                    </div>
                  </div>
                    </TabsContent>
                  </Tabs>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !form.formState.isValid || (activeTab === 'youtube' && !selectedVideo)} 
                      className="min-w-[150px]"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Carousel'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/dashboard/templates')}
                    >
                      See Templates
                    </Button>
                </div>
                </form>
              </Form>
              </CardContent>
            </Card>
        </div>
            
        {/* Right Column - Preview */}
        <div className="lg:w-1/2">
              <Card>
                <CardHeader>
              <CardTitle>Carousel Preview</CardTitle>
                  <CardDescription>
                Example of how your carousel might look
                  </CardDescription>
                </CardHeader>
                <CardContent>
              {selectedVideo ? (
                <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-lg">
                  {/* Sample carousel preview based on selected video */}
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-r from-blue-50 to-white border-b-2 border-black flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="text-xl font-bold text-black">{selectedVideo.title}</h3>
                        <p className="text-sm text-black mt-2">Based on {selectedVideo.channelName} video</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
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