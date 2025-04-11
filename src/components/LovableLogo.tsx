import React from 'react';

type LogoVariant = 'icon' | 'full' | 'horizontal';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoFormat = 'png' | 'svg';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  format?: LogoFormat;
}

const sizeMap = {
  icon: {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  },
  text: {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }
};

export function BrandOutLogo({ variant = 'full', size = 'md', className = '', format = 'svg' }: LogoProps) {
  const iconSize = sizeMap.icon[size];
  const textSize = sizeMap.text[size];
  const logoSrc = format === 'svg' ? '/brandout-logo-new.svg' : '/app-logo.png';
  
  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${iconSize} ${className}`}>
        <img 
          src={logoSrc} 
          alt="Logo" 
          className="w-full h-full object-contain" 
        />
      </div>
    );
  }
  
  // Full logo (icon + text)
  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`flex items-center justify-center ${iconSize}`}>
          <img 
            src={logoSrc} 
            alt="Logo" 
            className="w-full h-full object-contain" 
          />
        </div>
        <span className={`font-bold ${textSize} text-black dark:text-white`}>BRANDOUT</span>
      </div>
    );
  }
  
  // Horizontal logo (icon + text side by side)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex items-center justify-center ${iconSize}`}>
        <img 
          src={logoSrc} 
          alt="Logo" 
          className="w-full h-full object-contain" 
        />
      </div>
      <span className={`font-bold ${textSize} text-black dark:text-white`}>BRANDOUT</span>
    </div>
  );
}

// For backward compatibility
export const LovableLogo = BrandOutLogo; 