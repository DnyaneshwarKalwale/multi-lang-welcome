// Twitter data types for the application

export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author: TwitterUser;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  media?: TweetMedia[];
  is_long?: boolean;
  thread_id?: string;
  referenced_tweets?: {
    type: 'replied_to' | 'quoted' | 'retweeted';
    id: string;
  }[];
  in_reply_to_user_id?: string;
}

export interface Media {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url: string;
  preview_image_url?: string;
  alt_text?: string;
  width?: number;
  height?: number;
}

export interface Thread {
  id: string;
  tweets: Tweet[];
  author: TwitterUser;
  created_at: string;
}

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  followers_count: number;
  following_count: number;
  description?: string;
}

export interface TweetMedia {
  type: 'photo' | 'video' | 'animated_gif';
  url: string;
  width: number;
  height: number;
  preview_image_url?: string;
}

export interface TwitterResult {
  tweets: Tweet[];
  threads: Thread[];
  username: string;
  profile: TwitterUser;
}

export type TweetCategory = 'all' | 'normal' | 'thread' | 'long';

export interface CategoryOption {
  value: TweetCategory;
  label: string;
  icon?: React.ReactNode;
}

export interface PaginationState {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
} 