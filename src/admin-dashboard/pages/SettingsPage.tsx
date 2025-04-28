import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Settings,
  Key,
  RefreshCw,
  Bell,
  Languages,
  Download,
  Video,
  Shield,
  Save,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("api");
  const [saving, setSaving] = useState(false);

  // API Settings
  const [openaiKey, setOpenaiKey] = useState("sk-*********************************");
  const [ytApiKey, setYtApiKey] = useState("AIza*********************************");
  const [defaultModel, setDefaultModel] = useState("gpt-4o-mini");

  // Content Settings
  const [maxVideos, setMaxVideos] = useState("100");
  const [maxContent, setMaxContent] = useState("500");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [contentPrompt, setContentPrompt] = useState(
    "Use this YouTube transcript to write a LinkedIn post that is engaging and professional."
  );

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReports, setDailyReports] = useState(false);
  const [userAlerts, setUserAlerts] = useState(true);
  const [contentAlerts, setContentAlerts] = useState(true);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [allowRegistration, setAllowRegistration] = useState(true);
  
  const handleSave = async (tab: string) => {
    setSaving(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Settings Saved",
        description: `Your ${tab} settings have been updated successfully.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Admin Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure system settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="api">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="content">
            <Video className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage API keys and service configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <div className="flex">
                  <Input
                    id="openai-key"
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => setOpenaiKey("")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Used for content generation and transcript summaries
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube-key">YouTube API Key</Label>
                <div className="flex">
                  <Input
                    id="youtube-key"
                    type="password"
                    value={ytApiKey}
                    onChange={(e) => setYtApiKey(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => setYtApiKey("")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Used for fetching YouTube video data
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model-select">Default AI Model</Label>
                <Select
                  value={defaultModel}
                  onValueChange={setDefaultModel}
                >
                  <SelectTrigger id="model-select">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Default model for content generation
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("API")} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save API Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>
                Configure content generation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="max-videos">Maximum Videos Per User</Label>
                  <Input
                    id="max-videos"
                    type="number"
                    value={maxVideos}
                    onChange={(e) => setMaxVideos(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Limit on saved videos per user
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-content">Maximum Content Per User</Label>
                  <Input
                    id="max-content"
                    type="number"
                    value={maxContent}
                    onChange={(e) => setMaxContent(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Limit on generated content items
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="language-select">Default Language</Label>
                <Select
                  value={defaultLanguage}
                  onValueChange={setDefaultLanguage}
                >
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-prompt">Default Content Prompt</Label>
                <Textarea
                  id="content-prompt"
                  value={contentPrompt}
                  onChange={(e) => setContentPrompt(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Template for AI-generated content
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("content")} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Content Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="block mb-1">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-reports" className="block mb-1">
                      Daily Summary Reports
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily activity reports
                    </p>
                  </div>
                  <Switch
                    id="daily-reports"
                    checked={dailyReports}
                    onCheckedChange={setDailyReports}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="user-alerts" className="block mb-1">
                      User Activity Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for new user registrations and logins
                    </p>
                  </div>
                  <Switch
                    id="user-alerts"
                    checked={userAlerts}
                    onCheckedChange={setUserAlerts}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="content-alerts" className="block mb-1">
                      Content Generation Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for new content creation
                    </p>
                  </div>
                  <Switch
                    id="content-alerts"
                    checked={contentAlerts}
                    onCheckedChange={setContentAlerts}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("notifications")} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor" className="block mb-1">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin users
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  How long before inactive users are logged out
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-registration" className="block mb-1">
                    Allow New Registrations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable user registration on the platform
                  </p>
                </div>
                <Switch
                  id="allow-registration"
                  checked={allowRegistration}
                  onCheckedChange={setAllowRegistration}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("security")} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage; 