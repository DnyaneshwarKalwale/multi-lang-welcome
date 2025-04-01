import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ArrowRight, FileText, Upload, Youtube } from "lucide-react";
import confetti from 'canvas-confetti';
import { useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
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

  const contentOptions = [
    {
      title: "Upload Files",
      description: "Import PDFs, Docs, or other files to create content",
      icon: <Upload className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/40",
      textColor: "text-blue-500"
    },
    {
      title: "YouTube Videos",
      description: "Convert YouTube videos into blog posts or articles",
      icon: <Youtube className="w-6 h-6 text-red-500" />,
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/40",
      textColor: "text-red-500"
    },
    {
      title: "Draft Content",
      description: "Create content from scratch with AI assistance",
      icon: <FileText className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/40",
      textColor: "text-green-500"
    }
  ];

  const handleComplete = () => {
    // Complete the onboarding and go to dashboard
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
            Before we jump into your new favorite content workspace, let's generate some content.
          </p>
        </div>
        
        <div className="mb-12 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Turn any file or YouTube link into personalized content</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentOptions.map((option, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${option.borderColor} ${option.bgColor} flex flex-col hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="flex items-center mb-3">
                  {option.icon}
                  <h3 className={`font-medium ml-2 ${option.textColor}`}>{option.title}</h3>
                </div>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center mb-12">
          <Button 
            onClick={handleComplete}
            className="bg-purple-600 hover:bg-purple-700 flex items-center px-8 py-6 text-lg"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
} 