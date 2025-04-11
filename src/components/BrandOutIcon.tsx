import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// BrandOut Icon Components
export const BrandOutIcon = ({ className = "h-6 w-6" }) => {
  return (
    <svg className={className} viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1000" height="600" rx="150" fill="url(#brandout-gradient)" />
      
      {/* Left side horizontal lines */}
      <rect x="120" y="200" width="280" height="50" rx="25" fill="white" />
      <rect x="120" y="350" width="280" height="50" rx="25" fill="white" />
      
      {/* Right side rounded rectangle */}
      <rect x="600" y="150" width="280" height="300" rx="140" stroke="white" strokeWidth="50" />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="brandout-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6C2BD9" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Logotype (icon + text) for BrandOut
export const BrandOutLogotype = ({ className = "h-8" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <BrandOutIcon className="h-full w-auto" />
      <span className="mt-1 font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">BrandOut</span>
    </div>
  );
};

// Horizontal version with icon and text side by side
export const BrandOutHorizontalLogo = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <BrandOutIcon className="h-full w-auto" />
      <span className="ml-2 font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">BrandOut</span>
    </div>
  );
}; 