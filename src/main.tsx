import axios from 'axios';

// Setup mock API responses when in development and backend is 
const setupMockApi = async () => {
  try {
    // Try to ping the backend health check endpoint
    await axios.get(`https://backend-scripe.onrender.com/health`);
    console.log('Backend is available, using real API');
    return false;
  } catch (error) {
    console.log('Backend is not available, setting up mock API responses', error);
    
    // Mock axios responses
    axios.interceptors.response.use(
      response => response,
      error => {
        console.log('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message
        });
        
        // Handle all LinkedIn post-related endpoints
        if (error.config?.url?.includes('/linkedin/posts')) {
          // For GET requests to retrieve posts
          if (error.config.method === 'get') {
            if (error.config.url.includes('/all')) {
              // Get all posts (drafts, scheduled, published)
              const drafts = JSON.parse(localStorage.getItem('post_drafts') || '[]');
              const scheduled = JSON.parse(localStorage.getItem('scheduled_posts') || '[]');
              const published = JSON.parse(localStorage.getItem('published_posts') || '[]');
              
              console.log('Using mock data for posts/all:', { drafts, scheduled, published });
              return Promise.resolve({ 
                status: 200, 
                data: [...drafts, ...scheduled, ...published]
              });
            } else if (error.config.url.includes('/draft')) {
              // Get drafts
              const drafts = JSON.parse(localStorage.getItem('post_drafts') || '[]');
              return Promise.resolve({ status: 200, data: drafts });
            } else if (error.config.url.includes('/scheduled')) {
              // Get scheduled
              const scheduled = JSON.parse(localStorage.getItem('scheduled_posts') || '[]');
              return Promise.resolve({ status: 200, data: scheduled });
            }
          }
          
          // For POST requests to create/save posts
          else if (error.config.method === 'post') {
            try {
              const requestData = JSON.parse(error.config.data);
              console.log('Mock save for:', requestData);
              
              if (error.config.url.includes('/draft')) {
                // Save draft
                const drafts = JSON.parse(localStorage.getItem('post_drafts') || '[]');
                const newDraft = { ...requestData, id: `draft_${Date.now()}` };
                localStorage.setItem('post_drafts', JSON.stringify([newDraft, ...drafts]));
                return Promise.resolve({ status: 201, data: newDraft });
              } else if (error.config.url.includes('/scheduled')) {
                // Save scheduled post
                const scheduled = JSON.parse(localStorage.getItem('scheduled_posts') || '[]');
                const newScheduled = { ...requestData, id: `scheduled_${Date.now()}` };
                localStorage.setItem('scheduled_posts', JSON.stringify([newScheduled, ...scheduled]));
                return Promise.resolve({ status: 201, data: newScheduled });
              } else if (error.config.url.includes('/published')) {
                // Save published post
                const published = JSON.parse(localStorage.getItem('published_posts') || '[]');
                const newPublished = { ...requestData, id: `published_${Date.now()}` };
                localStorage.setItem('published_posts', JSON.stringify([newPublished, ...published]));
                return Promise.resolve({ status: 201, data: newPublished });
              }
            } catch (parseError) {
              console.error('Error parsing request data:', parseError);
            }
          }
          
          // For DELETE requests
          else if (error.config.method === 'delete') {
            const postId = error.config.url.split('/').pop();
            
            if (error.config.url.includes('/draft')) {
              // Delete draft
              const drafts = JSON.parse(localStorage.getItem('post_drafts') || '[]');
              const updatedDrafts = drafts.filter(d => d.id !== postId);
              localStorage.setItem('post_drafts', JSON.stringify(updatedDrafts));
              return Promise.resolve({ status: 200, data: { message: 'Draft deleted', id: postId } });
            } else if (error.config.url.includes('/scheduled')) {
              // Delete scheduled post
              const scheduled = JSON.parse(localStorage.getItem('scheduled_posts') || '[]');
              const updatedScheduled = scheduled.filter(s => s.id !== postId);
              localStorage.setItem('scheduled_posts', JSON.stringify(updatedScheduled));
              return Promise.resolve({ status: 200, data: { message: 'Scheduled post deleted', id: postId } });
            }
          }
        }
        
        return Promise.reject(error);
      }
    );
    return true;
  }
};

// Initialize mock API if needed
setupMockApi();

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Create a root element and render the application inside BrowserRouter
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
