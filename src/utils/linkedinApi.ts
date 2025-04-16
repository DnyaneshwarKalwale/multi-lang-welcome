import axios from 'axios';
import { tokenManager } from '@/services/api';
import { toast } from 'sonner';

// Import the API_URL from the services/api.ts file or define it here
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';

// Helper function to get the best available LinkedIn token
const getLinkedInToken = (accessToken?: string): string => {
  console.log('Getting LinkedIn token with provided token:', !!accessToken);
  
  // First try the provided access token (highest priority)
  if (accessToken) {
    console.log('Using provided access token');
    return accessToken;
  }
  
  // Then try LinkedIn-specific token from tokenManager
  const linkedinToken = tokenManager.getToken('linkedin');
  console.log('LinkedIn token from tokenManager:', !!linkedinToken);
  
  // If tokenManager fails, try direct localStorage access as fallback
  if (!linkedinToken) {
    const directToken = localStorage.getItem('linkedin-login-token');
    console.log('Direct LinkedIn token from localStorage:', !!directToken);
    if (directToken) return directToken;
  } else {
    return linkedinToken;
  }
  
  // No token available
  console.warn('No LinkedIn token available');
  return '';
};

// Types for LinkedIn API requests
export interface LinkedInPostRequest {
  author: string; // Format: urn:li:person:{memberId}
  lifecycleState: 'PUBLISHED' | 'DRAFT';
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: string;
      };
      shareMediaCategory: 'NONE' | 'IMAGE' | 'ARTICLE' | 'VIDEO' | 'DOCUMENT';
      media?: Array<{
        status?: 'READY';
        description?: {
          text: string;
        };
        originalUrl?: string;
        title?: {
          text: string;
        };
        media?: string; // Format: urn:li:image:{asset}
      }>;
    };
  };
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN';
  };
  distribution?: {
    linkedInDistributionTarget?: {};
  };
}

export interface LinkedInScheduledPostRequest extends LinkedInPostRequest {
  scheduledTime: number; // Unix timestamp in milliseconds
}

export interface LinkedInPollPostRequest {
  content: {
    author: string; // Format: urn:li:person:{memberId}
    commentary: string;
    pollPlatformSettings: {
      duration: number; // Duration in seconds
    };
    pollOptions: string[]; // Array of poll options (2-4)
  };
}

export interface LinkedInImageUploadResponse {
  value: {
    asset: string;
    uploadUrlExpiresAt: number;
    uploadUrl: string;
  };
}

export interface LinkedInPostResponse {
  id: string;
  activity: string;
  owner: string;
  created: {
    time: number;
  };
  lastModified: {
    time: number;
  };
}

export interface ScheduledPostData {
  id?: string;
  title: string;
  content: string;
  hashtags?: string[];
  postImage?: any;
  isPollActive?: boolean;
  pollOptions?: string[];
  pollDuration?: number;
  slides?: {id: string, content: string}[];
  visibility?: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN';
  scheduledTime?: string;
  createdAt?: string;
  updatedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
  provider: string;
  userId?: string;
}

// Add helper to redirect to LinkedIn reconnection
const redirectToLinkedInAuth = () => {
  // Get the backend URL from environment variable or fallback to Render deployed URL
  const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
  const baseUrl = baseApiUrl.replace('/api', '');
  
  // Store current URL in localStorage to redirect back after LinkedIn connection
  localStorage.setItem('redirectAfterAuth', window.location.pathname);
  
  // Redirect to LinkedIn OAuth endpoint
  window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
};

// Main API wrapper for LinkedIn API
class LinkedInApi {
  private API_URL = `${API_URL}/linkedin`; // Use the full backend URL

  // Expose getLinkedInToken as a public method
  getToken(accessToken?: string): string {
    return getLinkedInToken(accessToken);
  }

  // Debug method to check token status
  async debugTokenStatus(): Promise<{
    hasToken: boolean,
    tokenValue: string,
    authMethod: string | null,
    localStorage: Record<string, string | null>
  }> {
    // Get the token using our helper
    const token = getLinkedInToken();
    
    // Get auth method
    const authMethod = localStorage.getItem('auth-method');
    
    // Check all relevant localStorage values
    const relevantStorage = {
      'auth-method': localStorage.getItem('auth-method'),
      'linkedin-login-token': localStorage.getItem('linkedin-login-token')?.substring(0, 20) + '...' || null,
      'google-login-token': localStorage.getItem('google-login-token')?.substring(0, 20) + '...' || null,
    };
    
    return {
      hasToken: !!token,
      tokenValue: token ? token.substring(0, 20) + '...' : '',
      authMethod,
      localStorage: relevantStorage
    };
  }

