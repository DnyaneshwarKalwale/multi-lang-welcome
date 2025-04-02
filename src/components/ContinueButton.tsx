import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  variant?: "default" | "twitter" | "cyan";
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
  
  let buttonVariant = "gradient";
  let animation = "lift";
  
  if (variant === "twitter") {
    buttonVariant = "twitter";
    animation = "pulse";
  } else if (variant === "cyan") {
    buttonVariant = "cyan";
    animation = "shine";
  }
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={buttonVariant}
      animation={animation}
      rounded="full"
      className={cn(
        "group px-8 py-6 flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-xl",
        isMobile || fullWidth ? "w-full" : "max-w-md",
        disabled ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]",
        className
      )}
    >
      <span className="text-base font-medium">{children}</span>
      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
    </Button>
  );
}
