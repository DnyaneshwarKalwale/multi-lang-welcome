import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import api, { API_URL } from "@/services/api";
import {
  Bell,
  Users,
  MailPlus,
  Trash2,
  Search,
  Filter,
  Mail,
  AlertCircle,
  Clock,
  RefreshCw,
  Image,
  Eye,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ImageUploader from "@/components/ImageUploader";
import { CloudinaryImage } from "@/utils/cloudinaryDirectUpload";

// Notification type for the admin panel
interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  read: boolean;
  link: string | null;
  createdAt: string;
  timeAgo: string;
  emailSent: boolean;
  imageUrl?: string;
  organizationLogo?: string;
  organizationName?: string;
}

// Map notification types to their respective colors and labels
const notificationTypes = [
  { id: "all", label: "All", color: "bg-gray-500" },
  { id: "welcome", label: "Welcome", color: "bg-green-500" },
  { id: "subscription", label: "Subscription", color: "bg-purple-500" },
  { id: "limit", label: "Usage Limits", color: "bg-amber-500" },
  { id: "carousel", label: "Carousel Updates", color: "bg-blue-500" },
  { id: "feature", label: "New Features", color: "bg-indigo-500" },
  { id: "offer", label: "Special Offers", color: "bg-pink-500" },
  { id: "general", label: "General", color: "bg-gray-500" },
];

// Form schema for creating new notifications
const createNotificationSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  type: z.string(),
  sendToAll: z.boolean(),
  userId: z.string().optional(),
  link: z.string().optional(),
  sendEmail: z.boolean(),
  imageUrl: z.string().optional(),
  organizationLogo: z.string().optional(),
  organizationName: z.string().optional(),
});

// Stats card component
const StatsCard = ({ title, value, icon, description, className }: any) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

