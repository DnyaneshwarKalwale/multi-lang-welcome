import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Mic, Upload, Calendar, 
  Edit3, Eye, Clock, PlusCircle, Zap, Sparkles,
  Maximize2, MessageSquare, ThumbsUp, Share2,
  LogOut, User, Settings, ChevronDown, Users, Bell,
  Newspaper, BookOpen, LucideIcon, Lightbulb, FileText,
  Home, BookMarked, TrendingUp, UserCircle, ChevronRight,
  Layers, LayoutGrid, ArrowUp, CreditCard, Building, Loader2,
  AlertCircle, Linkedin
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandOutIcon } from "@/components/BrandOutIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CarouselPreview } from "@/components/CarouselPreview";
import axios from "axios";
import { toast } from "sonner";
import { useTheme } from '@/contexts/ThemeContext';
import { CloudinaryImage } from '@/utils/cloudinaryDirectUpload';

// Interface for LinkedIn profile data
interface LinkedInProfile {
  id: string;
  username: string;
  name: string;
  profileImage: string;
  bio: string;
  location: string;
  url: string;
  joinedDate: string;
  connections: number;
  followers: number;
  verified: boolean;
}

// Interface for LinkedIn post data
interface Post {
  id: string;
  text: string;
  created_at: string;
}

// Interface for a workspace
interface Workspace {
  id: string;
  name: string;
  type: 'personal' | 'team';
  owner: string;
  memberCount?: number;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, logout, token } = useAuth();
  
  // State for LinkedIn data
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [loading, setLoading] = useState({
    profile: false,
  });
  
  // Track shown toasts
  const [shownToasts, setShownToasts] = useState<string[]>([]);
  
  // Track if the user is connected via LinkedIn
  const [isLinkedInConnected, setIsLinkedInConnected] = useState<boolean>(
    user?.authMethod === 'linkedin' || !!user?.linkedinId || !!user?.linkedinConnected
  );
  
  // Generate a LinkedIn username based on user's name
  const [linkedInUsername, setLinkedInUsername] = useState<string>('');
  
  // Update LinkedIn connection status and username when user data changes
  useEffect(() => {
    setIsLinkedInConnected(
      user?.authMethod === 'linkedin' || !!user?.linkedinId || !!user?.linkedinConnected
    );
    
    if (user) {
      setLinkedInUsername(
        `${user.firstName.toLowerCase()}${user.lastName ? user.lastName.toLowerCase() : ''}`
      );
    }
  }, [user]);
  
  // State for workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '1',
      name: 'Personal Workspace',
      type: 'personal',
      owner: user?.email || '',
      createdAt: '2023-10-15'
    },
    {
      id: '2',
      name: 'Marketing Team',
      type: 'team',
      owner: 'marketing@example.com',
      memberCount: 5,
      createdAt: '2023-11-22'
    }
  ]);
  
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0]);

  // For displaying scheduled posts (empty since scheduled post functionality is removed)
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);

  // Weekly AI tip
  const [weeklyTip, setWeeklyTip] = useState({
    title: "Boost Your Engagement This Week",
    content: "When sharing achievements, focus on the lessons learned rather than the accolade itself. This approach creates more value for your audience and increases engagement."
  });

  // Load LinkedIn profile data from extension if available
  useEffect(() => {
    // Check if extension API is available
    if (window.linkedBoostExtension && window.linkedBoostExtension.getLinkedInData) {
      console.log('LinkedBoost extension detected, attempting to load LinkedIn data');
      
      window.linkedBoostExtension.getLinkedInData()
        .then((linkedInData: any) => {
          console.log('LinkedIn data loaded from extension:', linkedInData);
          
          // Update state with LinkedIn data from extension
          if (linkedInData.profile) {
            setLinkedInProfile(linkedInData.profile);
          }
        })
        .catch((error: Error) => {
          console.error('Failed to load LinkedIn data from extension:', error);
          // Will fall back to API fetch
        });
    }
    
    // Listen for LinkedIn data updates from extension
    document.addEventListener('linkedBoostDataUpdate', (e: any) => {
      console.log('Received LinkedIn data update from extension:', e.detail);
      
      // Update state with new LinkedIn data
      const linkedInData = e.detail;
      
      if (linkedInData.profile) {
        setLinkedInProfile(linkedInData.profile);
      }
    });
    
    return () => {
      // Clean up event listener
      document.removeEventListener('linkedBoostDataUpdate', () => {});
    };
  }, []);

  // Fetch LinkedIn data when component mounts and when user is authenticated
  useEffect(() => {
    if (user?.id && token) {
      fetchLinkedInData();
    }
  }, [user, token]);

  // Function to fetch LinkedIn data from our API
  const fetchLinkedInData = async () => {
    // Set loading states
    setLoading({
      profile: true,
    });
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    try {
      // Try to fetch basic LinkedIn profile first (doesn't rely on LinkedIn API tokens)
      console.log('Fetching basic LinkedIn profile data');
      const basicProfilePromise = axios.get(`${apiBaseUrl}/linkedin/basic-profile`, { headers });
      
      // Execute request
      const basicProfileRes = await basicProfilePromise;
      
      // Check if basic profile fetch was successful
      if (basicProfileRes.data) {
        console.log('Basic LinkedIn profile data fetched successfully');
        setLinkedInProfile(basicProfileRes.data.data);
        setLoading({ profile: false });
      }
    } catch (error) {
      console.error('Basic profile fetch failed, trying regular profile endpoint');
      
      try {
        // If basic profile failed, try the standard profile endpoint (with LinkedIn API)
        const profileRes = await axios.get(`${apiBaseUrl}/linkedin/profile`, { headers });
        console.log('Standard LinkedIn profile fetch result:', profileRes.data);
        setLinkedInProfile(profileRes.data.data);
        setLoading({ profile: false });
        
        // Show toast if using sample data
        if (profileRes.data.usingRealData === false) {
          console.warn('Using sample LinkedIn profile data:', profileRes.data.error);
          
          let errorMessage = 'Some LinkedIn data could not be fetched.';
          let errorDescription = profileRes.data.errorDetails || 'Try reconnecting your LinkedIn account.';
          
          // Only show token expiry messages, not permission errors which can be confusing
          if (profileRes.data.errorType === 'token_expired') {
          toast.warning(errorMessage, {
            description: errorDescription,
            duration: 5000
          });
          
          // Mark toast as shown
          setShownToasts(prev => [...prev, 'profile-warning']);
          }
        } else if (profileRes.data.usingRealData === true) {
          console.log('Using real LinkedIn profile data');
          toast.success('Successfully connected to LinkedIn', {
            description: 'Your profile data has been loaded.',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('All LinkedIn profile fetch methods failed:', error);
        setLoading({ profile: false });
        
        // Don't show error toasts for permission issues as they're expected now
        if (!error.response || error.response.status !== 403) {
          toast.error('Failed to load LinkedIn profile', {
            description: error.response?.data?.message || error.message || 'Unknown error',
              duration: 5000
            });
        }
      }
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserFullName = () => {
    if (!user) return 'User';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim();
  };

  // Function to handle LinkedIn connection
  const handleConnectLinkedIn = () => {
    // Get the backend URL from environment variable or fallback to Render deployed URL
    const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const baseUrl = baseApiUrl.replace('/api', '');
    
    // Store current URL in localStorage to redirect back after LinkedIn connection
    localStorage.setItem('redirectAfterAuth', '/dashboard');
    
    // Redirect to LinkedIn OAuth endpoint
    window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
  };

  return (
    <div className="w-full h-full bg-white">
      {/* Welcome message and workspace switch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-black">Welcome back, {user?.firstName || 'there'}!</h1>
          <p className="text-black">
            You're in <span className="font-medium">{currentWorkspace.name}</span> • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Building className="h-4 w-4" />
                Workspaces
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {workspaces.map(workspace => (
                <DropdownMenuItem 
                  key={workspace.id}
                  className={`flex items-center gap-2 ${workspace.id === currentWorkspace.id ? 'bg-primary/10' : ''}`}
                  onClick={() => setCurrentWorkspace(workspace)}
                >
                  {workspace.type === 'personal' ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <Users className="h-4 w-4 text-primary" />
                  )}
                  <span>{workspace.name}</span>
                  {workspace.type === 'team' && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      {workspace.memberCount} members
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-primary">
                <PlusCircle className="h-4 w-4" />
                <span>Create New Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
                <h3 className="text-2xl font-bold mt-1">12</h3>
              </div>
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-primary text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>16%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Engagement</p>
                <h3 className="text-2xl font-bold mt-1">4.8%</h3>
              </div>
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-primary text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>3.2%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Follower Growth</p>
                <h3 className="text-2xl font-bold mt-1">+47</h3>
              </div>
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-primary text-sm">
              <ArrowUp className="h-3 w-3" />
              <span>8.7%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Create Post & User Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start bg-primary/90 hover:bg-primary"
                onClick={() => navigate('/dashboard/post')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/dashboard/request-carousel')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Request Carousel
              </Button>
            
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/dashboard/scraper')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Scrape Content
              </Button>
            </CardContent>
          </Card>
          
          {/* Weekly AI Tip */}
          <Card className="from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <span>Weekly AI Tip</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-2">{weeklyTip.title}</h4>
              <p className="text-sm text-black dark:black">
                {weeklyTip.content}
              </p>
            </CardContent>
          </Card>

          {/* LinkedIn Connection Section - Show if no LinkedIn account is connected */}
          {(!isLinkedInConnected && !loading.profile) && (
            <Card className="overflow-hidden border-primary-100 dark:border-primary-900">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950/30 dark:to-primary-900/20 p-6">
                  <div className="flex-1 mb-4 md:mb-0 md:mr-6">
                    <h3 className="text-xl font-bold text-primary dark:text-primary-400 mb-2">
                      Connect Your LinkedIn Account
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Link your LinkedIn profile to view analytics, schedule posts, and boost your engagement with our AI-powered tools.
                    </p>
                    <Button 
                      onClick={handleConnectLinkedIn}
                      variant="default" 
                      size="lg"
                      className="bg-primary hover:bg-primary-600 text-white"
                    >
                      <Linkedin className="w-5 h-5 mr-2" />
                      Connect LinkedIn
                    </Button>
                  </div>
                  <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Linkedin className="w-24 h-24 md:w-32 md:h-32 text-primary/20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* User Profile Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {user?.authMethod === 'linkedin' ? 'LinkedIn Profile' : 'User Profile'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.profile ? (
                <div className="flex flex-col items-center justify-center py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mb-2" />
                  <p className="text-sm text-gray-500">Loading profile...</p>
                </div>
              ) : (
                <div className="space-y-4">
              <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      {user?.authMethod === 'linkedin' && linkedInProfile?.profileImage ? (
                        <AvatarImage src={linkedInProfile.profileImage} alt={linkedInProfile.name || user?.firstName} />
                      ) : user?.profilePicture ? (
                        <AvatarImage src={user.profilePicture} alt={getUserFullName()} />
                      ) : (
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {user?.authMethod === 'linkedin' && linkedInProfile?.name ? 
                          linkedInProfile.name : 
                          getUserFullName()}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {user?.authMethod === 'linkedin' ? (
                          <Linkedin className="h-3.5 w-3.5 text-primary" />
                  ) : user?.authMethod === 'google' ? (
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#0088FF" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#0088FF" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#0088FF" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#0088FF" />
                    </svg>
                  ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Login Method</span>
                        <span className="text-sm font-medium capitalize">{user?.authMethod || 'Email'}</span>
                      </div>
                    </div>
                    
                    {user?.authMethod === 'linkedin' && (
                      <>
                        <div className="flex items-center gap-2 mb-1 mt-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <UserCircle className="h-3.5 w-3.5 text-gray-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">LinkedIn Username</span>
                            <span className="text-sm font-medium">{linkedInProfile?.username || linkedInUsername || 'Not available'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="h-3.5 w-3.5 text-gray-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">LinkedIn ID</span>
                            <span className="text-sm font-medium truncate max-w-[200px]">{linkedInProfile?.id || user?.linkedinId || 'Not available'}</span>
                          </div>
                        </div>
                        
                        {linkedInProfile?.url && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Linkedin className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">LinkedIn Profile</span>
                              <a 
                                href={linkedInProfile.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary hover:underline"
                              >
                                View Profile
                              </a>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Middle & Right columns - Scheduled Posts & Content Creation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Creation Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Content Creation</CardTitle>
                <CardDescription>Create and publish LinkedIn content</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-gray-700">Quick Post</h3>
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    {user?.profilePicture || (linkedInProfile?.profileImage) ? (
                      <AvatarImage src={user?.profilePicture || linkedInProfile?.profileImage} alt={getUserFullName()} />
                    ) : (
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Share your thoughts on LinkedIn..."
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-between mt-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          <Upload className="h-4 w-4 mr-1" />
                          Add Image
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => navigate('/dashboard/post')}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Create Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3"
                  onClick={() => navigate('/dashboard/post')}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="flex items-center text-sm font-medium">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Text Post
                    </span>
                    <span className="text-xs text-gray-500 mt-1 ml-6">
                      Write a simple text post
                    </span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3"
                  onClick={() => navigate('/dashboard/request-carousel')}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="flex items-center text-sm font-medium">
                      <Layers className="h-4 w-4 mr-2" />
                      Create Carousel
                    </span>
                    <span className="text-xs text-gray-500 mt-1 ml-6">
                      Create slide deck posts
                    </span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Content Suggestions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Content Inspiration</CardTitle>
                <CardDescription>AI-powered content ideas</CardDescription>
                  </div>
                  <Button
                variant="ghost" 
                    size="sm"
                className="text-primary"
                onClick={() => navigate('/dashboard/templates')}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary-100 p-1 rounded">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </span>
                    <h3 className="text-sm font-medium">LinkedIn Success Story</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Share a professional challenge you overcame and what you learned from the experience.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/dashboard/post?template=success-story')}
                  >
                    Use Template
                  </Button>
                    </div>
                          
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-100 p-1 rounded">
                      <Lightbulb className="h-4 w-4 text-indigo-500" />
                    </span>
                    <h3 className="text-sm font-medium">Industry Insight</h3>
                            </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Share your perspective on a recent trend or news item in your industry.
                  </p>
                    <Button 
                      variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/dashboard/post?template=industry-insight')}
                    >
                    Use Template
                    </Button>
                  </div>
              </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
