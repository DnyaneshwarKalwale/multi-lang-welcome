import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export default function CompletionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [youtubeLink, setYoutubeLink] = React.useState("");
  const [isMarkingComplete, setIsMarkingComplete] = React.useState(false);

  // Mark onboarding as completed when the component mounts
  useEffect(() => {
    const markOnboardingComplete = async () => {
      if (user && !user.onboardingCompleted && !isMarkingComplete) {
        try {
          setIsMarkingComplete(true);
          
          // Get token from localStorage
          const token = localStorage.getItem('token');
          if (!token) {
            console.error("No auth token found");
            return;
          }

          // Make API call to mark onboarding as completed
          const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
          await axios.post(
            `${baseApiUrl}/onboarding/complete`, 
            {},
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          
          console.log("Onboarding marked as completed");
        } catch (error) {
          console.error("Failed to mark onboarding as completed:", error);
        } finally {
          setIsMarkingComplete(false);
        }
      }
    };

    markOnboardingComplete();
  }, [user, isMarkingComplete]);

  const handleGenerateContent = async () => {
    // Handle content generation logic
    if (youtubeLink) {
      try {
        // Process YouTube link
        console.log("Generating content from:", youtubeLink);
        
        // Here you would add the API call to generate content from the YouTube link
        // const baseApiUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
        // await axios.post(`${baseApiUrl}/content/generate`, { youtubeLink });
      } catch (error) {
        console.error("Failed to generate content:", error);
      }
    }
    navigate("/dashboard");
  };

  const handleUploadFile = () => {
    // Handle file upload logic
    console.log("File upload clicked");
    navigate("/dashboard");
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="max-w-2xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            You completed your onboarding. <span role="img" aria-label="party face">🥳</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Before we jump into your new favorite content workspace,
            let's generate some content.
          </p>
        </div>

        <div className="space-y-8 pt-8">
          <h2 className="text-xl text-center font-medium">
            Turn any file or YouTube link into personalized content.
          </h2>

          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 flex items-center bg-gray-900 rounded-full overflow-hidden pl-4 pr-2 py-2">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.983 0a.63.63 0 0 0-.444.186L7.152 4.573a.636.636 0 0 0 0 .9.636.636 0 0 0 .9 0l2.99-2.99v6.485a.634.634 0 0 0 .636.636.634.634 0 0 0 .637-.636V2.482l2.99 2.99a.636.636 0 0 0 .9 0 .636.636 0 0 0 0-.9L12.812.186a.63.63 0 0 0-.396-.182.656.656 0 0 0-.433-.004z"/>
                <path d="M19.38 9.13a.634.634 0 0 0-.636.636v5.09c0 .702-.571 1.272-1.273 1.272H2.545a1.273 1.273 0 0 1-1.272-1.273v-5.09a.634.634 0 0 0-.637-.636.634.634 0 0 0-.636.637v5.09a2.545 2.545 0 0 0 2.545 2.544h14.926a2.545 2.545 0 0 0 2.545-2.545v-5.09a.634.634 0 0 0-.636-.636z"/>
              </svg>
              <input
                type="text"
                placeholder="Enter YouTube Link"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-white"
              />
              <Button
                onClick={handleGenerateContent}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
              >
                Generate content
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <span className="text-gray-500">or</span>
            </div>

            <Button
              onClick={handleUploadFile}
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700 rounded-full"
            >
              Upload file
            </Button>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-400 text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-2 pt-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className={`rounded-full w-2 h-2 ${i === 7 ? 'bg-blue-500' : 'bg-gray-600'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
} 