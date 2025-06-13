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
  AlertCircle,
  Download,
  FileText,
  Linkedin
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
import { useNavigate } from 'react-router-dom';

// API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';

// Add interface for subscription info
interface SubscriptionInfo {
  planId: string;
  planName: string;
  status: string;
  expiresAt: string | null;
  price: number;
  credits: number;
  usedCredits: number;
}

// Add interface for payment method
interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  lastFour?: string;
  expiryDate?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
}

// Add interface for invoice
interface Invoice {
  id: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

// Add LinkedIn profile state and fetch logic
interface LinkedInProfile {
  id: string;
  username: string;
  name: string;
  profileImage: string;
  bio: string;
  location: string;
  url: string;
  joinedDate: string;
  connections: number;
  followers: number;
  verified: boolean;
}

const SettingsPage = () => {
  const { user, logout, updateUserProfile, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLinkedInConnectDialog, setShowLinkedInConnectDialog] = useState(false);
  const [showLinkedInDisconnectDialog, setShowLinkedInDisconnectDialog] = useState(false);
  
  // For deletion confirmation
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  
  // User profile state
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || ''
  });
  
  // Billing related states
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    planId: 'expired',
    planName: 'No Plan',
    status: 'inactive',
    expiresAt: null,
    price: 0,
    credits: 0,
    usedCredits: 0
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // LinkedIn status: use backend/user context, not just localStorage
  const [linkedInStatus, setLinkedInStatus] = useState({
    connected: !!user?.linkedinConnected
  });
  
  // LinkedIn profile state and fetch logic
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [loadingLinkedIn, setLoadingLinkedIn] = useState(false);
  
  // Update profile from user data when it changes
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profilePicture: user.profilePicture || ''
      });
      setLinkedInStatus({
        connected: !!user.linkedinConnected
      });
    }
  }, [user]);
  
  // Fetch subscription and billing data when tab changes to billing
  useEffect(() => {
    if (activeTab === 'billing') {
      fetchSubscriptionData();
      fetchPaymentMethods();
      fetchInvoices();
    }
  }, [activeTab]);
  
  // Fetch current subscription data
  const fetchSubscriptionData = async () => {
    try {
      setIsLoadingSubscription(true);
      
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      const response = await axios.get(
        `${API_URL}/user-limits/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        const userData = response.data.data;
        
        // Get plan price from plan ID
        const planPrice = getPlanPrice(userData.planId);
        
        setSubscriptionInfo({
          planId: userData.planId || 'expired',
          planName: userData.planName || 'No Plan',
          status: userData.status || 'inactive',
          expiresAt: userData.expiresAt || null,
          price: planPrice,
          credits: userData.limit || 0,
          usedCredits: userData.count || 0
        });
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setIsLoadingSubscription(false);
    }
  };
  
  // Helper function to get plan price based on plan ID
  const getPlanPrice = (planId: string): number => {
    const planPrices: {[key: string]: number} = {
      'trial': 0,
      'basic': 100,
      'premium': 200,
      'custom': 500
    };
    
    return planPrices[planId] || 0;
  };
  
  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) return;
      
      const response = await axios.get(`${API_URL}/payments/methods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPaymentMethods(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };
  
  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) return;
      
      const response = await axios.get(`${API_URL}/payments/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setInvoices(response.data.data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load billing history');
    }
  };
  
  // Handle setting default payment method
  const handleSetDefaultPayment = async (paymentId: string) => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        logout();
        return;
      }
      
      // Make API call to update default payment method
      const response = await axios.put(
        `${API_URL}/payments/methods/${paymentId}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
      // Update local state
      setPaymentMethods(methods => 
        methods.map(method => ({
          ...method,
          isDefault: method.id === paymentId
        }))
      );
      
      toast.success('Default payment method updated');
      } else {
        throw new Error(response.data.message || 'Failed to update payment method');
      }
    } catch (error: any) {
      console.error('Error setting default payment method:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update payment method');
    }
  };
  
  // Handle downloading invoice
  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        logout();
        return;
      }
      
      const response = await axios.get(
        `${API_URL}/payments/invoices/${invoice.id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice download started');
    } catch (error: any) {
      console.error('Error downloading invoice:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to download invoice');
    }
  };
  
  // Handle downloading billing history
  const handleDownloadBillingHistory = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        logout();
        return;
      }
      
      const response = await axios.get(
        `${API_URL}/payments/history/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `billing-history-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Billing history download started');
    } catch (error: any) {
      console.error('Error downloading billing history:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to download billing history');
    }
  };
  
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
      
      // Validate inputs - lastName is now optional
      if (!profile.firstName || !profile.email) {
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
  
  // Function to disconnect LinkedIn (calls backend to revoke and clears all tokens)
  const disconnectLinkedIn = async () => {
    try {
      setShowLinkedInDisconnectDialog(false);
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        logout();
        return;
      }
      // Call backend to revoke LinkedIn
      await axios.post(`${API_URL}/auth/linkedin/disconnect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      setLinkedInStatus({
        connected: false
      });
      toast.success('LinkedIn disconnected and permissions revoked.');
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      toast.error('Failed to disconnect LinkedIn');
    }
  };
  
  // Function to connect to LinkedIn (show warning first)
  const connectLinkedIn = () => {
    setShowLinkedInConnectDialog(true);
  };
  const confirmConnectLinkedIn = () => {
    setShowLinkedInConnectDialog(false);
    try {
      const baseApiUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
      const baseUrl = baseApiUrl.replace('/api', '');
      localStorage.setItem('redirectAfterAuth', '/dashboard/settings');
      window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
      toast.error('Failed to connect to LinkedIn');
    }
  };
  
  // Function to delete account
  const deleteAccount = async () => {
    try {
      setIsDeleting(true);
      const token = tokenManager.getToken();
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        logout();
        return;
      }
      
      // Only try to disconnect LinkedIn if the user is connected with LinkedIn
      if (user?.linkedinConnected || user?.authMethod === 'linkedin') {
        try {
          await axios.post(`${API_URL}/auth/linkedin/disconnect`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.error('Error disconnecting LinkedIn:', error);
          // Continue with account deletion even if LinkedIn disconnect fails
        }
      }
      
      // Call backend to delete account with auth method info
      const response = await axios.delete(`${API_URL}/users/account`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: {
          authMethod: user?.authMethod // Send auth method to backend
        }
      });
      
      if (response.data.success) {
        // Clear all local storage data
        localStorage.clear();
        
        toast.success('Account scheduled for deletion. All data and logins will be removed.');
      setShowDeleteAccountDialog(false);
        setConfirmText('');
      
        // Logout user
      logout();
        
        // Redirect to home page
        navigate('/');
      } else {
        throw new Error(response.data.message || 'Failed to delete account');
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      // More specific error message based on auth method
      if (user?.authMethod === 'google') {
        toast.error('Unable to delete account. Please try again later.');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Failed to delete account');
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user && tokenManager.getToken()) {
      fetchLinkedInProfile();
    }
  }, [user]);

  const fetchLinkedInProfile = async () => {
    setLoadingLinkedIn(true);
      const token = tokenManager.getToken();
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    try {
      // Try to fetch basic LinkedIn profile first
      const basicProfileRes = await axios.get(`${apiBaseUrl}/linkedin/basic-profile`, { headers });
      if (basicProfileRes.data && basicProfileRes.data.data) {
        setLinkedInProfile(basicProfileRes.data.data);
        setLoadingLinkedIn(false);
        return;
      }
    } catch (error) {
      // Try fallback
      try {
        const profileRes = await axios.get(`${apiBaseUrl}/linkedin/profile`, { headers });
        if (profileRes.data && profileRes.data.data) {
          setLinkedInProfile(profileRes.data.data);
        }
      } catch (err) {
        setLinkedInProfile(null);
      }
    }
    setLoadingLinkedIn(false);
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
                    <Label htmlFor="lastName">Last Name <span className="text-gray-400 text-sm">(optional)</span></Label>
                    <Input 
                      id="lastName" 
                      value={profile.lastName} 
                      onChange={e => handleProfileChange('lastName', e.target.value)}
                      placeholder="Enter your last name (optional)"
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
                        <Linkedin className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">LinkedIn</h3>
                        <p className="text-neutral-medium text-sm">
                          {user?.authMethod === 'google' && !user?.linkedinConnected ? (
                            'Not connected'
                          ) : user?.authMethod === 'linkedin' || user?.linkedinConnected ? (
                            'Connected'
                          ) : (
                            'Not connected'
                          )}
                        </p>
                      </div>
                    </div>
                    {user?.authMethod === 'google' && !user?.linkedinConnected ? (
                      <Button 
                        className="bg-[#0088FF] text-white hover:bg-[#0066CC]"
                        onClick={connectLinkedIn}
                      >
                        Connect
                      </Button>
                    ) : user?.authMethod === 'linkedin' || user?.linkedinConnected ? (
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-500 hover:bg-red-50"
                        onClick={() => setShowLinkedInDisconnectDialog(true)}
                      >
                        Disconnect
                      </Button>
                    ) : null}
                  </div>
                  {/* Show LinkedIn profile if connected */}
                  {user?.authMethod === 'linkedin' || user?.linkedinConnected ? (
                    <div className="mt-6 space-y-2">
                      <h4 className="text-sm font-medium">Connected LinkedIn Profile</h4>
                      <div className="p-3 border rounded bg-white flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                          {linkedInProfile?.profileImage ? (
                            <AvatarImage src={linkedInProfile.profileImage} />
                            ) : (
                            <AvatarFallback>
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                          <div className="font-medium">{linkedInProfile?.name || user.firstName + ' ' + user.lastName}</div>
                          <div className="text-neutral-medium text-xs">{linkedInProfile?.location || 'LinkedIn User'}</div>
                          </div>
                        <a
                          href={linkedInProfile?.url || 'https://linkedin.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-blue-600 hover:underline text-xs"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  ) : null}
                  {user?.authMethod === 'google' && !user?.linkedinConnected && (
                    <div className="mt-6 text-xs text-gray-500">
                      Connect your LinkedIn account to publish content directly.
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
                  <h3 className="text-base font-medium mb-4">Data & Privacy</h3>
                  <div className="space-y-4">
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
                  {isLoadingSubscription ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Current Plan</h3>
                        <Badge className={subscriptionInfo.planId === 'expired' ? 'bg-gray-500' : 'bg-primary'}>
                          {subscriptionInfo.planName || 'Free'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold">${subscriptionInfo.price || 0}</span>
                        <span className="text-neutral-medium">/month</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-primary h-4 w-4" />
                          <span className="text-sm">{subscriptionInfo.credits || 0} Credits Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-primary h-4 w-4" />
                          <span className="text-sm">
                            {subscriptionInfo.status === 'active' 
                              ? 'Active subscription' 
                              : 'No active subscription'}
                          </span>
                        </div>
                        {subscriptionInfo.expiresAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="text-primary h-4 w-4" />
                            <span className="text-sm">Expires on {new Date(subscriptionInfo.expiresAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => navigate('/dashboard/billing')}
                      >
                        Manage Subscription
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Payment Methods */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium mb-4">Payment Methods</h3>
                  {paymentMethods.length > 0 ? (
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {method.type === 'card' ? (
                              <div className="h-10 w-14 bg-gray-100 rounded flex items-center justify-center">
                                <CreditCard className="h-5 w-5" />
                              </div>
                            ) : (
                              <div className="h-10 w-14 bg-blue-100 rounded flex items-center justify-center">
                                <svg className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M7.076 21.337H2.47a1.006 1.006 0 0 1-1.065-.977V3.668c0-.075 0-.154.008-.231v-.008A1.044 1.044 0 0 1 2.47 2.663h4.606a1.006 1.006 0 0 1 1.065.977v16.684a1.006 1.006 0 0 1-1.065.977v.036zm7.949 0h-4.606a1.006 1.006 0 0 1-1.065-.977V3.668c0-.075 0-.154.008-.231v-.008a1.044 1.044 0 0 1 1.057-.766h4.606a1.006 1.006 0 0 1 1.065.977v16.684a1.006 1.006 0 0 1-1.065.977v.036zm7.948 0h-4.606a1.006 1.006 0 0 1-1.065-.977V3.668c0-.075 0-.154.008-.231v-.008a1.044 1.044 0 0 1 1.057-.766h4.606a1.006 1.006 0 0 1 1.065.977v16.684a1.006 1.006 0 0 1-1.065.977v.036z" />
                                </svg>
                              </div>
                            )}
                            <div>
                              <p className="font-medium">
                                {method.type === 'card'
                                  ? `${method.brand} ****${method.lastFour}`
                                  : `PayPal (${method.email})`}
                              </p>
                              {method.type === 'card' && method.expiryDate && (
                                <p className="text-xs text-gray-500">Expires {method.expiryDate}</p>
                              )}
                            </div>
                          </div>
                          {method.isDefault ? (
                            <Badge variant="outline" className="bg-primary/5 text-primary">Default</Badge>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleSetDefaultPayment(method.id)}>
                              Set Default
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 border rounded-lg">
                      <CreditCard className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                      <p className="mb-4">No payment methods found</p>
                      <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/billing')}>
                        Add Payment Method
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Billing History */}
                <div className="space-y-4">
                  <h3 className="font-medium mb-4">Billing Information</h3>
                  {invoices.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {invoices.slice(0, 3).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(invoice.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 border rounded-lg mb-4">
                      <FileText className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                      <p>No invoices available</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Download billing details</p>
                      <p className="text-neutral-medium text-xs mt-1">Get a copy of your billing history and receipts</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={invoices.length === 0}
                      onClick={handleDownloadBillingHistory}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
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
      
      {/* LinkedIn Connect Warning Dialog */}
      <Dialog open={showLinkedInConnectDialog} onOpenChange={setShowLinkedInConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect LinkedIn</DialogTitle>
            <DialogDescription>
              You will be redirected to LinkedIn to grant permissions. Do you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkedInConnectDialog(false)}>Cancel</Button>
            <Button onClick={confirmConnectLinkedIn}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* LinkedIn Disconnect Warning Dialog */}
      <Dialog open={showLinkedInDisconnectDialog} onOpenChange={setShowLinkedInDisconnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect LinkedIn</DialogTitle>
            <DialogDescription>
              This will revoke all LinkedIn permissions and remove all tokens. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkedInDisconnectDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={disconnectLinkedIn}>Disconnect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage; 