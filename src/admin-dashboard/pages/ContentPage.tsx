import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, 
  MoreHorizontal, 
  Search, 
  X, 
  Filter, 
  Download, 
  Eye, 
  ExternalLink, 
  FileText, 
  BarChart4,
  Layers,
  SlidersHorizontal,
  Pencil,
  MessageCircle,
  ThumbsUp
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  userId: string;
  userName: string;
  slideCount: number | null;
  status: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  publishedAt: string | null;
}

const ContentPage: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [contentTypeData, setContentTypeData] = useState([]);
  const [contentStatusData, setContentStatusData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const { toast } = useToast();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Define getTypeLabel and getTypeIcon functions here before they're used
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'carousel':
        return 'Carousel';
      case 'post-long':
        return 'Long Post';
      case 'post-short':
        return 'Short Post';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'carousel':
        return <Layers className="h-4 w-4" />;
      case 'post-long':
        return <FileText className="h-4 w-4" />;
      case 'post-short':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/admin/content`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`
            }
          }
        );
        
        console.log("Content data:", response.data);
        
        if (response.data && response.data.data) {
          // Set content data
          setContent(response.data.data);
          setFilteredContent(response.data.data);
          
          // Generate content type distribution data
          const contentTypes = response.data.data.reduce((acc: any, item: ContentItem) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
          }, {});
          
          const typeData = Object.keys(contentTypes).map(type => ({
            name: getTypeLabel(type),
            value: contentTypes[type]
          }));
          
          setContentTypeData(typeData);
          
          // Generate content status distribution data
          const contentStatuses = response.data.data.reduce((acc: any, item: ContentItem) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {});
          
          const statusData = Object.keys(contentStatuses).map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: contentStatuses[status]
          }));
          
          setContentStatusData(statusData);
          
          // Generate engagement data by content type
          const engagementByType: any = {};
          response.data.data.forEach((item: ContentItem) => {
            if (!engagementByType[item.type]) {
              engagementByType[item.type] = { 
                views: 0, 
                likes: 0, 
                comments: 0, 
                count: 0 
              };
            }
            
            engagementByType[item.type].views += item.views || 0;
            engagementByType[item.type].likes += item.likes || 0;
            engagementByType[item.type].comments += item.comments || 0;
            engagementByType[item.type].count += 1;
          });
          
          const engagementData = Object.keys(engagementByType).map(type => ({
            name: getTypeLabel(type),
            views: Math.round(engagementByType[type].views / engagementByType[type].count),
            likes: Math.round(engagementByType[type].likes / engagementByType[type].count),
            comments: Math.round(engagementByType[type].comments / engagementByType[type].count)
          }));
          
          setEngagementData(engagementData);
        } else {
          // If no data, set empty arrays
          setContent([]);
          setFilteredContent([]);
          setContentTypeData([]);
          setContentStatusData([]);
          setEngagementData([]);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load content. Please try again.",
        });
        
        // Set empty arrays on error
        setContent([]);
        setFilteredContent([]);
        setContentTypeData([]);
        setContentStatusData([]);
        setEngagementData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [toast]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...content];
    
    // Apply tab filter first
    if (activeTab !== "all") {
      result = result.filter(item => item.type === activeTab);
    }
    
    // Apply filter dropdown
    if (filter !== "all") {
      switch (filter) {
        case "published":
          result = result.filter(item => item.status === "published");
          break;
        case "draft":
          result = result.filter(item => item.status === "draft");
          break;
        case "popular":
          result = result.filter(item => item.views > 500);
          break;
        case "recent":
          // Get items created in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          result = result.filter(item => 
            new Date(item.createdAt) > thirtyDaysAgo
          );
          break;
        default:
          break;
      }
    }
    
    // Apply search
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(lowercasedSearch) ||
          item.userName.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    setFilteredContent(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [content, filter, searchTerm, activeTab]);
  
  // Get current content items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContent.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  
  const handleDeleteContent = async (contentId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/admin/content/${contentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );
      
      // Update local state
      setContent(content.filter(item => item.id !== contentId));
      setFilteredContent(filteredContent.filter(item => item.id !== contentId));
      
      toast({
        title: "Content Deleted",
        description: "The content has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete content. Please try again.",
      });
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading content data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-3xl font-bold text-black dark:text-black">Content Management</h1> */}
          <p className="text-gray-500 dark:text-gray-400">
            Total: {filteredContent.length} content items
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search content..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {filter === "all" ? "All Content" : 
                  filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Content By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("published")}>
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("draft")}>
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("popular")}>
                Popular (500+ Views)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("recent")}>
                Recent (Last 30 Days)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              toast({
                title: "Export Started",
                description: "Exporting content data to CSV...",
              });
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {contentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Engagement By Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={engagementData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#8884d8" name="Views" />
                  <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
                  <Bar dataKey="comments" fill="#ffc658" name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Content Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="carousel">Carousels</TabsTrigger>
          <TabsTrigger value="post-long">Long Posts</TabsTrigger>
          <TabsTrigger value="post-short">Short Posts</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Content Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getTypeIcon(item.type)}
                      <span>{getTypeLabel(item.type)}</span>
                      {item.type === 'carousel' && (
                        <Badge variant="outline" className="ml-1">
                          {item.slideCount} slides
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.status === "published" ? "default" : "secondary"}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{formatDate(item.createdAt)}</span>
                      {item.publishedAt && (
                        <span className="text-xs text-gray-500">
                          Published: {formatDate(item.publishedAt)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="h-3.5 w-3.5 text-gray-500" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <ThumbsUp className="h-3.5 w-3.5 text-gray-500" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MessageCircle className="h-3.5 w-3.5 text-gray-500" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" /> View on Platform
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart4 className="h-4 w-4 mr-2" /> Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteContent(item.id)}
                        >
                          <X className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredContent.length)} of {filteredContent.length} items
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate page numbers to show (focus around current page)
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                }
                if (currentPage > totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                }
              }
              
              return pageNum <= totalPages ? (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-9 h-9 p-0"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ) : null;
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentPage; 