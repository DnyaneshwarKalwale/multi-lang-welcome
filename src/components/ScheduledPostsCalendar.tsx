import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, FileText, Image, LayoutGrid, Calendar, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

// Interface for scheduled post
interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  scheduledTime: string;
  status: string;
  platform: string;
  mediaType?: string;
  visibility?: string;
}

const ScheduledPostsCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Get calendar data
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch scheduled posts when component mounts
  useEffect(() => {
    fetchScheduledPosts();
  }, [token]);

  // Fetch scheduled posts from API or localStorage
  const fetchScheduledPosts = async () => {
    setLoading(true);
    
    try {
      // Try to fetch from API if token exists
      if (token) {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
        const response = await fetch(`${apiBaseUrl}/posts?status=scheduled`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setScheduledPosts(data.data || []);
        } else {
          // If API call fails, fallback to localStorage
          fallbackToLocalStorage();
        }
      } else {
        // No token, use localStorage
        fallbackToLocalStorage();
      }
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      fallbackToLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fallback to get scheduled posts from localStorage
  const fallbackToLocalStorage = () => {
    // Get all localStorage items
    const localStorageItems = Object.keys(localStorage)
      .filter(key => !key.startsWith('state:')) // Exclude state items
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key) || '{}');
        } catch (e) {
          return null;
        }
      })
      .filter(item => item && item.status === 'scheduled');
      
    setScheduledPosts(localStorageItems);
  };

  // Get posts for a specific date
  const getPostsForDate = (date: number) => {
    const targetDate = new Date(currentYear, currentMonth, date);
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledTime);
      return postDate.getDate() === date && 
             postDate.getMonth() === currentMonth && 
             postDate.getFullYear() === currentYear;
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get media type icon
  const getMediaTypeIcon = (mediaType?: string) => {
    switch (mediaType) {
      case 'image':
        return <Image className="h-3 w-3" />;
      case 'carousel':
        return <LayoutGrid className="h-3 w-3" />;
      case 'document':
        return <FileText className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  // Create calendar grid
  const renderCalendarGrid = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 border border-gray-100 bg-gray-50/50 rounded-lg"></div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const postsForDay = getPostsForDate(day);
      const isToday = today.getDate() === day && 
                     today.getMonth() === currentMonth && 
                     today.getFullYear() === currentYear;
      const isHovered = hoveredDay === day;
      
      days.push(
        <motion.div 
          key={day} 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
          className={`min-h-[80px] max-h-[140px] border border-gray-200 p-2 bg-white hover:bg-gray-50 transition-all duration-200 rounded-lg cursor-pointer group relative overflow-hidden ${
            isToday ? 'ring-2 ring-primary/50 bg-primary/5' : ''
          } ${isHovered && postsForDay.length > 1 ? 'z-10 shadow-lg' : ''}`}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary' : 'text-gray-900'}`}>
            {day}
          </div>
          
          {/* Posts container with better overflow handling */}
          <div className="flex-1 space-y-1 overflow-hidden">
            {postsForDay.length > 0 ? (
              <>
                {/* Show posts - more when hovered */}
                {(isHovered ? postsForDay.slice(0, 3) : postsForDay.slice(0, 1)).map((post, index) => (
                  <div
                    key={post.id}
                    className="bg-gradient-to-r from-primary to-primary/80 text-white text-xs p-1.5 rounded-md cursor-pointer hover:from-primary/90 hover:to-primary/70 transition-all duration-200 transform hover:scale-105"
                    onClick={() => navigate('/dashboard/posts', { 
                      state: { activeTab: 'scheduled', highlightPost: post.id } 
                    })}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      {getMediaTypeIcon(post.mediaType)}
                      <span className="font-medium">
                        {new Date(post.scheduledTime).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                    </div>
                    <div className="truncate text-[10px] opacity-90">
                      {post.content.substring(0, isHovered ? 25 : 15)}...
                    </div>
                  </div>
                ))}
                
                {/* Show remaining count if not all posts are visible */}
                {postsForDay.length > (isHovered ? 3 : 1) && (
                  <div 
                    className="bg-primary/10 border border-primary/30 text-primary text-xs p-1.5 rounded-md cursor-pointer hover:bg-primary/20 transition-all duration-200 text-center font-semibold"
                    onClick={() => navigate('/dashboard/posts', { 
                      state: { activeTab: 'scheduled', filterDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` } 
                    })}
                  >
                    +{postsForDay.length - (isHovered ? 3 : 1)} more post{postsForDay.length - (isHovered ? 3 : 1) > 1 ? 's' : ''}
                  </div>
                )}
              </>
            ) : null}
          </div>
          
          {/* Post count indicator */}
          {postsForDay.length > 0 && (
            <div className="absolute top-1 right-1">
              <div className={`w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm transition-all duration-200 ${
                isHovered ? 'scale-110' : ''
              }`}>
                {postsForDay.length}
              </div>
            </div>
          )}
          
          {/* Hover tooltip for multiple posts */}
          {isHovered && postsForDay.length > 3 && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
              {postsForDay.length} posts scheduled
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
          
          {/* Hover effect for posts */}
          {postsForDay.length > 1 && (
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
          )}
        </motion.div>
      );
    }
    
    return days;
  };

  return (
    <Card className="border-primary/20 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Content Calendar
            </span>
          </CardTitle>
          <Button 
            size="sm" 
            className="gap-2 h-9 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => navigate('/dashboard/post', { 
              state: { openScheduleDialog: true }  
            })}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule Post</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday}
              className="text-xs h-8 border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              Today
            </Button>
            <Button 
              variant="outline"
              size="icon" 
              onClick={goToPreviousMonth}
              className="h-8 w-8 border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              size="icon" 
              onClick={goToNextMonth}
              className="h-8 w-8 border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-3">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2 border-b border-gray-200">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {renderCalendarGrid()}
        </div>

        {/* Stats and Legend */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/80"></div>
              <span className="text-gray-600 font-medium">Scheduled Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600">Click to view details</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{scheduledPosts.length}</div>
              <div className="text-xs text-gray-600">Total Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {scheduledPosts.filter(post => {
                  const postDate = new Date(post.scheduledTime);
                  return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
                }).length}
              </div>
              <div className="text-xs text-gray-600">This Month</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledPostsCalendar; 