import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Send, Copy, PlusCircle, 
  Sparkles, RefreshCw, Lightbulb, TextQuote,
  ListOrdered, Loader2, Settings, Download,
  Image as ImageIcon
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import axios from 'axios';

// Content format types
type ContentFormat = 'short' | 'long' | 'listicle' | 'hook' | 'carousel';

// Industry options type
type Industry = 'tech' | 'marketing' | 'finance' | 'healthcare' | 'education' | 'retail' | 'other';

// Audience options type
type Audience = 'professionals' | 'executives' | 'marketers' | 'developers' | 'general' | 'students';

// Response interface
interface AIResponse {
  content: string;
  suggestedHashtags: string[];
  slides?: {
    number: string;
    title: string;
    content: string;
  }[];
  imageUrl?: string;
}

const AIWriterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [contentFormat, setContentFormat] = useState<ContentFormat>('short');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [tone, setTone] = useState('professional');
  const [industry, setIndustry] = useState<Industry>('tech');
  const [audience, setAudience] = useState<Audience>('professionals');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Generate content based on prompt
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt or topic');
      return;
    }
    
    setIsGenerating(true);
    setResponse(null);
    
    try {
      const response = await axios.post(`${API_URL}/api/openai/generate-content`, {
        prompt,
        format: contentFormat,
        tone,
        industry,
        audience
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data && response.data.success) {
        if (contentFormat === 'carousel') {
          // For carousel format, generate a carousel post
          const carouselResponse = await axios.post(`${API_URL}/api/openai/generate-carousel`, {
            topic: prompt,
            slideCount: 5,
            industry,
            audience,
            tone
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (carouselResponse.data && carouselResponse.data.success) {
            setResponse({
              content: carouselResponse.data.data.rawContent,
              suggestedHashtags: response.data.data.hashtags || [],
              slides: carouselResponse.data.data.slides
            });
          }
        } else {
          // For other formats, use the regular response
          setResponse({
            content: response.data.data.content,
            suggestedHashtags: response.data.data.hashtags || []
          });
        }
        
        toast.success('Content generated successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate image for LinkedIn post
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter an image prompt');
      return;
    }
    
    setIsImageGenerating(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/openai/generate-image`, {
        prompt: imagePrompt,
        size: '1024x1024',
        style: 'vivid'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data && response.data.success) {
        setGeneratedImageUrl(response.data.data.cloudinary_url);
        toast.success('Image generated successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsImageGenerating(false);
    }
  };

  // Copy content to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Create post from generated content
  const handleCreatePost = () => {
    if (response) {
      navigate('/dashboard/post', { 
        state: { 
          content: response.content,
          hashtags: response.suggestedHashtags,
          slides: response.slides,
          imageUrl: generatedImageUrl
        } 
      });
    }
  };

  // Refresh generation with same prompt
  const handleRefresh = () => {
    handleGenerate();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">AI Writer</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Generate professional LinkedIn content in different formats
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Input */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>
                Describe what you want to write about
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Topic or Notes</label>
                <Textarea
                  placeholder="Enter a topic, idea, or copy & paste your raw notes here"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific to get the best results
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content Format</label>
                <Tabs 
                  defaultValue="short" 
                  value={contentFormat}
                  onValueChange={(value) => setContentFormat(value as ContentFormat)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="short" className="text-xs">Short</TabsTrigger>
                    <TabsTrigger value="long" className="text-xs">Long</TabsTrigger>
                    <TabsTrigger value="listicle" className="text-xs">Listicle</TabsTrigger>
                    <TabsTrigger value="carousel" className="text-xs">Carousel</TabsTrigger>
                    <TabsTrigger value="hook" className="text-xs">Hook Only</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <Select value={industry} onValueChange={(value) => setIndustry(value as Industry)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Target Audience</label>
                <Select value={audience} onValueChange={(value) => setAudience(value as Audience)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professionals">Professionals</SelectItem>
                    <SelectItem value="executives">Executives</SelectItem>
                    <SelectItem value="marketers">Marketers</SelectItem>
                    <SelectItem value="developers">Developers</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="general">General</SelectItem>
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
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="text-xs text-gray-500 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>AI-powered content</span>
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Format descriptions */}
          <div className="mt-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="format-info">
                <AccordionTrigger className="text-sm">
                  About Content Formats
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">Short-form</div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Concise 1-2 paragraph posts (150-300 characters) ideal for quick engagement
                      </p>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Long-form</div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Detailed 3-5 paragraph posts (500-1500 characters) for in-depth topics
                      </p>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Listicle</div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Numbered or bulleted list format for easy-to-scan content
                      </p>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Carousel</div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Slide-based content for LinkedIn carousel posts
                      </p>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Hook Only</div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Attention-grabbing first line to start your post
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        {/* Middle/Right columns - Output and Preview */}
        <div className="lg:col-span-2">
          {response ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Generated Content</CardTitle>
                    <CardDescription>
                      Ready to use on LinkedIn
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleCopy(response.content)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isGenerating}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Regenerate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-sm">
                    {response.content}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {response.suggestedHashtags.map((tag, index) => (
                      <div 
                        key={index}
                        className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </div>
                    ))}
                  </div>
                  
                  <Button onClick={handleCreatePost} className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create Post
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Image Generator */}
              <Card>
                <CardHeader>
                  <CardTitle>Generate Matching Image</CardTitle>
                  <CardDescription>
                    Create an image to accompany your LinkedIn post
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Describe the image you want to generate"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                    />
                    <Button
                      onClick={handleGenerateImage}
                      disabled={isImageGenerating || !imagePrompt.trim()}
                    >
                      {isImageGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {generatedImageUrl && (
                    <div className="mt-4">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated image"
                        className="w-full rounded-md shadow-md"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* If carousel format, show slides preview */}
              {contentFormat === 'carousel' && response.slides && response.slides.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Carousel Slides</CardTitle>
                    <CardDescription>
                      Preview your carousel slides
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {response.slides.map((slide, index) => (
                        <div 
                          key={index}
                          className="border border-gray-200 dark:border-gray-800 rounded-md p-4"
                        >
                          <div className="font-bold mb-2">Slide {slide.number}: {slide.title}</div>
                          <div className="text-sm whitespace-pre-line">{slide.content}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-medium mb-2">Ready to Generate</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
                  Fill in the details on the left and click "Generate" to create LinkedIn content using AI
                </p>
                <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Powered by OpenAI technology</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWriterPage; 