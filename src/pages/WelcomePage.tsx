import React from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ProgressDots } from "@/components/ProgressDots";
import { WorkspaceInvitations } from "@/components/WorkspaceInvitations";

export default function WelcomePage() {
  const { nextStep, getStepProgress } = useOnboarding();
  const { current, total } = getStepProgress();

  return (
    <>
      <WorkspaceInvitations />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
        <div className="max-w-3xl w-full text-center">
          <div className="inline-block bg-gray-800 p-4 rounded-2xl mb-8">
            <img 
              src="/images/scripe-logo.svg" 
              alt="Scripe Logo" 
              className="w-16 h-16" 
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to Scripe</h1>
          <p className="text-lg text-gray-400 mb-12">
            Let's set up your Scripe workspace and start creating content that drives results
          </p>
          
          <Button 
            onClick={nextStep}
            className="bg-purple-600 hover:bg-purple-700 mb-16 py-6 px-12 rounded-full text-lg shadow-lg"
          >
            Let's get started
          </Button>
          
          <ProgressDots total={total} current={current} />
        </div>
      </div>
    </>
  );
}
