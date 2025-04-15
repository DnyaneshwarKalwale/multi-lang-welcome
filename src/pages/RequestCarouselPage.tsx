import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid, ChevronRight, Upload, CheckCircle,
  Lightbulb, AlertCircle, Info, Calendar, Youtube,
  FileText, Image, Link, PlusCircle, Eye, Pencil
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { CarouselPreview } from '@/components/CarouselPreview';
import { SliderVariant } from '@/types/LinkedInPost';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

// Form schema for carousel request
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title can't exceed 100 characters"),
  youtubeUrl: z.string().url("Please enter a valid YouTube URL").optional(),
  templateId: z.string().min(1, "Please select a template"),
  sliderVariant: z.string().optional()
});

type CarouselRequestForm = z.infer<typeof formSchema>;

// Template interface
interface CarouselTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  slideCount: number;
}

const RequestCarouselPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('youtube');
  const [success, setSuccess] = useState(false);
  const [sliderVariant, setSliderVariant] = useState<SliderVariant>('basic');
  
  // Get template ID from URL if present
  const searchParams = new URLSearchParams(location.search);
  const templateIdFromURL = searchParams.get('template');
  
  // Predefined carousel templates
  const templates: CarouselTemplate[] = [
    {
      id: 'template-1',
      name: 'Industry Insights',
      description: 'Share valuable insights and trends in your industry with data visualization',
      thumbnailUrl: '/carousel-templates/industry-insights.png',
      slideCount: 8
    },
    {
      id: 'template-2',
      name: 'How-To Guide',
      description: 'Step-by-step instructions with clear visuals and actionable tips',
      thumbnailUrl: '/carousel-templates/how-to-guide.png',
      slideCount: 10
    },
    {
      id: 'template-3',
      name: 'Case Study',
      description: 'Present a business challenge, solution, and results with compelling storytelling',
      thumbnailUrl: '/carousel-templates/case-study.png',
      slideCount: 7
    },
    {
      id: 'template-4',
      name: 'List Post',
      description: 'Present key points in a numbered list format with supporting visuals',
      thumbnailUrl: '/carousel-templates/list-post.png',
      slideCount: 6
    }
  ];

  // Sample carousel slides based on template
  const getSampleSlides = (templateId: string, title: string) => {
    const slides = [];
    const selectedTemplate = templates.find(t => t.id === templateId);
    
    if (!selectedTemplate) return [];
    
    // Generate slides based on template type
    if (templateId === 'template-1') { // Industry Insights
      slides.push({ id: '1', content: title || 'Key Industry Insights for 2023' });
      slides.push({ id: '2', content: 'Market growth increased by 24% in Q2 2023' });
      slides.push({ id: '3', content: '75% of companies are adopting AI solutions' });
      slides.push({ id: '4', content: 'Remote work increased productivity by 22%' });
      slides.push({ id: '5', content: 'Key trend: Sustainability initiatives growing by 45%' });
    } else if (templateId === 'template-2') { // How-To Guide
      slides.push({ id: '1', content: title || '5 Steps to Optimize Your LinkedIn Profile' });
      slides.push({ id: '2', content: 'Step 1: Add a professional profile photo' });
      slides.push({ id: '3', content: 'Step 2: Craft a compelling headline' });
      slides.push({ id: '4', content: 'Step 3: Detail your experience with metrics' });
      slides.push({ id: '5', content: 'Step 4: Add relevant skills and endorsements' });
    } else if (templateId === 'template-3') { // Case Study
      slides.push({ id: '1', content: title || 'How Company X Increased Conversions by 156%' });
      slides.push({ id: '2', content: 'The Challenge: Low website engagement and conversions' });
      slides.push({ id: '3', content: 'The Solution: Implemented personalized user journeys' });
      slides.push({ id: '4', content: 'The Results: 156% increase in conversion rate' });
      slides.push({ id: '5', content: 'Key Takeaway: Personalization drives results' });
    } else { // List Post
      slides.push({ id: '1', content: title || '5 Ways to Boost Team Productivity' });
      slides.push({ id: '2', content: '1. Implement flexible work arrangements' });
      slides.push({ id: '3', content: '2. Use project management software' });
      slides.push({ id: '4', content: '3. Schedule regular team building activities' });
      slides.push({ id: '5', content: '4. Recognize and reward achievements' });
    }
    
    return slides;
  };

  // Initialize form with template from URL if available
  const form = useForm<CarouselRequestForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      youtubeUrl: '',
      templateId: templateIdFromURL || '',
      sliderVariant: 'basic'
    }
  });

  // Set template ID when URL parameter changes
  useEffect(() => {
    if (templateIdFromURL) {
      form.setValue('templateId', templateIdFromURL);
    }
  }, [templateIdFromURL, form]);

  // YouTube URL validation and scraping
  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('youtubeUrl', url);
    
    // Just basic URL validation for now
    if (url && url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      // Simulate scraping - in a real app, you'd call your backend API to scrape the content
      toast.info("Scraping content from YouTube...", {
        duration: 1500
      });
    }
  };

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        toast.success(`File "${file.name}" uploaded successfully`);
      } else {
        toast.error('Please upload a PDF or image file');
      }
    }
  };

  // Change slider variant
  const handleSliderVariantChange = (variant: SliderVariant) => {
    setSliderVariant(variant);
    form.setValue('sliderVariant', variant);
  };

  // Form submission handler
  const onSubmit = async (data: CarouselRequestForm) => {
    setIsSubmitting(true);
    
    try {
      // Add file info to the submission
      const submissionData = {
        ...data,
        hasAttachment: !!selectedFile,
        attachmentName: selectedFile?.name,
        contentSource: activeTab,
        sliderVariant
      };
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form data submitted:', submissionData);
      
      // Show success state
      setSuccess(true);
      toast.success('Carousel request submitted successfully!');
      
      // Reset form after submission
      form.reset();
      setSelectedFile(null);
      
      // After a delay, redirect to carousels page
      setTimeout(() => {
        navigate('/dashboard/my-carousels');
      }, 3000);
    } catch (error) {
      console.error('Error submitting carousel request:', error);
      toast.error('Failed to submit carousel request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view after submission
  if (success) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-green-500">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-3">Carousel Request Submitted!</h1>
          <p className="text-black mb-8 max-w-lg mx-auto">
            Our team will review your request and deliver your professional carousel within 24 hours.
            You'll receive a notification when it's ready.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigate('/dashboard/my-carousels')} className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              View My Carousels
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/home')}
            >
              Return to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main content
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create LinkedIn Carousel</h1>
        <p className="text-black">
          Upload content or paste a YouTube URL to create a professional carousel for your LinkedIn profile
        </p>
      </div>
      
      {/* If no template selected, show a big button to select templates first */}
      {!form.watch('templateId') && (
        <div className="bg-white border-2 border-blue-300 rounded-lg p-8 mb-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <LayoutGrid className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Select a Template First</h2>
          <p className="text-black mb-6 max-w-md mx-auto">
            Choose from our collection of beautiful carousel templates to get started with your LinkedIn carousel.
          </p>
          <Button 
            onClick={() => navigate('/dashboard/templates')}
            className="px-8"
          >
            Browse Templates
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Only show the form if a template is selected */}
      {form.watch('templateId') && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Content Source */}
          <div className="lg:w-1/2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Content Source</CardTitle>
                <CardDescription>
                  Choose how you want to provide your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carousel Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 5 Ways to Boost Team Productivity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Content Source Tabs */}
                    <Tabs 
                      defaultValue="youtube" 
                      className="w-full"
                      value={activeTab}
                      onValueChange={setActiveTab}
                    >
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="youtube" className="flex items-center gap-2">
                          <Youtube className="h-4 w-4" />
                          YouTube
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload File
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* YouTube Content Tab */}
                      <TabsContent value="youtube" className="mt-4 space-y-4">
                        <FormField
                          control={form.control}
                          name="youtubeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>YouTube Video URL</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="https://www.youtube.com/watch?v=..." 
                                    {...field}
                                    onChange={handleYoutubeUrlChange}
                                  />
                                  <Youtube className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormDescription>
                                We'll automatically extract content from the video
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch('youtubeUrl') && (
                          <div className="p-4 bg-white border border-blue-200 rounded-lg mt-4">
                            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-500" />
                              Content will be scraped from video
                            </h3>
                            <p className="text-xs text-black">
                              Our AI will extract key points from your video and create carousel slides based on the content.
                            </p>
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* File Upload Tab */}
                      <TabsContent value="upload" className="mt-4">
                        <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-white">
                          <div className="flex flex-col items-center">
                            {!selectedFile ? (
                              <>
                                <Upload className="h-10 w-10 text-blue-400 mb-3" />
                                <h3 className="text-lg font-medium mb-2">Upload Content</h3>
                                <p className="text-sm text-black mb-4 max-w-md">
                                  Drag and drop your PDF, PowerPoint, or image files here, or click to browse
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="mb-3">
                                  {selectedFile.type.includes('image') ? (
                                    <Image className="h-10 w-10 text-blue-400" />
                                  ) : (
                                    <FileText className="h-10 w-10 text-blue-400" />
                                  )}
                                </div>
                                <h3 className="text-lg font-medium mb-1">{selectedFile.name}</h3>
                                <p className="text-sm text-black mb-4">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </>
                            )}
                            
                            <Input
                              id="file-upload"
                              type="file"
                              accept=".pdf,.ppt,.pptx,.doc,.docx,image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('file-upload')?.click()}
                              className="border-blue-300"
                            >
                              {selectedFile ? 'Change File' : 'Select File'}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    {/* Template Selection */}
                    <div className="space-y-2 mt-6">
                      <FormField
                        control={form.control}
                        name="templateId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex justify-between">
                              <span>Selected Template</span>
                              <Button
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate('/dashboard/templates')}
                                className="h-6 text-xs font-medium text-blue-500 -mt-1"
                              >
                                Change Template
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </FormLabel>
                            <div className="border rounded-lg p-3 bg-white">
                              {templates.map(template => 
                                template.id === field.value ? (
                                  <div key={template.id} className="flex items-start gap-3">
                                    <div className="w-20 h-20 bg-white border border-blue-200 rounded-md flex items-center justify-center overflow-hidden">
                                      <LayoutGrid className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-medium">{template.name}</h3>
                                      <p className="text-xs text-black mt-1 mb-1">
                                        {template.description}
                                      </p>
                                      <div className="flex items-center text-xs text-black">
                                        <LayoutGrid className="h-3 w-3 mr-1" />
                                        {template.slideCount} slides
                                      </div>
                                    </div>
                                  </div>
                                ) : null
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !form.formState.isValid} 
                        className="min-w-[150px]"
                      >
                        {isSubmitting ? 'Submitting...' : 'Request Carousel'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate('/dashboard/templates')}
                      >
                        See More Templates
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Preview */}
          <div className="lg:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>Carousel Preview</CardTitle>
                <CardDescription>
                  Example of how your carousel might look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg overflow-hidden shadow-lg mb-4">
                  {/* Interactive carousel preview using CarouselPreview component */}
                  {form.watch('templateId') && (
                    <CarouselPreview 
                      slides={getSampleSlides(form.watch('templateId'), form.watch('title'))} 
                      variant={sliderVariant} 
                    />
                  )}
                </div>
                
                {/* Carousel style options */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Carousel Style</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    <Button 
                      variant={sliderVariant === 'basic' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSliderVariantChange('basic')}
                      className="text-xs"
                    >
                      Basic
                    </Button>
                    <Button 
                      variant={sliderVariant === 'fade' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSliderVariantChange('fade')}
                      className="text-xs"
                    >
                      Fade
                    </Button>
                    <Button 
                      variant={sliderVariant === 'coverflow' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSliderVariantChange('coverflow')}
                      className="text-xs"
                    >
                      Coverflow
                    </Button>
                    <Button 
                      variant={sliderVariant === 'vertical' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSliderVariantChange('vertical')}
                      className="text-xs"
                    >
                      Vertical
                    </Button>
                    <Button 
                      variant={sliderVariant === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSliderVariantChange('grid')}
                      className="text-xs"
                    >
                      Grid
                    </Button>
                    <Button 
                      variant={sliderVariant === 'pagination' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSliderVariantChange('pagination')}
                      className="text-xs"
                    >
                      With Pagination
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Carousel Best Practices
                    </h3>
                    <ul className="text-sm text-black space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        Keep your content concise and focused on one main topic
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        Use 5-10 slides for optimal engagement
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        Include a clear call-to-action in your final slide
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border-2 border-black rounded-lg p-4">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4" />
                      Carousel Delivery
                    </h3>
                    <p className="text-sm text-black">
                      Your carousel will be ready within 24 hours. You'll receive an email notification when it's ready to view and publish.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCarouselPage; 