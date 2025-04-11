import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Download, Eye, Clock, Filter, PlusCircle,
  Check, AlertCircle, FileDown, Calendar, ChevronDown, 
  Search, SlidersHorizontal, Users, Building
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Carousel request interface
interface CarouselRequest {
  id: string;
  title: string;
  status: 'in_progress' | 'delivered';
  thumbnailUrl?: string;
  requestDate: Date;
  deliveryDate?: Date;
  slideCount: number;
  downloadUrl?: string;
  workspace: string;
}

// Workspace interface
interface Workspace {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'member';
  memberCount: number;
}

const MyCarouselsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  // Mock data for workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'personal',
      name: 'Personal Workspace',
      role: 'owner',
      memberCount: 1
    },
    {
      id: 'marketing-team',
      name: 'Marketing Team',
      avatarUrl: '/team-avatars/marketing.png',
      role: 'admin',
      memberCount: 8
    },
    {
      id: 'product-team',
      name: 'Product Team',
      avatarUrl: '/team-avatars/product.png',
      role: 'member',
      memberCount: 12
    }
  ]);

  // Mock data for carousel requests
  const [carouselRequests, setCarouselRequests] = useState<CarouselRequest[]>([
    {
      id: 'cr-001',
      title: '5 Ways to Boost Team Productivity',
      status: 'delivered',
      thumbnailUrl: '/carousel-thumbnails/productivity.png',
      requestDate: new Date('2023-10-15T10:30:00'),
      deliveryDate: new Date('2023-10-16T14:45:00'),
      slideCount: 8,
      downloadUrl: '/files/productivity-carousel.pdf',
      workspace: 'personal'
    },
    {
      id: 'cr-002',
      title: 'How We Increased Conversion by 37%',
      status: 'delivered',
      thumbnailUrl: '/carousel-thumbnails/conversion.png',
      requestDate: new Date('2023-11-03T15:20:00'),
      deliveryDate: new Date('2023-11-04T11:10:00'),
      slideCount: 10,
      downloadUrl: '/files/conversion-carousel.pdf',
      workspace: 'marketing-team'
    },
    {
      id: 'cr-003',
      title: 'The Future of Remote Work',
      status: 'in_progress',
      requestDate: new Date('2023-11-27T09:15:00'),
      slideCount: 7,
      workspace: 'marketing-team'
    },
    {
      id: 'cr-004',
      title: 'Product Roadmap 2024',
      status: 'delivered',
      thumbnailUrl: '/carousel-thumbnails/roadmap.png',
      requestDate: new Date('2023-12-05T14:20:00'),
      deliveryDate: new Date('2023-12-06T16:30:00'),
      slideCount: 12,
      downloadUrl: '/files/roadmap-carousel.pdf',
      workspace: 'product-team'
    },
    {
      id: 'cr-005',
      title: 'User Research Findings',
      status: 'in_progress',
      requestDate: new Date('2023-12-10T11:45:00'),
      slideCount: 9,
      workspace: 'product-team'
    }
  ]);

  // Download handler
  const handleDownload = (carousel: CarouselRequest) => {
    if (carousel.downloadUrl) {
      // In a real app, trigger actual download
      window.open(carousel.downloadUrl, '_blank');
      toast.success('Carousel download started');
    }
  };

  // Filter carousels based on search query, status filter and workspace
  const filteredCarousels = carouselRequests.filter(carousel => {
    const matchesSearch = carousel.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || carousel.status === statusFilter;
    const matchesWorkspace = !selectedWorkspace || carousel.workspace === selectedWorkspace;
    return matchesSearch && matchesStatus && matchesWorkspace;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold mb-1">My Carousels</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            View and manage your LinkedIn carousel designs across workspaces
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/dashboard/request-carousel')}
          className="gap-2 h-9 sm:h-10 text-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Request New Carousel
        </Button>
      </div>
      
      {/* Workspace selection */}
      <div className="mb-5">
        <h3 className="text-xs font-medium mb-2 text-gray-500 flex items-center gap-2">
          <Building className="h-4 w-4" />
          Select Workspace
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <Card 
            className={`cursor-pointer hover:border-purple-300 transition-colors ${
              !selectedWorkspace ? 'border-purple-600 ring-1 ring-purple-600' : ''
            }`}
            onClick={() => setSelectedWorkspace(null)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">All Workspaces</p>
                <p className="text-xs text-gray-500">{carouselRequests.length} carousels</p>
              </div>
            </CardContent>
          </Card>
          
          {workspaces.map(workspace => (
            <Card 
              key={workspace.id}
              className={`cursor-pointer hover:border-purple-300 transition-colors ${
                selectedWorkspace === workspace.id ? 'border-purple-600 ring-1 ring-purple-600' : ''
              }`}
              onClick={() => setSelectedWorkspace(workspace.id)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  {workspace.avatarUrl ? (
                    <AvatarImage src={workspace.avatarUrl} alt={workspace.name} />
                  ) : (
                    <AvatarFallback className="bg-purple-50 text-purple-600 text-xs">
                      {workspace.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{workspace.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {carouselRequests.filter(c => c.workspace === workspace.id).length} carousels
                    {' • '}
                    <span className="capitalize">{workspace.role}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search carousels..." 
            className="pl-10 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select 
          value={statusFilter || 'all'} 
          onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="All statuses" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 ml-auto hidden sm:flex h-9 text-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Sort by
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Newest first</DropdownMenuItem>
            <DropdownMenuItem>Oldest first</DropdownMenuItem>
            <DropdownMenuItem>Alphabetical (A-Z)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Card>
          <CardContent className="pt-4 px-3 pb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Total Carousels</p>
                <p className="text-xl font-bold mt-1">
                  {filteredCarousels.length}
                </p>
              </div>
              <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                <LayoutGrid className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 px-3 pb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Delivered</p>
                <p className="text-xl font-bold mt-1">
                  {filteredCarousels.filter(c => c.status === 'delivered').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 px-3 pb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">In Progress</p>
                <p className="text-xl font-bold mt-1">
                  {filteredCarousels.filter(c => c.status === 'in_progress').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Carousels list */}
      {filteredCarousels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCarousels.map(carousel => (
            <Card key={carousel.id} className="overflow-hidden flex flex-col h-full">
              <div className="h-40 sm:h-48 bg-gray-100 relative">
                {carousel.thumbnailUrl ? (
                  <img 
                    src={carousel.thumbnailUrl} 
                    alt={carousel.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <LayoutGrid className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                
                <Badge 
                  className={`absolute top-2 right-2 text-xs ${
                    carousel.status === 'delivered' 
                      ? 'bg-green-500' 
                      : 'bg-blue-500'
                  }`}
                >
                  {carousel.status === 'delivered' ? 'Delivered' : 'In Progress'}
                </Badge>
                
                {/* Show workspace badge */}
                {workspaces.map(workspace => {
                  if (workspace.id === carousel.workspace) {
                    return (
                      <div key={workspace.id} className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium shadow-sm">
                        <Avatar className="w-3 h-3">
                          {workspace.avatarUrl ? (
                            <AvatarImage src={workspace.avatarUrl} alt={workspace.name} />
                          ) : (
                            <AvatarFallback className="bg-purple-50 text-purple-600 text-[6px]">
                              {workspace.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="truncate max-w-[80px]">{workspace.name}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="line-clamp-1 text-base">{carousel.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  Requested: {format(carousel.requestDate, 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-3 px-3 flex-grow">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                    <LayoutGrid className="h-3 w-3" />
                    <span>{carousel.slideCount} slides</span>
                  </div>
                  
                  {carousel.deliveryDate && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{format(carousel.deliveryDate, 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-gray-100 pt-3 px-3 mt-auto">
                {carousel.status === 'delivered' ? (
                  <div className="flex justify-between w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 h-8 text-xs"
                      onClick={() => {/* Preview handler */}}
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                    
                    <Button 
                      size="sm" 
                      className="gap-1 h-8 text-xs"
                      onClick={() => handleDownload(carousel)}
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="w-full text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3 text-blue-500" />
                    Expected delivery by {format(new Date(carousel.requestDate.getTime() + 24 * 60 * 60 * 1000), 'MMM d, h:mm a')}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
            <AlertCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium mb-2">No carousels found</h3>
          <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
            {(searchQuery || statusFilter || selectedWorkspace)
              ? "No carousels match your current filters. Try adjusting your search criteria."
              : "You haven't requested any carousels yet. Create your first carousel request to get started."}
          </p>
          <Button 
            onClick={() => navigate('/dashboard/request-carousel')}
            className="gap-2 text-sm h-9"
          >
            <PlusCircle className="h-4 w-4" />
            Request New Carousel
          </Button>
        </div>
      )}
      
      {/* Subscription info */}
      <div className="mt-8 bg-primary-50 border border-primary-100 rounded-lg p-3 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <FileDown className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-medium mb-1 text-sm">Carousel Credits</h3>
          <p className="text-xs text-gray-700 mb-2">
            You have 2 carousel requests remaining this month. Your credits will reset on {format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), 'MMMM d, yyyy')}.
          </p>
          <Button variant="link" className="h-auto p-0 text-primary text-xs" onClick={() => navigate('/dashboard/billing')}>
            Upgrade Plan →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyCarouselsPage; 