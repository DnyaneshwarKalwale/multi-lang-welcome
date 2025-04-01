import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function ContinueButton({ onClick, disabled = false, children, className }: ContinueButtonProps) {
  const { t } = useLanguage();
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={className || `group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      <span>{children || t('continue')}</span>
      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
    </motion.button>
  );
}
