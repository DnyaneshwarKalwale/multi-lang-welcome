
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProgressDotsProps {
  total: number;
  current: number;
  className?: string;
}

export function ProgressDots({ total, current, className = "" }: ProgressDotsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "rounded-full transition-all duration-300 ease-in-out",
            current === index
              ? isMobile 
                ? "w-2.5 h-2.5 bg-primary" 
                : "w-3 h-3 bg-primary"
              : isMobile 
                ? "w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600" 
                : "w-2 h-2 bg-gray-400 dark:bg-gray-600"
          )}
        />
      ))}
    </div>
  );
}
