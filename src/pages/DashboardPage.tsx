import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Mic, Upload, Calendar, BarChart3, Linkedin, 
  Edit3, Eye, Clock, PlusCircle, Zap, Sparkles,
  Maximize2, MessageSquare, ThumbsUp, Share2,
  LogOut, User, Settings, ChevronDown, Users, Bell,
  Newspaper, BookOpen, LucideIcon, Lightbulb, FileText,
  Home, BookMarked, TrendingUp, UserCircle, ChevronRight,
  Layers
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
import { LovableLogo } from "@/components/LovableLogo";
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
  public_metrics: {
    shares: number;
    comments: number;
    likes: number;
    impressions: number;
  };
}

// Interface for LinkedIn analytics data
interface LinkedInAnalytics {
  impressions: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  engagement: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  followers: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  summary: {
    totalImpressions: number;
    averageEngagement: number;
    followerGrowth: number;
    bestPerformingPost: {
      text: string;
      impressions: number;
      engagement: number;
    };
  };
}

// Navigation menu items
interface NavItem {
  title: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
  badge?: {
    text: string | number;
    variant: "default" | "outline" | "primary" | "secondary";
  }
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, logout, token } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  
  // State for LinkedIn data
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [analyticsData, setAnalyticsData] = useState<LinkedInAnalytics | null>(null);
  const [loading, setLoading] = useState({
    profile: false,
    posts: false,
    analytics: false
  });

  // Default fallback data
  const fallbackScheduledPosts = [
    {
      id: 1,
      content: "Just released our latest feature: AI-powered content suggestions! Create better LinkedIn content in half the time. #AI #ContentCreation",
      scheduledTime: "Today, 3:30 PM",
      isCarousel: false,
    },
    {
      id: 2,
      content: "5 ways to improve your LinkedIn engagement:\n\n1. Post consistently\n2. Use relevant hashtags\n3. Engage with your network\n4. Share valuable content\n5. Analyze your performance",
      scheduledTime: "Tomorrow, 10:00 AM",
      isCarousel: true,
      slideCount: 5,
    },
    {
      id: 3,
      content: "How our team increased LinkedIn engagement by 300% in just 30 days. The results might surprise you!",
      scheduledTime: "Apr 5, 1:15 PM",
      isCarousel: false,
    }
  ];
  
  const [scheduledPosts, setScheduledPosts] = useState(fallbackScheduledPosts);

  // Carousel slides for preview
  const carouselSlides = [
    {
      id: 'slide-1',
      content: '5 ways to improve your LinkedIn engagement'
    },
    {
      id: 'slide-2',
      content: '1. Post consistently at the right time'
    },
    {
      id: 'slide-3',
      content: '2. Use relevant hashtags strategically'
    },
    {
      id: 'slide-4',
      content: '3. Engage with your network regularly'
    },
    {
      id: 'slide-5',
      content: '4. Share valuable and actionable content'
    }
  ];

  // Load LinkedIn data from extension if available
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
          
          if (linkedInData.posts) {
            setRecentPosts(linkedInData.posts);
          }
          
          if (linkedInData.analytics) {
            setAnalyticsData(linkedInData.analytics);
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
      
      if (linkedInData.posts) {
        setRecentPosts(linkedInData.posts);
      }
      
      if (linkedInData.analytics) {
        setAnalyticsData(linkedInData.analytics);
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
      posts: true,
      analytics: true
    });
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    try {
      // Fetch LinkedIn profile
      const profilePromise = axios.get(`${apiBaseUrl}/linkedin/profile`, { headers });
      
      // Fetch recent posts
      const postsPromise = axios.get(`${apiBaseUrl}/linkedin/posts`, { headers });
      
      // Fetch analytics data
      const analyticsPromise = axios.get(`${apiBaseUrl}/linkedin/analytics`, { headers });
      
      // Execute all requests in parallel
      const [profileRes, postsRes, analyticsRes] = await Promise.allSettled([
        profilePromise, 
        postsPromise, 
        analyticsPromise
      ]);
      
      // Handle profile response
      if (profileRes.status === 'fulfilled') {
        setLinkedInProfile(profileRes.value.data.data);
        setLoading(prev => ({ ...prev, profile: false }));
      } else {
        console.error('Failed to fetch LinkedIn profile:', profileRes.reason);
        setLoading(prev => ({ ...prev, profile: false }));
      }
      
      // Handle posts response
      if (postsRes.status === 'fulfilled') {
        setRecentPosts(postsRes.value.data.data);
        setLoading(prev => ({ ...prev, posts: false }));
      } else {
        console.error('Failed to fetch posts:', postsRes.reason);
        setLoading(prev => ({ ...prev, posts: false }));
      }
      
      // Handle analytics response
      if (analyticsRes.status === 'fulfilled') {
        setAnalyticsData(analyticsRes.value.data.data);
        setLoading(prev => ({ ...prev, analytics: false }));
      } else {
        console.error('Failed to fetch analytics:', analyticsRes.reason);
        setLoading(prev => ({ ...prev, analytics: false }));
      }
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
      setLoading({
        profile: false,
        posts: false,
        analytics: false
      });
      
      // Show error toast
      toast.error('Failed to load LinkedIn data');
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation sidebar items
  const navigationItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: activePage === 'dashboard'
    },
    {
      title: "Create Post",
      icon: PlusCircle,
      href: "/create-post",
      active: activePage === 'create-post'
    },
    {
      title: "Post Library",
      icon: BookOpen,
      href: "/post-library",
      active: activePage === 'post-library',
      badge: {
        text: 3,
        variant: "primary"
      }
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: activePage === 'analytics'
    },
    {
      title: "Inspiration",
      icon: Lightbulb,
      href: "/inspiration",
      active: activePage === 'inspiration'
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      active: activePage === 'settings'
    }
  ];

  // Render nav item
  const NavItem = ({ item }: { item: NavItem }) => (
    <Link
      to={item.href}
      className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors group ${
        item.active 
          ? 'bg-primary-50 text-primary' 
          : 'text-neutral-dark hover:bg-primary-50/50 hover:text-primary'
      }`}
    >
      <div className="flex items-center gap-3">
        <item.icon size={20} className={`transition-colors ${item.active ? 'text-primary' : 'text-neutral-medium group-hover:text-primary'}`} />
        <span className="font-medium">{item.title}</span>
      </div>
      
      {item.badge && (
        <Badge 
          variant={item.badge.variant === 'primary' ? 'default' : 'outline'} 
          className={`${
            item.badge.variant === 'primary' 
              ? 'bg-primary text-white' 
              : 'bg-primary-50 text-primary border-primary-100'
          }`}
        >
          {item.badge.text}
        </Badge>
      )}
    </Link>
  );

  // Add a toggleMenu function to the component
  const toggleMenu = () => {
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    if (mobileDrawer) {
      mobileDrawer.classList.toggle('opacity-100');
      mobileDrawer.classList.toggle('pointer-events-auto');
      const sidebar = mobileDrawer.querySelector('div');
      if (sidebar) {
        sidebar.classList.toggle('translate-x-0');
      }
    }
  };

  // Set active page based on current URL
  useEffect(() => {
    const path = location.pathname;
    
    // Convert path to page name
    if (path === '/dashboard') {
      setActivePage('dashboard');
    } else if (path === '/create-post') {
      setActivePage('create-post');
    } else if (path === '/post-library') {
      setActivePage('post-library');
    } else if (path === '/analytics') {
      setActivePage('analytics');
    } else if (path === '/inspiration') {
      setActivePage('inspiration');
    } else if (path === '/settings') {
      setActivePage('settings');
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-neutral-lightest">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-neutral-light bg-white">
        <div className="p-6">
          <LovableLogo variant="full" size="md" />
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1 py-2">
            {navigationItems.map((item, i) => (
              <NavItem key={i} item={item} />
            ))}
          </nav>
          
          <div className="mt-6 pt-6 border-t border-neutral-light">
            <div className="px-3 mb-2 text-xs font-medium text-neutral-medium">
              ACCOUNT
            </div>
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 rounded-md text-neutral-dark hover:bg-primary-50/50 hover:text-primary transition-colors"
            >
              <UserCircle size={20} className="text-neutral-medium mr-3" />
              <span className="font-medium">Your Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 rounded-md text-neutral-dark hover:bg-primary-50/50 hover:text-primary transition-colors"
            >
              <LogOut size={20} className="text-neutral-medium mr-3" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </ScrollArea>
        
        {/* Profile section */}
        <div className="p-4 border-t border-neutral-light bg-neutral-lightest mt-auto">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3 border">
              <AvatarImage src={user?.profilePicture || ''} />
              <AvatarFallback className="bg-primary-50 text-primary">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-dark truncate">
                {getUserFullName()}
              </p>
              <p className="text-xs text-neutral-medium truncate">
                {user?.email || ''}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="ml-1 text-neutral-medium hover:text-primary">
              <Settings size={18} />
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header - only visible on smaller screens */}
        <div className="md:hidden flex items-center justify-between border-b border-neutral-light p-4 bg-white sticky top-0 z-10">
          <LovableLogo variant="full" size="sm" />
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-neutral-medium"
              data-menu-toggle
              onClick={toggleMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
            
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={user?.profilePicture || ''} />
              <AvatarFallback className="bg-primary-50 text-primary">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        {/* Mobile sidebar drawer - hidden by default */}
        <div 
          id="mobile-menu-drawer" 
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-200 opacity-0 pointer-events-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              document.getElementById('mobile-menu-drawer')?.classList.remove('translate-x-0', 'opacity-100', 'pointer-events-auto');
            }
          }}
        >
          <div 
            className="w-3/4 max-w-xs bg-white h-full overflow-auto transition-transform duration-300 -translate-x-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-light">
              <LovableLogo variant="full" size="md" />
            </div>
            
            <nav className="p-2">
              {navigationItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.href}
                  className={`flex items-center justify-between p-3 rounded-md mb-1 transition-colors ${
                    item.active 
                      ? 'bg-primary-50 text-primary' 
                      : 'text-neutral-dark hover:bg-neutral-lightest'
                  }`}
                  onClick={toggleMenu}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={item.active ? 'text-primary' : 'text-neutral-medium'} />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  
                  {item.badge && (
                    <Badge 
                      variant={item.badge.variant === 'primary' ? 'default' : 'outline'} 
                      className={`${
                        item.badge.variant === 'primary' 
                          ? 'bg-primary text-white' 
                          : 'bg-primary-50 text-primary border-primary-100'
                      }`}
                    >
                      {item.badge.text}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-neutral-light p-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-md text-neutral-dark hover:bg-neutral-lightest"
              >
                <LogOut size={20} className="text-neutral-medium mr-3" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Welcome section */}
            <section className="bg-gradient-to-r from-primary-50 to-primary-100/30 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-black">
                    Welcome to Lovable, {user?.firstName || 'User'}! 👋
                  </h1>
                  <p className="mt-2 text-neutral-dark max-w-lg">
                    Your LinkedIn content creation platform. Create impactful content, analyze performance, and grow your professional presence.
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <Button 
                    onClick={() => navigate('/create-post')}
                    className="bg-primary hover:bg-primary-600 text-white"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Create New Post
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Quick stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-medium">Impressions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading.analytics ? (
                      <div className="h-8 w-24 bg-neutral-light/30 animate-pulse rounded"></div>
                    ) : (
                      analyticsData?.summary.totalImpressions.toLocaleString() || '0'
                    )}
                  </div>
                  <p className="text-xs text-neutral-medium mt-1">Last 30 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-medium">Engagement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading.analytics ? (
                      <div className="h-8 w-24 bg-neutral-light/30 animate-pulse rounded"></div>
                    ) : (
                      `${analyticsData?.summary.averageEngagement.toFixed(1) || '0'}%`
                    )}
                  </div>
                  <p className="text-xs text-neutral-medium mt-1">Avg per post</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-medium">Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading.profile ? (
                      <div className="h-8 w-24 bg-neutral-light/30 animate-pulse rounded"></div>
                    ) : (
                      linkedInProfile?.followers.toLocaleString() || '0'
                    )}
                  </div>
                  <p className="text-xs text-neutral-medium mt-1">
                    {analyticsData?.followers.increase ? `+${analyticsData.followers.increase}%` : ''} Last 30 days
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-medium">Next Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-primary">
                    {scheduledPosts[0]?.scheduledTime || 'No scheduled posts'}
                  </div>
                  <p className="text-xs text-neutral-medium mt-1">
                    {scheduledPosts.length} posts in queue
                  </p>
                </CardContent>
              </Card>
            </section>
            
            {/* Content sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create post section */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Quick Post</CardTitle>
                  <CardDescription>
                    Share your thoughts on LinkedIn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="What do you want to share with your network?"
                    className="min-h-[120px] mb-4"
                  />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Upload size={16} />
                      Media
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Mic size={16} />
                      Audio
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <FileText size={16} />
                      Document
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Sparkles size={16} />
                      AI Help
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePicture || ''} />
                        <AvatarFallback className="bg-primary-50 text-primary">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {getUserFullName()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Schedule</Button>
                      <Button>Post Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Scheduled posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Posts</CardTitle>
                  <CardDescription>
                    View your scheduled content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-4">
                      {scheduledPosts.map((post) => (
                        <div key={post.id} className="pb-4 border-b border-neutral-light last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                              {post.isCarousel ? (
                                <Layers size={20} />
                              ) : (
                                <FileText size={20} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm line-clamp-2">
                                {post.content}
                              </p>
                              <div className="flex items-center mt-2">
                                <Clock size={14} className="text-neutral-medium mr-1" />
                                <span className="text-xs text-neutral-medium">
                                  {post.scheduledTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/post-library')}
                  >
                    View All Posts
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Featured section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Analytics preview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Your LinkedIn engagement at a glance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-neutral-lightest rounded-md text-neutral-medium">
                    Analytics Chart Preview
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">87%</div>
                      <p className="text-xs text-neutral-medium">Post Reach</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">12.4%</div>
                      <p className="text-xs text-neutral-medium">Engagement</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">436</div>
                      <p className="text-xs text-neutral-medium">Profile Views</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">18</div>
                      <p className="text-xs text-neutral-medium">New Followers</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/analytics')}
                  >
                    View Full Analytics
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Carousel preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Carousel Preview</CardTitle>
                  <CardDescription>
                    Your latest carousel post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarouselPreview 
                    slides={carouselSlides}
                    variant="basic"
                  />
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/create-post')}
                  >
                    Create Carousel
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
