import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ArrowRight } from "lucide-react";
import confetti from 'canvas-confetti';
import { useEffect } from "react";
import { ProgressDots } from "@/components/ProgressDots";

export default function OnboardingCompletedPage() {
  const navigate = useNavigate();
  const { nextStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  // Trigger confetti when component mounts
  useEffect(() => {
    const triggerConfetti = () => {
      const duration = 5 * 1000;
      const end = Date.now() + duration;

      const runConfetti = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#9333ea', '#3b82f6', '#10b981', '#a855f7']
        });
        
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#9333ea', '#3b82f6', '#10b981', '#a855f7']
        });

        if (Date.now() < end) {
          requestAnimationFrame(runConfetti);
        }
      };

      runConfetti();
    };

    triggerConfetti();
  }, []);

  const handleComplete = () => {
    // Go to content generation page
    nextStep();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex flex-col sm:flex-row items-center justify-center">
            <span className="text-5xl mr-2">🥳</span>
            <span>You completed your onboarding!</span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Before we jump into your new favorite content workspace, let's move to the final step to generate some content.
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <Button 
            onClick={handleComplete}
            className="bg-purple-600 hover:bg-purple-700 flex items-center px-8 py-6 text-lg"
          >
            Proceed to Final Step
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
} 