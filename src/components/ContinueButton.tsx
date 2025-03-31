
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ContinueButton({ 
  onClick, 
  disabled = false, 
  className = "",
  children = "Continue"
}: ContinueButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 rounded-full w-full max-w-md flex items-center justify-center gap-2",
        className
      )}
    >
      <span>{children}</span>
      <ArrowRight size={16} />
    </Button>
  );
}
