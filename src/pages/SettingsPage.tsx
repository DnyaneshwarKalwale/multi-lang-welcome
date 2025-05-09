import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  LinkedinIcon, 
  Globe, 
  PencilLine,
  LinkIcon,
  SaveIcon,
  Clock,
  Calendar,
  Trash2,
  LogOut,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { tokenManager } from '@/services/api';
import axios from 'axios';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

// API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';

const SettingsPage: React.FC = () => {
  const { user, logout, updateUserProfile, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [linkedInStatus, setLinkedInStatus] = useState({
    connected: !!localStorage.getItem('linkedin-login-token'),
    lastSynced: localStorage.getItem('linkedin-last-synced') || 'never'
  });
  
  // For deletion confirmation
  const [showDeleteContentDialog, setShowDeleteContentDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  
  // User profile state
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || ''
  });
  
  // Update profile from user data when it changes
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profilePicture: user.profilePicture || ''
      });
      
      // Update LinkedIn connection status
      setLinkedInStatus({
        connected: !!localStorage.getItem('linkedin-login-token') || !!user.linkedinConnected,
        lastSynced: localStorage.getItem('linkedin-last-synced') || 'never'
      });
    }
  }, [user]);
  
  const handleProfileChange = (key: keyof typeof profile, value: string) => {
    setProfile({
      ...profile,
      [key]: value
    });
  };
  
  // Function to save profile changes
  const saveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Validate inputs
      if (!profile.firstName || !profile.lastName || !profile.email) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Get token
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        logout();
        return;
      }
      
      // Make API call to update profile
      const response = await axios.put(
        `${API_URL}/users/profile`, 
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Update user context with new data
        updateUserProfile({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email
        });
        
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to disconnect LinkedIn
  const disconnectLinkedIn = async () => {
    try {
      // Clear LinkedIn tokens from localStorage
      localStorage.removeItem('linkedin-login-token');
      localStorage.removeItem('linkedin-refresh-token');
      localStorage.removeItem('linkedin-token-expiry');
      
      // Update user context if needed
      if (user?.linkedinConnected) {
        updateUserProfile({
          linkedinConnected: false,
          linkedinAccessToken: undefined
        });
      }
      
      // Update local state
      setLinkedInStatus({
        connected: false,
        lastSynced: 'never'
      });
      
      toast.success('LinkedIn disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      toast.error('Failed to disconnect LinkedIn');
    }
  };
  
  // Function to connect to LinkedIn
  const connectLinkedIn = () => {
    try {
      // Get the backend URL from environment variable or fallback to Render deployed URL
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      const baseUrl = baseApiUrl.replace('/api', '');
      
      // Store current URL in localStorage to redirect back after LinkedIn connection
      localStorage.setItem('redirectAfterAuth', '/dashboard/settings');
      
      // Redirect to LinkedIn OAuth endpoint
      window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
      toast.error('Failed to connect to LinkedIn');
    }
  };
  
  // Function to delete all content
  const deleteAllContent = async () => {
    try {
      setIsDeleting(true);
      
      // Get token
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        logout();
        return;
      }
      
      // Make API call to delete all content
      await axios.delete(`${API_URL}/users/content`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('All content deleted successfully. You have 10 days to recover it if needed.');
      setShowDeleteContentDialog(false);
    } catch (error: any) {
      console.error('Error deleting content:', error);
      toast.error(error.response?.data?.message || 'Failed to delete content');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Function to delete account
  const deleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Get token
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        logout();
        return;
      }
      
      // Make API call to delete account
      await axios.delete(`${API_URL}/users/account`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Account scheduled for deletion. You have 10 days to log in again to recover it.');
      setShowDeleteAccountDialog(false);
      
      // Log out the user
      logout();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Function to change password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    });
  };
  
  const changePassword = async () => {
    try {
      setIsChangingPassword(true);
      
      // Validate passwords
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error('Please fill in all password fields');
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('New password and confirmation do not match');
        return;
      }
      
      // Get token
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        logout();
        return;
      }
      
      // Make API call to change password
      await axios.put(
        `${API_URL}/users/change-password`, 
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      toast.success('Password changed successfully');
      setShowPasswordDialog(false);
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-black">Account Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex flex-col items-center py-4">
              <Avatar className="w-24 h-24 mb-4">
                {profile.profilePicture ? (
                  <AvatarImage src={profile.profilePicture} />
                ) : (
                  <AvatarFallback className="text-lg">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <h2 className="text-lg font-semibold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-neutral-medium text-sm">{profile.email}</p>
              
              <Separator className="my-4" />
              
              <Button variant="ghost" className={`w-full justify-start ${activeTab === 'profile' ? 'bg-muted' : ''}`} onClick={() => setActiveTab('profile')}>
                <User className="mr-2 h-4 w-4" /> Profile
              </Button>
              <Button variant="ghost" className={`w-full justify-start ${activeTab === 'integrations' ? 'bg-muted' : ''}`} onClick={() => setActiveTab('integrations')}>
                <LinkedinIcon className="mr-2 h-4 w-4" /> Integrations
              </Button>
              <Button variant="ghost" className={`w-full justify-start ${activeTab === 'privacy' ? 'bg-muted' : ''}`} onClick={() => setActiveTab('privacy')}>
                <Shield className="mr-2 h-4 w-4" /> Privacy
              </Button>
              <Button variant="ghost" className={`w-full justify-start ${activeTab === 'billing' ? 'bg-muted' : ''}`} onClick={() => setActiveTab('billing')}>
                <CreditCard className="mr-2 h-4 w-4" /> Billing
              </Button>
              
              <Separator className="my-4" />
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Main content area */}
        <div className="md:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your account information and public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profile.firstName} 
                      onChange={e => handleProfileChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profile.lastName} 
                      onChange={e => handleProfileChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email} 
                    onChange={e => handleProfileChange('email', e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button 
                  onClick={saveProfile} 
                  className="bg-primary text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                  <SaveIcon size={16} className="mr-2" />
                  Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* LinkedIn Integration */}
          {activeTab === 'integrations' && (
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Integration</CardTitle>
                <CardDescription>
                  Connect your LinkedIn account to publish content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 border rounded-lg bg-neutral-lightest">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0088FF] rounded-lg flex items-center justify-center">
                        <LinkedinIcon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">LinkedIn</h3>
                        <p className="text-neutral-medium text-sm">
                          {linkedInStatus.connected 
                            ? `Connected • Last synced ${linkedInStatus.lastSynced}` 
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    
                    {linkedInStatus.connected ? (
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-500 hover:bg-red-50"
                        onClick={disconnectLinkedIn}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        className="bg-[#0088FF] text-white hover:bg-[#0066CC]"
                        onClick={connectLinkedIn}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                  
                  {linkedInStatus.connected && (
                    <div className="mt-6 space-y-2">
                      <h4 className="text-sm font-medium">Connected to</h4>
                      <div className="p-3 border rounded bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            {profile.profilePicture ? (
                              <AvatarImage src={profile.profilePicture} />
                            ) : (
                            <AvatarFallback>
                              {profile.firstName?.[0]}{profile.lastName?.[0]}
                            </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{profile.firstName} {profile.lastName}</div>
                            <div className="text-neutral-medium text-xs">{profile.email}</div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('https://www.linkedin.com/in/me', '_blank')}
                        >
                          View Profile
                        </Button>
                      </div>
                      <p className="text-neutral-medium text-xs mt-4">
                        Your LinkedIn connection allows you to directly post content to your profile. You can revoke access at any time.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Manage your account security and data preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-4">Account Security</h3>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto mb-4"
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    Change Password
                  </Button>
                  <p className="text-neutral-medium text-sm">
                    We recommend changing your password regularly and using a strong, unique password.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-base font-medium mb-4">Data & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Delete all your content</p>
                        <p className="text-neutral-medium text-xs mt-1">Remove all your posts and content. This can be recovered within 10 days.</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => setShowDeleteContentDialog(true)}
                      >
                        Delete Content
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Delete your account</p>
                        <p className="text-neutral-medium text-xs mt-1">Your account will be scheduled for deletion. You can recover it within 10 days by logging in again.</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => setShowDeleteAccountDialog(true)}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Billing Section */}
          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and payment information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 border rounded-lg bg-neutral-lightest mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Current Plan</h3>
                    <Badge className="bg-accent text-white">Free</Badge>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-neutral-medium">/month</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-accent h-4 w-4" />
                      <span className="text-sm">Basic LinkedIn post management</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium mb-4">Billing Information</h3>
                  <div className="flex items-center justify-between">
                <div>
                      <p className="text-sm">Download billing details</p>
                      <p className="text-neutral-medium text-xs mt-1">Get a copy of your billing history and receipts</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download Billing Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Delete Content Confirmation Dialog */}
      <Dialog open={showDeleteContentDialog} onOpenChange={setShowDeleteContentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete All Content</DialogTitle>
            <DialogDescription>
              This action will delete all your posts and content. You will have 10 days to recover your data if needed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4 text-sm">To confirm, type <strong>DELETE</strong> below:</p>
            <Input 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteContentDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              disabled={confirmText !== 'DELETE' || isDeleting}
              onClick={deleteAllContent}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete All Content
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Your Account</DialogTitle>
            <DialogDescription>
              Your account will be scheduled for deletion. All your data will be permanently removed after 10 days.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mb-4 flex items-start">
              <AlertCircle className="text-amber-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-amber-800 text-sm">
                You can recover your account by logging in within 10 days, but after that period it will be permanently deleted.
              </p>
            </div>
            
            <p className="mb-4 text-sm">To confirm, type <strong>DELETE MY ACCOUNT</strong> below:</p>
            <Input 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE MY ACCOUNT to confirm"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteAccountDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              disabled={confirmText !== 'DELETE MY ACCOUNT' || isDeleting}
              onClick={deleteAccount}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to maintain account security
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button 
              disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              onClick={changePassword}
            >
              {isChangingPassword ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage; 