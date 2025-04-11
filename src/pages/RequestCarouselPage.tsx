import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, ChevronRight, Upload, CheckCircle,
  Lightbulb, AlertCircle, Info, Calendar,
  ArrowLeft,
  FileText,
  CalendarDays,
  Check,
  PlusCircle,
  AlertTriangle,
  ClipboardList
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard/my-carousels')}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-bold">Request New Carousel</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={onSubmit}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Carousel Details</CardTitle>
                <CardDescription className="text-xs">
                  Provide the details for your custom carousel request
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm">
                    Topic/Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="topic"
                    name="topic"
                    placeholder="e.g., 10 Ways to Improve Team Productivity"
                    value={form.watch('topic')}
                    onChange={form.handleChange}
                    required
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-sm">Target Audience</Label>
                    <Input
                      id="audience"
                      name="audience"
                      placeholder="e.g., Marketing professionals, startup founders"
                      value={form.watch('audience')}
                      onChange={form.handleChange}
                      className="h-9 text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-sm">Content Tone</Label>
                    <Select
                      value={form.watch('tone')}
                      onValueChange={(value) => form.setValue('tone', value as 'professional' | 'casual' | 'inspirational' | 'educational' | 'conversational')}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="callToAction" className="text-sm">Call To Action (Optional)</Label>
                  <Input
                    id="callToAction"
                    name="callToAction"
                    placeholder="e.g., Download our free guide, Book a consultation"
                    value={form.watch('callToAction')}
                    onChange={form.handleChange}
                    className="h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-sm">Additional Notes (Optional)</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    placeholder="Any other requirements or preferences"
                    value={form.watch('additionalNotes')}
                    onChange={form.handleChange}
                    className="resize-none h-24 text-sm"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/my-carousels')}
                  className="h-9 text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="h-9 text-sm gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Request Tips</CardTitle>
              <CardDescription className="text-xs">
                How to get the best results
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Be Specific</h3>
                  <p className="text-xs text-gray-500">
                    The more details you provide, the better your carousel will match your needs.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Ideal Length</h3>
                  <p className="text-xs text-gray-500">
                    8-10 slides work best for LinkedIn engagement. Too many slides may lose viewer attention.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="h-3.5 w-3.5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Realistic Deadlines</h3>
                  <p className="text-xs text-gray-500">
                    Standard turnaround is 2-3 business days. Rush orders may be available for an additional fee.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Resources</h3>
                  <p className="text-xs text-gray-500">
                    Include links to any references or studies you'd like incorporated in the Additional Notes.
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 rounded-b-lg p-3">
              <div className="flex gap-2 w-full">
                <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <p className="text-xs text-gray-600">
                  Need help with your request? Contact our support team at support@scripe.com
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestCarouselPage; 