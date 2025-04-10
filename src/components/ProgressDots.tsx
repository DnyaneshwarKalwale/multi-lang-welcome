
import React from 'react';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current }) => {
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            index === current
              ? 'bg-linkedin-blue scale-125'
              : index < current
              ? 'bg-linkedin-blue/60'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        />
      ))}
    </div>
  );
};
