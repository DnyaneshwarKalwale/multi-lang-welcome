import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, FileText, Settings, Users, 
  PlusCircle, BarChart3, Linkedin, ChevronLeft, 
  LogOut, Menu, Lightbulb,
  CreditCard, LayoutGrid,
  Search, Upload, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { LovableLogo } from './LovableLogo';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: {
    count: number;
    variant: 'default' | 'outline' | 'primary' | 'secondary';
  };
}

interface CollapsibleSidebarProps {
  expanded: boolean;
}

export function CollapsibleSidebar({ expanded = true }: CollapsibleSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { title: 'Home', icon: Home, path: '/dashboard/home' },
    { title: 'Create Post', icon: PlusCircle, path: '/dashboard/post' },
    { title: 'Post Library', icon: FileText, path: '/dashboard/posts', badge: { count: 3, variant: 'primary' } },
    { title: 'Request Carousel', icon: Upload, path: '/dashboard/request-carousel' },
    { title: 'My Carousels', icon: LayoutGrid, path: '/dashboard/my-carousels' },
    { title: 'Team', icon: Users, path: '/dashboard/team' },
    { title: 'Scraper', icon: Search, path: '/dashboard/scraper' },
    { title: 'Inspiration Vault', icon: Lightbulb, path: '/dashboard/inspiration' },
    { title: 'AI Writer', icon: MessageSquare, path: '/dashboard/ai' },
    { title: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { title: 'Settings', icon: Settings, path: '/dashboard/settings' },
    { title: 'Billing', icon: CreditCard, path: '/dashboard/billing' },
  ];

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };
  
  return (
    <div className="h-full w-full flex flex-col bg-white border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="flex h-14 sm:h-16 items-center px-4 py-3 w-full justify-between border-b border-gray-100">
        <div className="flex items-center gap-2 overflow-hidden">
          <LovableLogo variant="icon" size="sm" className="w-8 h-8 text-purple-800" />
          <span className="font-semibold text-gray-900">BRANDOUT</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 w-full overflow-y-auto py-2">
        <div className="flex flex-col gap-1 w-full px-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors relative',
                isActive 
                  ? 'bg-primary-50 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100',
                'w-full'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium flex-1 whitespace-nowrap text-sm">
                {item.title}
              </span>
              {item.badge && (
                <Badge 
                  variant="outline" 
                  className="ml-auto bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-xs"
                >
                  {item.badge.count}
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-3 w-full">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || 'User'} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="truncate text-xs text-gray-500">
              {user?.email}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 rounded-full ml-auto"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 