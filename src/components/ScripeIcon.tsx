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
          id="scripe-icon-gradient" 
          x1="2" 
          y1="2" 
          x2="30" 
          y2="30" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path 
        d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z"
        fill="url(#scripe-icon-gradient)" 
      />
      <path 
        d="M22.5 12.5L15.5 19.5L11 15"
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
          id="scripe-logo-gradient" 
          x1="3" 
          y1="3" 
          x2="34" 
          y2="34" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      
      {/* Icon part */}
      <path 
        d="M19 3C10.164 3 3 10.164 3 19C3 27.836 10.164 35 19 35C27.836 35 35 27.836 35 19C35 10.164 27.836 3 19 3Z"
        fill="url(#scripe-logo-gradient)" 
      />
      <path 
        d="M26.5 14.5L18.5 22.5L13 17"
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Text part */}
      <path 
        fillRule="evenodd"
        clipRule="evenodd"
        d="M51.3 27.7C49.5 27.7 47.9 27.37 46.5 26.7C45.1 26.03 44.03 25.07 43.3 23.8C42.57 22.53 42.2 21.07 42.2 19.4C42.2 17.73 42.57 16.27 43.3 15C44.03 13.73 45.1 12.77 46.5 12.1C47.9 11.43 49.5 11.1 51.3 11.1C52.77 11.1 54.07 11.33 55.2 11.8C56.33 12.27 57.27 12.93 58 13.8L55.8 15.9C54.67 14.63 53.2 14 51.4 14C50.33 14 49.4 14.23 48.6 14.7C47.8 15.17 47.17 15.83 46.7 16.7C46.23 17.57 46 18.53 46 19.6C46 20.67 46.23 21.63 46.7 22.5C47.17 23.37 47.8 24.03 48.6 24.5C49.4 24.97 50.33 25.2 51.4 25.2C53.2 25.2 54.67 24.57 55.8 23.3L58 25.4C57.27 26.27 56.33 26.93 55.2 27.4C54.07 27.87 52.77 28.1 51.3 28.1V27.7ZM67.7 27.5L67.64 22.3H67.8C68.17 23.17 68.77 23.87 69.6 24.4C70.43 24.93 71.4 25.2 72.5 25.2C73.83 25.2 74.97 24.9 75.9 24.3C76.83 23.7 77.53 22.83 78 21.7C78.47 20.57 78.7 19.27 78.7 17.8C78.7 16.33 78.47 15.03 78 13.9C77.53 12.77 76.83 11.9 75.9 11.3C74.97 10.7 73.83 10.4 72.5 10.4C71.4 10.4 70.43 10.67 69.6 11.2C68.77 11.73 68.17 12.43 67.8 13.3H67.64V10.7H64.6V31H67.7V27.5ZM71.2 22.7C70.33 22.7 69.6 22.53 69 22.2C68.4 21.87 67.93 21.4 67.6 20.8C67.27 20.2 67.1 19.5 67.1 18.7C67.1 17.9 67.27 17.2 67.6 16.6C67.93 16 68.4 15.53 69 15.2C69.6 14.87 70.33 14.7 71.2 14.7C72.07 14.7 72.8 14.87 73.4 15.2C74 15.53 74.47 16 74.8 16.6C75.13 17.2 75.3 17.9 75.3 18.7C75.3 19.5 75.13 20.2 74.8 20.8C74.47 21.4 74 21.87 73.4 22.2C72.8 22.53 72.07 22.7 71.2 22.7ZM83.2 27.5V18.1C83.2 17 83.47 16.1 84 15.4C84.53 14.7 85.33 14.35 86.4 14.35C87.47 14.35 88.27 14.7 88.8 15.4C89.33 16.1 89.6 17 89.6 18.1V27.5H92.7V17.4C92.7 16.13 92.43 15.03 91.9 14.1C91.37 13.17 90.67 12.47 89.8 12C88.93 11.53 87.97 11.3 86.9 11.3C85.9 11.3 85.03 11.5 84.3 11.9C83.57 12.3 82.97 12.87 82.5 13.6H82.35V11.5H79.2V27.5H83.2ZM106.0 27.5V24.6H98.9V11.5H95.8V27.5H106.0ZM117.9 27.7C116.17 27.7 114.63 27.37 113.3 26.7C111.97 26.03 110.93 25.07 110.2 23.8C109.47 22.53 109.1 21.07 109.1 19.4C109.1 17.73 109.47 16.27 110.2 15C110.93 13.73 112.0 12.77 113.4 12.1C114.8 11.43 116.4 11.1 118.2 11.1C119.83 11.1 121.27 11.4 122.5 12C123.73 12.6 124.7 13.47 125.4 14.6C126.1 15.73 126.45 17.03 126.45 18.5V19.4H112.7C112.83 20.47 113.37 21.33 114.2 22C115.03 22.67 116.1 23 117.3 23C117.93 23 118.53 22.9 119.1 22.7C119.67 22.5 120.17 22.2 120.6 21.8L122.3 24C121.6 24.67 120.77 25.17 119.8 25.5C118.83 25.83 117.8 26 116.7 26C117.43 26.8 118.17 27.7 117.9 27.7ZM113.0 17.4H123.7C123.7 16.33 123.27 15.47 122.4 14.8C121.53 14.13 120.43 13.8 119.1 13.8C117.87 13.8 116.83 14.13 116 14.8C115.17 15.47 114.77 16.33 113.0 17.4ZM138.1 27.5V24.6H131.0V20.7H137.3V17.8H131.0V14.4H138.1V11.5H127.9V27.5H138.1Z" 
        fill="white"
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
    <div className={`${className} bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center p-2`}>
      <svg 
        className="w-full h-full" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M18.5 8.5L11.5 15.5L7 11"
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