  // Add a test connectivity method
  async testConnection(): Promise<{ success: boolean; message: string; details?: any; errorType?: string }> {
    try {
      // Get the best available LinkedIn token
      const token = getLinkedInToken();
      
      if (!token) {
        return { 
          success: false, 
          message: 'No authentication token found',
          errorType: 'auth_missing',
          details: {
            authMethod: localStorage.getItem('auth-method') || 'none',
            hasLinkedInToken: !!tokenManager.getToken('linkedin')
          }
        };
      }
      
      // Skip health check since it may not exist on this backend
      // Instead, directly test the LinkedIn profile endpoint
      try {
        const linkedinProfile = await this.getUserLinkedInId();
        return {
          success: true,
          message: 'LinkedIn connectivity working correctly',
          details: {
            linkedinId: linkedinProfile,
            authMethod: localStorage.getItem('auth-method') || 'unknown'
          }
        };
      } catch (linkedinError: any) {
        // Determine specific error type for LinkedIn errors
        let errorType = 'linkedin_api_error';
        let detailedMessage = 'LinkedIn API connection failed';
        
        if (linkedinError.response) {
          const status = linkedinError.response.status;
          
          if (status === 401) {
            errorType = 'linkedin_unauthorized';
            detailedMessage = 'LinkedIn authentication failed. Your token may have expired.';
          } else if (status === 403) {
            errorType = 'linkedin_forbidden';
            detailedMessage = 'LinkedIn access denied. You may need additional permissions.';
          } else if (status === 404) {
            errorType = 'linkedin_not_found';
            detailedMessage = 'LinkedIn resource not found.';
          } else if (status >= 500) {
            errorType = 'linkedin_server_error';
            detailedMessage = 'LinkedIn servers are experiencing issues.';
          }
        } else if (linkedinError.message && linkedinError.message.includes('Network Error')) {
          errorType = 'network_error';
          detailedMessage = 'Network connection error. Please check your internet connection.';
        }
        
        // Test if at least the base API is reachable
        try {
          // Try a simple request to the backend base URL
          await axios.get(`${API_URL}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          // Base API is reachable but LinkedIn endpoints failed
          return {
            success: false,
            message: detailedMessage,
            errorType: errorType,
            details: {
              error: linkedinError.message,
              status: linkedinError.response?.status,
              authMethod: localStorage.getItem('auth-method') || 'unknown'
            }
          };
        } catch (baseApiError: any) {
          // Even the base API can't be reached
          return {
            success: false,
            message: 'Backend server connection failed',
            errorType: 'backend_unreachable',
            details: {
              error: baseApiError.message,
              apiUrl: API_URL,
              authMethod: localStorage.getItem('auth-method') || 'unknown'
            }
          };
        }
      }
    } catch (error: any) {
      // General error
      return {
        success: false,
        message: 'Backend server connection failed',
        errorType: 'general_error',
        details: {
          error: error.message,
          apiUrl: API_URL,
          authMethod: localStorage.getItem('auth-method') || 'unknown'
        }
      };
    }
  }

  // Get the current user's LinkedIn ID
  async getUserLinkedInId(accessToken?: string): Promise<string> {
    try {
      const token = getLinkedInToken(accessToken);
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      // Try to get the ID from the profile endpoint
      try {
        const response = await axios.get(`${this.API_URL}/profile`, { headers });
        return response.data.id;
      } catch (profileError) {
        console.error('Error fetching LinkedIn profile:', profileError);
        
        // If the /profile endpoint fails, try the /basic-profile endpoint
        try {
          const basicResponse = await axios.get(`${this.API_URL}/basic-profile`, { headers });
          if (basicResponse.data && basicResponse.data.data && basicResponse.data.data.id) {
            return basicResponse.data.data.id;
          }
        } catch (basicProfileError) {
          console.error('Error fetching LinkedIn basic profile:', basicProfileError);
        }
        
        // Check for token expiration in the profile error
        if (profileError?.response?.status === 500 && 
            profileError?.response?.data?.details?.includes('LinkedIn access token has expired')) {
          this.handleApiError(profileError, 'fetching LinkedIn profile');
        }
        
        // If all API calls fail, use a default mock ID for development
        console.warn('Using mock LinkedIn ID for development purposes');
        return 'mock-linkedin-id-12345';
      }
    } catch (error) {
      console.error('Error getting LinkedIn user ID:', error);
      throw error;
    }
  }

  // Create a simple text post
  async createTextPost(
    text: string, 
    visibility: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN' = 'PUBLIC',
    accessToken?: string
  ): Promise<LinkedInPostResponse> {
    try {
      const token = getLinkedInToken(accessToken);

      // Create a post with just text content
      const postData = {
        postContent: text,
        visibility: visibility,
        accessToken: accessToken // Pass the token directly
      };

      // Send post request to our backend which will handle the LinkedIn API
      const response = await axios.post(`${this.API_URL}/post`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      return this.handleApiError(error, 'creating LinkedIn post');
    }
  }

  // Initialize image upload to LinkedIn
  async initializeImageUpload(title: string): Promise<LinkedInImageUploadResponse> {
    try {
      const response = await axios.post(`${this.API_URL}/images/initializeUpload`, {
        initializeUploadRequest: {
          owner: 'urn:li:person:' + await this.getUserLinkedInId(),
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent'
            }
          ]
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error initializing LinkedIn image upload:', error);
      throw error;
    }
  }

  // Upload image to LinkedIn using the upload URL
  async uploadImageToLinkedIn(uploadUrl: string, imageFile: File): Promise<void> {
    try {
      await axios.put(uploadUrl, imageFile, {
        headers: {
          'Content-Type': imageFile.type
        }
      });
    } catch (error) {
      console.error('Error uploading image to LinkedIn:', error);
      throw error;
    }
  }

  // Create a post with an image
  async createImagePost(text: string, imageFile: File, imageDescription: string = '', visibility: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN' = 'PUBLIC'): Promise<LinkedInPostResponse> {
    try {
      // Step 1: Initialize image upload
      const uploadResponse = await this.initializeImageUpload(imageFile.name);
      
      // Step 2: Upload the image to provided URL
      await this.uploadImageToLinkedIn(uploadResponse.value.uploadUrl, imageFile);
      
      // Step 3: Create post with the uploaded image
      const userId = await this.getUserLinkedInId();
      
      const postData: LinkedInPostRequest = {
        author: `urn:li:person:${userId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text
            },
            shareMediaCategory: 'IMAGE',
            media: [
              {
                status: 'READY',
                description: {
                  text: imageDescription || imageFile.name
                },
                media: uploadResponse.value.asset,
                title: {
                  text: imageFile.name
                }
              }
            ]
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': visibility
        }
      };

      const response = await axios.post(`${this.API_URL}/posts`, postData);
      return response.data;
    } catch (error) {
      console.error('Error creating LinkedIn image post:', error);
      throw error;
    }
  }

  // Create a post with an image from Cloudinary
  async createCloudinaryImagePost(
    text: string, 
    imageUrl: string, 
    fileName: string = 'image', 
    imageTitle: string = 'Shared image', 
    visibility: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN' = 'PUBLIC',
    accessToken?: string
  ): Promise<LinkedInPostResponse> {
    try {
      const token = getLinkedInToken(accessToken);

      // Create a post with the Cloudinary image URL
      const postData = {
        postContent: text,
        imagePath: imageUrl,
        imageTitle: imageTitle || fileName,
        imageDescription: "Shared via Scripe",
        visibility: visibility,
        accessToken: accessToken // Pass the token directly
      };

      // Send post request to our backend which will handle the LinkedIn API complexity
      const response = await axios.post(`${this.API_URL}/post`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating LinkedIn Cloudinary image post:', error);
      throw error;
    }
  }

  // Create a post with an article link
  async createArticlePost(
    text: string,
    articleUrl: string,
    articleTitle: string = '',
    articleDescription: string = '',
    visibility: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN' = 'PUBLIC',
    accessToken?: string
  ): Promise<LinkedInPostResponse> {
    try {
      const token = getLinkedInToken(accessToken);

      // Send article post data to our backend
      const postData = {
        postContent: text,
        articleUrl: articleUrl,
        articleTitle: articleTitle || 'Shared Article',
        articleDescription: articleDescription || 'Shared via Scripe',
        visibility: visibility,
        accessToken: accessToken // Pass the token directly
      };

      // Use our backend endpoint for LinkedIn posting
      const response = await axios.post(`${this.API_URL}/post-article`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error publishing to LinkedIn:', error);
      throw error;
    }
  }

  // Schedule a post for later
  async schedulePost(postData: LinkedInPostRequest, scheduledTime: Date): Promise<any> {
    try {
      const scheduledRequest: LinkedInScheduledPostRequest = {
        ...postData,
        scheduledTime: scheduledTime.getTime()
      };
      
      const response = await axios.post(`${this.API_URL}/posts/schedule`, scheduledRequest);
      return response.data;
    } catch (error) {
      console.error('Error scheduling LinkedIn post:', error);
      throw error;
    }
  }

  // Create a poll post
  async createPollPost(
    text: string, 
    pollOptions: string[], 
    durationDays: number = 7,
    accessToken?: string
  ): Promise<any> {
    try {
      const token = getLinkedInToken(accessToken);

      // Create poll data
      const postData = {
        postContent: text,
        pollOptions: pollOptions,
        pollDuration: durationDays * 86400, // Convert days to seconds
        accessToken: accessToken // Pass the token directly
      };

      // Send poll post to our backend
      const response = await axios.post(`${this.API_URL}/post-poll`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating LinkedIn poll:', error);
      throw error;
    }
  }

  // Delete a post
  async deletePost(postId: string): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/posts/${postId}`);
    } catch (error) {
      console.error('Error deleting LinkedIn post:', error);
      throw error;
    }
  }

  // Get user's posts
  async getUserPosts(limit: number = 10): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}/posts?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting LinkedIn user posts:', error);
      throw error;
    }
  }

  // Get drafts and scheduled posts
  async getDraftsAndScheduled(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}/posts/all`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error getting drafts and scheduled posts:', error);
      throw error;
    }
  }

  // Delete a draft
  async deleteDraft(draftId: string): Promise<boolean> {
    try {
      await axios.delete(`${this.API_URL}/posts/draft/${draftId}`, {
        withCredentials: true
      });
      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw error;
    }
  }

  // Delete a scheduled post
  async deleteScheduledPost(postId: string): Promise<boolean> {
    try {
      await axios.delete(`${this.API_URL}/posts/scheduled/${postId}`, {
        withCredentials: true
      });
      return true;
    } catch (error) {
      console.error('Error deleting scheduled post:', error);
      throw error;
    }
  }

  // Save a published post
  async savePublishedPost(post: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/posts/published`, post, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error saving published post:', error);
      throw error;
    }
  }

  // Save a draft post
  async saveDraft(postData: ScheduledPostData): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/posts/draft`, postData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  }

  // Save a scheduled post
  async saveScheduledPost(postData: ScheduledPostData): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/posts/scheduled`, postData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling post:', error);
      throw error;
    }
  }

  // Update a draft or scheduled post
  async updatePost(postId: string, updates: Partial<ScheduledPostData>): Promise<any> {
    try {
      const response = await axios.put(`${this.API_URL}/posts/${postId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Publish a draft or scheduled post immediately
  async publishNow(postId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/posts/${postId}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    }
  }

  // Universal method to publish various post types to LinkedIn
  async publishPostToLinkedIn(post: any): Promise<any> {
    try {
      const token = getLinkedInToken();
      
      // Determine post type and content
      const postData: {
        postContent: string;
        visibility: string;
        accessToken: string;
        imagePath?: string;
        imageTitle?: string;
        imageDescription?: string;
        pollOptions?: string[];
        pollDuration?: number;
      } = {
        postContent: post.content || '',
        visibility: post.visibility || 'PUBLIC',
        accessToken: token
      };
      
      // Add image if available
      if (post.postImage) {
        postData.imagePath = post.postImage.secure_url;
        postData.imageTitle = post.title || 'Shared image';
        postData.imageDescription = "Shared via Scripe";
      }
      
      // Add poll options if it's a poll
      if (post.isPollActive && post.pollOptions && post.pollOptions.length > 0) {
        postData.pollOptions = post.pollOptions;
        postData.pollDuration = post.pollDuration * 86400 || 604800; // Default to 7 days in seconds
      }
      
      // Use the appropriate endpoint for the post type
      const response = await axios.post(`${this.API_URL}/post`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error publishing to LinkedIn:', error);
      throw error;
    }
  }

  // Public method to reconnect LinkedIn
  reconnectLinkedIn(): void {
    redirectToLinkedInAuth();
  }

  // Add a method to handle expired token errors
  private handleApiError(error: any, actionLabel: string = 'performing action'): never {
    console.error(`Error ${actionLabel}:`, error);
    
    // Check if it's a token expiration error
    if (error?.response?.status === 500 && 
        error?.response?.data?.details?.includes('LinkedIn access token has expired')) {
      
      console.log('LinkedIn token expired, prompting for reconnection');
      
      // Show toast message using imported toast from sonner
      toast.error('Your LinkedIn connection has expired. Redirecting to reconnect...');
      
      // Redirect after a small delay to allow the user to see the message
      setTimeout(() => {
        redirectToLinkedInAuth();
      }, 2000);
    }
    
    throw error;
  }
}

export const linkedInApi = new LinkedInApi(); 