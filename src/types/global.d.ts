
// Global type declarations

interface TwitterProfile {
  id: string;
  username: string;
  name: string;
  profileImage: string;
  bio: string;
  location: string;
  url: string;
  joinedDate: string;
  following: number;
  followers: number;
  verified: boolean;
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count: number;
  };
}

interface TwitterAnalytics {
  impressions: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  engagement: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  followers: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  summary: {
    totalImpressions: number;
    averageEngagement: number;
    followerGrowth: number;
    bestPerformingTweet: {
      text: string;
      impressions: number;
      engagement: number;
    };
  };
}

interface TwitterData {
  profile: TwitterProfile;
  tweets: Tweet[];
  analytics: TwitterAnalytics;
}

interface DekcionExtension {
  getTwitterData: () => Promise<TwitterData>;
}

// LinkedIn interfaces
interface LinkedInProfile {
  id: string;
  username: string;
  name: string;
  profileImage: string;
  headline: string;
  industry: string;
  location: string;
  connectionCount: number;
  followers: number;
  url: string;
  about: string;
  featured: boolean;
}

interface LinkedInPost {
  id: string;
  text: string;
  created_at: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  hasMedia: boolean;
  mediaType?: "image" | "video" | "document" | "poll";
}

interface LinkedInAnalytics {
  impressions: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  engagement: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  followers: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  profileViews: {
    data: number[];
    labels: string[];
    increase: number;
    timeframe: string;
  };
  summary: {
    totalImpressions: number;
    averageEngagement: number;
    followerGrowth: number;
    bestPerformingPost: {
      text: string;
      impressions: number;
      engagement: number;
    };
  };
}

interface LinkedInData {
  profile: LinkedInProfile;
  posts: LinkedInPost[];
  analytics: LinkedInAnalytics;
  inspirationProfiles?: LinkedInProfile[];
}

interface LinkedPulseExtension {
  getLinkedInData: () => Promise<LinkedInData>;
  postToLinkedIn: (content: string, mediaUrl?: string) => Promise<boolean>;
  schedulePost: (content: string, dateTime: string, mediaUrl?: string) => Promise<boolean>;
}

// Extend Window interface
declare global {
  interface Window {
    dekcionExtension?: DekcionExtension;
    dekcionTwitterData?: TwitterData;
    linkedPulseExtension?: LinkedPulseExtension;
    linkedPulseData?: LinkedInData;
  }
}

export {}; 
