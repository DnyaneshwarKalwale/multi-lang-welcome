import axios from 'axios';
import { tokenManager } from '@/services/api';

// Import the API_URL from the services/api.ts file or define it here
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';

// Helper function to get the best available LinkedIn token
const getLinkedInToken = (accessToken?: string): string => {
  // First try the provided access token (highest priority)
  if (accessToken) return accessToken;
  
  // Directly get LinkedIn token from localStorage with the correct key
  const linkedinToken = localStorage.getItem('linkedin-login-token');
  if (linkedinToken) return linkedinToken;
  
  // No token available
  return '';
};

// Function to handle LinkedIn token refresh
const refreshLinkedInToken = (): void => {
  // Clear existing token
  localStorage.removeItem('linkedin-login-token');
  
  // Get the backend URL from environment variable or fallback to Render deployed URL
  const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
  const baseUrl = baseApiUrl.replace('/api', '');
  
  // Store current URL in localStorage to redirect back after LinkedIn reconnection
  localStorage.setItem('redirectAfterAuth', window.location.pathname);
  
  // Redirect to LinkedIn OAuth endpoint
  window.location.href = `${baseUrl}/api/auth/linkedin-direct`;
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

// Main API wrapper for LinkedIn API
export class LinkedInApi {
  private API_URL = `${API_URL}/linkedin`; // Use the full backend URL

  // Simplified test connectivity method that avoids unnecessary API calls
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
            hasLinkedInToken: !!localStorage.getItem('linkedin-login-token')
          }
        };
      }
      
      // Return authentication is present - we'll verify connection when actually needed
      return {
        success: true,
        message: 'LinkedIn token available',
        details: {
          authMethod: localStorage.getItem('auth-method') || 'unknown',
          hasToken: true
        }
      };
    } catch (error: any) {
      // General error
      return {
        success: false,
        message: 'Error checking LinkedIn connectivity',
        errorType: 'general_error',
        details: {
          error: error.message,
          authMethod: localStorage.getItem('auth-method') || 'unknown'
        }
      };
    }
  }

  // Get the current user's LinkedIn ID
  async getUserLinkedInId(accessToken?: string): Promise<string> {
    try {
      const token = getLinkedInToken(accessToken);
      
      if (!token) {
        throw new Error("LinkedIn token not available. Please login again.");
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      const response = await axios.get(`${this.API_URL}/profile`, { headers });
      return response.data.id;
    } catch (error: any) {
      console.error('Error getting LinkedIn user ID:', error);
      
      // Handle token expiration
      if (error.response && error.response.data && 
          (error.response.status === 401 || 
           (error.response.status === 500 && 
            error.response.data.details && 
            error.response.data.details.includes('token has expired')))) {
        console.error('LinkedIn token expired. Redirecting to reauthorization.');
        refreshLinkedInToken();
      }
      
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
      
      if (!token) {
        throw new Error("LinkedIn token not available. Please login again.");
      }

      // Create a post with just text content
      const postData = {
        postContent: text,
        visibility: visibility
      };

      // Send post request to our backend which will handle the LinkedIn API
      const response = await axios.post(`${this.API_URL}/post`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating LinkedIn post:', error);
      
      // Check for token expiration in the response
      if (error.response && error.response.data) {
        console.error('LinkedIn API error response:', error.response.data);
        
        // Handle token expiration
        if (error.response.status === 401 || 
            (error.response.status === 500 && 
             error.response.data.details && 
             error.response.data.details.includes('token has expired'))) {
          console.error('LinkedIn token expired. Redirecting to reauthorization.');
          refreshLinkedInToken();
          throw new Error("LinkedIn authentication expired. Please login again.");
        }
      }
      
      throw error;
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
      
      if (!token) {
        throw new Error("LinkedIn token not available. Please login again.");
      }

      console.log('Creating post with Cloudinary image:', {
        text,
        imageUrl,
        fileName,
        imageTitle
      });

      // Make sure we have a valid Cloudinary URL
      if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
        throw new Error('Invalid Cloudinary image URL');
      }

      // Get a direct image URL with no transformations if needed
      let directImageUrl = imageUrl;
      if (imageUrl.includes('/upload/')) {
        // Extract the base URL and file path to create a direct URL
        const parts = imageUrl.split('/upload/');
        if (parts.length === 2) {
          // Remove any transformations in the URL
          directImageUrl = `${parts[0]}/upload/${parts[1].split('/').pop()}`;
        }
      }

      console.log('Using direct image URL:', directImageUrl);

      // Since backend expects local files but we have a Cloudinary URL,
      // we'll use a text post fallback if the image post fails
      try {
        // Try directly with Cloudinary URL first
        const imagePostData = {
          postContent: text,
          imagePath: directImageUrl,
          imageTitle: imageTitle || fileName,
          imageDescription: "Shared via Scripe",
          isCloudinaryImage: true, // Flag to tell backend this is a Cloudinary URL
          visibility: visibility
        };

        // Send post request to our backend
        const response = await axios.post(`${this.API_URL}/post`, imagePostData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        return response.data;
      } catch (imageError) {
        console.error('Error posting with Cloudinary image:', imageError);
        
        // Fall back to text-only post if image fails
        console.log('Falling back to text-only post');
        const textPostData = {
          postContent: `${text}\n\n${imageTitle}: ${directImageUrl}`,
          visibility: visibility
        };

        const textResponse = await axios.post(`${this.API_URL}/post`, textPostData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        return textResponse.data;
      }
    } catch (error: any) {
      console.error('Error creating LinkedIn Cloudinary image post:', error);
      
      // Handle token expiration
      if (error.response && error.response.data && 
          (error.response.status === 401 || 
           (error.response.status === 500 && 
            error.response.data.details && 
            error.response.data.details.includes('token has expired')))) {
        console.error('LinkedIn token expired. Redirecting to reauthorization.');
        refreshLinkedInToken();
        throw new Error("LinkedIn authentication expired. Please login again.");
      }
      
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
      
      
      if (!token) {
        throw new Error("LinkedIn token not available. Please login again.");
      }

      // Send article post data to our backend
      const postData = {
        postContent: text,
        articleUrl: articleUrl,
        articleTitle: articleTitle || 'Shared Article',
        articleDescription: articleDescription || 'Shared via Scripe',
        visibility: visibility
      };

      // Use our backend endpoint for LinkedIn posting
      const response = await axios.post(`${this.API_URL}/post-article`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error publishing to LinkedIn:', error);
      
      // Handle token expiration
      if (error.response && error.response.data && 
          (error.response.status === 401 || 
           (error.response.status === 500 && 
            error.response.data.details && 
            error.response.data.details.includes('token has expired')))) {
        console.error('LinkedIn token expired. Redirecting to reauthorization.');
        refreshLinkedInToken();
        throw new Error("LinkedIn authentication expired. Please login again.");
      }
      
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
      
      if (!token) {
        throw new Error("LinkedIn token not available. Please login again.");
      }

      // Create poll data
      const postData = {
        postContent: text,
        pollOptions: pollOptions,
        pollDuration: durationDays * 86400 // Convert days to seconds
      };

      // Send poll post to our backend
      const response = await axios.post(`${this.API_URL}/post-poll`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating LinkedIn poll:', error);
      
      // Handle token expiration
      if (error.response && error.response.data && 
          (error.response.status === 401 || 
           (error.response.status === 500 && 
            error.response.data.details && 
            error.response.data.details.includes('token has expired')))) {
        console.error('LinkedIn token expired. Redirecting to reauthorization.');
        refreshLinkedInToken();
        throw new Error("LinkedIn authentication expired. Please login again.");
      }
      
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
      const response = await axios.put(`${this.API_URL}/posts/${postId}`, updates, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Change post status (draft -> scheduled, draft -> published, etc.)
  async changePostStatus(postId: string, newStatus: 'draft' | 'scheduled' | 'published', scheduledTime?: string): Promise<any> {
    try {
      const data: any = { status: newStatus };
      if (scheduledTime && newStatus === 'scheduled') {
        data.scheduledTime = scheduledTime;
      }
      
      const response = await axios.put(`${this.API_URL}/posts/${postId}/status`, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`Error changing post status to ${newStatus}:`, error);
      throw error;
    }
  }
  
  // Delete a post
  async deletePost(postId: string): Promise<any> {
    try {
      const response = await axios.delete(`${this.API_URL}/posts/${postId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Publish a draft or scheduled post immediately
  async publishNow(postId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/posts/${postId}/publish`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    }
  }
}

export const linkedInApi = new LinkedInApi(); 