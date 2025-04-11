import React, { useState } from 'react';
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
  LogOut
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

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  linkedInUrl?: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
}

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    profileImage: user?.profileImage,
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    bio: 'Product Marketing Manager with 5+ years experience in SaaS. Passionate about creating compelling content that drives engagement and conversions.',
    jobTitle: 'Product Marketing Manager',
    company: 'TechCorp Inc.'
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    newComments: true,
    postPerformance: true,
    contentIdeas: true,
    productUpdates: true
  });
  
  // Integration settings
  const [integrations, setIntegrations] = useState({
    linkedInConnected: true,
    lastSynced: '2 hours ago'
  });
  
  // Posting preferences
  const [postingPreferences, setPostingPreferences] = useState({
    defaultPostType: 'text',
    autoHashtags: true,
    schedulingDefault: '10:00',
    timezone: 'America/New_York'
  });
  
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };
  
  const handleProfileChange = (key: keyof UserProfile, value: string) => {
    setProfile({
      ...profile,
      [key]: value
    });
  };
  
  const handlePostPreferenceChange = (key: keyof typeof postingPreferences, value: string | boolean) => {
    setPostingPreferences({
      ...postingPreferences,
      [key]: value
    });
  };
  
  const saveProfile = () => {
    // API call would go here
    alert('Profile settings saved successfully');
  };
  
  const disconnectLinkedIn = () => {
    setIntegrations({
      ...integrations,
      linkedInConnected: false
    });
  };
  
  const reconnectLinkedIn = () => {
    setIntegrations({
      ...integrations,
      linkedInConnected: true,
      lastSynced: 'Just now'
    });
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
                {profile.profileImage ? (
                  <AvatarImage src={profile.profileImage} />
                ) : (
                  <AvatarFallback className="text-lg">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <h2 className="text-lg font-semibold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-neutral-medium text-sm">{profile.jobTitle}</p>
              <p className="text-neutral-medium text-sm">{profile.company}</p>
              
              <Separator className="my-4" />
              
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('profile')}>
                <User className="mr-2 h-4 w-4" /> Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('notifications')}>
                <Bell className="mr-2 h-4 w-4" /> Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('integrations')}>
                <LinkedinIcon className="mr-2 h-4 w-4" /> Integrations
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('preferences')}>
                <Clock className="mr-2 h-4 w-4" /> Posting Preferences
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('privacy')}>
                <Shield className="mr-2 h-4 w-4" /> Privacy
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('billing')}>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input 
                      id="jobTitle" 
                      value={profile.jobTitle} 
                      onChange={e => handleProfileChange('jobTitle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      value={profile.company} 
                      onChange={e => handleProfileChange('company', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedInUrl">LinkedIn Profile URL</Label>
                  <div className="flex">
                    <Input 
                      id="linkedInUrl" 
                      value={profile.linkedInUrl} 
                      onChange={e => handleProfileChange('linkedInUrl', e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button variant="outline" className="rounded-l-none border-l-0">
                      <LinkIcon size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={profile.bio} 
                    onChange={e => handleProfileChange('bio', e.target.value)}
                    rows={4}
                  />
                  <p className="text-neutral-medium text-xs">
                    This bio will be used in your LinkedIn post signatures and platform profile.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={saveProfile} className="bg-primary text-white">
                  <SaveIcon size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Weekly Email Digest</h3>
                      <p className="text-neutral-medium text-sm">Receive a weekly summary of your content performance</p>
                    </div>
                    <Switch 
                      checked={notifications.emailDigest} 
                      onCheckedChange={() => toggleNotification('emailDigest')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Comment Notifications</h3>
                      <p className="text-neutral-medium text-sm">Get notified when someone comments on your posts</p>
                    </div>
                    <Switch 
                      checked={notifications.newComments} 
                      onCheckedChange={() => toggleNotification('newComments')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Performance Alerts</h3>
                      <p className="text-neutral-medium text-sm">Receive alerts when your posts reach engagement milestones</p>
                    </div>
                    <Switch 
                      checked={notifications.postPerformance} 
                      onCheckedChange={() => toggleNotification('postPerformance')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Content Ideas</h3>
                      <p className="text-neutral-medium text-sm">Get suggestions for trending topics in your industry</p>
                    </div>
                    <Switch 
                      checked={notifications.contentIdeas} 
                      onCheckedChange={() => toggleNotification('contentIdeas')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Product Updates</h3>
                      <p className="text-neutral-medium text-sm">Stay informed about new features and improvements</p>
                    </div>
                    <Switch 
                      checked={notifications.productUpdates} 
                      onCheckedChange={() => toggleNotification('productUpdates')}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="bg-primary text-white ml-auto">
                  Save Notification Settings
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
                      <div className="w-12 h-12 bg-[#0a66c2] rounded-lg flex items-center justify-center">
                        <LinkedinIcon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">LinkedIn</h3>
                        <p className="text-neutral-medium text-sm">
                          {integrations.linkedInConnected 
                            ? `Connected • Last synced ${integrations.lastSynced}` 
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    
                    {integrations.linkedInConnected ? (
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-500 hover:bg-red-50"
                        onClick={disconnectLinkedIn}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        className="bg-[#0a66c2] text-white hover:bg-[#084482]"
                        onClick={reconnectLinkedIn}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                  
                  {integrations.linkedInConnected && (
                    <div className="mt-6 space-y-2">
                      <h4 className="text-sm font-medium">Connected to</h4>
                      <div className="p-3 border rounded bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {profile.firstName?.[0]}{profile.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{profile.firstName} {profile.lastName}</div>
                            <div className="text-neutral-medium text-xs">{profile.linkedInUrl}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
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
          
          {/* Posting Preferences */}
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>Posting Preferences</CardTitle>
                <CardDescription>
                  Customize your content creation defaults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultPostType">Default Post Type</Label>
                  <Select 
                    value={postingPreferences.defaultPostType}
                    onValueChange={(value) => handlePostPreferenceChange('defaultPostType', value)}
                  >
                    <SelectTrigger id="defaultPostType">
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Post</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Auto-generate Hashtags</h3>
                    <p className="text-neutral-medium text-sm">Automatically suggest relevant hashtags for your posts</p>
                  </div>
                  <Switch 
                    checked={postingPreferences.autoHashtags} 
                    onCheckedChange={(checked) => handlePostPreferenceChange('autoHashtags', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedulingDefault">Default Posting Time</Label>
                    <Input 
                      id="schedulingDefault" 
                      type="time" 
                      value={postingPreferences.schedulingDefault} 
                      onChange={e => handlePostPreferenceChange('schedulingDefault', e.target.value)}
                    />
                    <p className="text-neutral-medium text-xs">
                      Default time for scheduling posts
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={postingPreferences.timezone}
                      onValueChange={(value) => handlePostPreferenceChange('timezone', value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-neutral-medium text-xs">
                      Your local timezone for scheduling
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="bg-primary text-white ml-auto">
                  Save Preferences
                </Button>
              </CardFooter>
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
                  <Button variant="outline" className="w-full sm:w-auto mb-4">
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
                        <p className="text-neutral-medium text-sm">Download your data</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Export Data
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-medium text-sm">Delete all your content</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                        Delete Content
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-neutral-medium text-sm">Delete your account permanently</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                        <Trash2 size={14} className="mr-1" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Billing Settings */}
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
                    <Badge className="bg-accent text-white">Pro</Badge>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-neutral-medium">/month</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-accent h-4 w-4" />
                      <span className="text-sm">Unlimited LinkedIn posts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-accent h-4 w-4" />
                      <span className="text-sm">Up to 3 team members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-accent h-4 w-4" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-accent h-4 w-4" />
                      <span className="text-sm">AI content generation</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Payment Method</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-blue-600 rounded"></div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-neutral-medium text-xs">Expires 12/24</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <PencilLine size={14} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <Button variant="outline">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 