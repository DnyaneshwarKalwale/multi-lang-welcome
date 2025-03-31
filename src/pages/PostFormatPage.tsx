
import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Slider } from "@/components/ui/slider";

export default function PostFormatPage() {
  const { postFormat, setPostFormat, nextStep } = useOnboarding();
  const [postLength, setPostLength] = React.useState([50]);

  const formatOptions = [
    { id: "standard", label: "Standard", icon: "📄" },
    { id: "formatted", label: "Formatted", icon: "📝" },
    { id: "chunky", label: "Chunky", icon: "📋" },
    { id: "short", label: "Short", icon: "📱" },
    { id: "emojis", label: "Emojis", icon: "😀" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Pick your preferred post formatting style</h1>
        <p className="text-lg text-gray-400 mb-12">
          Scripe is trained on millions of viral posts. When you create posts, 
          the best performing posts about the same topics will be used as a reference.
        </p>
        
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-5 gap-2 mb-8">
            {formatOptions.map((option) => (
              <div 
                key={option.id}
                className={`bg-gray-800 border-2 ${postFormat === option.id ? "border-primary" : "border-transparent"} rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-primary/60 transition-all`}
                onClick={() => setPostFormat(option.id as any)}
              >
                <div className="bg-gray-700 w-12 h-12 rounded-lg mb-2 flex items-center justify-center text-2xl">
                  {option.icon}
                </div>
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Post length</span>
              <span>Super long</span>
            </div>
            <Slider
              value={postLength}
              onValueChange={setPostLength}
              max={100}
              step={1}
              className="[&_[role=slider]]:bg-primary"
            />
          </div>
          
          <p className="text-sm text-gray-400 mt-6">
            Scripe will learn your individual preferences over time.
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <ContinueButton onClick={nextStep} disabled={!postFormat} />
        </div>
        
        <ProgressDots total={8} current={4} />
      </div>
    </div>
  );
}
