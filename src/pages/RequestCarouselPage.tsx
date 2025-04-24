import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Info, Upload, Search, LayoutGrid, ChevronLeft, ChevronRight, Youtube, FileText, Loader2, ArrowRight, MessageSquare, Sparkles, FileSpreadsheet, ExternalLink, ImageIcon, Clock4, SearchX, Folder, Save, Copy, Pencil, ChevronDown, Play, Edit } from "lucide-react";
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
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import OpenAI from 'openai';
import { Slide, FontFamily, FontWeight, TextAlign } from "@/editor/types";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";

// OpenAI configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

// Model options with fallbacks
const AI_MODELS = {
  primary: "gpt-4.1",
  fallback: "gpt-3.5-turbo"
};

// Add a function to try different models with fallback
async function generateWithOpenAI(messages: any[], modelOptions: typeof AI_MODELS = AI_MODELS) {
  try {
    // Try with primary model first
    console.log(`Attempting to generate content with ${modelOptions.primary} model`);
    const completion = await openai.chat.completions.create({
      model: modelOptions.primary,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    });
    
    return completion;
  } catch (error: any) {
    // If we hit a rate limit and have a fallback model, try that
    if (
      (error?.message?.includes('429') || 
       error?.message?.includes('rate limit') || 
       error?.message?.includes('quota')) && 
      modelOptions.fallback
    ) {
      console.log(`Rate limit hit with ${modelOptions.primary}, trying fallback model ${modelOptions.fallback}`);
      
      // Use fallback model
      const completion = await openai.chat.completions.create({
        model: modelOptions.fallback,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      });
      
      return completion;
    }
    
    // If fallback fails or there's another error, rethrow
    throw error;
  }
}

// Define prompts for content generation
const PROMPTS = {
  'post-short': `Use this YouTube transcript to write a LinkedIn short-form written post: "\${transcript}"

Apply the following rules **strictly**:

1. **Completely rephrase** everything — including headings, examples, analogies, and figures.
2. **Do not use this symbol: "-"**
3. **Change every number, example, and order of pointers** to ensure it's 100 percent untraceable.
4. **Create a fresh, original headline** that is attention-grabbing and not similar to the video title.
5. **Restructure the flow** — don't just summarize sequentially. Rearrange points for originality.
6. Use **short paragraphs** and leave **one line of space between each point**.
7. Keep the entire post **under 1000 characters**.
8. **Remove all bold text**, emojis, links, names, tool references, or brand mentions.
9. Use a **casual, founder-style tone** that feels like expert advice being shared.
10. Avoid storytelling. Focus on **insights, learnings, and takeaways**.
11. **No hashtags**, no promotional CTAs. Just a clean, high-value post.
12. Make sure the Hook/introduction line is not completely out of place, it should be an opener to the whole content to follow.`,

  'post-long': `Use this YouTube transcript to write a LinkedIn long-form written post: "\${transcript}"

Apply the following rules **strictly**:

1. **Completely rephrase** everything — including headings, examples, analogies, and figures.
2. **Do not use this symbol: "-"**
3. **Change every number, example, and order of pointers** to ensure it's 100 percent untraceable.
4. **Create a fresh, original headline** that is attention-grabbing and not similar to the video title.
5. **Restructure the flow** — don't just summarize sequentially. Rearrange points for originality.
6. Use **short paragraphs** and leave **one line of space between each point**.
7. Keep the entire post **under 2000 characters**.
8. **Remove all bold text**, emojis, links, names, tool references, or brand mentions.
9. Use a **casual, founder-style tone** that feels like expert advice being shared.
10. Avoid storytelling. Focus on **insights, learnings, and takeaways**.
11. **No hashtags**, no promotional CTAs. Just a clean, high-value post.
12. Make sure the Hook/introduction line is not completely out of place, it should be an opener to the whole content to follow.`,

  'carousel': `Use this YouTube transcript to turn the content into a LinkedIn carousel post: "\${transcript}"

Follow all the rules below exactly:

1. Create a **new, scroll-stopping hook** for Slide 1 — do not use the YouTube title.
2. **Do not use this symbol: "-" "--**
3. Every slide should contain a **short heading integrated into the paragraph**, not on a separate line.
4. Each slide must be **fully rephrased** — change examples, numbers, order of points, and structure.
5. Use **short sentences or bullets**, with clear spacing for readability.
6. **No names, no brands, no tools**, no external mentions.
7. Remove all **bold text**, unnecessary line breaks, and symbols.
8. The tone should be **easy to understand**, like a founder breaking down a playbook.
9. Include **takeaways or a conclusion slide**, but without CTAs or promotions.
10. The flow should feel **logical and punchy**, not robotic or templated.
11. Avoid fluff. Every slide should add **clear value or insight**.
12. Separate each slide with "\n\n" to indicate a new slide.
13. Make sure the Hook/introduction line is not completely out of place, it should be an opener to the whole content to follow.
14. Make sure the carousel is not too long, it should be 8-10 slides max.`
};

// Define the form schema for validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  youtubeUrl: z.string().optional(),
});

// Interface for YouTube video
interface YouTubeVideo {
  id: string;
  title: string;
  channelName?: string;
  thumbnailUrl?: string;
  views?: string;
  date?: string;
  duration?: string;
  requestDate?: Date;
  deliveryDate?: Date;
  slideCount?: number;
  videoUrl?: string;
  source?: 'youtube';
  status?: string;
  transcript?: string;
  formattedTranscript?: string[];
  language?: string;
  is_generated?: boolean;
  savedTimestamp?: string;
  videoId?: string;
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

// Content generation types
interface ContentGenerationOptions {
  type: 'post-short' | 'post-long' | 'carousel';
  title: string;
  icon: React.ReactNode;
}

// Add interfaces for saved content
interface SavedContent {
  id: string;
  title: string;
  content: string;
  type: 'post-short' | 'post-long' | 'carousel';
  videoId?: string;
  videoTitle?: string;
  createdAt: string;
}

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

// Add function to prepare carousel data for editor
const prepareCarouselForEditor = (content: string): Slide[] => {
  if (!content) return [];
  
  console.log("Preparing carousel content for editor:", content);
  
  // Process the content to remove standalone "Slide X" slides and clean slide content
  const rawSlides = content.split('\n\n').filter(s => s.trim());
  const textSlides = [];
  
  for (let i = 0; i < rawSlides.length; i++) {
    const current = rawSlides[i].trim();
    
    // Skip slides that only contain "Slide X" and nothing else
    if (/^Slide\s*\d+\s*$/.test(current)) {
      continue;
    }
    
    // Remove "Slide X:" prefix if it exists
    textSlides.push(current.replace(/^Slide\s*\d+[\s:.]+/i, '').trim());
  }
  
  console.log("Created text slides:", textSlides.length);
  
  // LinkedIn slide dimensions are 1080x1080
  const SLIDE_WIDTH = 1080;
  const SLIDE_HEIGHT = 1080;
  
  // Create slides in Konva-compatible format
  const konvaSlides = textSlides.map((slideText) => ({
    id: uuidv4(),
    backgroundColor: '#ffffff',
    nodes: [
      {
        id: uuidv4(),
        type: 'text', 
        text: slideText,
        position: { 
          x: 140, 
          y: 290
        },
        fontSize: 24,
        fontFamily: 'inter',
        fill: '#000000',
        width: 800,
        height: 500,
        align: 'center',
        draggable: true,
        zIndex: 1
      }
    ]
  }));
  
  console.log("Formatted konva slides:", konvaSlides.length);
  
  return konvaSlides as unknown as Slide[];
};

const RequestCarouselPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
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
  const [savedVideos, setSavedVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  
  // Transcript fetching states
  const [isFetchingTranscript, setIsFetchingTranscript] = useState(false);
  const [fetchingVideoId, setFetchingVideoId] = useState<string | null>(null);

  // Content generation states
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [previewType, setPreviewType] = useState<string>('');

  // Add state for saved content
  const [savedContents, setSavedContents] = useState<SavedContent[]>([]);
  const [showSavedContents, setShowSavedContents] = useState(false);

  // Add state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');

  // Safe date formatter function to use throughout the component
  const safeFormatDate = (date: any, formatString: string = 'MMM d, yyyy'): string => {
    try {
      if (!date) return 'Unknown date';
      
      // If it's already a Date object
      if (date instanceof Date) {
        return isNaN(date.getTime()) ? 'Unknown date' : format(date, formatString);
      }
      
      // Try parsing as string
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? 'Unknown date' : format(parsedDate, formatString);
      }
      
      // If it's a number (timestamp)
      if (typeof date === 'number' && !isNaN(date)) {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? 'Unknown date' : format(parsedDate, formatString);
      }
      
      return 'Unknown date';
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Unknown date';
    }
  };

