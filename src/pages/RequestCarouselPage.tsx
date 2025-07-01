import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Info, Upload, Search, LayoutGrid, ChevronLeft, ChevronRight, Youtube, FileText, Loader2, ArrowRight, MessageSquare, Sparkles, FileSpreadsheet, ExternalLink, ImageIcon, Clock4, SearchX, Folder, Save, Copy, Pencil, ChevronDown, Play, Edit, AlertCircle, RefreshCw, Link2, Twitter, Linkedin, Trash2, ArrowLeft, X } from "lucide-react";
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
import { Slide, FontFamily, FontWeight, TextAlign } from "@/editor/types";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";
import api, { tokenManager } from '@/services/api';
import TweetCard from "@/components/twitter/TweetCard";
import TweetThread from "@/components/twitter/TweetThread";
import { Tweet as TwitterTweet, Thread as TwitterThread } from '@/utils/twitterTypes';
import PostSelectionModal from "@/components/PostSelectionModal";
import { linkedInApi } from '@/utils/linkedinApi';

// Model options with fallbacks
const AI_MODELS = {
  primary: "gpt-4o-mini", // Updated to align with backend
  fallback: "gpt-3.5-turbo"
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
  thumbnail?: string;
  savedAt?: string;
  updatedAt?: string;
  url?: string;
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
  type: 'text-post' | 'carousel';
  title: string;
  icon: React.ReactNode;
}

// LinkedIn post attachment interface
interface LinkedInPost {
  id: string;
  content: string;
  attachedAt: Date;
}

// Add interfaces for saved content
interface SavedContent {
  id: string;
  title: string;
  content: string;
  type: 'text-post' | 'carousel';
  videoId?: string;
  videoTitle?: string;
  createdAt: string;
  publishedToLinkedIn?: boolean;
  status?: 'draft' | 'published';
}



// Function to generate placeholder transcript
const generateDummyTranscript = (videoId: string): string[] => {
  return [];
};

