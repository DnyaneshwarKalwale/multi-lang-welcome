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

// Extend Window interface
declare global {
  interface Window {
    dekcionExtension?: DekcionExtension;
    dekcionTwitterData?: TwitterData;
  }
}

export {}; 