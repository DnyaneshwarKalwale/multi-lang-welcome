
import React from "react";
import { ScripeIcon } from "@/components/ScripeIcon";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function WelcomePage() {
  const { nextStep } = useOnboarding();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-12 flex justify-center">
          <ScripeIcon size={80} />
        </div>
        
        <h1 className="text-5xl font-bold mb-4">Welcome to Scripe</h1>
        
        <p className="text-lg text-gray-400 mb-2">
          Scripe is the content workspace to share valuable posts everyday.
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Receive tailored, algorithm-optimized LinkedIn posts in &lt;5 minutes.
        </p>
        
        <div className="flex justify-center mb-12">
          <ContinueButton onClick={nextStep} className="mt-6">
            Get started
          </ContinueButton>
        </div>
        
        <ProgressDots total={8} current={0} />
      </div>
    </div>
  );
}
