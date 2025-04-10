
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  children = 'Continue',
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-6 bg-linkedin-blue hover:bg-linkedin-darkBlue text-white font-medium rounded-xl transition-all duration-200"
    >
      <span className="mr-2">{children}</span>
      {loading ? (
        <div className="h-5 w-5 border-2 border-t-transparent animate-spin rounded-full" />
      ) : (
        <ArrowRight className="h-5 w-5" />
      )}
    </Button>
  );
};
