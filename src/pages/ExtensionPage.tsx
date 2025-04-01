import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ProgressDots } from "@/components/ProgressDots";
import { CheckCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ExtensionPage() {
  const { nextStep, prevStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full flex flex-col items-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gray-900 rounded-xl flex items-center justify-center">
            <img 
              src="/images/scripe-logo.svg" 
              alt="Scripe Logo" 
              className="w-12 h-12" 
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center">Install the extension</h1>
        <p className="text-lg text-gray-400 mb-10 text-center">
          Supercharge your Scripe experience with our Chrome extension
        </p>

        <div className="w-full space-y-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="pt-1">
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-1">Analytics & Performance Insights</h3>
              <p className="text-gray-400">
                Track your LinkedIn post performance and get data-driven insights to improve your content
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="pt-1">
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-1">Personalized Content Creation</h3>
              <p className="text-gray-400">
                Scripe learns from your past posts to create content that matches your unique voice and style
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-8">
            We use industry-leading encryption to keep your data secure
          </div>
        </div>

        <div className="w-full max-w-md mx-auto mb-10">
          <Button 
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-medium"
            onClick={() => window.open("https://chrome.google.com/webstore/detail/scripe/extension-id", "_blank")}
          >
            Add to Chrome
          </Button>
        </div>

        <Button 
          variant="link" 
          className="text-gray-400 hover:text-gray-300"
          onClick={() => setShowSkipDialog(true)}
        >
          I'll do this later
        </Button>

        <div className="mt-12">
          <ProgressDots total={total} current={current} />
        </div>
      </div>

      <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-amber-500" size={24} />
              <DialogTitle className="text-white text-xl">Scripe is 10x better with the extension</DialogTitle>
            </div>
            <DialogDescription className="text-gray-400 pt-4">
              You can skip this step, but be aware that Scripe will not have access to your posts and you will get worse results.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
            <Button 
              variant="secondary" 
              className="bg-blue-600 hover:bg-blue-700 text-white border-none"
              onClick={() => {
                setShowSkipDialog(false);
                window.open("https://chrome.google.com/webstore/detail/scripe/extension-id", "_blank");
              }}
            >
              I want that extension
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-700 text-amber-400 hover:text-amber-300 hover:bg-gray-800"
              onClick={() => {
                setShowSkipDialog(false);
                nextStep();
              }}
            >
              Let me try without it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 