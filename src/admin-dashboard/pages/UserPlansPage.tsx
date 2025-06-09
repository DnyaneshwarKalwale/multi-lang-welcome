import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, isValid } from "date-fns";
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
import { 
  Loader2, Search, X, Filter, Download, 
  CreditCard, RefreshCw, Calendar, Check, Pencil, AlertTriangle, Edit, SearchX
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DatePicker } from "@/components/date-picker";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Define subscription data interface
interface UserSubscriptionData {
  userId: string;
  userName?: string;
  userEmail?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  limit: number;
  count: number;
  remaining: number;
  planId: string;
  planName: string;
  expiresAt?: string;
  status?: string;
  user?: {
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
  adminModified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Define subscription plans
const SUBSCRIPTION_PLANS = [
  { id: 'trial', name: 'Trial', limit: 3, durationDays: 7, price: 0 },
  { id: 'basic', name: 'Basic', limit: 10, price: 100 },
  { id: 'premium', name: 'Premium', limit: 25, price: 200 },
  { id: 'custom', name: 'Custom', limit: 50, price: 'Custom' },
  { id: 'expired', name: 'Expired', limit: 0, price: 0 }
];

const UserPlansPage: React.FC = () => {
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<UserSubscriptionData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { toast } = useToast();
  
  // State for the edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSubscriptionData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [customLimit, setCustomLimit] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUserSubscriptions();
  }, []);

