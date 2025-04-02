
import React from 'react';

export interface ProgressDotsProps {
  current: number;
  total: number;
  color?: 'blue' | 'purple' | 'default';
  className?: string;
}

export function ProgressDots({ current, total, color = 'default', className = '' }: ProgressDotsProps) {
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'purple':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInactiveColorClass = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/30';
      case 'purple':
        return 'bg-purple-500/30';
      default:
        return 'bg-gray-700';
    }
  };

  const activeColor = getColorClass();
  const inactiveColor = getInactiveColorClass();

  return (
    <div className={`flex space-x-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index <= current ? activeColor : inactiveColor
          } transition-colors duration-300`}
        />
      ))}
    </div>
  );
}
