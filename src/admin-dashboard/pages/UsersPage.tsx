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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MoreHorizontal, Search, UserPlus, X, Check, Calendar, Mail, Filter, Download } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  authMethod: string;
  role: string;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Get users from the API
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`
            }
          }
        );
        
        console.log("Users data:", response.data);
        
        if (response.data && response.data.data) {
          // Format the user data to match our interface
          const formattedUsers = response.data.data.map((user: any) => ({
            id: user._id || user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            onboardingCompleted: user.onboardingCompleted,
            authMethod: user.authMethod || 'email',
            role: user.role || 'user',
            createdAt: user.createdAt
          }));
          
          setUsers(formattedUsers);
          setFilteredUsers(formattedUsers);
        } else {
          // If no data, set empty arrays
          setUsers([]);
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users. Please try again.",
        });
        
        // Set empty array on error
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply filter
    if (filter !== "all") {
      switch (filter) {
        case "verified":
          result = result.filter(user => user.isEmailVerified);
          break;
        case "unverified":
          result = result.filter(user => !user.isEmailVerified);
          break;
        case "onboarded":
          result = result.filter(user => user.onboardingCompleted);
          break;
        case "incomplete":
          result = result.filter(user => !user.onboardingCompleted);
          break;
        case "admin":
          result = result.filter(user => user.role === "admin");
          break;
        case "email":
          result = result.filter(user => user.authMethod === "email");
          break;
        case "linkedin":
          result = result.filter(user => user.authMethod === "linkedin");
          break;
        case "google":
          result = result.filter(user => user.authMethod === "google");
          break;
        default:
          break;
      }
    }
    
    // Apply search
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        user =>
          user.firstName.toLowerCase().includes(lowercasedSearch) ||
          user.lastName.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, filter, searchTerm]);
  
  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  const handleDeleteUser = async (userId: string) => {
    try {
      // Don't allow deleting the admin account
      const userToDelete = users.find(user => user.id === userId);
      
      if (userToDelete && userToDelete.email === "dnyaneshwar@wantace.com") {
        toast({
          variant: "destructive",
          title: "Action Denied",
          description: "You cannot delete the primary admin account.",
        });
        return;
      }
      
      await axios.delete(
        `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
      
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    }
  };
  
  const handlePromoteToAdmin = async (userId: string) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/admin/users/${userId}/promote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, role: 'admin' }
            : user
        ));
        
        setFilteredUsers(filteredUsers.map(user => 
          user.id === userId 
            ? { ...user, role: 'admin' }
            : user
        ));
        
        toast({
          title: "User Promoted",
          description: "The user has been promoted to admin.",
        });
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to promote user. Please try again.",
      });
    }
  };
  
  const formatDate = (dateString: string) => {
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
        <p className="mt-4 text-muted-foreground">Loading users data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Total: {filteredUsers.length} users
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {filter === "all" ? "All Users" : 
                  filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Users By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("verified")}>
                Verified Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("unverified")}>
                Unverified Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("onboarded")}>
                Onboarding Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("incomplete")}>
                Onboarding Incomplete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("admin")}>
                Admin Users
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("email")}>
                Email Auth
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("google")}>
                Google Auth
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("linkedin")}>
                LinkedIn Auth
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              toast({
                title: "Export Started",
                description: "Exporting users data to CSV...",
              });
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Auth Method</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                    {user.role === "admin" && (
                      <Badge variant="secondary" className="ml-2">Admin</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant={user.isEmailVerified ? "default" : "destructive"}
                        className="w-fit"
                      >
                        {user.isEmailVerified ? "Verified" : "Unverified"}
                      </Badge>
                      <Badge 
                        variant={user.onboardingCompleted ? "outline" : "secondary"}
                        className="w-fit"
                      >
                        {user.onboardingCompleted ? "Onboarded" : "Incomplete"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${user.authMethod === "email" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                          user.authMethod === "google" ? "bg-red-50 text-red-700 border-red-200" : 
                          "bg-green-50 text-green-700 border-green-200"}
                      `}
                    >
                      {user.authMethod.charAt(0).toUpperCase() + user.authMethod.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                          <Mail className="h-4 w-4 mr-2" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" /> View Activity
                        </DropdownMenuItem>
                        {user.role !== "admin" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <UserPlus className="h-4 w-4 mr-2" /> Promote to Admin
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Promote User to Admin</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to promote {user.firstName} {user.lastName} to admin?
                                  This will give them full access to the admin panel.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handlePromoteToAdmin(user.id)}>
                                  Promote
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <X className="h-4 w-4 mr-2" /> Delete User
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.firstName} {user.lastName}?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
          Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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

export default UsersPage; 