  const fetchUserSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/user-limits/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );
      
      if (response.data && response.data.data) {
        // Normalize user data structure
        const normalizedData = response.data.data.map((sub: any) => ({
          ...sub,
          userName: sub.userName || (sub.user ? `${sub.user.firstName || ''} ${sub.user.lastName || ''}`.trim() : 'N/A'),
          userEmail: sub.userEmail || (sub.user ? sub.user.email : 'N/A')
        }));
        
        setUserSubscriptions(normalizedData);
        setFilteredSubscriptions(normalizedData);
      }
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user subscription data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = userSubscriptions.filter(sub => 
        (sub.userEmail || '').toLowerCase().includes(lowercasedSearch) ||
        (sub.userName || '').toLowerCase().includes(lowercasedSearch) ||
        (sub.user?.email || '').toLowerCase().includes(lowercasedSearch) ||
        (sub.user?.firstName || '').toLowerCase().includes(lowercasedSearch) ||
        (sub.user?.lastName || '').toLowerCase().includes(lowercasedSearch) ||
        (sub.planName || '').toLowerCase().includes(lowercasedSearch)
      );
      setFilteredSubscriptions(filtered);
    } else {
      setFilteredSubscriptions(userSubscriptions);
    }
    setCurrentPage(1);
  }, [searchTerm, userSubscriptions]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentSubscriptions = filteredSubscriptions.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredSubscriptions.length / usersPerPage);

  // Pagination controls
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const openEditDialog = (user: UserSubscriptionData) => {
    setSelectedUser(user);
    setSelectedPlan(user.planId || 'trial');
    setCustomLimit(user.limit);
    setExpiryDate(user.expiresAt ? new Date(user.expiresAt) : undefined);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubscription = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      // Find the selected plan
      const planInfo = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);
      if (!planInfo) {
        throw new Error("Invalid plan selected");
      }

      // Calculate expiry date for trial plans
      let expiryDateValue = null;
      if (selectedPlan === 'trial') {
        const trialExpiry = new Date();
        trialExpiry.setDate(trialExpiry.getDate() + (planInfo.durationDays || 7));
        expiryDateValue = trialExpiry.toISOString().split('T')[0];
      } else if (expiryDate) {
        expiryDateValue = expiryDate.toISOString().split('T')[0];
      }

      // Build update payload
      const updateData = {
        planId: selectedPlan,
        planName: planInfo.name,
        limit: selectedPlan === 'custom' ? customLimit : planInfo.limit,
        expiresAt: expiryDateValue,
        adminModified: true
      };

      // Call API to update
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/user-limits/${selectedUser.userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setUserSubscriptions(prev => prev.map(sub => 
          sub.userId === selectedUser.userId ? { ...sub, ...response.data.data } : sub
        ));

        toast({
          title: "Success",
          description: "User subscription updated successfully.",
        });

        // Close dialog
        setIsEditDialogOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update subscription. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetUsage = async (userId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/user-limits/${userId}/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setUserSubscriptions(prev => prev.map(sub => 
          sub.userId === userId ? { ...sub, count: 0 } : sub
        ));

        toast({
          title: "Success",
          description: "User usage limit reset successfully.",
        });
      } else {
        throw new Error(response.data.message || "Failed to reset usage");
      }
    } catch (error) {
      console.error("Error resetting usage:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset usage. Please try again.",
      });
    }
  };

  // Format a date with proper handling of invalid dates
  const formatDate = (date: Date | undefined | string | null): string => {
    if (!date) return 'No expiry';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!isValid(dateObj)) return 'Invalid date';
      return format(dateObj, 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Function to get user display name
  const getUserDisplayName = (subscription: UserSubscriptionData) => {
    if (subscription?.userName) {
      return subscription.userName;
    }
    
    if (subscription?.firstName && subscription?.lastName) {
      return `${subscription.firstName} ${subscription.lastName}`;
    }
    
    if (subscription?.firstName) {
      return subscription.firstName;
    }
    
    if (subscription?.name) {
      return subscription.name;
    }
    
    return "";
  };
  
  // Function to get user email
  const getUserEmail = (subscription: UserSubscriptionData) => {
    return subscription?.userEmail || subscription?.email || "";
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
              <span>Loading user data...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (filteredSubscriptions.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-muted-foreground">No user subscriptions found</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return currentSubscriptions.map((subscription) => (
      <TableRow key={subscription.userId} className="hover:bg-muted/40">
        <TableCell className="font-medium">
          {getUserDisplayName(subscription) || "Unknown User"}
          <div className="text-xs text-muted-foreground mt-1">
            {getUserEmail(subscription) || "No email"}
          </div>
        </TableCell>
        <TableCell>
          <Badge 
            variant={subscription.planId === 'premium' ? 'default' : 
                  subscription.planId === 'basic' ? 'secondary' : 
                  subscription.planId === 'trial' ? 'outline' : 'destructive'}
            className={subscription.planId === 'expired' ? 'bg-destructive/20 text-destructive border-destructive/30' : ''}
          >
            {subscription.planName || subscription.planId}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-medium">{subscription.count} / {subscription.limit}</span>
            {subscription.count >= subscription.limit && (
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Limit reached</Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
          {formatDate(subscription.expiresAt)}
        </TableCell>
        <TableCell>
          <Badge 
            variant={subscription.planId === 'expired' ? 'destructive' : 'outline'}
            className={
              subscription.planId !== 'expired' 
                ? 'bg-green-50 text-green-600 border-green-200' 
                : 'bg-destructive/20 text-destructive border-destructive/30'
            }
          >
            {subscription.planId === 'expired' ? 'Expired' : 'Active'}
          </Badge>
        </TableCell>
        <TableCell>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 text-xs"
            onClick={() => handleResetUsage(subscription.userId)}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </TableCell>
        <TableCell>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 text-xs"
            onClick={() => openEditDialog(subscription)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading user subscription data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Subscription Plans Management</CardTitle>
              <CardDescription>
                Manage all user subscription plans, credits, and billing details
              </CardDescription>
            </div>
            <Button onClick={fetchUserSubscriptions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and filter */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email or plan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-2.5"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
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
                  {renderTableBody()}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {filteredSubscriptions.length > 0 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={prevPage} 
                        className={currentPage === 1 ? "cursor-not-allowed opacity-50" : ""} 
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // For simplicity, show max 5 pages and handle active page being in the middle
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink 
                            onClick={() => paginate(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={nextPage} 
                        className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Subscription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
            <DialogDescription>
              Update the subscription plan and credit allocation for this user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {getUserDisplayName(selectedUser)}
                  </p>
                  <p className="text-xs text-muted-foreground">{getUserEmail(selectedUser)}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="plan">Subscription Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBSCRIPTION_PLANS.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} ({plan.id === 'custom' ? 'Custom' : `${plan.limit} credits`})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPlan === 'custom' && (
                <div className="space-y-3">
                  <Label htmlFor="customLimit">Custom Credit Limit</Label>
                  <Input
                    id="customLimit"
                    type="number"
                    min="1"
                    value={customLimit}
                    onChange={(e) => setCustomLimit(parseInt(e.target.value) || 0)}
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  {selectedPlan === 'trial' ? (
                    <span>Trial plans expire after 7 days by default</span>
                  ) : selectedPlan === 'expired' ? (
                    <span>Expired plans have no access to credits</span>
                  ) : (
                    <span>Paid plans have no expiration unless specified</span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateSubscription}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserPlansPage; 