import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  ArrowLeft,
  FileText,
  Video,
  MessageSquare,
  Calendar,
  User,
  Mail,
  ExternalLink,
  Layers,
  Clock,
  Languages,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  authMethod: string;
  role: string;
  createdAt: string;
  profilePicture?: string;
  userLimit?: {
    limit: number;
    count: number;
  };
}

interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  savedAt: string;
  duration: string;
  hasTranscript: boolean;
  transcript?: string;
  formattedTranscript?: string[];
  language?: string;
  is_generated?: boolean;
}

interface SavedContent {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  videoId?: string;
  videoTitle?: string;
}

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [contents, setContents] = useState<SavedContent[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [selectedContent, setSelectedContent] = useState<SavedContent | null>(null);
  const { toast } = useToast();
  const [showTranscriptDialog, setShowTranscriptDialog] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [newLimit, setNewLimit] = useState<number>(0);
  const [isUpdatingLimit, setIsUpdatingLimit] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/admin/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`
            }
          }
        );
        
        if (userResponse.data && userResponse.data.data) {
          setUser(userResponse.data.data);
        }
        
        // Fetch user's videos
        const videosResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/admin/content/user/${userId}/videos`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`
            }
          }
        );
        
        if (videosResponse.data && videosResponse.data.data) {
          setVideos(videosResponse.data.data);
        }
        
        // Fetch user's saved content
        const contentResponse = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/admin/content/user/${userId}/content`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin-token")}`
            }
          }
        );
        
        if (contentResponse.data && contentResponse.data.data) {
          setContents(contentResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    }
  }, [userId, toast]);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'post-short':
        return 'Short Post';
      case 'post-long':
        return 'Long Post';
      case 'carousel':
        return 'Carousel';
      default:
        return type;
    }
  };
  
  const viewTranscript = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setShowTranscriptDialog(true);
  };

  const viewContent = (content: SavedContent) => {
    setSelectedContent(content);
    setShowContentDialog(true);
  };

  const openYouTubeVideo = (videoId: string) => {
    window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
  };
  
  const handleUpdateLimit = async () => {
    if (!user || !newLimit) return;
    
    try {
      setIsUpdatingLimit(true);
      await axios.patch(
        `${import.meta.env.VITE_API_URL || "https://backend-scripe.onrender.com"}/admin/user-limits/${user.id}`,
        { limit: newLimit },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`
          }
        }
      );
      
      // Update local state
      setUser(prev => prev ? {
        ...prev,
        userLimit: {
          ...prev.userLimit,
          limit: newLimit
        }
      } : null);
      
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
    } finally {
      setIsUpdatingLimit(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading user data...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <p className="text-lg font-medium">User not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/admin/users')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/admin/users')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          User Details
        </h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            YouTube Videos {videos.length > 0 && `(${videos.length})`}
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Generated Content {contents.length > 0 && `(${contents.length})`}
          </TabsTrigger>
          <TabsTrigger value="limits">Usage Limits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Basic details about the user</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{user.email}</p>
                    {user.isEmailVerified ? (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">Unverified</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                  <Badge variant={user.role === 'admin' ? "default" : "secondary"} className="mt-1">
                    {user.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Authentication Method</h3>
                  <p className="text-base">{user.authMethod || 'Email & Password'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Onboarding Status</h3>
                  {user.onboardingCompleted ? (
                    <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                      Incomplete
                    </Badge>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Usage Summary</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Saved Videos</span>
                      </div>
                      <p className="text-2xl font-bold mt-1">{videos.length}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Generated Content</span>
                      </div>
                      <p className="text-2xl font-bold mt-1">{contents.length}</p>
                    </div>
                  </div>
                </div>
                {user.userLimit && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Usage Limit</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-base">
                        {user.userLimit.count} / {user.userLimit.limit} requests used
                      </p>
                      <Badge variant={user.userLimit.count >= user.userLimit.limit ? "destructive" : "default"}>
                        {user.userLimit.count >= user.userLimit.limit ? 'Limit Reached' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved YouTube Videos</CardTitle>
              <CardDescription>Videos the user has saved with transcripts</CardDescription>
            </CardHeader>
            <CardContent>
              {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Video className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No saved videos</p>
                  <p className="text-sm text-muted-foreground mt-1">This user hasn't saved any YouTube videos yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden flex flex-col">
                      <div 
                        className="relative w-full h-40 cursor-pointer"
                        onClick={() => openYouTubeVideo(video.videoId)}
                      >
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded shadow-sm">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {video.duration || 'N/A'}
                        </div>
                        <div className="absolute inset-0 bg-blue-100/0 hover:bg-blue-100/30 transition-all flex items-center justify-center">
                          <ExternalLink className="h-8 w-8 text-blue-700 opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-semibold text-base line-clamp-2 mb-1">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {video.channelTitle || 'Unknown Channel'}
                        </p>
                        <div className="mt-auto space-y-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Saved on {formatDate(video.savedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Languages className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{video.language || 'Unknown language'}</span>
                            {video.is_generated && (
                              <Badge variant="outline" className="ml-auto text-xs">Auto-generated</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {video.hasTranscript ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm">
                              {video.hasTranscript ? 'Has transcript' : 'No transcript'}
                            </span>
                          </div>
                          {video.hasTranscript && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => viewTranscript(video)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              View Transcript
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>AI-generated content created by the user</CardDescription>
            </CardHeader>
            <CardContent>
              {contents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No generated content</p>
                  <p className="text-sm text-muted-foreground mt-1">This user hasn't created any content yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Source Video</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contents.map((content) => (
                        <TableRow key={content.id}>
                          <TableCell className="font-medium">{content.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {getContentTypeLabel(content.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(content.createdAt)}</TableCell>
                          <TableCell>
                            {content.videoId ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-0 h-auto font-normal underline text-blue-600"
                                onClick={() => openYouTubeVideo(content.videoId)}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {content.videoTitle || content.videoId}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewContent(content)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Limits</CardTitle>
              <CardDescription>Manage user's content generation limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.userLimit ? (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Current Usage</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ 
                              width: `${Math.min((user.userLimit.count / user.userLimit.limit) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {user.userLimit.count} / {user.userLimit.limit}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Update Limit</h3>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={newLimit}
                          onChange={(e) => setNewLimit(Number(e.target.value))}
                          placeholder="Enter new limit"
                          className="max-w-[200px]"
                        />
                        <Button 
                          onClick={handleUpdateLimit}
                          disabled={isUpdatingLimit || !newLimit}
                        >
                          {isUpdatingLimit ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            'Update Limit'
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No usage limits set for this user.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transcript Dialog */}
      <Dialog open={showTranscriptDialog} onOpenChange={setShowTranscriptDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Video Transcript</DialogTitle>
            <DialogDescription>
              {selectedVideo?.title} - {selectedVideo?.channelTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-4 mt-4 flex-grow overflow-hidden">
            <div className="w-full md:w-1/3 h-auto">
              <img 
                src={selectedVideo?.thumbnailUrl} 
                alt={selectedVideo?.title} 
                className="w-full aspect-video object-cover rounded-md"
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm">{selectedVideo?.duration || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Language:</span>
                  <span className="text-sm">{selectedVideo?.language || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Type:</span>
                  <span className="text-sm">
                    {selectedVideo?.is_generated ? 'Auto-generated' : 'Manual'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Saved:</span>
                  <span className="text-sm">{formatDate(selectedVideo?.savedAt || '')}</span>
                </div>
                <Button
                  className="w-full mt-2"
                  onClick={() => selectedVideo && openYouTubeVideo(selectedVideo.videoId)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open on YouTube
                </Button>
              </div>
            </div>
            <div className="w-full md:w-2/3 overflow-hidden flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Transcript</h3>
              <ScrollArea className="flex-grow h-[400px] p-4 border rounded-md bg-muted">
                {selectedVideo?.formattedTranscript && selectedVideo.formattedTranscript.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedVideo.formattedTranscript.map((line, idx) => (
                      <li key={idx} className="text-sm leading-relaxed">• {line}</li>
                    ))}
                  </ul>
                ) : selectedVideo?.transcript ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedVideo.transcript}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-center py-10">
                    No transcript available for this video.
                  </p>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Content Dialog */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedContent?.title}</DialogTitle>
            <DialogDescription>
              {getContentTypeLabel(selectedContent?.type || 'unknown')} - Created on {formatDate(selectedContent?.createdAt || '')}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex-grow overflow-hidden">
            <ScrollArea className="h-[500px] p-4 border rounded-md bg-muted">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedContent?.content || 'No content available.'}
              </p>
            </ScrollArea>
            {selectedContent?.videoId && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedContent && openYouTubeVideo(selectedContent.videoId || '')}
                >
                  <Video className="h-4 w-4 mr-2" />
                  View Source Video
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetailPage; 