import React from "react";
import { cn } from "@/lib/utils";

interface BrandOutLogoProps {
  variant?: "icon" | "full" | "text";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export const BrandOutLogo: React.FC<BrandOutLogoProps> = ({
  variant = "full",
  size = "md",
  className,
  showText = true,
}) => {
  const sizes = {
    sm: variant === "icon" ? "w-10 h-10" : "w-28",
    md: variant === "icon" ? "w-12 h-12" : "w-36",
    lg: variant === "icon" ? "w-16 h-16" : "w-48",
    xl: variant === "icon" ? "w-20 h-20" : "w-64",
  };

  const logoClasses = cn(sizes[size], className);
  const textClasses = cn(
    "font-bold text-center mt-2",
    {
      "text-sm": size === "sm",
      "text-base": size === "md",
      "text-lg": size === "lg",
      "text-xl": size === "xl",
    }
  );

  if (variant === "icon") {
    return (
      <div className="flex flex-col items-center">
        <svg 
          viewBox="0 0 500 500" 
          className={logoClasses}
          xmlns="http://www.w3.org/2000/svg"
        >
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
        {showText && <span className={textClasses}>BrandOut</span>}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <span className={cn("font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500", logoClasses)}>
        BrandOut
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <svg 
        viewBox="0 0 500 500" 
        className={logoClasses}
        xmlns="http://www.w3.org/2000/svg"
      >
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
      {showText && (
        <span className="mt-3 text-center font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 text-xl">
          BrandOut
        </span>
      )}
    </div>
  );
}; 