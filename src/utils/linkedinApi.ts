import axios from 'axios';
import { tokenManager } from '@/services/api';

// Import the API_URL from the services/api.ts file
const API_URL = import.meta.env.VITE_API_URL;

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
  // Clear existing tokens
  localStorage.removeItem('linkedin-login-token');
  localStorage.removeItem('linkedin-refresh-token');
  localStorage.removeItem('linkedin-token-expiry');
  
  // Get the base API URL and normalize it
  let baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api';
  
  // Remove trailing slashes and /api suffix to get the clean base URL
  baseUrl = baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
  
  // Store current URL in localStorage to redirect back after LinkedIn reconnection
  localStorage.setItem('redirectAfterAuth', window.location.pathname);
  
  // Add a timestamp to prevent caching issues with OAuth redirect
  const timestamp = Date.now();
  
  // Construct the clean LinkedIn auth URL
  const authUrl = `${baseUrl}/api/auth/linkedin-direct?t=${timestamp}`;
  
  console.log('LinkedIn token refresh URL:', authUrl);
  // Redirect to LinkedIn OAuth endpoint with timestamp to force new auth flow
  window.location.href = authUrl;
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
class LinkedInApi {
  private API_URL = `${API_URL}/linkedin`; // Use the full backend URL
  private POSTS_API_URL = `${API_URL}/posts`; // Add new posts API URL

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
      
