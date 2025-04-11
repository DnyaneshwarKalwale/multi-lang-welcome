import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Linkedin, Globe, Youtube, Copy, 
  Lightbulb, MessageSquare, Save, Loader2,
  FileText, ArrowRight, PlusCircle
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

// Scraper result interface
interface ScraperResult {
  content: string;
  keyPoints: string[];
  tone: string;
  suggestedHook: string;
  estimatedReadTime: number;
  wordCount: number;
}

const ScraperPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('linkedin');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);
  
  // Example result data for demonstration
  const exampleResult: ScraperResult = {
    content: "In today's digital landscape, content creation has become a cornerstone of successful marketing strategies. However, many businesses struggle with consistency and quality. Our recent study of 500 marketing professionals revealed that companies using AI-assisted content generation saw a 37% increase in engagement and a 22% reduction in content production time. The key findings suggest that human-AI collaboration produces the best results, with AI handling research and initial drafts while humans refine messaging and add authentic perspectives. This approach not only improves efficiency but also enhances content relevance across different platforms.",
    keyPoints: [
      "Companies using AI for content creation saw 37% higher engagement",
      "Human-AI collaboration produces better results than either alone",
      "Content production time reduced by 22% when using AI assistance",
      "Quality and consistency improved across multiple platforms"
    ],
    tone: "Professional, informative, data-driven",
    suggestedHook: "Our recent study of 500 marketing professionals revealed a surprising insight about AI-assisted content creation that could transform your engagement metrics...",
    estimatedReadTime: 2,
    wordCount: 120
  };

  // Process URL from input
  const handleScrape = async () => {
    if (!inputUrl) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, make API call to scrape content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful response
      setResult(exampleResult);
      toast.success('Content scraped successfully!');
    } catch (error) {
      console.error('Error scraping content:', error);
      toast.error('Failed to scrape content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy content to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Save to inspiration vault
  const handleSaveToInspiration = () => {
    // In a real app, make API call to save to inspiration vault
    toast.success('Saved to Inspiration Vault!');
  };

  // Create post from scraped content
  const handleCreatePost = () => {
    // In a real app, you would store the scraped content and redirect
    navigate('/dashboard/post');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Content Scraper</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Extract valuable content from LinkedIn profiles, websites, and YouTube videos
        </p>
      </div>
      
      <Tabs defaultValue="linkedin" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Website</span>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            <span>YouTube</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={
                  activeTab === 'linkedin' 
                    ? 'Enter LinkedIn profile or post URL' 
                    : activeTab === 'website'
                      ? 'Enter website URL'
                      : 'Enter YouTube video URL'
                }
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleScrape} 
              disabled={isLoading || !inputUrl} 
              className="gap-2 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Scrape
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {activeTab === 'linkedin' 
              ? 'Example: https://www.linkedin.com/in/username or https://www.linkedin.com/posts/...' 
              : activeTab === 'website'
                ? 'Example: https://www.example.com/blog/article'
                : 'Example: https://www.youtube.com/watch?v=videoId'
            }
          </p>
        </div>
        
        {/* Results section */}
        {result && (
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
        {!result && !isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
                  {activeTab === 'linkedin' ? (
                    <Linkedin className="h-8 w-8 text-primary" />
                  ) : activeTab === 'website' ? (
                    <Globe className="h-8 w-8 text-primary" />
                  ) : (
                    <Youtube className="h-8 w-8 text-primary" />
                  )}
                </div>
                
                <h3 className="text-lg font-medium mb-2">
                  {activeTab === 'linkedin' 
                    ? 'Extract Content from LinkedIn' 
                    : activeTab === 'website'
                      ? 'Extract Content from Websites'
                      : 'Extract Content from YouTube Videos'
                  }
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {activeTab === 'linkedin' 
                    ? 'Paste a LinkedIn profile URL or post link to extract professional insights, experience, and content for your posts.' 
                    : activeTab === 'website'
                      ? 'Paste any article or blog URL to extract key points, analyze tone, and suggest hooks for your LinkedIn content.'
                      : 'Paste a YouTube video URL to extract transcripts, key points, and insights to share on LinkedIn.'
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
      </Tabs>
    </div>
  );
};

export default ScraperPage; 