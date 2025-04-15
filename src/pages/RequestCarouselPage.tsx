import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, ChevronRight, Upload, CheckCircle,
  Lightbulb, AlertCircle, Info, Calendar
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

// Form schema for carousel request
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title can't exceed 100 characters"),
  topic: z.string().min(10, "Please provide more details about your topic"),
  audience: z.string().min(5, "Please specify your target audience"),
  tone: z.enum(['professional', 'casual', 'inspirational', 'educational', 'conversational']),
  callToAction: z.string().optional(),
  templateId: z.string().optional(),
  additionalNotes: z.string().optional()
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
      topic: '',
      audience: '',
      tone: 'professional',
      callToAction: '',
      templateId: '',
      additionalNotes: ''
    }
  });

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a PDF or image file');
      }
    }
  };

  // Form submission handler
  const onSubmit = async (data: CarouselRequestForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form data submitted:', data);
      console.log('File:', selectedFile);
      
      // Show success state
      setSuccess(true);
      toast.success('Carousel request submitted successfully!');
      
      // Reset form after submission
      form.reset();
      setSelectedFile(null);
      
      // After a delay, redirect to carousels page
      setTimeout(() => {
        navigate('/dashboard/carousels');
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
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-3">Carousel Request Submitted!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
            Our team will review your request and deliver your professional carousel within 24 hours.
            You'll receive a notification when it's ready.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigate('/dashboard/carousels')} className="gap-2">
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Request Carousel Post</h1>
        <p className="">
          Share your requirements and our team will create a professional carousel for your LinkedIn profile
        </p>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 mb-8 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">About Carousel Requests</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Our team will design a professional LinkedIn carousel based on your brief. You can expect delivery within 24 hours.
            Each request counts as 1 carousel credit from your subscription.
          </p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carousel Brief Section */}
            <Card>
              <CardHeader>
                <CardTitle>Carousel Brief</CardTitle>
                <CardDescription>
                  Tell us about your carousel content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the main topic and key points you want to cover" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The more details you provide, the better we can tailor your carousel
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Marketing professionals, startup founders" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Tone</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="callToAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call To Action (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Download our free guide, Book a consultation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="file-upload">
                    Upload Reference Material (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {selectedFile ? selectedFile.name : 'PDF or image files up to 10MB'}
                      </p>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        {selectedFile ? 'Change File' : 'Select File'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Template Selection Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Template</CardTitle>
                  <CardDescription>
                    Select a design template for your carousel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 gap-4">
                          {templates.map(template => (
                            <div
                              key={template.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                field.value === template.id 
                                  ? 'border-primary bg-primary-50 dark:bg-primary-900/20' 
                                  : 'border-gray-200 dark:border-gray-800 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }`}
                              onClick={() => field.onChange(template.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                                  {/* If you have actual images, use them here */}
                                  <LayoutGrid className="h-8 w-8 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{template.name}</h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-1">
                                    {template.description}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <LayoutGrid className="h-3 w-3 mr-1" />
                                    {template.slideCount} slides
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any other requirements or preferences" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              Estimated delivery: 24 hours
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard/home')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="min-w-[120px]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RequestCarouselPage; 