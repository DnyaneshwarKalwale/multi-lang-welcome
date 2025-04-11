import React from 'react';

type LogoVariant = 'icon' | 'full' | 'horizontal';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

const sizeMap = {
  icon: {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  },
  text: {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }
};

export function BrandOutLogo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const iconSize = sizeMap.icon[size];
  const textSize = sizeMap.text[size];
  
  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${iconSize} ${className}`}>
        <BOIcon />
      </div>
    );
  }
  
  // Full logo (icon + text)
  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`flex items-center justify-center ${iconSize}`}>
          <BOIcon />
        </div>
        <span className={`font-bold ${textSize} text-black`}>BRANDOUT</span>
      </div>
    );
  }
  
  // Horizontal logo (icon + text side by side)
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className={`flex items-center justify-center ${iconSize}`}>
        <BOIcon />
      </div>
      <span className={`font-bold ${textSize} text-black`}>BRANDOUT</span>
    </div>
  );
}

// BO Icon component
function BOIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="40" height="40" rx="4" fill="#6B21A8" />
      <path d="M10 12C10 10.8954 10.8954 10 12 10H20C24.4183 10 28 13.5817 28 18C28 22.4183 24.4183 26 20 26H12C10.8954 26 10 25.1046 10 24V12Z" fill="white"/>
      <path d="M16 18C16 16.3431 17.3431 15 19 15H28C29.1046 15 30 15.8954 30 17V29C30 30.1046 29.1046 31 28 31H19C17.3431 31 16 29.6569 16 28V18Z" fill="white"/>
    </svg>
  );
}

// For backward compatibility
export const LovableLogo = BrandOutLogo; 