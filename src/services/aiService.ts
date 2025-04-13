import axios from 'axios';
import { API_URL } from '../utils/constants';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ContentGenerationParams {
  inputText: string;
  contentType?: 'post' | 'article' | 'carousel' | 'poll' | 'comment';
  industry?: string;
  targetAudience?: string;
  contentGoal?: string;
  tone?: string;
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  maxLength?: number;
}

export interface ImageGenerationParams {
  prompt: string;
  style?: string;
  size?: string;
}

export interface YouTubeTranscriptParams {
  videoUrl: string;
}

export const aiService = {
  // YouTube transcript extraction
  getYouTubeTranscript: async (params: YouTubeTranscriptParams) => {
    const response = await API.post('/api/ai/youtube-transcript', params);
    return response.data;
  },

  // LinkedIn content generation
  generateLinkedInContent: async (params: ContentGenerationParams) => {
    const response = await API.post('/api/ai/generate-linkedin-content', params);
    return response.data;
  },

  // Image generation
  generateImage: async (params: ImageGenerationParams) => {
    const response = await API.post('/api/ai/generate-image', params);
    return response.data;
  },

  // Image upload
  uploadImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await API.post('/api/ai/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default aiService; 