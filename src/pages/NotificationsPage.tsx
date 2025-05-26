import React, { useState, useEffect } from "react";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import {
  Bell,
  MailOpen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Search,
  X,
  ImageIcon,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Map notification types to their respective colors and labels
const notificationTypes = [
  { id: "all", label: "All", color: "bg-gray-200" },
  { id: "welcome", label: "Welcome", color: "bg-green-200" },
  { id: "subscription", label: "Subscription", color: "bg-purple-200" },
  { id: "limit", label: "Usage Limits", color: "bg-amber-200" },
  { id: "carousel", label: "Carousel Updates", color: "bg-blue-200" },
  { id: "feature", label: "New Features", color: "bg-indigo-200" },
  { id: "offer", label: "Special Offers", color: "bg-pink-200" },
  { id: "general", label: "General", color: "bg-gray-200" },
];

const NotificationItem = ({
  notification,
  onClick,
  onDelete,
  expanded = false,
}: {
  notification: Notification;
  onClick: () => void;
  onDelete: () => void;
  expanded?: boolean;
}) => {
  const typeInfo = notificationTypes.find(
    (type) => type.id === notification.type
  ) || notificationTypes[notificationTypes.length - 1];
  
  // Use type color for unread, blue for read
  const dotColor = !notification.read 
    ? typeInfo.color
    : "bg-blue-400";
  
  // Preview of message content (shorter for list view)
  const messagePreview = !expanded && notification.message.length > 120
    ? notification.message.substring(0, 120) + '...'
    : notification.message;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-col gap-3 p-4 border rounded-lg transition-all cursor-pointer",
        !notification.read
          ? "bg-blue-50 border-blue-100"
          : "bg-white border-gray-100"
      )}
      onClick={!expanded ? onClick : undefined}
    >
      {/* Thumbnail preview for images in list view */}
      {!expanded && notification.imageUrl && (
        <div className="w-full h-24 mb-2 overflow-hidden rounded-md bg-gray-50 flex items-center justify-center">
          <img 
            src={notification.imageUrl} 
            alt="Notification banner" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Full image in expanded view */}
      {expanded && notification.imageUrl && (
        <div className="w-full mb-4 overflow-hidden rounded-md">
          <img 
            src={notification.imageUrl} 
            alt="Notification banner" 
            className="w-full object-cover"
          />
        </div>
      )}
      
      <div className="flex gap-4">
        {/* Color indicator */}
        <div className="flex-shrink-0 mt-1">
          <div className={`w-3 h-3 rounded-full ${dotColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* Organization logo if available */}
            {notification.organizationLogo && (
              <img 
                src={notification.organizationLogo} 
                alt="Organization logo" 
                className="w-5 h-5 rounded-full object-cover"
              />
            )}
            <h4 className="text-base font-medium text-gray-800">
              {notification.title}
            </h4>
          </div>
          
          {/* Sender info if available */}
          {notification.organizationName && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-gray-500">
                From: {notification.organizationName}
              </span>
            </div>
          )}
          
          <p className={cn(
            "text-sm text-gray-600 mb-2",
            !expanded && "line-clamp-2"
          )}>
            {messagePreview}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 block">
              {notification.timeAgo}
            </span>
            
            {expanded && notification.link && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(notification.link, "_blank");
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Details
              </Button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationDetail = ({
  notification,
  open,
  onClose,
  onDelete,
  onRead,
}: {
  notification: Notification | null;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onRead: () => void;
}) => {
  // Effect to mark notification as read when opened
  useEffect(() => {
    if (open && notification && !notification.read) {
      onRead();
    }
  }, [open, notification]);

  if (!notification) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <DialogHeader className="px-4 py-3 border-b border-gray-100">
            <DialogTitle className="text-base font-medium text-gray-800">
              {notification.title}
            </DialogTitle>
          </DialogHeader>
          
          {/* Main content */}
          <div className="p-4 flex-1 overflow-auto">
            <NotificationItem 
              notification={{...notification, read: true}} 
              onClick={() => {}} 
              onDelete={onDelete}
              expanded={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [viewMode, setViewMode] = useState<"all" | "unread">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  // Add state to track locally updated notifications
  const [localReadStatus, setLocalReadStatus] = useState<Record<string, boolean>>({});

  // Handle filter change
  useEffect(() => {
    fetchNotifications(1, pagination.limit);
  }, [viewMode]);

  // Reset local read status when notifications are refreshed
  useEffect(() => {
    setLocalReadStatus({});
  }, [notifications]);

  // Generate pagination range
  const getPaginationRange = () => {
    const totalPages = pagination.pages;
    const currentPage = pagination.page;
    const range = [];

    const maxPagesToShow = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxPagesToShow / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchNotifications(page, pagination.limit);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Set selected notification first
    setSelectedNotification(notification);
    setDetailOpen(true);
  };

  // Handle notification marked as read
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    // Update local state immediately for UI feedback
    setLocalReadStatus(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Filter notifications based on view mode and search term
  const filteredNotifications = notifications.filter((notification) => {
    // Check if this notification has been locally marked as read
    const isLocallyRead = localReadStatus[notification.id] || false;
    
    // Combine server and local read status
    const isRead = notification.read || isLocallyRead;
    
    // Filter by read/unread status
    const statusMatch = viewMode === "all" || !isRead;
    
    // Filter by search term (title or message)
    const searchMatch = 
      searchTerm === "" || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Notifications</h1>
        <p className="text-gray-500">
          Stay updated with the latest information about your content, subscription, and more.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Search bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notifications by title or content..."
            className="pl-10 w-full bg-white border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Tabs and actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "all" | "unread")}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-2 w-full sm:w-[200px] bg-gray-100">
              <TabsTrigger value="all" className="text-gray-700 data-[state=active]:bg-white">All</TabsTrigger>
              <TabsTrigger value="unread" className="text-gray-700 data-[state=active]:bg-white">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 text-xs bg-red-400 text-white rounded-full w-4 h-4 inline-flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeletons
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 flex gap-3 bg-white"
                >
                  <Skeleton className="h-3 w-3 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-[40%] bg-gray-200" />
                    <Skeleton className="h-4 w-full bg-gray-200" />
                    <Skeleton className="h-3 w-[20%] bg-gray-200" />
                  </div>
                </div>
              ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 mb-3 text-gray-300" />
            <h3 className="text-lg font-medium mb-1 text-gray-700">No notifications found</h3>
            <p className="text-sm text-gray-500 max-w-md mb-6">
              {searchTerm
                ? `No notifications match your search for "${searchTerm}"`
                : viewMode !== "all"
                ? "You have no unread notifications."
                : "You don't have any notifications yet. We'll notify you about important updates."}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                  onDelete={() => deleteNotification(notification.id)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && filteredNotifications.length > 0 && pagination.pages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-gray-500 border-gray-200"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>

              {/* Generate page numbers */}
              {getPaginationRange().map((page) => (
                <PaginationItem key={page}>
                  <Button
                    variant={page === pagination.page ? "default" : "outline"}
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      page === pagination.page
                        ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"
                        : "text-gray-600 border-gray-200"
                    )}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ))}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-gray-500 border-gray-200"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-lg border border-red-100 bg-red-50 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </div>
      
      {/* Notification detail dialog */}
      <NotificationDetail
        notification={selectedNotification}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onDelete={() => {
          if (selectedNotification) {
            deleteNotification(selectedNotification.id);
            setDetailOpen(false);
          }
        }}
        onRead={() => selectedNotification && handleMarkAsRead(selectedNotification.id)}
      />
    </div>
  );
};

export default NotificationsPage; 