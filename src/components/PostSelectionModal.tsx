import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, MessageSquare, Folder, Check, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TweetCard from "@/components/twitter/TweetCard";
import TweetThread from "@/components/twitter/TweetThread";
import { Tweet as TwitterTweet, Thread as TwitterThread } from '@/utils/twitterTypes';
import axios from 'axios';
import { tokenManager } from '@/services/api';

// LinkedIn Post Content Component (moved from ScraperPage)
const LinkedInPostContent: React.FC<{ content: string }> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return content.length > 250 && !isExpanded ? (
    <>
      <p className="whitespace-pre-line break-words">
        {content.substring(0, 250)}...
      </p>
      <button 
        className="text-blue-500 hover:text-blue-600 text-xs mt-1"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(true);
        }}
      >
        Show more
      </button>
    </>
  ) : (
    <p className="whitespace-pre-line break-words">{content}</p>
  );
};

interface PostSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySelection: (selectedContent: string) => void;
  selectedPostsCount?: number;
}

const PostSelectionModal: React.FC<PostSelectionModalProps> = ({
  isOpen,
  onClose,
  onApplySelection,
  selectedPostsCount = 0
}) => {
  const { toast } = useToast();
  
  // State for posts data
  const [savedPostsForSelection, setSavedPostsForSelection] = useState<{
    twitter: any[];
    linkedin: any[];
  }>({
    twitter: [],
    linkedin: []
  });
  
  // State for selections
  const [selectedPostsForStyle, setSelectedPostsForStyle] = useState<{
    twitter: Set<string>;
    linkedin: Set<string>;
  }>({
    twitter: new Set(),
    linkedin: new Set()
  });
  
  // State for view mode
  const [currentViewMode, setCurrentViewMode] = useState<'folders' | 'posts'>('folders');
  const [currentOpenFolder, setCurrentOpenFolder] = useState<{ platform: 'twitter' | 'linkedin'; author: string } | null>(null);
  const [isLoadingPostsForSelection, setIsLoadingPostsForSelection] = useState(false);

  // Load saved posts when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSavedPostsForSelection();
    }
  }, [isOpen]);

  // Function to load saved posts for style selection
  const loadSavedPostsForSelection = async () => {
    setIsLoadingPostsForSelection(true);
    try {
      const authMethod = localStorage.getItem('auth-method');
      const token = authMethod ? tokenManager.getToken(authMethod) : null;
      
      if (!token) {
        console.warn('No auth token found for loading posts');
        setIsLoadingPostsForSelection(false);
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const headers = { 'Authorization': `Bearer ${token}` };

      // Load Twitter posts
      try {
        const twitterApiUrl = baseUrl.endsWith('/api') 
          ? `${baseUrl}/twitter/saved`
          : `${baseUrl}/api/twitter/saved`;
        const twitterResponse = await axios.get(twitterApiUrl, { headers });
        
        if (twitterResponse.data.success) {
          const twitterPosts = twitterResponse.data.data || [];
          setSavedPostsForSelection(prev => ({ ...prev, twitter: twitterPosts }));
        }
      } catch (error) {
        console.error('Error loading Twitter posts for selection:', error);
      }

      // Load LinkedIn posts
      try {
        const linkedinApiUrl = baseUrl.endsWith('/api') 
          ? `${baseUrl}/linkedin/saved-posts`
          : `${baseUrl}/api/linkedin/saved-posts`;
        const linkedinResponse = await axios.get(linkedinApiUrl, { headers });
        
        if (linkedinResponse.data.success) {
          const linkedinPosts = linkedinResponse.data.data || [];
          setSavedPostsForSelection(prev => ({ ...prev, linkedin: linkedinPosts }));
        }
      } catch (error) {
        console.error('Error loading LinkedIn posts for selection:', error);
      }
    } catch (error) {
      console.error('Error in loadSavedPostsForSelection:', error);
    } finally {
      setIsLoadingPostsForSelection(false);
    }
  };

  // Function to handle post selection toggle
  const togglePostSelection = (platform: 'twitter' | 'linkedin', postId: string) => {
    setSelectedPostsForStyle(prev => {
      const newSelection = { ...prev };
      const currentSet = new Set(newSelection[platform]);
      
      if (currentSet.has(postId)) {
        currentSet.delete(postId);
      } else {
        currentSet.add(postId);
      }
      
      newSelection[platform] = currentSet;
      return newSelection;
    });
  };

  // Function to organize posts by author
  const organizePostsByAuthor = () => {
    const twitterAuthors = new Map<string, any[]>();
    const linkedinAuthors = new Map<string, any[]>();

    // Group Twitter posts by author
    savedPostsForSelection.twitter.forEach(post => {
      const username = post.author?.username || post.user?.username || 'Unknown User';
      if (!twitterAuthors.has(username)) {
        twitterAuthors.set(username, []);
      }
      twitterAuthors.get(username)!.push(post);
    });

    // Group LinkedIn posts by author
    savedPostsForSelection.linkedin.forEach(post => {
      const authorName = post.author?.name || post.authorName || 'Unknown Author';
      if (!linkedinAuthors.has(authorName)) {
        linkedinAuthors.set(authorName, []);
      }
      linkedinAuthors.get(authorName)!.push(post);
    });

    return { twitterAuthors, linkedinAuthors };
  };

  // Function to select all posts from an author (folder selection)
  const selectAllPostsFromAuthor = (platform: 'twitter' | 'linkedin', authorName: string) => {
    const { twitterAuthors, linkedinAuthors } = organizePostsByAuthor();
    
    setSelectedPostsForStyle(prev => {
      const newSelection = { ...prev };
      const currentSet = new Set(newSelection[platform]);
      
      // Get all posts from this author
      const authorPosts = platform === 'twitter' 
        ? twitterAuthors.get(authorName) || []
        : linkedinAuthors.get(authorName) || [];
      
      // Check if all posts from this author are already selected
      const allPostIds = authorPosts.map(post => {
        if (platform === 'twitter') {
          return post.id || post._id || post.tweet_id;
        } else {
          return post.id || post._id || post.mongoId;
        }
      });
      
      const allSelected = allPostIds.every(id => currentSet.has(id));
      
      if (allSelected) {
        // Deselect all posts from this author
        allPostIds.forEach(id => currentSet.delete(id));
      } else {
        // Select all posts from this author
        allPostIds.forEach(id => currentSet.add(id));
      }
      
      newSelection[platform] = currentSet;
      return newSelection;
    });
  };

  // Function to open a folder (show posts from specific author)
  const openAuthorFolder = (platform: 'twitter' | 'linkedin', authorName: string) => {
    setCurrentOpenFolder({ platform, author: authorName });
    setCurrentViewMode('posts');
  };

  // Function to close folder and go back to folder view
  const closeFolderAndBackToFolders = () => {
    setCurrentOpenFolder(null);
    setCurrentViewMode('folders');
  };

  // Function to get selected posts content for style analysis
  const getSelectedPostsContent = () => {
    const selectedContent: string[] = [];
    
    // Get Twitter content
    selectedPostsForStyle.twitter.forEach(postId => {
      const post = savedPostsForSelection.twitter.find(p => 
        p.id === postId || p._id === postId || p.tweet_id === postId
      );
      if (post?.text || post?.full_text) {
        selectedContent.push(post.text || post.full_text);
      }
    });
    
    // Get LinkedIn content
    selectedPostsForStyle.linkedin.forEach(postId => {
      const post = savedPostsForSelection.linkedin.find(p => 
        p.id === postId || p._id === postId || p.mongoId === postId
      );
      if (post?.content || post?.text) {
        selectedContent.push(post.content || post.text);
      }
    });
    
    return selectedContent.join('\n\n---\n\n');
  };

  // Function to apply selected posts and close modal
  const applySelectedPosts = () => {
    const content = getSelectedPostsContent();
    onApplySelection(content);
    onClose();
    
    toast({
      title: "Posts attached",
      description: `Selected ${selectedPostsForStyle.twitter.size + selectedPostsForStyle.linkedin.size} posts for style analysis`,
    });
  };

  // Helper function to check if all posts from an author are selected
  const areAllPostsSelected = (platform: 'twitter' | 'linkedin', posts: any[]) => {
    const allPostIds = posts.map(post => {
      if (platform === 'twitter') {
        return post.id || post._id || post.tweet_id;
      } else {
        return post.id || post._id || post.mongoId;
      }
    });
    return allPostIds.every(id => selectedPostsForStyle[platform].has(id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[80vh] flex flex-col shadow-xl">
        <div className="p-4 border-b bg-blue-50 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-blue-800">
                {currentViewMode === 'folders' ? 'Select Posts for Writing Style Analysis' : 
                 `Posts from ${currentOpenFolder?.author || 'Author'}`}
              </h3>
              <p className="text-sm text-blue-600">
                {currentViewMode === 'folders' 
                  ? 'Click folder names to browse posts, or click circles to select all posts from that author'
                  : 'Select individual posts from this author, or go back to select from other authors'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentViewMode === 'posts' && (
              <Button variant="outline" size="sm" onClick={closeFolderAndBackToFolders}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Folders
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => {
              onClose();
              setCurrentViewMode('folders');
              setCurrentOpenFolder(null);
            }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingPostsForSelection ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Loading your saved posts...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">How this works:</h4>
                <p>
                  {currentViewMode === 'folders' 
                    ? 'Click the circle icon to select all posts from an author, or click the folder name to browse individual posts from that author.'
                    : 'Select individual posts that represent your preferred writing style. The AI will analyze these to match your tone and style.'
                  }
                </p>
              </div>

              {currentViewMode === 'folders' ? (
                // Folder View (Authors)
                <>
                  {(() => {
                    const { twitterAuthors, linkedinAuthors } = organizePostsByAuthor();
                    
                    return (
                      <>
                        {/* Twitter Authors Section */}
                        {twitterAuthors.size > 0 && (
                          <div>
                            <h4 className="text-md font-medium mb-3 text-gray-900 flex items-center gap-2">
                              <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">𝕏</span>
                              </div>
                              Twitter Authors ({twitterAuthors.size})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                              {Array.from(twitterAuthors.entries()).map(([authorName, posts]) => (
                                <div 
                                  key={authorName}
                                  className="border rounded-lg p-3 transition-all hover:shadow-md hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="flex-shrink-0 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        selectAllPostsFromAuthor('twitter', authorName);
                                      }}
                                    >
                                      {areAllPostsSelected('twitter', posts) ? (
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                          <Check className="h-3 w-3 text-white" />
                                        </div>
                                      ) : (
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-blue-400"></div>
                                      )}
                                    </div>
                                    <div 
                                      className="flex-1 min-w-0 cursor-pointer"
                                      onClick={() => openAuthorFolder('twitter', authorName)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Folder className="h-4 w-4 text-gray-500" />
                                        <p className="font-medium text-sm truncate">@{authorName}</p>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {posts.length} post{posts.length !== 1 ? 's' : ''}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* LinkedIn Authors Section */}
                        {linkedinAuthors.size > 0 && (
                          <div>
                            <h4 className="text-md font-medium mb-3 text-gray-900 flex items-center gap-2">
                              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">in</span>
                              </div>
                              LinkedIn Authors ({linkedinAuthors.size})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                              {Array.from(linkedinAuthors.entries()).map(([authorName, posts]) => (
                                <div 
                                  key={authorName}
                                  className="border rounded-lg p-3 transition-all hover:shadow-md hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="flex-shrink-0 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        selectAllPostsFromAuthor('linkedin', authorName);
                                      }}
                                    >
                                      {areAllPostsSelected('linkedin', posts) ? (
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                          <Check className="h-3 w-3 text-white" />
                                        </div>
                                      ) : (
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-blue-400"></div>
                                      )}
                                    </div>
                                    <div 
                                      className="flex-1 min-w-0 cursor-pointer"
                                      onClick={() => openAuthorFolder('linkedin', authorName)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Folder className="h-4 w-4 text-gray-500" />
                                        <p className="font-medium text-sm truncate">{authorName}</p>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {posts.length} post{posts.length !== 1 ? 's' : ''}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {twitterAuthors.size === 0 && linkedinAuthors.size === 0 && (
                          <div className="text-center py-8">
                            <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No saved posts found</p>
                            <p className="text-sm text-gray-400 mt-1">Start by saving some posts from the scraper page</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : (
                // Individual Posts View - Show rich post UI like ScraperPage
                <>
                  {(() => {
                    if (!currentOpenFolder) return null;
                    
                    const { twitterAuthors, linkedinAuthors } = organizePostsByAuthor();
                    const posts = currentOpenFolder.platform === 'twitter' 
                      ? twitterAuthors.get(currentOpenFolder.author) || []
                      : linkedinAuthors.get(currentOpenFolder.author) || [];
                    
                    return (
                      <div>
                        <h4 className="text-md font-medium mb-3 text-gray-900 flex items-center gap-2">
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${
                            currentOpenFolder.platform === 'twitter' ? 'bg-black' : 'bg-blue-600'
                          }`}>
                            <span className="text-white text-xs font-bold">
                              {currentOpenFolder.platform === 'twitter' ? '𝕏' : 'in'}
                            </span>
                          </div>
                          {currentOpenFolder.platform === 'twitter' ? 'Twitter' : 'LinkedIn'} Posts from {currentOpenFolder.author} ({posts.length})
                        </h4>
                        
                        {currentOpenFolder.platform === 'twitter' ? (
                          // Twitter Posts with Rich UI - Same as ScraperPage
                          <div className="columns-1 md:columns-2 gap-6 max-h-80 overflow-y-auto">
                            {posts.map((post, index) => {
                              const postId = post.id || post._id || post.tweet_id || index.toString();
                              const isSelected = selectedPostsForStyle.twitter.has(postId);
                              
                              return (
                                <div 
                                  key={post._id || index}
                                  className="break-inside-avoid mb-6 w-full relative"
                                >
                                  <div 
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                      isSelected ? "ring-2 ring-blue-500" : ""
                                    }`}
                                    onClick={() => togglePostSelection('twitter', postId)}
                                  >
                                    {/* Selection indicator */}
                                    <div className="absolute top-2 left-2 z-10">
                                      {isSelected ? (
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                          <Check className="h-3 w-3 text-white" />
                                        </div>
                                      ) : (
                                        <div className="w-5 h-5 border-2 border-gray-300 bg-white rounded-full hover:border-blue-400"></div>
                                      )}
                                    </div>
                                    
                                    {/* Check if it's a thread or single tweet */}
                                    {'tweets' in post ? (
                                      <TweetThread thread={post as TwitterThread} />
                                    ) : (
                                      <TweetCard tweet={post as TwitterTweet} />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          // LinkedIn Posts with Rich UI - Same as ScraperPage
                          <div className="columns-1 md:columns-2 xl:columns-3 gap-6 max-h-80 overflow-y-auto">
                            {posts.map((post, index) => {
                              const postData = post.postData || post;
                              const postId = post.id || post._id || post.mongoId || index.toString();
                              const isSelected = selectedPostsForStyle.linkedin.has(postId);
                              
                              return (
                                <div 
                                  key={`post-${postData.id}-${index}`} 
                                  className="break-inside-avoid mb-6 relative"
                                >
                                  <div 
                                    className={`linkedin-post-card bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                                      isSelected ? "ring-2 ring-blue-500" : ""
                                    }`}
                                    onClick={() => togglePostSelection('linkedin', postId)}
                                  >
                                    {/* Selection indicator */}
                                    <div className="absolute top-2 left-2 z-10">
                                      {isSelected ? (
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                          <Check className="h-3 w-3 text-white" />
                                        </div>
                                      ) : (
                                        <div className="w-5 h-5 border-2 border-gray-300 bg-white rounded-full hover:border-blue-400"></div>
                                      )}
                                    </div>
                                    
                                    {/* LinkedIn Post Header */}
                                    <div className="p-4 pb-3">
                                      <div className="flex items-start gap-3">
                                        <img 
                                          src={postData.authorAvatar || 'https://via.placeholder.com/40'} 
                                          alt={postData.author}
                                          className="w-10 h-10 rounded-full object-cover" 
                                        />
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-sm text-gray-900">{postData.author}</h4>
                                          <p className="text-xs text-gray-600 line-clamp-2">{postData.authorHeadline}</p>
                                          <p className="text-xs text-gray-400 mt-1">
                                            Saved • {new Date(postData.savedAt || post.createdAt).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* LinkedIn Post Content */}
                                    <div className="p-4 pt-0">
                                      <div className="space-y-4">
                                        <div className="linkedin-post-content">
                                          <LinkedInPostContent content={postData.content || ''} />
                                        </div>
                                        
                                        {/* Media Display */}
                                        {postData.media && postData.media.length > 0 && (
                                          <div className="relative">
                                            {postData.media.length === 1 ? (
                                              <img 
                                                src={postData.media[0].url} 
                                                alt="Post media" 
                                                className="w-full rounded-lg object-cover max-h-96"
                                              />
                                            ) : (
                                              <div className="grid grid-cols-2 gap-2">
                                                {postData.media.slice(0, 4).map((media: any, idx: number) => (
                                                  <img 
                                                    key={idx}
                                                    src={media.url} 
                                                    alt={`Post media ${idx + 1}`} 
                                                    className="w-full h-32 rounded-lg object-cover"
                                                  />
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {posts.length === 0 && (
                          <div className="text-center py-8">
                            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No posts found for this author</p>
                            <p className="text-sm text-gray-400 mt-1">Go back to select other authors</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Selected: {selectedPostsForStyle.twitter.size + selectedPostsForStyle.linkedin.size} posts
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                onClose();
                setCurrentViewMode('folders');
                setCurrentOpenFolder(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={applySelectedPosts}
              disabled={selectedPostsForStyle.twitter.size + selectedPostsForStyle.linkedin.size === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply Selected Posts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSelectionModal; 