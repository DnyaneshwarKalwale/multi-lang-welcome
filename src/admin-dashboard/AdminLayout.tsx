import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart, 
  Settings, 
  FileText,
  Layers,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Content',
    href: '/admin/content',
    icon: <FileText className="h-5 w-5" />
  },
  {
    title: 'Carousel Requests',
    href: '/admin/carousel-requests',
    icon: <Layers className="h-5 w-5" />
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart className="h-5 w-5" />
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Remove admin auth token
    localStorage.removeItem('adminToken');
    
    toast({
      title: "Logged out",
      description: "Successfully logged out of admin panel",
    });
    
    // Redirect to login page
    window.location.href = '/admin/login';
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    item.href === location.pathname
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group rounded-md py-2 px-2 flex items-center text-sm font-medium"
                  )}
                >
                  <div
                    className={cn(
                      item.href === location.pathname
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0"
                    )}
                  >
                    {item.icon}
                  </div>
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <Avatar>
                    <AvatarImage src="/admin-avatar.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Admin User</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-gray-500 flex items-center mt-1 px-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 