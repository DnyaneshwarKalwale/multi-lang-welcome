
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Copy,
  Check,
  ChevronDown,
  Zap,
  Link as LinkIcon,
  Image,
  PenTool
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ProgressDots } from '@/components/ProgressDots';

export default function AIContentPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [contentType, setContentType] = useState('post');
  const [toneOptions, setToneOptions] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState('professional');

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    setGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const demoContent = `# The Future of AI in Content Marketing

## Transforming How We Connect with Audiences

In today's digital landscape, creating engaging content consistently remains one of the biggest challenges for marketers and creators alike.

Artificial Intelligence is revolutionizing this space by:

1. Personalizing content at scale
2. Predicting trending topics before they peak
3. Optimizing content performance through data analysis

> "The best AI doesn't replace human creativity - it amplifies it." - Digital Marketing Expert

What's truly exciting is how these tools are becoming increasingly accessible to everyone, not just enterprise companies with massive budgets.

What are your thoughts on AI-assisted content creation? Has it changed your workflow?

#ContentMarketing #AITechnology #DigitalStrategy`;

      setGeneratedContent(demoContent);
      setGenerating(false);
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const templates = [
    {
      id: 'thought-leadership',
      name: 'Thought Leadership',
      description: 'Establish authority with insightful, forward-thinking content',
      example: 'Share your perspective on [industry trend] and how it will impact professionals in the next 5 years'
    },
    {
      id: 'how-to',
      name: 'How-To Guide',
      description: 'Create practical, step-by-step content that solves problems',
      example: 'Explain how to [solve common problem] in 5 simple steps that anyone can follow'
    },
    {
      id: 'success-story',
      name: 'Success Story',
      description: 'Highlight achievements and lessons learned from real experiences',
      example: 'Share how you or your team overcame [challenge] to achieve [specific result]'
    },
    {
      id: 'industry-insights',
      name: 'Industry Insights',
      description: 'Analyze trends and provide valuable market observations',
      example: 'Break down what [recent industry change] means for professionals in your field'
    },
    {
      id: 'question-prompt',
      name: 'Engagement Question',
      description: 'Spark conversation with thought-provoking questions',
      example: 'Ask your network: "What\'s the biggest misconception about [topic] in your experience?"'
    }
  ];

  const contentTypes = [
    { value: 'post', label: 'LinkedIn Post' },
    { value: 'article', label: 'LinkedIn Article' },
    { value: 'comment', label: 'Thoughtful Comment' },
    { value: 'message', label: 'Connection Message' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'authoritative', label: 'Authoritative' }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Input Section */}
          <motion.div 
            className="w-full md:w-1/2"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  AI Content Generator
                </CardTitle>
                <CardDescription>
                  Create engaging LinkedIn content with AI assistance
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-5">
                {/* Content Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Template */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Template</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Prompt</label>
                  <Textarea
                    placeholder="What would you like to write about?"
                    className="min-h-[120px] resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim()}
                >
                  {generating ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div 
            className="w-full md:w-1/2"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Generated Content
                </CardTitle>
                <CardDescription>
                  Your AI-assisted content will appear here
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div 
                  className={`rounded-md border p-4 min-h-[300px] bg-white dark:bg-gray-900 overflow-y-auto prose dark:prose-invert max-w-none ${
                    !generatedContent ? 'flex items-center justify-center text-gray-400' : ''
                  }`}
                >
                  {generatedContent ? (
                    <div className="markdown-content whitespace-pre-wrap">
                      {generatedContent}
                    </div>
                  ) : (
                    <div className="text-center opacity-70">
                      <PenTool className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>Your generated content will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>

              {generatedContent && (
                <CardFooter className="flex justify-between border-t pt-4 pb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? 'Copied!' : 'Copy to clipboard'}
                  </Button>

                  <Button size="sm">
                    Post to LinkedIn
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Templates Showcase */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-6">Popular Templates</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.slice(0, 3).map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setPrompt(template.example);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Use this template
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
