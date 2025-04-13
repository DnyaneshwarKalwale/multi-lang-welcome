import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Youtube, Copy, PlusCircle, MessageSquare } from 'lucide-react';
import axios from 'axios';

interface YouTubeTranscriptFetcherProps {
  onContentGenerated?: (content: {
    content: string;
    hashtags: string[];
    sourceType: string;
    videoId?: string;
    title?: string;
  }) => void;
}

const YouTubeTranscriptFetcher: React.FC<YouTubeTranscriptFetcherProps> = ({ onContentGenerated }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [contentFormat, setContentFormat] = useState<string>('post');
  const [tone, setTone] = useState<string>('professional');
  
  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const handleFetchTranscript = async () => {
    if (!videoUrl) {
      toast.error('Please enter a YouTube video URL');
      return;
    }
    
    setIsLoading(true);
    setTranscript(null);
    setTitle(null);
    setVideoId(null);
    setGeneratedContent(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/youtube/transcript`,
        { videoUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        setTranscript(response.data.data.transcript);
        setTitle(response.data.data.title);
        setVideoId(response.data.data.videoId);
        toast.success('Transcript fetched successfully!');
      } else {
        throw new Error(response.data?.error || 'Failed to fetch transcript');
      }
    } catch (error: any) {
      console.error('Error fetching transcript:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch YouTube transcript. Please try a different video.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConvertToLinkedIn = async () => {
    if (!transcript) {
      toast.error('Please fetch a transcript first');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/youtube/to-linkedin`,
        {
          transcript,
          title,
          format: contentFormat,
          tone
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        setGeneratedContent(response.data.data.content);
        setHashtags(response.data.data.hashtags || []);
        
        if (onContentGenerated) {
          onContentGenerated({
            content: response.data.data.content,
            hashtags: response.data.data.hashtags || [],
            sourceType: 'youtube',
            videoId: videoId || undefined,
            title: title || undefined
          });
        }
        
        toast.success('Converted to LinkedIn content!');
      } else {
        throw new Error(response.data?.message || 'Failed to convert to LinkedIn content');
      }
    } catch (error) {
      console.error('Error converting to LinkedIn:', error);
      toast.error('Failed to convert to LinkedIn content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            YouTube Transcript Fetcher
          </CardTitle>
          <CardDescription>
            Enter a YouTube URL to fetch its transcript and convert to LinkedIn content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="YouTube video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleFetchTranscript} 
              disabled={isLoading || !videoUrl.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch'}
            </Button>
          </div>
          
          {transcript && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Video Title</h3>
                <p className="text-sm border border-gray-200 dark:border-gray-800 rounded-md p-2 bg-gray-50 dark:bg-gray-900">
                  {title || 'Unknown Title'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Transcript (Preview)</h3>
                <div className="border border-gray-200 dark:border-gray-800 rounded-md p-2 max-h-[200px] overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm whitespace-pre-line">
                    {transcript.length > 500 
                      ? transcript.substring(0, 500) + '...' 
                      : transcript}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Content Format</label>
                  <Select value={contentFormat} onValueChange={setContentFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">LinkedIn Post</SelectItem>
                      <SelectItem value="carousel">LinkedIn Carousel</SelectItem>
                      <SelectItem value="article">Article Outline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleConvertToLinkedIn} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Converting...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Convert to LinkedIn Content
                  </>
                )}
              </Button>
            </div>
          )}
          
          {generatedContent && (
            <div className="space-y-4 mt-4">
              <h3 className="text-sm font-medium">Generated LinkedIn Content</h3>
              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-3 bg-gray-50 dark:bg-gray-900">
                <p className="text-sm whitespace-pre-line">
                  {generatedContent}
                </p>
              </div>
              
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <div 
                      key={index}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCopy(generatedContent)}
                  className="gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                
                <Button 
                  size="sm"
                  className="gap-1 ml-auto"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Post
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeTranscriptFetcher; 