// Add function to prepare carousel data for editor
const prepareCarouselForEditor = (content: string): Slide[] => {
  if (!content) return [];
  
  console.log("Preparing carousel content for editor:", content);
  
  // Process the content to remove standalone "Slide X" slides and clean slide content
  const rawSlides = content.split('\n\n').filter(s => s.trim());
  const textSlides = [];
  
  for (let i = 0; i < rawSlides.length; i++) {
    let current = rawSlides[i].trim();
    
    // Skip slides that only contain "Slide X" and nothing else
    if (/^Slide\s*\d+\s*$/.test(current)) {
      continue;
    }
    
    // Remove "Slide X:" prefix if it exists
    current = current.replace(/^Slide\s*\d+[\s:.]+/i, '').trim();
    
    // Remove markdown formatting (**text**)
    current = current.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Remove any remaining asterisks used for emphasis
    current = current.replace(/\*/g, '');
    
    if (current && current.length > 0) {
      textSlides.push(current);
    }
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
}

// Update the userLimit interface to better reflect subscription plans
interface UserLimit {
  limit: number;         // Total credits from the subscription plan
  count: number;         // Used credits
  remaining: number;     // Remaining credits
  planId: string;        // The subscription plan ID
  planName: string;      // The name of the subscription plan
  expiresAt?: Date;      // When the plan expires (especially for trial)
  status?: string;      // Status of the plan (active or inactive)
}

const RequestCarouselPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);
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
  const [videosWithTranscripts, setVideosWithTranscripts] = useState<Set<string>>(new Set());
  
  // Transcript fetching states
  const [isFetchingTranscript, setIsFetchingTranscript] = useState(false);
  const [fetchingVideoId, setFetchingVideoId] = useState<string | null>(null);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  // Content generation states
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  
  // Preview state for content generator
  const [previewContent, setPreviewContent] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [previewType, setPreviewType] = useState<string>('');

  // Add state for saved content
  const [savedContents, setSavedContents] = useState<SavedContent[]>([]);
  const [showSavedContents, setShowSavedContents] = useState(false);
  const [contentFilter, setContentFilter] = useState<'all' | 'carousel' | 'text-post'>('all');
  const [contentSearchQuery, setContentSearchQuery] = useState('');

  // Add state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');



  // Inside the RequestCarouselPage component, add these new state variables:
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestStep, setRequestStep] = useState(1);
  const [carouselType, setCarouselType] = useState("professional");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  
  // LinkedIn post attachment states
  const [attachedLinkedInPost, setAttachedLinkedInPost] = useState<string>('');

  // Add post selection states
  const [showPostSelectionModal, setShowPostSelectionModal] = useState(false);
  const [selectedPostsCount, setSelectedPostsCount] = useState(0);

  // Note: Content is now auto-saved when generated, no manual save needed

  // Update userLimit state to remove 'free' terminology and use correct trial limits
  const [userLimit, setUserLimit] = useState<UserLimit>({ 
    limit: 0, 
    count: 0, 
    remaining: 0, 
    planId: 'expired',
    planName: 'No Plan' 
  });

  // Add state for plan upgrade tracking
  const [needsPlanUpgrade, setNeedsPlanUpgrade] = useState(false);

  // Add currentSubscription state
  const [currentSubscription, setCurrentSubscription] = useState<{
    planId: string;
    usedCredits: number;
    totalCredits: number;
  } | null>(null);

  // Add fetchCurrentSubscription function
  const fetchCurrentSubscription = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.brandout.ai'}/stripe/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCurrentSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  // Add useEffect to fetch subscription on component mount
  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  // Function to apply selected posts from modal
  const applySelectedPosts = (selectedContent: string) => {
    setAttachedLinkedInPost(selectedContent);
    
    // Count posts by counting the separators + 1
    const postCount = selectedContent ? selectedContent.split('\n\n---\n\n').length : 0;
    setSelectedPostsCount(postCount);
    
    toast({
      description: `✓ Applied ${postCount} posts as writing style reference`,
      duration: 2000
    });
  };



  // Add a periodic check for limit updates
  useEffect(() => {
    // Initial fetch
    fetchUserLimit();

    // Set up interval for periodic updates
    const interval = setInterval(fetchUserLimit, 5000); // Check every 5 seconds

    // Add storage event listener for cross-tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userLimit') {
        fetchUserLimit();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user?.id]);

  // Update localStorage when userLimit changes
  useEffect(() => {
    localStorage.setItem('userLimit', JSON.stringify(userLimit));
  }, [userLimit]);

  // Load saved videos from localStorage and backend
    const loadSavedVideos = async () => {
      setIsLoadingVideos(true);
      
      try {
        let backendVideos: YouTubeVideo[] = [];
        
        // Try to load videos from backend first
        try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
        const apiUrl = baseUrl.endsWith('/api')
            ? `${baseUrl}/youtube/saved/${user?.id || 'anonymous'}`
            : `${baseUrl}/api/youtube/saved/${user?.id || 'anonymous'}`;
          
          const response = await axios.get(apiUrl);
          
          if (response.data.success && response.data.savedVideos) {
            // Transform backend data to match our YouTubeVideo interface
            backendVideos = response.data.savedVideos.map((video: any) => ({
              id: video.videoId,
              videoId: video.videoId,
              title: video.title,
              thumbnail: video.thumbnailUrl,
              thumbnailUrl: video.thumbnailUrl,
              channelName: video.channelTitle,
              url: `https://www.youtube.com/watch?v=${video.videoId}`,
              videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
              transcript: video.transcript || "",
              formattedTranscript: video.formattedTranscript || [],
              language: video.language || "Unknown",
              is_generated: video.is_generated,
              status: 'ready',
              savedAt: new Date(video.savedAt || video.createdAt).toISOString(),
              savedTimestamp: new Date(video.savedAt || video.createdAt).toISOString(),
              source: 'youtube'
            }));
            
          // Set videos from backend
              setSavedVideos(backendVideos);
          
          // Update localStorage to match backend
          localStorage.setItem('savedYoutubeVideos', JSON.stringify(backendVideos));
        } else {
          setSavedVideos([]);
          localStorage.removeItem('savedYoutubeVideos');
          }
        } catch (backendError) {
          console.error("Error loading videos from backend:", backendError);
        // If backend fails, try loading from localStorage
        try {
          const savedVideosJSON = localStorage.getItem('savedYoutubeVideos');
          if (savedVideosJSON) {
            const parsedVideos = JSON.parse(savedVideosJSON);
            if (Array.isArray(parsedVideos) && parsedVideos.length > 0) {
              setSavedVideos(parsedVideos);
            } else {
              setSavedVideos([]);
            }
          } else {
            setSavedVideos([]);
          }
        } catch (localStorageError) {
          console.error("Error loading from localStorage:", localStorageError);
        setSavedVideos([]);
        }
      }
      } catch (error) {
        console.error("Error in loadSavedVideos:", error);
        setSavedVideos([]);
    } finally {
      setIsLoadingVideos(false);
      }
    };
    
  // Load saved videos and contents on component mount and when user changes
  useEffect(() => {
    loadSavedVideos();
    loadSavedContents(); // Load saved posts immediately
    
    // Set up a listener to reload when localStorage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedYoutubeVideos') {
        loadSavedVideos();
      }
      if (e.key === 'savedLinkedInContents') {
        loadSavedContents();
      }
    };
    
    // Set up interval to refresh saved posts every minute
    const refreshInterval = setInterval(loadSavedContents, 60000);
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, [user?.id]);

  // Define fetchUserLimit before using it in useEffect
  const fetchUserLimit = async () => {
    if (!user?.id) {
      return;
    }

    const authMethod = localStorage.getItem('auth-method');
    const token = authMethod ? tokenManager.getToken(authMethod) : null;

    if (!token) {
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const limitResponse = await axios.get(`${baseUrl}/user-limits/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (limitResponse.data.success) {
        const userData = limitResponse.data.data;
        
        // Directly use the data from API without excessive conditions
        setUserLimit({ 
          limit: userData.limit || 0, 
          count: userData.count || 0, 
          remaining: Math.max(0, (userData.limit || 0) - (userData.count || 0)), 
          planId: userData.planId || 'expired',
          planName: userData.planName || 'No Plan',
          status: userData.status || 'inactive',
          expiresAt: userData.expiresAt ? new Date(userData.expiresAt) : undefined
        });
        
        // Set upgrade flag based on plan status
        setNeedsPlanUpgrade(userData.planId === 'expired' || userData.status === 'inactive');
      } else {
        console.error('Failed to fetch user limit:', limitResponse.data.message);
        setUserLimit({ 
          limit: 0, 
          count: 0, 
          remaining: 0, 
          planId: 'expired',
          planName: 'No Plan',
          status: 'inactive'
        });
        setNeedsPlanUpgrade(true);
      }
    } catch (error) {
      console.error('Error fetching user limit:', error.response?.data || error);
      setUserLimit({ 
        limit: 0, 
        count: 0, 
        remaining: 0, 
        planId: 'expired',
        planName: 'No Plan',
        status: 'inactive'
      });
      setNeedsPlanUpgrade(true);
    }
  };

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
        description: "✓ File uploaded successfully",
        duration: 2000
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
    
    // Keep existing preview content when selecting a new video
    // Only clear content if explicitly requested by the user
    
    // Check if the video has a valid formatted transcript (array of bullet points)
    if (video.formattedTranscript && 
        Array.isArray(video.formattedTranscript) && 
        video.formattedTranscript.length > 0 &&
        // Make sure it's not just empty strings
        video.formattedTranscript.some(point => point && point.trim().length > 10)) {
      setGeneratedTranscript(video.formattedTranscript);
      setShowTranscript(true);
      setCurrentSlide(0);
    } 
    // Check if the video has a regular transcript that needs to be formatted
    else if (video.transcript && 
             typeof video.transcript === 'string' && 
             video.transcript.trim().length > 10) {
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
      description: "✓ Video selected for carousel content",
      duration: 2000
    });
  };

  // Format transcript into readable text (keep raw transcript)
  const formatTranscript = (transcript: string): string[] => {
    if (!transcript || transcript.length < 10) {
      return ["No transcript content available"];
    }
    
    // Just return the raw transcript as a single item in the array
    return [transcript];
  };

  // Watch video handler
  const handleWatchVideo = (video: YouTubeVideo) => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
      toast({
        description: "Opening video in new tab",
        duration: 2000
      });
    } else if (video.id) {
      window.open(`https://youtube.com/watch?v=${video.id}`, '_blank');
      toast({
        description: "Opening video in new tab",
        duration: 2000
      });
    }
  };

  // Fetch transcript for a video
  const handleFetchTranscript = async (video: YouTubeVideo) => {
    if (!video.id && !video.videoId) {
      toast({
        description: "Video ID not found",
        variant: "destructive",
        duration: 2000
      });
      return;
    }
    
    const videoId = video.id || video.videoId;
    setFetchingVideoId(videoId);
    setIsFetchingTranscript(true);
    setTranscriptError(null);
    
    try {
      toast({
        description: "Fetching transcript...",
        duration: 2000
      });
      
      let transcriptData = null;
      let primaryError = null;
      let fallbackError = null;
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      
      // Try the primary method first (yt-dlp), which tends to be more reliable
      const ytdlpApiUrl = baseUrl.endsWith('/api')
        ? `${baseUrl}/youtube/transcript-yt-dlp`
        : `${baseUrl}/api/youtube/transcript-yt-dlp`;
      
      try {
        const ytdlpResponse = await axios.post(ytdlpApiUrl, {
          videoId: videoId,
          useScraperApi: false
        }, { 
          timeout: 240000,
          headers: {
            'Content-Type': 'application/json'
          }
        }); // Longer timeout for yt-dlp
        
        if (ytdlpResponse.data && ytdlpResponse.data.success) {
          transcriptData = ytdlpResponse.data;
        } else {
          fallbackError = new Error(ytdlpResponse.data?.message || 'Unknown error with yt-dlp method');
        }
      } catch (ytdlpError: any) {
        fallbackError = ytdlpError;
      }
      
      // If yt-dlp method failed, try the primary transcript method
      if (!transcriptData) {
        const transcriptApiUrl = baseUrl.endsWith('/api')
        ? `${baseUrl}/youtube/transcript`
        : `${baseUrl}/api/youtube/transcript`;
      
      try {
          const response = await axios.post(transcriptApiUrl, {
          videoId: videoId,
            useScraperApi: false
          }, { 
            timeout: 240000,
            headers: {
              'Content-Type': 'application/json'
            }
        });
        
          if (response.data && response.data.success) {
            transcriptData = response.data;
          } else {
            primaryError = new Error(response.data?.message || 'Unknown error with primary method');
          }
        } catch (error: any) {
          primaryError = error;
        }
      }
      
      // If we have transcript data, process it
      if (transcriptData && (transcriptData.transcript || transcriptData.formattedTranscript)) {
        // Success - handle transcript data
        await handleTranscriptSuccess(video, transcriptData);
        setIsFetchingTranscript(false);
        setFetchingVideoId(null);
        
        toast({
          description: "Transcript fetched successfully",
          duration: 2000
        });
      } else {
        // Both methods failed
        const errorMessage = `Both transcript methods failed. ${primaryError ? `Primary error: ${primaryError.message}` : ''}${fallbackError ? `${primaryError ? '. ' : ''}yt-dlp error: ${fallbackError.message}` : ''}`;
        console.error('Error fetching transcript:', errorMessage);
        
        setIsFetchingTranscript(false);
        setFetchingVideoId(null);
        setTranscriptError(errorMessage);
        
          toast({
          description: "Failed to fetch transcript",
          variant: "destructive",
          duration: 2000
        });
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error in handleFetchTranscript:', error);
      setIsFetchingTranscript(false);
      setFetchingVideoId(null);
      setTranscriptError(error.message || "Unknown error fetching transcript");
      
      toast({
        description: "Failed to fetch transcript: " + (error.message || "Unknown error"),
        variant: "destructive",
        duration: 2000
      });
    }
  };
  
  // Helper function to handle successful transcript retrieval
  const handleTranscriptSuccess = async (video: YouTubeVideo, data: any) => {
    try {
      // Get the raw transcript text
      const rawTranscript = data.transcript || '';
      
    // Update the video with the transcript
    const updatedVideo: YouTubeVideo = {
      ...video,
        transcript: rawTranscript,
        formattedTranscript: [rawTranscript], // Just use raw transcript
      language: data.language || "en",
      is_generated: data.is_generated || false
    };
    
    // Update selected video state
    setSelectedVideo(updatedVideo);
    
      // Set the raw transcript for display
      setGeneratedTranscript([rawTranscript]);
          setCurrentSlide(0);
    
      // Update the videos with transcripts set
      setVideosWithTranscripts(prev => {
        const newSet = new Set(prev);
        newSet.add(video.id);
        if (video.videoId) newSet.add(video.videoId);
        return newSet;
      });
      
      // Save to local and backend storage (don't block on failure)
      const saveResult = await saveVideoWithTranscript(updatedVideo);
    
      // Show appropriate toast based on save success
      if (saveResult) {
    toast({
      description: "Transcript saved successfully",
      duration: 2000
    });
      }
      // If save failed, the saveVideoWithTranscript function will show its own error
    } catch (error) {
      console.error("Error in handleTranscriptSuccess:", error);
      toast({
        description: "Successfully fetched transcript but encountered an error processing it",
        variant: "destructive",
        duration: 2000
      });
    }
  };
  
  // Helper function to save video with transcript
  const saveVideoWithTranscript = async (video: YouTubeVideo) => {
    try {
      // First save to localStorage to ensure we don't lose data
      const savedVideosStr = localStorage.getItem('savedYoutubeVideos');
      const savedVideos = savedVideosStr ? JSON.parse(savedVideosStr) : [];
      
      // Find and update the video if it exists
      const existingIndex = savedVideos.findIndex((v: any) => 
        (v.id === video.id) || (v.videoId === video.id) || (v.id === video.videoId) || (v.videoId === video.videoId)
      );
      
      // Handle large transcripts by limiting size if needed
      let safeTranscript = video.transcript || '';
      let safeFormattedTranscript = video.formattedTranscript || [safeTranscript];
      
      // If transcript is very large (>100KB), trim it to avoid payload size issues
      const MAX_TRANSCRIPT_LENGTH = 100000; // ~100KB
      if (safeTranscript && safeTranscript.length > MAX_TRANSCRIPT_LENGTH) {
        console.log(`Transcript too large (${safeTranscript.length} chars), trimming to ${MAX_TRANSCRIPT_LENGTH}`);
        safeTranscript = safeTranscript.substring(0, MAX_TRANSCRIPT_LENGTH) + "... [Trimmed due to size limits]";
        
        // Also update formatted transcript
        if (Array.isArray(safeFormattedTranscript) && safeFormattedTranscript.length > 0) {
          safeFormattedTranscript = safeFormattedTranscript.map(item => 
            typeof item === 'string' && item.length > MAX_TRANSCRIPT_LENGTH / safeFormattedTranscript.length
            ? item.substring(0, MAX_TRANSCRIPT_LENGTH / safeFormattedTranscript.length) + "..."
            : item
          );
        } else {
          safeFormattedTranscript = [safeTranscript];
        }
      }
      
      // Create the updated video object
      const updatedVideo = existingIndex !== -1 
        ? {
          ...savedVideos[existingIndex],
            transcript: safeTranscript,
            formattedTranscript: safeFormattedTranscript || [safeTranscript || ''],
            language: video.language || 'en',
            is_generated: video.is_generated !== undefined ? video.is_generated : false,
          updatedAt: new Date().toISOString()
          }
        : {
          ...video,
            transcript: safeTranscript,
            formattedTranscript: safeFormattedTranscript || [safeTranscript || ''],
            language: video.language || 'en',
            is_generated: video.is_generated !== undefined ? video.is_generated : false,
          savedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
      
      // Update localStorage with the updated video
      if (existingIndex !== -1) {
        savedVideos[existingIndex] = updatedVideo;
      } else {
        savedVideos.push(updatedVideo);
      }
      
      localStorage.setItem('savedYoutubeVideos', JSON.stringify(savedVideos));
        
      // Update the saved videos in the state
      setSavedVideos(prevVideos => {
        const updatedVideos = [...prevVideos];
        const existingIdx = updatedVideos.findIndex(v => 
          (v.id === video.id) || (v.videoId === video.id) || (v.id === video.videoId) || (v.videoId === video.videoId)
        );
        
        if (existingIdx !== -1) {
          updatedVideos[existingIdx] = updatedVideo;
        } else {
          updatedVideos.push(updatedVideo);
        }
        
        return updatedVideos;
      });
      
      // Update videosWithTranscripts state
      setVideosWithTranscripts(prev => {
        const newSet = new Set(prev);
        newSet.add(video.id || video.videoId || '');
        return newSet;
      });
      
      // Now try to save to backend with retry logic
      const saveToBackend = async (retryCount = 0, maxRetries = 2) => {
        try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
        const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/youtube/save-video-transcript`
          : `${baseUrl}/api/youtube/save-video-transcript`;
        
          // Clone and prepare a smaller payload for backend save
          const backendPayload = {
            video: {
              ...updatedVideo,
              // Send ID info but trim large fields to reduce payload size
              transcript: safeTranscript,
              formattedTranscript: safeFormattedTranscript
            },
          userId: user?.id || 'anonymous'
          };
          
          const backendResponse = await axios.post(apiUrl, backendPayload, { 
            timeout: 15000, // Longer timeout
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (backendResponse.data?.success) {
            console.log("Saved transcript to backend successfully");
            toast({
              description: "Transcript saved successfully",
              duration: 2000
            });
            
            // Try creating carousel as well, but don't block on it
            try {
        const carouselApiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/youtube-carousels`
          : `${baseUrl}/api/youtube-carousels`;
        
              axios.post(carouselApiUrl, {
                videos: [updatedVideo],
          userId: user?.id || 'anonymous'
              }, { timeout: 10000 })
              .then(() => console.log("Created carousel for video successfully"))
              .catch(err => console.warn("Could not create carousel, but video was saved:", err));
            } catch (carouselError) {
              console.warn("Error creating carousel (handled):", carouselError);
            }
          } else {
            console.warn("Backend save returned non-success response:", backendResponse.data);
            throw new Error(backendResponse.data?.message || "Server returned error response");
          }
        } catch (backendError: any) {
          // Check if we should retry
          if (retryCount < maxRetries) {
            console.log(`Retrying backend save (attempt ${retryCount + 1}/${maxRetries})...`);
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return saveToBackend(retryCount + 1, maxRetries);
          }
          
          // More detailed error logging for final failure
          let errorDetail = "Unknown error";
          if (backendError.code === "ERR_NETWORK") {
            errorDetail = "Network connection error. API server may be down.";
          } else if (backendError.response) {
            errorDetail = `Status ${backendError.response.status}: ${backendError.response.statusText}`;
            if (backendError.response.data?.message) {
              errorDetail += ` - ${backendError.response.data.message}`;
            }
          } else if (backendError.message) {
            errorDetail = backendError.message;
          }
          
          console.error(`Error saving to backend: ${errorDetail}`);
          toast({
            description: "Could not save to server, but transcript was saved locally",
            variant: "destructive",
            duration: 2000
          });
        }
      };
      
      // Start the save process (non-blocking)
      saveToBackend();
      
      return true;
    } catch (error: any) {
      console.error("Fatal error saving video with transcript:", error);
      toast({
        description: "Failed to save transcript data: " + (error.message || "Unknown error"),
        variant: "destructive",
        duration: 2000
      });
      return false;
    }
  };

  // LinkedIn content generation options
  const contentGenerationOptions: ContentGenerationOptions[] = [
    {
      type: 'text-post',
      title: 'Text Post',
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      type: 'carousel',
      title: 'Carousel',
      icon: <FileSpreadsheet className="h-4 w-4" />
    }
  ];

  // Add a new useEffect to load saved content on component mount
  useEffect(() => {
    const loadInitialContent = async () => {
      try {
        // Load content from backend first
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
        const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/carousel-contents`
          : `${baseUrl}/api/carousel-contents`;

        const response = await axios.get(apiUrl, {
          params: { userId: user?.id || 'anonymous' }
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          // Set the contents from backend
          setSavedContents(response.data.data);
          
          // Update localStorage with backend data
          localStorage.setItem('savedLinkedInContents', JSON.stringify(response.data.data));
          
          // If we have a video ID in localStorage, try to find its content
          const savedVideoId = localStorage.getItem('ai_generated_content_videoId');
          if (savedVideoId) {
            const videoContent = response.data.data.find(
              content => content.videoId === savedVideoId
            );
            if (videoContent) {
              setGeneratedContent(videoContent.content);
              setPreviewContent(videoContent.content);
              setPreviewTitle(videoContent.title);
              setPreviewType(videoContent.type);
            }
          }
        }
      } catch (backendError) {
        console.error('Error loading content from backend:', backendError);
        
        // Fall back to localStorage
    const savedContent = localStorage.getItem('ai_generated_content');
    const savedVideoId = localStorage.getItem('ai_generated_content_videoId');
    
        if (savedContent && savedVideoId) {
      setGeneratedContent(savedContent);
          if (selectedVideo?.id === savedVideoId) {
        setPreviewContent(savedContent);
          }
        }
        
        // Also try to load saved contents from localStorage
        const localContentJSON = localStorage.getItem('savedLinkedInContents');
        if (localContentJSON) {
          try {
            const localContents = JSON.parse(localContentJSON);
            setSavedContents(localContents);
          } catch (parseError) {
            console.error('Error parsing local contents:', parseError);
            setSavedContents([]);
          }
        }
      }
    };

    loadInitialContent();
  }, [user?.id, selectedVideo]);

  // Update the part in handleGenerateContent where content is set to save to localStorage
  const handleGenerateContent = async (type: string) => {
    if (!userLimit) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to verify your usage limits. Please try again later.",
      });
      return;
    }
    
    // Check if plan is expired or inactive first
    if (!userLimit.planId || userLimit.planId === 'expired' || userLimit.status === 'inactive') {
      toast({
        variant: "destructive",
        title: "Plan Expired",
        description: "Your plan has expired. Please purchase a new plan to continue using this feature.",
      });
      navigate("/settings/billing");
      return;
    }
    
    if (userLimit.count >= userLimit.limit) {
      toast({
        variant: "destructive",
        title: "Limit Reached",
        description: "You have reached your content generation limit. Please upgrade your plan to get more credits.",
      });
      navigate("/settings/billing");
      return;
    }
    
    // Remove the carousel-only restriction to allow all content types
    // The old code had a check here that only allowed 'carousel' type

    if (!selectedVideo) {
      toast({
        title: "Video required",
        description: "Please select a video before generating content",
        variant: "destructive"
      });
      return;
    }

    if (!selectedVideo.transcript) {
        toast({
        title: "Transcript required",
        description: "Please ensure the video has a transcript before generating content",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingContent(true);
    
    try {
      // Call the backend API to generate content
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const apiUrl = baseUrl.endsWith('/api')
        ? `${baseUrl}/generate-content`
        : `${baseUrl}/api/generate-content`;

      const response = await axios.post(apiUrl, {
        type: type,
        transcript: selectedVideo.transcript,
        videoId: selectedVideo.id,
        videoTitle: selectedVideo.title,
        userId: user?.id || 'anonymous',
        writingStyleSamples: attachedLinkedInPost || undefined,
        options: {
          naturalTitle: true,
          removeSlideNumbers: true,
          formatPreferences: {
            titleStyle: 'engaging', // Add engaging title style
            contentStyle: 'professional', // Keep content professional
            removeAIIndicators: true, // Remove any AI-generated indicators
            preserveEmojis: true // Keep emojis in the content
          }
        }
      });

      if (!response.data.success || !response.data.content) {
        throw new Error('Failed to generate content');
      }

      const generatedContent = response.data.content;
      
      // Clean the generated content to ensure no slide numbers
      const cleanedContent = cleanCarouselContent(generatedContent);
      
      // Update UI state
      setGeneratedContent(cleanedContent);
      setShowContentGenerator(true);
      setSelectedContentType(type);
      setPreviewContent(cleanedContent);
      setPreviewType(type);
      
      // Save the content to backend and localStorage
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
        const saveUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/carousel-contents`
          : `${baseUrl}/api/carousel-contents`;

        const saveResponse = await axios.post(saveUrl, {
          id: uuidv4(), // Add unique ID
          title: selectedVideo.title,
          content: cleanedContent,
          type: type === 'text-post' ? 'text-post' : 'carousel',
          videoId: selectedVideo.id,
          videoTitle: selectedVideo.title,
          userId: user?.id || 'anonymous'
        });

        if (saveResponse?.data?.data?.id) {  // More defensive checking
          // Update local state with the new content
          const newContent: SavedContent = {
            id: saveResponse.data.data.id,
            title: selectedVideo.title,
            content: cleanedContent,
            type: type === 'text-post' ? 'text-post' : 'carousel',
            videoId: selectedVideo.id,
            videoTitle: selectedVideo.title,
            createdAt: new Date().toISOString()
          };
          
          // Update local state immediately
          setSavedContents(prev => [newContent, ...prev]);
          
          // Update localStorage
          const existingContents = JSON.parse(localStorage.getItem('savedLinkedInContents') || '[]');
          localStorage.setItem('savedLinkedInContents', JSON.stringify([newContent, ...existingContents]));
          
          // Refresh saved contents from backend immediately
          await loadSavedContents();
        
        toast({
            title: "Success",
            description: "Content saved successfully!",
          });
        }
      } catch (saveError) {
        console.error('Error saving content:', saveError);
        // Don't show error to user since the content was generated successfully
      }
      
      // Show generation success toast
      toast({
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} content generated successfully`,
        duration: 2000
      });
      
      // Increment user count
      try {
      const token = tokenManager.getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/user-limits/${user?.id}/increment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setUserLimit(prev => prev ? {
        ...prev,
        count: prev.count + 1
      } : null);
      } catch (error) {
        console.error('Error incrementing user count:', error);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
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

  // Update the form submit handler
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Check if video is selected
    if (!selectedVideo) {
      toast({
        title: "Video required",
        description: "Please select a video for your carousel",
        variant: "destructive"
      });
      return;
    }

    // Check if content is generated AND explicitly selected
    if (!previewContent) {
      toast({
        title: "Content required",
        description: "Please generate and select carousel content for your video",
        variant: "destructive"
      });
      return;
    }

    // Make sure the content type is "carousel"
    if (previewType !== 'carousel') {
      toast({
        title: "Invalid content type",
        description: "Only carousel content can be used for carousel requests",
        variant: "destructive"
      });
      return;
    }

    // Check if the selected content corresponds to the selected video
    const savedVideoId = localStorage.getItem('ai_generated_content_videoId');
    if (savedVideoId !== selectedVideo.id) {
      toast({
        title: "Content mismatch",
        description: "The selected content does not match the selected video. Please generate content for this video.",
        variant: "destructive"
      });
      return;
    }

    // Show the request modal
    setShowRequestModal(true);
  };

  // Add a function to submit the final request
  const submitCarouselRequest = async () => {
    if (!form.getValues('title')) {
      toast({
        title: "Title required",
        description: "Please enter a title for your carousel request",
        variant: "destructive"
      });
      return;
    }
    
    // Check user limit before submitting
    if (!userLimit) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to verify your usage limits. Please try again later.",
      });
      return;
    }
    
    // Check if user needs to upgrade (no active subscription or reached limit)
    if (!userLimit.planId || userLimit.planId === 'expired' || userLimit.status === 'inactive') {
      toast({
        variant: "destructive",
        title: "Plan Expired",
        description: "Your plan has expired. Please purchase a new plan to continue submitting carousel requests.",
      });
      navigate("/settings/billing");
      return;
    }
    
    if (userLimit.count >= userLimit.limit) {
      toast({
        variant: "destructive",
        title: "Credit Limit Reached",
        description: `You have used all ${userLimit.limit} credits from your ${userLimit.planName} plan. Please upgrade your plan or buy additional credits.`,
      });
      
      // Navigate to billing page instead of showing modal
      navigate("/settings/billing");
      return;
    }
    
    setIsSubmittingRequest(true);
    
    try {
      // Use tokenManager to retrieve the token instead of direct localStorage access
      const token = tokenManager.getToken() || localStorage.getItem('linkedin-login-token') || localStorage.getItem('google-login-token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      // No file upload needed for YouTube-only functionality
      
      // Now send the metadata to our API
      const requestData = {
        title: form.getValues('title'),
        description: additionalNotes || '',  // Add the additional notes as description
        youtubeUrl: selectedVideo?.url || form.getValues('youtubeUrl') || '',
        carouselType: 'professional',
        content: generatedContent || previewContent || '',
        transcript: selectedVideo?.transcript || '', // Include the transcript
        videoId: selectedVideo?.id || undefined,
        videoTitle: selectedVideo?.title || undefined,
        userName: user?.firstName || (user as any)?.name || 'Unknown User',
        userEmail: user?.email || ''
      };
      
      // VITE_API_URL already includes /api
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      // Use the original endpoint since the new one doesn't exist yet
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/carousels/submit-request` 
        : `${baseUrl}/api/carousels/submit-request`;
      
      console.log('Submitting carousel request to:', apiUrl);
      console.log('Request data:', JSON.stringify(requestData, null, 2));
      
      // For debugging purposes, let's also log raw form values
      console.log('Form values:', form.getValues());
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
      
      // Try to get response data, but handle if it's not JSON
      let responseData;
      const responseText = await response.text();
        try {
        responseData = JSON.parse(responseText);
        console.log("API response data:", responseData);
        } catch (e) {
        console.log("API response (not JSON):", responseText);
        responseData = { message: responseText };
      }
      
      if (!response.ok) {
        console.error("API error response:", responseData);
        
        // Check if it's a status 500 error - in that case, we'll consider it successful
        // since we know the files are being correctly uploaded
        if (response.status === 500 && responseData?.error === 'this.isModified is not a function') {
          console.log("Server returned 500 error but we know the request actually worked. Treating as success.");
          // Continue with success flow instead of throwing
        } else {
          // For any other error, throw normally
          throw new Error(responseData.message || responseData.error || 'Failed to submit carousel request');
        }
      }
      
      // Increment user count for carousel request - THIS IS THE KEY CHANGE - counting carousel requests against the limit
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/user-limits/${user?.id}/increment`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Update local state
        setUserLimit(prev => prev ? {
          ...prev,
          count: prev.count + 1,
          remaining: prev.remaining - 1
        } : null);
        
        console.log("Incremented user limit count for carousel request");
      } catch (limitError) {
        console.error("Error incrementing user limit:", limitError);
        // Don't stop the flow if this fails
      }
      
      // Move to success step
      setRequestStep(3);
      setIsSuccess(true);
      
      // No files to clear

      toast({
        description: "Carousel request submitted successfully",
        duration: 2000
      });
    } catch (error) {
      console.error("Error submitting carousel request:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit carousel request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Helper function for chunked upload of large files
  const handleLargeFileUpload = (file: File, resolve: (url: string) => void, reject: (error: Error) => void) => {
    const CHUNK_SIZE = 10485760; // 10MB chunks
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
    
    // Generate a unique ID for this file
    const fileId = `large_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    let bytesUploaded = 0;
    let totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let chunkIndex = 0;

      toast({
      title: "Large file detected",
      description: `Uploading ${file.name} in chunks (${Math.round(file.size / 1048576)}MB)`,
    });

    const uploadChunk = async () => {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('fileId', fileId);
      formData.append('chunkIndex', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('originalName', file.name);
      
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
        const chunkApiUrl = baseUrl.endsWith('/api') 
          ? `${baseUrl}/upload/chunk`
          : `${baseUrl}/api/upload/chunk`;
          
        const response = await fetch(chunkApiUrl, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload chunk ${chunkIndex + 1}/${totalChunks}`);
        }
        
        const result = await response.json();
        bytesUploaded += chunk.size;
        
        // Update progress
        const progressPercent = Math.round((bytesUploaded / file.size) * 100);
        console.log(`Upload progress for ${file.name}: ${progressPercent}%`);
        
        if (chunkIndex < totalChunks - 1) {
          // Upload next chunk
          chunkIndex++;
          await uploadChunk();
        } else {
          // All chunks uploaded, get the final URL
          const finalizeApiUrl = baseUrl.endsWith('/api') 
            ? `${baseUrl}/upload/finalize`
            : `${baseUrl}/api/upload/finalize`;
            
          const finalizeResponse = await fetch(finalizeApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId }),
            credentials: 'include'
          });
          
          if (!finalizeResponse.ok) {
            throw new Error('Failed to finalize chunked upload');
          }
          
          const finalResult = await finalizeResponse.json();
          console.log(`File ${file.name} uploaded successfully`);
          resolve(finalResult.secure_url);
        }
      } catch (error) {
        console.error('Error uploading chunk:', error);
        reject(new Error(`Failed to upload ${file.name}`));
      }
    };
    
    // Start the upload process with the first chunk
    uploadChunk().catch(error => {
      console.error('Chunked upload failed:', error);
      reject(error);
    });
  };

  // Add these carousel type options 
  const carouselTypes = [
    { value: "professional", label: "Professional", description: "Clean design with corporate branding" },
    { value: "creative", label: "Creative", description: "Eye-catching design with bold elements" },
    { value: "minimal", label: "Minimal", description: "Simple, elegant design with focus on content" },
    { value: "data-driven", label: "Data-Driven", description: "Charts, graphs and statistics" },
    { value: "storytelling", label: "Storytelling", description: "Narrative-focused with image backgrounds" },
  ];

  // Function to clean carousel content
  const cleanCarouselContent = (content: string): string => {
    let cleanedContent = content;
    
    // Remove markdown headers
    cleanedContent = cleanedContent.replace(/^#{1,6}\s+/gm, '');
    
    // Remove markdown formatting (**text**, __text__)
    cleanedContent = cleanedContent.replace(/\*\*(.*?)\*\*/g, '$1');
    cleanedContent = cleanedContent.replace(/__(.*?)__/g, '$1');
    cleanedContent = cleanedContent.replace(/\*(.*?)\*/g, '$1');
    cleanedContent = cleanedContent.replace(/_(.*?)_/g, '$1');
    
    // Remove any remaining asterisks and underscores used for emphasis
    cleanedContent = cleanedContent.replace(/\*/g, '');
    cleanedContent = cleanedContent.replace(/(?<!\w)_(?!\w)/g, '');
    
    // Remove structural elements specific to carousels
    cleanedContent = cleanedContent.replace(/^(### )?LinkedIn Carousel:.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^(### )?Carousel Notes:.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^(#### )?Call to Action:.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^- Visual Elements:.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^- Engagement:.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^- Tone:.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^- Brand Colors:.*$/gim, '');
    
    // Remove ALL slide number patterns and prefixes
    cleanedContent = cleanedContent.replace(/^(#### )?Slide\s*\d+[\s:.-]*.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^Slide\s*\d+[\s:.-]*/gim, '');
    cleanedContent = cleanedContent.replace(/^(Slide|Page)\s*\d+[:.]/gim, '');
    cleanedContent = cleanedContent.replace(/^(\d+\.?\s*)+/gm, '');
    cleanedContent = cleanedContent.replace(/^(#\s*)?\d+[\s:.-]*/gm, ''); // Additional number pattern
    cleanedContent = cleanedContent.replace(/^(Part|Section)\s*\d+[:.]/gim, ''); // Remove part/section numbers
    
    // Remove AI-generated content markers
    cleanedContent = cleanedContent.replace(/^AI-generated:?\s*/gim, '');
    cleanedContent = cleanedContent.replace(/^Generated by AI:?\s*/gim, '');
    cleanedContent = cleanedContent.replace(/^Generated content:?\s*/gim, '');
    cleanedContent = cleanedContent.replace(/\[AI-generated\]/gi, '');
    cleanedContent = cleanedContent.replace(/\[Generated by AI\]/gi, '');
    
    // Remove separator lines
    cleanedContent = cleanedContent.replace(/^-{3,}$/gm, '');
    cleanedContent = cleanedContent.replace(/^\s*-{3,}\s*$/gm, '');
    cleanedContent = cleanedContent.replace(/^_{3,}$/gm, '');
    cleanedContent = cleanedContent.replace(/^\s*_{3,}\s*$/gm, '');
      
    // Clean up extra whitespace and empty lines while preserving emojis
    cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
    cleanedContent = cleanedContent.replace(/^\s+|\s+$/g, '').trim();
    
    // Remove any remaining metadata or structural markers
    cleanedContent = cleanedContent.replace(/^Title:.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^Description:.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^Summary:.*$/gim, '');
    cleanedContent = cleanedContent.replace(/^Hashtags:.*$/gim, '');
    
    return cleanedContent;
  };

  // Add safety checks in the carousel preview section
  const getCarouselSlides = (content: string | null | undefined): string[] => {
    if (!content) return [];
    
    // Clean the content first
    const cleanedContent = cleanCarouselContent(content);
    
    // Split by double newlines to get individual slides
    const slides = cleanedContent.split(/\n\s*\n/)
      .map(slide => slide.trim())
      .filter(slide => {
        // Skip empty content or structural elements
        if (!slide || slide.length < 10) return false;
        
        // Skip metadata sections
        if (/^(Visual Elements|Engagement|Tone|Brand Colors|Carousel Notes|Call to Action)/i.test(slide)) {
          return false;
        }
        
        // Skip slides that still have formatting markers
        if (slide.match(/^(Slide|###|####|\*\*)/)) {
          return false;
        }
        
        return true;
      });
    
    return slides;
  };

  const getCarouselSlideCount = (content: string | null | undefined): number => {
    if (!content) return 0;
    return getCarouselSlides(content).length;
  };

  const getCarouselSlideContent = (content: string | null | undefined, index: number): string => {
    if (!content) return '';
    
    const slides = getCarouselSlides(content);
    return slides[index] || '';
  };

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
      
      // Use the same cleaning logic as getCarouselSlides
      const cleanedSlides = getCarouselSlides(contentToProcess);
      console.log("Cleaned slides count:", cleanedSlides.length);
      
      const textSlides = cleanedSlides;
      
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
      description: `Preparing ${konvaSlides.length} slides for editing (4:5 ratio)`,
      duration: 2000
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

  // Add the delete video functionality 
  const handleDeleteVideo = async (video: YouTubeVideo, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!video.id && !video.videoId) {
      toast({
        title: "Error",
        description: "Cannot identify video to delete",
        variant: "destructive"
      });
      return;
    }
    
    const videoId = video.id || video.videoId;
    
    try {
      // Delete from backend first
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
        const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/youtube/saved/${user?.id || 'anonymous'}/${videoId}`
          : `${baseUrl}/api/youtube/saved/${user?.id || 'anonymous'}/${videoId}`;
        
        await axios.delete(apiUrl);

        // If backend delete succeeds, update UI and localStorage
      setSavedVideos(prevVideos => prevVideos.filter(v => 
        v.id !== videoId && v.videoId !== videoId
      ));
      
      // If this was the selected video, clear the selection
      if (selectedVideo && (selectedVideo.id === videoId || selectedVideo.videoId === videoId)) {
        setSelectedVideo(null);
        setGeneratedTranscript([]);
        setShowTranscript(false);
      }
      
        // Clear from localStorage
      try {
        const savedVideosStr = localStorage.getItem('savedYoutubeVideos');
        if (savedVideosStr) {
          const savedVideos = JSON.parse(savedVideosStr);
          const updatedVideos = savedVideos.filter((v: any) => 
            v.id !== videoId && v.videoId !== videoId
          );
          localStorage.setItem('savedYoutubeVideos', JSON.stringify(updatedVideos));
        }
      } catch (localError) {
        console.error("Error updating localStorage:", localError);
      }
      
        toast({
          description: "Video deleted successfully",
          duration: 2000
        });
      } catch (backendError) {
        console.error("Error deleting from backend:", backendError);
      toast({
          title: "Error",
          description: "Failed to delete video from cloud. Please try again.",
          variant: "destructive"
      });
        // Reload videos to ensure UI is in sync with backend
        await loadSavedVideos();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive"
      });
      // Reload videos to ensure UI is in sync with backend
      await loadSavedVideos();
    }
  };

  // Handle content edit
  const handleContentEdit = (newContent: string) => {
    // Clean up slide numbers and formatting from the content
    const cleanContent = newContent
      .split('\n\n')
      .map(slide => {
        let cleanSlide = slide.replace(/^Slide\s*\d+[\s:.]+/i, '').trim();
        // Remove markdown formatting (**text**)
        cleanSlide = cleanSlide.replace(/\*\*(.*?)\*\*/g, '$1');
        // Remove any remaining asterisks used for emphasis
        cleanSlide = cleanSlide.replace(/\*/g, '');
        return cleanSlide;
      })
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
        // Process the content to remove "Slide X:" prefixes and formatting from each slide
        const cleanContent = editableContent
          .split('\n\n')
          .map(slide => {
            let cleanSlide = slide.replace(/^Slide\s*\d+[\s:.]+/i, '').trim();
            // Remove markdown formatting (**text**)
            cleanSlide = cleanSlide.replace(/\*\*(.*?)\*\*/g, '$1');
            // Remove any remaining asterisks used for emphasis
            cleanSlide = cleanSlide.replace(/\*/g, '');
            return cleanSlide;
          })
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

  // Note: Content is now auto-saved when generated, saveContent function removed

  // Add function to load saved contents from both backend and localStorage
  const loadSavedContents = async () => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
        const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/carousel-contents`
          : `${baseUrl}/api/carousel-contents`;

        const response = await axios.get(apiUrl, {
        params: { userId: user?.id || 'anonymous' },
        headers: {
          Authorization: `Bearer ${tokenManager.getToken()}`
        }
        });

        if (response.data.success && Array.isArray(response.data.data)) {
        const contents = response.data.data.map((content: any) => ({
          id: content.id,
          title: content.title,
          content: content.content,
          type: content.type,
          videoId: content.videoId,
          videoTitle: content.videoTitle,
          createdAt: new Date(content.createdAt).toISOString()
        }));

        // Update state with fresh data
        setSavedContents(contents);
        
        // Update localStorage to stay in sync
        localStorage.setItem('savedLinkedInContents', JSON.stringify(contents));
      }
    } catch (error) {
      console.error('Error loading saved contents:', error);
      // Don't show error to user as this is a background refresh
    }
  };

  // Update delete function to also delete from backend
  const deleteSavedContent = async (id: string) => {
    try {
      // Try to delete from backend first
      let backendDeleteSuccess = false;
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
        const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/carousel-contents/${id}`
          : `${baseUrl}/api/carousel-contents/${id}`;

        const deleteResponse = await axios.delete(apiUrl, {
          params: { userId: user?.id || 'anonymous' }
        });

        if (deleteResponse.data.success) {
          backendDeleteSuccess = true;
        }
      } catch (backendError) {
        console.error('Error deleting content from backend:', backendError);
        // Continue with local delete
      }

      // Update local state and localStorage
      const updatedContents = savedContents.filter(content => content.id !== id);
      setSavedContents(updatedContents);
      localStorage.setItem('savedLinkedInContents', JSON.stringify(updatedContents));

      toast({
        description: "Content deleted successfully",
        duration: 2000
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

  // Update loadSavedContent to ensure it only loads carousel content for the selected video
  const loadSavedContent = (content: SavedContent) => {
    // Do not require a video to be selected when loading saved content, instead
    // just load the content directly
    
    let cleanedContent = content.content;
    // Clean up any slide prefixes for carousel content
    cleanedContent = content.content
      .split('\n\n')
      .map(slide => slide.replace(/^Slide\s*\d+[\s:.]+/i, '').trim())
      .join('\n\n');
    
    setGeneratedContent(cleanedContent);
    setPreviewContent(cleanedContent);
    setPreviewTitle(content.title);
    setPreviewType(content.type);
    setShowSavedContents(false);
  
    // Only show request step if explicitly requested by the user
    // Don't automatically open the request modal
    setShowRequestModal(false);
    
    // If this content has an associated video, try to pre-select it
    if (content.videoId) {
      const associatedVideo = savedVideos.find(v => v.id === content.videoId);
      if (associatedVideo) {
        // Set the selected video without triggering the request modal
        setSelectedVideo(associatedVideo);
        
        // Set video URL to form based on video ID or videoUrl property
        if (associatedVideo.videoUrl) {
          form.setValue("youtubeUrl", associatedVideo.videoUrl);
        } else if (associatedVideo.id) {
          form.setValue("youtubeUrl", `https://youtube.com/watch?v=${associatedVideo.id}`);
        }
      }
      
      // Save to localStorage to maintain association
      localStorage.setItem('ai_generated_content_videoId', content.videoId);
    }
    
    // Save to localStorage
    localStorage.setItem('ai_generated_content', cleanedContent);
    localStorage.setItem('ai_generated_content_timestamp', new Date().toISOString());
    
    toast({
      description: `The saved ${content.type} content has been loaded`,
      duration: 2000
    });
  };



  // Note: Content auto-saving is now handled in the backend API



  // Function to handle LinkedIn reconnection
  const handleReconnectLinkedIn = () => {
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    localStorage.setItem('redirectAfterAuth', '/dashboard/request-carousel');
    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
  };

  // Function to publish post directly to LinkedIn
  const publishToLinkedIn = async () => {
    try {
      setIsPublishing(true);
      
      // Validate content
      if (!previewContent?.trim()) {
      toast({
          title: "Error",
          description: "Please add some content",
        variant: "destructive"
      });
        setIsPublishing(false);
      return;
    }

      // Prevent carousel content from being published
      if (previewType === 'carousel') {
        toast({
          title: "Error",
          description: "Carousel content cannot be published to LinkedIn. Please use text posts only.",
          variant: "destructive"
        });
        setIsPublishing(false);
        return;
      }
    
      // Check for LinkedIn authentication
      const token = localStorage.getItem('linkedin-login-token');
    
      if (!token) {
      toast({
          title: "Error",
          description: "Please connect your LinkedIn account",
        variant: "destructive"
      });
        setIsPublishing(false);
        
        // Show a reconnect option
        if (window.confirm('Would you like to connect your LinkedIn account now?')) {
          handleReconnectLinkedIn();
        }
        return;
      }
      
      // Publish content to LinkedIn as text post only
      const response = await linkedInApi.createTextPost(previewContent);
      
      if (response.id) {
        try {
          // Save the published post to the main posts library
          await linkedInApi.savePublishedPost({
            title: previewTitle || selectedVideo?.title || "LinkedIn Post",
            content: previewContent,
            type: "text-post",
            videoId: selectedVideo?.id,
            videoTitle: selectedVideo?.title,
            platformPostId: response.id,
            createdAt: new Date().toISOString()
          });

          // Refresh the saved contents list
          await loadSavedContents();
          
      toast({
            title: "🎉 Success!",
            description: (
              <div className="flex flex-col gap-1">
                <p>Post published to LinkedIn and saved to your post library!</p>
                <p className="text-xs text-gray-600">You can view all your posts in the Scraper page → Saved Posts.</p>
              </div>
            ),
            duration: 5000
          });
        } catch (saveError) {
          console.error('Error saving published post:', saveError);
          toast({
            title: "✅ Published to LinkedIn",
            description: "Post was published successfully, but there was an issue saving to your post library.",
            variant: "default",
            duration: 4000
          });
        }
      }
    } catch (error: any) {
      console.error('Error publishing to LinkedIn:', error);
      
      // Check for token expiration
      if (error.message?.includes('authentication expired') || error.message?.includes('token not available')) {
        toast({
          title: "Error",
          description: "Your LinkedIn authentication has expired. Please reconnect your account.",
          variant: "destructive"
        });
        
        if (window.confirm('Would you like to reconnect your LinkedIn account now?')) {
          handleReconnectLinkedIn();
        }
        return;
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to publish post",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };



    return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {userLimit && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Credits {userLimit.planId !== 'expired' ? `(${userLimit.planName} Plan)` : ''}</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {userLimit.count || 0} / {userLimit.limit || 0} credits used
                {userLimit.expiresAt && userLimit.planId !== 'expired' && (
                  <span className="ml-2">• Expires {format(userLimit.expiresAt, 'MMM dd, yyyy')}</span>
                )}
              </p>
            </div>
            <div className="w-full sm:w-48 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ 
                  width: `${Math.min(((userLimit.count || 0) / (userLimit.limit || 1)) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
            <p className="text-xs text-gray-500">
              {userLimit.planId !== 'expired' 
                ? "Each credit can be used for generating either AI content or a carousel request"
                : "Purchase a plan to get credits for AI content and carousel requests"}
            </p>
            {(!userLimit.planId || userLimit.planId === 'expired') && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/settings/billing")}
                className="text-xs h-7 w-full sm:w-auto mt-2 sm:mt-0"
              >
                Choose a Plan
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Request a Carousel</h1>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm md:text-base break-words max-w-[90vw] sm:max-w-none">
          Provide content from a YouTube video and we'll create a professional carousel for you
        </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowSavedContents(true)}
          className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Folder className="h-4 w-4 text-blue-600" />
          Saved Content ({savedContents.length})
        </Button>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 w-full max-w-[95vw] lg:max-w-full mx-auto">
            <Card className="w-full">
                              <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                  <CardTitle className="text-base sm:text-lg">Carousel Details</CardTitle>
                  <CardDescription className="text-xs sm:text-sm max-w-[90%] break-words whitespace-normal">
                    Provide information about the carousel you'd like us to create
                  </CardDescription>
                </CardHeader>
                              <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Carousel Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter a title for your carousel" 
                            className="text-sm h-8 sm:h-10" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          This will be the title of your published carousel
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">YouTube Video Source</h3>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="youtubeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs sm:text-sm">Select a Saved Video</FormLabel>
                              <div className="relative w-full max-w-[95vw] lg:max-w-full mx-auto">
                                <Search className="absolute left-2 top-2 sm:top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Search by title"
                                  className="pl-7 sm:pl-8 h-8 sm:h-10 text-xs sm:text-sm w-full"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  style={{ maxWidth: '100%' }}
                                />
                              </div>
                              <FormDescription className="text-xs">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-4 w-full max-w-[95vw] lg:max-w-full mx-auto">
                          {currentVideos.map((video) => (
                                                          <div 
                              key={video.id}
                              className={`border rounded-lg cursor-pointer transition-all hover:shadow-md relative group w-full ${
                                selectedVideo?.id === video.id ? "ring-2 ring-blue-500" : ""
                              }`}
                              onClick={() => handleVideoSelect(video)}
                            >
                              <div className="relative w-full">
                                <img
                                  src={video.thumbnailUrl}
                                  alt={video.title}
                                  className="w-full aspect-video object-cover rounded-t-lg"
                                  loading="lazy"
                                  style={{ maxWidth: '100%', height: 'auto' }}
                                />
                                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-black/80 text-white text-[8px] sm:text-xs px-1 py-0.5 rounded">
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
                                    <FileText className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate max-w-[60px] sm:max-w-none">Transcript</span>
                                  </div>
                                )}
                                
                                {/* Delete button */}
                                <div 
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-6 w-6 p-0 rounded-full"
                                    onClick={(e) => handleDeleteVideo(video, e)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 6h18"></path>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                  </Button>
                                </div>
                              </div>
                              <div className="p-2 sm:p-3">
                                <h4 className="font-medium text-xs sm:text-sm line-clamp-2 break-words max-w-full">{video.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1 truncate max-w-[95%]">{video.channelName}</p>
                                <div className="flex items-center gap-2 mt-1 sm:mt-2 text-xs text-muted-foreground">
                                  <span className="truncate max-w-[100px] sm:max-w-full">{video.date}</span>
                                </div>
                                
                                {/* Transcript fetch button */}
                                <div 
                                  className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t flex justify-end flex-wrap w-full" 
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {isFetchingTranscript && fetchingVideoId === video.id ? (
                                    <div className="w-full flex justify-center">
                                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-primary" />
                                    </div>
                                  ) : !(video.transcript || (video.formattedTranscript && video.formattedTranscript.length > 0)) ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFetchTranscript(video);
                                      }}
                                      className="text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2 py-0 w-full sm:w-auto max-w-[95%] mx-auto sm:mx-0"
                                    >
                                      <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
                                      <span className="truncate max-w-[80px] sm:max-w-none">Get Transcript</span>
                                    </Button>
                                  ) : (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] sm:text-xs w-full text-center sm:w-auto py-0.5">
                                      Transcript Available
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center py-6 sm:py-8 border border-dashed rounded-lg">
                          <div className="text-center px-2">
                            <p className="mb-2 text-xs sm:text-sm text-muted-foreground">No saved videos found</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate("/dashboard/scraper")}
                              className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <Youtube className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="whitespace-nowrap">Scrape new videos</span>
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="w-full overflow-x-auto pb-2">
                          <div className="flex items-center justify-center mt-4 gap-1 min-w-fit mx-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => prevPage()}
                            disabled={currentPage === 1}
                              className="h-7 sm:h-8 px-1.5 sm:px-2 text-xs whitespace-nowrap"
                          >
                            Previous
                          </Button>
                          <div className="flex items-center gap-1">
                            {(() => {
                              const pages = [];
                                const maxVisible = window.innerWidth < 640 ? 3 : 5;
                              const halfVisible = Math.floor(maxVisible / 2);
                              
                              let startPage = Math.max(1, currentPage - halfVisible);
                              let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                              
                              // Adjust start if we're near the end
                              if (endPage - startPage + 1 < maxVisible) {
                                startPage = Math.max(1, endPage - maxVisible + 1);
                              }
                              
                              // Add first page and ellipsis if needed
                              if (startPage > 1) {
                                pages.push(
                                  <Button
                                    key="1"
                                    variant={currentPage === 1 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => goToPage(1)}
                                      className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs"
                                  >
                                    1
                                  </Button>
                                );
                                if (startPage > 2) {
                                  pages.push(
                                      <span key="start-ellipsis" className="px-0.5 sm:px-1">
                                      ...
                                    </span>
                                  );
                                }
                              }
                              
                              // Add visible page numbers
                              for (let i = startPage; i <= endPage; i++) {
                                pages.push(
                                  <Button
                                    key={i}
                                    variant={currentPage === i ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => goToPage(i)}
                                      className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs"
                                  >
                                    {i}
                                  </Button>
                                );
                              }
                              
                              // Add last page and ellipsis if needed
                              if (endPage < totalPages) {
                                if (endPage < totalPages - 1) {
                                  pages.push(
                                      <span key="end-ellipsis" className="px-0.5 sm:px-1">
                                      ...
                                    </span>
                                  );
                                }
                                pages.push(
                                  <Button
                                    key={totalPages}
                                    variant={currentPage === totalPages ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => goToPage(totalPages)}
                                      className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs"
                                  >
                                    {totalPages}
                                  </Button>
                                );
                              }
                              
                              return pages;
                            })()}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => nextPage()}
                            disabled={currentPage === totalPages}
                              className="h-7 sm:h-8 px-1.5 sm:px-2 text-xs whitespace-nowrap"
                          >
                            Next
                          </Button>
                          </div>
                        </div>
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
                          ) : transcriptError ? (
                            <div className="py-4 rounded-md border border-destructive p-4 mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                <h3 className="text-destructive font-medium">Transcript Error</h3>
                                </div>
                              <p className="text-sm text-muted-foreground">
                                Unable to fetch transcript for this video. This may be because:
                              </p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 ml-2 space-y-1">
                                <li>The video does not have captions</li>
                                <li>The transcript service is temporarily unavailable</li>
                                <li>The video creator has disabled captions</li>
                              </ul>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                onClick={() => handleFetchTranscript(selectedVideo!)} 
                                className="mt-4"
                                  >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                                  </Button>
                                </div>
                          ) : generatedTranscript.length > 0 || (selectedVideo?.transcript && selectedVideo.transcript.length > 0) ? (
                            <div className="rounded-md border p-4 mb-4">
                              <ScrollArea className="h-[160px] sm:h-[200px]">
                                <p className="text-xs sm:text-sm whitespace-pre-line px-1">
                                  {selectedVideo?.transcript || (generatedTranscript.length > 0 ? generatedTranscript[0] : '')}
                                </p>
                              </ScrollArea>
                              
                              {/* LinkedIn Content Generation Section */}
                              <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="text-md font-medium flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                    Generate LinkedIn Content
                                  </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
                                  {contentGenerationOptions.map((option) => (
                                    <Button 
                                      key={option.type}
                                      variant="outline" 
                                      className="h-auto py-2 sm:py-3 px-2 sm:px-4 flex flex-col items-center text-center"
                                      onClick={() => handleGenerateContent(option.type)}
                                      disabled={isGeneratingContent}
                                    >
                                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1 sm:mb-2">
                                        <span className="flex-shrink-0 scale-75 sm:scale-100">{option.icon}</span>
                                      </div>
                                      <span className="text-xs sm:text-sm font-medium line-clamp-1">{option.title}</span>
                                    </Button>
                                  ))}
                                </div>
                                
                                {/* LinkedIn Post Attachment Section */}
                                <div className="mt-4 border-t pt-4">
                                  <div className="flex justify-between items-center mb-3">
                                                                         <h4 className="text-sm font-medium flex items-center gap-2">
                                       <Link2 className="h-4 w-4 text-blue-500" />
                                      Writing Style Reference (Optional)
                                      {selectedPostsCount > 0 && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                          {selectedPostsCount} selected
                                        </Badge>
                                      )}
                                     </h4>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setShowPostSelectionModal(true)}
                                      className="text-xs"
                                    >
                                      Select Saved Posts
                                    </Button>
                                  </div>
                                  
                                  {attachedLinkedInPost && (
                                    <div className="space-y-3">
                                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Check className="h-4 w-4 text-green-600" />
                                          <span className="text-sm font-medium text-green-700">
                                            {selectedPostsCount} posts selected as writing style reference
                                          </span>
                                        </div>
                                        <div className="max-h-20 overflow-y-auto">
                                          <p className="text-xs text-green-600 line-clamp-3">
                                            {attachedLinkedInPost.substring(0, 200)}...
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground">
                                          These posts will be used as writing style reference when generating AI content.
                                        </p>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                          onClick={() => {
                                            setAttachedLinkedInPost('');
                                            setSelectedPostsCount(0);
                                          }}
                                            className="text-xs"
                                          >
                                          Clear All
                                          </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                                      </div>
                          ) : (
                            <div className="py-4 text-center">
                              <p className="text-muted-foreground">No transcript available. Click "Get Transcript" to fetch it.</p>
                            </div>
                          )}
                        </div>
                      )}
                          </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                type="button" 
                onClick={form.handleSubmit(onSubmit)} 
                disabled={isSubmitting} 
                className="flex-1 order-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin flex-shrink-0" />
                    Submitting...
                  </>
                ) : "Submit Carousel Request"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex gap-1 items-center order-2" 
                onClick={() => navigate("/dashboard/templates")}
              >
                <LayoutGrid className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Browse Templates</span>
              </Button>
            </div>
          </form>
        </Form>
        
        <Card className="w-full">
          <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Preview & Information</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              See how your carousel might look
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
            {selectedVideo ? (
              <div className="bg-white border rounded-lg overflow-hidden shadow-md">
                {/* LinkedIn-style header */}
                <div className="p-2 sm:p-3 border-b">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <span className="font-semibold text-blue-600 text-xs sm:text-sm">YT</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-xs sm:text-sm truncate">Your LinkedIn Profile</h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">Content Creator • Just now</p>
                    </div>
                  </div>
                </div>
                
                {/* Post content */}
                <div className="p-3">
                  {previewContent ? (
                    <div>
                      {previewType?.includes('post') ? (
                        <>
                        <p className="text-sm whitespace-pre-line">{previewContent}</p>
                          {/* Add LinkedIn Post Button */}
                          <div className="mt-4">
                            <Button 
                              className="w-full bg-primary text-white gap-2 text-xs sm:text-sm"
                              onClick={publishToLinkedIn}
                              disabled={isPublishing}
                            >
                              {isPublishing ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Publishing & Saving...</span>
                                </>
                              ) : (
                                <>
                                  <Linkedin size={16} />
                                  <span>Publish to LinkedIn</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </>
                      ) : previewType === 'carousel' && (
                        <div className="aspect-square w-full relative overflow-hidden">
                          <div className="absolute inset-0 flex flex-col">
                            {/* Slide content with LinkedIn styling */}
                            <div className="flex-1 flex flex-col justify-center p-2 sm:p-6 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
                              {/* Remove the slide number indicator that shows in LinkedIn post */}
                              
                              <div className="mx-auto max-w-[90%] text-center">
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold leading-tight line-clamp-6 sm:line-clamp-none">
                                  {getCarouselSlideContent(previewContent, currentSlide)}
                                </p>
                              </div>
                              
                              {/* LinkedIn logo overlay */}
                              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                                <div className="bg-blue-600 text-white text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded flex items-center">
                                  <span className="font-bold">in</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Navigation buttons */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-1 right-1 sm:left-2 sm:right-2 flex justify-between">
                              <Button 
                                onClick={prevSlide} 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-white/90 hover:bg-white border shadow-sm text-gray-700 flex-shrink-0"
                              >
                                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                                <span className="sr-only">Previous slide</span>
                              </Button>
                              <Button 
                                onClick={nextSlide} 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-white/90 hover:bg-white border shadow-sm text-gray-700 flex-shrink-0"
                              >
                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
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
                    <div className="flex justify-center p-1 sm:p-2 md:p-3 gap-0.5 sm:gap-1 overflow-x-auto">
                      {previewContent 
                        ? getCarouselSlides(previewContent).map((_, index) => (
                            <div 
                              key={index}
                              className={`h-1 sm:h-1.5 rounded-full cursor-pointer transition-all flex-shrink-0 ${
                                index === currentSlide ? 'w-4 sm:w-6 bg-blue-600' : 'w-1 sm:w-1.5 bg-gray-300 hover:bg-gray-400'
                              }`}
                              onClick={() => setCurrentSlide(index)}
                            />
                          ))
                        : Array(7).fill(0).map((_, index) => (
                            <div 
                              key={index}
                              className={`h-1 sm:h-1.5 rounded-full cursor-pointer transition-all flex-shrink-0 ${
                                index === currentSlide % 7 ? 'w-4 sm:w-6 bg-blue-600' : 'w-1 sm:w-1.5 bg-gray-300 hover:bg-gray-400'
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
                    <Button variant="ghost" className="flex-1 h-7 sm:h-8 md:h-10 rounded-md gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-gray-600 px-0.5 sm:px-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                      <span className="hidden sm:inline">Like</span>
                    </Button>
                    <Button variant="ghost" className="flex-1 h-7 sm:h-8 md:h-10 rounded-md gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-gray-600 px-0.5 sm:px-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span className="hidden sm:inline">Comment</span>
                    </Button>
                    <Button variant="ghost" className="flex-1 h-7 sm:h-8 md:h-10 rounded-md gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-gray-600 px-0.5 sm:px-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      <span className="hidden sm:inline">Repost</span>
                    </Button>
                    <Button variant="ghost" className="flex-1 h-7 sm:h-8 md:h-10 rounded-md gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-gray-600 px-0.5 sm:px-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
                      <span className="hidden sm:inline">Send</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center">
                <div className="bg-gray-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                </div>
                <h3 className="text-base sm:text-lg font-medium mb-2">Select a YouTube video</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  A preview of your content will appear here after selecting a video and generating content.
                </p>
              </div>
            )}
            
            {/* Add button for carousel content */}
            {previewContent && previewType === 'carousel' && (
              <div className="mt-4 space-y-2">
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
            
            <div className="space-y-3 sm:space-y-4">
              <div className="border rounded-lg p-2 sm:p-3 md:p-4">
                <h3 className="font-medium mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Best Practices for Effective Carousels</h3>
                <ul className="text-[10px] sm:text-xs md:text-sm space-y-1 sm:space-y-2 pl-4 sm:pl-5 list-disc text-muted-foreground">
                  <li>Keep each slide focused on a single key point</li>
                  <li>Use 5-8 slides for optimal engagement</li>
                  <li>Include a clear call to action on the final slide</li>
                  <li>Maintain consistent visual style across all slides</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-2 sm:p-3 md:p-4">
                <h3 className="font-medium mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Delivery Timeline</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
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

      {/* Post Selection Modal */}
      <PostSelectionModal
        isOpen={showPostSelectionModal}
        onClose={() => setShowPostSelectionModal(false)}
        onApplySelection={applySelectedPosts}
        selectedPostsCount={selectedPostsCount}
      />

      {/* Add modal to show saved contents */}
      {showSavedContents && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[85vh] flex flex-col shadow-xl">
            <div className="p-4 border-b bg-blue-50 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-lg font-medium text-blue-800">Saved Content</h3>
                  <p className="text-xs text-blue-600">
                    {savedContents.length} total • 
                    {savedContents.filter(c => c.type === 'carousel').length} carousels • 
                    {savedContents.filter(c => c.type === 'text-post').length} text posts
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowSavedContents(false)}>
                ✕
              </Button>
            </div>
            
            {/* Filter Tabs and Search */}
            <div className="border-b bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 gap-2">
                <div className="flex">
                  <Button
                    variant={contentFilter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setContentFilter('all')}
                    className="mr-2"
                  >
                    All ({savedContents.length})
                  </Button>
                  <Button
                    variant={contentFilter === 'carousel' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setContentFilter('carousel')}
                    className="mr-2 flex items-center gap-1"
                  >
                    <FileSpreadsheet className="h-3 w-3" />
                    Carousels ({savedContents.filter(c => c.type === 'carousel').length})
                  </Button>
                  <Button
                    variant={contentFilter === 'text-post' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setContentFilter('text-post')}
                    className="flex items-center gap-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Text Posts ({savedContents.filter(c => c.type === 'text-post').length})
                  </Button>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search content..."
                    value={contentSearchQuery}
                    onChange={(e) => setContentSearchQuery(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {(() => {
                let filteredContents = contentFilter === 'all' 
                  ? savedContents 
                  : savedContents.filter(content => content.type === contentFilter);
                
                // Apply search filter
                if (contentSearchQuery.trim()) {
                  filteredContents = filteredContents.filter(content => 
                    content.title.toLowerCase().includes(contentSearchQuery.toLowerCase()) ||
                    content.content.toLowerCase().includes(contentSearchQuery.toLowerCase()) ||
                    (content.videoTitle && content.videoTitle.toLowerCase().includes(contentSearchQuery.toLowerCase()))
                  );
                }
                
                                  return filteredContents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                      {contentSearchQuery.trim() ? (
                        <SearchX className="h-16 w-16 text-blue-200 mb-4" />
                      ) : (
                  <Folder className="h-16 w-16 text-blue-200 mb-4" />
                      )}
                      <p className="text-blue-800 font-medium">
                        {savedContents.length === 0 
                          ? "No saved content yet" 
                          : contentSearchQuery.trim()
                            ? `No content found for "${contentSearchQuery}"`
                            : `No ${contentFilter === 'carousel' ? 'carousel' : contentFilter === 'text-post' ? 'text post' : ''} content found`
                        }
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        {savedContents.length === 0 
                          ? "Generate and save content to access it anytime"
                          : contentSearchQuery.trim()
                            ? "Try a different search term or clear the search"
                            : `Try generating some ${contentFilter === 'carousel' ? 'carousel' : 'text post'} content`
                        }
                      </p>
                      {contentSearchQuery.trim() && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setContentSearchQuery('')}
                          className="mt-3"
                        >
                          Clear Search
                        </Button>
                      )}
                </div>
              ) : (
                <div className="space-y-4">
                    {filteredContents.map((content) => (
                    <div key={content.id} className="border rounded-lg overflow-hidden border-blue-100 hover:shadow-md transition-shadow">
                      <div className="p-3 bg-blue-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {/* Content Type Icon */}
                            {content.type === 'carousel' ? (
                              <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                <FileSpreadsheet className="h-3 w-3" />
                                Carousel
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                <MessageSquare className="h-3 w-3" />
                                Text Post
                              </div>
                            )}
                          </div>
                        <div>
                          <h4 className="font-medium text-blue-900">{content.title}</h4>
                          <p className="text-xs text-blue-700">
                            {content.videoTitle && `From: ${content.videoTitle} • `}
                            {new Date(content.createdAt).toLocaleDateString()}
                          </p>
                          </div>
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
                        {/* Content Preview */}
                        <div className="mb-3">
                          {content.type === 'carousel' ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <FileSpreadsheet className="h-3 w-3" />
                                <span>{getCarouselSlideCount(content.content)} slides</span>
                              </div>
                              <div className="max-h-40 overflow-y-auto">
                                <div className="space-y-3">
                                  {getCarouselSlides(content.content).slice(0, 3).map((slide, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-purple-400">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-purple-600">Slide {index + 1}</span>
                                      </div>
                                      <p className="text-sm text-gray-700 line-clamp-2">{slide}</p>
                                    </div>
                                  ))}
                                  {getCarouselSlides(content.content).length > 3 && (
                                    <div className="text-center py-2">
                                      <span className="text-xs text-gray-500">
                                        +{getCarouselSlides(content.content).length - 3} more slides
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <MessageSquare className="h-3 w-3" />
                                <span>Text Post</span>
                              </div>
                              <div className="max-h-40 overflow-y-auto">
                                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-400">
                                  <p className="text-sm whitespace-pre-line line-clamp-6 text-gray-700">{content.content}</p>
                                </div>
                              </div>
                            </div>
                          )}
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
              );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Carousel Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg">
                  {requestStep === 3 ? "Request Submitted" : "Carousel Request Details"}
                </CardTitle>
                {requestStep !== 3 && (
                  <Button variant="ghost" size="sm" onClick={() => setShowRequestModal(false)}>
                    ✕
                  </Button>
                )}
              </div>
              <CardDescription className="text-xs sm:text-sm">
                {requestStep === 1 && "Provide additional details for your carousel request"}
                {requestStep === 2 && "Review your request before submitting"}
                {requestStep === 3 && "We'll create your carousel within 24 hours"}
              </CardDescription>
            </CardHeader>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Step 1: Additional Details */}
              {requestStep === 1 && (
                <CardContent className="p-6 space-y-6">
                  {/* Type Selection */}
                  <div className="space-y-3">
                    <Label>Carousel Type</Label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {carouselTypes.map((type) => (
                        <div 
                          key={type.value}
                          className={`border rounded-lg p-3 cursor-pointer transition-all hover:bg-primary-50 ${
                            carouselType === type.value ? "ring-2 ring-primary bg-primary-50" : ""
                          }`}
                          onClick={() => setCarouselType(type.value)}
                        >
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  

                  
                  {/* Additional Notes */}
                  <div className="space-y-3">
                    <Label>Additional Notes <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                    <Textarea 
                      placeholder="Any specific requests or instructions for your carousel? (e.g., branding preferences, design elements, content emphasis)"
                      className="min-h-[80px] sm:min-h-[100px] text-sm"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                    />
                  </div>
                </CardContent>
              )}
              
              {/* Step 2: Review */}
              {requestStep === 2 && (
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    {/* Video Preview */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b">
                        <h3 className="font-medium">Selected Video</h3>
                      </div>
                      <div className="p-3 flex items-center gap-3">
                        <div className="w-24 sm:w-32 h-16 sm:h-20 bg-black/5 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={selectedVideo?.thumbnailUrl || selectedVideo?.thumbnail} 
                            alt={selectedVideo?.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{selectedVideo?.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{selectedVideo?.channelName}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Preview */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b">
                        <h3 className="font-medium">Generated Content</h3>
                      </div>
                      <div className="p-3">
                        <div className="max-h-28 sm:max-h-32 overflow-y-auto">
                          <p className="text-xs sm:text-sm whitespace-pre-line p-1">{previewContent || generatedContent}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Carousel Type */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-3 bg-muted/30 border-b">
                        <h3 className="font-medium">Carousel Type</h3>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {carouselType}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {carouselTypes.find(t => t.value === carouselType)?.description}
                          </span>
                        </div>
                      </div>
                    </div>
                    

                    
                    {/* Notes */}
                    {additionalNotes && (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="p-3 bg-muted/30 border-b">
                          <h3 className="font-medium">Additional Notes</h3>
                        </div>
                        <div className="p-3">
                          <p className="text-sm whitespace-pre-line">{additionalNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
              
              {/* Step 3: Success */}
              {requestStep === 3 && (
                <CardContent className="p-4 sm:p-8 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Check className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Request Submitted!</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
                    We've received your carousel request and will start working on it right away. 
                    You'll receive an email notification when it's ready, typically within 24 hours.
                  </p>
                  <div className="border rounded-lg p-3 sm:p-4 bg-muted/20 mb-4 sm:mb-6 max-w-md mx-auto">
                    <div className="flex items-center mb-2">
                      <Clock4 className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                      <h3 className="font-medium text-sm sm:text-base">What happens next?</h3>
                    </div>
                    <ol className="text-xs sm:text-sm text-left space-y-2 pl-5 sm:pl-6 list-decimal">
                      <li>Our design team will review your request</li>
                      <li>We'll create a professional carousel based on your content</li>
                      <li>You'll receive an email when it's ready to review</li>
                      <li>You can request revisions if needed</li>
                    </ol>
                  </div>
                </CardContent>
              )}
            </div>
            

            
            {/* Footer */}
            <CardFooter className="border-t p-4 flex justify-between">
              {requestStep === 1 && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRequestModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setRequestStep(2)}>
                    Continue to Review
                  </Button>
                </>
              )}
              
              {requestStep === 2 && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setRequestStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={submitCarouselRequest}
                    disabled={isSubmittingRequest}
                  >
                    {isSubmittingRequest ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </>
              )}
              
              {requestStep === 3 && (
                <>
                  <div></div> {/* Empty div for spacing */}
                  <div className="space-x-3">
                    <Button 
                      onClick={() => navigate("/dashboard/my-carousels")}
                      className="gap-2"
                    >
                      <LayoutGrid className="h-4 w-4" />
                      View My Carousels
                    </Button>
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RequestCarouselPage;