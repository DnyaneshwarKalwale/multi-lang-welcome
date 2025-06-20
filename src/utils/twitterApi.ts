import { Tweet, Thread, TwitterResponse } from './twitterTypes';

// Backend API configuration
const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';

// User configurable options
export const TwitterConfig = {
  fetchLimit: 50,
  maxTweets: 200,
  threadsToProcess: 10,
  maxContinuations: 3,
  replyMaxPages: 4,
  retryDelay: 3000,
  setFetchLimit: (limit: number) => {
    if (limit > 0 && limit <= 100) {
      TwitterConfig.fetchLimit = limit;
    }
  },
  setMaxTweets: (max: number) => {
    if (max > 0) {
      TwitterConfig.maxTweets = max;
    }
  }
};

// Helper functions for thread detection and processing
const detectTruncatedText = (text: string): boolean => {
  if (!text || text.trim().length === 0) return false;
  
  if (text.endsWith('…') || text.endsWith('...')) return true;
  if (text.includes('… https://') || text.includes('... https://')) return true;
  
  const lastWords = text.trim().split(/\s+/).slice(-2);
  const commonTruncationEnders = ['the', 'a', 'an', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'like', 'of', 'all'];
  if (lastWords.length > 0 && commonTruncationEnders.includes(lastWords[lastWords.length - 1].toLowerCase())) {
    return true;
  }
  
  const hasNonLatinScript = /[\u0900-\u097F\u0600-\u06FF\u0590-\u05FF\u0E00-\u0E7F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/.test(text);
  const thresholdLength = hasNonLatinScript ? 180 : 240;
  
  if (text.length >= thresholdLength && !/[.!?"]$/.test(text.trim())) {
    return true;
  }
  
  return false;
};

// Main function to fetch user tweets from backend
export const fetchUserTweets = async (username: string, options?: { 
  initialFetch?: number, 
  maxTweets?: number 
}): Promise<Tweet[]> => {
  try {
    const baseUrl = BACKEND_API_URL;
    const apiUrl = baseUrl.endsWith('/api') 
      ? `${baseUrl}/twitter/user/${username}/quick`
      : `${baseUrl}/api/twitter/user/${username}/quick`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch tweets');
    }
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
};

// Group tweets into threads
export const groupThreads = (tweets: Tweet[]): (Tweet | Thread)[] => {
  const threadMap = new Map<string, Tweet[]>();
  const tweetMap = new Map<string, Tweet>();
  const processedIds = new Set<string>();
  
  tweets.forEach(tweet => tweetMap.set(tweet.id, tweet));
  
  console.log(`Organizing ${tweets.length} tweets into threads`);
  
  const selfThreads: Map<string, Set<string>> = new Map();
  
  tweets.forEach(tweet => {
    if (tweet.is_self_thread && tweet.conversation_id) {
      if (!selfThreads.has(tweet.conversation_id)) {
        selfThreads.set(tweet.conversation_id, new Set<string>());
      }
      selfThreads.get(tweet.conversation_id)!.add(tweet.id);
      
      if (tweet.in_reply_to_tweet_id && tweetMap.has(tweet.in_reply_to_tweet_id)) {
        selfThreads.get(tweet.conversation_id)!.add(tweet.in_reply_to_tweet_id);
      }
    }
    else if (tweet.in_reply_to_tweet_id && tweet.in_reply_to_user_id) {
      const replyToTweet = tweetMap.get(tweet.in_reply_to_tweet_id);
      if (replyToTweet && replyToTweet.author.id === tweet.author.id) {
        const threadId = tweet.conversation_id || tweet.thread_id || tweet.in_reply_to_tweet_id;
        if (!selfThreads.has(threadId)) {
          selfThreads.set(threadId, new Set<string>());
        }
        selfThreads.get(threadId)!.add(tweet.id);
        selfThreads.get(threadId)!.add(tweet.in_reply_to_tweet_id);
      }
    }
  });
  
  selfThreads.forEach((tweetIds, threadId) => {
    if (tweetIds.size > 1) {
      console.log(`Found self-thread with ID ${threadId} containing ${tweetIds.size} tweets`);
      
      const threadTweets = Array.from(tweetIds)
        .map(id => tweetMap.get(id))
        .filter(t => t !== undefined) as Tweet[];
      
      threadTweets.sort((a, b) => {
        if (a.thread_position !== undefined && b.thread_position !== undefined) {
          return a.thread_position - b.thread_position;
        }
        
        if (a.thread_index !== undefined && b.thread_index !== undefined) {
          return a.thread_index - b.thread_index;
        }
        
        try {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } catch (err) {
          return Number(BigInt(a.id) - BigInt(b.id));
        }
      });
      
      if (threadTweets.length > 1) {
        threadTweets.forEach((tweet, idx) => {
          tweet.thread_position = idx;
          tweet.thread_index = idx;
          processedIds.add(tweet.id);
        });
        
        threadMap.set(threadId, threadTweets);
      }
    }
  });
  
  tweets.forEach(tweet => {
    if (processedIds.has(tweet.id)) return;
    
    const threadId = tweet.conversation_id || tweet.thread_id || tweet.id;
    
    const threadMembers = tweets.filter(t => 
      !processedIds.has(t.id) && 
      ((t.conversation_id && t.conversation_id === threadId) || 
       (t.thread_id && t.thread_id === threadId) ||
       (t.in_reply_to_tweet_id && tweetMap.has(t.in_reply_to_tweet_id) && 
        t.author.id === tweet.author.id))
    );
    
    if (threadMembers.length <= 1) {
      processedIds.add(tweet.id);
      if (!threadMap.has('standalone')) {
        threadMap.set('standalone', []);
      }
      threadMap.get('standalone')!.push(tweet);
      return;
    }
    
    const thread: Tweet[] = [];
    const replyMap = new Map<string, Tweet[]>();
    
    threadMembers.forEach(t => {
      if (t.in_reply_to_tweet_id) {
        if (!replyMap.has(t.in_reply_to_tweet_id)) {
          replyMap.set(t.in_reply_to_tweet_id, []);
        }
        replyMap.get(t.in_reply_to_tweet_id)!.push(t);
      }
    });
    
    let rootTweet = threadMembers.find(t => 
      !t.in_reply_to_tweet_id || 
      !threadMembers.some(other => other.id === t.in_reply_to_tweet_id)
    );
    
    if (!rootTweet) {
      threadMembers.sort((a, b) => {
        try {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } catch (err) {
          return Number(BigInt(a.id) - BigInt(b.id));
        }
      });
      
      rootTweet = threadMembers[0];
    }
    
    if (rootTweet) {
      thread.push(rootTweet);
      processedIds.add(rootTweet.id);
      
      const findReplies = (tweetId: string, depth: number = 0): Tweet[] => {
        if (depth > 10) return [];
        if (!replyMap.has(tweetId)) return [];
        
        const result: Tweet[] = [];
        const replies = replyMap.get(tweetId)!.sort((a, b) => {
          try {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          } catch (err) {
            return Number(BigInt(a.id) - BigInt(b.id));
          }
        });
        
        for (const reply of replies) {
          if (!processedIds.has(reply.id)) {
            result.push(reply);
            processedIds.add(reply.id);
            result.push(...findReplies(reply.id, depth + 1));
          }
        }
        
        return result;
      };
      
      thread.push(...findReplies(rootTweet.id));
    } else {
      const sorted = [...threadMembers].sort((a, b) => {
        try {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        } catch (err) {
          return Number(BigInt(a.id) - BigInt(b.id));
        }
      });
      
      thread.push(...sorted);
      sorted.forEach(t => processedIds.add(t.id));
    }
    
    if (thread.length > 1) {
      thread.forEach((t, i) => {
        t.thread_position = i;
        t.thread_index = i;
      });
      
      threadMap.set(threadId, thread);
    } else if (thread.length === 1) {
      if (!threadMap.has('standalone')) {
        threadMap.set('standalone', []);
      }
      threadMap.get('standalone')!.push(thread[0]);
    }
  });
  
  tweets.forEach(tweet => {
    if (!processedIds.has(tweet.id)) {
      if (!threadMap.has('standalone')) {
        threadMap.set('standalone', []);
      }
      threadMap.get('standalone')!.push(tweet);
      processedIds.add(tweet.id);
    }
  });
  
  const result: (Tweet | Thread)[] = [];
  
  threadMap.forEach((tweets, id) => {
    if (id === 'standalone') {
      result.push(...tweets);
    } else if (tweets.length > 1) {
      result.push({
        id,
        tweets,
        author: tweets[0].author,
        created_at: tweets[0].created_at
      });
    }
  });
  
  console.log(`Organized tweets into ${result.filter(item => 'tweets' in item).length} threads and ${result.filter(item => !('tweets' in item)).length} standalone tweets`);
  
  return result.sort((a, b) => {
    const dateA = 'tweets' in a ? new Date(a.tweets[0].created_at).getTime() : new Date(a.created_at).getTime();
    const dateB = 'tweets' in b ? new Date(b.tweets[0].created_at).getTime() : new Date(b.created_at).getTime();
    return dateB - dateA;
  });
};

// Backend functions for tweet details (optional - for when needed)
// These functions have been removed as they were causing 401 errors
// and the backend doesn't have the corresponding API endpoints

export const saveSelectedTweets = async (tweets: Tweet[], username: string = 'anonymous'): Promise<boolean> => {
  try {
    if (!tweets || tweets.length === 0) {
      throw new Error('No tweets to save');
    }

    console.log(`Saving ${tweets.length} tweets for user "${username}"`);
    
    const sortedTweets = [...tweets].sort((a, b) => {
      try {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } catch (err) {
        return Number(BigInt(b.id) - BigInt(a.id));
      }
    });
    
    const processedTweets = sortedTweets.map(tweet => {
      return {
        ...tweet,
        savedAt: new Date().toISOString()
      };
    });
    
    // Try to save to backend first
    let backendSaveSuccess = false;
    try {
      const baseUrl = BACKEND_API_URL;
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/twitter/save`
        : `${baseUrl}/api/twitter/save`;
      
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          tweets: processedTweets, 
          username, 
          options: {
            preserveExisting: true,
            skipDuplicates: true,
            preserveThreadOrder: true
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          backendSaveSuccess = true;
          console.log('Tweets saved to backend successfully');
        }
      } else {
        console.warn(`Backend save failed: ${response.status} - ${response.statusText}`);
      }
    } catch (backendError) {
      console.warn('Backend save error:', backendError);
    }
    
    // Save to localStorage as backup/fallback
    try {
      const existingSavedTweets = JSON.parse(localStorage.getItem('savedTwitterPosts') || '[]');
      const newSavedTweets = [...existingSavedTweets, ...processedTweets.map(tweet => ({
        ...tweet,
        savedAt: new Date().toISOString(),
        username: username
      }))];
      
      localStorage.setItem('savedTwitterPosts', JSON.stringify(newSavedTweets));
      
      if (backendSaveSuccess) {
        console.log('Tweets saved to both backend and local storage');
      } else {
        console.log('Tweets saved to local storage as backup');
      }
      
      return true; // Always return true if at least local storage succeeded
    } catch (localStorageError) {
      console.error('Local storage save error:', localStorageError);
      if (!backendSaveSuccess) {
        throw new Error('Failed to save tweets to both backend and local storage');
      }
      return backendSaveSuccess;
    }
  } catch (error) {
    console.error('Error saving tweets:', error);
    throw error;
  }
};

export const getSavedTweets = async (): Promise<Tweet[]> => {
  try {
    const baseUrl = BACKEND_API_URL;
    const apiUrl = baseUrl.endsWith('/api') 
      ? `${baseUrl}/twitter/saved`
      : `${baseUrl}/api/twitter/saved`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved tweets');
    }

    const data = await response.json();
    return data.tweets || [];
  } catch (error) {
    console.error('Error fetching saved tweets:', error);
    return [];
  }
};

export const getSavedTweetsByUser = async (username: string): Promise<Tweet[]> => {
  try {
    const baseUrl = BACKEND_API_URL;
    const apiUrl = baseUrl.endsWith('/api') 
      ? `${baseUrl}/twitter/saved/user/${username}`
      : `${baseUrl}/api/twitter/saved/user/${username}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch saved tweets');
    }

    const data = await response.json();
    return data.tweets || [];
  } catch (error) {
    console.error('Error fetching saved tweets:', error);
    return [];
  }
}; 