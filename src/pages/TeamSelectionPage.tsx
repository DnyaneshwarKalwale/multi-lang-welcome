import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, User, UserPlus, UserCircle } from "lucide-react";

export default function TeamSelectionPage() {
  const { workspaceType, setWorkspaceType, nextStep, getStepProgress } = useOnboarding();
  const { t } = useLanguage();
  const { current, total } = getStepProgress();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">{t('choosePlan')}</h1>
        <p className="text-lg text-gray-400 mb-12">{t('setupWorkspace')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div 
            className={`bg-gray-900 border-2 ${workspaceType === "team" ? "border-purple-600" : "border-gray-800"} rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-purple-600/60 transition-all`}
            onClick={() => setWorkspaceType("team")}
          >
            <div className={`p-6 rounded-full mb-6 ${workspaceType === "team" ? "bg-purple-600/20" : "bg-gray-800"}`}>
              <Users className="w-16 h-16 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t('forTeam')}</h3>
            <p className="text-gray-400 text-sm">
              {t('teamDescription')}
            </p>
            {workspaceType === "team" && (
              <div className="mt-4 w-3 h-3 rounded-full bg-purple-600"></div>
            )}
          </div>
          
          <div 
            className={`bg-gray-900 border-2 ${workspaceType === "personal" ? "border-purple-600" : "border-gray-800"} rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-purple-600/60 transition-all`}
            onClick={() => setWorkspaceType("personal")}
          >
            <div className={`p-6 rounded-full mb-6 ${workspaceType === "personal" ? "bg-purple-600/20" : "bg-gray-800"}`}>
              <UserCircle className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t('forPersonal')}</h3>
            <p className="text-gray-400 text-sm">
              {t('personalDescription')}
            </p>
            {workspaceType === "personal" && (
              <div className="mt-4 w-3 h-3 rounded-full bg-purple-600"></div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mb-12">
          <ContinueButton 
            onClick={nextStep}
            disabled={!workspaceType} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            {t('continue')}
          </ContinueButton>
        </div>
        
        <ProgressDots total={total} current={current} />
      </div>
    </div>
  );
}
