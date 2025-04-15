import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
//backbutton component

interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  variant?: "default" | "subtle";
  absolute?: boolean;
}

export function BackButton({ 
  onClick, 
  disabled = false, 
  className = "",
  children = "Back",
  fullWidth = false,
  variant = "default",
  absolute = false
}: BackButtonProps) {
  const isMobile = useIsMobile();

  // For the absolute positioned back button (like in the header)
  if (absolute) {
    return (
      <button
        className={cn(
          "absolute top-8 left-8 md:top-10 md:left-10 flex items-center text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all hover:scale-105",
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        <ArrowLeft size={18} className="mr-2 transition-transform" />
        <span className="font-medium">{children}</span>
      </button>
    );
  }
  
  // Normal button with consistent styling
  let buttonVariant: "outline" | "ghost" = "outline";
  let textColorClass = "text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30";
  
  if (variant === "subtle") {
    buttonVariant = "ghost";
    textColorClass = "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300";
  }
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={buttonVariant}
      rounded="full"
      className={cn(
        "group px-6 py-5 flex items-center gap-2 transition-all duration-300 border-gray-200 dark:border-gray-700 bg-transparent",
        textColorClass,
        disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
        isMobile || fullWidth ? "w-full" : "",
        className
      )}
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
      <span className="text-base font-medium">{children}</span>
    </Button>
  );
} 
