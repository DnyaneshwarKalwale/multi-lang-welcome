import React from "react";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type OnboardingStepProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  current: number;
  total: number;
  onBack?: () => void;
};

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  subtitle,
  children,
  current,
  total,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-black flex flex-col p-6 md:p-8">
      <div className="flex items-center justify-between mb-12">
        <ScripeLogotype />
        
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-400 hover:text-white gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>

        {children}

        {/* Progress indicator */}
        <div className="flex items-center gap-1 mt-12">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full ${
                i < current ? "bg-primary w-8" : "bg-gray-700 w-4"
              } transition-all`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep; 