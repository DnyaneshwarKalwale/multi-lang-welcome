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
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Collapsible Sidebar */}
      <CollapsibleSidebar />
      
      {/* Main content */}
      <div className="flex flex-col min-h-screen pl-[72px] md:pl-[240px] transition-all duration-300">
        {/* Main content header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
          <div className="flex flex-1 items-center justify-end gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-1"
              onClick={() => navigate('/content-generator')}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Post</span>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => navigate('/content-generator')}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <Bell className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 pr-1.5"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.profilePicture || ''} alt={getUserFullName()} />
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{getUserFullName()}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main content body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {/* Existing dashboard content... */}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
