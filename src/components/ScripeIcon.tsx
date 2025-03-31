
import React from "react";

interface ScripeIconProps {
  className?: string;
  size?: number;
}

export function ScripeIcon({ className = "", size = 24 }: ScripeIconProps) {
  return (
    <svg 
      width={size} 
      height={size}

      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M3 3V21M7 9V21M11 11V21M15 4V21M19 8V21M21 12H7" 
        stroke="url(#scripe-gradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="scripe-gradient" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c5af5" />
          <stop offset="1" stopColor="#4de3c7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ScripeLogotype({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ScripeIcon />
      <span className="font-bold text-xl">scripe.</span>
    </div>
  );
}
