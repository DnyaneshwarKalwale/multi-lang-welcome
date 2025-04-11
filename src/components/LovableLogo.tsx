import React from 'react';
import { Linkedin } from 'lucide-react';

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

export function LovableLogo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const iconSize = sizeMap.icon[size];
  const textSize = sizeMap.text[size];
  
  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${iconSize} rounded-md bg-primary text-white ${className}`}>
        <Linkedin className="w-[70%] h-[70%]" />
      </div>
    );
  }
  
  // Full logo (icon + text)
  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`flex items-center justify-center ${iconSize} rounded-md bg-primary text-white`}>
          <Linkedin className="w-[70%] h-[70%]" />
        </div>
        <span className={`font-bold text-neutral-black ${textSize}`}>Lovable</span>
      </div>
    );
  }
  
  // Horizontal logo (icon + text side by side)
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className={`flex items-center justify-center ${iconSize} rounded-md bg-primary text-white`}>
        <Linkedin className="w-[70%] h-[70%]" />
      </div>
      <span className={`font-bold text-neutral-black ${textSize}`}>Lovable</span>
    </div>
  );
} 