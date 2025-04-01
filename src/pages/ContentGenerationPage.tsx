import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";
import { onboardingApi } from "@/services/api";
import { useNavigate } from "react-router-dom";

export default function ContentGenerationPage() {
  const { nextStep, saveOnboardingProgress } = useOnboarding();
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  // Mark onboarding as completed in the backend
  const completeOnboarding = async () => {
    try {
      await onboardingApi.completeOnboarding();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const handleSkip = async () => {
    setIsGenerating(true);
    try {
      // Mark onboarding as completed in the backend
      await onboardingApi.completeOnboarding();
      // Navigate to dashboard and replace the route to prevent going back
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!youtubeLink) return;
    
    setIsGenerating(true);
    try {
      // In a real app, you would call an API to generate content
      await new Promise(resolve => setTimeout(resolve, 1500));
      completeOnboarding();
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = () => {
    // This would be implemented with a file upload dialog
    document.getElementById("file-upload")?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would handle the file upload
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        completeOnboarding();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-center">
          You completed your onboarding. 🥳
        </h1>
        
        <p className="text-lg text-gray-400 mb-16 text-center max-w-2xl">
          Before we jump into your new favorite content workspace, 
          let's generate some content.
        </p>

        <h2 className="text-xl font-medium mb-8 text-center">
          Turn any file or YouTube link into personalized content.
        </h2>

        <div className="w-full flex flex-col md:flex-row items-center gap-4 mb-12">
          <div className="relative flex-1 w-full">
            <Input
              id="youtube-link"
              type="text"
              placeholder="Enter YouTube Link"
              className="bg-gray-800 border-gray-700 h-14 pl-12 text-white"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.8 4.8C15.8 4.8 15.6 3.6 15.2 3.2C14.6 2.4 14 2.4 13.6 2.4C11.4 2.2 8 2.2 8 2.2C8 2.2 4.6 2.2 2.4 2.4C2 2.4 1.4 2.4 0.8 3.2C0.4 3.6 0.2 4.8 0.2 4.8C0.2 4.8 0 6.2 0 7.6V8.8C0 10.2 0.2 11.6 0.2 11.6C0.2 11.6 0.4 12.8 0.8 13.2C1.4 14 2.2 14 2.6 14.2C4 14.2 8 14.4 8 14.4C8 14.4 11.4 14.4 13.6 14.2C14 14.2 14.6 14.2 15.2 13.4C15.6 13 15.8 11.8 15.8 11.8C15.8 11.8 16 10.4 16 9V7.8C16 6.2 15.8 4.8 15.8 4.8ZM6.4 10.4V5.6L10.6 8L6.4 10.4Z" fill="#FF0000"/>
              </svg>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!youtubeLink || isGenerating}
            className="bg-purple-600 hover:bg-purple-700 h-14 px-6"
          >
            {isGenerating ? "Generating..." : "Generate content"}
          </Button>

          <div className="text-center text-xl">or</div>

          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <Button 
            onClick={handleUpload}
            disabled={isGenerating}
            className="bg-gray-800 hover:bg-gray-700 h-14 px-6"
          >
            Upload file
          </Button>
        </div>

        <Button 
          variant="link" 
          className="text-gray-400 hover:text-gray-300"
          onClick={handleSkip}
          disabled={isGenerating}
        >
          Skip for now
        </Button>
      </div>

      <div className="fixed bottom-6 flex justify-center w-full">
        <div className="flex gap-2">
          {Array(8).fill(0).map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full ${i === 7 ? 'bg-blue-500' : 'bg-gray-600'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 