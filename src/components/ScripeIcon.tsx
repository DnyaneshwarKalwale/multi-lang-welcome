import React from "react";
import { BrandOutLogo } from "./BrandOutLogo";

interface IconProps {
  className?: string;
  size?: number;
}

// ==============================
// Core Icon Components
// ==============================

// Replacing the Dekcion Icons with BrandOut styling
export const BrandOutIcon = ({ className = "h-6 w-6" }) => {
  return (
    <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brandOutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect x="50" y="180" width="400" height="140" rx="70" fill="url(#brandOutGradient)" />
      <rect x="100" y="220" width="150" height="30" rx="15" fill="white" />
      <rect x="100" y="280" width="150" height="30" rx="15" fill="white" />
      <circle cx="350" cy="250" r="70" fill="white" />
    </svg>
  );
};

// Rounded icon variant 
export const BrandOutIconRounded = ({ className = "h-6 w-6" }) => {
  return (
    <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brandOutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect x="50" y="180" width="400" height="140" rx="70" fill="url(#brandOutGradient)" />
      <rect x="100" y="220" width="150" height="30" rx="15" fill="white" />
      <rect x="100" y="280" width="150" height="30" rx="15" fill="white" />
      <circle cx="350" cy="250" r="70" fill="white" />
    </svg>
  );
};

// Logotype (icon + text) - using existing BrandOutLogo component
export const BrandOutLogotype = ({ className = "h-8" }) => {
  return <BrandOutLogo variant="full" size="sm" className={className} />;
};

// Keep legacy exports for backward compatibility
export const DekcionIcon = BrandOutIcon;
export const DekcionIconRounded = BrandOutIconRounded;
export const DekcionLogotype = BrandOutLogotype;

// Export other brand variants
export const ScripeIcon = BrandOutIcon;
export const ScripeIconRounded = BrandOutIconRounded;
export const ScripeLogotype = BrandOutLogotype;

export const SekcionIcon = BrandOutIcon;
export const SekcionIconRounded = BrandOutIconRounded;
export const SekcionLogotype = BrandOutLogotype;

export const PrismIcon = BrandOutIcon;
export const PrismIconRounded = BrandOutIconRounded;
export const PrismLogotype = BrandOutLogotype;

// ==============================
// LinkedIn-styled icons
// ==============================

export function LinkedInStyleIcon({ className = "w-6 h-6", size }: IconProps) {
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
          id="sekcion-icon-gradient" 
          x1="2" 
          y1="2" 
          x2="30" 
          y2="30" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0077B5" />
          <stop offset="1" stopColor="#0A66C2" />
        </linearGradient>
      </defs>
      <path 
        d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z"
        fill="url(#sekcion-icon-gradient)" 
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

export function LinkedInStyleIconSquare({ className = "w-10 h-10" }: IconProps) {
  return (
    <div className={`${className} p-1.5 rounded flex items-center justify-center`}>
      <LinkedInStyleIcon className="w-full h-full" />
    </div>
  );
}

export function LinkedInStyleIconRounded({ className = "w-10 h-10" }: IconProps) {
  return (
    <div className={`${className} bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center p-2`}>
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

// ==============================
// Legacy Aliases (for backward compatibility)
// ==============================

// Twitter style aliases for backward compatibility
export const TwitterIcon = BrandOutIcon;
export const TwitterIconRounded = BrandOutIconRounded;
