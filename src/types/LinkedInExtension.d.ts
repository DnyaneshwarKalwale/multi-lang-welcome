interface LinkedInProfile {
  id: string;
  username: string;
  name: string;
  profileImage: string;
  bio: string;
  location: string;
  url: string;
  joinedDate: string;
  connections: number;
  followers: number;
  verified: boolean;
}

interface LinkedInPost {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    shares: number;
    comments: number;
    likes: number;
    impressions: number;
  };
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

interface LinkedBoostExtension {
  getLinkedInData(): Promise<{
    profile: LinkedInProfile;
    posts: LinkedInPost[];
    analytics: LinkedInAnalytics;
  }>;
  
  scrapeProfile(url: string): Promise<LinkedInProfile>;
  
  createPost(content: string, options?: {
    isCarousel?: boolean;
    scheduleTime?: Date | null;
    hashtags?: string[];
  }): Promise<{ success: boolean; postId?: string; error?: string }>;
}

// Declare the extension on the global window object
interface Window {
  linkedBoostExtension?: LinkedBoostExtension;
}

// Custom event for LinkedIn data updates
interface LinkedBoostDataUpdateEvent extends CustomEvent {
  detail: {
    profile?: LinkedInProfile;
    posts?: LinkedInPost[];
    analytics?: LinkedInAnalytics;
  };
} 