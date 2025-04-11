import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ImageIcon, 
  MessageSquare, 
  Clock, 
  Calendar, 
  ChevronDown, 
  PlusCircle, 
  FileText, 
  PanelLeftClose, 
  PanelLeftOpen,
  Sparkles,
  BarChart,
  ThumbsUp,
  Share2,
  Forward,
  ArrowRightFromLine,
  Hash,
  Wand2,
  Users,
  MessageCircle
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { SliderVariant } from '@/types/LinkedInPost';
import { CarouselPreview } from '@/components/CarouselPreview';

const carouselTemplates = [
  {
    id: '1',
    name: '5 Industry Tips',
    description: 'Share 5 valuable tips related to your industry',
    slideCount: 5,
    category: 'listicle' as const
  },
  {
    id: '2',
    name: 'How-To Guide',
    description: 'Step-by-step instructions on accomplishing a task',
    slideCount: 4,
    category: 'how-to' as const
  },
  {
    id: '3',
    name: 'Industry Insights',
    description: 'Share valuable data and insights about your industry',
    slideCount: 3,
    category: 'industry-insights' as const
  },
  {
    id: '4',
    name: 'Case Study',
    description: 'Present a success story with results',
    slideCount: 4,
    category: 'case-study' as const
  },
  {
    id: '5',
    name: 'Before & After',
    description: 'Show the transformation process',
    slideCount: 2,
    category: 'educational' as const
  }
];

const sliderOptions: SliderVariant[] = [
  'basic',
  'pagination',
  'gallery',
  'looped',
  'autoplay',
  'responsive',
  'grid',
  'coverflow',
  'fade',
  'vertical',
  'thumbs',
  'parallax'
];

const CreatePostPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('text');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [sliderType, setSliderType] = useState<SliderVariant>('basic');
  const [slides, setSlides] = useState<{id: string, content: string}[]>([
    { id: '1', content: 'Slide 1: Introduction to your topic' },
    { id: '2', content: 'Slide 2: Key point or insight #1' },
    { id: '3', content: 'Slide 3: Key point or insight #2' },
  ]);
  
  const [hashtags, setHashtags] = useState<string[]>([
    'LinkedInTips', 'ContentCreation', 'ProfessionalDevelopment'
  ]);
  
  const [newHashtag, setNewHashtag] = useState('');
  
  const addHashtag = () => {
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag]);
      setNewHashtag('');
    }
  };
  
  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };
  
  const addSlide = () => {
    const newId = (slides.length + 1).toString();
    setSlides([...slides, { id: newId, content: `Slide ${newId}: Add your content here` }]);
  };
  
  const updateSlide = (id: string, newContent: string) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, content: newContent } : slide
    ));
  };
  
  const removeSlide = (id: string) => {
    if (slides.length > 1) {
      setSlides(slides.filter(slide => slide.id !== id));
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  const applyTemplate = (templateId: string) => {
    const template = carouselTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      
      // Generate new slides based on template
      const newSlides = Array.from({ length: template.slideCount }, (_, i) => {
        const slideNumber = i + 1;
        let slideContent = '';
        
        if (template.category === 'listicle') {
          slideContent = slideNumber === 1 
            ? `${template.name}` 
            : `Tip #${slideNumber-1}: [Your tip here]`;
        } else if (template.category === 'how-to') {
          slideContent = slideNumber === 1 
            ? `How to [Accomplish Something]` 
            : `Step ${slideNumber-1}: [Step description]`;
        } else if (template.category === 'case-study') {
          if (slideNumber === 1) slideContent = 'Challenge: [Describe the problem]';
          else if (slideNumber === 2) slideContent = 'Solution: [What was implemented]';
          else if (slideNumber === 3) slideContent = 'Process: [How it was done]';
          else slideContent = 'Results: [Outcomes and benefits]';
        } else {
          slideContent = `Slide ${slideNumber}: [Add content here]`;
        }
        
        return { id: slideNumber.toString(), content: slideContent };
      });
      
      setSlides(newSlides);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-black">Create LinkedIn Content</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Clock size={16} />
            Schedule
          </Button>
          <Button size="sm" className="bg-primary text-white gap-1">
            <ArrowRightFromLine size={16} />
            Publish Now
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className={showSidebar ? "md:col-span-2" : "md:col-span-3"}>
          <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text Post</TabsTrigger>
              <TabsTrigger value="carousel">Carousel</TabsTrigger>
              <TabsTrigger value="document">Document</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create Text Post</CardTitle>
                  <CardDescription>
                    Write a professional text post for your LinkedIn audience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Share your insights, knowledge, or ask a question..."
                      className="min-h-[200px] resize-y"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hashtags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-neutral-light px-2 py-1 flex items-center gap-1"
                          onClick={() => removeHashtag(tag)}
                        >
                          #{tag}
                          <span className="text-xs ml-1">×</span>
                        </Badge>
                      ))}
                      
                      <div className="flex items-center gap-1">
                        <Input
                          placeholder="Add hashtag"
                          className="w-32 h-8"
                          value={newHashtag}
                          onChange={(e) => setNewHashtag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addHashtag();
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={addHashtag}
                        >
                          <PlusCircle size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="outline" size="sm" className="gap-1">
                        <ImageIcon size={14} />
                        Add Image
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <MessageSquare size={14} />
                        Add Poll
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="carousel" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create Carousel Post</CardTitle>
                  <CardDescription>
                    Build a multi-slide carousel to showcase your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium">Slider Type</label>
                      <Select 
                        value={sliderType} 
                        onValueChange={(value) => setSliderType(value as SliderVariant)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a slider type" />
                        </SelectTrigger>
                        <SelectContent>
                          {sliderOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)} Slider
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    {/* Slides editor */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium">Carousel Slides</h3>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={addSlide} 
                          className="gap-1"
                        >
                          <PlusCircle size={16} />
                          Add Slide
                        </Button>
                      </div>
                      
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {slides.map((slide, index) => (
                            <Card key={slide.id} className="relative">
                              <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">Slide {index + 1}</CardTitle>
                                  {slides.length > 1 && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => removeSlide(slide.id)}
                                    >
                                      <span className="sr-only">Remove slide</span>
                                      ×
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="py-2">
                                <Textarea
                                  placeholder="Slide content here..."
                                  className="min-h-[100px]"
                                  value={slide.content}
                                  onChange={(e) => updateSlide(slide.id, e.target.value)}
                                />
                                <div className="flex items-center gap-2 mt-3">
                                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                                    <ImageIcon size={14} />
                                    Add Image
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Wand2 size={16} />
                      AI Assist
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Hash size={16} />
                      Add Hashtags
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleSidebar}
                    className="gap-1 md:hidden"
                  >
                    {showSidebar ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                    {showSidebar ? "Hide Templates" : "Show Templates"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="document" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Document</CardTitle>
                  <CardDescription>
                    Share PDF documents, presentations, or other files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-10 text-center bg-neutral-lightest">
                    <FileText size={48} className="mx-auto mb-4 text-neutral-medium" />
                    <h3 className="text-lg font-medium mb-2">Upload Document</h3>
                    <p className="text-sm text-neutral-medium mb-4">
                      Drag and drop a file here, or click to browse
                    </p>
                    <Button>Select File</Button>
                  </div>
                  
                  <div className="mt-6">
                    <label className="text-sm font-medium">Add a description</label>
                    <Textarea
                      placeholder="Add a description for your document..."
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Live Preview Section */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your post will look on LinkedIn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 max-w-xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    U
                  </div>
                  <div>
                    <h4 className="font-medium">User Name</h4>
                    <p className="text-xs text-neutral-medium">Product Marketing Manager</p>
                  </div>
                </div>
                
                {activeTab === 'text' && (
                  <div className="mb-4">
                    <p className="text-sm mb-3">{content || "Your post content will appear here"}</p>
                    <div className="flex flex-wrap gap-1">
                      {hashtags.map(tag => (
                        <span key={tag} className="text-primary text-sm">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'carousel' && (
                  <div className="mb-4">
                    <CarouselPreview slides={slides} variant={sliderType} />
                  </div>
                )}
                
                {activeTab === 'document' && (
                  <div className="bg-neutral-lightest border rounded-lg p-6 mb-4 text-center">
                    <FileText size={40} className="mx-auto mb-2 text-neutral-medium" />
                    <p className="text-sm text-neutral-medium">Document Preview</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-neutral-medium text-sm pt-3 border-t">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1">
                      <ThumbsUp size={16} /> Like
                    </button>
                    <button className="flex items-center gap-1">
                      <MessageCircle size={16} /> Comment
                    </button>
                    <button className="flex items-center gap-1">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                  <button className="flex items-center gap-1">
                    <Forward size={16} /> Send
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar / AI Tools Panel */}
        {showSidebar && (
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tools & Templates</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSidebar}
                    className="hidden md:flex"
                  >
                    <PanelLeftClose size={16} />
                  </Button>
                </div>
                <CardDescription>
                  Enhance your content with these tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Sparkles size={16} className="text-amber-500" />
                        AI Assistance
                      </h3>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Generate a professional post
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Improve writing style
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Create catchy hook
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Suggest hashtags
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Users size={16} className="text-primary" />
                        Audience Targeting
                      </h3>
                      <Select defaultValue="professionals">
                        <SelectTrigger>
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professionals">General Professionals</SelectItem>
                          <SelectItem value="recruiters">Recruiters & HR</SelectItem>
                          <SelectItem value="tech">Tech Industry</SelectItem>
                          <SelectItem value="marketing">Marketing Professionals</SelectItem>
                          <SelectItem value="executives">Executives & Leaders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <BarChart size={16} className="text-accent" />
                        Engagement Tips
                      </h3>
                      <div className="bg-accent-50 rounded-lg p-3 text-sm">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Ask a question to encourage comments</li>
                          <li>Use 3-5 relevant hashtags</li>
                          <li>Keep paragraphs short and scannable</li>
                          <li>Include a clear call-to-action</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'carousel' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Carousel Templates</h3>
                      <ScrollArea className="h-[330px]">
                        <div className="space-y-2 pr-4">
                          {carouselTemplates.map(template => (
                            <div 
                              key={template.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                selectedTemplate === template.id 
                                  ? 'bg-primary-50 border-primary' 
                                  : 'hover:bg-neutral-lightest'
                              }`}
                              onClick={() => applyTemplate(template.id)}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{template.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {template.slideCount} slides
                                </Badge>
                              </div>
                              <p className="text-xs text-neutral-medium">{template.description}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Sparkles size={16} className="text-amber-500" />
                        AI Carousel Helper
                      </h3>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Generate carousel content
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Improve slide formatting
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-sm">
                          Optimize for readability
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'document' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Document Tips</h3>
                      <div className="bg-primary-50 rounded-lg p-3 text-sm">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Use PDFs for best compatibility</li>
                          <li>Ensure document is under 100MB</li>
                          <li>Use landscape orientation for presentations</li>
                          <li>Add your branding and contact info</li>
                        </ul>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Post Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Add description</label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">First page as thumbnail</label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Show document pages</label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Scheduling Card */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle>Schedule Post</CardTitle>
                <CardDescription>
                  Choose when to publish your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Input type="time" className="mt-1" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <BarChart size={16} className="text-primary" />
                      Best Time To Post
                    </h3>
                    <div className="bg-primary-50 rounded-lg p-3 text-sm">
                      <p>Based on your audience, the best times to post are:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>Tuesday 9-11 AM</li>
                        <li>Wednesday 1-3 PM</li>
                        <li>Thursday 8-10 AM</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage; 