
import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function PostFrequencyPage() {
  const { postFrequency, setPostFrequency, nextStep } = useOnboarding();

  const frequencyOptions = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-4">How often do you want to post per week?</h1>
        <p className="text-lg text-gray-400 mb-12">
          We recommend posting at least 1-2 times per week.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {frequencyOptions.map((option) => (
            <button
              key={option}
              className={`w-16 h-16 text-xl font-semibold ${
                postFrequency === option
                  ? "bg-primary text-white"
                  : "bg-gray-800 text-white"
              } rounded-lg border-2 ${
                postFrequency === option ? "border-primary" : "border-gray-700"
              } hover:border-primary/60 transition-all`}
              onClick={() => setPostFrequency(option as any)}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div className="flex justify-center mb-12">
          <ContinueButton onClick={nextStep} disabled={!postFrequency} />
        </div>
        
        <ProgressDots total={8} current={5} />
      </div>
    </div>
  );
}
