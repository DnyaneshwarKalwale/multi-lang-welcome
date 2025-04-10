
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Cpu, 
  FileText, 
  ImageIcon, 
  SlidersHorizontal,
  ArrowRight,
  Check,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Send,
  Loader2,
  Linkedin
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";

const AIContentPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [creativity, setCreativity] = useState([50]);
  const [contentLength, setContentLength] = useState([3]); // 1-5 scale
  
  // Sample templates
  const templates = [
    { 
      id: "carousel", 
      name: "LinkedIn Carousel", 
      description: "Create a 5-slide carousel to engage and educate your audience"
    },
    { 
      id: "listicle", 
      name: "Listicle Post", 
      description: "Create a list-based post that drives engagement and provides value"
    },
    { 
      id: "story", 
      name: "Personal Story", 
      description: "Share a compelling personal story with a business lesson"
    },
    { 
      id: "thoughtLeadership", 
      name: "Thought Leadership", 
      description: "Position yourself as an expert with an insightful perspective"
    },
    { 
      id: "poll", 
      name: "Poll Post", 
      description: "Create an engaging poll with discussion points"
    },
    { 
      id: "celebration", 
      name: "Milestone/Celebration", 
      description: "Announce a personal or company achievement"
    }
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setGenerating(true);
    setGeneratedContent("");
    
    // In a real application, this would call an API
    setTimeout(() => {
      const sampleContent = selectedTemplate === "carousel" 
        ? `# LinkedIn Carousel: The Future of AI in Marketing\n\nSlide 1: Introduction\n- Title: "AI Marketing Revolution: 5 Ways It's Changing Everything"\n- Subtitle: "Insights from our latest research"\n- Brief overview of how AI is transforming digital marketing strategies\n\nSlide 2: Data Analysis\n- How AI analyzes vast amounts of customer data in seconds\n- Key metrics: 300% faster analysis, 87% accuracy in predictions\n- Real-world example of campaign optimization\n\nSlide 3: Personalization at Scale\n- Creating truly personalized experiences for thousands simultaneously\n- Beyond basic segmentation: behavioral prediction models\n- Case study: 43% increase in conversion rates\n\nSlide 4: Content Creation & Optimization\n- AI-generated content performance metrics\n- A/B testing at unprecedented scale\n- The human-AI collaboration process\n\nSlide 5: Call to Action\n- Download our complete report on AI Marketing Trends\n- Contact information for a strategy consultation\n- Invitation to next week's webinar on the topic`
        : `# The 5 LinkedIn Strategies That Transformed Our Engagement Overnight\n\nAfter months of posting content that barely received any traction, our team completely revamped our LinkedIn strategy. The results? A 400% increase in engagement and over 2,000 new connections in just 30 days.\n\nHere's what actually worked:\n\n## 1. The 3-2-1 Content Method\n\nWe implemented a structured weekly posting schedule:\n- 3 educational posts that solve specific industry problems\n- 2 engaging questions that spark meaningful conversations\n- 1 personal/behind-the-scenes story that humanizes our brand\n\nThis balanced approach kept our audience engaged while positioning us as thought leaders.\n\n## 2. Strategic Hashtag Optimization\n\nWe stopped using generic hashtags and developed a targeted strategy:\n- 2 industry-specific hashtags\n- 2 niche topic hashtags\n- 1 branded hashtag\n\nThis combination increased our content discoverability by 215% according to our analytics.\n\n## 3. The First Hour Engagement Technique\n\nWe discovered that LinkedIn's algorithm heavily weights engagement in the first 60 minutes. Our solution? We created an "engagement pod" within our company where team members would meaningfully interact with new content right after publishing.\n\n## 4. Carousel Content Dominance\n\nOur data showed that carousel posts consistently outperformed all other content types, generating 3X more engagement than text-only posts. We committed to publishing at least one carousel weekly, focusing on data visualizations and step-by-step guides.\n\n## 5. Strategic Video Length Optimization\n\nAfter testing multiple video lengths, we found that 2-3 minute videos had the highest completion rate and engagement. We restructured all our video content to fit this optimal window.\n\nWhat LinkedIn strategies have transformed your results? Share in the comments below!\n\n#LinkedInStrategy #ContentMarketing #DigitalMarketing`;
      
      setGeneratedContent(sampleContent);
      setGenerating(false);
      toast.success("Content generated successfully!");
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Content copied to clipboard");
  };

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    let promptText = "";
    
    switch(templateId) {
      case "carousel":
        promptText = "Create a 5-slide LinkedIn carousel about AI in marketing";
        break;
      case "listicle":
        promptText = "Create a LinkedIn post with 5 strategies to increase engagement";
        break;
      case "story":
        promptText = "Write a personal story about overcoming a business challenge";
        break;
      case "thoughtLeadership":
        promptText = "Create a thought leadership post about the future of remote work";
        break;
      case "poll":
        promptText = "Create an engaging LinkedIn poll about professional development";
        break;
      case "celebration":
        promptText = "Write a LinkedIn post celebrating a company milestone";
        break;
      default:
        promptText = "";
    }
    
    setPrompt(promptText);
    toast.info(`Template "${templateId}" selected`);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">AI Content Generation</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create professional LinkedIn content with AI assistance
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="long-form" className="space-y-8">
          <TabsList className="grid grid-cols-2 gap-2 mb-8">
            <TabsTrigger value="long-form" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Long-Form Content
            </TabsTrigger>
            <TabsTrigger value="carousels" className="data-[state=active]:bg-linkedin-blue data-[state=active]:text-white">
              <ImageIcon className="h-4 w-4 mr-2" />
              Carousels
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="long-form" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                    Generate LinkedIn Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Describe what content you want to create</Label>
                    <Textarea 
                      id="prompt"
                      placeholder="E.g., Write a thoughtful LinkedIn post about leadership challenges in remote teams"
                      className="min-h-[120px] resize-none"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="creativity">Creativity</Label>
                        <span className="text-sm text-gray-500">{creativity[0]}%</span>
                      </div>
                      <Slider
                        id="creativity"
                        min={0}
                        max={100}
                        step={10}
                        value={creativity}
                        onValueChange={setCreativity}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Conservative</span>
                        <span>Creative</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="length">Content Length</Label>
                        <span className="text-sm text-gray-500">
                          {contentLength[0] === 1 ? 'Brief' : 
                           contentLength[0] === 2 ? 'Short' : 
                           contentLength[0] === 3 ? 'Medium' : 
                           contentLength[0] === 4 ? 'Long' : 'Comprehensive'}
                        </span>
                      </div>
                      <Slider
                        id="length"
                        min={1}
                        max={5}
                        step={1}
                        value={contentLength}
                        onValueChange={setContentLength}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Brief</span>
                        <span>Comprehensive</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Advanced Options
                  </Button>
                  <Button 
                    className="bg-linkedin-blue hover:bg-linkedin-darkBlue"
                    onClick={handleGenerate}
                    disabled={generating || !prompt.trim()}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cpu className="h-5 w-5 mr-2 text-purple-500" />
                      AI Generated Content
                    </div>
                    {generatedContent && (
                      <Button variant="ghost" size="sm" onClick={handleCopy}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full pr-4">
                    {generatedContent ? (
                      <div className="space-y-4 whitespace-pre-line">
                        {generatedContent.split('\n\n').map((paragraph, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          >
                            <p className="text-sm">{paragraph}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : generating ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-linkedin-blue" />
                          <p className="text-gray-500">Generating content...</p>
                          <p className="text-xs text-gray-400 mt-2">This may take a few seconds</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Sparkles className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-500">Your AI-generated content will appear here</p>
                          <p className="text-xs text-gray-400 mt-2">Enter a prompt and click "Generate Content"</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                {generatedContent && (
                  <CardFooter className="border-t pt-4">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            Good
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <ThumbsDown className="h-4 w-4" />
                            Improve
                          </Button>
                        </div>
                        <Button className="bg-linkedin-blue hover:bg-linkedin-darkBlue gap-1" size="sm">
                          <Linkedin className="h-4 w-4" />
                          Post to LinkedIn
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Provide feedback to improve future generations" className="flex-1" />
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id ? 'border-linkedin-blue ring-2 ring-linkedin-blue/20' : ''
                      }`}
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                          </div>
                          {selectedTemplate === template.id && (
                            <div className="h-6 w-6 rounded-full bg-linkedin-blue flex items-center justify-center text-white">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="carousels">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                  LinkedIn Carousel Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="carousel-topic">Carousel Topic</Label>
                  <Input 
                    id="carousel-topic" 
                    placeholder="E.g., 5 AI Trends Reshaping Marketing in 2025"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="num-slides">Number of Slides</Label>
                    <Select defaultValue="5">
                      <SelectTrigger id="num-slides">
                        <SelectValue placeholder="Select number of slides" />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 5, 7, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} slides
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carousel-style">Carousel Style</Label>
                    <Select defaultValue="professional">
                      <SelectTrigger id="carousel-style">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="data-driven">Data-driven</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carousel-details">Additional Details</Label>
                  <Textarea 
                    id="carousel-details"
                    placeholder="Include any specific information, data points, or messaging you want to include in your carousel"
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button className="bg-linkedin-blue hover:bg-linkedin-darkBlue">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Carousel
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Carousels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "5 AI Trends Reshaping Marketing",
                    "The Future of Remote Work",
                    "Data Security Best Practices"
                  ].map((title, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-linkedin-blue/10 rounded flex items-center justify-center text-linkedin-blue">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{title}</p>
                        <p className="text-xs text-gray-500">Generated 2 days ago</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Carousel Design Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Maintain Visual Consistency
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Use consistent colors, fonts, and layouts across all slides to create a cohesive experience.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        One Key Point Per Slide
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Focus on a single message or data point per slide to avoid overwhelming readers.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Strong First Slide
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Your first slide should capture attention with a compelling headline and visual.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Call-to-Action Last Slide
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        End with a clear call-to-action that tells readers what to do next.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// For TypeScript support
const Select = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);

const SelectTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props}>
    {children}
    <SlidersHorizontal className="h-4 w-4 opacity-50" />
  </div>
);

const SelectValue = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);

const SelectContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 mt-1 p-1" {...props}>
    {children}
  </div>
);

const SelectItem = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground" 
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4" />
    </span>
    {children}
  </div>
);

export default AIContentPage;
