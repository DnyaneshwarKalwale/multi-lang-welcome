
import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";

export default function TeamWorkspacePage() {
  const { workspaceName, setWorkspaceName, nextStep } = useOnboarding();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-lg w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">Create a new team workspace</h1>
        <p className="text-lg text-gray-400 mb-12 text-center">
          Workspaces are shared environments where teams can work 
          on content production, strategy and analytics together.
        </p>
        
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-400 mb-2">
            Workspace name
          </label>
          <Input 
            id="workspace-name" 
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Scripe GmbH"
            className="bg-gray-800 border-gray-700 mb-6"
          />
        </div>
        
        <div className="flex justify-center mb-12">
          <ContinueButton 
            onClick={nextStep}
            disabled={!workspaceName.trim()} 
            className="mt-6"
          >
            Create workspace
          </ContinueButton>
        </div>
        
        <ProgressDots total={8} current={1} />
      </div>
    </div>
  );
}
