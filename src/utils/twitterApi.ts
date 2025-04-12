import axios from 'axios';

// Twitter API constants
const RAPID_API_KEY = 'b4b27d1b34mshf3db3929c9eff79p1f5231jsn86b34ff94118';
const RAPID_API_HOST = 'twitter154.p.rapidapi.com';

// Tweet interface
export interface Tweet {
  id: string;
  text: string;
  full_text?: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  author: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
  };
  media?: {
    media_key: string;
    type: string;
    url: string;
    preview_image_url?: string;
    alt_text?: string;
    width?: number;
    height?: number;
  }[];
  conversation_id?: string;
  thread_id?: string;
  is_long?: boolean;
  is_self_thread?: boolean;
}

// Thread interface
export interface Thread {
  id: string;
  tweets: Tweet[];
  author: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
  };
  created_at: string;
}

// Twitter result interface
export interface TwitterResult {
  tweets: Tweet[];
  threads: Thread[];
  username: string;
  profile?: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
    followers_count: number;
    following_count: number;
    description?: string;
  };
}

// Fetch user tweets from Twitter
export const fetchUserTweets = async (username: string): Promise<TwitterResult> => {
  try {
    // Strip @ symbol if present
    username = username.replace('@', '');
    
    // First get the user details
    const userResponse = await axios.get(`https://twitter154.p.rapidapi.com/user/details?username=${username}`, {
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST,
      },
    });
    
    const userData = userResponse.data;
    const userId = userData.user_id;
    
    if (!userId) {
      throw new Error(`Could not find user ID for @${username}`);
    }
    
    // Fetch tweets
    const tweetsResponse = await axios.get(`https://twitter154.p.rapidapi.com/user/tweets?username=${username}&limit=50&includeReplies=false&includeFulltext=true&includeExtendedContent=true&includeQuoted=true&include_entities=true&includeAttachments=true&sort_by=recency&include_video_info=true&includeMedia=true`, {
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST,
      },
    });
    
    // Process tweets
    const tweets = processTweets(tweetsResponse.data);
    
    // Group tweets into threads if appropriate
    const { regularTweets, threadGroups } = groupThreads(tweets);
    
    return {
      tweets: regularTweets,
      threads: threadGroups,
      username,
      profile: {
        id: userData.user_id,
        name: userData.name,
        username: userData.username,
        profile_image_url: userData.profile_pic_url,
        followers_count: userData.followers_count,
        following_count: userData.following_count,
        description: userData.description,
      }
    };
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    throw error;
  }
};

// Process tweets from API response
const processTweets = (response: any): Tweet[] => {
  if (!response.results || !Array.isArray(response.results)) {
    console.error('Invalid response format:', response);
    return [];
  }
  
  return response.results.map((tweet: any) => {
    // Extract media
    const media = processMedia(tweet);
    
    // Check if thread
    const isThread = tweet.conversation_id && tweet.conversation_id === tweet.id;
    
    // Check if long tweet
    const isLong = (tweet.text && tweet.text.length > 280) || 
                   (tweet.full_text && tweet.full_text.length > 280);
    
    // Format metrics
    const public_metrics = {
      retweet_count: tweet.retweet_count || 0,
      reply_count: tweet.reply_count || 0,
      like_count: tweet.favorite_count || 0,
      quote_count: tweet.quote_count || 0
    };
    
    return {
      id: tweet.tweet_id || tweet.id,
      text: tweet.text || tweet.full_text || '',
      full_text: tweet.full_text || tweet.text || '',
      created_at: tweet.creation_date || tweet.created_at,
      public_metrics,
      author: {
        id: tweet.user?.user_id || tweet.user?.id,
        name: tweet.user?.name,
        username: tweet.user?.username,
        profile_image_url: tweet.user?.profile_pic_url
      },
      conversation_id: tweet.conversation_id,
      media,
      is_long: isLong,
      is_self_thread: isThread
    };
  });
};

// Process media from tweet
const processMedia = (tweet: any) => {
  const media: any[] = [];
  
  // Process media from different API response formats
  if (tweet.media && Array.isArray(tweet.media)) {
    tweet.media.forEach((m: any) => {
      media.push({
        media_key: m.media_key || m.id_str,
        type: m.type,
        url: m.media_url_https || m.media_url,
        preview_image_url: m.preview_image_url || m.media_url,
        width: m.width,
        height: m.height
      });
    });
  }
  
  return media;
};

// Group tweets into threads
export const groupThreads = (tweets: Tweet[]) => {
  // Identify threads
  const threadMap = new Map<string, Tweet[]>();
  const regularTweets: Tweet[] = [];
  
  // First, identify potential thread tweets by conversation_id
  tweets.forEach(tweet => {
    const conversationId = tweet.conversation_id;
    
    if (conversationId && conversationId !== tweet.id) {
      // This is potentially part of a thread - add to the thread map
      if (!threadMap.has(conversationId)) {
        threadMap.set(conversationId, []);
      }
      threadMap.get(conversationId)?.push(tweet);
    } else {
      // This is a standalone tweet
      regularTweets.push(tweet);
    }
  });
  
  // Process threads - only keep threads with multiple tweets
  const threadGroups: Thread[] = [];
  
  threadMap.forEach((threadTweets, conversationId) => {
    if (threadTweets.length > 1) {
      // Sort tweets by creation date
      threadTweets.sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      
      // Add thread index to each tweet
      threadTweets.forEach((tweet, index) => {
        tweet.thread_id = conversationId;
      });
      
      // Create thread object
      const firstTweet = threadTweets[0];
      threadGroups.push({
        id: conversationId,
        tweets: threadTweets,
        author: firstTweet.author,
        created_at: firstTweet.created_at
      });
    } else {
      // Not a real thread (only one tweet) - add to regular tweets
      regularTweets.push(...threadTweets);
    }
  });
  
  return { regularTweets, threadGroups };
}; 