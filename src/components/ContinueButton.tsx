
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
}

export function ContinueButton({ 
  onClick, 
  disabled = false, 
  className = "",
  children = "Continue",
  fullWidth = false
}: ContinueButtonProps) {
  const isMobile = useIsMobile();
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 rounded-full flex items-center justify-center gap-2",
        isMobile || fullWidth ? "w-full" : "max-w-md",
        className
      )}
    >
      <span>{children}</span>
      <ArrowRight size={16} />
    </Button>
  );
}
