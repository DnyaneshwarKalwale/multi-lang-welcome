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
  Flame
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
          <p className="text-neutral-medium mt-1">Find and save content ideas for your LinkedIn posts</p>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/create-post'}
          className="bg-primary text-white"
        >
          Create New Post
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Content Ideas */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={20} />
            Content Ideas
          </h2>
          
          <div className="space-y-4">
            {filteredIdeas.map(idea => (
              <Card key={idea.id} className="overflow-hidden">
                <div className="flex items-start p-5">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="bg-primary-50 text-primary border-primary-100">
                        {idea.category}
                      </Badge>
                      <Badge variant="outline" className="bg-secondary-50 text-secondary border-secondary-100">
                        {idea.type}
                      </Badge>
                      {idea.trending && (
                        <Badge className="bg-accent text-white">
                          <Flame size={12} className="mr-1" /> 
                          Trending
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium mb-3">{idea.title}</h3>
                    <p className="text-neutral-medium text-sm mb-4">{idea.prompt}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-xs font-medium px-2 py-1 rounded-full bg-primary-50 text-primary">
                          <Sparkles size={12} className="mr-1" />
                          Engagement Score: {idea.engagementScore}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleSaveIdea(idea.id)}
                          className={savedIdeas.includes(idea.id) ? 'text-primary' : 'text-neutral-medium'}
                        >
                          {savedIdeas.includes(idea.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => window.location.href = '/create-post'}
                        >
                          Use Idea
                          <ArrowRight size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Right column - Sidebar */}
        <div className="md:col-span-1">
          {/* Saved Ideas section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookmarkCheck size={18} className="text-primary" />
                Saved Ideas
              </CardTitle>
              <CardDescription>
                Your bookmarked content ideas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedIdeas.length === 0 ? (
                <div className="text-center py-6 text-neutral-medium text-sm">
                  No saved ideas yet. Bookmark ideas to save them for later.
                </div>
              ) : (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {contentIdeas
                      .filter(idea => savedIdeas.includes(idea.id))
                      .map(idea => (
                        <div key={idea.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-neutral-lightest">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{idea.title}</h4>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                                {idea.type}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => toggleSaveIdea(idea.id)}
                          >
                            <BookmarkCheck size={16} className="text-primary" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.location.href = '/create-post'}
              >
                Create from Saved Idea
              </Button>
            </CardFooter>
          </Card>
          
          {/* Trending Topics section */}
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
          
          {/* Create custom idea */}
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full justify-center bg-primary-50 border-primary-100 hover:bg-primary-100 text-primary gap-2"
              onClick={() => window.location.href = '/create-post'}
            >
              <PlusCircle size={16} />
              Create Custom Idea
            </Button>
          </div>
          
          {/* Get AI suggestions */}
          <div className="mt-3">
            <Button 
              variant="outline" 
              className="w-full justify-center bg-secondary-50 border-secondary-100 hover:bg-secondary-100 text-secondary gap-2"
              onClick={() => {}}
            >
              <Sparkles size={16} />
              Get AI Topic Suggestions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationPage; 