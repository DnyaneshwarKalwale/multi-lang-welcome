import React, { useState, useEffect } from 'react';
import { TweetCategory, TwitterResult, Thread, Tweet, PaginationState } from '@/utils/types';
import TwitterSearch from './TwitterSearch';
import TwitterCategories from './TwitterCategories';
import TwitterPagination from './TwitterPagination';
import TweetCard from './TweetCard';
import TweetThread from './TweetThread';
import { Loader2, Save } from 'lucide-react';
import { fetchUserTweets, saveTweetsToAccount } from '@/services/twitterApi';

interface TwitterContentProps {
  onSaveSelected?: (items: (Tweet | Thread)[]) => void;
  allowMultiSelect?: boolean;
  onSaveComplete?: () => void;
}

export const TwitterContent: React.FC<TwitterContentProps> = ({
  onSaveSelected,
  allowMultiSelect = true,
  onSaveComplete,
}) => {
  // State for Twitter data
  const [searchResults, setSearchResults] = useState<TwitterResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Selection state
  const [selectedTweets, setSelectedTweets] = useState<Record<string, Tweet>>({});
  const [selectedThreads, setSelectedThreads] = useState<Record<string, Thread>>({});
  
  // Filter and pagination state
  const [selectedCategory, setSelectedCategory] = useState<TweetCategory>('all');
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Computed counts for categories
  const categoryCounts = {
    all: (searchResults?.tweets?.length || 0) + (searchResults?.threads?.length || 0),
    normal: searchResults?.tweets?.filter(t => !t.is_long && !t.thread_id)?.length || 0,
    thread: searchResults?.threads?.length || 0,
    long: searchResults?.tweets?.filter(t => t.is_long)?.length || 0,
  };

  // Filtered items based on category
  const getFilteredItems = () => {
    if (!searchResults) return { tweets: [], threads: [] };
    
    let filteredTweets: Tweet[] = [];
    let filteredThreads: Thread[] = [];
    
    switch (selectedCategory) {
      case 'normal':
        filteredTweets = searchResults.tweets.filter(t => !t.is_long && !t.thread_id);
        break;
      case 'thread':
        filteredThreads = searchResults.threads;
        break;
      case 'long':
        filteredTweets = searchResults.tweets.filter(t => t.is_long);
        break;
      case 'all':
      default:
        filteredTweets = searchResults.tweets.filter(t => !t.thread_id); // Exclude tweets in threads
        filteredThreads = searchResults.threads;
        break;
    }
    
    return { tweets: filteredTweets, threads: filteredThreads };
  };

  // Pagination calculations
  const paginatedItems = () => {
    const { tweets, threads } = getFilteredItems();
    const allItems = [...tweets, ...threads];
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    
    return allItems.slice(startIndex, endIndex);
  };

  // Fetch Twitter data
  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedTweets({});
    setSelectedThreads({});
    setPagination({ ...pagination, currentPage: 1 });
    
    try {
      const data = await fetchUserTweets(username);
      setSearchResults(data);
      
      const totalItems = data.tweets.length + data.threads.length;
      setPagination(prev => ({ ...prev, totalItems }));
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Twitter data. Please try again later.');
      console.error('Error fetching Twitter data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tweet selection
  const handleSelectTweet = (tweet: Tweet) => {
    if (!allowMultiSelect) {
      setSelectedTweets({ [tweet.id]: tweet });
      setSelectedThreads({});
      return;
    }
    
    setSelectedTweets(prev => {
      if (prev[tweet.id]) {
        const { [tweet.id]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [tweet.id]: tweet };
      }
    });
  };

  // Handle thread selection
  const handleSelectThread = (thread: Thread, selected: boolean) => {
    if (!allowMultiSelect) {
      setSelectedThreads(selected ? { [thread.id]: thread } : {});
      setSelectedTweets({});
      return;
    }
    
    setSelectedThreads(prev => {
      if (prev[thread.id]) {
        const { [thread.id]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [thread.id]: thread };
      }
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Handle category change
  const handleCategoryChange = (category: TweetCategory) => {
    setSelectedCategory(category);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil((getFilteredItems().tweets.length + getFilteredItems().threads.length) / pagination.itemsPerPage));

  // Save selected items
  const handleSave = async () => {
    const selectedItems = [
      ...Object.values(selectedTweets),
      ...Object.values(selectedThreads)
    ];
    
    if (selectedItems.length === 0) return;
    
    if (onSaveSelected) {
      onSaveSelected(selectedItems);
      return;
    }
    
    // If no custom save handler is provided, use the default API call
    setIsSaving(true);
    try {
      await saveTweetsToAccount(selectedItems);
      setSelectedTweets({});
      setSelectedThreads({});
      
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save tweets. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get total selected count
  const selectedCount = Object.keys(selectedTweets).length + Object.keys(selectedThreads).length;

  return (
    <div className="w-full space-y-4">
      <TwitterSearch 
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}
      
      {isLoading && (
        <div className="p-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {searchResults && !isLoading && (
        <>
          <TwitterCategories
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            counts={categoryCounts}
          />
          
          {categoryCounts.all > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedItems().map(item => {
                  if ('tweets' in item) {
                    // It's a thread
                    return (
                      <TweetThread
                        key={item.id}
                        thread={item}
                        isSelected={!!selectedThreads[item.id]}
                        onSelect={handleSelectThread}
                      />
                    );
                  } else {
                    // It's a tweet
                    return (
                      <TweetCard
                        key={item.id}
                        tweet={item}
                        isSelected={!!selectedTweets[item.id]}
                        onSelect={handleSelectTweet}
                      />
                    );
                  }
                })}
              </div>
              
              <TwitterPagination
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
              
              {selectedCount > 0 && (
                <div className="sticky bottom-4 w-full flex justify-center z-10">
                  <button
                    className="px-5 py-2 bg-primary text-white rounded-full shadow-lg flex items-center gap-2 transition-all hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={isSaving}
                    onClick={handleSave}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save {selectedCount} selected {selectedCount === 1 ? 'item' : 'items'}
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No tweets found for @{searchResults.username}.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TwitterContent; 