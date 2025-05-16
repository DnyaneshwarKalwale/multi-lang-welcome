import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Linkedin, Globe, Youtube, Copy, 
  Lightbulb, MessageSquare, Save, Loader2,
  FileText, ArrowRight, PlusCircle, Twitter, ImageIcon, Folder
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import axios from 'axios';
import { saveImageToGallery } from '@/utils/cloudinaryDirectUpload';
import api from '@/services/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";

interface ScraperResult {
  content: string;
  keyPoints: string[];
  tone: string;
  suggestedHook: string;
  estimatedReadTime: number;
  wordCount: number;
}

interface Tweet {
  id: string;
  text: string;
  full_text?: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  author: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
  };
  media?: {
    media_key: string;
    type: string;
    url: string;
    preview_image_url?: string;
    alt_text?: string;
    width?: number;
    height?: number;
  }[];
}

interface TwitterResult {
  tweets: Tweet[];
  username: string;
  profileImageUrl?: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  view_count: number;
  upload_date: string;
  transcript?: string;
  formattedTranscript?: string[];
  language?: string;
  is_generated?: boolean;
  channelName?: string;
}

interface YouTubeChannelResult {
  videos: YouTubeVideo[];
  channelName: string;
  channelImageUrl?: string; // Optional channel image URL
}

const ScraperPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('linkedin');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);
  const [twitterResult, setTwitterResult] = useState<TwitterResult | null>(null);
  const [selectedTweets, setSelectedTweets] = useState<Set<string>>(new Set());
  const [contentPreferences, setContentPreferences] = useState({
    format: 'short',
    tone: 'professional'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [linkedinContent, setLinkedinContent] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedContentImage, setGeneratedContentImage] = useState<string | null>(null);
  const [youtubeChannelResult, setYoutubeChannelResult] = useState<YouTubeChannelResult | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [isFetchingChannel, setIsFetchingChannel] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>("");
  const [loadingTranscriptIds, setLoadingTranscriptIds] = useState<Set<string>>(new Set());
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});
  const [lastSearchedChannel, setLastSearchedChannel] = useState<string>('');
  const [videosWithTranscripts, setVideosWithTranscripts] = useState<Set<string>>(new Set());

  // Helper functions for toast
  const toastSuccess = (message: string) => {
    toast({
      description: message,
      variant: "default",
    });
  };

  const toastError = (message: string) => {
    toast({
      description: message,
      variant: "destructive",
    });
  };

  // Save YouTube channel results to localStorage
  const saveYoutubeChannelToStorage = (channelResult: YouTubeChannelResult) => {
    try {
      localStorage.setItem('youtubeChannelResult', JSON.stringify(channelResult));
      localStorage.setItem('lastSearchedChannel', channelResult.channelName);
    } catch (error) {
      console.error('Error saving YouTube channel to localStorage:', error);
    }
  };

  // Load YouTube channel results from localStorage
  const loadYoutubeChannelFromStorage = () => {
    try {
      const savedChannel = localStorage.getItem('youtubeChannelResult');
      const lastChannel = localStorage.getItem('lastSearchedChannel');
      
      if (savedChannel) {
        setYoutubeChannelResult(JSON.parse(savedChannel));
      }
      
      if (lastChannel) {
        setLastSearchedChannel(lastChannel);
      }
    } catch (error) {
      console.error('Error loading YouTube channel from localStorage:', error);
    }
  };

  // Clear previous channel results when searching for a new channel
  useEffect(() => {
    if (activeTab === 'youtube' && inputUrl && lastSearchedChannel && !inputUrl.includes(lastSearchedChannel)) {
      // User is searching for a different channel, clear the previous results
      setYoutubeChannelResult(null);
    }
  }, [activeTab, inputUrl, lastSearchedChannel]);

  // Update input URL on mount if we have a last searched channel
  useEffect(() => {
    if (activeTab === 'youtube' && lastSearchedChannel && !inputUrl) {
      setInputUrl(lastSearchedChannel.startsWith('@') ? lastSearchedChannel : `@${lastSearchedChannel}`);
    }
  }, [activeTab, lastSearchedChannel, inputUrl]);

  // Handle clearing YouTube results when needed
  const clearYoutubeResults = () => {
    setYoutubeChannelResult(null);
    setLastSearchedChannel('');
    localStorage.removeItem('youtubeChannelResult');
    localStorage.removeItem('lastSearchedChannel');
  };

  // Modified YouTube channel scrape handler to clear previous results
  const handleYouTubeChannelScrape = async () => {
    if (!inputUrl) {
      toastError('Please enter a YouTube channel URL or @handle');
      return;
    }

    // Extract channel name for comparison
    const inputChannelName = inputUrl.includes('@') ? inputUrl.split('@')[1] : inputUrl;
    
    // If searching for a different channel, clear previous results
    if (lastSearchedChannel && lastSearchedChannel !== inputChannelName) {
      clearYoutubeResults();
    }

    setIsFetchingChannel(true);
    
    try {
      const response = await api.post('/youtube/channel', {
        channelName: inputUrl
      });
      
      if (response.data && response.data.success) {
        // Get channel name from the first video if available
        let detectedChannelName = inputChannelName;
        if (response.data.data && response.data.data.length > 0 && response.data.data[0].channelName) {
          detectedChannelName = response.data.data[0].channelName;
        }
        
        const channelResult = {
          videos: response.data.data,
          channelName: detectedChannelName
        };
        
        setYoutubeChannelResult(channelResult);
        setLastSearchedChannel(inputChannelName); // Keep using input for search comparison
        
        // Save to localStorage for persistence
        saveYoutubeChannelToStorage(channelResult);
        
        toastSuccess(`Found ${response.data.data.length} videos from ${detectedChannelName}`);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch channel videos');
      }
    } catch (error) {
      console.error('Error fetching YouTube channel:', error);
      toastError('Failed to fetch channel videos. Please try again.');
    } finally {
      setIsFetchingChannel(false);
    }
  };

  const handleScrape = async () => {
    if (!inputUrl) {
      toastError('Please enter a valid URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (activeTab === 'twitter') {
        await handleTwitterScrape();
      } else if (activeTab === 'youtube') {
        if (inputUrl.includes('/channel/') || inputUrl.includes('/@') || inputUrl.startsWith('@')) {
          await handleYouTubeChannelScrape();
        } else {
          toastError('Please enter a YouTube channel URL or @handle');
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResult({
          content: "This is sample extracted content. In a real implementation, this would be the content scraped from the provided URL.",
          keyPoints: [
            "Sample key point 1",
            "Sample key point 2",
            "Sample key point 3"
          ],
          tone: "Professional",
          suggestedHook: "Here's an interesting insight from the content...",
          estimatedReadTime: 2,
          wordCount: 150
        });
        toastSuccess('Content scraped successfully!');
      }
    } catch (error) {
      console.error(`Error scraping content from ${activeTab}:`, error);
      toastError(`Failed to scrape content from ${activeTab}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterScrape = async () => {
    let username = inputUrl;
    
    if (inputUrl.includes('twitter.com/') || inputUrl.includes('x.com/')) {
      const urlParts = inputUrl.split('/');
      username = urlParts[urlParts.length - 1];
      username = username.split('?')[0];
    }
    
    if (username.startsWith('@')) {
      username = username.substring(1);
    }
    
    if (!username) {
      toastError('Please enter a valid Twitter username');
      return;
    }
    
    const response = await api.get(`/twitter/user/${username}`);
    
    if (response.data && response.data.success) {
      const tweets = response.data.data;
      
      setTwitterResult({
        tweets,
        username,
        profileImageUrl: tweets[0]?.author?.profile_image_url
      });
      
      toastSuccess(`Successfully retrieved ${tweets.length} tweets from @${username}`);
    } else {
      throw new Error(response.data?.message || 'Failed to fetch tweets');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toastSuccess('Copied to clipboard!');
  };

  const handleSaveToInspiration = () => {
    toastSuccess('Saved to Inspiration Vault!');
  };

  const handleCreatePost = () => {
    navigate('/dashboard/post');
  };

  const handleToggleTweetSelection = (tweetId: string) => {
    const newSelection = new Set(selectedTweets);
    
    if (newSelection.has(tweetId)) {
      newSelection.delete(tweetId);
    } else {
      newSelection.add(tweetId);
    }
    
    setSelectedTweets(newSelection);
  };

  const handleSaveSelectedTweets = async () => {
    if (selectedTweets.size === 0) {
      toastError('Please select at least one tweet to save');
      return;
    }
    
    if (!twitterResult || !twitterResult.tweets) {
      toastError('No tweets available to save');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const tweetsToSave = twitterResult.tweets.filter(tweet => 
        selectedTweets.has(tweet.id)
      );
      
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/twitter/save`
        : `${baseUrl}/api/twitter/save`;
      
      const response = await axios.post(apiUrl, {
        tweets: tweetsToSave,
        username: user?.email || 'anonymous',
        options: {
          preserveThreadOrder: true
        }
      });
      
      if (response.data && response.data.success) {
        toastSuccess(`Saved ${response.data.count} tweets successfully!`);
        setSelectedTweets(new Set());
      } else {
        throw new Error(response.data?.message || 'Failed to save tweets');
      }
    } catch (error) {
      console.error('Error saving tweets:', error);
      toastError('Failed to save tweets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSelectedVideos = async () => {
    if (selectedVideos.size === 0 || !youtubeChannelResult) {
      toastError('Please select at least one video');
      return;
    }

    setIsLoading(true);
    
    try {
      const videosToSave = youtubeChannelResult.videos.filter(video => 
        selectedVideos.has(video.id)
      );

      // Current timestamp to ensure all videos in this batch have the same save time
      const savedTimestamp = new Date().toISOString();

      // Enhance videos but WITHOUT dummy transcripts
      const enhancedVideos = videosToSave.map(video => ({
        ...video,
        // Don't include transcript data if we haven't fetched it
        // transcript: "This is a placeholder transcript. The real transcript would contain the full text from the video.", // Dummy full transcript - REMOVED
        // formattedTranscript: generateDummyTranscript(video.id), // Array of bullet points - REMOVED
        language: "English",
        is_generated: false,
        savedAt: savedTimestamp,
        status: 'ready',
        videoId: video.id, // Ensure videoId is explicitly set
        savedTimestamp: savedTimestamp, // Add explicit timestamp for sorting
        userId: user?.id || 'anonymous'
      }));

      let backendSaveSuccess = false;
      
      // Save to backend first - this should be the primary storage
      try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/youtube/save-videos`
          : `${baseUrl}/api/youtube/save-videos`;
        
        const backendResponse = await axios.post(apiUrl, {
          videos: enhancedVideos,
          userId: user?.id || 'anonymous'
        });
        
        if (backendResponse.data.success) {
          backendSaveSuccess = true;
          toastSuccess(`Saved ${backendResponse.data.count} videos to cloud!`);
        } else {
          console.warn("Backend save warning:", backendResponse.data.message);
          toastError("Failed to save videos to cloud: " + backendResponse.data.message);
        }
      } catch (backendError) {
        console.error("Error saving videos to backend:", backendError);
        toastError("Failed to save videos to cloud. Saving locally as backup.");
      }

      // Save videos locally as a backup/fallback (even if backend save succeeds)
      let existingSavedVideos = [];
      try {
        const existingSavedVideosStr = localStorage.getItem('savedYoutubeVideos');
        if (existingSavedVideosStr) {
          existingSavedVideos = JSON.parse(existingSavedVideosStr);
        }
      } catch (error) {
        console.error("Error parsing existing saved videos:", error);
      }
      
      // Combine existing videos with new ones, replacing duplicates
      const allVideoIds = new Map();
      
      // First add existing videos
      existingSavedVideos.forEach((video: any) => {
        allVideoIds.set(video.id || video.videoId, video);
      });
      
      // Then add new videos (will overwrite existing ones with same ID)
      enhancedVideos.forEach(video => {
        allVideoIds.set(video.id || video.videoId, video);
      });
      
      // Convert map back to array
      const allSavedVideos = Array.from(allVideoIds.values());
      
      // Save to localStorage as backup
        localStorage.setItem('savedYoutubeVideos', JSON.stringify(allSavedVideos));
        
      // Let user know videos were saved
      if (!backendSaveSuccess) {
        toastSuccess(`Saved ${enhancedVideos.length} videos to local storage as backup`);
      } else {
        toastSuccess(`Videos saved successfully to cloud and local storage!`);
      }
      
        setSelectedVideos(new Set());
      
      // Try creating carousels only if backend save was successful
      if (backendSaveSuccess) {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const carouselApiUrl = baseUrl.endsWith('/api')
            ? `${baseUrl}/youtube-carousels` // Use the new non-protected endpoint
            : `${baseUrl}/api/youtube-carousels`; // Use the new non-protected endpoint
          
          const carouselResponse = await axios.post(carouselApiUrl, {
            videos: enhancedVideos,
            userId: user?.id || 'anonymous'
          });
          
          if (carouselResponse.data.success) {
            toastSuccess(`Created ${carouselResponse.data.count} carousel(s)!`);
          }
        } catch (carouselError) {
          console.error("Error creating carousels:", carouselError);
          toastError("Failed to create carousels, but videos were saved successfully.");
        }
      }
      
      // Navigate to carousel page
      navigate('/dashboard/request-carousel');
    } catch (error) {
      console.error('Error saving videos:', error);
      toastError('Failed to save videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImageFromContent = async () => {
    if (!linkedinContent && !youtubeChannelResult?.videos.length) {
      toastError('No content available to generate an image');
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      const prompt = youtubeChannelResult?.videos.length ? youtubeChannelResult.videos[0].title : linkedinContent.substring(0, 200);
      
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/cloudinary/generate`
        : `${baseUrl}/api/cloudinary/generate`;
      
      const response = await axios.post(apiUrl, {
        prompt: `Create a professional, high-quality image based on this content: ${prompt}`,
        size: '1024x1024',
        style: 'vivid'
      });
      
      if (response.data && response.data.success) {
        const imageData = response.data.data;
        setGeneratedContentImage(imageData.secure_url);
        
        saveImageToGallery({
          id: imageData.public_id,
          url: imageData.url,
          secure_url: imageData.secure_url,
          public_id: imageData.public_id,
          title: 'Generated from YouTube: ' + (youtubeChannelResult?.videos[0]?.title || 'content'),
          tags: ['ai-generated', 'youtube', 'linkedin'],
          uploadedAt: new Date().toISOString(),
          type: 'ai-generated',
          width: imageData.width,
          height: imageData.height
        });
        
        toastSuccess('Image generated successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toastError('Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGetTranscript = async (videoId: string) => {
    const maxRetries = 2; // Maximum number of retries
    let currentRetryCount = 0;
    let lastError: any = null;

    // Helper function to delay execution
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      setLoadingTranscriptIds(prev => {
        const newSet = new Set(prev);
        newSet.add(videoId);
        return newSet;
      });
      
      setCurrentVideoId(videoId);
      setRetryCount(prev => ({ ...prev, [videoId]: 0 }));
      
      // Try both methods in parallel
      let ytdlpPromise: Promise<any> | null = null;
      let ytTranscriptPromise: Promise<any> | null = null;
      let transcriptData: any = null;
      let failedMethods = 0;
      
      // Start both API calls
      toast({
        description: "Fetching transcript using multiple methods...",
        variant: "default",
      });
            
      // Start primary method (youtube-transcript-api)
      ytTranscriptPromise = fetch(`${import.meta.env.VITE_API_URL}/youtube/transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, useScraperApi: false })
      }).then(res => {
        if (!res.ok) throw new Error(`Primary method failed: ${res.status}`);
        return res.json();
      });
      
      // Start fallback method (yt-dlp)
      ytdlpPromise = fetch(`${import.meta.env.VITE_API_URL}/youtube/transcript-yt-dlp`, {
            method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId })
      }).then(res => {
        if (!res.ok) throw new Error(`Fallback method failed: ${res.status}`);
        return res.json();
      });
      
      // Use Promise.race with promises that handle their own rejection
      const safePromises = [
        ytTranscriptPromise.then(
          data => {
            console.log("Primary method succeeded");
            toastSuccess("Transcript fetched successfully (primary method)");
            return data;
          },
          (err) => {
            console.error("Primary method failed:", err);
            return new Promise((_, reject) => setTimeout(() => reject(new Error(`Primary method failed: ${err.message}`)), 100))
          }
        ),
        ytdlpPromise.then(
          data => {
            console.log("Fallback method succeeded");
            toastSuccess("Transcript fetched successfully (fallback method)");
            return data;
          },
          (err) => {
            console.error("Fallback method failed:", err);
            return new Promise((_, reject) => setTimeout(() => reject(new Error(`Fallback method failed: ${err.message}`)), 100))
          }
        )
      ];
      
      try {
      transcriptData = await Promise.race(safePromises);
      } catch (raceError) {
        console.error("Both transcript methods failed:", raceError);
        
        // Try them sequentially as a last resort, with the most reliable first
        try {
          console.log("Trying yt-dlp method sequentially");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/youtube/transcript-yt-dlp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId })
          });
          
          if (response.ok) {
            transcriptData = await response.json();
            console.log("Sequential yt-dlp method succeeded");
          } else {
            throw new Error(`Sequential yt-dlp method failed: ${response.status}`);
          }
        } catch (sequential1Error) {
          console.error("Sequential yt-dlp method failed:", sequential1Error);
          
          // Try the primary method as a last resort
          try {
            console.log("Trying primary method sequentially");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/youtube/transcript`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ videoId, useScraperApi: false })
            });
            
            if (response.ok) {
              transcriptData = await response.json();
              console.log("Sequential primary method succeeded");
            } else {
              throw new Error(`Sequential primary method failed: ${response.status}`);
            }
          } catch (sequential2Error) {
            console.error("All transcript methods failed");
            throw new Error("All transcript methods failed");
          }
        }
      }
      
      // Successfully got transcript data, now save and process it
      if (transcriptData && (transcriptData.transcript || transcriptData.success)) {
        // Find the video in youtubeChannelResult
        const foundVideo = youtubeChannelResult?.videos.find(v => v.id === videoId);
        
        if (!foundVideo) {
          toastError("Could not find video data to save transcript");
          return;
        }
        
        // Extract transcript from response data
        const transcript = transcriptData.transcript || '';
        const language = transcriptData.language || 'en';
        const is_generated = transcriptData.is_generated || false;
        
        if (!transcript || transcript.length < 20) {
          toastError("Retrieved transcript is too short or empty. Try a different video.");
          return;
        }
        
        try {
          // Call the save function with the transcript data - use transcript as formattedTranscript too
          await handleSaveVideoWithTranscript(
            foundVideo, 
            transcript,
            language,
            is_generated,
            [transcript] // Use raw transcript instead of formatted bullet points
          );
          
          toastSuccess("Transcript saved successfully!");
        } catch (saveError) {
          console.error("Error saving transcript:", saveError);
          toastError("Transcript fetched but could not be saved. Try again.");
        }
      } else {
        toastError("Received invalid transcript data or the video has no transcript");
      }
    } catch (error: any) {
      console.error("Error fetching transcript:", error);
      
      // Provide better error messages based on error type
      let errorMsg = error instanceof Error ? error.message : "Failed to fetch transcript";
      
      if (error.code === 'ERR_NETWORK') {
        errorMsg = "Network error: Check your connection and make sure the API server is running.";
      } else if (error.response?.status === 500) {
        errorMsg = "Server error: The transcript service is experiencing technical issues.";
      } else if (error.response?.status === 404) {
        errorMsg = "No transcript found: This video might not have captions available.";
      }
      
      toastError(errorMsg);
    } finally {
      setLoadingTranscriptIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
      // Reset retry count
      setRetryCount(prev => ({ ...prev, [videoId]: 0 }));
      setCurrentVideoId("");
    }
  };

  // Update: modified to preserve the raw transcript
  const handleSaveVideoWithTranscript = async (
    video: YouTubeVideo, 
    transcript: string, 
    language: string,
    is_generated: boolean,
    formattedTranscript: string[] | null = null
  ) => {
    try {
      // Get the formatted transcript or use the raw transcript
      const bulletPoints = formattedTranscript || [transcript];
      
      // Current timestamp for consistent sorting
      const savedTimestamp = new Date().toISOString();
      
      // Create a new enhanced video object with the transcript
      const enhancedVideo = {
        ...video,
        transcript: transcript, // Store the full transcript
        formattedTranscript: bulletPoints, // Store as array with raw transcript
        language: language,
        is_generated: is_generated,
        savedAt: savedTimestamp,
        status: 'ready',
        videoId: video.id, // Ensure videoId is correctly set
        savedTimestamp: savedTimestamp, // Add explicit timestamp for sorting
        userId: user?.id || 'anonymous'
      };
      
      // Save to localStorage first to ensure we don't lose data even if backend fails
      try {
        // Get existing videos from localStorage
      const existingVideosJSON = localStorage.getItem("savedYoutubeVideos");
      let existingVideos = existingVideosJSON ? JSON.parse(existingVideosJSON) : [];
      
      // Check if the video already exists
      const existingIndex = existingVideos.findIndex((v: any) => v.id === enhancedVideo.id);
      
      if (existingIndex >= 0) {
        // Update the existing video
        existingVideos[existingIndex] = enhancedVideo;
      } else {
        // Add the new video
        existingVideos.push(enhancedVideo);
      }
      
      // Save back to localStorage
      localStorage.setItem("savedYoutubeVideos", JSON.stringify(existingVideos));
        console.log("Saved transcript to localStorage successfully");
        
        // Update videosWithTranscripts state
        setVideosWithTranscripts(prev => {
          const newSet = new Set(prev);
          newSet.add(video.id);
          return newSet;
        });
      } catch (localStorageError) {
        console.error("Error saving to localStorage:", localStorageError);
        toastError("Error saving locally: " + (localStorageError.message || "Unknown error"));
        // Continue with backend save attempt even if localStorage fails
      }
      
      // Now try to save to backend
      let backendSaveSuccess = false;
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/youtube/save-video-transcript`
          : `${baseUrl}/api/youtube/save-video-transcript`;
        
        const backendResponse = await axios.post(apiUrl, {
          video: enhancedVideo,
          userId: user?.id || 'anonymous'
        }, { timeout: 10000 }); // Add timeout to prevent hanging requests
        
        if (backendResponse.data.success) {
          backendSaveSuccess = true;
          toastSuccess("Video saved to cloud with transcript!");
          
          // Try creating carousel entry if backend save was successful
          try {
          const carouselApiUrl = baseUrl.endsWith('/api')
            ? `${baseUrl}/youtube-carousels`
            : `${baseUrl}/api/youtube-carousels`;
          
            axios.post(carouselApiUrl, {
            videos: [enhancedVideo],
            userId: user?.id || 'anonymous'
            }, { timeout: 10000 }) // Non-blocking and with timeout
              .then(response => {
                if (response.data.success) {
                  console.log("Created carousel for the video");
          }
              })
              .catch(error => {
                console.error("Error creating carousel:", error);
              });
        } catch (carouselError) {
            console.error("Error setting up carousel creation:", carouselError);
            // Don't show error to user since the video was already saved
          }
        } else {
          console.warn("Backend save warning:", backendResponse.data.message);
          // Don't show error toast since localStorage save succeeded
        }
      } catch (backendError: any) {
        // More detailed error logging
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
        
        console.error("Error saving to backend:", errorDetail);
        // Don't show error toast since localStorage save succeeded
        // and we don't want to confuse the user if backend is unavailable
      }
      
      // Navigate to request-carousel page regardless of backend success
      // as the video is already saved in localStorage
      navigate('/dashboard/request-carousel');
      
      return true;
    } catch (error: any) {
      console.error("Fatal error in handleSaveVideoWithTranscript:", error);
      toastError("Failed to save the video with transcript: " + (error.message || "Unknown error"));
      return false;
    }
  };

  // Add a helper function to maintain the raw transcript
  const formatTranscriptToBulletPoints = (text: string): string[] => {
    if (!text || text.length < 10) {
      return ["No transcript content available"];
    }
    
    // Just return the raw transcript as a single item in the array
    return [text];
  };

  // Update the button text in the video card to show retry status or transcript availability
  const getTranscriptButtonText = (videoId: string) => {
    if (loadingTranscriptIds.has(videoId)) {
      const retry = retryCount[videoId] || 0;
      if (retry > 0) {
        return `Retry ${retry}...`;
      }
      return "Loading...";
    }
    
    // Check if this video has a transcript
    if (videosWithTranscripts.has(videoId)) {
      return "Transcript Available";
    }
    
    // Default case - no transcript yet
    return "Get Transcript";
  };

  useEffect(() => {
    setInputUrl('');
    setResult(null);
    setTwitterResult(null);
    setSelectedTweets(new Set());
    setYoutubeChannelResult(null);
    setSelectedVideos(new Set());
  }, [activeTab]);

  // Load YouTube channel results on component mount
  useEffect(() => {
    if (activeTab === 'youtube') {
      loadYoutubeChannelFromStorage();
    }
  }, [activeTab]);

  // Clear YouTube channel results when switching tabs
  useEffect(() => {
    if (activeTab !== 'youtube' && lastSearchedChannel) {
      // Don't reset the youtubeChannelResult to keep it in state
      // Just update the UI state for other tabs
      setResult(null);
      setTwitterResult(null);
      setLinkedinContent('');
      
      // Keep input URL if returning to YouTube tab with same channel
      if (lastSearchedChannel && inputUrl === '') {
        setInputUrl(lastSearchedChannel);
      }
    }
  }, [activeTab, lastSearchedChannel]);

  // Clean up selected videos when the channel result changes
  useEffect(() => {
    if (youtubeChannelResult) {
      // Validate that selected videos exist in the current result
      const validVideoIds = new Set(youtubeChannelResult.videos.map(v => v.id));
      setSelectedVideos(prev => {
        const newSelectedVideos = new Set<string>();
        prev.forEach(id => {
          if (validVideoIds.has(id)) {
            newSelectedVideos.add(id);
          }
        });
        return newSelectedVideos;
      });
    }
  }, [youtubeChannelResult]);

  // Restore transcript state from localStorage if available
  useEffect(() => {
    try {
      // Load saved YouTube channel results from localStorage
      const savedChannel = localStorage.getItem('youtubeChannelResult');
      if (savedChannel) {
        setYoutubeChannelResult(JSON.parse(savedChannel));
      }
      
      // Remove the code that attempted to load and use youtubeTranscript
      // This section was trying to use async/await in a non-async function
      // and was referencing properties on a string incorrectly
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Add an event listener for beforeunload to save state
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Make sure all important state is saved to localStorage before page unload
      if (youtubeChannelResult) {
        saveYoutubeChannelToStorage(youtubeChannelResult);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [youtubeChannelResult]);

  // Fix missing handleToggleVideoSelection function (referenced in UI components)
  const handleToggleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  // Check for videos with transcripts when component mounts or localStorage changes
  useEffect(() => {
    try {
      const savedVideosJSON = localStorage.getItem("savedYoutubeVideos");
      if (savedVideosJSON) {
        const savedVideos = JSON.parse(savedVideosJSON);
        
        // Collect video IDs that have transcripts
        const videoIdsWithTranscripts = new Set<string>();
        
        savedVideos.forEach((video: any) => {
          if (video.transcript && 
              typeof video.transcript === 'string' && 
              video.transcript.trim().length > 0) {
            videoIdsWithTranscripts.add(video.id);
          }
        });
        
        // Update state with videos that have transcripts
        setVideosWithTranscripts(videoIdsWithTranscripts);
      }
    } catch (error) {
      console.error("Error checking for videos with transcripts:", error);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Scraper</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Extract content from various platforms to repurpose for LinkedIn
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Input Source</CardTitle>
          <CardDescription>
            Enter a URL from your chosen platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="linkedin"
            value={activeTab}
            onValueChange={value => {
              setActiveTab(value);
              
              // Don't clear YouTube channel results when switching tabs
              if (value !== 'youtube') {
              setResult(null);
              setTwitterResult(null);
              setLinkedinContent('');
              }
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </TabsTrigger>
              <TabsTrigger value="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <span className="hidden sm:inline">Twitter</span>
              </TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                <span className="hidden sm:inline">YouTube</span>
              </TabsTrigger>
              <TabsTrigger value="web" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Web</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={
                    activeTab === 'linkedin' ? 'Enter LinkedIn post or article URL' :
                    activeTab === 'twitter' ? 'Enter Twitter username or URL' :
                    activeTab === 'youtube' ? 'Enter YouTube video URL or @channel' :
                    'Enter website URL'
                  }
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleScrape}
                disabled={isLoading || !inputUrl}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {activeTab === 'twitter' ? 'Fetch Tweets' : 
                     activeTab === 'youtube' ? 'Get Content' : 'Scrape Content'}
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Twitter Results Section */}
      {activeTab === 'twitter' && twitterResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {twitterResult.profileImageUrl && (
                <img 
                  src={twitterResult.profileImageUrl} 
                  alt={twitterResult.username}
                  className="w-10 h-10 rounded-full" 
                />
              )}
              <div>
                <h3 className="font-semibold">@{twitterResult.username}</h3>
                <p className="text-sm text-gray-500">
                  {twitterResult.tweets.length} tweets scraped
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTweets(new Set(twitterResult.tweets.map(t => t.id)))}
                disabled={isLoading}
              >
                Select All
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => setSelectedTweets(new Set())}
                disabled={isLoading || selectedTweets.size === 0}
              >
                Clear Selection
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveSelectedTweets}
                disabled={isLoading || selectedTweets.size === 0}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" />
                    Save Selected ({selectedTweets.size})
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {twitterResult.tweets.map(tweet => (
              <Card key={tweet.id} className={`overflow-hidden ${selectedTweets.has(tweet.id) ? 'border-primary' : ''}`}>
                <CardHeader className="p-4 pb-2 flex flex-row justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <img 
                        src={tweet.author.profile_image_url} 
                        alt={tweet.author.name}
                        className="w-8 h-8 rounded-full" 
                      />
                      <div>
                        <CardTitle className="text-base">{tweet.author.name}</CardTitle>
                        <CardDescription className="text-xs">@{tweet.author.username}</CardDescription>
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {new Date(tweet.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div>
                    <Button
                      variant={selectedTweets.has(tweet.id) ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => handleToggleTweetSelection(tweet.id)}
                      className="h-8 w-8 p-0"
                    >
                      {selectedTweets.has(tweet.id) ? (
                        <div className="h-5 w-5 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                          ✓
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-sm border border-input"></div>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="whitespace-pre-line text-sm">
                    {tweet.full_text || tweet.text}
                  </p>
                  
                  {tweet.media && tweet.media.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {tweet.media.map((media, index) => (
                        media.type === 'photo' && (
                          <div key={media.media_key || index} className="rounded overflow-hidden">
                            <img 
                              src={media.url} 
                              alt={media.alt_text || 'Tweet media'} 
                              className="w-full h-auto"
                            />
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-3 border-t flex justify-between bg-gray-50">
                  <div className="flex items-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {tweet.public_metrics.reply_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      {tweet.public_metrics.retweet_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {tweet.public_metrics.like_count}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(tweet.full_text || tweet.text)}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* YouTube Channel Results */}
      {activeTab === 'youtube' && youtubeChannelResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Youtube className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">{youtubeChannelResult.channelName}</h3>
                <p className="text-sm text-gray-500">
                  {youtubeChannelResult.videos.length} videos found
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVideos(new Set(youtubeChannelResult.videos.map(v => v.id)))}
                disabled={isLoading}
              >
                Select All
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => setSelectedVideos(new Set())}
                disabled={isLoading || selectedVideos.size === 0}
              >
                Clear Selection
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveSelectedVideos}
                disabled={isLoading || selectedVideos.size === 0}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" />
                    Save ({selectedVideos.size})
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeChannelResult.videos.map(video => (
              <Card 
                key={video.id} 
                className={`overflow-hidden ${selectedVideos.has(video.id) ? 'border-primary' : ''}`}
              >
                <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
                    {video.duration !== "N/A" ? video.duration : "N/A"}
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm line-clamp-2">{video.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{video.view_count.toLocaleString()} views</span>
                    <span>{new Date(video.upload_date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {video.channelName || "Unknown Channel"}
                  </div>
                </CardContent>
                
                <CardFooter className="p-3 pt-0 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(video.url, '_blank')}
                      className="w-full"
                    >
                      <Youtube className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                    <Button
                      variant={selectedVideos.has(video.id) ? "secondary" : "outline"}
                      size="sm" 
                      onClick={() => handleToggleVideoSelection(video.id)}
                      className="w-full"
                    >
                      {selectedVideos.has(video.id) ? "Selected" : "Select"}
                    </Button>
                  </div>
                  <Button
                    variant={videosWithTranscripts.has(video.id) ? "secondary" : "default"} 
                    size="sm" 
                    className={`w-full ${loadingTranscriptIds.has(video.id) ? "opacity-70" : ""}`}
                    onClick={() => handleGetTranscript(video.id)}
                    disabled={loadingTranscriptIds.has(video.id)}
                  >
                    {getTranscriptButtonText(video.id)}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Results section - Original content for LinkedIn/Website/YouTube */}
      {activeTab !== 'twitter' && activeTab !== 'youtube' && result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Extracted content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Extracted Content</CardTitle>
                <CardDescription>
                  Content extracted from {activeTab === 'linkedin' 
                    ? 'LinkedIn' 
                    : activeTab === 'website' 
                      ? 'website' 
                      : 'YouTube video'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4 bg-white dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {result.content}
                  </p>
                </div>
                
                <Accordion type="single" collapsible className="mb-4">
                  <AccordionItem value="key-points">
                    <AccordionTrigger className="text-base font-medium">
                      Key Points
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {result.keyPoints.map((point, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Detected Tone
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {result.tone}
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Details
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span>Word count:</span>
                        <span>{result.wordCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Read time:</span>
                        <span>{result.estimatedReadTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => handleCopy(result.content)}
                >
                  <Copy className="h-4 w-4" />
                  Copy Content
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleSaveToInspiration}
                >
                  <Save className="h-4 w-4" />
                  Save to Vault
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column - AI suggestions */}
          <div>
            {/* Suggested Hook */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Suggested Hook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  {result.suggestedHook}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-1"
                  onClick={() => handleCopy(result.suggestedHook)}
                >
                  <Copy className="h-4 w-4" />
                  Copy Hook
                </Button>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Card className="bg-primary-50 dark:bg-primary-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Generate LinkedIn Post
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Use the extracted content to create an engaging LinkedIn post with AI assistance.
                </p>
                
                <Button 
                  className="w-full gap-2 mb-3"
                  onClick={handleCreatePost}
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Post
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigate('/dashboard/ai')}
                >
                  <MessageSquare className="h-4 w-4" />
                  Expand with AI Writer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Instructions when no result */}
      {!result && !isLoading && !youtubeChannelResult && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center max-w-xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
                {activeTab === 'linkedin' ? (
                  <Linkedin className="h-8 w-8 text-primary" />
                ) : activeTab === 'website' ? (
                  <Globe className="h-8 w-8 text-primary" />
                ) : activeTab === 'twitter' ? (
                  <Twitter className="h-8 w-8 text-primary" />
                ) : (
                  <Youtube className="h-8 w-8 text-primary" />
                )}
              </div>
              
              <h3 className="text-lg font-medium mb-2">
                {activeTab === 'linkedin' 
                  ? 'Extract Content from LinkedIn' 
                  : activeTab === 'website'
                    ? 'Extract Content from Websites'
                    : activeTab === 'twitter'
                      ? 'Extract Content from Twitter'
                    : 'Extract Content from YouTube Videos'
                }
              </h3>
              
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {activeTab === 'linkedin' 
                  ? 'Paste a LinkedIn profile URL or post link to extract professional insights, experience, and content for your posts.' 
                  : activeTab === 'website'
                    ? 'Paste any article or blog URL to extract key points, analyze tone, and suggest hooks for your LinkedIn content.'
                    : activeTab === 'twitter'
                      ? 'Paste a Twitter username or profile URL to extract tweets and insights for your LinkedIn content.'
                    : 'Paste a YouTube video URL or channel name to extract content for your LinkedIn posts.'
                }
              </p>
              
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                    1
                  </div>
                  <span>Enter the URL in the input field above</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                    2
                  </div>
                  <span>Click "Scrape" to extract content</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                    3
                  </div>
                  <span>Review and use the extracted content for your LinkedIn posts</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Generated Image Section */}
      {linkedinContent && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Generated Image</h4>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleGenerateImageFromContent}
              disabled={isGeneratingImage}
              className="gap-2"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
          
          {generatedContentImage && (
            <div className="mt-4">
              <div className="relative rounded-md overflow-hidden">
                <img 
                  src={generatedContentImage} 
                  alt="Generated image"
                  className="w-full max-h-[250px] object-cover"
                />
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard/images')}
                  className="gap-2"
                >
                  <Folder className="h-4 w-4" />
                  View in Gallery
                </Button>
                <Button
                  onClick={() => navigate('/dashboard/post', { 
                    state: { 
                      content: linkedinContent, 
                      image: generatedContentImage 
                    } 
                  })}
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Create Post with Image
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScraperPage;