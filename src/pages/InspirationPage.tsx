import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Lightbulb, 
  Bookmark, 
  BookmarkCheck,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Plus,
  ArrowUpRight,
  CheckCircle,
  Filter,
  Flame,
  Copy,
  TrendingUp,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const InspirationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIdeas, setSavedIdeas] = useState<string[]>(['1', '3']);
  
  // Sample data for demonstration
  const contentIdeas = [
    {
      id: '1',
      title: '7 LinkedIn Content Formats That Drive Engagement',
      category: 'Listicle',
      type: 'Carousel',
      engagementScore: 9.2,
      trending: true,
      prompt: 'Sharing the most effective LinkedIn post formats that consistently deliver high engagement based on my analysis of top posts.'
    },
    {
      id: '2',
      title: 'My Journey From [Previous Role] to [Current Role]',
      category: 'Story',
      type: 'Text Post',
      engagementScore: 8.5,
      trending: false,
      prompt: 'Share your career transition story highlighting key lessons, challenges overcome, and advice for others making similar changes.'
    },
    {
      id: '3',
      title: 'The Ultimate LinkedIn Profile Optimization Checklist',
      category: 'How-to',
      type: 'Carousel',
      engagementScore: 9.5,
      trending: true,
      prompt: 'Create a step-by-step guide showing how to transform a basic LinkedIn profile into an attention-grabbing, lead-generating asset.'
    },
    {
      id: '4',
      title: 'The One Productivity Hack That Changed My Work Life',
      category: 'Personal',
      type: 'Text Post',
      engagementScore: 8.7,
      trending: false,
      prompt: 'Share a specific technique, tool, or mindset shift that dramatically improved your productivity, with tangible before/after results.'
    },
    {
      id: '5',
      title: 'Behind-the-Scenes: How We Increased Conversions by 300%',
      category: 'Case Study',
      type: 'Document',
      engagementScore: 9.0,
      trending: true,
      prompt: 'Reveal the strategy, process, and specific tactics used to achieve exceptional results for your business or client (with their permission).'
    },
    {
      id: '6',
      title: 'I Asked 50 Industry Leaders This One Question...',
      category: 'Research',
      type: 'Carousel',
      engagementScore: 8.9,
      trending: false,
      prompt: 'Share insights gathered from asking a thought-provoking question to multiple experts in your field, highlighting patterns and surprising findings.'
    }
  ];
  
  const trendingTopics = [
    'AI in Content Creation',
    'Remote Work Culture',
    'LinkedIn Algorithm Changes',
    'Personal Branding',
    'Career Transitions',
    'Future of Work',
    'LinkedIn Creator Economy',
    'Work-Life Balance'
  ];
  
  const toggleSaveIdea = (id: string) => {
    if (savedIdeas.includes(id)) {
      setSavedIdeas(savedIdeas.filter(ideaId => ideaId !== id));
    } else {
      setSavedIdeas([...savedIdeas, id]);
    }
  };
  
  const filteredIdeas = searchQuery 
    ? contentIdeas.filter(idea => 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        idea.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contentIdeas;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-black">Inspiration Vault</h1>
          <p className="text-neutral-medium mt-1">Discover trending content ideas for your LinkedIn posts</p>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/create-post'}
          className="bg-primary text-white"
        >
          Create New Post
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content - Main Inspiration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium" size={18} />
              <Input 
                placeholder="Search for ideas, topics, or formats..." 
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter size={16} />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Ideas</DropdownMenuItem>
                  <DropdownMenuItem>Saved Ideas</DropdownMenuItem>
                  <DropdownMenuItem>Text Posts</DropdownMenuItem>
                  <DropdownMenuItem>Carousels</DropdownMenuItem>
                  <DropdownMenuItem>Documents</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" className="flex items-center gap-1">
                <Sparkles size={16} className="text-amber-500" />
                AI Suggestions
              </Button>
            </div>
          </div>

          {/* Content Ideas Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="border border-gray-200 hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{idea.title}</h3>
                        {idea.trending && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            <Flame size={12} className="mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {idea.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {idea.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Engagement Score:</span>
                          <span className="text-xs font-medium text-green-600">{idea.engagementScore}/10</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {idea.prompt}
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSaveIdea(idea.id)}
                      className={`ml-4 ${savedIdeas.includes(idea.id) ? 'bg-primary text-white' : ''}`}
                    >
                      {savedIdeas.includes(idea.id) ? (
                        <BookmarkCheck size={16} />
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(idea.prompt);
                        // Add toast notification here if needed
                      }}
                    >
                      <Copy size={14} />
                      Copy Idea
                    </Button>
                    
                    <Button
                      size="sm"
                      className="gap-1 bg-primary hover:bg-primary/90"
                      onClick={() => window.location.href = `/create-post?idea=${encodeURIComponent(idea.prompt)}`}
                    >
                      <ArrowRight size={14} />
                      Use This Idea
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Coming Soon & Features */}
        <div className="space-y-6">
          {/* Coming Soon - AI Personalization */}
          <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg text-primary">AI Personalization</CardTitle>
              <CardDescription className="text-sm">
                Tailored content ideas coming soon
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Smart Suggestions</div>
                    <div className="text-xs text-gray-500">Based on your style</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Trend Analysis</div>
                    <div className="text-xs text-gray-500">Industry-specific ideas</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">Content Calendar</div>
                    <div className="text-xs text-gray-500">Scheduled ideas</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-primary/20">
                <div className="text-primary font-semibold text-lg mb-1">Coming Soon</div>
                <div className="text-xs text-gray-600">Intelligent content suggestions</div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Flame size={18} className="text-accent" />
                Trending Topics
              </CardTitle>
              <CardDescription>
                Popular themes in your industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer bg-neutral-lightest hover:bg-neutral-light py-1.5"
                    onClick={() => setSearchQuery(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-center bg-primary-50 border-primary-100 hover:bg-primary-100 text-primary gap-2"
              onClick={() => window.location.href = '/create-post'}
            >
              <PlusCircle size={16} />
              Create Custom Idea
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-center bg-secondary-50 border-secondary-100 hover:bg-secondary-100 text-secondary gap-2"
              onClick={() => {}}
            >
              <Sparkles size={16} />
              Get AI Suggestions
            </Button>
          </div>

          {/* Saved Ideas Count - Coming Soon */}
          <Card className="border-dashed border-gray-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookmarkCheck className="h-6 w-6 text-gray-400" />
              </div>
              <CardTitle className="text-base text-gray-600">Smart Collections</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Organize your saved ideas into smart collections
              </p>
              <div className="text-primary font-semibold">Coming Soon</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InspirationPage; 