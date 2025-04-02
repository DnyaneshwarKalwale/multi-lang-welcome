import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  variant?: "default" | "twitter";
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
          "absolute top-10 left-10 flex items-center text-gray-400 hover:text-white transition-colors",
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        <ArrowLeft size={16} className="mr-2" />
        {children}
      </button>
    );
  }
  
  // Normal button with consistent styling
  const buttonVariant = variant === "twitter" ? "outline" : "outline";
  const textColor = variant === "twitter" ? "text-gray-400 hover:text-blue-400 hover:border-blue-500/30" : "text-gray-400 hover:text-indigo-400 hover:border-indigo-500/30";
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={buttonVariant}
      rounded="full"
      className={cn(
        "group px-6 py-6 flex items-center gap-2 transition-all duration-300 border-gray-700 bg-transparent",
        textColor,
        isMobile || fullWidth ? "w-full" : "",
        className
      )}
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
      <span className="text-base">{children}</span>
    </Button>
  );
} 