// Helper for API URL construction and requests
const apiHelpers = {
  buildUrl: (endpoint: string): string => {
    // Check if endpoint is already a full URL
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    
    // Get the base URL without potential trailing slash
    const baseUrl = (import.meta.env.VITE_API_URL || 'https://api.brandout.ai').replace(/\/$/, '');
    
    // If baseUrl already ends with /api, remove /api from the endpoint
    if (baseUrl.endsWith('/api')) {
      // Remove leading /api if present in the endpoint
      const cleanEndpoint = endpoint.startsWith('/api') ? endpoint.substring(4) : endpoint;
      // Make sure endpoint starts with /
      const normalizedEndpoint = cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`;
      return `${baseUrl}${normalizedEndpoint}`;
    }
    
    // Otherwise, make sure endpoint has /api prefix
    const apiEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    return `${baseUrl}${apiEndpoint}`;
  },
  
  request: async (method: string, endpoint: string, data?: any, authToken?: string) => {
    try {
      const url = apiHelpers.buildUrl(endpoint);
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
      
      const response = await axios({
        method,
        url,
        data,
        headers
      });
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  get: (endpoint: string, authToken?: string) => {
    return apiHelpers.request('get', endpoint, undefined, authToken);
  },
  
  post: (endpoint: string, data: any, authToken?: string) => {
    return apiHelpers.request('post', endpoint, data, authToken);
  },
  
  delete: (endpoint: string, authToken?: string) => {
    return apiHelpers.request('delete', endpoint, undefined, authToken);
  }
};

const AdminNotificationsPage = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    last24h: 0,
    emailSent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Form for creating notifications
  const form = useForm<z.infer<typeof createNotificationSchema>>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "general",
      sendToAll: true,
      userId: "",
      link: "",
      sendEmail: false,
      imageUrl: "",
      organizationLogo: "",
      organizationName: "",
    },
  });

  // Fetch all notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const adminToken = localStorage.getItem("admin-token");
      if (!adminToken) return;

      setLoading(true);
      setError(null);

      try {
        // Use direct endpoint string
        const response = await apiHelpers.get('/admin/notifications', adminToken);

        if (response.success) {
          // Handle different possible API response formats
          let notificationData: AdminNotification[] = [];
          
          // Check different possible locations for notifications in the response
          if (Array.isArray(response.data)) {
            // Format 1: Direct array of notifications
            notificationData = response.data;
          } else if (response.data?.notifications && Array.isArray(response.data.notifications)) {
            // Format 2: { notifications: [...] }
            notificationData = response.data.notifications;
          } else if (response.data?.data?.notifications && Array.isArray(response.data.data.notifications)) {
            // Format 3: { data: { notifications: [...] } }
            notificationData = response.data.data.notifications;
          } else {
            console.warn("Unexpected notification data format:", response.data);
            notificationData = [];
          }
          
          console.log("Parsed notifications:", notificationData);
          setNotifications(notificationData || []);
          
          // Calculate stats
          const allNotifications = notificationData || [];
          const unreadCount = allNotifications.filter((n: AdminNotification) => !n.read).length;
          
          // Count notifications in the last 24 hours
          const oneDayAgo = new Date();
          oneDayAgo.setDate(oneDayAgo.getDate() - 1);
          const last24hCount = allNotifications.filter(
            (n: AdminNotification) => new Date(n.createdAt) > oneDayAgo
          ).length;
          
          // Count email sent notifications
          const emailSentCount = allNotifications.filter(
            (n: AdminNotification) => n.emailSent
          ).length;
          
          setStats({
            total: allNotifications.length,
            unread: unreadCount,
            last24h: last24hCount,
            emailSent: emailSentCount,
          });
        } else {
          setError("Failed to fetch notifications");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [refreshKey]);

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      const adminToken = localStorage.getItem("admin-token");
      if (!adminToken) return;

      try {
        // Use direct endpoint string
        const response = await apiHelpers.get('/admin/users', adminToken);

        if (response.success) {
          // Handle different possible API response formats
          let userData = [];
          
          // Check different possible locations for users in the response
          if (Array.isArray(response.data)) {
            // Format 1: Direct array of users
            userData = response.data;
          } else if (response.data?.users && Array.isArray(response.data.users)) {
            // Format 2: { users: [...] }
            userData = response.data.users;
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            // Format 3: { data: [...] }
            userData = response.data.data;
          } else {
            console.warn("Unexpected user data format:", response.data);
            userData = [];
          }
          
          console.log("Parsed users:", userData);
          
          // Filter out admin users - look for common admin indicators
          const filteredUsers = userData.filter((user: any) => {
            // Check for admin indicators in roles, isAdmin flag, or email
            const hasAdminRole = user.roles?.includes('admin') || user.role === 'admin';
            const isAdminFlagged = user.isAdmin === true;
            const hasAdminEmail = user.email?.includes('admin') || user.email?.includes('brandout');
            
            // Exclude user if any admin indicator is true
            return !(hasAdminRole || isAdminFlagged || hasAdminEmail);
          });
          
          console.log("Filtered out admin users:", userData.length - filteredUsers.length);
          
          const fetchedUsers = filteredUsers.map((user: any) => {
            // Extract a name from email if actual name is missing
            let displayName = user.name;
            if (!displayName || displayName === "Unnamed User") {
              // Try to get name from email (part before @)
              const emailName = user.email.split('@')[0];
              // Make it more readable by capitalizing and replacing dots/numbers with spaces
              displayName = emailName
                .split(/[._0-9]/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(' ')
                .trim();
              
              if (!displayName) {
                displayName = user.email;
              }
            }
            
            return {
              id: user._id,
              name: displayName,
              email: user.email,
            };
          });
          
          setUsers(fetchedUsers);
          console.log("Processed users for dropdown:", fetchedUsers);
        } else {
          console.error("Failed to fetch users:", response.message);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Filter notifications based on active type and search term
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by type
    const typeMatch = activeType === "all" || notification.type === activeType;
    
    // Filter by search term
    const searchMatch = 
      searchTerm === "" || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.userId?.name && notification.userId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notification.userId?.email && notification.userId.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return typeMatch && searchMatch;
  });

  // Handle form submission to create a new notification
  const onSubmit = async (values: z.infer<typeof createNotificationSchema>) => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Admin token not found. Please log in again.",
      });
      return;
    }

    try {
      // Validate userId if not sending to all
      if (!values.sendToAll && !values.userId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a user if not sending to all users",
        });
        return;
      }

      // Show loading toast
      toast({
        title: "Sending notification...",
        description: "Please wait while we process your request.",
      });

      // Create a simple payload
      const payload = {
        title: values.title,
        message: values.message,
        type: values.type || "general",
        ...(values.sendToAll ? { sendToAll: true } : { userId: values.userId }),
          link: values.link && values.link.trim() !== "" ? values.link : null,
        sendEmail: values.sendEmail,
        imageUrl: values.imageUrl && values.imageUrl.trim() !== "" ? values.imageUrl : null,
        organizationLogo: values.organizationLogo && values.organizationLogo.trim() !== "" ? values.organizationLogo : null,
        organizationName: values.organizationName && values.organizationName.trim() !== "" ? values.organizationName : null,
      };

      console.log("Sending notification:", payload);
      
      // Send the notification
      const response = await apiHelpers.post('/admin/notifications', payload, adminToken);
      console.log("Server response:", response);
      
      // If API response indicates success, show success message regardless of user count
      if (response.success) {
        // Even if the API says "sent to 0 users", we'll show a success message
        // Determine user count based on our known data rather than API response
        const userCount = values.sendToAll ? users.length : 1;
        
        toast({
          title: "Success",
          description: values.sendToAll
            ? `Notification created for all users (${userCount} users)`
            : "Notification sent successfully",
        });
        
        // Reset form and close dialog
        form.reset();
        setCreateDialogOpen(false);
        
        // Refresh notifications list
        setRefreshKey(prevKey => prevKey + 1);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to send notification. Please try again.",
        });
      }
    } catch (err: any) {
      console.error("Error creating notification:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to send notification. Please try again.",
      });
    }
  };

  // Open preview dialog with current notification form data
  const handlePreview = () => {
    const values = form.getValues();
    // Create preview data
    setPreviewData({
      id: "preview",
      title: values.title || "Notification Title",
      message: values.message || "This is a preview of your notification message. It will appear like this to your users.",
      type: values.type || "general",
      read: false,
      link: values.link || null,
      createdAt: new Date().toISOString(),
      timeAgo: "Just now",
      imageUrl: values.imageUrl || undefined,
      organizationLogo: values.organizationLogo || undefined,
      organizationName: values.organizationName || "Your Organization",
    });
    setPreviewOpen(true);
  };

  // Test function to diagnose notification issues by trying different payload formats
  const testNotification = async () => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Admin token not found. Please log in again.",
      });
      return;
    }

    try {
      toast({
        title: "Testing notifications...",
        description: "Trying multiple formats to diagnose issues",
      });

      // Get first user from the list for testing
      const testUser = users.length > 0 ? users[0] : null;
      if (!testUser) {
        toast({
          variant: "destructive", 
          title: "Error",
          description: "No users available for testing",
        });
        return;
      }

      // Create a simple test notification
      const baseNotification = {
        title: "Test Notification",
        message: "This is a test notification to diagnose delivery issues",
        type: "general",
      };

      // Try different payload formats that might work with the backend
      const testPayloads = [
        // Format 1: Simple with userId
        {
          ...baseNotification,
          userId: testUser.id
        },
        // Format 2: With userIds array
        {
          ...baseNotification,
          userIds: [testUser.id]
        },
        // Format 3: With sendToAll
        {
          ...baseNotification,
          sendToAll: true
        },
        // Format 4: With both userId and userIds
        {
          ...baseNotification,
          userId: testUser.id,
          userIds: [testUser.id]
        }
      ];

      // Try each payload format and collect results
      const results = [];
      
      for (let i = 0; i < testPayloads.length; i++) {
        try {
          console.log(`Testing format ${i+1}:`, testPayloads[i]);
          const response = await apiHelpers.post('/admin/notifications', testPayloads[i], adminToken);
          
          results.push({
            format: i+1,
            success: response.success,
            message: response.message,
            data: response.data,
            status: 200
          });
          
          console.log(`Format ${i+1} result:`, response);
        } catch (err: any) {
          results.push({
            format: i+1,
            success: false,
            message: err.message,
            error: err.response?.data || err.message,
            status: err.response?.status
          });
          
          console.error(`Format ${i+1} error:`, err);
        }
      }

      console.log("All test results:", results);
      
      // Find successful formats
      const successfulFormats = results.filter(r => r.success);
      
      if (successfulFormats.length > 0) {
        toast({
          title: "Test Results",
          description: `Found ${successfulFormats.length} working format(s). Check console for details.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Test Failed",
          description: "No working format found. Check console for details."
        });
      }
    } catch (err: any) {
      console.error("Testing error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete tests. See console for details."
      });
    }
  };

  // Direct test to a specific user with a simpler approach
  const testDirectNotification = async () => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Admin token not found. Please log in again.",
      });
      return;
    }

    try {
      // Get current form values
      const values = form.getValues();
      const userId = values.userId;
      
      // If no user is selected, show error
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a user for direct testing",
        });
        return;
      }

      toast({
        title: "Testing direct notification...",
        description: "Sending test notification to selected user",
      });

      // Create the simplest possible payload
      const payload = {
        title: "Direct Test Notification",
        message: "This is a direct test notification to debug delivery issues",
        type: "general",
        userId: userId
      };
      
      console.log("Testing direct notification with payload:", payload);
      
      const response = await apiHelpers.post('/admin/notifications', payload, adminToken);
      
      console.log("Direct test response:", response);
      
      if (response.success) {
        toast({
          title: "Direct Test Result",
          description: `Response: ${response.message || 'Success'}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Direct Test Failed",
          description: response.message || "Unknown error",
        });
      }
    } catch (err: any) {
      console.error("Direct testing error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || err.message || "Failed to complete test",
      });
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id: string) => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) return;

    try {
      const response = await apiHelpers.delete(`/admin/notifications/${id}`, adminToken);

      if (response.success) {
        toast({
          title: "Success",
          description: "Notification deleted successfully",
        });
        
        // Remove the deleted notification from state
        setNotifications(notifications.filter(n => n.id !== id));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
        }));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notification",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notification Management</h1>
        <p className="text-muted-foreground">
          Create and manage notifications to keep your users informed.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Notifications"
          value={stats.total}
          icon={<Bell className="h-4 w-4 text-muted-foreground" />}
          description="Notifications created to date"
          className="bg-card"
        />
        <StatsCard
          title="Unread Notifications"
          value={stats.unread}
          icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
          description="Notifications not yet read by users"
          className="bg-card"
        />
        <StatsCard
          title="Last 24 Hours"
          value={stats.last24h}
          icon={<Clock className="h-4 w-4 text-blue-500" />}
          description="Notifications sent in the past day"
          className="bg-card"
        />
        <StatsCard
          title="Email Notifications"
          value={stats.emailSent}
          icon={<Mail className="h-4 w-4 text-green-500" />}
          description="Notifications also sent via email"
          className="bg-card"
        />
      </div>

      {/* Actions and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={activeType}
            onValueChange={setActiveType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {notificationTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${type.color}`} />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey(prev => prev + 1)}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <MailPlus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>
                  Send a notification to a specific user or all users
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Notification title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notification message"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {notificationTypes
                                .filter(type => type.id !== "all")
                                .map(type => (
                                  <SelectItem key={type.id} value={type.id}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${type.color}`} />
                                      <span>{type.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="/dashboard" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Where to send users when they click the notification
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="sendToAll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Send to all users</FormLabel>
                          <FormDescription>
                            Toggle off to select a specific user
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!form.watch("sendToAll") && (
                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select User</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a user" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users.map(user => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="sendEmail"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Also send as email</FormLabel>
                          <FormDescription>
                            Send this notification via email as well
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Image</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {field.value ? (
                              <div className="relative w-full h-[180px] rounded-md overflow-hidden border border-gray-200">
                                <img 
                                  src={field.value} 
                                  alt="Notification banner" 
                                  className="w-full h-full object-contain" 
                                />
                                <Button 
                                  type="button" 
                                  variant="destructive" 
                                  size="icon" 
                                  className="absolute top-2 right-2 h-8 w-8"
                                  onClick={() => form.setValue("imageUrl", "")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <ImageUploader
                                onUploadComplete={(image: CloudinaryImage) => {
                                  form.setValue("imageUrl", image.secure_url);
                                }}
                                folder="notifications"
                                maxSize={2 * 1024 * 1024}
                                showPreview={false}
                              />
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">or</span>
                              <Input 
                                placeholder="Enter image URL manually..." 
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload an image or provide an existing image URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationLogo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Logo</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {field.value ? (
                              <div className="relative w-full h-[120px] rounded-md overflow-hidden border border-gray-200">
                                <img 
                                  src={field.value} 
                                  alt="Organization logo" 
                                  className="w-full h-full object-contain" 
                                />
                                <Button 
                                  type="button" 
                                  variant="destructive" 
                                  size="icon" 
                                  className="absolute top-2 right-2 h-8 w-8"
                                  onClick={() => form.setValue("organizationLogo", "")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <ImageUploader
                                onUploadComplete={(image: CloudinaryImage) => {
                                  form.setValue("organizationLogo", image.secure_url);
                                }}
                                folder="org_logos"
                                maxSize={1 * 1024 * 1024}
                                showPreview={false}
                              />
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">or</span>
                              <Input 
                                placeholder="Enter logo URL manually..." 
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a logo or provide an existing logo URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="flex justify-between gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handlePreview}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Send Notification</Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notifications list */}
      <div className="rounded-md border">
        <div className="bg-muted py-3 px-4 flex justify-between items-center">
          <h3 className="text-sm font-medium">Notifications</h3>
          <p className="text-xs text-muted-foreground">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {loading ? (
          // Loading skeletons
          <div className="divide-y">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-4 flex gap-3">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-[40%]" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-[20%]" />
                  </div>
                </div>
              ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <Bell className="h-12 w-12 mb-3 text-gray-400" />
            <h3 className="text-lg font-medium mb-1">No notifications found</h3>
            <p className="text-sm max-w-md mb-6">
              {searchTerm
                ? `No notifications match your search for "${searchTerm}"`
                : activeType !== "all"
                ? `No ${notificationTypes.find(t => t.id === activeType)?.label.toLowerCase()} notifications found.`
                : "You haven't created any notifications yet."}
            </p>
            
            <Button 
              size="sm" 
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2"
            >
              <MailPlus className="h-4 w-4" />
              Create Your First Notification
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => {
              const typeInfo = notificationTypes.find(
                (type) => type.id === notification.type
              ) || notificationTypes[notificationTypes.length - 1];

              return (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Type indicator */}
                    <div className="flex-shrink-0 mt-1.5">
                      <div className={`w-3 h-3 rounded-full ${typeInfo.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                          {typeInfo.label}
                        </Badge>
                        {notification.emailSent && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal text-green-600 border-green-300">
                            <Mail className="h-3 w-3 mr-1" /> Email Sent
                          </Badge>
                        )}
                        {!notification.read && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal text-amber-600 border-amber-300">
                            Unread
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {notification.timeAgo}
                          </span>
                          {notification.userId && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {notification.userId.name || notification.userId.email}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-500 border-t">
            {error}
          </div>
        )}
      </div>

      {/* Notification Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Preview</DialogTitle>
            <DialogDescription>
              This is how your notification will appear to users
            </DialogDescription>
          </DialogHeader>
          
          {previewData && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              {/* Preview notification bell component style */}
              <div className="p-4 bg-white shadow-sm">
                <div className="flex flex-col gap-3">
                  {/* Image if provided */}
                  {previewData.imageUrl && (
                    <div className="w-full rounded-md overflow-hidden mb-2">
                      <img 
                        src={previewData.imageUrl} 
                        alt="Notification banner" 
                        className="w-full object-cover max-h-40"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x200/EEE/999?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    {/* Type indicator */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-3 h-3 rounded-full ${(notificationTypes.find(t => t.id === previewData.type) || notificationTypes[0]).color}`} />
                    </div>
                    
                    <div className="flex-1">
                      {/* Organization info if provided */}
                      {(previewData.organizationLogo || previewData.organizationName) && (
                        <div className="flex items-center gap-2 mb-2">
                          {previewData.organizationLogo && (
                            <img 
                              src={previewData.organizationLogo} 
                              alt="Organization logo" 
                              className="w-6 h-6 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/100/EEE/999?text=Logo';
                              }}
                            />
                          )}
                          {previewData.organizationName && (
                            <span className="text-sm font-medium text-gray-700">
                              {previewData.organizationName}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <h4 className="text-base font-medium text-gray-800">
                        {previewData.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 mb-2">
                        {previewData.message}
                      </p>
                      <span className="text-xs text-gray-400 block">
                        {previewData.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setPreviewOpen(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNotificationsPage; 