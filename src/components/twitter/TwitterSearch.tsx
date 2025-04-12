import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TwitterSearchProps {
  onSearch: (username: string) => void;
  isLoading?: boolean;
}

export const TwitterSearch: React.FC<TwitterSearchProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSearch(inputValue.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full"
    >
      <div className={cn(
        "relative flex items-center w-full rounded-full border bg-white transition-all",
        isFocused ? "border-primary ring-2 ring-primary/20" : "border-gray-300"
      )}>
        <div className="absolute left-3 text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search Twitter by @username or paste profile URL"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 h-12 pl-10 pr-4 bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-400 rounded-full"
          disabled={isLoading}
        />
        {inputValue.length > 0 && (
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "absolute right-2 px-4 py-1.5 bg-primary text-white rounded-full font-medium text-sm transition-all",
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1.5 ml-2">
        Enter Twitter username (e.g. @elonmusk) or paste the profile URL
      </p>
    </form>
  );
};

export default TwitterSearch; 