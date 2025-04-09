
import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// Main brand icon for LinkedPulse
export function LinkedPulseIcon({ className = "h-8 w-8", size }: IconProps) {
  const sizeStyle = size ? { width: `${size}px`, height: `${size}px` } : {};
  
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={sizeStyle}
    >
      <defs>
        <linearGradient id="linkedpulse-gradient" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#0077B5" />
          <stop offset="100%" stopColor="#0e76a8" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="8" fill="url(#linkedpulse-gradient)" />
      <path
        d="M12 28V17H16V28H12ZM14 15.5C12.75 15.5 11.75 14.5 11.75 13.25C11.75 12 12.75 11 14 11C15.25 11 16.25 12 16.25 13.25C16.25 14.5 15.25 15.5 14 15.5ZM18 28H22V22.5C22 20.25 25 20 25 22.5V28H29V21.5C29 17 24 17.25 22 19.25V17H18V28Z"
        fill="white"
      />
      <path 
        d="M30 10L32 13L34 10M32 10V17M10 22H6V30H10V22Z" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Rounded icon variant
export function LinkedPulseIconRounded({ className = "h-10 w-10" }: IconProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 blur-sm"></div>
      <div className="relative bg-white dark:bg-gray-900 rounded-full p-1.5 flex items-center justify-center">
        <LinkedPulseIcon className="w-full h-full" />
      </div>
    </div>
  );
}

// Logotype (icon + text)
export function LinkedPulseLogotype({ className = "h-10", textColor = "text-gray-900 dark:text-white" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <LinkedPulseIcon className="h-full w-auto" />
      <span className={`ml-2 font-bold text-lg ${textColor}`}>LinkedPulse</span>
    </div>
  );
}

// Export default as the main icon
export default LinkedPulseIcon;
