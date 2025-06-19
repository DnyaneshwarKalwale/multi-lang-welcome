import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Send, Copy, PlusCircle, 
  Sparkles, RefreshCw, Lightbulb, TextQuote,
  ListOrdered, Loader2, Settings, Download,
  Image, UploadCloud, X, Check, Trash, CameraIcon,
  ArrowRight, Edit3, FileText, PenTool, CheckCircle, Save,
  Zap, BarChart3, Users, FileText as FileTextIcon
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
import { saveImageToGallery } from '@/utils/cloudinaryDirectUpload';
import { uploadToCloudinaryDirect } from '@/utils/cloudinaryDirectUpload';
import { getGalleryImages } from '@/utils/cloudinaryDirectUpload';

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
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>('short');
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [generatedContent, setGeneratedContent] = useState<AIResponse | null>(null);
  
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
      // Get images from local storage instead of making an API call
      const allImages = getGalleryImages();
      
      // Filter to only get AI-generated images and limit to 6
      const aiGeneratedImages = allImages
        .filter(img => img.type === 'ai-generated')
        .slice(0, 6);
      
      setSuggestedImages(aiGeneratedImages);
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
      // Fix the API URL to avoid duplicate "/api/"
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/generate-content` 
        : `${baseUrl}/api/generate-content`;
        
      // Call the OpenAI API through our backend
      const response = await axios.post(apiUrl, {
        prompt: prompt,
        contentType: contentFormat,
        tone: tone
      });
      
      if (response.data) {
        setResponse({
          content: response.data.content,
          suggestedHashtags: response.data.suggestedHashtags || []
        });
        toast.success('Content generated successfully!');
      } else {
        throw new Error('Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Check if there's a specific error message from the API
      const errorMessage = error.response?.data?.message || 'Failed to generate content. Please try again.';
      toast.error(errorMessage);
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
      // Fix the API URL to avoid duplicate "/api/"
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/generate-image` 
        : `${baseUrl}/api/generate-image`;
      
      // Call the OpenAI API through our backend
      const response = await axios.post(apiUrl, {
        prompt: imagePrompt,
        size: '1024x1024',
        style: 'vivid'
      });
      
      if (response.data) {
        const imageData = response.data;
        
        setGeneratedImage({
          url: imageData.url,
          secure_url: imageData.secure_url,
          public_id: imageData.public_id,
          format: imageData.format,
          width: imageData.width,
          height: imageData.height,
          original_prompt: imagePrompt,
          revised_prompt: imageData.revised_prompt
        });
        
        // Save to gallery for future use
        saveImageToGallery({
          id: imageData.public_id,
          url: imageData.url,
          secure_url: imageData.secure_url,
          public_id: imageData.public_id,
          title: imagePrompt.substring(0, 50) + (imagePrompt.length > 50 ? '...' : ''),
          tags: ['ai-generated', 'linkedin'],
          uploadedAt: new Date().toISOString(),
          type: 'ai-generated',
          width: imageData.width,
          height: imageData.height
        });
        
        toast.success('Image generated successfully!');
        
        // Refresh suggested images to include the new one
        fetchSuggestedImages();
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      
      // Check if there's a specific error message from the API
      const errorMessage = error.response?.data?.message || 'Failed to generate image. Please try again.';
      toast.error(errorMessage);
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
      // Upload to Cloudinary directly
      const uploadResult = await uploadToCloudinaryDirect(selectedFile, {
        folder: 'linkedin_uploads',
        tags: ['uploaded', 'linkedin'],
        type: 'uploaded'
      });
      
      setGeneratedImage({
        url: uploadResult.url,
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: selectedFile.type.split('/')[1] || 'jpeg',
        width: uploadResult.width || 1024,
        height: uploadResult.height || 1024
      });
      
      toast.success('Image uploaded successfully!');
      
      // Clear selected file and preview
      handleClearSelectedImage();
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-black">AI Content Writer</h1>
          <p className="text-neutral-medium mt-1">Create engaging LinkedIn content with AI assistance</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content - Main AI Writer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                Choose Content Format
              </CardTitle>
              <CardDescription>
                Select the type of content you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: 'short' as ContentFormat, label: 'Short Post', icon: MessageSquare, desc: 'Quick insights' },
                  { key: 'long' as ContentFormat, label: 'Long Form', icon: FileText, desc: 'Detailed articles' },
                  { key: 'listicle' as ContentFormat, label: 'List Post', icon: ListOrdered, desc: 'Numbered lists' },
                  { key: 'hook' as ContentFormat, label: 'Hook', icon: TextQuote, desc: 'Engaging openers' }
                ].map(({ key, label, icon: Icon, desc }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFormat(key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                      selectedFormat === key
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mb-2 ${selectedFormat === key ? 'text-primary' : 'text-gray-500'}`} />
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-gray-500 mt-1">{desc}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Input Section */}
              <Card>
                <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-primary" />
                Content Input
              </CardTitle>
                  <CardDescription>
                Provide your topic, key points, or ideas to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                <label className="text-sm font-medium mb-2 block">Topic or Main Idea</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Remote work productivity tips, AI in marketing, Career advice"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                  </div>
                  
                  <div>
                <label className="text-sm font-medium mb-2 block">Key Points (Optional)</label>
                <textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="Add specific points, statistics, or insights you want to include..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                  </div>
                  
                  <Button 
                    onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3"
                  >
                    {isGenerating ? (
                      <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Content...
                      </>
                    ) : (
                      <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate {selectedFormat === 'short' ? 'Short Post' : 
                             selectedFormat === 'long' ? 'Long Form' :
                             selectedFormat === 'listicle' ? 'List Post' : 'Hook'}
                      </>
                    )}
                  </Button>
            </CardContent>
              </Card>
              
          {/* Generated Content */}
          {generatedContent && (
                <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Generated Content
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopy}
                      className="gap-1"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreatePost}
                      className="gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create Post
                    </Button>
                    </div>
                        </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                    {generatedContent.content}
                  </pre>
                      </div>
                      
                {generatedContent.suggestedHashtags && generatedContent.suggestedHashtags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Suggested Hashtags:</h4>
                    <div className="flex flex-wrap gap-1">
                      {generatedContent.suggestedHashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                          onClick={() => {
                            navigator.clipboard.writeText(hashtag);
                            toast.success('Hashtag copied!');
                          }}
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
                </Card>
              )}
            </div>

        {/* Right Sidebar - Coming Soon */}
        <div className="space-y-6">
          {/* Coming Soon - Advanced AI Features */}
          <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
          </div>
              <CardTitle className="text-lg text-primary">Advanced AI Features</CardTitle>
              <CardDescription className="text-sm">
                Powerful AI enhancements coming soon
                  </CardDescription>
                </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">AI Style Matching</div>
                    <div className="text-xs text-gray-500">Match your writing style</div>
                      </div>
                  </div>
                  
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Performance Insights</div>
                    <div className="text-xs text-gray-500">Optimize for engagement</div>
                    </div>
            </div>
            
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Audience Targeting</div>
                    <div className="text-xs text-gray-500">Personalized content</div>
                      </div>
                      </div>
                    </div>
              
              <div className="pt-4 border-t border-primary/20">
                <div className="text-primary font-semibold text-lg mb-1">Coming Soon</div>
                <div className="text-xs text-gray-600">Get notified when available</div>
                    </div>
                </CardContent>
              </Card>
              
          {/* Tips Card */}
              <Card>
                <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Writing Tips
              </CardTitle>
                </CardHeader>
                <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium">Start with a hook</div>
                    <div className="text-gray-600 text-xs">Grab attention in the first line</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  <div>
                    <div className="font-medium">Add personal insights</div>
                    <div className="text-gray-600 text-xs">Share your unique perspective</div>
                          </div>
                        </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium">End with engagement</div>
                    <div className="text-gray-600 text-xs">Ask questions or call to action</div>
                  </div>
                    </div>
                    </div>
                </CardContent>
              </Card>

          {/* Content Templates - Coming Soon */}
          <Card className="border-dashed border-gray-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <CardTitle className="text-base text-gray-600">Content Templates</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Pre-built templates for common LinkedIn post types
              </p>
              <div className="text-primary font-semibold">Coming Soon</div>
            </CardContent>
          </Card>
            </div>
          </div>
    </div>
  );
};

export default AIWriterPage; 