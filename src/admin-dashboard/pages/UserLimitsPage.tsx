import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, X, Filter, Download } from "lucide-react";

interface UserLimit {
  userId: string;
  limit: number;
  count: number;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const UserLimitsPage: React.FC = () => {
  const [userLimits, setUserLimits] = useState<UserLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLimits, setFilteredLimits] = useState<UserLimit[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserLimits = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/user-limits/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`
            }
          }
        );
        
        if (response.data && response.data.data) {
          setUserLimits(response.data.data);
          setFilteredLimits(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user limits:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user limits. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserLimits();
  }, [toast]);

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = userLimits.filter(limit => 
        limit.user?.email?.toLowerCase().includes(lowercasedSearch) ||
        limit.user?.firstName?.toLowerCase().includes(lowercasedSearch) ||
        limit.user?.lastName?.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredLimits(filtered);
    } else {
      setFilteredLimits(userLimits);
    }
    setCurrentPage(1);
  }, [searchTerm, userLimits]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentLimits = filteredLimits.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredLimits.length / usersPerPage);

  const handleUpdateLimit = async (userId: string, newLimit: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/user-limits/${userId}`,
        { limit: newLimit },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );

      // Update local state
      setUserLimits(prev => prev.map(limit => 
        limit.userId === userId 
          ? { ...limit, limit: newLimit }
          : limit
      ));

      toast({
        title: "Success",
        description: "User limit updated successfully.",
      });
    } catch (error) {
      console.error("Error updating user limit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user limit. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading user limits...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">User Limits</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage content generation limits for users
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
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
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Usage</TableHead>
                <TableHead>Limit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLimits.map((limit) => (
                <TableRow key={limit.userId}>
                  <TableCell className="font-medium">
                    {limit.user?.firstName} {limit.user?.lastName || ''}
                  </TableCell>
                  <TableCell>{limit.user?.email || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((limit.count / limit.limit) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {limit.count} / {limit.limit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      defaultValue={limit.limit}
                      className="w-24"
                      onChange={(e) => handleUpdateLimit(limit.userId, Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={limit.count >= limit.limit ? "destructive" : "default"}
                    >
                      {limit.count >= limit.limit ? 'Limit Reached' : 'Active'}
                    </Badge>
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
          Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredLimits.length)} of {filteredLimits.length} users
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

export default UserLimitsPage; 