  // Load saved videos from localStorage and backend
  useEffect(() => {
    const loadSavedVideos = async () => {
      setIsLoadingVideos(true);
      let videos = [];
      
      try {
        // First try to get videos from the backend
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/youtube/get-saved-videos`
          : `${baseUrl}/api/youtube/get-saved-videos`;
          
        try {
          const response = await axios.get(apiUrl, {
            params: { userId: user?.id || 'anonymous' }
          });
          
          if (response.data && response.data.success) {
            const backendVideos = response.data.videos || [];
            videos = [...backendVideos];
            
            // Now also get videos from localStorage and merge them
            const savedVideosString = localStorage.getItem('savedYoutubeVideos');
            if (savedVideosString) {
              const localVideos = JSON.parse(savedVideosString);
              
              // Create a map of existing backend videos by ID to avoid duplicates
              const existingVideoIds = new Set(videos.map((v: any) => v.id));
              
              // Add local videos that aren't already in backend videos
              const uniqueLocalVideos = localVideos.filter((v: any) => !existingVideoIds.has(v.id));
              videos = [...videos, ...uniqueLocalVideos];
            }
          }
        } catch (backendError) {
          console.warn("Error fetching from backend, using localStorage only:", backendError);
          // If backend fetch fails, use localStorage only
          const savedVideosString = localStorage.getItem('savedYoutubeVideos');
          if (savedVideosString) {
            videos = JSON.parse(savedVideosString);
          }
        }
        
        // Convert to YouTubeVideo format with extra safety
        const processedVideos = videos.map((video: any) => {
          try {
            // Create a valid date object or fallback to current date
            const safeDate = (dateInput: any) => {
              if (!dateInput) return new Date();
              
              try {
                // If it's already a Date object
                if (dateInput instanceof Date) {
                  return isNaN(dateInput.getTime()) ? new Date() : dateInput;
                }
                
                // Try parsing as string
                if (typeof dateInput === 'string') {
                  const parsedDate = new Date(dateInput);
                  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
                }
                
                // If it's a number (timestamp)
                if (typeof dateInput === 'number' && !isNaN(dateInput)) {
                  const parsedDate = new Date(dateInput);
                  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
                }
                
                return new Date();
              } catch (e) {
                console.error("Error parsing date:", e);
                return new Date();
              }
            };
            
            // Get safe videoId - make sure we're consistently using the same ID field
            const videoId = video.videoId || video.id || '';
            
            // Store the original savedAt/requestDate for sorting
            const savedTimestamp = video.savedTimestamp || video.savedAt || video.requestDate || video.upload_date || new Date().toISOString();
            
            return {
              id: videoId,
              title: video.title || 'YouTube Video',
              channelName: video.channelName || "Your Saved Video",
              status: video.status || 'ready',
              thumbnailUrl: video.thumbnailUrl || video.thumbnail || 
                (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined),
              requestDate: safeDate(video.requestDate || video.savedAt), // Try savedAt as fallback
              deliveryDate: safeDate(video.deliveryDate),
              slideCount: video.slideCount || 5,
              videoUrl: video.videoUrl || video.url || (videoId ? `https://youtube.com/watch?v=${videoId}` : undefined),
              views: video.view_count ? video.view_count.toLocaleString() : "Saved",
              date: safeFormatDate(safeDate(video.requestDate || video.savedAt || video.upload_date), "MMM d, yyyy"),
              duration: video.duration || "Saved",
              source: 'youtube' as const,
              // Preserve transcript data
              transcript: video.transcript || "",
              formattedTranscript: video.formattedTranscript || [],
              language: video.language || "Unknown",
              is_generated: video.is_generated || false,
              videoId: videoId, // Ensure videoId is explicitly set
              savedTimestamp: savedTimestamp // Keep original timestamp for sorting
            };
          } catch (itemError) {
            console.error("Error processing video item:", itemError);
            // Return a safe default item if individual parsing fails
            return {
              id: Math.random().toString(36).substring(2, 9),
              title: 'YouTube Video',
              channelName: "Your Saved Video",
              status: 'ready',
              requestDate: new Date(),
              deliveryDate: new Date(),
              slideCount: 5,
              source: 'youtube' as const,
              views: "Saved",
              date: "Unknown",
              duration: "Saved",
              formattedTranscript: generateDummyTranscript(Math.random().toString(36).substring(2, 9)),
              savedTimestamp: new Date().toISOString() // Add timestamp for sorting
            };
          }
        });
        
        // Sort videos by savedTimestamp (most recent first)
        processedVideos.sort((a, b) => {
          const dateA = new Date(a.savedTimestamp || 0);
          const dateB = new Date(b.savedTimestamp || 0);
          return dateB.getTime() - dateA.getTime(); // Most recent first
        });
        
