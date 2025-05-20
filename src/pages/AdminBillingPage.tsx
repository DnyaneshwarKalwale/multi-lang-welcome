import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, Download, Shield, Upload, User, Users, Search,
  Edit, Trash, RefreshCw, PlusCircle, Filter, MoreHorizontal,
  ChevronLeft, ChevronRight, Loader2, Clock, Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import axios from 'axios';
import api, { tokenManager } from '@/services/api';

// Define user plan type
interface UserPlan {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  limit: number;
  count: number;
  remaining: number;
  planId: string;
  planName: string;
  expiresAt?: string;
  hasExpired?: boolean;
  adminModified: boolean;
  updatedAt: string;
}

// Define plan options
const PLAN_OPTIONS = [
  { id: 'trial', name: 'Trial', limit: 3, description: '7-day trial with 3 credits ($20)' },
  { id: 'basic', name: 'Basic', limit: 10, description: '$100/mo plan with standard features' },
  { id: 'premium', name: 'Premium', limit: 25, description: '$200/mo plan with premium features' },
  { id: 'custom', name: 'Custom', limit: 0, description: 'Custom plan with tailored features' }
];

const AdminBillingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<UserPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserPlan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Edit dialog state
  const [editPlanId, setEditPlanId] = useState('');
  const [editCredits, setEditCredits] = useState('');
  const [editCount, setEditCount] = useState('');
  const [editExpiration, setEditExpiration] = useState('');
  
  // Bulk update state
  const [bulkPlanId, setBulkPlanId] = useState('');
  const [bulkAddCredits, setBulkAddCredits] = useState('');
  const [bulkResetCounts, setBulkResetCounts] = useState(false);
  
  useEffect(() => {
    fetchUserPlans();
  }, [currentPage, filterPlan]);
  
  useEffect(() => {
    // Apply search filter locally for better performance
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = userPlans.filter(plan => 
        plan.userName.toLowerCase().includes(lowerQuery) ||
        plan.userEmail.toLowerCase().includes(lowerQuery)
      );
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans(userPlans);
    }
  }, [searchQuery, userPlans]);
  
  const fetchUserPlans = async () => {
    if (!token) {
      toast.error('Authentication required');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '15'); // 15 users per page
      
      if (filterPlan) {
        params.append('planId', filterPlan);
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user-limits/all?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setUserPlans(response.data.data);
        setFilteredPlans(response.data.data);
        setTotalPages(response.data.pages);
        setTotalUsers(response.data.total);
      } else {
        toast.error('Failed to fetch user plans');
      }
    } catch (error) {
      console.error('Error fetching user plans:', error);
      toast.error('Error fetching user plans');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditUser = (user: UserPlan) => {
    setSelectedUser(user);
    setEditPlanId(user.planId);
    setEditCredits(user.limit.toString());
    setEditCount(user.count.toString());
    setEditExpiration(user.expiresAt ? new Date(user.expiresAt).toISOString().split('T')[0] : '');
    setIsEditDialogOpen(true);
  };
  
  const handleSaveUserChanges = async () => {
    if (!selectedUser) return;
    
    setIsUpdating(true);
    
    try {
      const data = {
        planId: editPlanId,
        limit: parseInt(editCredits, 10),
        count: parseInt(editCount, 10),
        expiresAt: editExpiration ? new Date(editExpiration).toISOString() : undefined
      };
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user-limits/${selectedUser.userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('User plan updated successfully');
        fetchUserPlans();
        setIsEditDialogOpen(false);
      } else {
        toast.error('Failed to update user plan');
      }
    } catch (error) {
      console.error('Error updating user plan:', error);
      toast.error('Error updating user plan');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleResetUserCount = async (userId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user-limits/${userId}/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('User count reset successfully');
        fetchUserPlans();
      } else {
        toast.error('Failed to reset user count');
      }
    } catch (error) {
      console.error('Error resetting user count:', error);
      toast.error('Error resetting user count');
    }
  };
  
  const handleStartTrial = async (userId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user-limits/${userId}/set-trial`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('User trial plan started successfully');
        fetchUserPlans();
      } else {
        toast.error('Failed to start trial plan');
      }
    } catch (error) {
      console.error('Error starting trial plan:', error);
      toast.error('Error starting trial plan');
    }
  };
  
  const handleBulkUpdate = async () => {
    if (!bulkPlanId && !bulkAddCredits && !bulkResetCounts) {
      toast.error('Please specify at least one update action');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const data: any = {};
      
      if (bulkPlanId) {
        data.planId = bulkPlanId;
      }
      
      if (bulkAddCredits) {
        data.addCredits = parseInt(bulkAddCredits, 10);
      }
      
      if (bulkResetCounts) {
        data.resetCounts = true;
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user-limits/all`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Users updated successfully');
        fetchUserPlans();
        setIsBulkDialogOpen(false);
        
        // Reset bulk update form
        setBulkPlanId('');
        setBulkAddCredits('');
        setBulkResetCounts(false);
      } else {
        toast.error('Failed to update users');
      }
    } catch (error) {
      console.error('Error performing bulk update:', error);
      toast.error('Error performing bulk update');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Billing Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user subscription plans and credits
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchUserPlans()}
            className="h-9"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            onClick={() => setIsBulkDialogOpen(true)}
            className="h-9"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Bulk Update
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User Plans</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `${totalUsers} users found`}
              </CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={filterPlan}
                onValueChange={setFilterPlan}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Plans</SelectItem>
                  {PLAN_OPTIONS.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground">Loading user plans...</p>
              </div>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No users found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery ? 'Try adjusting your search query' : 'Add users to get started'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[250px]">User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-center">Credits</TableHead>
                    <TableHead className="text-center">Used</TableHead>
                    <TableHead className="text-center">Remaining</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium truncate max-w-[200px]">{plan.userName}</div>
                            <div className="text-xs text-muted-foreground">{plan.userEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge 
                            variant={plan.hasExpired ? "destructive" : "secondary"}
                            className="text-xs font-normal py-0.5"
                          >
                            {plan.planName}
                          </Badge>
                          {plan.hasExpired && (
                            <Badge variant="outline" className="text-xs font-normal py-0.5 border-destructive text-destructive">
                              Expired
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{plan.limit}</TableCell>
                      <TableCell className="text-center">{plan.count}</TableCell>
                      <TableCell className="text-center">
                        <span className={plan.remaining === 0 ? "text-destructive font-medium" : ""}>
                          {plan.remaining}
                        </span>
                      </TableCell>
                      <TableCell>
                        {plan.expiresAt ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{format(new Date(plan.expiresAt), 'MMM dd, yyyy')}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(plan)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Plan
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStartTrial(plan.userId)}>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Start Trial
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetUserCount(plan.userId)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reset Count
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        
        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User Plan</DialogTitle>
            <DialogDescription>
              Update subscription plan and credits for {selectedUser?.userName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Plan
              </Label>
              <div className="col-span-3">
                <Select
                  value={editPlanId}
                  onValueChange={setEditPlanId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_OPTIONS.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right">
                Total Credits
              </Label>
              <Input
                id="credits"
                type="number"
                min="0"
                value={editCredits}
                onChange={(e) => setEditCredits(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="used" className="text-right">
                Used Credits
              </Label>
              <Input
                id="used"
                type="number"
                min="0"
                value={editCount}
                onChange={(e) => setEditCount(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiration" className="text-right">
                Expiration
              </Label>
              <div className="col-span-3">
                <Input
                  id="expiration"
                  type="date"
                  value={editExpiration}
                  onChange={(e) => setEditExpiration(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty for non-expiring plans
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUserChanges} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Update Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bulk Update Users</DialogTitle>
            <DialogDescription>
              Apply changes to all or filtered users
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="bulk-plan">Change Plan (Optional)</Label>
              <Select
                value={bulkPlanId}
                onValueChange={setBulkPlanId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a plan to apply" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Don't change plans</SelectItem>
                  {PLAN_OPTIONS.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Will update all users to the selected plan
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="add-credits">Add Credits (Optional)</Label>
              <Input
                id="add-credits"
                type="number"
                min="0"
                placeholder="Number of credits to add"
                value={bulkAddCredits}
                onChange={(e) => setBulkAddCredits(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Will add this many credits to each user's current limit
              </p>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="reset-counts"
                checked={bulkResetCounts}
                onChange={(e) => setBulkResetCounts(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="reset-counts" className="cursor-pointer">
                Reset all usage counts to zero
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Apply Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBillingPage; 