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
import { Loader2, Search, X, Filter, Download, RefreshCw } from "lucide-react";

interface UserLimit {
  userId: string;
  limit: number;
  count: number;
  planId?: string;
  planName?: string;
  expiresAt?: Date;
  userName?: string;
  userEmail?: string;
  user?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    name?: string;
  };
}

// For plan selection dropdown
const PLAN_OPTIONS = [
  { id: 'trial', name: 'Trial', limit: 3 },
  { id: 'basic', name: 'Basic', limit: 10 },
  { id: 'premium', name: 'Premium', limit: 25 },
  { id: 'custom', name: 'Custom', limit: 50 }
];

const UserLimitsPage: React.FC = () => {
  const [userLimits, setUserLimits] = useState<UserLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLimits, setFilteredLimits] = useState<UserLimit[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserLimits();
  }, []);

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
          console.log("User limits data:", response.data.data);
          
          // Process the data to ensure user information is properly extracted
          const processedData = response.data.data.map((limit: UserLimit) => {
            // If user object exists, make sure we have its properties available
            if (limit.user) {
              return {
                ...limit,
                // Add top-level properties if they don't exist but user object does
                userName: limit.userName || `${limit.user.firstName || ''} ${limit.user.lastName || ''}`.trim() || limit.user.name,
                userEmail: limit.userEmail || limit.user.email
              };
            }
            return limit;
          });
          
          setUserLimits(processedData);
          setFilteredLimits(processedData);
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

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = userLimits.filter(limit => 
        // Check direct properties first
        (limit.userEmail && limit.userEmail.toLowerCase().includes(lowercasedSearch)) ||
        (limit.userName && limit.userName.toLowerCase().includes(lowercasedSearch)) ||
        // Then check nested user object
        (limit.user?.email && limit.user.email.toLowerCase().includes(lowercasedSearch)) ||
        (limit.user?.firstName && limit.user.firstName.toLowerCase().includes(lowercasedSearch)) ||
        (limit.user?.lastName && limit.user.lastName.toLowerCase().includes(lowercasedSearch)) ||
        (limit.user?.name && limit.user.name.toLowerCase().includes(lowercasedSearch)) ||
        // Also check userId in case admin is searching by ID
        (limit.userId && limit.userId.toLowerCase().includes(lowercasedSearch))
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

  const handleUpdateLimit = async (userId: string, newLimit: number, planId?: string) => {
    try {
      console.log('Updating limit for user:', userId, 'to:', newLimit, 'with plan:', planId);
      
      // If a specific plan ID was selected, use that plan's values
      let planName;
      let limitValue = newLimit;
      
      if (planId) {
        const selectedPlan = PLAN_OPTIONS.find(p => p.id === planId);
        if (selectedPlan) {
          planName = selectedPlan.name;
          limitValue = selectedPlan.limit;
        }
      }
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/user-limits/${userId}`,
        { 
          limit: limitValue,
          planId: planId,
          planName: planName
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );

      console.log('Update response:', response.data);

      if (response.data.success) {
        // Update local state with the new data
        setUserLimits(prev => prev.map(limit => 
          limit.userId === userId 
            ? { 
                ...limit, 
                limit: response.data.data.limit,
                planId: response.data.data.planId,
                planName: response.data.data.planName,
                count: response.data.data.count,
                expiresAt: response.data.data.expiresAt,
                adminModified: response.data.data.adminModified
              }
            : limit
        ));

        // Update filtered limits as well
        setFilteredLimits(prev => prev.map(limit => 
          limit.userId === userId 
            ? { 
                ...limit, 
                limit: response.data.data.limit,
                planId: response.data.data.planId,
                planName: response.data.data.planName,
                count: response.data.data.count,
                expiresAt: response.data.data.expiresAt,
                adminModified: response.data.data.adminModified
              }
            : limit
        ));

        toast({
          title: "Success",
          description: "User limit updated successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message || "Failed to update user limit.",
        });
      }
    } catch (error) {
      console.error("Error updating user limit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user limit. Please try again.",
      });
    }
  };

  // Helper function to get user display name
  const getUserDisplayName = (limit: UserLimit): string => {
    // First check nested user object
    if (limit.user?.firstName && limit.user?.lastName) {
      return `${limit.user.firstName} ${limit.user.lastName}`;
    }
    if (limit.user?.name) {
      return limit.user.name;
    }
    // Then check top-level properties
    if (limit.userName) {
      return limit.userName;
    }
    return 'Unknown User';
  };
  
  // Helper function to get user email
  const getUserEmail = (limit: UserLimit): string => {
    // First check nested user object
    if (limit.user?.email) {
      return limit.user.email;
    }
    // Then check top-level property
    if (limit.userEmail) {
      return limit.userEmail;
    }
    return 'No email';
  };

  const getPlanStatus = (limit: UserLimit): string => {
    if (limit.planId === 'expired') {
      return 'Inactive';
    }
    if (!limit.expiresAt || new Date(limit.expiresAt) > new Date()) {
      return 'Active';
    }
    return 'Expired';
  };

  const getPlanExpiry = (limit: UserLimit): string => {
    if (!limit.expiresAt) {
      return 'No expiry';
    }
    return new Date(limit.expiresAt).toLocaleDateString();
  };

  const handleResetUsage = async (userId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/user-limits/${userId}/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setUserLimits(prev => prev.map(limit => 
          limit.userId === userId 
            ? { ...limit, count: 0 }
            : limit
        ));
        setFilteredLimits(prev => prev.map(limit => 
          limit.userId === userId 
            ? { ...limit, count: 0 }
            : limit
        ));

        toast({
          title: "Success",
          description: "User usage has been reset to 0.",
        });
      }
    } catch (error) {
      console.error("Error resetting user usage:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset user usage.",
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
          {/* <h1 className="text-3xl font-bold text-black dark:text-white">User Limits</h1> */}
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
          <Button variant="outline" onClick={fetchUserLimits} className="border-primary/20 text-primary hover:bg-primary/5">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLimits.length > 0 ? (
                currentLimits.map((limit) => (
                <TableRow key={limit.userId}>
                  <TableCell className="font-medium">
                      {getUserDisplayName(limit)}
                    </TableCell>
                    <TableCell>
                      {getUserEmail(limit)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={limit.planId === 'premium' ? 'default' : 
                               limit.planId === 'basic' ? 'secondary' : 
                               limit.planId === 'trial' ? 'outline' : 'destructive'}
                        className={limit.planId === 'expired' ? 'bg-destructive/20 text-destructive border-destructive/30' : ''}
                      >
                        {limit.planName || limit.planId || 'N/A'}
                      </Badge>
                  </TableCell>
                    <TableCell>{limit.count || 0} / {limit.limit || 0}</TableCell>
                    <TableCell>{getPlanExpiry(limit)}</TableCell>
                  <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getPlanStatus(limit) === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {getPlanStatus(limit)}
                      </span>
                  </TableCell>
                  <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <select
                          className="border rounded px-2 py-1 text-sm focus:border-primary focus:ring-primary"
                          onChange={(e) => handleUpdateLimit(limit.userId, 0, e.target.value)}
                          value=""
                        >
                          <option value="" disabled>Change Plan</option>
                          {PLAN_OPTIONS.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name} ({plan.limit})
                            </option>
                          ))}
                        </select>
                        
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetUsage(limit.userId)}
                          className="border-primary/20 text-primary hover:bg-primary/10"
                        >
                          Reset
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <p className="text-muted-foreground">No user limits found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Simple pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            Previous
          </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-8 h-8 p-0 ${currentPage === index + 1 ? 'bg-primary text-white' : 'border-primary/20 text-primary hover:bg-primary/5'}`}
                >
                  {index + 1}
                </Button>
              ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            Next
          </Button>
        </div>
      </div>
      )}
    </div>
  );
};

export default UserLimitsPage; 