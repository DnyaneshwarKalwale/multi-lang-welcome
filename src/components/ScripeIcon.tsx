import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export function ScripeIcon({ className = "w-6 h-6", size }: IconProps) {
  const sizeStyle = size ? { width: `${size}px`, height: `${size}px` } : {};
  
  return (
    <svg 
      className={className}
      style={sizeStyle}
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient 
          id="novus-icon-gradient" 
          x1="2" 
          y1="2" 
          x2="30" 
          y2="30" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path 
        d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z"
        fill="url(#novus-icon-gradient)" 
      />
      <path 
        d="M10 16L14 20L22 12"
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScripeLogotype({ className = "h-9 w-auto", size }: IconProps) {
  const sizeStyle = size ? { width: `${size * 4}px`, height: `${size}px` } : {};
  
  return (
    <svg 
      className={className}
      style={sizeStyle}
      viewBox="0 0 144 38" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient 
          id="novus-logo-gradient" 
          x1="3" 
          y1="3" 
          x2="34" 
          y2="34" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      
      {/* Icon part */}
      <path 
        d="M19 3C10.164 3 3 10.164 3 19C3 27.836 10.164 35 19 35C27.836 35 35 27.836 35 19C35 10.164 27.836 3 19 3Z"
        fill="url(#novus-logo-gradient)" 
      />
      <path 
        d="M11 19L15 23L27 11"
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Text part */}
      <path 
        d="M55 14.2L55 27H51.4V14.2H46.8V11H59.6V14.2H55Z"
        fill="currentColor"
      />
      <path 
        d="M71 11V27H67.4V20.4H60.8V27H57.2V11H60.8V17.2H67.4V11H71Z"
        fill="currentColor"
      />
      <path 
        d="M84.0281 19C84.0281 21.2667 83.3082 23.0333 81.8682 24.3C80.4282 25.5667 78.5148 26.2 76.1281 26.2C73.7415 26.2 71.8281 25.5667 70.3881 24.3C68.9481 23.0333 68.2281 21.2667 68.2281 19C68.2281 16.7333 68.9481 14.9667 70.3881 13.7C71.8281 12.4333 73.7415 11.8 76.1281 11.8C78.5148 11.8 80.4282 12.4333 81.8682 13.7C83.3082 14.9667 84.0281 16.7333 84.0281 19ZM72.0281 19C72.0281 20.3333 72.3615 21.3667 73.0281 22.1C73.6948 22.8333 74.7281 23.2 76.1281 23.2C77.5281 23.2 78.5615 22.8333 79.2281 22.1C79.8948 21.3667 80.2281 20.3333 80.2281 19C80.2281 17.6667 79.8948 16.6333 79.2281 15.9C78.5615 15.1667 77.5281 14.8 76.1281 14.8C74.7281 14.8 73.6948 15.1667 73.0281 15.9C72.3615 16.6333 72.0281 17.6667 72.0281 19Z"
        fill="currentColor"
      />
      <path 
        d="M96.5289 11C98.8489 11 100.649 11.6 101.929 12.8C103.209 14 103.849 15.6333 103.849 17.7C103.849 19.7667 103.209 21.4 101.929 22.6C100.649 23.8 98.8489 24.4 96.5289 24.4H93.5289V27H89.9289V11H96.5289ZM96.3289 21.2C97.4956 21.2 98.3622 20.9667 98.9289 20.5C99.4956 20.0333 99.7789 19.1 99.7789 17.7C99.7789 16.3 99.4956 15.3667 98.9289 14.9C98.3622 14.4333 97.4956 14.2 96.3289 14.2H93.5289V21.2H96.3289Z"
        fill="currentColor"
      />
      <path 
        d="M109.87 23.2C111.337 23.2 112.404 22.2667 113.07 20.4L115.67 21.4C115.27 22.7333 114.604 23.8 113.67 24.6C112.737 25.4 111.47 25.8 109.87 25.8C107.87 25.8 106.304 25.2 105.17 24C104.037 22.8 103.47 21.1333 103.47 19C103.47 16.8667 104.04 15.2 105.182 14C106.324 12.8 107.877 12.2 109.842 12.2C111.377 12.2 112.617 12.6 113.57 13.4C114.524 14.2 115.177 15.2667 115.53 16.6L112.87 17.4C112.737 16.7333 112.437 16.2 111.97 15.8C111.504 15.4 110.897 15.2 110.15 15.2C109.097 15.2 108.297 15.5333 107.75 16.2C107.204 16.8667 106.93 17.8 106.93 19C106.93 20.2 107.204 21.1333 107.75 21.8C108.297 22.4667 108.99 23.2 109.87 23.2Z"
        fill="currentColor"
      />
      <path 
        d="M123.909 11.8C125.509 11.8 126.829 12.1667 127.869 12.9C128.909 13.6333 129.636 14.6 130.049 15.8L126.909 16.8C126.096 15.4 125.043 14.7 123.749 14.7C122.856 14.7 122.129 14.9667 121.569 15.5C121.009 16.0333 120.729 16.7667 120.729 17.7C120.729 18.6333 121.009 19.3667 121.569 19.9C122.129 20.4333 122.876 20.7 123.809 20.7C124.636 20.7 125.329 20.5 125.889 20.1C126.449 19.7 126.889 19.1333 127.209 18.4L130.449 19.2C129.782 20.8 128.876 22 127.729 22.8C126.582 23.6 125.249 24 123.729 24C121.756 24 120.182 23.4 119.009 22.2C117.836 21 117.249 19.4333 117.249 17.5C117.249 15.6333 117.842 14.1 119.029 12.9C120.216 11.7 121.842 11.8 123.909 11.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

// New component for a square icon with transparent background
export function ScripeIconSquare({ className = "w-10 h-10" }: IconProps) {
  return (
    <div className={`${className} p-1.5 rounded flex items-center justify-center`}>
      <ScripeIcon className="w-full h-full" />
    </div>
  );
}

// New component for a rounded icon with filled background
export function ScripeIconRounded({ className = "w-10 h-10" }: IconProps) {
  return (
    <div className={`${className} bg-gradient-to-br from-cyan-500 to-violet-600 rounded-full flex items-center justify-center p-2`}>
      <svg 
        className="w-full h-full" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M8 12L11 15L16 10"
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
