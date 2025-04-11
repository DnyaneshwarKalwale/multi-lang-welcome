import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// BrandOut Icon Components
export const BrandOutIcon = ({ className = "h-6 w-6" }) => {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#0f172a"/>
      <path d="M8 8H32V32H8V8Z" fill="#ffffff"/>
      <path d="M14 16H26C27.1 16 28 16.9 28 18V22C28 23.1 27.1 24 26 24H14C12.9 24 12 23.1 12 22V18C12 16.9 12.9 16 14 16Z" fill="#0f172a"/>
      <path d="M16 28H24C25.1 28 26 28.9 26 30V32H14V30C14 28.9 14.9 28 16 28Z" fill="#0f172a"/>
    </svg>
  );
};

// Logotype (icon + text) for BrandOut
export const BrandOutLogotype = ({ className = "h-8" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <BrandOutIcon className="h-full w-auto" />
      <span className="mt-1 font-bold text-lg">BrandOut</span>
    </div>
  );
};

// Horizontal version with icon and text side by side
export const BrandOutHorizontalLogo = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <BrandOutIcon className="h-full w-auto" />
      <span className="ml-2 font-bold text-lg">BrandOut</span>
    </div>
  );
}; 