import React from "react";
import { ContinueButton } from "@/components/ContinueButton";
import { ProgressDots } from "@/components/ProgressDots";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, User, UserPlus, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TeamSelectionPage() {
  const { workspaceType, setWorkspaceType, nextStep, getStepProgress } = useOnboarding();
  const { t } = useLanguage();
  const { current, total } = getStepProgress();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 -left-[40%] w-[80%] h-[80%] rounded-full bg-indigo-900 blur-[120px]"></div>
        <div className="absolute bottom-0 -right-[40%] w-[80%] h-[80%] rounded-full bg-purple-900 blur-[120px]"></div>
      </div>
      
      <motion.div 
        className="max-w-3xl w-full text-center"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {t('choosePlan')}
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 text-center"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {t('setupWorkspace')}
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className={`bg-gray-900/50 backdrop-blur-sm border-2 ${workspaceType === "team" ? "border-purple-600" : "border-gray-800"} rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-purple-600/60 transition-all`}
            onClick={() => setWorkspaceType("team")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
          </motion.div>
          
          <motion.div 
            className={`bg-gray-900/50 backdrop-blur-sm border-2 ${workspaceType === "personal" ? "border-purple-600" : "border-gray-800"} rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-purple-600/60 transition-all`}
            onClick={() => setWorkspaceType("personal")}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={nextStep}
            disabled={!workspaceType}
          >
            {t('continue')}
          </ContinueButton>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <ProgressDots total={total} current={current} color="purple" />
          <span className="text-xs text-gray-500 mt-3">Step {current + 1} of {total}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
