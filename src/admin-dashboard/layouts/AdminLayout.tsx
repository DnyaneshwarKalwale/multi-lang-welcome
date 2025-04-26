import React, { useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Bell,
  User,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const AdminLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [adminUser, setAdminUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    
    // Load admin user from localStorage
    const storedUser = localStorage.getItem("admin-user");
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-user");
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel.",
    });
    navigate("/admin/login");
  };
  
  // Navigation items
  const navItems = [
    { 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" />,
      path: "/admin/dashboard" 
    },
    { 
      label: "Analytics", 
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/admin/analytics" 
    },
    { 
      label: "Users", 
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users" 
    },
    { 
      label: "Content", 
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/content" 
    },
    { 
      label: "Carousel Requests", 
      icon: <Menu className="h-5 w-5" />,
      path: "/admin/carousel-requests" 
    },
    { 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings" 
    },
  ];

  // Sidebar for desktop view
  const DesktopSidebar = () => (
    <aside className="w-64 bg-gray-50 h-screen fixed left-0 top-0 border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 hidden md:block">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </nav>
    </aside>
  );

  // Mobile header with offcanvas menu
  const MobileHeader = () => (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:hidden z-10">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
              <SheetTitle className="text-left">Admin Panel</SheetTitle>
            </SheetHeader>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-bold ml-2 text-primary">Admin</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );

  // Desktop header
  const DesktopHeader = () => (
    <header className="h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-end px-6 ml-64 fixed top-0 right-0 left-0 z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              {adminUser?.firstName || "Admin"} {adminUser?.lastName || "User"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
  
  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen">
      {isMobile ? <MobileHeader /> : <DesktopSidebar />}
      {!isMobile && <DesktopHeader />}
      
      <main className={`p-6 ${isMobile ? 'pt-24' : 'ml-64 pt-24'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 