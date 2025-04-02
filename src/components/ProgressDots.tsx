import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface ProgressDotsProps {
  total: number;
  current: number;
  className?: string;
  color?: "blue" | "purple" | "default";
  variant?: "twitter";
}

export function ProgressDots({ 
  total, 
  current, 
  className = "",
  color = "default",
  variant
}: ProgressDotsProps) {
  const isMobile = useIsMobile();
  
  // If variant is twitter, set color to blue
  const finalColor = variant === "twitter" ? "blue" : color;
  
  // Define colors based on theme
  const activeColors = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    default: "bg-primary"
  };
  
  const inactiveColors = {
    blue: "bg-blue-900/40",
    purple: "bg-purple-900/40",
    default: "bg-gray-400 dark:bg-gray-600"
  };
  
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index <= current;
        const isCurrent = index === current;
        
        return (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <div
              className={cn(
                "rounded-full transition-all duration-300 ease-in-out",
                isActive
                  ? isMobile 
                    ? `w-2.5 h-2.5 ${activeColors[finalColor]}` 
                    : `w-3 h-3 ${activeColors[finalColor]}`
                  : isMobile 
                    ? `w-1.5 h-1.5 ${inactiveColors[finalColor]}` 
                    : `w-2 h-2 ${inactiveColors[finalColor]}`
              )}
            />
            
            {isCurrent && (
              <motion.div
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  isMobile ? "w-4 h-4" : "w-5 h-5"
                )}
                style={{ 
                  boxShadow: finalColor === "blue" 
                    ? "0 0 0 rgba(59, 130, 246, 0.7)" 
                    : finalColor === "purple"
                    ? "0 0 0 rgba(168, 85, 247, 0.7)"
                    : "0 0 0 rgba(124, 58, 237, 0.7)" 
                }}
                animate={{
                  boxShadow: [
                    finalColor === "blue" 
                      ? "0 0 0 rgba(59, 130, 246, 0)" 
                      : finalColor === "purple"
                      ? "0 0 0 rgba(168, 85, 247, 0)"
                      : "0 0 0 rgba(124, 58, 237, 0)",
                    finalColor === "blue" 
                      ? "0 0 0 4px rgba(59, 130, 246, 0.3)" 
                      : finalColor === "purple"
                      ? "0 0 0 4px rgba(168, 85, 247, 0.3)"
                      : "0 0 0 4px rgba(124, 58, 237, 0.3)",
                    finalColor === "blue" 
                      ? "0 0 0 rgba(59, 130, 246, 0)" 
                      : finalColor === "purple"
                      ? "0 0 0 rgba(168, 85, 247, 0)"
                      : "0 0 0 rgba(124, 58, 237, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
