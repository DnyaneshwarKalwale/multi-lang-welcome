import React, { useEffect } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  AlignLeft, AlignCenter, ListChecks, 
  FileText, MessageSquareText, Check
} from "lucide-react";

export default function PostFormatPage() {
  const { postFormat, setPostFormat, nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const [postLength, setPostLength] = React.useState(50);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Debug logging for troubleshooting
  useEffect(() => {
    console.log("PostFormatPage rendered with postFormat:", postFormat);
    setIsLoaded(true);
  }, [postFormat]);

  const formatOptions = [
    {
      id: "standard",
      title: "Standard",
      icon: <AlignLeft size={32} className="text-purple-500" />,
      description: "Clean formatting with paragraphs and bullets"
    },
    {
      id: "formatted",
      title: "Formatted",
      icon: <FileText size={32} className="text-blue-500" />,
      description: "Well-formatted text with visually distinct sections"
    },
    {
      id: "chunky",
      title: "Chunky",
      icon: <AlignCenter size={32} className="text-green-500" />,
      description: "Shorter paragraphs with one idea per paragraph"
    },
    {
      id: "short",
      title: "Short",
      icon: <MessageSquareText size={32} className="text-yellow-500" />,
      description: "Concise posts with minimal text"
    },
    {
      id: "emojis",
      title: "Emojis",
      icon: <span className="text-3xl">😀</span>,
      description: "Posts with emojis to increase engagement"
    }
  ];

  // Handle selecting a post format
  const handleSelectFormat = (formatId: string) => {
    console.log("Setting post format to:", formatId);
    setPostFormat(formatId as any);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4">Loading post format options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">Pick your preferred post formatting style</h1>
        <p className="text-lg text-gray-400 mb-10 text-center">
          Scripe is trained on millions of viral posts. When you create posts,
          the best performing posts about the same topics will be used as a reference.
        </p>
        
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2 mb-8">
            {formatOptions.map((format) => (
              <div 
                key={format.id}
                className={`
                  bg-gray-900 rounded-xl p-4 flex flex-col items-center cursor-pointer 
                  transition-all hover:bg-gray-800
                  ${postFormat === format.id ? 'ring-2 ring-purple-600' : 'opacity-80'}
                `}
                onClick={() => handleSelectFormat(format.id)}
              >
                <div className="w-full aspect-square rounded-lg bg-gray-800 mb-3 relative flex items-center justify-center">
                  {format.icon}
                  {postFormat === format.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">{format.title}</span>
                <p className="text-xs text-gray-400 mt-1 text-center">{format.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Post length</span>
              <span className="text-sm text-gray-400">Super long</span>
            </div>
            <Slider 
              defaultValue={[postLength]} 
              max={100} 
              step={1}
              onValueChange={(values) => setPostLength(values[0])}
              className="py-5"
            />
          </div>
          
          <p className="text-sm text-gray-400 text-center">
            Scripe will learn your individual preferences over time.
          </p>
        </div>
        
        <div className="flex justify-between mb-12">
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="border-gray-700 text-gray-400"
          >
            Back
          </Button>
          <ContinueButton 
            onClick={nextStep}
            disabled={!postFormat} 
            className="bg-purple-600 hover:bg-purple-700"
          />
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
}
