
import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Users, User } from "lucide-react";

export default function TeamSelectionPage() {
  const { workspaceType, setWorkspaceType, nextStep } = useOnboarding();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">How would you like to use Scripe?</h1>
        <p className="text-lg text-gray-400 mb-12">We'll setup your workspace accordingly.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div 
            className={`bg-gray-900 border-2 ${workspaceType === "team" ? "border-primary" : "border-gray-800"} rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-primary/60 transition-all`}
            onClick={() => setWorkspaceType("team")}
          >
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <Users size={36} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For my team</h3>
            <p className="text-gray-400 text-sm">One place to create, review and track content for your team.</p>
          </div>
          
          <div 
            className={`bg-gray-900 border-2 ${workspaceType === "personal" ? "border-primary" : "border-gray-800"} rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-primary/60 transition-all`}
            onClick={() => setWorkspaceType("personal")}
          >
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <User size={36} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For personal use</h3>
            <p className="text-gray-400 text-sm">Create content for a single LinkedIn profile.</p>
          </div>
        </div>
        
        <div className="flex justify-center mb-12">
          <ContinueButton 
            onClick={nextStep}
            disabled={!workspaceType} 
          />
        </div>
        
        <ProgressDots total={8} current={1} />
      </div>
    </div>
  );
}
