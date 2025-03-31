import React from "react";
import { useNavigate } from "react-router-dom";
import { ScripeLogotype } from "@/components/ScripeIcon";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Building2, User } from "lucide-react";
import OnboardingStep from "@/components/OnboardingStep";

export default function PlanSelectionPage() {
  const navigate = useNavigate();
  const { setCurrentStep, setWorkspaceType } = useOnboarding();
  const { strings } = useLanguage();
  
  const handleTeamSelection = () => {
    setWorkspaceType("team");
    setCurrentStep("style-selection");
    navigate("/onboarding/style-selection");
  };
  
  const handlePersonalSelection = () => {
    setWorkspaceType("personal");
    setCurrentStep("style-selection");
    navigate("/onboarding/style-selection");
  };

  return (
    <OnboardingStep
      title={strings.choosePlan}
      subtitle={strings.setupWorkspace}
      current={2}
      total={8}
      onBack={() => navigate("/onboarding/welcome")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
        <div 
          onClick={handleTeamSelection}
          className="bg-gray-800 border-2 border-gray-700 hover:border-primary rounded-xl p-6 cursor-pointer transition-all"
        >
          <div className="mb-4 bg-gray-700/50 w-12 h-12 flex items-center justify-center rounded-lg">
            <Building2 size={24} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">{strings.forTeam}</h3>
          <p className="text-gray-400 mb-4">{strings.teamDescription}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-gray-300">Workspace for teams</span>
          </div>
        </div>

        <div 
          onClick={handlePersonalSelection}
          className="bg-gray-800 border-2 border-gray-700 hover:border-primary rounded-xl p-6 cursor-pointer transition-all"
        >
          <div className="mb-4 bg-gray-700/50 w-12 h-12 flex items-center justify-center rounded-lg">
            <User size={24} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">{strings.forPersonal}</h3>
          <p className="text-gray-400 mb-4">{strings.personalDescription}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-gray-300">Individual workspace</span>
          </div>
        </div>
      </div>
    </OnboardingStep>
  );
} 