import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CompletionPage() {
  const navigate = useNavigate();
  const [youtubeLink, setYoutubeLink] = React.useState("");

  const handleGenerateContent = () => {
    // Handle content generation logic
    if (youtubeLink) {
      // Process YouTube link
      console.log("Generating content from:", youtubeLink);
    }
    navigate("/dashboard");
  };

  const handleUploadFile = () => {
    // Handle file upload logic
    console.log("File upload clicked");
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">You completed your onboarding. 🎉</h2>
          <p className="mt-4 text-gray-600">
            Before we jump into your new favorite content workspace,
            let's generate some content.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-center text-lg font-medium">
            Turn any file or YouTube link into personalized content.
          </h3>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter YouTube Link"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleGenerateContent}
              variant="default"
            >
              Generate content
            </Button>
          </div>

          <div className="text-center">
            <span className="text-gray-500">or</span>
          </div>

          <Button
            onClick={handleUploadFile}
            variant="outline"
            className="w-full"
          >
            Upload file
          </Button>

          <button
            onClick={handleSkip}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
} 