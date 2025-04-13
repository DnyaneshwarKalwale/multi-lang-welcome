import axios from 'axios';

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
  private API_URL = '/api/linkedin'; // Proxy through our backend

  // Get the current user's LinkedIn ID
  async getUserLinkedInId(): Promise<string> {
    try {
      const response = await axios.get(`${this.API_URL}/profile`);
      return response.data.id;
    } catch (error) {
      console.error('Error getting LinkedIn user ID:', error);
      throw error;
    }
  }

  // Create a simple text post
  async createTextPost(text: string, visibility: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN' = 'PUBLIC'): Promise<LinkedInPostResponse> {
    try {
      const userId = await this.getUserLinkedInId();
      const postData: LinkedInPostRequest = {
        author: `urn:li:person:${userId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': visibility
        },
        distribution: {
          linkedInDistributionTarget: {}
        }
      };

      const response = await axios.post(`${this.API_URL}/posts`, postData);
      return response.data;
    } catch (error) {
      console.error('Error creating LinkedIn post:', error);
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
  async createPollPost(text: string, pollOptions: string[], durationDays: number): Promise<any> {
    try {
      const userId = await this.getUserLinkedInId();
      
      const pollData: LinkedInPollPostRequest = {
        content: {
          author: `urn:li:person:${userId}`,
          commentary: text,
          pollPlatformSettings: {
            duration: durationDays * 24 * 60 * 60 // Convert days to seconds
          },
          pollOptions: pollOptions
        }
      };
      
      const response = await axios.post(`${this.API_URL}/polls`, pollData);
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
      const userId = await this.getUserLinkedInId();
      const response = await axios.get(`${this.API_URL}/posts?author=${userId}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user LinkedIn posts:', error);
      throw error;
    }
  }

  // Get user's drafts and scheduled posts
  async getDraftsAndScheduled(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}/scheduled-posts`);
      return response.data;
    } catch (error) {
      console.error('Error getting drafts and scheduled posts:', error);
      throw error;
    }
  }

  // Save a draft post
  async saveDraft(postData: ScheduledPostData): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/scheduled-posts`, {
        postData,
        status: 'draft'
      });
      return response.data;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  }

  // Schedule a post
  async schedulePost(postData: ScheduledPostData, scheduledTime: Date): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/scheduled-posts`, {
        postData,
        scheduledTime: scheduledTime.toISOString(),
        status: 'scheduled'
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
      const response = await axios.put(`${this.API_URL}/scheduled-posts/${postId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Delete a draft or scheduled post
  async deletePost(postId: string): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/scheduled-posts/${postId}`);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Publish a draft or scheduled post immediately
  async publishNow(postId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/scheduled-posts/${postId}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    }
  }
}

export const linkedInApi = new LinkedInApi(); 