export { default as TwitterSearch } from './TwitterSearch';
export { default as TwitterCategories } from './TwitterCategories';
export { default as TwitterPagination } from './TwitterPagination';
export { default as TweetCard } from './TweetCard';
export { default as TweetThread } from './TweetThread';
export { default as TwitterContent } from './TwitterContent';

// Re-export all as a TwitterModule for easy imports
import TwitterSearch from './TwitterSearch';
import TwitterCategories from './TwitterCategories';
import TwitterPagination from './TwitterPagination';
import TweetCard from './TweetCard';
import TweetThread from './TweetThread';
import TwitterContent from './TwitterContent';

const TwitterModule = {
  TwitterSearch,
  TwitterCategories,
  TwitterPagination,
  TweetCard,
  TweetThread,
  TwitterContent
};

export default TwitterModule; 