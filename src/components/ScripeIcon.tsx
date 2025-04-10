
import React from "react";

interface IconProps {
  className?: string;
}

export const ScripeIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M12.5 11.5C12.5 10.6716 13.1716 10 14 10H26C26.8284 10 27.5 10.6716 27.5 11.5V28.5C27.5 29.3284 26.8284 30 26 30H14C13.1716 30 12.5 29.3284 12.5 28.5V11.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 15H23.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 20H23.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 25H20.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ScripeIconRounded: React.FC<IconProps> = ({ className }) => {
  return (
    <div className={`relative ${className || "h-10 w-10"}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 blur-sm"></div>
      <div className="relative bg-white dark:bg-gray-900 rounded-full p-1.5 flex items-center justify-center">
        <ScripeIcon className="w-full h-full" />
      </div>
    </div>
  );
};

export const SekcionIconRounded = ScripeIconRounded; // Alias
export const PrismIconRounded = ScripeIconRounded; // Alias

export const DekcionIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7 12L12 7L17 12L12 17L7 12Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M12 2L10 4L12 6L14 4L12 2Z"
        fill="currentColor"
      />
      <path
        d="M12 18L10 20L12 22L14 20L12 18Z"
        fill="currentColor"
      />
      <path
        d="M2 12L4 10L6 12L4 14L2 12Z"
        fill="currentColor"
      />
      <path
        d="M18 12L20 10L22 12L20 14L18 12Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const DekcionIconRounded: React.FC<IconProps> = ({ className }) => {
  return (
    <div className={`relative ${className || "h-10 w-10"}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 blur-sm"></div>
      <div className="relative bg-white dark:bg-gray-900 rounded-full p-1.5 flex items-center justify-center">
        <DekcionIcon className="w-full h-full" />
      </div>
    </div>
  );
};

export const DekcionLogotype: React.FC<IconProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className || "h-10"}`}>
      <DekcionIcon className="h-full w-auto" />
      <span className="ml-2 font-bold text-lg text-gray-900 dark:text-white">Dekcion</span>
    </div>
  );
};

export const SekcionLogotype = DekcionLogotype; // Alias

export const LinkedPulseIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <rect x="9" y="13" width="3" height="10" fill="currentColor" />
      <circle cx="10.5" cy="8.5" r="1.5" fill="currentColor" />
      <path
        d="M20 18C20 16.3431 18.6569 15 17 15C15.3431 15 14 16.3431 14 18V23H17V18C17 17.4477 17.4477 17 18 17C18.5523 17 19 17.4477 19 18V23H22V18C22 16.3431 20.6569 15 19 15"
        fill="currentColor"
      />
    </svg>
  );
};
