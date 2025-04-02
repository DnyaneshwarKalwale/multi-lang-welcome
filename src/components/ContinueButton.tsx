import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  variant?: "default" | "twitter";
}

export function ContinueButton({ 
  onClick, 
  disabled = false, 
  className = "",
  children = "Continue",
  fullWidth = false,
  variant = "default"
}: ContinueButtonProps) {
  const isMobile = useIsMobile();
  
  const buttonVariant = variant === "twitter" ? "twitter" : "gradient";
  const animation = variant === "twitter" ? "twitter-pulse" : "pulse";
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={buttonVariant}
      animation={animation}
      rounded="full"
      className={cn(
        "group px-8 py-6 flex items-center gap-2 transition-all duration-300",
        isMobile || fullWidth ? "w-full" : "max-w-md",
        className
      )}
    >
      <span className="text-base">{children}</span>
      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
    </Button>
  );
}
