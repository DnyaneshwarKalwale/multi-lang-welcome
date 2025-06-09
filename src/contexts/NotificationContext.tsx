import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Define the notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string | null;
  createdAt: string;
  timeAgo: string;
  imageUrl?: string; // Image URL for banner notifications
  organizationLogo?: string; // Organization logo URL
  organizationName?: string; // Organization or sender name
}

// Define pagination info
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Context value interface
interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

// Create context with a default empty value
const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
});

// Provider props
interface NotificationProviderProps {
  children: ReactNode;
}

// NotificationProvider component
export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  
  const { token, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Fetch notifications
  const fetchNotifications = async (page = 1, limit = 10) => {
    if (!isAuthenticated || !token) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/notifications?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setNotifications(response.data.data.notifications || []);
        setUnreadCount(response.data.data.unreadCount || 0);
        setPagination(response.data.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        });
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Mark notification as read
  const markAsRead = async (id: string) => {
    if (!isAuthenticated || !token) {
      return;
    }
    
    try {
      // Optimistically update the UI immediately
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      
      // Update the unread count optimistically
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Make the API call to persist the change
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.data.success) {
        // Rollback if the API call fails
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.id === id ? { ...notification, read: false } : notification
          )
        );
        
        // Rollback the unread count
        setUnreadCount(prev => prev + 1);
        
        throw new Error('Failed to mark notification as read');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notification as read",
      });
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!isAuthenticated || !token) {
      return;
    }
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        // Update the local state
        setNotifications(prevNotifications =>
          prevNotifications.map(notification => ({ ...notification, read: true }))
        );
        
        // Reset the unread count
        setUnreadCount(0);
        
        toast({
          variant: "default",
          title: "Success",
          description: "All notifications marked as read",
        });
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark all notifications as read",
      });
    }
  };
  
  // Delete notification
  const deleteNotification = async (id: string) => {
    if (!isAuthenticated || !token) {
      return;
    }
    
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        // Update the local state
        const deletedNotification = notifications.find(n => n.id === id);
        setNotifications(prevNotifications =>
          prevNotifications.filter(notification => notification.id !== id)
        );
        
        // Update the unread count if the deleted notification was unread
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        toast({
          variant: "default",
          title: "Success",
          description: "Notification deleted",
        });
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notification",
      });
    }
  };
  
  // Fetch notifications on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);
  
  // Refresh notifications every 5 minutes when the app is active
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      fetchNotifications(pagination.page, pagination.limit);
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [isAuthenticated, pagination.page, pagination.limit]);
  
  // Context value
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext; 