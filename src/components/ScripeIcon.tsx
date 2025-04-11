import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  format?: 'png' | 'svg';
}

// ==============================
// Core Icon Components
// ==============================

// Dekcion Icons (primary brand)
export const DekcionIcon = ({ className = "h-14 w-14", format = 'svg' }) => {
  const logoSrc = format === 'svg' ? '/ChatGPT Image Apr 11, 2025, 10_43_22 PM.svg' : '/app-logo.png';
  return (
    <img 
      src={logoSrc} 
      alt="Logo" 
      className={className}
    />
  );
};

// Rounded icon variant for Dekcion
export const DekcionIconRounded = ({ className = "h-14 w-14", format = 'svg' }) => {
  const logoSrc = format === 'svg' ? '/ChatGPT Image Apr 11, 2025, 10_43_22 PM.svg' : '/app-logo.png';
  return (
    <div className="rounded-full overflow-hidden">
      <img 
        src={logoSrc} 
        alt="Logo" 
        className={className}
      />
    </div>
  );
};

// Logotype (icon + text) for Dekcion
export const DekcionLogotype = ({ className = "h-14", format = 'svg' }) => {
  const logoSrc = format === 'svg' ? '/ChatGPT Image Apr 11, 2025, 10_43_22 PM.svg' : '/app-logo.png';
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="Logo" 
        className="h-full w-auto object-contain" 
      />
      <span className="ml-3 font-bold text-xl">Dekcion</span>
    </div>
  );
};

// Sekcion Components (interim brand)
export function SekcionIcon({ className = "h-8 w-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M17.152 36L36 10.048V10H18.528L16.448 13.6L17.152 36Z"
        className="fill-primary-500 dark:fill-primary-400"
      />
      <path
        d="M32.704 36H8L13.312 27.008L32.704 36Z"
        className="fill-violet-500 dark:fill-violet-400"
      />
      <path
        d="M8 9.312V36L17.152 12.448L8 9.312Z"
        className="fill-secondary-500 dark:fill-secondary-400"
      />
      <path
        d="M36 9.312H8L18.528 13.6L36 9.312Z"
        className="fill-blue-500 dark:fill-blue-400"
      />
    </svg>
  );
}

export function SekcionIconRounded({ className = "h-10 w-10", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-200 to-violet-200 dark:from-primary-900 dark:to-violet-900 blur-[4px]"></div>
      <div className="relative bg-white dark:bg-gray-900 rounded-full p-2 flex items-center justify-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M17.152 36L36 10.048V10H18.528L16.448 13.6L17.152 36Z"
            className="fill-primary-500 dark:fill-primary-400"
          />
          <path
            d="M32.704 36H8L13.312 27.008L32.704 36Z"
            className="fill-violet-500 dark:fill-violet-400"
          />
          <path
            d="M8 9.312V36L17.152 12.448L8 9.312Z"
            className="fill-secondary-500 dark:fill-secondary-400"
          />
          <path
            d="M36 9.312H8L18.528 13.6L36 9.312Z"
            className="fill-blue-500 dark:fill-blue-400"
          />
        </svg>
      </div>
    </div>
  );
}