        setSavedVideos(processedVideos);
      } catch (error) {
        console.error('Error loading saved videos:', error);
        toast({
          title: "Error",
          description: "Failed to load your saved videos",
          variant: "destructive"
        });
        setSavedVideos([]);
      } finally {
        setIsLoadingVideos(false);
      }
    };
    
    loadSavedVideos();
    
    // Set up a listener to reload when localStorage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedYoutubeVideos') {
        loadSavedVideos();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [toast, user?.id]);

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
    if (previewContent && previewType === 'carousel') {
      const slides = previewContent.split('\n\n').filter(s => s.trim());
      if (slides.length > 0) {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        return;
      }
    }
    
    // Fallback for when there's no content yet or for regular transcript slides
    if (generatedTranscript.length > 0) {
      setCurrentSlide((prev) => (prev === generatedTranscript.length - 1 ? 0 : prev + 1));
    }
  };

  // Handle previous slide
  const prevSlide = () => {
    if (previewContent && previewType === 'carousel') {
      const slides = previewContent.split('\n\n').filter(s => s.trim());
      if (slides.length > 0) {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        return;
      }
    }
    
    // Fallback for when there's no content yet or for regular transcript slides
    if (generatedTranscript.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? generatedTranscript.length - 1 : prev - 1));
    }
  };

  // Handle video selection
  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    
    // Set video URL to form based on video ID or videoUrl property
    if (video.videoUrl) {
      form.setValue("youtubeUrl", video.videoUrl);
    } else if (video.id) {
      form.setValue("youtubeUrl", `https://youtube.com/watch?v=${video.id}`);
    }
    
    // Check if the video has a formatted transcript (array of bullet points)
    if (video.formattedTranscript && Array.isArray(video.formattedTranscript) && video.formattedTranscript.length > 0) {
      setGeneratedTranscript(video.formattedTranscript);
      setShowTranscript(true);
      setCurrentSlide(0);
    } 
    // Check if the video has a regular transcript that needs to be formatted
    else if (video.transcript && typeof video.transcript === 'string' && video.transcript.length > 10) {
      const formatted = formatTranscript(video.transcript);
      setGeneratedTranscript(formatted);
      setShowTranscript(true);
      setCurrentSlide(0);
    } 
    // Show empty transcript with fetch option
    else {
      setGeneratedTranscript([]);
      setShowTranscript(true);
      setCurrentSlide(0);
    }
    
    toast({
      title: "Video selected",
      description: "Content from this video will be used for your carousel.",
    });
  };

  // Format transcript into readable bullet points
  const formatTranscript = (transcript: string): string[] => {
    if (!transcript) return [];
    
    // Just return the raw transcript as a single item in the array
    return [transcript];
  };

  // Watch video handler
  const handleWatchVideo = (video: YouTubeVideo) => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
      toast({
        title: "Opening video",
        description: "Opening YouTube video in a new tab",
      });
    } else if (video.id) {
      window.open(`https://youtube.com/watch?v=${video.id}`, '_blank');
      toast({
        title: "Opening video",
        description: "Opening YouTube video in a new tab",
      });
    }
  };

  // Fetch transcript for a video
  const handleFetchTranscript = async (video: YouTubeVideo) => {
    if (!video.id && !video.videoId) {
      toast({
        title: "Error",
        description: "Cannot fetch transcript: Video ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    const videoId = video.videoId || video.id;
    setFetchingVideoId(videoId);
    setIsFetchingTranscript(true);
    
    try {
      // Get API URL
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = `${baseUrl}/api/youtube/transcript`;
      
      const response = await axios.post(apiUrl, {
        videoId,
        useScraperApi: true // Use ScraperAPI to avoid rate limits
      });
      
      if (response.data && response.data.success) {
        const transcriptText = response.data.transcript;
        
        // Update the saved videos with the new transcript
        const updatedVideos = savedVideos.map(v => {
          if (v.id === videoId || v.videoId === videoId) {
            return {
              ...v,
              transcript: transcriptText,
              formattedTranscript: [transcriptText], // Store as a single item
              language: response.data.language || "Unknown",
              is_generated: response.data.is_generated || false
            };
          }
          return v;
        });
        
        // Update local state
        setSavedVideos(updatedVideos);
        
        // If this is the currently selected video, update the transcript display
        if (selectedVideo && (selectedVideo.id === videoId || selectedVideo.videoId === videoId)) {
          setGeneratedTranscript([transcriptText]);
          setShowTranscript(true);
          setCurrentSlide(0);
        }
        
        // Save to localStorage
        localStorage.setItem('savedYoutubeVideos', JSON.stringify(updatedVideos));
        
        // Save to backend
        try {
          const saveTranscriptApiUrl = baseUrl.endsWith('/api')
            ? `${baseUrl}/youtube/save-transcript`
            : `${baseUrl}/api/youtube/save-transcript`;
          
          await axios.post(saveTranscriptApiUrl, {
            userId: user?.id || 'anonymous',
            videoId: videoId,
            transcript: transcriptText,
            formattedTranscript: [transcriptText], // Store as a single item
            language: response.data.language || "Unknown",
            is_generated: response.data.is_generated || false
          });
          
          console.log("Transcript saved to backend successfully");
        } catch (backendError) {
          console.error("Failed to save transcript to backend:", backendError);
          // Continue with local state update even if backend save fails
        }
        
        toast({
          title: "Success",
          description: "Transcript fetched successfully"
        });
      } else {
        throw new Error(response.data?.message || 'Failed to fetch transcript');
      }
    } catch (error) {
      console.error('Error fetching transcript:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transcript. The video might not have captions.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingTranscript(false);
      setFetchingVideoId(null);
    }
  };

  // LinkedIn content generation options
  const contentGenerationOptions: ContentGenerationOptions[] = [
    {
      type: 'post-short',
      title: 'Short Post',
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      type: 'post-long',
      title: 'Long Post',
      icon: <FileText className="h-4 w-4" />
    },
    {
      type: 'carousel',
      title: 'Carousel',
      icon: <FileSpreadsheet className="h-4 w-4" />
    }
  ];

  // Update the handleGenerateContent function with better error handling and fallback
  const handleGenerateContent = async (type: string) => {
    if (!selectedVideo || !selectedVideo.transcript) {
      toast({
        title: "No transcript available",
        description: "Please fetch a transcript first to generate content",
        variant: "destructive"
      });
      return;
    }

    setSelectedContentType(type);
    setIsGeneratingContent(true);
    setShowContentGenerator(true);
    
    try {
      // Get the appropriate prompt based on the selected content type
      const promptTemplate = PROMPTS[type as keyof typeof PROMPTS];
      
      // Replace the transcript placeholder with the actual transcript
      const prompt = promptTemplate.replace('${transcript}', selectedVideo.transcript || '');
      
      // Set up title based on content type
      let title = '';
      switch (type) {
        case 'post-short':
          title = 'Short LinkedIn Post';
          break;
        case 'post-long':
          title = 'Long LinkedIn Post';
          break;
        case 'carousel':
          title = 'LinkedIn Carousel';
          break;
        default:
          title = 'LinkedIn Content';
      }
      
      try {
        // Log the request
        console.log(`Generating ${type} content with OpenAI API`);
        
        // Prepare the messages
        const messages = [
          { 
            role: "system", 
            content: "You are an expert content creator for LinkedIn, generating high-quality posts from YouTube transcripts." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ];
        
        // Call the OpenAI API with fallback support
        const completion = await generateWithOpenAI(messages);
        
        // Log the response
        console.log(`OpenAI API response received for ${type} content:`, {
          model: completion.model,
          usage: completion.usage,
          finishReason: completion.choices[0]?.finish_reason
        });
        
        // Get the generated content
        let generatedContent = completion.choices[0]?.message?.content || '';
        
        // If it's a carousel, clean up slide prefixes and any standalone "Slide X" occurrences
        if (type === 'carousel') {
          // Split by double newlines to get individual slides
          const rawSlides = generatedContent.split('\n\n').filter(s => s.trim());
          
          // Process slides to remove "Slide X" prefix slides and clean remaining slide content
          const cleanedSlides = [];
          for (let i = 0; i < rawSlides.length; i++) {
            const current = rawSlides[i].trim();
            
            // Skip slides that only contain "Slide X" and nothing else
            if (/^Slide\s*\d+\s*$/.test(current)) {
              continue;
            }
            
            // Remove "Slide X:" prefix if it exists
            cleanedSlides.push(current.replace(/^Slide\s*\d+[\s:.]+/i, '').trim());
          }
          
          generatedContent = cleanedSlides.join('\n\n');
          console.log(`Generated carousel with ${cleanedSlides.length} cleaned slides`);
        }
        
        // Update state with the generated content
        setGeneratedContent(generatedContent);
        setPreviewContent(generatedContent);
        setPreviewTitle(title);
        setPreviewType(type);
        
        toast({
          title: "Content Generated",
          description: `Your ${title} has been created successfully`,
        });
      } catch (apiError: any) {
        console.error('OpenAI API error:', apiError);
        
        // Check if this is a rate limit error
        const isRateLimit = apiError?.message?.includes('429') || 
                            apiError?.message?.includes('rate limit') ||
                            apiError?.message?.includes('quota');
        
        // Fallback content if API fails
        let fallbackContent = '';
        
        if (type === 'post-short') {
          fallbackContent = `Unlocking Professional Growth Through Strategic Focus

${selectedVideo.formattedTranscript?.[0] || 'The key to success is identifying your strengths and doubling down on them.'}

I've found that allocating time for deliberate practice makes all the difference. The compound effect of small improvements creates remarkable results over time.

What strategies have worked best for your professional development journey?`;
        } else if (type === 'post-long') {
          fallbackContent = `The Untapped Potential of Deliberate Learning

Recently, I've been reflecting on how we approach professional development. Many of us wait for opportunities instead of creating them.

${selectedVideo.formattedTranscript?.[0] || 'The content provides valuable professional insights'}

${selectedVideo.formattedTranscript?.[1] || 'Professional growth requires consistent learning and adaptation'}

${selectedVideo.formattedTranscript?.[2] || 'Connecting with others in your field amplifies your impact'}

These principles have transformed how I approach work challenges. By incorporating structured learning into my weekly schedule, I've been able to develop skills that were previously outside my comfort zone.

What learning methods have yielded the best results for you? I'm curious to hear about your experiences.`;
        } else {
          fallbackContent = `Mastering Professional Growth in Today's Landscape

First key point from the video

Second key insight

Third important concept

Fourth valuable takeaway

Implementation is key. Start small, be consistent, and track your progress.

What strategies have worked best for you? Share your experiences in the comments.`;
        }
        
        setGeneratedContent(fallbackContent);
        setPreviewContent(fallbackContent);
        setPreviewTitle(title);
        setPreviewType(type);
        
        toast({
          title: isRateLimit ? "API Quota Exceeded" : "Using Offline Content",
          description: isRateLimit 
            ? "The AI service quota has been exceeded. We've provided alternative content for you to use."
            : "We couldn't connect to the AI service, but we've generated content for you to use.",
          variant: isRateLimit ? "destructive" : "default"
        });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Close content generator
  const handleCloseContentGenerator = () => {
    setShowContentGenerator(false);
    setGeneratedContent('');
    setSelectedContentType(null);
    localStorage.removeItem('lastGeneratedContent');
  };

  // Filter videos based on search query
  const filteredVideos = searchQuery 
    ? savedVideos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.channelName && video.channelName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : savedVideos;
  
  // Calculate pagination for YouTube videos
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  
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

  // Add safety checks in the carousel preview section
  const getCarouselSlides = (content: string | null | undefined) => {
    if (!content) return [];
    
    // First, split by double newlines to get individual slides
    const rawSlides = content.split('\n\n').filter(s => s.trim());
    
    // Now process slides to remove "Slide X" prefix slides and clean remaining slide content
    const processedSlides = [];
    for (let i = 0; i < rawSlides.length; i++) {
      const current = rawSlides[i].trim();
      
      // Skip slides that only contain "Slide X" and nothing else
      if (/^Slide\s*\d+\s*$/.test(current)) {
        continue;
      }
      
      // Remove "Slide X:" prefix if it exists
      processedSlides.push(current.replace(/^Slide\s*\d+[\s:.]+/i, '').trim());
    }
    
    return processedSlides;
  };

  const getCarouselSlideCount = (content: string | null | undefined) => {
    const slides = getCarouselSlides(content);
    return slides.length || 7; // Default to 7 if no slides
  };

  const getCarouselSlideContent = (content: string | null | undefined, index: number) => {
    const slides = getCarouselSlides(content);
    if (slides.length === 0) return 'Carousel slide content';
    
    // Ensure index is within bounds
    const safeIndex = Math.min(index, slides.length - 1);
    return slides[safeIndex] || 'Carousel slide content';
  };

  // Update the current slide logic to prevent out-of-bounds errors
  useEffect(() => {
    // When content changes, reset to first slide
    setCurrentSlide(0);
  }, [previewContent, previewType]);

  useEffect(() => {
    // Ensure current slide is always in bounds
    if (previewContent && previewType === 'carousel') {
      const slides = getCarouselSlides(previewContent);
      if (slides.length > 0 && currentSlide >= slides.length) {
        setCurrentSlide(slides.length - 1);
      }
    }
  }, [currentSlide, previewContent, previewType]);

  // Add function to load saved content from localStorage
  const loadSavedContents = () => {
    try {
      const savedContentStr = localStorage.getItem('savedLinkedInContents');
      if (savedContentStr) {
        const contents = JSON.parse(savedContentStr);
        setSavedContents(contents);
      }
    } catch (error) {
      console.error('Error loading saved contents:', error);
    }
  };

  // Add function to save content to localStorage
  const saveContent = () => {
    if (!generatedContent || !previewTitle || !previewType) {
      toast({
        title: "Nothing to save",
        description: "Please generate content first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Clean up any slide prefixes for carousel content
      let contentToSave = generatedContent;
      if (previewType === 'carousel') {
        contentToSave = generatedContent
          .split('\n\n')
          .map(slide => slide.replace(/^Slide\s*\d+[\s:.]+/i, '').trim())
          .join('\n\n');
      }
      
      // Create new saved content object
      const newContent: SavedContent = {
        id: Math.random().toString(36).substring(2, 15),
        title: previewTitle,
        content: contentToSave,
        type: previewType as 'post-short' | 'post-long' | 'carousel',
        videoId: selectedVideo?.id,
        videoTitle: selectedVideo?.title,
        createdAt: new Date().toISOString()
      };

      // Add to existing saved contents
      const updatedContents = [...savedContents, newContent];
      setSavedContents(updatedContents);

      // Save to localStorage
      localStorage.setItem('savedLinkedInContents', JSON.stringify(updatedContents));

      toast({
        title: "Content Saved",
        description: "The content has been saved and can be accessed anytime",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
    }
  };

  // Add function to delete saved content
  const deleteSavedContent = (id: string) => {
    try {
      const updatedContents = savedContents.filter(content => content.id !== id);
      setSavedContents(updatedContents);
      localStorage.setItem('savedLinkedInContents', JSON.stringify(updatedContents));

      toast({
        title: "Content Deleted",
        description: "The saved content has been removed",
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    }
  };

  // Add function to load saved content into preview
  const loadSavedContent = (content: SavedContent) => {
    let cleanedContent = content.content;
    // Clean up any slide prefixes for carousel content
    if (content.type === 'carousel') {
      cleanedContent = content.content
        .split('\n\n')
        .map(slide => slide.replace(/^Slide\s*\d+[\s:.]+/i, '').trim())
        .join('\n\n');
    }
    
    setGeneratedContent(cleanedContent);
    setPreviewContent(cleanedContent);
    setPreviewTitle(content.title);
    setPreviewType(content.type);
    setShowSavedContents(false);

    toast({
      title: "Content Loaded",
      description: "The saved content has been loaded to the preview",
    });
  };

  // Load saved contents on component mount
  useEffect(() => {
    loadSavedContents();
  }, []);

  // Add function to handle editing in editor
  const handleEditInEditor = () => {
    if (!previewContent || previewType !== 'carousel') {
      toast({
        title: "Cannot edit",
        description: "Only carousel content can be edited in the editor",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Log the content being processed for debugging
      console.log("Processing content for editor:", previewContent);
      
      // Create a mutable copy of the content to process
      let contentToProcess = previewContent;
      
      // First check if we have content with at least newlines
      if (!contentToProcess.includes('\n\n')) {
        // Try adding double newlines if it has single newlines
        if (contentToProcess.includes('\n')) {
          console.log("Content has single newlines, converting to double newlines");
          contentToProcess = contentToProcess.replace(/\n/g, '\n\n');
        } else {
          // If no newlines at all, this might be a single slide
          console.log("Content has no newlines, treating as single slide");
          contentToProcess = contentToProcess.trim();
        }
      }
      
      // Split by double newlines to get individual slides
      const rawSlides = contentToProcess.split('\n\n').filter(s => s.trim());
      console.log("Raw slides count:", rawSlides.length);
      
      // Process slides to remove any standalone "Slide X" slides and clean content
      const textSlides = [];
      for (let i = 0; i < rawSlides.length; i++) {
        const current = rawSlides[i].trim();
        
        // Skip slides that only contain "Slide X" and nothing else
        if (/^Slide\s*\d+\s*$/.test(current)) {
          continue;
        }
        
        // Remove "Slide X:" prefix if it exists
        textSlides.push(current.replace(/^Slide\s*\d+[\s:.]+/i, '').trim());
      }
      
      console.log("Processed slides for editor:", textSlides.length, textSlides);
      
      // If we have no slides after processing, try to create at least one slide
      if (textSlides.length === 0) {
        console.warn("No valid slides found, creating a fallback slide");
        textSlides.push(contentToProcess.trim() || "Your carousel content");
      }
      
      // LinkedIn slide dimensions - use 4:5 portrait ratio (1080x1350)
      const SLIDE_WIDTH = 1080;
      const SLIDE_HEIGHT = 1350;
      
      // Create slides in the exact format expected by the KonvaCarouselContext
      const konvaSlides = textSlides.map((slideText) => {
        // Create a unique ID for the slide
        const slideId = uuidv4();
        
        // Create a unique ID for the text node
        const textNodeId = uuidv4();
        
        return {
          id: slideId,
          backgroundColor: '#ffffff',
          nodes: [
            {
              id: textNodeId,
              type: 'text',
              text: slideText,
              position: { 
                x: Math.floor(SLIDE_WIDTH / 2 - 400), // Center horizontally (subtract half the width)
                y: Math.floor(SLIDE_HEIGHT / 2 - 200)  // Center vertically in the 4:5 format
              },
              fontSize: 28,
              fontFamily: 'inter',
              fill: '#000000',
              width: 800,
              height: 400,
              align: 'center',
              draggable: true,
              zIndex: 1
            }
          ]
        };
      });
      
      console.log("Created Konva slides for editor:", konvaSlides.length);
      
      // Set Canvas Size preference to PORTRAIT format (4:5 ratio)
      localStorage.setItem('canvas_size_preference', 'portrait');
      
      // Save to localStorage with the key the editor expects
      localStorage.setItem('editor_slides', JSON.stringify(konvaSlides));
      console.log("Saved Konva slides to localStorage");
      
      // Save additional debug info
      localStorage.setItem('slides_debug', JSON.stringify({
        format: 'konva',
        originalContent: previewContent,
        processedContent: contentToProcess,
        processedSlides: textSlides,
        konvaSlides: konvaSlides
      }));
      
      // Create a direct global variable for debugging (will be available in the browser console)
      // Using bracket notation to avoid TypeScript errors
      (window as any)['editorSlides'] = konvaSlides;
      (window as any)['slideCount'] = konvaSlides.length;
      
      // Navigate to editor
      navigate('/editor');
      
      toast({
        title: "Opening in editor",
        description: `Preparing ${konvaSlides.length} slides for editing (4:5 ratio)`
      });
    } catch (error) {
      console.error("Error preparing slides for editor:", error);
      toast({
        title: "Error",
        description: "Could not prepare slides for editing. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Load saved content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('lastGeneratedContent');
    if (savedContent) {
      try {
        const { content, title, type } = JSON.parse(savedContent);
        setGeneratedContent(content);
        setPreviewContent(content);
        setPreviewTitle(title);
        setPreviewType(type);
        setEditableContent(content);
        setShowContentGenerator(true);
      } catch (error) {
        console.error('Error loading saved content:', error);
      }
    }
  }, []);

  // Save content to localStorage whenever it changes
  useEffect(() => {
    if (generatedContent && previewTitle && previewType) {
      localStorage.setItem('lastGeneratedContent', JSON.stringify({
        content: generatedContent,
        title: previewTitle,
        type: previewType
      }));
    }
  }, [generatedContent, previewTitle, previewType]);

  // Handle content edit
  const handleContentEdit = (newContent: string) => {
    // Clean up slide numbers from the content
    const cleanContent = newContent
      .split('\n\n')
      .map(slide => slide.replace(/^Slide\s*\d+[\s:.]+/i, '').trim())
      .join('\n\n');
    
    setEditableContent(cleanContent);
    setPreviewContent(cleanContent);
  };

  // Handle edit mode toggle
  const toggleEditMode = () => {
    if (!isEditing) {
      // Entering edit mode - set content for editing
      setEditableContent(generatedContent);
    } else {
      // Exiting edit mode - save edited content
      if (previewType === 'carousel') {
        // Process the content to remove "Slide X:" prefixes from each slide
        const cleanContent = editableContent
          .split('\n\n')
          .map(slide => slide.replace(/^Slide\s*\d+[\s:.]+/i, '').trim())
          .join('\n\n');
        
        setGeneratedContent(cleanContent);
        setPreviewContent(cleanContent);
      } else {
        setGeneratedContent(editableContent);
        setPreviewContent(editableContent);
      }
    }
    // Toggle edit mode state
    setIsEditing(!isEditing);
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
                              <FormLabel>Select a Saved Video</FormLabel>
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Search by title"
                                  className="pl-8"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                              </div>
                              <FormDescription>
                                Select one of your saved videos to create a carousel
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {isLoadingVideos ? (
                        <div className="flex justify-center items-center py-12">
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                            <p>Loading your videos...</p>
                          </div>
                        </div>
                      ) : currentVideos.length > 0 ? (
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
                                {/* Transcript indicator badge */}
                                {(video.transcript || (video.formattedTranscript && video.formattedTranscript.length > 0)) && (
                                  <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    <span>Transcript</span>
                                  </div>
                                )}
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{video.channelName}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                  <span>{video.date}</span>
                                </div>
                                
                                {/* Transcript fetch button */}
                                <div 
                                  className="mt-2 pt-2 border-t flex justify-end" 
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {isFetchingTranscript && fetchingVideoId === video.id ? (
                                    <div className="w-full flex justify-center">
                                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    </div>
                                  ) : !(video.transcript || (video.formattedTranscript && video.formattedTranscript.length > 0)) ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFetchTranscript(video);
                                      }}
                                      className="text-xs h-7 px-2"
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      Get Transcript
                                    </Button>
                                  ) : (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                      Transcript Available
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center py-8 border border-dashed rounded-lg">
                          <div className="text-center">
                            <p className="mb-2 text-muted-foreground">No saved videos found</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate("/dashboard/scraper")}
                            >
                              <Youtube className="h-4 w-4 mr-2" />
                              Scrape new videos
                            </Button>
                          </div>
                        </div>
                      )}
                      
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
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-medium">Generated Transcript</h3>
                            {generatedTranscript.length === 0 && !isFetchingTranscript && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleFetchTranscript(selectedVideo)}
                                className="flex items-center gap-1"
                              >
                                <FileText className="h-4 w-4" />
                                Fetch Transcript
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            This transcript will be used to create your carousel slides:
                          </p>
                          
                          {isFetchingTranscript ? (
                            <div className="py-8 flex items-center justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                          ) : generatedTranscript.length > 0 ? (
                            <>
                              <ScrollArea className="h-[200px] rounded-md border p-4 mb-4">
                                <div>
                                  <p className="text-sm whitespace-pre-line">{generatedTranscript[0]}</p>
                                </div>
                              </ScrollArea>
                              
                              {/* LinkedIn Content Generation Section */}
                              <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="text-md font-medium flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                    Generate LinkedIn Content
                                  </h3>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowSavedContents(true)}
                                    className="flex items-center gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                                  >
                                    <Folder className="h-4 w-4 text-blue-600" />
                                    Saved ({savedContents.length})
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                  {contentGenerationOptions.map((option) => (
                                    <Button 
                                      key={option.type}
                                      variant="outline" 
                                      className="h-auto py-3 px-4 flex flex-col items-center text-center"
                                      onClick={() => handleGenerateContent(option.type)}
                                      disabled={isGeneratingContent}
                                    >
                                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                        {option.icon}
                                      </div>
                                      <span className="font-medium">{option.title}</span>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="py-8 text-center text-muted-foreground">
                              <FileText className="h-12 w-12 mx-auto opacity-20 mb-2" />
                              <p>No transcript loaded yet</p>
                            </div>
                          )}
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
            {selectedVideo ? (
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
                  {previewContent ? (
                    <div>
                      {previewType?.includes('post') ? (
                        <p className="text-sm whitespace-pre-line">{previewContent}</p>
                      ) : previewType === 'carousel' && (
                        <div className="aspect-square w-full relative">
                          <div className="absolute inset-0 flex flex-col">
                            {/* Slide content with LinkedIn styling */}
                            <div className="flex-1 flex flex-col justify-center p-6 bg-gradient-to-br from-blue-50 to-white">
                              {/* Remove the slide number indicator that shows in LinkedIn post */}
                              
                              <div className="mx-auto max-w-[90%] text-center">
                                <p className="text-lg font-semibold leading-tight">
                                  {getCarouselSlideContent(previewContent, currentSlide)}
                                </p>
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
                      )}
                    </div>
                  ) : (
                    <p className="text-sm mb-3">{selectedVideo.title}</p>
                  )}
                </div>
                
                {previewType === 'carousel' && (
                  <div className="border-t">
                    {/* Slide indicators */}
                    <div className="flex justify-center p-3 gap-1">
                      {previewContent 
                        ? getCarouselSlides(previewContent).map((_, index) => (
                            <div 
                              key={index}
                              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                                index === currentSlide ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                              }`}
                              onClick={() => setCurrentSlide(index)}
                            />
                          ))
                        : Array(7).fill(0).map((_, index) => (
                            <div 
                              key={index}
                              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                                index === currentSlide % 7 ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                              }`}
                              onClick={() => setCurrentSlide(index)}
                            />
                          ))
                      }
                    </div>
                  </div>
                )}
                
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
                  A preview of your content will appear here after selecting a video and generating content.
                </p>
              </div>
            )}
            
            {/* Add Edit in Editor button for carousel content */}
            {previewContent && previewType === 'carousel' && (
              <div className="mt-4">
                <Button 
                  onClick={handleEditInEditor}
                  className="w-full"
                  variant="outline"
                >
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Edit in Carousel Editor
                </Button>
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

      {/* Content Generation Modal/Section */}
      {showContentGenerator && selectedContentType && (
        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">
                {contentGenerationOptions.find(opt => opt.type === selectedContentType)?.title || 'Generated Content'}
              </CardTitle>
              <CardDescription>
                AI-generated content based on video transcript
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {!isGeneratingContent && generatedContent && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleEditMode}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Check className="h-4 w-4" />
                      Save Edits
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" />
                      Edit Content
                    </>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleCloseContentGenerator}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isGeneratingContent ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generating {contentGenerationOptions.find(opt => opt.type === selectedContentType)?.title}...</p>
              </div>
            ) : (
              <div className="border rounded-md p-4 bg-muted/20">
                {isEditing ? (
                  <Textarea
                    value={editableContent}
                    onChange={(e) => handleContentEdit(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="Edit your content here..."
                  />
                ) : (
                  <p className="whitespace-pre-line">{generatedContent}</p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={handleCloseContentGenerator}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                onClick={saveContent}
                disabled={isGeneratingContent || !generatedContent}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button 
                variant="default" 
                disabled={isGeneratingContent || !generatedContent} 
                onClick={() => {
                  if (generatedContent) {
                    navigator.clipboard.writeText(isEditing ? editableContent : generatedContent);
                    toast({
                      description: "Content copied to clipboard",
                    });
                  }
                }}
              >
                Copy Content
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Add modal to show saved contents */}
      {showSavedContents && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col shadow-xl">
            <div className="p-4 border-b bg-blue-50 flex items-center justify-between rounded-t-lg">
              <h3 className="text-lg font-medium text-blue-800 flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-600" />
                Saved Content
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSavedContents(false)}>
                ✕
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {savedContents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Folder className="h-16 w-16 text-blue-200 mb-4" />
                  <p className="text-blue-800 font-medium">No saved content yet</p>
                  <p className="text-sm text-blue-600 mt-1">Generate and save content to access it anytime</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedContents.map((content) => (
                    <div key={content.id} className="border rounded-lg overflow-hidden border-blue-100 hover:shadow-md transition-shadow">
                      <div className="p-3 bg-blue-50 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-blue-900">{content.title}</h4>
                          <p className="text-xs text-blue-700">
                            {content.videoTitle && `From: ${content.videoTitle} • `}
                            {new Date(content.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteSavedContent(content.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <div className="max-h-40 overflow-y-auto mb-3">
                          <p className="text-sm whitespace-pre-line line-clamp-6 text-gray-800">{content.content}</p>
                        </div>
                        <div className="flex justify-end gap-2 border-t pt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              navigator.clipboard.writeText(content.content);
                              toast({
                                description: "Content copied to clipboard",
                              });
                            }}
                            className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => loadSavedContent(content)}
                            className="h-8 bg-blue-600 hover:bg-blue-700"
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Load
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCarouselPage;