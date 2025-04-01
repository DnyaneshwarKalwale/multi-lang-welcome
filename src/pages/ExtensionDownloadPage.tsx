import React, { useState } from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Chrome, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ExtensionDownloadPage() {
  const { nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);

  const handleDownload = () => {
    // Open Chrome Web Store in a new tab
    window.open("https://chrome.google.com/webstore/category/extensions", "_blank");
    // Continue to next step after initiating download
    nextStep();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-center">Enhance your experience with our Chrome Extension</h1>
        <p className="text-lg text-gray-400 mb-10 text-center max-w-2xl">
          Our Chrome extension helps you turn any file or YouTube link into personalized content with just one click.
        </p>
        
        <div className="relative w-full max-w-md mb-12">
          <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800 flex flex-col items-center">
            <div className="h-32 w-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <Chrome className="h-16 w-16 text-white" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-2">Scripe Chrome Extension</h2>
            <p className="text-gray-400 text-center mb-6">
              Easily convert content from around the web into your personalized content with our AI technology.
            </p>
            
            <ul className="text-sm text-gray-300 space-y-2 mb-8 w-full">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Convert YouTube videos to blog posts</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Extract content from PDFs and documents</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Save articles for later reading</span>
              </li>
            </ul>
            
            <Button 
              onClick={handleDownload} 
              size="lg" 
              className="w-full bg-purple-600 hover:bg-purple-700 mb-4 flex items-center justify-center"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Extension
            </Button>
            
            <button 
              onClick={() => setSkipDialogOpen(true)}
              className="text-gray-400 hover:text-white text-sm"
            >
              I'll do it later
            </button>
          </div>
          
          <div className="absolute -top-4 -right-4 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
            Recommended
          </div>
        </div>
        
        <div className="flex justify-between w-full mb-12">
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="border-gray-700 text-gray-400"
          >
            Back
          </Button>
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
      
      {/* Skip confirmation dialog */}
      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription className="text-gray-400">
              The Chrome extension greatly improves your content creation experience. You can always install it later from your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between sm:space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setSkipDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Go back
            </Button>
            <Button 
              onClick={() => {
                setSkipDialogOpen(false);
                nextStep();
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Skip for now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 