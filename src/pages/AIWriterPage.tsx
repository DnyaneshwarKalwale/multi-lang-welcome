import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Send, Copy, PlusCircle, 
  Sparkles, RefreshCw, Lightbulb, TextQuote,
  ListOrdered, Loader2, Settings, Download,
  Image, UploadCloud, X, Check, Trash, CameraIcon,
  ArrowRight
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
type ContentFormat = 'short' | 'long' | 'listicle' | 'hook';

// Response interface
interface AIResponse {
  content: string;
  suggestedHashtags: string[];
}

// Image interface
interface GeneratedImage {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  original_prompt?: string;
  revised_prompt?: string;
}

const AIWriterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [contentFormat, setContentFormat] = useState<ContentFormat>('short');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [tone, setTone] = useState('professional');
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [suggestedImages, setSuggestedImages] = useState<GeneratedImage[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Example AI responses for demonstration
  const exampleResponses: Record<ContentFormat, AIResponse> = {
    short: {
      content: "Our recent study of 500 marketing professionals revealed that companies using AI-assisted content generation saw a 37% increase in engagement and a 22% reduction in content production time. The key is finding the right balance between AI efficiency and human creativity. Are you leveraging AI in your content strategy yet?",
      suggestedHashtags: ["#AIContentCreation", "#MarketingStrategy", "#ContentEfficiency", "#LinkedInTips"]
    },
    long: {
      content: "In today's digital landscape, content creation has become a cornerstone of successful marketing strategies. However, many businesses struggle with consistency and quality.\n\nOur recent study of 500 marketing professionals revealed some fascinating insights:\n\n- Companies using AI-assisted content generation saw a 37% increase in engagement\n- Content production time was reduced by 22% on average\n- Teams reported higher satisfaction with their output quality\n\nThe key findings suggest that human-AI collaboration produces the best results, with AI handling research and initial drafts while humans refine messaging and add authentic perspectives. This approach not only improves efficiency but also enhances content relevance across different platforms.\n\nWe discovered that the most successful companies aren't simply replacing human writers with AI, but instead creating workflows where each contributes their strengths.\n\nHave you experimented with AI in your content creation process? I'd love to hear about your experience in the comments below.",
      suggestedHashtags: ["#AIContentCreation", "#MarketingInsights", "#ContentStrategy", "#DigitalMarketing", "#AICollaboration"]
    },
    listicle: {
      content: "5 Ways AI Is Transforming Content Creation According to Our New Research\n\n1️⃣ Higher Engagement: Companies using AI-assisted content saw a 37% increase in audience engagement metrics\n\n2️⃣ Time Efficiency: Content production time reduced by 22% when using collaborative AI tools\n\n3️⃣ Consistency Improvement: AI helps maintain brand voice across multiple channels and content types\n\n4️⃣ Research Enhancement: AI can analyze trends and competitor content to identify optimal topics\n\n5️⃣ Personalization at Scale: AI enables creating tailored content variations for different audience segments\n\nThe key isn't replacing human creativity, but enhancing it through strategic AI collaboration. Which of these benefits would most impact your content strategy?",
      suggestedHashtags: ["#AIContent", "#ContentMarketing", "#MarketingTips", "#LinkedInStrategy", "#DigitalTransformation"]
    },
    hook: {
      content: "Our recent study of 500 marketing professionals revealed a surprising insight about AI-assisted content creation that could transform your engagement metrics...",
      suggestedHashtags: ["#ContentMarketing", "#AIInsights"]
    }
  };

  // Fetch suggested images on component mount
  useEffect(() => {
    fetchSuggestedImages();
  }, []);

  const fetchSuggestedImages = async () => {
    setIsLoadingSuggestions(true);
    try {
      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        return;
      }
      
      const apiUrl = `https://backend-scripe.onrender.com/api/cloudinary/suggestions`;
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        setSuggestedImages(response.data.data.slice(0, 6)); // Limit to 6 suggestions
      }
    } catch (error) {
      console.error('Error fetching suggested images:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Generate content based on prompt
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt or topic');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You need to be logged in to use this feature');
        setIsGenerating(false);
        return;
      }
      
      // Make API call to backend for AI content generation
      const apiUrl = `https://backend-scripe.onrender.com/api/ai/generate`;
      const response = await axios.post(apiUrl, {
        prompt: prompt,
        format: contentFormat,
        tone: tone
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        // Check if we're using fallback content
        if (response.data.usingFallback) {
          console.log('Using fallback content:', response.data.data);
          toast.success('Content generated with example data');
        } else {
          toast.success('Content generated successfully!');
        }
        
        setResponse(response.data.data);
      } else {
        // Fallback to example responses if API fails
        setResponse(exampleResponses[contentFormat]);
        toast.success('Content generated with fallback data');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Using example data instead.');
      
      // Fallback to example responses if API fails
      setResponse(exampleResponses[contentFormat]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate image based on prompt
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter an image description');
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You need to be logged in to use this feature');
        setIsGeneratingImage(false);
        return;
      }
      
      const apiUrl = `https://backend-scripe.onrender.com/api/cloudinary/generate`;
      const response = await axios.post(apiUrl, {
        prompt: imagePrompt,
        size: '1024x1024',
        style: 'vivid'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        setGeneratedImage(response.data.data);
        toast.success('Image generated successfully!');
        // Refresh suggested images to include the new one
        fetchSuggestedImages();
      } else {
        throw new Error(response.data?.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setUploadedImage(URL.createObjectURL(file));
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  // Upload selected file
  const handleUploadFile = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You need to be logged in to use this feature');
        setIsUploading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const apiUrl = `https://backend-scripe.onrender.com/api/cloudinary/upload`;
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.success) {
        const uploadedImage = response.data.data;
        setGeneratedImage({
          url: uploadedImage.url,
          secure_url: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
          format: uploadedImage.format,
          width: uploadedImage.width || 1024,
          height: uploadedImage.height || 1024
        });
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Select a suggested image
  const handleSelectSuggestedImage = (image: GeneratedImage) => {
    setGeneratedImage(image);
    toast.success('Suggested image selected!');
  };

  // Clear selected image
  const handleClearSelectedImage = () => {
    setSelectedFile(null);
    setUploadedImage(null);
  };

  // Copy content to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Create post from generated content
  const handleCreatePost = () => {
    // In a real app, you would store the generated content and redirect
    if (response) {
      navigate('/dashboard/post', { 
        state: { 
          content: response.content,
          hashtags: response.suggestedHashtags,
          image: generatedImage ? generatedImage.secure_url : null
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
          Generate professional LinkedIn content and images
        </p>
      </div>
      
      <Tabs defaultValue="text" value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'image')}>
        <TabsList className="grid grid-cols-2 w-80 mb-6">
          <TabsTrigger value="text">Text Content</TabsTrigger>
          <TabsTrigger value="image">Image Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-4">
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
                      <TabsList className="grid grid-cols-4 w-full">
                        <TabsTrigger value="short" className="text-xs">Short</TabsTrigger>
                        <TabsTrigger value="long" className="text-xs">Long</TabsTrigger>
                        <TabsTrigger value="listicle" className="text-xs">Listicle</TabsTrigger>
                        <TabsTrigger value="hook" className="text-xs">Hook Only</TabsTrigger>
                      </TabsList>
                    </Tabs>
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
                          <div className="font-medium mb-1">Hook Only</div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Attention-grabbing opening line to start your post (50-150 characters)
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            
            {/* Right column - Output */}
            <div className="lg:col-span-2">
              {response ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Generated Content</CardTitle>
                      <CardDescription>
                        {contentFormat === 'short' 
                          ? 'Short-form LinkedIn post' 
                          : contentFormat === 'long'
                            ? 'Long-form LinkedIn post'
                            : contentFormat === 'listicle'
                              ? 'Listicle format post'
                              : 'Attention-grabbing hook'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={handleRefresh}>
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Regenerate content</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => handleCopy(response.content)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 bg-white dark:bg-gray-900 min-h-[300px] mb-4">
                      <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                        {response.content}
                      </div>
                    </div>
                    
                    {response.suggestedHashtags.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-2">Suggested Hashtags</div>
                        <div className="flex flex-wrap gap-2">
                          {response.suggestedHashtags.map((tag, index) => (
                            <span 
                              key={index}
                              className="bg-primary-50 dark:bg-primary-900/20 text-primary px-2 py-1 rounded-md text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-center mt-6">
                      <Button onClick={handleCreatePost} className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Create Post with This Content
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      <span>Edit or refine the content before publishing</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleCopy(response.content)}
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="min-h-[500px] flex flex-col items-center justify-center text-center p-8">
                  <div className="max-w-md">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20">
                      <MessageSquare className="h-8 w-8 text-primary" />
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2">
                      AI-Powered LinkedIn Content Generator
                    </h3>
                    
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                      Enter a topic or paste your raw notes on the left to generate professional LinkedIn content. Choose from different formats based on your needs.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <TextQuote className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Short & Long Form</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Generate concise posts or detailed articles
                        </p>
                      </div>
                      
                      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <ListOrdered className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Listicles</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Create engaging numbered list posts
                        </p>
                      </div>
                    </div>
                    
                    {isGenerating ? (
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 text-primary mx-auto animate-spin mb-3" />
                        <p className="text-sm text-gray-500">Generating your content...</p>
                      </div>
                    ) : (
                      <Button
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Generate Content
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Image Generation Input */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Image Generator</CardTitle>
                  <CardDescription>
                    Create professional images for your LinkedIn posts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Image Description</label>
                    <Textarea
                      placeholder="Describe the image you want to generate (e.g., 'Professional businessman giving a presentation on digital marketing trends')"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Be specific to get the best results
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="w-full gap-2"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <CameraIcon className="h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                  
                  <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                    {uploadedImage ? (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Selected file preview" 
                          className="max-w-full h-auto rounded-md mx-auto"
                        />
                        <button 
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          onClick={handleClearSelectedImage}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 mb-2">
                          Or upload your own image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          id="image-upload"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <label 
                          htmlFor="image-upload" 
                          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 text-sm"
                        >
                          Select File
                        </label>
                      </>
                    )}
                  </div>
                  
                  {selectedFile && !isUploading && (
                    <Button 
                      onClick={handleUploadFile}
                      className="w-full gap-2"
                    >
                      <UploadCloud className="h-4 w-4" />
                      Upload Image
                    </Button>
                  )}
                  
                  {isUploading && (
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Image Preview & Suggestions */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Generated Image</CardTitle>
                  <CardDescription>
                    Use this image in your LinkedIn posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedImage ? (
                    <div className="text-center">
                      <img 
                        src={generatedImage.secure_url} 
                        alt="Generated image" 
                        className="max-w-full h-auto rounded-md mx-auto"
                      />
                      {generatedImage.revised_prompt && (
                        <p className="text-xs text-gray-500 mt-2">
                          {generatedImage.revised_prompt}
                        </p>
                      )}
                      <div className="flex justify-center gap-4 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => window.open(generatedImage.secure_url, '_blank')}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          onClick={() => navigate('/dashboard/post', { 
                            state: { image: generatedImage.secure_url } 
                          })}
                          className="gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Create Post
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Image className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No image generated yet. Enter a description and click "Generate Image".
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Images</CardTitle>
                  <CardDescription>
                    Previously generated images you can use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSuggestions ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : suggestedImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {suggestedImages.map((image, index) => (
                        <div key={index} className="relative group cursor-pointer" onClick={() => handleSelectSuggestedImage(image)}>
                          <img 
                            src={image.secure_url} 
                            alt={`Suggestion ${index + 1}`} 
                            className="w-full h-auto rounded-md aspect-square object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Check className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        No suggested images available yet. Generate some images to see them here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => navigate('/dashboard/images')}>
                  View All Images in Gallery <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIWriterPage; 