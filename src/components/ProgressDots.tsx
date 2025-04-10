import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface ProgressDotsProps {
  total: number;
  current: number;
  className?: string;
  color?: "cyan" | "violet" | "gradient" | "default" | "novus";
  size?: "sm" | "md" | "lg";
}

export function ProgressDots({ 
  total, 
  current, 
  className = "",
  color = "default",
  size = "md"
}: ProgressDotsProps) {
  const isMobile = useIsMobile();
  
  // Define colors based on theme
  const activeColors = {
    cyan: "bg-cyan-500",
    violet: "bg-violet-600",
    gradient: "bg-gradient-to-r from-cyan-500 to-violet-600",
    novus: "bg-gradient-to-r from-teal-400 to-cyan-500",
    default: "bg-primary"
  };
  
  const inactiveColors = {
    cyan: "bg-cyan-200 dark:bg-cyan-900/40",
    violet: "bg-violet-200 dark:bg-violet-900/40",
    gradient: "bg-gray-200 dark:bg-gray-700",
    novus: "bg-gray-100 dark:bg-gray-800/60",
    default: "bg-gray-300 dark:bg-gray-700"
  };

  // Define sizes
  const dotSizes = {
    sm: {
      active: isMobile ? "w-2.5 h-2.5" : "w-3 h-3",
      inactive: isMobile ? "w-1.5 h-1.5" : "w-2 h-2",
      pulse: isMobile ? "w-5 h-5" : "w-6 h-6"
    },
    md: {
      active: isMobile ? "w-3 h-3" : "w-3.5 h-3.5",
      inactive: isMobile ? "w-2 h-2" : "w-2.5 h-2.5",
      pulse: isMobile ? "w-6 h-6" : "w-7 h-7"
    },
    lg: {
      active: isMobile ? "w-4 h-4" : "w-5 h-5",
      inactive: isMobile ? "w-2.5 h-2.5" : "w-3 h-3",
      pulse: isMobile ? "w-8 h-8" : "w-10 h-10"
    }
  };
  
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index <= current;
        const isCurrent = index === current;
        const isCompleted = index < current;
        
        return (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3, type: "spring" }}
          >
            <motion.div
              className={cn(
                "rounded-full transition-all duration-300 ease-in-out shadow-sm",
                isActive ? dotSizes[size].active : dotSizes[size].inactive,
                isActive ? activeColors[color] : inactiveColors[color]
              )}
              initial={false}
              animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
            />
            
            {isCurrent && (
              <motion.div
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  dotSizes[size].pulse
                )}
                style={{ 
                  boxShadow: color === "cyan" || color === "novus"
                    ? "0 0 0 rgba(6, 182, 212, 0.7)" 
                    : color === "violet"
                    ? "0 0 0 rgba(124, 58, 237, 0.7)"
                    : color === "gradient"
                    ? "0 0 0 rgba(6, 182, 212, 0.7)"
                    : "0 0 0 rgba(6, 182, 212, 0.7)" 
                }}
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(6, 182, 212, 0)",
                    "0 0 0 6px rgba(6, 182, 212, 0.2)",
                    "0 0 0 rgba(6, 182, 212, 0)",
                  ],
                  scale: [1, 1.05, 1]
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
