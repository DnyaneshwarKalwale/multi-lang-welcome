import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TwitterPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const TwitterPagination: React.FC<TwitterPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || isLoading) return;
    onPageChange(page);
  };

  const renderPageButton = (page: number) => {
    const isActive = page === currentPage;
    return (
      <button
        key={page}
        className={cn(
          "h-8 w-8 flex items-center justify-center rounded text-sm",
          isActive 
            ? "bg-primary text-white" 
            : "bg-white text-gray-700 hover:bg-gray-100",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => handlePageChange(page)}
        disabled={isLoading}
      >
        {page}
      </button>
    );
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    // First page
    if (currentPage > 3) {
      buttons.push(
        <button
          key="first"
          className={cn(
            "h-8 w-8 flex items-center justify-center rounded text-sm bg-white text-gray-700 hover:bg-gray-100",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => handlePageChange(1)}
          disabled={isLoading}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      );
    }
    
    // Previous page
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          className={cn(
            "h-8 w-8 flex items-center justify-center rounded text-sm bg-white text-gray-700 hover:bg-gray-100",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      );
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(renderPageButton(i));
    }

    // Next page
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          className={cn(
            "h-8 w-8 flex items-center justify-center rounded text-sm bg-white text-gray-700 hover:bg-gray-100",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      );
    }

    // Last page
    if (currentPage < totalPages - 2) {
      buttons.push(
        <button
          key="last"
          className={cn(
            "h-8 w-8 flex items-center justify-center rounded text-sm bg-white text-gray-700 hover:bg-gray-100",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => handlePageChange(totalPages)}
          disabled={isLoading}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      );
    }

    return buttons;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-4 gap-1">
      {renderPaginationButtons()}
    </div>
  );
};

export default TwitterPagination; 