      // Handle token expiration or revocation
      if (error.response && error.response.data) {
        // Check for LinkedIn token revocation error codes
        const isTokenRevoked = error.response.data.details && 
          (error.response.data.details.code === 'REVOKED_ACCESS_TOKEN' || 
           error.response.data.details.serviceErrorCode === 65601);
        
        if (error.response.status === 401 || 
            isTokenRevoked || 
           (error.response.status === 500 && 
            error.response.data.details && 
            error.response.data.details.includes('token has expired'))) {
          console.error('LinkedIn token expired or revoked. Clearing tokens and redirecting to reauthorization.');
          
          // Clear all LinkedIn tokens from localStorage
          localStorage.removeItem('linkedin-login-token');
          localStorage.removeItem('linkedin-refresh-token');
          localStorage.removeItem('linkedin-token-expiry');
          
          // Redirect to reauthorization
        refreshLinkedInToken();
        }
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
      
      // Check for token expiration or revocation in the response
      if (error.response && error.response.data) {
        console.error('LinkedIn API error response:', error.response.data);
        
        // Check for LinkedIn token revocation error codes
        const isTokenRevoked = error.response.data.details && 
          (error.response.data.details.code === 'REVOKED_ACCESS_TOKEN' || 
           error.response.data.details.serviceErrorCode === 65601);
        
        // Handle token expiration or revocation
        if (error.response.status === 401 || 
            isTokenRevoked || 
            (error.response.status === 500 && 
             error.response.data.details && 
             error.response.data.details.includes('token has expired'))) {
          console.error('LinkedIn token expired or revoked. Clearing tokens and redirecting to reauthorization.');
          
          // Clear all LinkedIn tokens from localStorage
          localStorage.removeItem('linkedin-login-token');
          localStorage.removeItem('linkedin-refresh-token');
          localStorage.removeItem('linkedin-token-expiry');
          
          // Redirect to reauthorization
          refreshLinkedInToken();
          throw new Error("LinkedIn authentication expired or was revoked. Please login again.");
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

      // Ensure we're using the direct resource URL without transformations
      // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{extension}
      let directImageUrl = imageUrl;
      
      // Extract the clean public ID to use as a direct URL
      if (imageUrl.includes('/upload/')) {
        try {
          // Split the URL to get the base and the public ID parts
          const urlParts = imageUrl.split('/upload/');
          if (urlParts.length === 2) {
            // The base always stays the same
            const baseUrl = urlParts[0];
            
            // For the public ID, take everything after the last '/' to ensure we get just the filename
            let publicId = urlParts[1];
            
            // If there are any query parameters, remove them
            if (publicId.includes('?')) {
              publicId = publicId.split('?')[0];
            }
            
            // Create a clean direct URL with no transformations
            directImageUrl = `${baseUrl}/upload/${publicId}`;
          }
        } catch (urlError) {
          // If there's an error parsing the URL, try with the original URL
        }
      }

      console.log('Using direct image URL:', directImageUrl);

      // Send the post with the Cloudinary image
      const imagePostData = {
        postContent: text,
        imagePath: directImageUrl,
        imageTitle: imageTitle || fileName,
        imageDescription: "Shared via BrandOut",
        isCloudinaryImage: true, // Flag to tell backend this is a Cloudinary URL
        visibility: visibility
      };

      try {
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
        
        // If we get a 422 error, it means the backend couldn't process the image
        if (imageError.response && imageError.response.status === 422) {
          console.log('Backend could not process the image, falling back to text-only post');
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
        
        // For other errors, throw so they can be handled
        throw imageError;
      }
    } catch (error: any) {
      console.error('Error creating LinkedIn Cloudinary image post:', error);
      
      // Handle token expiration or revocation
      if (error.response && error.response.data) {
        // Check for LinkedIn token revocation error codes
        const isTokenRevoked = error.response.data.details && 
          (error.response.data.details.code === 'REVOKED_ACCESS_TOKEN' || 
           error.response.data.details.serviceErrorCode === 65601);
        
        if (error.response.status === 401 || 
            isTokenRevoked || 
           (error.response.status === 500 && 
            error.response.data.details && 
            error.response.data.details.includes('token has expired'))) {
          console.error('LinkedIn token expired or revoked. Clearing tokens and redirecting to reauthorization.');
          
          // Clear all LinkedIn tokens from localStorage
          localStorage.removeItem('linkedin-login-token');
          localStorage.removeItem('linkedin-refresh-token');
          localStorage.removeItem('linkedin-token-expiry');
          
          // Redirect to reauthorization
        refreshLinkedInToken();
          throw new Error("LinkedIn authentication expired or was revoked. Please login again.");
        }
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
        articleDescription: articleDescription || 'Shared via BrandOut',
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
      
      // Handle token expiration or revocation
      if (error.response && error.response.data) {
        // Check for LinkedIn token revocation error codes
        const isTokenRevoked = error.response.data.details && 
          (error.response.data.details.code === 'REVOKED_ACCESS_TOKEN' || 
           error.response.data.details.serviceErrorCode === 65601);
        
        if (error.response.status === 401 || 
            isTokenRevoked || 
           (error.response.status === 500 && 
            error.response.data.details && 
            error.response.data.details.includes('token has expired'))) {
          console.error('LinkedIn token expired or revoked. Clearing tokens and redirecting to reauthorization.');
          
          // Clear all LinkedIn tokens from localStorage
          localStorage.removeItem('linkedin-login-token');
          localStorage.removeItem('linkedin-refresh-token');
          localStorage.removeItem('linkedin-token-expiry');
          
          // Redirect to reauthorization
        refreshLinkedInToken();
          throw new Error("LinkedIn authentication expired or was revoked. Please login again.");
        }
      }
      
      throw error;
    }
  }

  // Create a post with a document (PDF, PPT, etc.)
  async createDocumentPost(
    text: string,
    documentFile: File,
    documentTitle: string = 'Document',
    visibility: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN' = 'PUBLIC',
    accessToken?: string
  ): Promise<LinkedInPostResponse> {
    try {
      const token = getLinkedInToken(accessToken);
      
      if (!token) {
        throw new Error("LinkedIn token not available. Please login again.");
      }

      // Since we can't directly upload document files to LinkedIn through our backend,
      // we'll create a text post that mentions the document name
      const documentInfo = `Document: ${documentFile.name} (${(documentFile.size / 1024 / 1024).toFixed(2)} MB)`;
      const fullContent = `${text}\n\n${documentInfo}`;
      
      // Use the existing text post endpoint
      const textPostData = {
        postContent: fullContent,
        visibility: visibility
      };

      // Send post request to our backend using the text post endpoint
      const response = await axios.post(`${this.API_URL}/post`, textPostData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating LinkedIn document post:', error);
      
      // Handle token expiration or revocation
      if (error.response && error.response.data) {
        // Check for LinkedIn token revocation error codes
        const isTokenRevoked = error.response.data.details && 
          (error.response.data.details.code === 'REVOKED_ACCESS_TOKEN' || 
           error.response.data.details.serviceErrorCode === 65601);
        
        if (error.response.status === 401 || 
            isTokenRevoked || 
            (error.response.status === 500 && 
             error.response.data.details && 
             error.response.data.details.includes('token has expired'))) {
          console.error('LinkedIn token expired or revoked. Clearing tokens and redirecting to reauthorization.');
          
          // Clear all LinkedIn tokens from localStorage
          localStorage.removeItem('linkedin-login-token');
          localStorage.removeItem('linkedin-refresh-token');
          localStorage.removeItem('linkedin-token-expiry');
          
          // Redirect to reauthorization
          refreshLinkedInToken();
          throw new Error("LinkedIn authentication expired or was revoked. Please login again.");
        }
      }
      
      throw error;
    }
  }

  // Create a carousel post (multiple images with text)
  // Note: LinkedIn API limitations prevent creating true carousel posts with multiple images in one post.
  // LinkedIn only allows this natively when posting directly through their app.
  async createCarouselPost(
    text: string,
    slides: Array<{content: string, imageUrl?: string, cloudinaryImage?: {secure_url: string, original_filename?: string}}>,
    visibility: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN' = 'PUBLIC',
    accessToken?: string
  ): Promise<LinkedInPostResponse> {
    try {
      const token = getLinkedInToken(accessToken);
      
      if (!token) {
        throw new Error("LinkedIn token not available. Please login again.");
      }

      // Filter slides to only include those with images
      const slidesWithImages = slides.filter(slide => slide.imageUrl || slide.cloudinaryImage?.secure_url);
      
      if (slidesWithImages.length === 0) {
        throw new Error("No slides with images found. Carousel posts require at least one image.");
      }
      
      // Use the first slide as the main image
      const firstSlide = slidesWithImages[0];
      const imageUrl = firstSlide.cloudinaryImage?.secure_url || firstSlide.imageUrl;
      
      if (!imageUrl) {
        throw new Error("First slide has no valid image URL");
      }
      
      // Add all slide content to the post text
      const slideContents = slides.map((slide, index) => 
        `Slide ${index + 1}: ${slide.content}`
      ).join('\n\n');
      
      // Combine original text with slide contents
      const fullContent = `${text}\n\n${slideContents}\n\n(Note: This post contains multiple slides that would normally display as a carousel when posted directly via LinkedIn)`;
      
      // Create a single post with the first image and all slide content
      const imagePostData = {
        postContent: fullContent,
        imagePath: imageUrl,
        imageTitle: firstSlide.cloudinaryImage?.original_filename || 'Carousel Image',
        imageDescription: "Carousel post with multiple slides",
        isCloudinaryImage: true,
        visibility: visibility
      };

      // Send post request to the existing post endpoint
      const response = await axios.post(`${this.API_URL}/post`, imagePostData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating LinkedIn carousel post:', error);
      
      // Handle token expiration or revocation
      if (error.response && error.response.data) {
        // Check for LinkedIn token revocation error codes
        const isTokenRevoked = error.response.data.details && 
          (error.response.data.details.code === 'REVOKED_ACCESS_TOKEN' || 
           error.response.data.details.serviceErrorCode === 65601);
        
        if (error.response.status === 401 || 
            isTokenRevoked || 
            (error.response.status === 500 && 
             error.response.data.details && 
             error.response.data.details.includes('token has expired'))) {
          console.error('LinkedIn token expired or revoked. Clearing tokens and redirecting to reauthorization.');
          
          // Clear all LinkedIn tokens from localStorage
          localStorage.removeItem('linkedin-login-token');
          localStorage.removeItem('linkedin-refresh-token');
          localStorage.removeItem('linkedin-token-expiry');
          
          // Redirect to reauthorization
          refreshLinkedInToken();
          throw new Error("LinkedIn authentication expired or was revoked. Please login again.");
        }
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
      
      // Handle token expiration or revocation
      if (error.response && error.response.data) {
        // Check for LinkedIn token revocation error codes
        const isTokenRevoked = error.response.data.details && 
          (error.response.data.details.code === 'REVOKED_ACCESS_TOKEN' || 
           error.response.data.details.serviceErrorCode === 65601);
        
        if (error.response.status === 401 || 
            isTokenRevoked || 
           (error.response.status === 500 && 
            error.response.data.details && 
            error.response.data.details.includes('token has expired'))) {
          console.error('LinkedIn token expired or revoked. Clearing tokens and redirecting to reauthorization.');
          
          // Clear all LinkedIn tokens from localStorage
          localStorage.removeItem('linkedin-login-token');
          localStorage.removeItem('linkedin-refresh-token');
          localStorage.removeItem('linkedin-token-expiry');
          
          // Redirect to reauthorization
        refreshLinkedInToken();
          throw new Error("LinkedIn authentication expired or was revoked. Please login again.");
        }
      }
      
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
    // Return an empty array instead of making API call - no analytics needed
    return [];
  }

  // Get drafts and scheduled posts
  async getDraftsAndScheduled(): Promise<any> {
    // Load posts from localStorage
    const drafts: any[] = [];
    const scheduled: any[] = [];
    
    // Read from linkedinDrafts and linkedinScheduledPosts
    try {
      // Get drafts
      const draftsString = localStorage.getItem('linkedinDrafts');
      if (draftsString) {
        const parsedDrafts = JSON.parse(draftsString);
        if (Array.isArray(parsedDrafts)) {
          drafts.push(...parsedDrafts);
        }
      }
      
      // Get scheduled posts
      const scheduledString = localStorage.getItem('linkedinScheduledPosts');
      if (scheduledString) {
        const parsedScheduled = JSON.parse(scheduledString);
        if (Array.isArray(parsedScheduled)) {
          scheduled.push(...parsedScheduled);
        }
      }
    } catch (error) {
      console.error('Error loading posts from localStorage:', error);
    }
    
    return [...drafts, ...scheduled];
  }

  // Delete a draft
  async deleteDraft(draftId: string): Promise<boolean> {
    try {
      // Get existing drafts from localStorage
      const draftsString = localStorage.getItem('linkedinDrafts');
      if (draftsString) {
        const drafts = JSON.parse(draftsString);
        if (Array.isArray(drafts)) {
          // Filter out the draft to delete
          const updatedDrafts = drafts.filter((draft) => draft.id !== draftId);
          // Save updated drafts back to localStorage
          localStorage.setItem('linkedinDrafts', JSON.stringify(updatedDrafts));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error deleting draft from localStorage:', error);
      return false;
    }
  }

  // Delete a scheduled post
  async deleteScheduledPost(postId: string): Promise<boolean> {
    try {
      // Get existing scheduled posts from localStorage
      const scheduledString = localStorage.getItem('linkedinScheduledPosts');
      if (scheduledString) {
        const scheduled = JSON.parse(scheduledString);
        if (Array.isArray(scheduled)) {
          // Filter out the post to delete
          const updatedScheduled = scheduled.filter((post) => post.id !== postId);
          // Save updated scheduled posts back to localStorage
          localStorage.setItem('linkedinScheduledPosts', JSON.stringify(updatedScheduled));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error deleting scheduled post from localStorage:', error);
      return false;
    }
  }

  // Save a published post
  async savePublishedPost(post: any): Promise<any> {
    // Just return the post without making API call
    return post;
  }

  // Save a draft post
  async saveDraft(postData: ScheduledPostData): Promise<any> {
    // Just return the data without making API call
    return postData;
  }

  // Save a scheduled post
  async saveScheduledPost(postData: ScheduledPostData): Promise<any> {
    // Just return the data without making API call
    return postData;
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

  // Post management methods for database-backed posts
  
  // Get all posts with optional status filter
  async getDBPosts(status?: string, page: number = 1, limit: number = 20): Promise<any> {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      const params: any = { page, limit };
      if (status) {
        params.status = status;
      }
      
      const response = await axios.get(this.POSTS_API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }
  
  // Get a specific post by ID
  async getDBPostById(postId: string): Promise<any> {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      const response = await axios.get(`${this.POSTS_API_URL}/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }
  
  // Create a new post (draft)
  async createDBPost(postData: any): Promise<any> {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      const response = await axios.post(this.POSTS_API_URL, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
  
  // Update an existing post
  async updateDBPost(postId: string, postData: any): Promise<any> {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      const response = await axios.put(`${this.POSTS_API_URL}/${postId}`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }
  
  // Delete a post
  async deleteDBPost(postId: string): Promise<any> {
    try {
      // Check if it's a local storage post by the ID prefix
      if (postId.startsWith('draft_') || postId.startsWith('scheduled_')) {
        console.log('Deleting local post from localStorage:', postId);
        // Remove from localStorage
        localStorage.removeItem(postId);
        return {
          success: true,
          message: 'Post deleted from localStorage'
        };
      }
      
      // Otherwise delete from the database
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      console.log('Deleting post from API:', postId);
      
      // First get the post data to check if it has a platformPostId (LinkedIn post ID)
      try {
        const postResponse = await axios.get(`${this.POSTS_API_URL}/${postId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const post = postResponse.data?.data;
        console.log('Retrieved post data for deletion:', post);
        
        // If this is a published post with a LinkedIn platformPostId, try to delete it from LinkedIn first
        if (post && post.status === 'published' && post.platformPostId) {
          try {
            console.log('Attempting to delete post from LinkedIn:', post.platformPostId);
            
            // Call our backend endpoint that handles LinkedIn deletion
            await axios.delete(`${this.API_URL}/delete-linkedin-post`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              data: {
                postId: post.platformPostId
              }
            });
            
            console.log('Successfully sent LinkedIn post deletion request');
          } catch (linkedinError) {
            console.error('Failed to delete post from LinkedIn:', linkedinError);
            // Continue with database deletion even if LinkedIn deletion fails
          }
        }
      } catch (getPostError) {
        console.error('Error fetching post before deletion:', getPostError);
        // Continue with deletion even if we can't fetch the post details
      }
      
      // Delete from our database
      const response = await axios.delete(`${this.POSTS_API_URL}/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
  
  // Publish a draft or scheduled post immediately
  async publishDBPost(postId: string): Promise<any> {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      console.log('Publishing post with ID:', postId);
      
      // First get the current post data
      const post = await this.getPostById(postId);
      
      if (!post || !post.data) {
        throw new Error("Post not found or could not be retrieved");
      }
      
      // Publish to LinkedIn
      const response = await axios.post(`${this.POSTS_API_URL}/${postId}/publish`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Publish response from backend:', response.data);
      
      // Explicitly reload the post to ensure we have the latest data
      const updatedPost = await this.getPostById(postId);
      
      return {
        success: true,
        data: updatedPost.data,
        message: 'Post published successfully'
      };
    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    }
  }
  
  // Get a post by ID
  async getPostById(postId: string): Promise<any> {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      const response = await axios.get(`${this.POSTS_API_URL}/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }
  
  // Schedule a post for later publishing
  async scheduleDBPost(postId: string, scheduledTime: string): Promise<any> {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      const response = await axios.post(`${this.POSTS_API_URL}/${postId}/schedule`, {
        scheduledTime
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error scheduling post:', error);
      throw error;
    }
  }

  // Migrate a single post from localStorage to database
  async migrateSinglePostToDatabase(post: any): Promise<any> {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      // Call the migration API endpoint with a single post
      const response = await axios.post(`${this.POSTS_API_URL}/migrate-from-local`, 
        { posts: [post] },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // If migration was successful, remove from localStorage
      if (response.data.success && response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        if (result.success) {
          try {
            localStorage.removeItem(post.id);
          } catch (error) {
            console.error(`Error removing migrated post ${post.id} from localStorage:`, error);
          }
        }
        
        return {
          success: true,
          migratedPost: result,
          message: 'Post migrated successfully'
        };
      }
      
      return {
        success: false,
        message: 'Failed to migrate post',
        details: response.data
      };
    } catch (error) {
      console.error('Error migrating post to database:', error);
      throw error;
    }
  }

  // Migrate posts from localStorage to the database
  async migrateLocalPostsToDatabase(postsToMigrate?: any[]): Promise<any> {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error("Authentication token not available. Please login again.");
      }
      
      // If posts are provided, use them, otherwise collect from localStorage
      const posts = postsToMigrate || [];
      
      // If no posts were provided, scan localStorage for posts to migrate
      if (!postsToMigrate || postsToMigrate.length === 0) {
        // Scan localStorage for drafts and scheduled posts
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          
          // Check for draft posts
          if (key?.startsWith('draft_')) {
            try {
              const draftData = JSON.parse(localStorage.getItem(key) || '{}');
              if (draftData.id) {
                posts.push({
                  ...draftData,
                  status: 'draft'
                });
              }
            } catch (error) {
              console.error('Error parsing draft for migration:', error);
            }
          } 
          // Check for scheduled posts
          else if (key?.startsWith('scheduled_')) {
            try {
              const scheduledData = JSON.parse(localStorage.getItem(key) || '{}');
              if (scheduledData.id) {
                posts.push({
                  ...scheduledData,
                  status: 'scheduled'
                });
              }
            } catch (error) {
              console.error('Error parsing scheduled post for migration:', error);
            }
          }
        }
      }
      
      if (posts.length === 0) {
        return {
          success: true, 
          message: 'No posts found to migrate',
          migratedCount: 0,
          migratedPosts: []
        };
      }
      
      // Call the migration API endpoint
      const response = await axios.post(`${this.POSTS_API_URL}/migrate-from-local`, 
        { posts },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Clean up successfully migrated posts from localStorage
      if (response.data.success && response.data.results) {
        const successfulMigrations = response.data.results.filter((result: any) => result.success);
        
        for (const migration of successfulMigrations) {
          // Try to remove the original localStorage item
          try {
            localStorage.removeItem(migration.id);
          } catch (error) {
            console.error(`Error removing migrated post ${migration.id} from localStorage:`, error);
          }
        }
      }
      
      return {
        ...response.data,
        migratedCount: response.data.results?.filter((r: any) => r.success).length || 0,
        migratedPosts: response.data.results?.filter((r: any) => r.success) || []
      };
    } catch (error) {
      console.error('Error migrating posts to database:', error);
      throw error;
    }
  }
}

export const linkedInApi = new LinkedInApi(); 