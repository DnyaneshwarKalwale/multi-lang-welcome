import React, { useState, useEffect } from "react";
import { Bell, MailOpen, Trash2, CheckCheck, X, ExternalLink } from "lucide-react";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Map notification types to their respective colors (light pastel versions)
const typeColors: Record<string, string> = {
  welcome: "bg-green-200",
  subscription: "bg-purple-200",
  limit: "bg-amber-200",
  carousel: "bg-blue-200",
  feature: "bg-indigo-200",
  offer: "bg-pink-200",
  general: "bg-gray-200",
};

const NotificationItem = ({
  notification,
  onClick,
  onDelete,
}: {
  notification: Notification;
  onClick: () => void;
  onDelete: () => void;
}) => {
  // Use blue color for read notifications, type color for unread
  const dotColor = notification.read 
    ? "bg-blue-400"
    : (typeColors[notification.type] || typeColors.general);

  return (
    <motion.div
      className={cn(
        "flex gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 relative cursor-pointer",
        !notification.read ? "bg-blue-50" : "bg-white"
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      onClick={onClick}
    >
      {/* Status indicator dot */}
      <div className="flex-shrink-0 mt-1">
        <div className={cn("w-2 h-2 rounded-full", dotColor)} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-800">
          {notification.title}
        </h4>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {notification.message}
        </p>
        <span className="text-[10px] text-gray-400 mt-1 block">
          {notification.timeAgo}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-gray-400 hover:text-red-400 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
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
  
  const typeColor = typeColors[notification.type] || typeColors.general;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", "bg-blue-400")} />
            <span>{notification.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Notification image if available */}
        {notification.imageUrl && (
          <div className="w-full rounded-md overflow-hidden mb-4">
            <img 
              src={notification.imageUrl} 
              alt="Notification image" 
              className="w-full object-cover"
            />
          </div>
        )}
        
        {/* Organization logo if available */}
        {notification.organizationLogo && (
          <div className="flex items-center gap-2 mb-4">
            <img 
              src={notification.organizationLogo} 
              alt="Organization logo" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              {notification.organizationName || "System"}
            </span>
          </div>
        )}
        
        <div className="text-sm text-gray-700 whitespace-pre-line">
          {notification.message}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-400">{notification.timeAgo}</span>
          
          <div className="flex gap-2">
            {notification.link && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={() => window.open(notification.link, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Link
              </Button>
            )}
            <Button 
              variant="destructive" 
              size="sm" 
              className="text-xs" 
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    // Set selected notification first
    setSelectedNotification(notification);
    setDetailOpen(true);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => {
              fetchNotifications();
            }}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-white border-gray-100 shadow-md" align="end">
          <div className="flex items-center justify-between p-4 bg-white">
            <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500"
                title="Mark all as read"
                onClick={markAllAsRead}
                disabled={loading || unreadCount === 0}
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600"
                onClick={() => navigate("/dashboard/notifications")}
              >
                View All
              </Button>
            </div>
          </div>
          <Separator className="bg-gray-100" />
          <ScrollArea className="h-[300px] bg-white">
            {loading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-2 w-2 rounded-full bg-gray-200" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[80%] bg-gray-200" />
                      <Skeleton className="h-3 w-full bg-gray-200" />
                      <Skeleton className="h-2 w-[30%] bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-400">
                <MailOpen className="h-10 w-10 mb-2 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="p-2 space-y-1">
                  {notifications.map((notification) => (
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
            {error && (
              <div className="p-4 text-center text-red-400 text-sm">{error}</div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      
      {/* Notification detail dialog */}
      <NotificationDetail
        notification={selectedNotification}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onDelete={() => selectedNotification && deleteNotification(selectedNotification.id)}
        onRead={() => selectedNotification && markAsRead(selectedNotification.id)}
      />
    </>
  );
};

export default NotificationBell; 