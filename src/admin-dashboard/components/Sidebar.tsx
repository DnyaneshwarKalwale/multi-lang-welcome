import { Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Gauge,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      path: "/admin/content",
      label: "Content",
      icon: FileText,
    },
    {
      path: "/admin/carousel-requests",
      label: "Carousel Requests",
      icon: MessageSquare,
    },
    {
      path: "/admin/user-limits",
      label: "User Limits",
      icon: Gauge,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <Card className="h-full w-64 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </Card>
  );
};

export default Sidebar; 