export function SekcionLogotype({ className = "h-10", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="180"
      height="48"
      viewBox="0 0 180 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M60.256 34V15.2H66.848C68.992 15.2 70.72 15.616 72.032 16.448C73.344 17.28 74.304 18.416 74.912 19.856C75.52 21.296 75.824 22.928 75.824 24.752C75.824 26.576 75.52 28.192 74.912 29.6C74.304 31.008 73.344 32.112 72.032 32.912C70.72 33.712 68.992 34.112 66.848 34.112H60.256V34Z"
        className="fill-primary-500 dark:fill-primary-400"
      />
      <path
        d="M77.664 34V15.2H89.84V18.96H82.512V22.848H88.816V26.608H82.512V30.24H89.84V34H77.664ZM92.148 34V15.2H96.996V34H92.148ZM95.828 24.8L100.676 15.2H105.716L100.676 24.656V24.8L106.02 34H100.676L95.828 24.8ZM113.24 34.352C111.768 34.352 110.488 34.048 109.4 33.44C108.312 32.832 107.464 31.984 106.856 30.896C106.248 29.808 105.944 28.544 105.944 27.104V22.096C105.944 20.656 106.248 19.392 106.856 18.304C107.464 17.216 108.312 16.368 109.4 15.76C110.488 15.152 111.768 14.848 113.24 14.848C115.16 14.848 116.728 15.328 117.944 16.288C119.16 17.248 119.928 18.576 120.248 20.272H115.352C115.224 19.728 114.952 19.296 114.536 18.976C114.12 18.656 113.624 18.496 113.048 18.496C112.376 18.496 111.832 18.72 111.416 19.168C111 19.616 110.792 20.224 110.792 20.992V28.208C110.792 28.976 111 29.584 111.416 30.032C111.832 30.48 112.376 30.704 113.048 30.704C113.624 30.704 114.12 30.544 114.536 30.224C114.952 29.904 115.224 29.472 115.352 28.928H120.248C119.928 30.624 119.16 31.952 117.944 32.912C116.728 33.872 115.16 34.352 113.24 34.352ZM121.879 34V15.2H126.727V34H121.879ZM135.326 34.352C133.886 34.352 132.622 34.064 131.534 33.488C130.446 32.912 129.598 32.08 128.99 30.992C128.382 29.904 128.078 28.608 128.078 27.104V22.096C128.078 20.592 128.39 19.296 129.014 18.208C129.638 17.12 130.494 16.288 131.582 15.712C132.67 15.136 133.91 14.848 135.302 14.848C136.694 14.848 137.934 15.136 139.022 15.712C140.11 16.288 140.966 17.12 141.59 18.208C142.214 19.296 142.526 20.592 142.526 22.096V27.104C142.526 28.608 142.214 29.904 141.59 30.992C140.966 32.08 140.11 32.912 139.022 33.488C137.934 34.064 136.686 34.352 135.326 34.352ZM135.326 30.704C136.046 30.704 136.622 30.48 137.054 30.032C137.486 29.584 137.702 28.976 137.702 28.208V20.992C137.702 20.224 137.486 19.616 137.054 19.168C136.622 18.72 136.046 18.496 135.326 18.496C134.606 18.496 134.03 18.72 133.598 19.168C133.166 19.616 132.95 20.224 132.95 20.992V28.208C132.95 28.976 133.166 29.584 133.598 30.032C134.03 30.48 134.606 30.704 135.326 30.704ZM146.016 34V15.2H151.152L155.952 26.8H156.144V15.2H160.944V34H155.808L151.008 22.4H150.816V34H146.016Z"
        className="fill-current text-gray-800 dark:text-gray-200"
      />
      <path
        d="M17.152 40L36 14.048V14H18.528L16.448 17.6L17.152 40Z"
        className="fill-primary-500 dark:fill-primary-400"
      />
      <path
        d="M32.704 40H8L13.312 31.008L32.704 40Z"
        className="fill-violet-500 dark:fill-violet-400"
      />
      <path
        d="M8 13.312V40L17.152 16.448L8 13.312Z"
        className="fill-secondary-500 dark:fill-secondary-400"
      />
      <path
        d="M36 13.312H8L18.528 17.6L36 13.312Z"
        className="fill-blue-500 dark:fill-blue-400"
      />
    </svg>
  );
}

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

// Scripe brand aliases (new -> old)
export { DekcionIcon as ScripeIcon };
export { DekcionIconRounded as ScripeIconRounded };  
export { DekcionLogotype as ScripeLogotype };

// Prism brand aliases (interim brand)
export { DekcionIcon as PrismIcon };
export { DekcionIconRounded as PrismIconRounded };  
export { DekcionLogotype as PrismLogotype };

// Twitter style aliases for backward compatibility
export { LinkedInStyleIcon as TwitterStyleIcon };
export { LinkedInStyleIconSquare as TwitterStyleIconSquare };
export { LinkedInStyleIconRounded as TwitterStyleIconRounded };
