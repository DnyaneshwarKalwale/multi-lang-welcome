import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

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
  children 
}: ContinueButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="gradient"
        rounded="full"
        className={`relative group h-12 px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 overflow-hidden ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <motion.div 
          className="absolute inset-0 bg-white/10" 
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        {children || (
          <div className="flex items-center gap-2 relative z-10">
            <span>Continue</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        )}
      </Button>
    </motion.div>
  );
}
