import { Tweet, Thread, TwitterResult } from '@/utils/types';

const API_ENDPOINT = '/api/twitter';

/**
 * Fetches tweets for a specific Twitter username
 */
export async function fetchUserTweets(username: string): Promise<TwitterResult> {
  try {
    // Remove @ symbol if present
    const cleanUsername = username.trim().replace(/^@/, '');
    
    // Extract username from URL if it's a Twitter URL
    const usernameFromUrl = extractUsernameFromUrl(cleanUsername);
    const finalUsername = usernameFromUrl || cleanUsername;
    
    // Make API request
    const response = await fetch(`${API_ENDPOINT}/user/${finalUsername}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch Twitter data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    throw error;
  }
}

/**
 * Extract username from Twitter URL
 */
export function extractUsernameFromUrl(input: string): string | null {
  if (!input) return null;
  
  try {
    // Handle different Twitter URL formats
    const twitterUrlRegex = /twitter\.com\/(?:#!\/)?(\w+)\/?.*/;
    const xUrlRegex = /x\.com\/(?:#!\/)?(\w+)\/?.*/;
    
    let match = input.match(twitterUrlRegex) || input.match(xUrlRegex);
    if (match && match[1]) {
      return match[1];
    }
    
    // If it's not a URL, just return the input
    if (!input.includes('twitter.com') && !input.includes('x.com')) {
      return input;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Twitter URL:', error);
    return null;
  }
}

/**
 * Save tweets to the user's account
 */
export async function saveTweetsToAccount(items: (Tweet | Thread)[]): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_ENDPOINT}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save Twitter data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving Twitter data:', error);
    throw error;
  }
}

/**
 * Get saved tweets from the user's account
 */
export async function getSavedTweets(): Promise<{ tweets: Tweet[], threads: Thread[] }> {
  try {
    const response = await fetch(`${API_ENDPOINT}/saved`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch saved tweets');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching saved tweets:', error);
    throw error;
  }
}

export default {
  fetchUserTweets,
  saveTweetsToAccount,
  getSavedTweets,
  extractUsernameFromUrl,
}; 