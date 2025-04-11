import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Send, Copy, PlusCircle, 
  Sparkles, RefreshCw, Lightbulb, TextQuote,
  ListOrdered, Loader2, Settings, Download
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

// Content format types
type ContentFormat = 'short' | 'long' | 'listicle' | 'hook';

// Response interface
interface AIResponse {
  content: string;
  suggestedHashtags: string[];
}

const AIWriterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [contentFormat, setContentFormat] = useState<ContentFormat>('short');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [tone, setTone] = useState('professional');
  
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

  // Generate content based on prompt
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt or topic');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real app, make API call to AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate response based on selected format
      setResponse(exampleResponses[contentFormat]);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
          hashtags: response.suggestedHashtags 
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
        
        {/* Right column - Generated content */}
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
    </div>
  );
};

export default AIWriterPage; 