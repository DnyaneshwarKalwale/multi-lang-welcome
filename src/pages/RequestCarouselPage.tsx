import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

// Form schema for carousel request
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title can't exceed 100 characters"),
  youtubeUrl: z.string().url("Please enter a valid YouTube URL").optional(),
  templateId: z.string().min(1, "Please select a template")
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
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('youtube');
  const [success, setSuccess] = useState(false);
  
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

  // Initialize form
  const form = useForm<CarouselRequestForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      youtubeUrl: '',
      templateId: ''
    }
  });

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

  // Form submission handler
  const onSubmit = async (data: CarouselRequestForm) => {
    setIsSubmitting(true);
    
    try {
      // Add file info to the submission
      const submissionData = {
        ...data,
        hasAttachment: !!selectedFile,
        attachmentName: selectedFile?.name,
        contentSource: activeTab
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create LinkedIn Carousel</h1>
        <p className="text-black">
          Upload content or paste a YouTube URL to create a professional carousel for your LinkedIn profile
        </p>
      </div>
      
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
                          <FormLabel>Select Template Style</FormLabel>
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            {templates.slice(0, 4).map(template => (
                            <div
                              key={template.id}
                                className={`border rounded-lg p-2 cursor-pointer transition-all duration-200 ${
                                field.value === template.id 
                                    ? 'border-primary bg-white border-2 shadow-md' 
                                    : 'border-black hover:border-primary hover:border-2 hover:shadow-md bg-white'
                              }`}
                              onClick={() => field.onChange(template.id)}
                            >
                                <div className="text-center">
                                  <div className="w-full h-20 bg-white border border-blue-200 rounded-md flex items-center justify-center overflow-hidden mb-2">
                                    <LayoutGrid className="h-6 w-6 text-blue-400" />
                                  </div>
                                  <p className="text-xs font-medium truncate">{template.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                          <div className="mt-2 flex justify-center">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate('/dashboard/templates')}
                              className="text-sm font-medium text-blue-500"
                            >
                              View All Templates
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
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
                      See Templates
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
              <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-lg">
                {/* Sample carousel preview */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-r from-blue-50 to-white border-b-2 border-black flex items-center justify-center">
                    <div className="text-center p-4">
                      <h3 className="text-xl font-bold text-black">5 Ways to Boost Team Productivity</h3>
                      <p className="text-sm text-black mt-2">Slide 1 of 5</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      1
                    </div>
                    <div className="h-1 w-6 bg-black rounded-full"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      2
                    </div>
                    <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      3
                    </div>
                    <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      4
                    </div>
                    <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      5
                    </div>
                  </div>
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
    </div>
  );
};

export default RequestCarouselPage; 