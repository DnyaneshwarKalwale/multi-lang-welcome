import React from 'react';
import { TweetCategory } from '@/utils/types';
import { cn } from '@/lib/utils';
import { MessageSquare, TextSelect, ListFilter } from 'lucide-react';

interface TweetCategoriesProps {
  selectedCategory: TweetCategory;
  onSelectCategory: (category: TweetCategory) => void;
  counts: Record<TweetCategory, number>;
}

export const TwitterCategories: React.FC<TweetCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  const categories = [
    { value: 'all', label: 'All Items', icon: <ListFilter className="h-4 w-4" /> },
    { value: 'normal', label: 'Regular Tweets', icon: <MessageSquare className="h-4 w-4" /> },
    { value: 'thread', label: 'Threads', icon: <svg className="h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
      </svg> },
    { value: 'long', label: 'Long Tweets', icon: <TextSelect className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="bg-white border rounded-lg p-2">
      <div className="flex gap-1 flex-wrap">
        {categories.map((category) => (
          <button
            key={category.value}
            className={cn(
              "flex-1 min-w-fit px-3 py-2 rounded-md text-sm flex flex-col items-center gap-1 transition-colors",
              selectedCategory === category.value
                ? "bg-primary text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => onSelectCategory(category.value)}
          >
            <div className="flex items-center gap-1.5">
              {category.icon}
              <span className="font-medium">{category.label}</span>
            </div>
            <span className={cn(
              "text-xs",
              selectedCategory === category.value ? "text-white/80" : "text-gray-500"
            )}>
              {counts[category.value]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TwitterCategories; 