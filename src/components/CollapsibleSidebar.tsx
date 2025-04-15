import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LogOut, X, Home, LayoutGrid, BarChart2, Settings, Image, 
  FileText, Users, CreditCard, Lightbulb, Bot, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface CollapsibleSidebarProps {
  isOpen: boolean;
  isFixed?: boolean;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  onClose: () => void;
}

export function CollapsibleSidebar({ 
  isOpen, 
  isFixed = false, 
  deviceType = 'desktop',
  onClose 
}: CollapsibleSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard/home',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      label: 'Create Post',
      href: '/dashboard/post',
      icon: <FileText className="h-4 w-4 mr-3" />
    },
    {
      label: 'Post Library',
      href: '/dashboard/posts',
      icon: <LayoutGrid className="h-4 w-4 mr-3" />
    },
    {
      label: 'Request Carousel',
      href: '/dashboard/request-carousel',
      icon: <Image className="h-4 w-4 mr-3" />
    },
    {
      label: 'Scraper',
      href: '/dashboard/scraper',
      icon: <Globe className="h-4 w-4 mr-3" />
    },
    {
      label: 'Inspiration',
      href: '/dashboard/inspiration',
      icon: <Lightbulb className="h-4 w-4 mr-3" />
    },
    {
      label: 'AI Writer',
      href: '/dashboard/ai',
      icon: <Bot className="h-4 w-4 mr-3" />
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart2 className="h-4 w-4 mr-3" />
    },
    {
      label: 'Team',
      href: '/dashboard/team',
      icon: <Users className="h-4 w-4 mr-3" />
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="h-4 w-4 mr-3" />
    },
    {
      label: 'Billing',
      href: '/dashboard/billing',
      icon: <CreditCard className="h-4 w-4 mr-3" />
    },
    {
      label: 'Image Gallery',
      href: '/dashboard/images',
      icon: <Image className="h-4 w-4 mr-3" />
    }
  ];

  // Determine responsive values based on device type
  const sidebarWidth = deviceType === 'mobile' ? 'w-[85vw]' : 'w-[280px]';
  const logoSize = deviceType === 'mobile' ? 'h-6' : 'h-7';
  const textSize = deviceType === 'mobile' ? 'text-xs' : 'text-sm';
  const navItemHeight = deviceType === 'mobile' ? 'h-10' : 'h-12';

  // Active path handling - if we're on a carousel-related page, highlight Request Carousel
  const isCarouselActive = (path: string) => {
    if (path === '/dashboard/request-carousel') return true;
    if (path === '/dashboard/carousels') return true;
    if (path === '/dashboard/my-carousels') return true;
    if (path === '/templates') return true;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // For fixed desktop sidebar, render without animation wrapper
  if (isFixed) {
    return (
      <div className={cn("flex flex-col h-full border-r shadow-md bg-white", "w-[250px]")}>
        {/* Sidebar Header */}
        <div className="flex justify-between items-center h-16 px-4 border-b">
          <Link to="/dashboard" className="flex items-center">
            <img
              src="/logo.svg"
              alt="LinkedIn Carousel"
              className="h-7 mr-2"
            />
            <span className="font-bold text-sm">Carousel Builder</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center h-12 px-4 rounded-md text-sm font-medium transition-colors",
                  item.href === '/dashboard/request-carousel' && isCarouselActive(item.href)
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Section */}
        {user && (
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.profilePicture} alt={user.firstName} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                // You would implement actual logout functionality here
                console.log('Logging out...');
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  // For mobile/tablet, use animated slide-in from right
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn("flex flex-col h-full border-l shadow-lg bg-white", sidebarWidth)}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Sidebar Header */}
          <div className="flex justify-between items-center h-14 sm:h-16 px-3 sm:px-4 border-b">
            <Link to="/dashboard" className="flex items-center">
              <img
                src="/logo.svg"
                alt="LinkedIn Carousel"
                className={cn(logoSize, "mr-2")}
              />
              <span className={cn("font-bold", textSize)}>Carousel Builder</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto hover:bg-red-50"
            >
              <X size={deviceType === 'mobile' ? 16 : 18} className="text-red-500" />
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-3 sm:py-4">
            <nav className="flex flex-col gap-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 sm:px-4 rounded-md font-medium transition-colors",
                    navItemHeight,
                    textSize,
                    item.href === '/dashboard/request-carousel' && isCarouselActive(item.href)
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={onClose}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* User Section */}
          {user && (
            <div className="p-3 sm:p-4 border-t mt-auto">
              <div className="flex items-center gap-3">
                <Avatar className={cn(deviceType === 'mobile' ? "h-8 w-8" : "h-10 w-10", "flex-shrink-0")}>
                  <AvatarImage src={user.profilePicture} alt={user.firstName} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium text-gray-900 truncate", textSize)}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className={cn("text-gray-500 truncate", deviceType === 'mobile' ? "text-[10px]" : "text-xs")}>
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
                  deviceType === 'mobile' ? "mt-3 text-xs" : "mt-4"
                )}
                onClick={() => {
                  // You would implement actual logout functionality here
                  console.log('Logging out...');
                  onClose();
                }}
              >
                <LogOut className={cn(deviceType === 'mobile' ? "h-3.5 w-3.5" : "h-4 w-4", "mr-2")} />
                Log out
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 