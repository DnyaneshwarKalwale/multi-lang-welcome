export interface LinkedInPost {
  id: string;
  content: string;
  mediaUrls?: string[];
  hashtags: string[];
  isCarousel: boolean;
  carouselSlides?: CarouselSlide[];
  scheduledDate?: Date | null;
  publishedDate?: Date | null;
  status: 'draft' | 'scheduled' | 'published';
  analytics?: PostAnalytics;
  author?: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface CarouselSlide {
  id: string;
  content: string;
  mediaUrl?: string;
  order: number;
}

export interface PostAnalytics {
  impressions: number;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks?: number;
  ctr?: number;
}

export type PostTemplate = {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  category: 'professional' | 'storytelling' | 'educational' | 'promotional' | 'thought-leadership' | 'industry-news';
};

export type CarouselTemplate = {
  id: string;
  name: string;
  description: string;
  slideCount: number;
  slides: {
    order: number;
    content: string;
    placeholders?: string[];
  }[];
  tags: string[];
  category: 'listicle' | 'how-to' | 'case-study' | 'industry-insights' | 'educational' | 'promotional';
};

// Simplified to only support LinkedIn's 1080x1080 basic carousel format
export type SliderVariant = 'basic';

export type SliderOptions = {
  variant: SliderVariant;
  navigation?: boolean;
  pagination?: boolean;
}; 